using UnityEngine;
using JHSafetyAR.Data;

namespace JHSafetyAR.Core
{
    public class AppManager : MonoBehaviour
    {
        public static AppManager Instance { get; private set; }

        public DemoWorkerProfile CurrentUser { get; private set; }
        public bool IsOfflineMode { get; private set; } = true;
        public string SelectedModuleId { get; set; } = AppConstants.MODULE_FIRE;
        public float LastPracticalScore { get; set; } = 0f;
        public float LastTheoryScore { get; set; } = 0f;
        public float LastTotalScore { get; set; } = 0f;
        public bool LastPassed { get; set; } = false;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeApplication();
        }

        private void InitializeApplication()
        {
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            Application.targetFrameRate = 60;

            // Load saved user or fallback to demo
            CurrentUser = DemoData.GetDefaultDemoUser();
            Debug.Log($"[AppManager] Initialized JH-Safety AR. Active User: {CurrentUser.fullName} ({CurrentUser.workerId})");
        }

        public void SetUser(DemoWorkerProfile profile)
        {
            CurrentUser = profile;
        }

        public void SetOfflineMode(bool offline)
        {
            IsOfflineMode = offline;
        }
    }
}
