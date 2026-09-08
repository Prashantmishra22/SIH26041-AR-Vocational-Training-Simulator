using System;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;
using JHSafetyAR.Data;

namespace JHSafetyAR.Core
{
    public class LocalizationManager : MonoBehaviour
    {
        public static LocalizationManager Instance { get; private set; }

        public event Action OnLanguageChanged;

        private string _currentLanguage = AppConstants.LANG_HINDI;
        private Dictionary<string, string> _localizedStrings = new Dictionary<string, string>();

        public string CurrentLanguage => _currentLanguage;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            string savedLang = PlayerPrefs.GetString(AppConstants.PREF_KEY_LANGUAGE, AppConstants.LANG_HINDI);
            SetLanguage(savedLang);
        }

        public void SetLanguage(string langCode)
        {
            _currentLanguage = langCode;
            PlayerPrefs.SetString(AppConstants.PREF_KEY_LANGUAGE, langCode);
            PlayerPrefs.Save();

            LoadLanguageFile(langCode);
            OnLanguageChanged?.Invoke();
            Debug.Log($"[LocalizationManager] Switched language to: {langCode} (Loaded {_localizedStrings.Count} strings)");
        }

        private void LoadLanguageFile(string langCode)
        {
            _localizedStrings.Clear();
            TextAsset textAsset = Resources.Load<TextAsset>($"Localization/{langCode}");
            if (textAsset != null)
            {
                try
                {
                    _localizedStrings = JsonConvert.DeserializeObject<Dictionary<string, string>>(textAsset.text);
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[LocalizationManager] Failed to parse {langCode}.json: {ex.Message}");
                }
            }
            else
            {
                Debug.LogWarning($"[LocalizationManager] Localization file for '{langCode}' not found in Resources/Localization/");
            }
        }

        public string GetText(string key, string fallback = "")
        {
            if (_localizedStrings.TryGetValue(key, out string value))
            {
                return value;
            }
            return string.IsNullOrEmpty(fallback) ? key : fallback;
        }
    }
}
