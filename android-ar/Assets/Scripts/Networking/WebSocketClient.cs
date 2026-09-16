using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;
using Newtonsoft.Json;
using JHSafetyAR.Data;

namespace JHSafetyAR.Networking
{
    public class WebSocketClient : MonoBehaviour
    {
        public static WebSocketClient Instance { get; private set; }

        [Header("Configuration")]
        [SerializeField] private string _serverWsBase = "ws://10.0.2.2:8000/ws/worker"; // 10.0.2.2 for Android emulator or localhost
        [SerializeField] private bool _autoConnectOnAwake = false;

        private ClientWebSocket _webSocket;
        private CancellationTokenSource _cts;
        private string _workerId;
        private bool _isConnected = false;
        private readonly ConcurrentQueue<Action> _mainThreadQueue = new ConcurrentQueue<Action>();

        public bool IsConnected => _isConnected;
        public string WorkerId => _workerId;

        public event Action OnConnected;
        public event Action OnDisconnected;
        public event Action<string> OnMessageReceived;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            if (_autoConnectOnAwake)
            {
                string savedWorkerId = PlayerPrefs.GetString(AppConstants.PREF_KEY_WORKER_ID, "W102");
                Connect(savedWorkerId);
            }
        }

        private void Update()
        {
            // Dispatch any queued actions onto Unity's main thread
            while (_mainThreadQueue.TryDequeue(out var action))
            {
                try
                {
                    action?.Invoke();
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[WebSocketClient] Error executing action on main thread: {ex.Message}");
                }
            }
        }

        public void Connect(string workerId, string customWsUrl = null)
        {
            if (string.IsNullOrEmpty(workerId))
            {
                workerId = PlayerPrefs.GetString(AppConstants.PREF_KEY_WORKER_ID, "W102");
            }

            _workerId = workerId;

            string wsUrl = customWsUrl;
            if (string.IsNullOrEmpty(wsUrl))
            {
                // Derive from API base URL if available
                string apiBase = AppConstants.API_BASE_URL; // e.g., http://localhost:8000 or http://10.0.2.2:8000
                if (!string.IsNullOrEmpty(apiBase))
                {
                    string wsScheme = apiBase.StartsWith("https") ? "wss://" : "ws://";
                    string hostPort = apiBase.Replace("http://", "").Replace("https://", "").TrimEnd('/');
                    wsUrl = $"{wsScheme}{hostPort}/ws/worker/{_workerId}";
                }
                else
                {
                    wsUrl = $"{_serverWsBase}/{_workerId}";
                }
            }

            Debug.Log($"[WebSocketClient] Initiating WebSocket connection to {wsUrl} for worker {_workerId}");
            _ = ConnectAsync(wsUrl);
        }

        private async Task ConnectAsync(string wsUrl)
        {
            try
            {
                _cts?.Cancel();
                _cts?.Dispose();
                _cts = new CancellationTokenSource();

                if (_webSocket != null)
                {
                    if (_webSocket.State == WebSocketState.Open || _webSocket.State == WebSocketState.Connecting)
                    {
                        await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Reconnecting", CancellationToken.None);
                    }
                    _webSocket.Dispose();
                }

                _webSocket = new ClientWebSocket();
                Uri serverUri = new Uri(wsUrl);

                await _webSocket.ConnectAsync(serverUri, _cts.Token);

                _isConnected = true;
                Debug.Log($"[WebSocketClient] Connected successfully to {wsUrl}");

                _mainThreadQueue.Enqueue(() => OnConnected?.Invoke());

                // Send initial LOGIN event
                SendEvent("WORKER_LOGIN", null, $"Worker {_workerId} connected to AR simulation pipeline");

                // Start background receive loop
                _ = ReceiveLoopAsync(_cts.Token);
            }
            catch (Exception ex)
            {
                _isConnected = false;
                Debug.LogWarning($"[WebSocketClient] Connection failed: {ex.Message}");
                _mainThreadQueue.Enqueue(() => OnDisconnected?.Invoke());
            }
        }

        private async Task ReceiveLoopAsync(CancellationToken ct)
        {
            var buffer = new byte[4096];
            while (!ct.IsCancellationRequested && _webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                try
                {
                    var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), ct);
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by server", CancellationToken.None);
                        _isConnected = false;
                        _mainThreadQueue.Enqueue(() => OnDisconnected?.Invoke());
                        break;
                    }

                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                    // Respond to server ping with pong
                    if (message.Contains("\"ping\""))
                    {
                        _ = SendRawAsync("{\"type\":\"pong\"}");
                    }

                    _mainThreadQueue.Enqueue(() => OnMessageReceived?.Invoke(message));
                }
                catch (Exception ex)
                {
                    if (!ct.IsCancellationRequested)
                    {
                        Debug.LogWarning($"[WebSocketClient] Receive error: {ex.Message}");
                    }
                    _isConnected = false;
                    _mainThreadQueue.Enqueue(() => OnDisconnected?.Invoke());
                    break;
                }
            }
        }

        public void SendEvent(
            string eventType,
            string module = null,
            string description = "",
            int? step = null,
            int? totalSteps = null,
            float? score = null,
            Dictionary<string, object> extraData = null)
        {
            if (_webSocket == null || _webSocket.State != WebSocketState.Open)
            {
                Debug.LogWarning($"[WebSocketClient] Cannot send event '{eventType}': WebSocket not connected.");
                return;
            }

            var payload = new Dictionary<string, object>
            {
                { "worker_id", _workerId },
                { "event_type", eventType },
                { "module", module },
                { "description", description },
                { "step", step },
                { "total_steps", totalSteps },
                { "score", score },
                { "data", extraData ?? new Dictionary<string, object>() },
                { "timestamp", DateTime.UtcNow.ToString("o") }
            };

            string json = JsonConvert.SerializeObject(payload);
            _ = SendRawAsync(json);
        }

        public void SendSafetyReport(string hazardType, string severity, string description)
        {
            var data = new Dictionary<string, object>
            {
                { "hazard_type", hazardType },
                { "severity", severity },
                { "location", "Underground Worksite" }
            };

            SendEvent(
                "SAFETY_REPORT_SUBMITTED",
                null,
                $"Safety hazard reported: [{severity}] {hazardType} - {description}",
                null,
                null,
                null,
                data
            );
        }

        public void SendMessage(string recipient, string messageText)
        {
            var data = new Dictionary<string, object>
            {
                { "recipient", recipient },
                { "message", messageText }
            };

            SendEvent(
                "MESSAGE_SENT",
                null,
                $"Message to {recipient}: {messageText}",
                null,
                null,
                null,
                data
            );
        }

        private async Task SendRawAsync(string message)
        {
            if (_webSocket == null || _webSocket.State != WebSocketState.Open) return;

            try
            {
                byte[] bytes = Encoding.UTF8.GetBytes(message);
                await _webSocket.SendAsync(
                    new ArraySegment<byte>(bytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                );
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[WebSocketClient] Send failed: {ex.Message}");
            }
        }

        public void Disconnect()
        {
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                SendEvent("WORKER_LOGOUT", null, $"Worker {_workerId} disconnected");
                _cts?.Cancel();
                _ = _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Worker logout", CancellationToken.None);
            }
            _isConnected = false;
        }

        private void OnDestroy()
        {
            Disconnect();
            _cts?.Dispose();
            _webSocket?.Dispose();
        }

        private void OnApplicationQuit()
        {
            Disconnect();
        }
    }
}
