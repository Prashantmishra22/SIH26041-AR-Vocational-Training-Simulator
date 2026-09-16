package in.gov.jharkhand.safetyar.network;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import org.json.JSONObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Lightweight, zero-external-dependency WebSocket client for Android AR App.
 * Connects directly to FastAPI backend WS endpoint: /ws/worker/{worker_id}
 */
public class WebSocketClient {
    private static final String TAG = "JH_WS_CLIENT";
    private static WebSocketClient sInstance;

    private final ExecutorService mExecutor = Executors.newSingleThreadExecutor();
    private final Handler mMainHandler = new Handler(Looper.getMainLooper());

    private Socket mSocket;
    private OutputStream mOutputStream;
    private InputStream mInputStream;
    private boolean mIsConnected = false;
    private boolean mShouldReconnect = true;
    private String mWorkerId = "W102";
    private Context mContext;

    public interface WebSocketListener {
        void onOpen();
        void onMessage(String text);
        void onClose(int code, String reason);
        void onError(Exception ex);
    }

    private WebSocketListener mListener;

    public static synchronized WebSocketClient getInstance() {
        if (sInstance == null) {
            sInstance = new WebSocketClient();
        }
        return sInstance;
    }

    public void setListener(WebSocketListener listener) {
        this.mListener = listener;
    }

    public synchronized void connect(Context context, String workerId) {
        this.mContext = context.getApplicationContext();
        if (workerId != null && !workerId.isEmpty()) {
            this.mWorkerId = workerId;
        } else {
            this.mWorkerId = ApiConfig.getWorkerId(context);
        }

        mShouldReconnect = true;
        mExecutor.execute(this::doConnect);
    }

    private void doConnect() {
        if (mIsConnected) return;

        try {
            String baseUrl = ApiConfig.getBaseUrl(mContext);
            String host = "10.0.2.2";
            int port = 8000;

            try {
                URI uri = new URI(baseUrl);
                if (uri.getHost() != null) host = uri.getHost();
                if (uri.getPort() != -1) port = uri.getPort();
            } catch (Exception e) {
                Log.w(TAG, "Parsing baseUrl failed, using default " + host + ":" + port);
            }

            String path = "/ws/worker/" + mWorkerId;
            Log.d(TAG, "Connecting WebSocket to " + host + ":" + port + path);

            mSocket = new Socket(host, port);
            mOutputStream = mSocket.getOutputStream();
            mInputStream = mSocket.getInputStream();

            // Perform RFC 6455 WebSocket Handshake
            byte[] nonce = new byte[16];
            new SecureRandom().nextBytes(nonce);
            String wsKey = Base64.encodeToString(nonce, Base64.NO_WRAP);

            String handshake = "GET " + path + " HTTP/1.1\r\n" +
                    "Host: " + host + ":" + port + "\r\n" +
                    "Upgrade: websocket\r\n" +
                    "Connection: Upgrade\r\n" +
                    "Sec-WebSocket-Key: " + wsKey + "\r\n" +
                    "Sec-WebSocket-Version: 13\r\n\r\n";

            mOutputStream.write(handshake.getBytes(StandardCharsets.UTF_8));
            mOutputStream.flush();

            // Read HTTP Handshake response headers
            StringBuilder headerSb = new StringBuilder();
            int b;
            while ((b = mInputStream.read()) != -1) {
                headerSb.append((char) b);
                if (headerSb.toString().endsWith("\r\n\r\n")) {
                    break;
                }
            }

            String responseHeader = headerSb.toString();
            if (!responseHeader.startsWith("HTTP/1.1 101") && !responseHeader.startsWith("HTTP/1.0 101")) {
                Log.e(TAG, "Handshake failed: " + responseHeader);
                closeInternal();
                return;
            }

            mIsConnected = true;
            Log.i(TAG, "WebSocket connected successfully for worker " + mWorkerId);

            mMainHandler.post(() -> {
                if (mListener != null) mListener.onOpen();
            });

            // Send initial login event
            sendEvent("WORKER_LOGIN", null, "Worker " + mWorkerId + " connected from Android AR App", null, null, null, null);

            // Read frame loop
            readLoop();

        } catch (Exception e) {
            Log.w(TAG, "WebSocket connection error: " + e.getMessage());
            closeInternal();
            mMainHandler.post(() -> {
                if (mListener != null) mListener.onError(e);
            });
        }
    }

