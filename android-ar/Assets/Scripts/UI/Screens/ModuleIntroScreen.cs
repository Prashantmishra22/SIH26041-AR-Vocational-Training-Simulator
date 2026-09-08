using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class ModuleIntroScreen : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI moduleTitleText;
        [SerializeField] private TextMeshProUGUI standardText;
        [SerializeField] private TextMeshProUGUI descriptionText;
        [SerializeField] private Button startARBtn;
        [SerializeField] private Button backBtn;

        private void OnEnable()
        {
            string modId = AppManager.Instance != null ? AppManager.Instance.SelectedModuleId : AppConstants.MODULE_FIRE;
            if (modId == AppConstants.MODULE_GAS)
            {
                if (moduleTitleText != null) moduleTitleText.text = "Toxic Methane & CO Gas Detection";
                if (standardText != null) standardText.text = "DGMS Safety Circular No. 4/1998";
                if (descriptionText != null) descriptionText.text = "5-step practical AR simulation for sensor zero calibration, roof cavity probing, and blind sump oxygen testing.";
            }
            else
            {
                if (moduleTitleText != null) moduleTitleText.text = "Underground Mine Fire & Explosion";
                if (standardText != null) standardText.text = "DGMS Coal Mines Reg. 2017 (Reg 133/134)";
                if (descriptionText != null) descriptionText.text = "6-step practical AR simulation for coal hotspot scanning, klaxon alert, SCSR donning, and DCP extinguisher PASS protocol.";
            }
        }

        private void Start()
        {
            if (startARBtn != null) startARBtn.onClick.AddListener(OnStartARClicked);
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
        }

        private void OnStartARClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo("ar_training");
        }
    }
}
