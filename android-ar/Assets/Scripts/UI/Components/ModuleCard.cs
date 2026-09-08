using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Modules;

namespace JHSafetyAR.UI.Components
{
    public class ModuleCard : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI subtitleText;
        [SerializeField] private TextMeshProUGUI sectorText;
        [SerializeField] private TextMeshProUGUI durationText;
        [SerializeField] private Button actionButton;

        private string _moduleId;

        public void Bind(string moduleId, string title, string subtitle, string sector, int minutes)
        {
            _moduleId = moduleId;
            if (titleText != null) titleText.text = title;
            if (subtitleText != null) subtitleText.text = subtitle;
            if (sectorText != null) sectorText.text = sector.ToUpper();
            if (durationText != null) durationText.text = $"{minutes} mins";

            if (actionButton != null)
            {
                actionButton.onClick.RemoveAllListeners();
                actionButton.onClick.AddListener(OnCardClicked);
            }
        }

        private void OnCardClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            AppManager.Instance.SelectedModuleId = _moduleId;
            NavigationManager.Instance?.NavigateTo("module_intro");
        }
    }
}
