using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Modules;
using JHSafetyAR.AR;

namespace JHSafetyAR.UI.Screens
{
    public class ARTrainingScreen : MonoBehaviour
    {
        [Header("HUD Header")]
        [SerializeField] private TextMeshProUGUI nowYourTurnBanner;
        [SerializeField] private TextMeshProUGUI stepCounterText;
        [SerializeField] private TextMeshProUGUI hazardAlertText;
        [SerializeField] private TextMeshProUGUI instructionText;
        [SerializeField] private TextMeshProUGUI timerText;

        [Header("Surface & AR Status")]
        [SerializeField] private GameObject planeScanningPanel;
        [SerializeField] private TextMeshProUGUI planeScanningStatusText;
        [SerializeField] private Button manualSurfacePlaceBtn;

        [Header("Action Buttons")]
        [SerializeField] private Button triggerStepActionBtn;
        [SerializeField] private Button exitTrainingBtn;

        private float _timeRemaining = 35f;
        private bool _isTimerRunning = false;

        private void OnEnable()
        {
            if (nowYourTurnBanner != null) nowYourTurnBanner.text = "NOW IT'S YOUR TURN — AR INTERACTIVE SIMULATION";

            if (planeScanningPanel != null) planeScanningPanel.SetActive(true);
            if (planeScanningStatusText != null) planeScanningStatusText.text = "Detecting mine floor geometry...";

            if (ModuleManager.Instance != null)
            {
                ModuleManager.Instance.OnStepChanged += HandleStepChanged;
                ModuleManager.Instance.OnModuleFinished += HandleModuleFinished;
                ModuleManager.Instance.LoadModule(AppManager.Instance.SelectedModuleId);
            }
        }

        private void OnDisable()
        {
            if (ModuleManager.Instance != null)
            {
                ModuleManager.Instance.OnStepChanged -= HandleStepChanged;
                ModuleManager.Instance.OnModuleFinished -= HandleModuleFinished;
            }
        }

        private void Start()
        {
            if (manualSurfacePlaceBtn != null)
                manualSurfacePlaceBtn.onClick.AddListener(OnSurfaceLocked);

            if (triggerStepActionBtn != null)
                triggerStepActionBtn.onClick.AddListener(() => ModuleManager.Instance?.AdvanceStep(true));

            if (exitTrainingBtn != null)
                exitTrainingBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("home"));
        }

        private void OnSurfaceLocked()
        {
            if (planeScanningPanel != null) planeScanningPanel.SetActive(false);
            AudioManager.Instance?.PlaySuccess();
        }

        private void Update()
        {
            if (_isTimerRunning && _timeRemaining > 0)
            {
                _timeRemaining -= Time.deltaTime;
                if (timerText != null) timerText.text = $"{Mathf.CeilToInt(_timeRemaining)}s";
                if (_timeRemaining <= 0)
                {
                    _timeRemaining = 0;
                    ModuleManager.Instance?.AdvanceStep(false);
                }
            }
        }

        private void HandleStepChanged(TaskStepData step, int current, int total)
        {
            if (stepCounterText != null) stepCounterText.text = $"TASK {current} OF {total}";
            if (hazardAlertText != null) hazardAlertText.text = $"HAZARD: {step.hazardType}";

            string currentLang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            string text = step.instruction;
            if (currentLang == "hi" && !string.IsNullOrEmpty(step.instructionHindi)) text = step.instructionHindi;
            if (currentLang == "sat" && !string.IsNullOrEmpty(step.instructionSantali)) text = step.instructionSantali;

            if (instructionText != null) instructionText.text = text;

            _timeRemaining = step.timeLimitSeconds > 0 ? step.timeLimitSeconds : 35f;
            _isTimerRunning = true;
            AudioManager.Instance?.PlayHazardAlarm();
        }

        private void HandleModuleFinished(float practicalScore, bool passed)
        {
            _isTimerRunning = false;
            NavigationManager.Instance?.NavigateTo("assessment");
        }
    }
}
