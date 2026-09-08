using UnityEngine;
using TMPro;
using JHSafetyAR.Core;

namespace JHSafetyAR.UI.Components
{
    public class OfflineIndicator : MonoBehaviour
    {
        [SerializeField] private GameObject offlineBadgeRoot;
        [SerializeField] private TextMeshProUGUI statusText;

        private void Start()
        {
            UpdateIndicator();
        }

        public void UpdateIndicator()
        {
            bool isOffline = AppManager.Instance != null && AppManager.Instance.IsOfflineMode;
            if (offlineBadgeRoot != null) offlineBadgeRoot.SetActive(isOffline);
            if (statusText != null)
            {
                statusText.text = isOffline ? "Offline Mode (Underground)" : "Online (Surface Sync)";
            }
        }
    }
}
