using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Video;

namespace JHSafetyAR.UI.Screens
{
    public class VideoLearningScreen : MonoBehaviour
    {
        [Header("Header Info")]
        [SerializeField] private TextMeshProUGUI moduleBadgeText;
        [SerializeField] private Button backBtn;
        [SerializeField] private VideoPlayerController playerController;

        private void OnEnable()
        {
            string modId = AppManager.Instance != null ? AppManager.Instance.SelectedModuleId : "fire_safety_01";
            if (moduleBadgeText != null)
            {
                moduleBadgeText.text = (modId == "gas_leak_02")
                    ? "CARTOON SAFETY LESSON • GAS & CONFINED SPACE"
                    : "CARTOON SAFETY LESSON • MINE FIRE & EXPLOSION";
            }
        }

        private void Start()
        {
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
        }
    }
}
