using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Networking;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class LoginScreen : MonoBehaviour
    {
        [Header("Input Fields")]
        [SerializeField] private TMP_InputField workerIdInput;
        [SerializeField] private TMP_InputField nameInput;
        [SerializeField] private TMP_InputField phoneInput;
        [SerializeField] private TMP_InputField sectorInput;
        [SerializeField] private TMP_InputField districtInput;

        [Header("Action Buttons")]
        [SerializeField] private Button loginBtn;
        [SerializeField] private Button demoModeBtn;
        [SerializeField] private Button changeLanguageBtn;

        private void Start()
        {
            if (loginBtn != null) loginBtn.onClick.AddListener(OnLoginClicked);
            if (demoModeBtn != null) demoModeBtn.onClick.AddListener(OnDemoModeClicked);
            if (changeLanguageBtn != null) changeLanguageBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("language"));
        }

        private void OnLoginClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            string id = (workerIdInput != null && !string.IsNullOrEmpty(workerIdInput.text)) ? workerIdInput.text.Trim() : "DEMO-001";
            string name = (nameInput != null && !string.IsNullOrEmpty(nameInput.text)) ? nameInput.text.Trim() : "Rahul Kumar";
            string phone = (phoneInput != null && !string.IsNullOrEmpty(phoneInput.text)) ? phoneInput.text.Trim() : "+91 94311 28941";
            string sector = (sectorInput != null && !string.IsNullOrEmpty(sectorInput.text)) ? sectorInput.text.Trim() : "Mining";
            string district = (districtInput != null && !string.IsNullOrEmpty(districtInput.text)) ? districtInput.text.Trim() : "Dhanbad";

            var user = new DemoWorkerProfile
            {
                workerId = id,
                fullName = name,
                phone = phone,
                sector = sector,
                district = district,
                company = "Bharat Coking Coal Ltd (BCCL)",
                facility = "Moonidih Underground Deep Mine",
                trainingProgress = 40f,
                completedModules = 2,
                totalModules = 5,
                latestScore = 91f,
                certificatesCount = 1
            };

            AppManager.Instance.SetUser(user);
            AuthManager.Instance?.LoginWithCredentials(id);
            NavigationManager.Instance?.NavigateTo("home");
        }

        private void OnDemoModeClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            var demoUser = DemoData.GetDefaultDemoUser();
            AppManager.Instance.SetUser(demoUser);
            AuthManager.Instance?.LoginWithCredentials(demoUser.workerId);
            NavigationManager.Instance?.NavigateTo("home");
        }
    }
}
