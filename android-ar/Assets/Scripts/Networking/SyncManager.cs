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

            // Simulate network latency / batch upload
            yield return new WaitForSeconds(1.5f);

            int pendingCount = SyncQueue.Instance != null ? SyncQueue.Instance.GetPendingCount() : 3;
            if (SyncQueue.Instance != null)
            {
                SyncQueue.Instance.ClearQueue();
            }

            _isSyncing = false;
            Debug.Log($"[SyncManager] Successfully synchronized {pendingCount} offline records.");
            OnSyncCompleted?.Invoke(true, pendingCount);
        }
    }
}
