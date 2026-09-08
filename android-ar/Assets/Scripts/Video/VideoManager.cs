using System;
using System.Collections.Generic;
using UnityEngine;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Video
{
    [Serializable]
    public class CartoonVideoLesson
    {
        public int lessonNumber;
        public string title;
        public string titleHindi;
        public string titleSantali;
        public string description;
        public float durationSeconds;
        public string videoFileName;
        public string hindiAudioClipName;
        public string santaliAudioClipName;
        public string englishAudioClipName;
        public List<string> subtitlesHindi;
        public List<string> subtitlesSantali;
        public List<string> subtitlesEnglish;
    }

    public class VideoManager : MonoBehaviour
    {
        public static VideoManager Instance { get; private set; }

        public event Action<CartoonVideoLesson, int, int> OnLessonLoaded;
        public event Action<bool> OnLessonCompleted; // true if >= 90% watched

        private Dictionary<string, List<CartoonVideoLesson>> _moduleLessons = new Dictionary<string, List<CartoonVideoLesson>>();
        private string _activeModuleId = AppConstants.MODULE_FIRE;
        private int _currentLessonIndex = 0;
        private float _currentWatchProgress = 0f;
        private bool _isCompleted = false;

        public CartoonVideoLesson CurrentLesson =>
            (_moduleLessons.ContainsKey(_activeModuleId) && _currentLessonIndex < _moduleLessons[_activeModuleId].Count)
                ? _moduleLessons[_activeModuleId][_currentLessonIndex]
                : null;

        public int CurrentLessonIndex => _currentLessonIndex;
        public int TotalLessons => _moduleLessons.ContainsKey(_activeModuleId) ? _moduleLessons[_activeModuleId].Count : 0;
        public bool IsCurrentLessonCompleted => _isCompleted;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            InitializeCartoonLessons();
        }

        private void InitializeCartoonLessons()
        {
            // 1. Fire & Explosion Module (6 Lessons starring Raju - Safety Trainee)
            var fireLessons = new List<CartoonVideoLesson>
            {
                new CartoonVideoLesson
                {
                    lessonNumber = 1,
                    title = "What is Fire? Fire Triangle in Mines",
                    titleHindi = "आग क्या है? खदान में अग्नि त्रिकोण",
                    titleSantali = "ᱥᱮᱸᱜᱮᱞ ᱪᱮᱫ ᱠᱟᱱᱟ? ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱛᱮᱭᱟᱨ",
                    description = "Raju learns how Fuel (Coal), Oxygen (Ventilation), and Heat (Friction/Spontaneous combustion) create mine fires.",
                    durationSeconds = 45f,
                    videoFileName = "fire_lesson_01"
                },
                new CartoonVideoLesson
                {
                    lessonNumber = 2,
                    title = "Recognizing Fire Emergency & Gob Stink",
                    titleHindi = "आग के खतरे और गॉब स्टिंक की पहचान",
                    titleSantali = "ᱥᱮᱸᱜᱮᱞ ᱠᱷᱚᱛᱨᱟ ᱟᱨ ᱥᱚᱜ ᱪᱤᱱᱦᱟᱹᱣ",
                    description = "Raju detects petrolic sweetish odor and smoke haze along the underground conveyor belt line.",
                    durationSeconds = 40f,
                    videoFileName = "fire_lesson_02"
                },
                new CartoonVideoLesson
                {
                    lessonNumber = 3,
                    title = "Raising the Alarm & Klaxon Activation",
                    titleHindi = "आपातकालीन अलार्म और क्लैक्सन बजाना",
                    titleSantali = "ᱵᱤᱯᱚᱫ ᱜᱷᱟᱹᱱᱴᱤ ᱟᱨ ᱠᱞᱮᱠᱥᱚᱱ ᱚᱨ",
                    description = "Raju immediately pulls the emergency audible klaxon on the gallery wall to warn all underground miners.",
                    durationSeconds = 35f,
                    videoFileName = "fire_lesson_03"
                },
                new CartoonVideoLesson
                {
                    lessonNumber = 4,
                    title = "Identifying Emergency Exit & Intake Airway",
                    titleHindi = "आपातकालीन निकास और ताजी हवा मार्ग की पहचान",
                    titleSantali = "ᱚᱰᱚᱠᱚᱜ ᱫᱩᱣᱟᱹᱨ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ",
                    description = "Raju checks airflow direction to choose the fresh intake airway over the smoke-filled return airway.",
                    durationSeconds = 40f,
                    videoFileName = "fire_lesson_04"
                },
                new CartoonVideoLesson
                {
                    lessonNumber = 5,
                    title = "Fire Extinguisher PASS Protocol Selection",
                    titleHindi = "अग्निशामक चयन और PASS विधि",
                    titleSantali = "ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱟᱨ PASS ᱨᱤᱛ",
                    description = "Raju selects the DCP extinguisher, Pulls pin, Aims at base, Squeezes lever, and Sweeps flame base.",
                    durationSeconds = 50f,
                    videoFileName = "fire_lesson_05"
                },
                new CartoonVideoLesson
                {
                    lessonNumber = 6,
                    title = "Safe Evacuation & Assembly Point Protocol",
                    titleHindi = "सुरक्षित निकासी और असेंबली पॉइंट तक पहुंचना",
                    titleSantali = "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱮ ᱚᱰᱚᱠ ᱟᱨ ᱮᱥᱮᱢᱵᱽᱞᱤ ᱯᱚᱭᱮᱱᱴ",
                    description = "Raju dons his SCSR breathing pack, follows the reflective lifeline in smoke, and reaches the surface assembly point.",
                    durationSeconds = 55f,
                    videoFileName = "fire_lesson_06"
                }
            };

            // 2. Gas Leak & Confined Space Module (9 Lessons)
            var gasLessons = new List<CartoonVideoLesson>
            {
                new CartoonVideoLesson { lessonNumber = 1, title = "What is a Gas Leak? Methane & CO", titleHindi = "गैस रिसाव क्या है? मीथेन एवं CO", titleSantali = "ᱜᱮᱥ ᱞᱤᱠ ᱪᱮᱫ ᱠᱟᱱᱟ? CH4 & CO", durationSeconds = 40f, videoFileName = "gas_lesson_01" },
                new CartoonVideoLesson { lessonNumber = 2, title = "Recognizing Toxic & Flammable Gas Hazards", titleHindi = "विषाक्त एवं ज्वलनशील गैस खतरों की पहचान", titleSantali = "ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱛᱨᱟ ᱪᱤᱱᱦᱟᱹᱣ", durationSeconds = 45f, videoFileName = "gas_lesson_02" },
                new CartoonVideoLesson { lessonNumber = 3, title = "Multi-Gas Detector Calibration", titleHindi = "मल्टी-गैस डिटेक्टर का शून्य अंशांकन", titleSantali = "ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱥᱩᱱ ᱠᱮᱞᱤᱵᱽᱨᱮᱥᱚᱱ", durationSeconds = 40f, videoFileName = "gas_lesson_03" },
                new CartoonVideoLesson { lessonNumber = 4, title = "Required PPE for Atmospheric Hazards", titleHindi = "वायुमंडलीय खतरों के लिए आवश्यक पीपीई", titleSantali = "ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱥᱟᱢᱟᱱ", durationSeconds = 35f, videoFileName = "gas_lesson_04" },
                new CartoonVideoLesson { lessonNumber = 5, title = "Confined Space & Roof Cavity Hazards", titleHindi = "सीमित स्थान और छत गुहा के खतरे", titleSantali = "ᱥᱤᱢᱤᱛ ᱡᱟᱭᱜᱟ ᱟᱨ ᱪᱷᱟᱛ ᱠᱷᱚᱛᱨᱟ", durationSeconds = 45f, videoFileName = "gas_lesson_05" },
                new CartoonVideoLesson { lessonNumber = 6, title = "Buddy System & Standby Attendant", titleHindi = "बडी सिस्टम और स्टैंडबाय सहायक", titleSantali = "ᱡᱩᱲᱤ/ᱜᱟᱛᱮ ᱥᱤᱥᱴᱚᱢ (Buddy System)", durationSeconds = 40f, videoFileName = "gas_lesson_06" },
                new CartoonVideoLesson { lessonNumber = 7, title = "Gas Testing & Auxiliary Ventilation", titleHindi = "गैस परीक्षण और सहायक वेंटिलेशन", titleSantali = "ᱜᱮᱥ ᱴᱮᱥᱴ ᱟᱨ ᱦᱚᱭ ᱪᱟᱞᱟᱣ", durationSeconds = 45f, videoFileName = "gas_lesson_07" },
                new CartoonVideoLesson { lessonNumber = 8, title = "Safe Heading Entry Protocol", titleHindi = "सुरक्षित प्रवेश प्रक्रिया", titleSantali = "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ ᱱᱤᱭᱚᱢ", durationSeconds = 40f, videoFileName = "gas_lesson_08" },
                new CartoonVideoLesson { lessonNumber = 9, title = "Emergency Atmospheric Evacuation", titleHindi = "आपातकालीन निकासी प्रतिक्रिया", titleSantali = "ᱟᱪᱠᱟ ᱵᱤᱯᱚᱫ ᱚᱰᱚᱠ ᱨᱤᱛ", durationSeconds = 50f, videoFileName = "gas_lesson_09" }
            };

            _moduleLessons[AppConstants.MODULE_FIRE] = fireLessons;
            _moduleLessons[AppConstants.MODULE_GAS] = gasLessons;
        }

        public void LoadModuleLessons(string moduleId)
        {
            _activeModuleId = moduleId;
            _currentLessonIndex = 0;
            _currentWatchProgress = 0f;
            _isCompleted = false;
            BroadcastCurrentLesson();
        }

        public void UpdateWatchProgress(float normalizedProgress)
        {
            _currentWatchProgress = Mathf.Clamp01(normalizedProgress);
            if (!_isCompleted && _currentWatchProgress >= AppConstants.VIDEO_COMPLETION_THRESHOLD)
            {
                _isCompleted = true;
                Debug.Log($"[VideoManager] Lesson {_currentLessonIndex + 1} completion threshold (90%) met! Unlocked AR Practice.");
                OnLessonCompleted?.Invoke(true);
            }
        }

        public void NextLesson()
        {
            if (_moduleLessons.ContainsKey(_activeModuleId) && _currentLessonIndex < _moduleLessons[_activeModuleId].Count - 1)
            {
                _currentLessonIndex++;
                _currentWatchProgress = 0f;
                _isCompleted = false;
                BroadcastCurrentLesson();
            }
        }

        public void ReplayCurrentLesson()
        {
            _currentWatchProgress = 0f;
            _isCompleted = false;
            BroadcastCurrentLesson();
        }

        private void BroadcastCurrentLesson()
        {
            if (CurrentLesson != null)
            {
                OnLessonLoaded?.Invoke(CurrentLesson, _currentLessonIndex + 1, TotalLessons);
            }
        }
    }
}
