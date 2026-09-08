using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace JHSafetyAR.UI.Components
{
    public class ProgressBar : MonoBehaviour
    {
        [SerializeField] private Image fillImage;
        [SerializeField] private TextMeshProUGUI percentText;

        public void SetProgress(float normalizedProgress, string customText = "")
        {
            normalizedProgress = Mathf.Clamp01(normalizedProgress);
            if (fillImage != null)
            {
                fillImage.fillAmount = normalizedProgress;
            }

            if (percentText != null)
            {
                percentText.text = !string.IsNullOrEmpty(customText)
                    ? customText
                    : $"{(int)(normalizedProgress * 100f)}%";
            }
        }
    }
}
