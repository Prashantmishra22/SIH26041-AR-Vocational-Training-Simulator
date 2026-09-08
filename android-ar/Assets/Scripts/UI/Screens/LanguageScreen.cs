using UnityEngine;
using UnityEngine.UI;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class LanguageScreen : MonoBehaviour
    {
        [SerializeField] private Button hindiBtn;
        [SerializeField] private Button santaliBtn;
        [SerializeField] private Button englishBtn;

        private void Start()
        {
            if (hindiBtn != null) hindiBtn.onClick.AddListener(() => SelectLanguage(AppConstants.LANG_HINDI));
            if (santaliBtn != null) santaliBtn.onClick.AddListener(() => SelectLanguage(AppConstants.LANG_SANTALI));
            if (englishBtn != null) englishBtn.onClick.AddListener(() => SelectLanguage(AppConstants.LANG_ENGLISH));
        }

        private void SelectLanguage(string langCode)
        {
            AudioManager.Instance?.PlayButtonClick();
            LocalizationManager.Instance?.SetLanguage(langCode);
            NavigationManager.Instance?.NavigateTo("login");
        }
    }
}
