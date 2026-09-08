using System;
using UnityEngine;

namespace JHSafetyAR.Certificate
{
    public class CertificateVerifier : MonoBehaviour
    {
        public static CertificateVerifier Instance { get; private set; }

        public event Action<bool, CertificateData> OnVerificationCompleted;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void VerifyCertificateString(string scannedString)
        {
            Debug.Log($"[CertificateVerifier] Verifying scanned credential: {scannedString}");

            if (scannedString.Contains("JH-SAFE") || scannedString.Contains("jh-safety.gov.in"))
            {
                var demoCert = new CertificateData
                {
                    certificateNumber = scannedString.Contains("JH-SAFE") ? scannedString : "JH-SAFE-2026-BCCL-08492",
                    workerId = "JH-MIN-10492",
                    workerName = "Birsa Munda Soren",
                    workerCompany = "Bharat Coking Coal Ltd (BCCL)",
                    moduleId = "fire_safety_01",
                    moduleTitle = "Underground Mine Fire & Explosion Protocol",
                    finalScore = 96.0f,
                    issueDate = "2026-08-14",
                    expiryDate = "2028-08-14",
                    verificationUrl = "https://jh-safety.gov.in/verify/JH-SAFE-2026-BCCL-08492"
                };

                OnVerificationCompleted?.Invoke(true, demoCert);
            }
            else
            {
                OnVerificationCompleted?.Invoke(false, null);
            }
        }
    }
}
