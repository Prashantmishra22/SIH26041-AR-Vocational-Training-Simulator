using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Certificate;

namespace JHSafetyAR.UI.Screens
{
    public class QRScannerScreen : MonoBehaviour
    {
        [Header("Scanner Controls")]
        [SerializeField] private TMP_InputField certificateIdInput;
        [SerializeField] private Button scanSampleBtn;
        [SerializeField] private Button verifyInputBtn;
        [SerializeField] private Button backBtn;

        [Header("Verification Result Card")]
        [SerializeField] private GameObject resultCardRoot;
        [SerializeField] private TextMeshProUGUI verificationHeadingText;
        [SerializeField] private TextMeshProUGUI statusBadgeText;
        [SerializeField] private Image statusBadgeBg;
        [SerializeField] private TextMeshProUGUI certIdDisplayText;
        [SerializeField] private TextMeshProUGUI workerDisplayText;
        [SerializeField] private TextMeshProUGUI moduleDisplayText;
        [SerializeField] private TextMeshProUGUI scoreDisplayText;
        [SerializeField] private TextMeshProUGUI dateDisplayText;

        private void OnEnable()
        {
            if (resultCardRoot != null) resultCardRoot.SetActive(false);
        }

        private void Start()
        {
            if (scanSampleBtn != null) scanSampleBtn.onClick.AddListener(OnScanSampleClicked);
            if (verifyInputBtn != null) verifyInputBtn.onClick.AddListener(OnVerifyInputClicked);
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
        }

        private void OnScanSampleClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            DisplayVerificationResult("JH-SAFE-2026-000142", "Rahul Kumar (DEMO-001)", "Underground Mine Fire & Explosion Protocol", 91.0f, System.DateTime.Now.ToString("dd MMM yyyy"), "VALID");
        }

        private void OnVerifyInputClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            string code = certificateIdInput != null ? certificateIdInput.text.Trim().ToUpper() : "";
            if (string.IsNullOrEmpty(code)) code = "JH-SAFE-2026-000142";

            if (code.Contains("REVOKED"))
            {
                DisplayVerificationResult(code, "Unknown Worker", "Methane Gas Protocol", 62.0f, "2025-10-12", "REVOKED");
            }
            else if (code.Contains("INVALID") || code.Length < 6)
            {
                DisplayVerificationResult(code, "—", "—", 0f, "—", "INVALID");
            }
            else
            {
                DisplayVerificationResult(code, "Rahul Kumar (DEMO-001)", "Underground Mine Fire & Explosion Protocol", 91.0f, System.DateTime.Now.ToString("dd MMM yyyy"), "VALID");
            }
        }

        private void DisplayVerificationResult(string certId, string worker, string module, float score, string date, string status)
        {
            if (resultCardRoot != null) resultCardRoot.SetActive(true);

            if (status == "VALID")
            {
                if (verificationHeadingText != null) verificationHeadingText.text = "CERTIFICATE VERIFIED ✓";
                if (statusBadgeText != null) statusBadgeText.text = "VALID (AUTHENTIC)";
                if (statusBadgeBg != null) statusBadgeBg.color = new Color(0.06f, 0.72f, 0.50f, 0.2f);
                AudioManager.Instance?.PlaySuccess();
            }
            else if (status == "REVOKED")
            {
                if (verificationHeadingText != null) verificationHeadingText.text = "CERTIFICATE REVOKED ⚠️";
                if (statusBadgeText != null) statusBadgeText.text = "REVOKED";
                if (statusBadgeBg != null) statusBadgeBg.color = new Color(0.96f, 0.62f, 0.04f, 0.2f);
                AudioManager.Instance?.PlayError();
            }
            else
            {
                if (verificationHeadingText != null) verificationHeadingText.text = "INVALID CREDENTIAL ✕";
                if (statusBadgeText != null) statusBadgeText.text = "INVALID / NOT FOUND";
                if (statusBadgeBg != null) statusBadgeBg.color = new Color(0.95f, 0.24f, 0.36f, 0.2f);
                AudioManager.Instance?.PlayError();
            }

            if (certIdDisplayText != null) certIdDisplayText.text = certId;
            if (workerDisplayText != null) workerDisplayText.text = worker;
            if (moduleDisplayText != null) moduleDisplayText.text = module;
            if (scoreDisplayText != null) scoreDisplayText.text = $"{score:F0}%";
            if (dateDisplayText != null) dateDisplayText.text = date;
        }
    }
}
