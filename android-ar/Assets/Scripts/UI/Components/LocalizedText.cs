using UnityEngine;
using TMPro;
using JHSafetyAR.Core;

namespace JHSafetyAR.UI.Components
{
    [RequireComponent(typeof(TextMeshProUGUI))]
    public class LocalizedText : MonoBehaviour
    {
        [SerializeField] private string localizationKey;
        [SerializeField] private string fallbackText;

        private TextMeshProUGUI _tmpText;

        private void Awake()
        {
            _tmpText = GetComponent<TextMeshProUGUI>();
        }

        private void Start()
        {
            if (LocalizationManager.Instance != null)
            {
                LocalizationManager.Instance.OnLanguageChanged += UpdateText;
            }
            UpdateText();
        }

        private void OnDestroy()
        {
            if (LocalizationManager.Instance != null)
            {
                LocalizationManager.Instance.OnLanguageChanged -= UpdateText;
            }
        }

        public void SetKey(string key, string fallback = "")
        {
            localizationKey = key;
            if (!string.IsNullOrEmpty(fallback)) fallbackText = fallback;
            UpdateText();
        }

        public void UpdateText()
        {
            if (_tmpText == null || string.IsNullOrEmpty(localizationKey)) return;

            if (LocalizationManager.Instance != null)
            {
                _tmpText.text = LocalizationManager.Instance.GetText(localizationKey, fallbackText);
            }
            else if (!string.IsNullOrEmpty(fallbackText))
            {
                _tmpText.text = fallbackText;
            }
        }
    }
}
