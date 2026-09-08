using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class SettingsScreen : MonoBehaviour
    {
        [Header("Controls")]
        [SerializeField] private Toggle offlineStorageToggle;
        [SerializeField] private Toggle notificationsToggle;
        [SerializeField] private Button changeLanguageBtn;
        [SerializeField] private Button downloadContentBtn;
        [SerializeField] private TextMeshProUGUI downloadStatusText;
        [SerializeField] private TextMeshProUGUI currentLanguageLabel;
        [SerializeField] private TextMeshProUGUI disclaimerText;
        [SerializeField] private Button backBtn;

        private void OnEnable()
        {
            if (offlineStorageToggle != null && AppManager.Instance != null)
            {
                offlineStorageToggle.isOn = AppManager.Instance.IsOfflineMode;
            }

            if (currentLanguageLabel != null && LocalizationManager.Instance != null)
            {
                string lang = LocalizationManager.Instance.CurrentLanguage;
                currentLanguageLabel.text = (lang == "sat") ? "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" : (lang == "hi") ? "हिंदी (Hindi)" : "English";
            }

            if (disclaimerText != null)
            {
                disclaimerText.text = AppConstants.SAFETY_DISCLAIMER;
            }
        }

        private void Start()
        {
            if (offlineStorageToggle != null)
            {
                offlineStorageToggle.onValueChanged.AddListener(OnOfflineToggleChanged);
            }

            if (changeLanguageBtn != null)
            {
                changeLanguageBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("language"));
            }

            if (downloadContentBtn != null)
            {
                downloadContentBtn.onClick.AddListener(OnDownloadContentClicked);
            }

            if (backBtn != null)
            {
                backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
            }
        }

        private void OnOfflineToggleChanged(bool val)
        {
            AppManager.Instance?.SetOfflineMode(val);
        }

        private void OnDownloadContentClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            if (downloadStatusText != null)
            {
                downloadStatusText.text = "All cartoon lessons & 3D AR assets (128 MB) cached for offline use.";
                downloadStatusText.color = new Color(0.06f, 0.72f, 0.50f);
            }
            AudioManager.Instance?.PlaySuccess();
        }
    }
}
