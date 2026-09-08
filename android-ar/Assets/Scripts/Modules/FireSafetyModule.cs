using UnityEngine;
using JHSafetyAR.AR;
using JHSafetyAR.Core;

namespace JHSafetyAR.Modules
{
    public class FireSafetyModule : MonoBehaviour
    {
        [Header("AR Virtual Interactive Objects")]
        [SerializeField] private GameObject fireHazardVisual;       // Task 1: Fire hazard
        [SerializeField] private GameObject emergencyExitVisual;     // Task 2: Correct exit
        [SerializeField] private GameObject wrongExitVisual;        // Task 2: Incorrect return airway exit
        [SerializeField] private GameObject dcpExtinguisherVisual;  // Task 3: Correct DCP extinguisher
        [SerializeField] private GameObject waterBucketVisual;      // Task 3: Incorrect extinguisher for electrical fire
        [SerializeField] private GameObject evacuationRouteVisual;   // Task 4: Evacuation lifeline route
        [SerializeField] private GameObject assemblyPointVisual;     // Task 5: Assembly point marker

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

            // TASK 1: Identify fire hazard
            if (currentStep == 1 && (objName.Contains("fire") || objName.Contains("hazard") || objName.Contains("hotspot")))
            {
                isCorrectAction = true;
            }
            // TASK 2: Identify correct emergency exit
            else if (currentStep == 2 && objName.Contains("exit") && !objName.Contains("wrong"))
            {
                isCorrectAction = true;
            }
            // TASK 3: Select appropriate extinguisher for scenario (DCP)
            else if (currentStep == 3 && (objName.Contains("dcp") || objName.Contains("extinguisher")) && !objName.Contains("water"))
            {
                isCorrectAction = true;
            }
            // TASK 4: Follow AR evacuation route
            else if (currentStep == 4 && (objName.Contains("route") || objName.Contains("lifeline") || objName.Contains("evac")))
            {
                isCorrectAction = true;
            }
            // TASK 5: Reach assembly point
            else if (currentStep == 5 && (objName.Contains("assembly") || objName.Contains("point") || objName.Contains("safe")))
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