    private void readLoop() {
        try {
            while (mIsConnected && mInputStream != null) {
                int b0 = mInputStream.read();
                if (b0 == -1) break;

                int opcode = b0 & 0x0F;
                int b1 = mInputStream.read();
                if (b1 == -1) break;

                boolean masked = (b1 & 0x80) != 0;
                long length = b1 & 0x7F;

                if (length == 126) {
                    length = ((mInputStream.read() << 8) | mInputStream.read());
                } else if (length == 127) {
                    length = 0;
                    for (int i = 0; i < 8; i++) {
                        length = (length << 8) | mInputStream.read();
                    }
                }

                byte[] mask = null;
                if (masked) {
                    mask = new byte[4];
                    int readMask = mInputStream.read(mask);
                    if (readMask < 4) break;
                }

                byte[] payload = new byte[(int) length];
                int totalRead = 0;
                while (totalRead < length) {
                    int r = mInputStream.read(payload, totalRead, (int) length - totalRead);
                    if (r == -1) break;
                    totalRead += r;
                }

                if (masked && mask != null) {
                    for (int i = 0; i < payload.length; i++) {
                        payload[i] = (byte) (payload[i] ^ mask[i % 4]);
                    }
                }

                if (opcode == 0x1) { // Text frame
                    String msg = new String(payload, StandardCharsets.UTF_8);
                    Log.d(TAG, "WS Received: " + msg);

                    // Respond to ping
                    if (msg.contains("\"ping\"")) {
                        sendRawText("{\"type\":\"pong\"}");
                    }

                    mMainHandler.post(() -> {
                        if (mListener != null) mListener.onMessage(msg);
                    });
                } else if (opcode == 0x8) { // Close frame
                    Log.i(TAG, "Server closed WebSocket connection");
                    break;
                } else if (opcode == 0x9) { // Ping frame -> send Pong
                    sendPong();
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "WebSocket read loop ended: " + e.getMessage());
        } finally {
            closeInternal();
        }
    }

    public void sendEvent(
            String eventType,
            String module,
            String description,
            Integer step,
            Integer totalSteps,
            Double score,
            JSONObject extraData) {

        mExecutor.execute(() -> {
            try {
                JSONObject json = new JSONObject();
                json.put("event_type", eventType);
                json.put("module", module != null ? module : JSONObject.NULL);
                json.put("description", description != null ? description : "");
                json.put("step", step != null ? step : JSONObject.NULL);
                json.put("total_steps", totalSteps != null ? totalSteps : JSONObject.NULL);
                json.put("score", score != null ? score : JSONObject.NULL);
                json.put("data", extraData != null ? extraData : new JSONObject());

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
                sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                json.put("timestamp", sdf.format(new Date()));

                sendRawText(json.toString());
            } catch (Exception e) {
                Log.e(TAG, "Failed to serialize and send event: " + e.getMessage());
            }
        });
    }

    private synchronized void sendRawText(String text) {
        if (!mIsConnected || mOutputStream == null) return;
        try {
            byte[] rawData = text.getBytes(StandardCharsets.UTF_8);
            byte[] mask = new byte[4];
            new SecureRandom().nextBytes(mask);

            byte[] maskedData = new byte[rawData.length];
            for (int i = 0; i < rawData.length; i++) {
                maskedData[i] = (byte) (rawData[i] ^ mask[i % 4]);
            }

            mOutputStream.write(0x81); // FIN + Text frame

            if (rawData.length <= 125) {
                mOutputStream.write(0x80 | rawData.length); // Masked + len
            } else if (rawData.length <= 65535) {
                mOutputStream.write(0x80 | 126);
                mOutputStream.write((rawData.length >> 8) & 0xFF);
                mOutputStream.write(rawData.length & 0xFF);
            } else {
                mOutputStream.write(0x80 | 127);
                for (int i = 7; i >= 0; i--) {
                    mOutputStream.write((int) ((rawData.length >> (8 * i)) & 0xFF));
                }
            }

            mOutputStream.write(mask);
            mOutputStream.write(maskedData);
            mOutputStream.flush();
        } catch (Exception e) {
            Log.w(TAG, "Failed to send WebSocket frame: " + e.getMessage());
        }
    }

    private synchronized void sendPong() {
        if (!mIsConnected || mOutputStream == null) return;
        try {
            mOutputStream.write(0x8A); // FIN + Pong
            mOutputStream.write(0x80); // Masked, len 0
            byte[] mask = new byte[4];
            new SecureRandom().nextBytes(mask);
            mOutputStream.write(mask);
            mOutputStream.flush();
        } catch (Exception ignored) {}
    }

    private synchronized void closeInternal() {
        mIsConnected = false;
        try {
            if (mOutputStream != null) mOutputStream.close();
            if (mInputStream != null) mInputStream.close();
            if (mSocket != null) mSocket.close();
        } catch (Exception ignored) {}
        mOutputStream = null;
        mInputStream = null;
        mSocket = null;

        mMainHandler.post(() -> {
            if (mListener != null) mListener.onClose(1000, "Disconnected");
        });
    }

    public synchronized void disconnect() {
        mShouldReconnect = false;
        mExecutor.execute(() -> {
            sendEvent("WORKER_LOGOUT", null, "Worker " + mWorkerId + " logged out", null, null, null, null);
            closeInternal();
        });
    }
}
