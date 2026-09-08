using System;
using UnityEngine;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Certificate
{
    [Serializable]
    public class CertificateData
    {
        public string certificateNumber;
        public string workerId;
        public string workerName;
        public string workerCompany;
        public string moduleId;
        public string moduleTitle;
        public float finalScore;
        public string issueDate;
        public string expiryDate;
        public string verificationUrl;
    }

    public static class CertificateGenerator
    {
        public static CertificateData GenerateCertificate(string moduleId, float score)
        {
            var user = AppManager.Instance.CurrentUser;
            string year = DateTime.Now.Year.ToString();
            string randomCode = UnityEngine.Random.Range(10000, 99999).ToString();
            string certNumber = $"JH-SAFE-{year}-BCCL-{randomCode}";

            string moduleName = moduleId == AppConstants.MODULE_GAS
                ? "Toxic Methane & Confined Space Safety"
                : "Underground Mine Fire & Explosion Protocol";

            string verifyUrl = $"https://jh-safety.gov.in/verify/{certNumber}";

            return new CertificateData
            {
                certificateNumber = certNumber,
                workerId = user.workerId,
                workerName = user.fullName,
                workerCompany = user.company,
                moduleId = moduleId,
                moduleTitle = moduleName,
                finalScore = score,
                issueDate = DateTime.Now.ToString("yyyy-MM-dd"),
                expiryDate = DateTime.Now.AddYears(2).ToString("yyyy-MM-dd"),
                verificationUrl = verifyUrl
            };
        }
    }
}
