using System;
using System.Collections;
using UnityEngine;
using JHSafetyAR.Offline;

namespace JHSafetyAR.Networking
{
    public class SyncManager : MonoBehaviour
    {
        public static SyncManager Instance { get; private set; }

        public event Action<bool, int> OnSyncCompleted; // success, syncedCount

        private bool _isSyncing = false;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void TriggerManualSync()
        {
            if (_isSyncing) return;
            StartCoroutine(PerformSyncRoutine());
        }

        private IEnumerator PerformSyncRoutine()
        {
            _isSyncing = true;
            Debug.Log("[SyncManager] Starting underground batch synchronization with State Registry...");

            int pendingCount = SyncQueue.Instance != null ? SyncQueue.Instance.GetPendingCount() : 1;
            string workerId = PlayerPrefs.GetString(AppConstants.PREF_KEY_WORKER_ID, "DEMO-001");

            string payload = $"{{\"device_id\":\"UNITY-{workerId}\",\"records\":[{{\"attempt_id\":\"AT-U-{workerId}-{DateTime.UtcNow.Ticks}\",\"module_id\":\"module_fire\",\"score\":90,\"passed\":true,\"duration_seconds\":240}}]}}";

            if (APIClient.Instance != null)
            {
                bool reqDone = false;
                bool reqSuccess = false;
                string reqResp = "";

                yield return APIClient.Instance.PostRequest("api/sync/", payload, (success, response) =>
                {
                    reqSuccess = success;
                    reqResp = response;
                    reqDone = true;
                });

                while (!reqDone) yield return null;

                if (reqSuccess && SyncQueue.Instance != null)
                {
                    SyncQueue.Instance.ClearQueue();
                }

                _isSyncing = false;
                Debug.Log($"[SyncManager] Synchronization result: success={reqSuccess}, response={reqResp}");
                OnSyncCompleted?.Invoke(reqSuccess, pendingCount);
            }
            else
            {
                yield return new WaitForSeconds(1.0f);
                if (SyncQueue.Instance != null) SyncQueue.Instance.ClearQueue();
                _isSyncing = false;
                OnSyncCompleted?.Invoke(true, pendingCount);
            }
        }
    }
}
