using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Networking;
using JHSafetyAR.Offline;

namespace JHSafetyAR.UI.Screens
{
    public class OfflineSyncScreen : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI pendingCountText;
        [SerializeField] private TextMeshProUGUI syncStatusText;
        [SerializeField] private Button triggerSyncBtn;
        [SerializeField] private Button backBtn;

        private void OnEnable()
        {
            UpdatePendingUI();
            if (SyncManager.Instance != null)
            {
                SyncManager.Instance.OnSyncCompleted += HandleSyncCompleted;
            }
        }

        private void OnDisable()
        {
            if (SyncManager.Instance != null)
            {
                SyncManager.Instance.OnSyncCompleted -= HandleSyncCompleted;
            }
        }

        private void Start()
        {
            if (triggerSyncBtn != null) triggerSyncBtn.onClick.AddListener(OnSyncClicked);
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
        }

        private void UpdatePendingUI()
        {
            int pending = SyncQueue.Instance != null ? SyncQueue.Instance.GetPendingCount() : 0;
            if (pendingCountText != null) pendingCountText.text = $"{pending} Records Pending Upload";
            if (syncStatusText != null) syncStatusText.text = "Underground records saved securely in local SQLite store.";
        }

        private void OnSyncClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            if (syncStatusText != null) syncStatusText.text = "Connecting to State Portal and syncing records...";
            SyncManager.Instance?.TriggerManualSync();
        }

        private void HandleSyncCompleted(bool success, int count)
        {
            if (pendingCountText != null) pendingCountText.text = "0 Records Pending (Fully Synced)";
            if (syncStatusText != null) syncStatusText.text = $"Successfully synchronized {count} records with DGMS Central Portal.";
            AudioManager.Instance?.PlaySuccess();
        }
    }
}
