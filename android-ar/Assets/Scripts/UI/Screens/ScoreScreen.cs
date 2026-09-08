using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Certificate;
using JHSafetyAR.Offline;

namespace JHSafetyAR.UI.Screens
{
    public class ScoreScreen : MonoBehaviour
    {
        [Header("Scores")]
        [SerializeField] private TextMeshProUGUI practicalScoreText;
        [SerializeField] private TextMeshProUGUI knowledgeScoreText;
        [SerializeField] private TextMeshProUGUI finalScoreText;
        [SerializeField] private TextMeshProUGUI passFailBadgeText;
        [SerializeField] private Image passFailBadgeBg;

        [Header("Breakdown Statistics")]
        [SerializeField] private TextMeshProUGUI correctAnswersText;
        [SerializeField] private TextMeshProUGUI incorrectAnswersText;
        [SerializeField] private TextMeshProUGUI mistakesCountText;
        [SerializeField] private TextMeshProUGUI timeSpentText;
        [SerializeField] private TextMeshProUGUI instructionFeedbackText;

        [Header("Actions")]
        [SerializeField] private Button claimCertBtn;
        [SerializeField] private Button retakeTrainingBtn;
        [SerializeField] private Button homeBtn;

        private void OnEnable()
        {
            float practical = AppManager.Instance != null ? AppManager.Instance.LastPracticalScore : 92.0f;
            float knowledge = AppManager.Instance != null ? AppManager.Instance.LastTheoryScore : 90.0f;
            float finalScore = AppManager.Instance != null ? AppManager.Instance.LastTotalScore : 91.0f;
            bool passed = AppManager.Instance != null ? AppManager.Instance.LastPassed : (finalScore >= 70.0f);

            if (practicalScoreText != null) practicalScoreText.text = $"{practical:F0}%";
            if (knowledgeScoreText != null) knowledgeScoreText.text = $"{knowledge:F0}%";
            if (finalScoreText != null) finalScoreText.text = $"{finalScore:F0}%";

            int totalQ = 10;
            int correctQ = Mathf.RoundToInt((knowledge / 100f) * totalQ);
            int incorrectQ = totalQ - correctQ;

            if (correctAnswersText != null) correctAnswersText.text = $"{correctQ} / {totalQ}";
            if (incorrectAnswersText != null) incorrectAnswersText.text = $"{incorrectQ}";
            if (mistakesCountText != null) mistakesCountText.text = $"{incorrectQ}";
            if (timeSpentText != null) timeSpentText.text = "14m 20s";

            if (passed)
            {
                if (passFailBadgeText != null) passFailBadgeText.text = "PASS ✓";
                if (passFailBadgeBg != null) passFailBadgeBg.color = new Color(0.06f, 0.72f, 0.50f, 0.2f);
                if (instructionFeedbackText != null)
                {
                    instructionFeedbackText.text = "Congratulations! You have successfully passed the practical and knowledge evaluation.";
                }

                if (claimCertBtn != null) claimCertBtn.gameObject.SetActive(true);
                if (retakeTrainingBtn != null) retakeTrainingBtn.gameObject.SetActive(false);

                AudioManager.Instance?.PlayCertificateFanfare();
                var cert = CertificateGenerator.GenerateCertificate(AppManager.Instance.SelectedModuleId, finalScore);
                OfflineDatabase.Instance?.SaveCertificate(cert);
            }
            else
            {
                if (passFailBadgeText != null) passFailBadgeText.text = "FAIL ✕";
                if (passFailBadgeBg != null) passFailBadgeBg.color = new Color(0.95f, 0.24f, 0.36f, 0.2f);
                if (instructionFeedbackText != null)
                {
                    instructionFeedbackText.text = "Score below 70% threshold. Please complete the training again to earn your certificate.";
                }

                if (claimCertBtn != null) claimCertBtn.gameObject.SetActive(false);
                if (retakeTrainingBtn != null) retakeTrainingBtn.gameObject.SetActive(true);

                AudioManager.Instance?.PlayError();
            }
        }

        private void Start()
        {
            if (claimCertBtn != null) claimCertBtn.onClick.AddListener(OnClaimCertClicked);
            if (retakeTrainingBtn != null) retakeTrainingBtn.onClick.AddListener(OnRetakeClicked);
            if (homeBtn != null) homeBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("home"));
        }

        private void OnClaimCertClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo("certificate_view");
        }

        private void OnRetakeClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo("video_learning");
        }
    }
}
