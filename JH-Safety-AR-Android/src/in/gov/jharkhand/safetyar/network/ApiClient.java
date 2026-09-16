package in.gov.jharkhand.safetyar.network;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ApiClient {
    public interface ApiCallback {
        void onSuccess(int statusCode, String response);
        void onError(int statusCode, String errorMessage);
    }

    private static final ExecutorService sExecutor = Executors.newCachedThreadPool();
    private static final Handler sMainHandler = new Handler(Looper.getMainLooper());
    private static final int TIMEOUT_MS = 6000;

    public static void get(Context context, String endpoint, ApiCallback callback) {
        request(context, "GET", endpoint, null, callback);
    }

    public static void post(Context context, String endpoint, JSONObject body, ApiCallback callback) {
        request(context, "POST", endpoint, body != null ? body.toString() : null, callback);
    }

    public static void put(Context context, String endpoint, JSONObject body, ApiCallback callback) {
        request(context, "PUT", endpoint, body != null ? body.toString() : null, callback);
    }

    public static void request(Context context, String method, String endpoint, String payload, ApiCallback callback) {
        String baseUrl = ApiConfig.getBaseUrl(context);
        String token = ApiConfig.getToken(context);

        String fullUrl;
        if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
            fullUrl = endpoint;
        } else {
            String cleanEp = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
            fullUrl = baseUrl + cleanEp;
        }

        sExecutor.execute(new NetworkTask(fullUrl, method, payload, token, callback));
    }

    private static class CallbackRunner implements Runnable {
        private final ApiCallback mCallback;
        private final boolean mIsSuccess;
        private final int mCode;
        private final String mMessage;

        public CallbackRunner(ApiCallback callback, boolean isSuccess, int code, String message) {
            this.mCallback = callback;
            this.mIsSuccess = isSuccess;
            this.mCode = code;
            this.mMessage = message;
        }

        @Override
        public void run() {
            if (mCallback != null) {
                if (mIsSuccess) {
                    mCallback.onSuccess(mCode, mMessage);
                } else {
                    mCallback.onError(mCode, mMessage);
                }
            }
        }
    }

    private static class NetworkTask implements Runnable {
        private final String mUrl;
        private final String mMethod;
        private final String mPayload;
        private final String mToken;
        private final ApiCallback mCallback;

        public NetworkTask(String url, String method, String payload, String token, ApiCallback callback) {
            this.mUrl = url;
            this.mMethod = method;
            this.mPayload = payload;
            this.mToken = token;
            this.mCallback = callback;
        }

        @Override
        public void run() {
            HttpURLConnection conn = null;
            try {
                URL url = new URL(mUrl);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod(mMethod);
                conn.setConnectTimeout(TIMEOUT_MS);
                conn.setReadTimeout(TIMEOUT_MS);
                conn.setRequestProperty("Accept", "application/json");

                if (mToken != null && !mToken.isEmpty()) {
                    conn.setRequestProperty("Authorization", "Bearer " + mToken);
                }

                if (mPayload != null && (mMethod.equals("POST") || mMethod.equals("PUT"))) {
                    conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                    conn.setDoOutput(true);
                    byte[] bytes = mPayload.getBytes(StandardCharsets.UTF_8);
                    OutputStream os = conn.getOutputStream();
                    os.write(bytes);
                    os.flush();
                    os.close();
                }

                int code = conn.getResponseCode();
                InputStream is = (code >= 200 && code < 400) ? conn.getInputStream() : conn.getErrorStream();
                String response = "";
                if (is != null) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                    response = sb.toString();
                }

                boolean success = (code >= 200 && code < 400);
                sMainHandler.post(new CallbackRunner(mCallback, success, code, response));
            } catch (Exception e) {
                String errMsg = (e.getMessage() != null) ? e.getMessage() : "Network error";
                sMainHandler.post(new CallbackRunner(mCallback, false, -1, errMsg));
            } finally {
                if (conn != null) conn.disconnect();
            }
        }
    }
}
