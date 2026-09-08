using System.Collections.Generic;
using UnityEngine;

namespace JHSafetyAR.Core
{
    public class NavigationManager : MonoBehaviour
    {
        public static NavigationManager Instance { get; private set; }

        [System.Serializable]
        public struct ScreenMapping
        {
            public string screenId;
            public GameObject screenGameObject;
        }

        [SerializeField] private List<ScreenMapping> screens = new List<ScreenMapping>();
        [SerializeField] private string initialScreen = "splash";

        private Dictionary<string, GameObject> _screenDict = new Dictionary<string, GameObject>();
        private Stack<string> _navigationHistory = new Stack<string>();
        private string _currentScreenId = "";

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            foreach (var mapping in screens)
            {
                if (mapping.screenGameObject != null && !string.IsNullOrEmpty(mapping.screenId))
                {
                    _screenDict[mapping.screenId.ToLower()] = mapping.screenGameObject;
                    mapping.screenGameObject.SetActive(false);
                }
            }
        }

        private void Start()
        {
            if (!string.IsNullOrEmpty(initialScreen))
            {
                NavigateTo(initialScreen);
            }
        }

        public void NavigateTo(string screenId, bool addToHistory = true)
        {
            string key = screenId.ToLower();
            if (!_screenDict.ContainsKey(key))
            {
                Debug.LogWarning($"[NavigationManager] Screen '{screenId}' not found in registry.");
                return;
            }

            if (!string.IsNullOrEmpty(_currentScreenId) && _screenDict.ContainsKey(_currentScreenId))
            {
                _screenDict[_currentScreenId].SetActive(false);
                if (addToHistory)
                {
                    _navigationHistory.Push(_currentScreenId);
                }
            }

            _currentScreenId = key;
            _screenDict[key].SetActive(true);
            Debug.Log($"[NavigationManager] Navigated to screen: {screenId}");
        }

        public void GoBack()
        {
            if (_navigationHistory.Count > 0)
            {
                string previousScreen = _navigationHistory.Pop();
                NavigateTo(previousScreen, false);
            }
            else
            {
                NavigateTo("home", false);
            }
        }

        public string GetCurrentScreen() => _currentScreenId;
    }
}
