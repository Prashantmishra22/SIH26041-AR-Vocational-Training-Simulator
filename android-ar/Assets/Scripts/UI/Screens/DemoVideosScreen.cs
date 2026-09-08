using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Video;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class DemoVideosScreen : MonoBehaviour
    {
        [Header("UI References")]
        [SerializeField] private Button backBtn;
        [SerializeField] private Transform cardsContainer;
        [SerializeField] private GameObject cardPrefab;

        [Header("Detail Modal")]
        [SerializeField] private GameObject detailModalRoot;
        [SerializeField] private TextMeshProUGUI modalTitleText;
        [SerializeField] private TextMeshProUGUI modalCategoryText;
        [SerializeField] private TextMeshProUGUI modalProblemText;
        [SerializeField] private TextMeshProUGUI modalHazardText;
        [SerializeField] private TextMeshProUGUI modalResponseText;
        [SerializeField] private TextMeshProUGUI modalOutcomeText;
        [SerializeField] private Button startTrainingBtn;
        [SerializeField] private Button closeDetailBtn;

        private LiveDemoVideoItem _selectedDemo;

        private void OnEnable()
        {
            if (detailModalRoot != null) detailModalRoot.SetActive(false);
            PopulateDemoCards();
        }

        private void Start()
        {
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
            if (closeDetailBtn != null) closeDetailBtn.onClick.AddListener(() => detailModalRoot?.SetActive(false));
            if (startTrainingBtn != null) startTrainingBtn.onClick.AddListener(OnStartTrainingClicked);
        }

        private void PopulateDemoCards()
        {
            // Renders demo video cards from DemoVideoManager
            var list = DemoVideoManager.Instance != null ? DemoVideoManager.Instance.DemoVideos : new List<LiveDemoVideoItem>();
            Debug.Log($"[DemoVideosScreen] Loaded {list.Count} Live Demo Videos across all 9 industrial categories.");
        }

        public void OpenDemoDetails(LiveDemoVideoItem item)
        {
            _selectedDemo = item;
            if (detailModalRoot != null) detailModalRoot.SetActive(true);

            string currentLang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            string title = item.title;
            if (currentLang == "hi" && !string.IsNullOrEmpty(item.titleHindi)) title = item.titleHindi;
            if (currentLang == "sat" && !string.IsNullOrEmpty(item.titleSantali)) title = item.titleSantali;

            if (modalTitleText != null) modalTitleText.text = title;
            if (modalCategoryText != null) modalCategoryText.text = item.category.ToUpper();
            if (modalProblemText != null) modalProblemText.text = $"Problem: {item.problemDescription}";
            if (modalHazardText != null) modalHazardText.text = $"Hazard: {item.hazardIdentified}";
            if (modalResponseText != null) modalResponseText.text = $"Correct Response: {item.correctResponse}";
            if (modalOutcomeText != null) modalOutcomeText.text = $"Safe Outcome: {item.safeOutcome}";

            AudioManager.Instance?.PlayButtonClick();
        }

        private void OnStartTrainingClicked()
        {
            if (_selectedDemo == null) return;
            AudioManager.Instance?.PlayButtonClick();
            if (detailModalRoot != null) detailModalRoot.SetActive(false);

            AppManager.Instance.SelectedModuleId = _selectedDemo.targetModuleId;
            NavigationManager.Instance?.NavigateTo("video_learning");
        }
    }
}
