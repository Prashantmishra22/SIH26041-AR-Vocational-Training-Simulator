using UnityEngine;
using UnityEngine.UI;
using JHSafetyAR.Core;

namespace JHSafetyAR.UI.Components
{
    public class BottomNavBar : MonoBehaviour
    {
        [SerializeField] private Button homeBtn;
        [SerializeField] private Button modulesBtn;
        [SerializeField] private Button certsBtn;
        [SerializeField] private Button qrBtn;
        [SerializeField] private Button profileBtn;

        private void Start()
        {
            if (homeBtn != null) homeBtn.onClick.AddListener(() => Navigate("home"));
            if (modulesBtn != null) modulesBtn.onClick.AddListener(() => Navigate("module_list"));
            if (certsBtn != null) certsBtn.onClick.AddListener(() => Navigate("certificates"));
            if (qrBtn != null) qrBtn.onClick.AddListener(() => Navigate("qr_scanner"));
            if (profileBtn != null) profileBtn.onClick.AddListener(() => Navigate("profile"));
        }

        private void Navigate(string screenId)
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo(screenId);
        }
    }
}
