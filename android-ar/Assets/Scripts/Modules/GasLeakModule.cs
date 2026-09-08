using UnityEngine;
using JHSafetyAR.AR;
using JHSafetyAR.Core;

namespace JHSafetyAR.Modules
{
    public class GasLeakModule : MonoBehaviour
    {
        [Header("AR Virtual Interactive Objects")]
        [SerializeField] private GameObject gasHazardPlumeVisual;    // Task 1: Identify gas hazard
        [SerializeField] private GameObject ppeRespiratorVisual;     // Task 2: Select PPE
        [SerializeField] private GameObject multiGasDetectorVisual;  // Task 3: Identify gas detector
        [SerializeField] private GameObject buddyAttendantVisual;    // Task 4: Select buddy / standby attendant
        [SerializeField] private GameObject venturiVentilationVisual;// Task 5: Arrange safe procedure / ventilation

        [Header("Feedback UI Elements")]
        [SerializeField] private GameObject correctFeedbackBanner;
        [SerializeField] private GameObject incorrectFeedbackBanner;

        private void Start()
        {
            if (ARInteractionManager.Instance != null)
            {
                ARInteractionManager.Instance.OnObjectSelected += HandleARObjectInteraction;
            }
        }

        private void OnDestroy()
        {
            if (ARInteractionManager.Instance != null)
            {
                ARInteractionManager.Instance.OnObjectSelected -= HandleARObjectInteraction;
            }
        }

        private void HandleARObjectInteraction(GameObject selected)
        {
            if (selected == null) return;
            string objName = selected.name.ToLower();
            int currentStep = ModuleManager.Instance != null ? ModuleManager.Instance.CurrentStepIndex + 1 : 1;

            bool isCorrectAction = false;

            // TASK 1: Identify gas hazard
            if (currentStep == 1 && (objName.Contains("gas") || objName.Contains("hazard") || objName.Contains("plume") || objName.Contains("methane")))
            {
                isCorrectAction = true;
            }
            // TASK 2: Select required PPE
            else if (currentStep == 2 && (objName.Contains("ppe") || objName.Contains("respirator") || objName.Contains("mask")))
            {
                isCorrectAction = true;
            }
            // TASK 3: Identify multi-gas detector
            else if (currentStep == 3 && (objName.Contains("detector") || objName.Contains("probe") || objName.Contains("sensor")))
            {
                isCorrectAction = true;
            }
            // TASK 4: Select buddy / attendant
            else if (currentStep == 4 && (objName.Contains("buddy") || objName.Contains("attendant") || objName.Contains("worker")))
            {
                isCorrectAction = true;
            }
            // TASK 5: Arrange safe entry procedure & ventilation
            else if (currentStep == 5 && (objName.Contains("venturi") || objName.Contains("ventilation") || objName.Contains("procedure") || objName.Contains("barricade")))
            {
                isCorrectAction = true;
            }

            ShowFeedback(isCorrectAction);
            ModuleManager.Instance?.AdvanceStep(isCorrectAction);
        }

        private void ShowFeedback(bool correct)
        {
            if (correct)
            {
                if (correctFeedbackBanner != null)
                {
                    correctFeedbackBanner.SetActive(true);
                    CancelInvoke(nameof(HideBanners));
                    Invoke(nameof(HideBanners), 1.5f);
                }
                AudioManager.Instance?.PlaySuccess();
            }
            else
            {
                if (incorrectFeedbackBanner != null)
                {
                    incorrectFeedbackBanner.SetActive(true);
                    CancelInvoke(nameof(HideBanners));
                    Invoke(nameof(HideBanners), 1.5f);
                }
                AudioManager.Instance?.PlayError();
            }
        }

        private void HideBanners()
        {
            if (correctFeedbackBanner != null) correctFeedbackBanner.SetActive(false);
            if (incorrectFeedbackBanner != null) incorrectFeedbackBanner.SetActive(false);
        }
    }
}
