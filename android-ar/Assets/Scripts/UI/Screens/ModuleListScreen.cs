using UnityEngine;
using UnityEngine.UI;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class ModuleListScreen : MonoBehaviour
    {
        [SerializeField] private Button backBtn;
        [SerializeField] private Button fireSafetyCardBtn;
        [SerializeField] private Button gasLeakCardBtn;

        private void Start()
        {
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
            if (fireSafetyCardBtn != null) fireSafetyCardBtn.onClick.AddListener(() => LaunchModule(AppConstants.MODULE_FIRE));
            if (gasLeakCardBtn != null) gasLeakCardBtn.onClick.AddListener(() => LaunchModule(AppConstants.MODULE_GAS));
        }

        private void LaunchModule(string moduleId)
        {
            AudioManager.Instance?.PlayButtonClick();
            AppManager.Instance.SelectedModuleId = moduleId;
            NavigationManager.Instance?.NavigateTo("module_intro");
        }
    }
}
