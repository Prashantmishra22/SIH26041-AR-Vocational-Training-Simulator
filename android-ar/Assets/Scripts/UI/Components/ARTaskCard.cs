using UnityEngine;
using TMPro;
using JHSafetyAR.Modules;

namespace JHSafetyAR.UI.Components
{
    public class ARTaskCard : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI stepIndexText;
        [SerializeField] private TextMeshProUGUI hazardTitleText;
        [SerializeField] private TextMeshProUGUI instructionText;
        [SerializeField] private TextMeshProUGUI timerText;

        public void BindStep(TaskStepData step, int currentStep, int totalSteps, float secondsLeft)
        {
            if (stepIndexText != null) stepIndexText.text = $"Task {currentStep} of {totalSteps}";
            if (hazardTitleText != null) hazardTitleText.text = step.hazardType;
            if (instructionText != null) instructionText.text = step.instruction;
            if (timerText != null) timerText.text = $"{Mathf.CeilToInt(secondsLeft)}s";
        }
    }
}
