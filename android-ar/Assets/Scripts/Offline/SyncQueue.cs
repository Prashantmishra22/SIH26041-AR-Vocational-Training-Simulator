using System.Collections.Generic;
using UnityEngine;

namespace JHSafetyAR.Offline
{
    public class SyncQueue : MonoBehaviour
    {
        public static SyncQueue Instance { get; private set; }

        private Queue<OfflineAttemptRecord> _pendingQueue = new Queue<OfflineAttemptRecord>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void EnqueueRecord(OfflineAttemptRecord record)
        {
            _pendingQueue.Enqueue(record);
            Debug.Log($"[SyncQueue] Record enqueued for sync. Total pending: {_pendingQueue.Count}");
        }

        public int GetPendingCount() => _pendingQueue.Count;

        public void ClearQueue()
        {
            _pendingQueue.Clear();
        }
    }
}
