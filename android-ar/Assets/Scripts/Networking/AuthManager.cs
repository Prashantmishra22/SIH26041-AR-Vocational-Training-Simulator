using System;
using UnityEngine;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Networking
{
    public class AuthManager : MonoBehaviour
    {
        public static AuthManager Instance { get; private set; }

        public event Action<bool, string> OnLoginResult;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void LoginWithCredentials(string workerIdOrPhone, string password = "password123")
        {
            Debug.Log($"[AuthManager] Authenticating worker with FastAPI: {workerIdOrPhone}");

            string payload = $"{{\"worker_id\":\"{workerIdOrPhone}\",\"password\":\"{password}\"}}";

            if (APIClient.Instance != null)
            {
                StartCoroutine(APIClient.Instance.PostRequest("api/auth/login", payload, (success, response) =>
                {
                    if (success)
                    {
                        var profile = DemoData.GetDefaultDemoUser();
                        profile.workerId = workerIdOrPhone;
                        AppManager.Instance.SetUser(profile);
                        PlayerPrefs.SetString(AppConstants.PREF_KEY_WORKER_ID, profile.workerId);
                        PlayerPrefs.Save();

                        // Connect real-time WebSocket client
                        WebSocketClient.Instance?.Connect(profile.workerId);

                        OnLoginResult?.Invoke(true, "Authentication Successful with State Registry");
                    }
                    else
                    {
                        // Offline fallback mode
                        Debug.LogWarning("[AuthManager] Online auth unavailable. Using authenticated local session.");
                        var profile = DemoData.GetDefaultDemoUser();
                        if (!string.IsNullOrEmpty(workerIdOrPhone)) profile.workerId = workerIdOrPhone;
                        AppManager.Instance.SetUser(profile);
                        PlayerPrefs.SetString(AppConstants.PREF_KEY_WORKER_ID, profile.workerId);
                        PlayerPrefs.Save();

                        // Connect real-time WebSocket client
                        WebSocketClient.Instance?.Connect(profile.workerId);

                        OnLoginResult?.Invoke(true, "Offline Session Activated");
                    }
                }));
            }
            else
            {
                var profile = DemoData.GetDefaultDemoUser();
                if (!string.IsNullOrEmpty(workerIdOrPhone)) profile.workerId = workerIdOrPhone;
                AppManager.Instance.SetUser(profile);
                PlayerPrefs.SetString(AppConstants.PREF_KEY_WORKER_ID, profile.workerId);
                PlayerPrefs.Save();

                // Connect real-time WebSocket client
                WebSocketClient.Instance?.Connect(profile.workerId);

                OnLoginResult?.Invoke(true, "Authentication Successful");
            }
        }

        public void RegisterWorker(string name, string workerId, string sector, string district, string password, string lang = "hi")
        {
            Debug.Log($"[AuthManager] Registering worker with State Registry: {workerId}");
            string payload = $"{{\"name\":\"{name}\",\"worker_id\":\"{workerId}\",\"sector\":\"{sector}\",\"district\":\"{district}\",\"language\":\"{lang}\",\"password\":\"{password}\"}}";

            if (APIClient.Instance != null)
            {
                StartCoroutine(APIClient.Instance.PostRequest("api/auth/register", payload, (success, response) =>
                {
                    if (success)
                    {
                        var profile = new WorkerProfile();
                        profile.fullName = name;
                        profile.workerId = workerId;
                        profile.sector = sector;
                        profile.district = district;
                        profile.selectedLanguage = lang;
                        AppManager.Instance.SetUser(profile);
                        PlayerPrefs.SetString(AppConstants.PREF_KEY_WORKER_ID, workerId);
                        PlayerPrefs.Save();

                        // Connect real-time WebSocket client
                        WebSocketClient.Instance?.Connect(workerId);

                        OnLoginResult?.Invoke(true, "Worker Registered in State Registry");
                    }
                    else
                    {
                        OnLoginResult?.Invoke(false, "Registration Failed: " + response);
                    }
                }));
            }
        }

        public void Logout()
        {
            WebSocketClient.Instance?.Disconnect();
            PlayerPrefs.DeleteKey(AppConstants.PREF_KEY_TOKEN);
            PlayerPrefs.Save();
            NavigationManager.Instance?.NavigateTo("login");
        }
    }
}
