using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class HomeScreen : MonoBehaviour
    {
        [Header("Profile Header")]
        [SerializeField] private TextMeshProUGUI welcomeText;
        [SerializeField] private TextMeshProUGUI workerIdText;
        [SerializeField] private TextMeshProUGUI progressPercentText;
        [SerializeField] private TextMeshProUGUI modulesCountText;
        [SerializeField] private TextMeshProUGUI latestScoreText;
        [SerializeField] private TextMeshProUGUI certsCountText;
        [SerializeField] private TextMeshProUGUI connectionStatusText;
        [SerializeField] private Image connectionStatusDot;

        [Header("Module Cards")]
        [SerializeField] private Button fireSafetyCardBtn;
        [SerializeField] private Button gasSafetyCardBtn;
        [SerializeField] private Button machineryCardBtn;
        [SerializeField] private Button ppeCardBtn;
        [SerializeField] private Button emergencyCardBtn;

        [Header("Navigation Bar")]
        [SerializeField] private Button navHomeBtn;
        [SerializeField] private Button navTrainingBtn;
        [SerializeField] private Button navDemoVideosBtn;
        [SerializeField] private Button navCertsBtn;
        [SerializeField] private Button navProfileBtn;

        private void OnEnable()
        {
            UpdateDashboardUI();
        }

        private void Start()
        {
            // Active Modules
            if (fireSafetyCardBtn != null)
                fireSafetyCardBtn.onClick.AddListener(() => OpenModule(AppConstants.MODULE_FIRE));

            if (gasSafetyCardBtn != null)
                gasSafetyCardBtn.onClick.AddListener(() => OpenModule(AppConstants.MODULE_GAS));

            // Coming Soon Modules
            if (machineryCardBtn != null)
                machineryCardBtn.onClick.AddListener(() => ShowComingSoon("Machinery Safety"));

            if (ppeCardBtn != null)
                ppeCardBtn.onClick.AddListener(() => ShowComingSoon("PPE & Workplace Safety"));

            if (emergencyCardBtn != null)
                emergencyCardBtn.onClick.AddListener(() => ShowComingSoon("Emergency Response"));

            // Main Navigation Bar
            if (navHomeBtn != null)
                navHomeBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("home"));

            if (navTrainingBtn != null)
                navTrainingBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("module_list"));

            if (navDemoVideosBtn != null)
                navDemoVideosBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("demo_videos"));

            if (navCertsBtn != null)
                navCertsBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("certificates"));

            if (navProfileBtn != null)
                navProfileBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("profile"));
        }

        private void UpdateDashboardUI()
        {
            var user = AppManager.Instance != null ? AppManager.Instance.CurrentUser : DemoData.GetDefaultDemoUser();
            bool isOffline = AppManager.Instance != null && AppManager.Instance.IsOfflineMode;

            if (welcomeText != null) welcomeText.text = $"Welcome, {user.fullName}";
            if (workerIdText != null) workerIdText.text = $"{user.workerId} • {user.district} ({user.sector})";
            if (progressPercentText != null) progressPercentText.text = $"{user.trainingProgress:F0}%";
            if (modulesCountText != null) modulesCountText.text = $"{user.completedModules} / {user.totalModules}";
            if (latestScoreText != null) latestScoreText.text = $"{user.latestScore:F0}%";
            if (certsCountText != null) certsCountText.text = $"{user.certificatesCount}";

            if (connectionStatusText != null)
            {
                connectionStatusText.text = isOffline ? "OFFLINE (CACHED)" : "ONLINE — SYNCHRONIZED";
                connectionStatusText.color = isOffline ? new Color(0.96f, 0.62f, 0.04f) : new Color(0.06f, 0.72f, 0.50f);
            }

            if (connectionStatusDot != null)
            {
                connectionStatusDot.color = isOffline ? new Color(0.96f, 0.62f, 0.04f) : new Color(0.06f, 0.72f, 0.50f);
            }
        }

        private void OpenModule(string moduleId)
        {
            AudioManager.Instance?.PlayButtonClick();
            AppManager.Instance.SelectedModuleId = moduleId;
            // Always enter video learning first as per LEARN -> PRACTICE -> ASSESS -> CERTIFY flow
            NavigationManager.Instance?.NavigateTo("video_learning");
        }

        private void ShowComingSoon(string moduleName)
        {
            AudioManager.Instance?.PlayButtonClick();
            Debug.Log($"[HomeScreen] {moduleName} module is currently marked as COMING SOON in the curriculum.");
        }
    }
}
