using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Video
{
    public class VideoPlayerController : MonoBehaviour
    {
        [Header("UI Controls")]
        [SerializeField] private Button playPauseBtn;
        [SerializeField] private Image playPauseIcon;
        [SerializeField] private Button replayBtn;
        [SerializeField] private Button subtitleToggleBtn;
        [SerializeField] private Button languageSwitchBtn;
        [SerializeField] private Slider progressSlider;
        [SerializeField] private TextMeshProUGUI timeText;
        [SerializeField] private TextMeshProUGUI videoCounterText;
        [SerializeField] private TextMeshProUGUI lessonTitleText;
        [SerializeField] private TextMeshProUGUI subtitleDisplayBox;
        [SerializeField] private GameObject completionCard;
        [SerializeField] private Button continueToARBtn;

        [Header("Icons")]
        [SerializeField] private Sprite playSprite;
        [SerializeField] private Sprite pauseSprite;

        private bool _isPlaying = true;
        private bool _subtitlesEnabled = true;
        private float _simulatedElapsed = 0f;
        private float _currentLessonDuration = 45f;

        private void OnEnable()
        {
            if (VideoManager.Instance != null)
            {
                VideoManager.Instance.OnLessonLoaded += HandleLessonLoaded;
                VideoManager.Instance.OnLessonCompleted += HandleLessonCompleted;
                VideoManager.Instance.LoadModuleLessons(AppManager.Instance.SelectedModuleId);
            }
        }

        private void OnDisable()
        {
            if (VideoManager.Instance != null)
            {
                VideoManager.Instance.OnLessonLoaded -= HandleLessonLoaded;
                VideoManager.Instance.OnLessonCompleted -= HandleLessonCompleted;
            }
        }

        private void Start()
        {
            if (playPauseBtn != null) playPauseBtn.onClick.AddListener(TogglePlayPause);
            if (replayBtn != null) replayBtn.onClick.AddListener(Replay);
            if (subtitleToggleBtn != null) subtitleToggleBtn.onClick.AddListener(ToggleSubtitles);
            if (languageSwitchBtn != null) languageSwitchBtn.onClick.AddListener(CycleLanguage);
            if (continueToARBtn != null) continueToARBtn.onClick.AddListener(OnContinueToARClicked);

            if (progressSlider != null)
            {
                progressSlider.onValueChanged.AddListener(OnSliderSeek);
            }
        }

        private void Update()
        {
            if (_isPlaying && _currentLessonDuration > 0)
            {
                _simulatedElapsed += Time.deltaTime;
                if (_simulatedElapsed > _currentLessonDuration)
                {
                    _simulatedElapsed = _currentLessonDuration;
                    _isPlaying = false;
                    UpdatePlayPauseIcon();
                }

                float progress = _simulatedElapsed / _currentLessonDuration;
                if (progressSlider != null) progressSlider.value = progress;

                UpdateTimeDisplay();
                UpdateSubtitlesDisplay();
                VideoManager.Instance?.UpdateWatchProgress(progress);
            }
        }

        private void HandleLessonLoaded(CartoonVideoLesson lesson, int current, int total)
        {
            _simulatedElapsed = 0f;
            _currentLessonDuration = lesson.durationSeconds > 0 ? lesson.durationSeconds : 45f;
            _isPlaying = true;

            if (completionCard != null) completionCard.SetActive(false);
            if (videoCounterText != null) videoCounterText.text = $"VIDEO {current} OF {total}";

            string currentLang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            string title = lesson.title;
            if (currentLang == "hi" && !string.IsNullOrEmpty(lesson.titleHindi)) title = lesson.titleHindi;
            if (currentLang == "sat" && !string.IsNullOrEmpty(lesson.titleSantali)) title = lesson.titleSantali;

            if (lessonTitleText != null) lessonTitleText.text = title;
            UpdatePlayPauseIcon();
        }

        private void HandleLessonCompleted(bool passed)
        {
            if (completionCard != null) completionCard.SetActive(true);
            AudioManager.Instance?.PlaySuccess();
        }

        private void TogglePlayPause()
        {
            AudioManager.Instance?.PlayButtonClick();
            _isPlaying = !_isPlaying;
            UpdatePlayPauseIcon();
        }

        private void Replay()
        {
            AudioManager.Instance?.PlayButtonClick();
            _simulatedElapsed = 0f;
            _isPlaying = true;
            if (completionCard != null) completionCard.SetActive(false);
            UpdatePlayPauseIcon();
            VideoManager.Instance?.ReplayCurrentLesson();
        }

        private void ToggleSubtitles()
        {
            AudioManager.Instance?.PlayButtonClick();
            _subtitlesEnabled = !_subtitlesEnabled;
            if (subtitleDisplayBox != null) subtitleDisplayBox.gameObject.SetActive(_subtitlesEnabled);
        }

        private void CycleLanguage()
        {
            AudioManager.Instance?.PlayButtonClick();
            string currentLang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            string nextLang = (currentLang == "hi") ? "sat" : (currentLang == "sat") ? "en" : "hi";
            LocalizationManager.Instance?.SetLanguage(nextLang);
        }

        private void OnSliderSeek(float val)
        {
            _simulatedElapsed = val * _currentLessonDuration;
            UpdateTimeDisplay();
        }

        private void UpdateTimeDisplay()
        {
            if (timeText != null)
            {
                int currM = (int)(_simulatedElapsed / 60);
                int currS = (int)(_simulatedElapsed % 60);
                int totalM = (int)(_currentLessonDuration / 60);
                int totalS = (int)(_currentLessonDuration % 60);
                timeText.text = $"{currM:00}:{currS:00} / {totalM:00}:{totalS:00}";
            }
        }

        private void UpdateSubtitlesDisplay()
        {
            if (subtitleDisplayBox == null || !_subtitlesEnabled) return;

            string lang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            if (lang == "sat")
            {
                subtitleDisplayBox.text = "ᱨᱟᱡᱩ: ᱥᱮᱸᱜᱮᱞ ᱧᱟᱢ ᱞᱮᱱᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱠᱞᱮᱠᱥᱚᱱ ᱚᱨ ᱢᱮ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ᱾";
            }
            else if (lang == "hi")
            {
                subtitleDisplayBox.text = "राजू: आग का खतरा दिखते ही तुरंत आपातकालीन क्लैक्सन बजाएं और सुरक्षित निकास मार्ग चुनें।";
            }
            else
            {
                subtitleDisplayBox.text = "Raju: Upon detecting fire hazards, immediately sound the klaxon and follow the fresh intake airway.";
            }
        }

        private void UpdatePlayPauseIcon()
        {
            if (playPauseIcon != null)
            {
                if (_isPlaying && pauseSprite != null) playPauseIcon.sprite = pauseSprite;
                else if (!_isPlaying && playSprite != null) playPauseIcon.sprite = playSprite;
            }
        }

        private void OnContinueToARClicked()
        {
            AudioManager.Instance?.PlayButtonClick();
            NavigationManager.Instance?.NavigateTo("ar_training");
        }
    }
}
