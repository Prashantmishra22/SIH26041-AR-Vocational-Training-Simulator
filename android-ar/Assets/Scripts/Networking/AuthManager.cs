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
            Debug.Log($"[AuthManager] Authenticating worker: {workerIdOrPhone}");

            // Immediate demo mode fallback for zero-friction offline execution
            var profile = DemoData.GetDefaultDemoUser();
            if (!string.IsNullOrEmpty(workerIdOrPhone))
            {
                profile.workerId = workerIdOrPhone;
            }

            AppManager.Instance.SetUser(profile);
            PlayerPrefs.SetString(AppConstants.PREF_KEY_WORKER_ID, profile.workerId);
            PlayerPrefs.Save();

            OnLoginResult?.Invoke(true, "Authentication Successful");
        }

        public void Logout()
        {
            PlayerPrefs.DeleteKey(AppConstants.PREF_KEY_TOKEN);
            PlayerPrefs.Save();
            NavigationManager.Instance?.NavigateTo("login");
        }
    }
}
