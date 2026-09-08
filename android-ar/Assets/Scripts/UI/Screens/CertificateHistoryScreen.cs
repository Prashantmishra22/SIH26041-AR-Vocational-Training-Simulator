using UnityEngine;
using UnityEngine.UI;
using JHSafetyAR.Core;

namespace JHSafetyAR.UI.Screens
{
    public class CertificateHistoryScreen : MonoBehaviour
    {
        [SerializeField] private Button backBtn;
        [SerializeField] private Button viewFirstCertBtn;

        private void Start()
        {
            if (backBtn != null) backBtn.onClick.AddListener(() => NavigationManager.Instance?.GoBack());
            if (viewFirstCertBtn != null) viewFirstCertBtn.onClick.AddListener(() => NavigationManager.Instance?.NavigateTo("certificate_view"));
        }
    }
}
