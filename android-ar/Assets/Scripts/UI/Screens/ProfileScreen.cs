using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Networking;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class ProfileScreen : MonoBehaviour
    {
        [Header("Worker Profile")]
        [SerializeField] private TextMeshProUGUI nameText;
        [SerializeField] private TextMeshProUGUI idText;
        [SerializeField] private TextMeshProUGUI sectorText;
        [SerializeField] private TextMeshProUGUI districtText;
        [SerializeField] private TextMeshProUGUI languageText;

        [Header("Training Statistics")]
        [SerializeField] private TextMeshProUGUI modulesCompletedText;
        [SerializeField] private TextMeshProUGUI averageScoreText;
        [SerializeField] private TextMeshProUGUI certificatesCountText;
        [SerializeField] private TextMeshProUGUI trainingHoursText;

        [Header("Actions")]
        [SerializeField] private Button changeLanguageBtn;
        [SerializeField] private Button viewCertificatesBtn;
        [SerializeField] private Button logoutBtn;
        [SerializeField] private Button backBtn;

        private void OnEnable()
        {
            var user = AppManager.Instance != null ? AppManager.Instance.CurrentUser : DemoData.GetDefaultDemoUser();

            if (nameText != null) nameText.text = user.fullName;
            if (idText != null) idText.text = $"ID: {user.workerId}";
            if (sectorText != null) sectorText.text = user.sector;
            if (districtText != null) districtText.text = user.district;

            string lang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            if (languageText != null)
            {
                languageText.text = (lang == "sat") ? "Santali (Ol Chiki)" : (lang == "hi") ? "Hindi (हिंदी)" : "English";
            }

            if (modulesCompletedText != null) modulesCompletedText.text = $"{user.completedModules} / {user.totalModules}";
            if (averageScoreText != null) averageScoreText.text = $"{user.latestScore:F0}%";
            if (certificatesCountText != null) certificatesCountText.text = $"{user.certificatesCount}";
            if (trainingHoursText != null) trainingHoursText.text = "4.5 hrs";
        }

        private void Start()
        {
            if (changeLanguageBtn != null)
                changeLanguageBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("language"));

            if (viewCertificatesBtn != null)
                viewCertificatesBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("certificates"));

            if (logoutBtn != null)
                logoutBtn.onClick.AddListener(() => AuthManager.Instance?.Logout());

            if (backBtn != null)
                backBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("home"));
        }
    }
}
