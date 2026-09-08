using System.Collections;
using UnityEngine;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.UI.Screens
{
    public class SplashScreen : MonoBehaviour
    {
        [SerializeField] private float displayDuration = 2.0f;

        private void OnEnable()
        {
            StartCoroutine(SplashRoutine());
        }

        private IEnumerator SplashRoutine()
        {
            yield return new WaitForSeconds(displayDuration);

            // If language is already configured, go to login or home
            bool hasSavedLang = PlayerPrefs.HasKey(AppConstants.PREF_KEY_LANGUAGE);
            if (hasSavedLang)
            {
                NavigationManager.Instance?.NavigateTo("login");
            }
            else
            {
                NavigationManager.Instance?.NavigateTo("language");
            }
        }
    }
}
