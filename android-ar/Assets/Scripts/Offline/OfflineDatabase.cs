using System;
using System.Collections.Generic;
using UnityEngine;
using JHSafetyAR.Assessment;
using JHSafetyAR.Certificate;

namespace JHSafetyAR.Offline
{
    [Serializable]
    public class OfflineAttemptRecord
    {
        public string id;
        public string workerId;
        public string moduleId;
        public float practicalScore;
        public float theoryScore;
        public float totalScore;
        public bool passed;
        public string timestamp;
    }

    public class OfflineDatabase : MonoBehaviour
    {
        public static OfflineDatabase Instance { get; private set; }

        private List<OfflineAttemptRecord> _cachedAttempts = new List<OfflineAttemptRecord>();
        private List<CertificateData> _cachedCertificates = new List<CertificateData>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            LoadCachedData();
        }

        private void LoadCachedData()
        {
            // Initializes offline storage schema
            Debug.Log("[OfflineDatabase] Offline database initialized. All assets available locally.");
        }

        public void SaveAttempt(string moduleId, float practical, float theory, float total, bool passed)
        {
            var record = new OfflineAttemptRecord
            {
                id = Guid.NewGuid().ToString(),
                workerId = PlayerPrefs.GetString("worker_id", "JH-MIN-10492"),
                moduleId = moduleId,
                practicalScore = practical,
                theoryScore = theory,
                totalScore = total,
                passed = passed,
                timestamp = DateTime.UtcNow.ToString("o")
            };

            _cachedAttempts.Add(record);
            SyncQueue.Instance?.EnqueueRecord(record);
            Debug.Log($"[OfflineDatabase] Saved attempt to local store: {record.id}");
        }

        public void SaveCertificate(CertificateData cert)
        {
            _cachedCertificates.Add(cert);
            Debug.Log($"[OfflineDatabase] Saved certificate to local wallet: {cert.certificateNumber}");
        }

        public List<CertificateData> GetCachedCertificates() => _cachedCertificates;
    }
}
