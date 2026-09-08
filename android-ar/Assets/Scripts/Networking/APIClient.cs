using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using JHSafetyAR.Data;

namespace JHSafetyAR.Networking
{
    public class APIClient : MonoBehaviour
    {
        public static APIClient Instance { get; private set; }

        private string _baseUrl = AppConstants.API_BASE_URL;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public IEnumerator GetRequest(string endpoint, Action<bool, string> callback)
        {
            string url = $"{_baseUrl}/{endpoint}";
            using (UnityWebRequest req = UnityWebRequest.Get(url))
            {
                string token = PlayerPrefs.GetString(AppConstants.PREF_KEY_TOKEN, "");
                if (!string.IsNullOrEmpty(token))
                {
                    req.SetRequestHeader("Authorization", $"Bearer {token}");
                }

                yield return req.SendWebRequest();

                bool success = (req.result == UnityWebRequest.Result.Success);
                string responseText = success ? req.downloadHandler.text : req.error;
                callback?.Invoke(success, responseText);
            }
        }

        public IEnumerator PostRequest(string endpoint, string jsonPayload, Action<bool, string> callback)
        {
            string url = $"{_baseUrl}/{endpoint}";
            using (UnityWebRequest req = new UnityWebRequest(url, "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");

                string token = PlayerPrefs.GetString(AppConstants.PREF_KEY_TOKEN, "");
                if (!string.IsNullOrEmpty(token))
                {
                    req.SetRequestHeader("Authorization", $"Bearer {token}");
                }

                yield return req.SendWebRequest();

                bool success = (req.result == UnityWebRequest.Result.Success);
                string responseText = success ? req.downloadHandler.text : req.error;
                callback?.Invoke(success, responseText);
            }
        }
    }
}
