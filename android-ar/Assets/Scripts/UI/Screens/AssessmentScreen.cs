using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using JHSafetyAR.Core;
using JHSafetyAR.Assessment;
using JHSafetyAR.Offline;

namespace JHSafetyAR.UI.Screens
{
    public class AssessmentScreen : MonoBehaviour
    {
        [Header("Assessment Header")]
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI questionNumberText;
        [SerializeField] private TextMeshProUGUI questionBodyText;

        [Header("Options List")]
        [SerializeField] private List<Button> optionButtons;
        [SerializeField] private List<TextMeshProUGUI> optionTexts;

        [Header("Progress Bar")]
        [SerializeField] private Slider questionProgressSlider;

        private void OnEnable()
        {
            if (titleText != null) titleText.text = "POST-TRAINING SAFETY ASSESSMENT";

            if (AssessmentEngine.Instance != null)
            {
                AssessmentEngine.Instance.OnQuestionPresented += HandleQuestionPresented;
                AssessmentEngine.Instance.OnAssessmentCompleted += HandleAssessmentCompleted;
                AssessmentEngine.Instance.StartAssessment(AppManager.Instance.SelectedModuleId);
            }
        }

        private void OnDisable()
        {
            if (AssessmentEngine.Instance != null)
            {
                AssessmentEngine.Instance.OnQuestionPresented -= HandleQuestionPresented;
                AssessmentEngine.Instance.OnAssessmentCompleted -= HandleAssessmentCompleted;
            }
        }

        private void Start()
        {
            for (int i = 0; i < optionButtons.Count; i++)
            {
                int index = i;
                if (optionButtons[i] != null)
                {
                    optionButtons[i].onClick.AddListener(() => OnOptionClicked(index));
                }
            }
        }

        private void OnOptionClicked(int index)
        {
            AudioManager.Instance?.PlayButtonClick();
            AssessmentEngine.Instance?.SubmitAnswer(index);
        }

        private void HandleQuestionPresented(QuestionItem q, int current, int total)
        {
            if (questionNumberText != null) questionNumberText.text = $"QUESTION {current} OF {total}";
            if (questionProgressSlider != null) questionProgressSlider.value = (float)current / total;

            string currentLang = LocalizationManager.Instance != null ? LocalizationManager.Instance.CurrentLanguage : "hi";
            string qText = q.text;
            if (currentLang == "hi" && !string.IsNullOrEmpty(q.textHindi)) qText = q.textHindi;
            if (currentLang == "sat" && !string.IsNullOrEmpty(q.textSantali)) qText = q.textSantali;

            if (questionBodyText != null) questionBodyText.text = qText;

            for (int i = 0; i < optionButtons.Count; i++)
            {
                if (i < q.options.Count)
                {
                    optionButtons[i].gameObject.SetActive(true);
                    if (i < optionTexts.Count && optionTexts[i] != null)
                    {
                        optionTexts[i].text = q.options[i];
                    }
                }
                else
                {
                    optionButtons[i].gameObject.SetActive(false);
                }
            }
        }

        private void HandleAssessmentCompleted(float practical, float theory, float total, bool passed)
        {
            OfflineDatabase.Instance?.SaveAttempt(AppManager.Instance.SelectedModuleId, practical, theory, total, passed);
            NavigationManager.Instance?.NavigateTo("score");
        }
    }
}
