using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Certificate;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class CertificateScreen : MonoBehaviour
    {
        [Header("Certificate Header")]
        [SerializeField] private TextMeshProUGUI headerTitleText;
        [SerializeField] private TextMeshProUGUI headerSubtitleText;
        [SerializeField] private TextMeshProUGUI certIdText;

        [Header("Worker Details")]
        [SerializeField] private TextMeshProUGUI workerNameText;
        [SerializeField] private TextMeshProUGUI workerIdText;
        [SerializeField] private TextMeshProUGUI sectorDistrictText;
        [SerializeField] private TextMeshProUGUI moduleTitleText;
        [SerializeField] private TextMeshProUGUI scoreText;
        [SerializeField] private TextMeshProUGUI issueDateText;

        [Header("QR & Validation")]
        [SerializeField] private RawImage qrCodeImage;
        [SerializeField] private TextMeshProUGUI qrInstructionText;

        [Header("Actions")]
        [SerializeField] private Button doneBtn;
        [SerializeField] private Button verifyBtn;
        [SerializeField] private Button shareBtn;

        private string _activeCertId = "JH-SAFE-2026-000142";

        private void OnEnable()
        {
            var user = AppManager.Instance != null ? AppManager.Instance.CurrentUser : DemoData.GetDefaultDemoUser();
            string modId = AppManager.Instance != null ? AppManager.Instance.SelectedModuleId : AppConstants.MODULE_FIRE;
            float score = AppManager.Instance != null ? AppManager.Instance.LastTotalScore : 91.0f;

            _activeCertId = $"JH-SAFE-{System.DateTime.Now.Year}-{Random.Range(100000, 999999)}";

            if (headerTitleText != null) headerTitleText.text = "Government of Jharkhand";
            if (headerSubtitleText != null) headerSubtitleText.text = "Industrial Safety Training Certificate";
            if (certIdText != null) certIdText.text = $"Certificate ID: {_activeCertId}";

            if (workerNameText != null) workerNameText.text = user.fullName;
            if (workerIdText != null) workerIdText.text = user.workerId;
            if (sectorDistrictText != null) sectorDistrictText.text = $"{user.sector} • {user.district}";

            string moduleTitle = (modId == AppConstants.MODULE_GAS)
                ? "Toxic Methane (CH4) & CO Gas Detection & Confined Space Safety"
                : "Underground Mine Fire & Explosion Protocol";

            if (moduleTitleText != null) moduleTitleText.text = moduleTitle;
            if (scoreText != null) scoreText.text = $"{score:F0}% (Passed)";
            if (issueDateText != null) issueDateText.text = System.DateTime.Now.ToString("dd MMM yyyy");

            string verifyPayload = $"https://jh-safety.gov.in/verify/{_activeCertId}";
            if (qrCodeImage != null)
            {
                qrCodeImage.texture = QRCodeGenerator.GenerateQRCodeTexture(verifyPayload, 256, 256);
            }

            if (qrInstructionText != null)
            {
                qrInstructionText.text = "Scan with any smartphone camera or verification portal to authenticate this DGMS safety credential.";
            }
        }

        private void Start()
        {
            if (doneBtn != null) doneBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("home"));
            if (verifyBtn != null) verifyBtn.onClick.AddListener(OnVerifyClicked);
            if (shareBtn != null) shareBtn.onClick.AddListener(OnShareClicked);
        }

        private void OnVerifyClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo("qr_scanner");
        }

        private void OnShareClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            Debug.Log($"[CertificateScreen] Sharing Certificate {_activeCertId} PDF...");
        }
    }
}
