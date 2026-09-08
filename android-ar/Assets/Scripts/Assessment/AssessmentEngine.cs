using System;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Assessment
{
    public class AssessmentEngine : MonoBehaviour
    {
        public static AssessmentEngine Instance { get; private set; }

        public event Action<QuestionItem, int, int> OnQuestionPresented;
        public event Action<float, float, float, bool> OnAssessmentCompleted; // practical, theory, aggregate, passed

        private List<QuestionItem> _questions = new List<QuestionItem>();
        private int _currentQuestionIndex = 0;
        private int _correctAnswersCount = 0;

        public int CurrentIndex => _currentQuestionIndex;
        public int TotalQuestions => _questions.Count;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void StartAssessment(string moduleId)
        {
            _currentQuestionIndex = 0;
            _correctAnswersCount = 0;
            _questions.Clear();

            string resName = moduleId == AppConstants.MODULE_GAS ? "Questions/gas_questions" : "Questions/fire_questions";
            TextAsset textAsset = Resources.Load<TextAsset>(resName);

            if (textAsset != null)
            {
                _questions = JsonConvert.DeserializeObject<List<QuestionItem>>(textAsset.text);
                Debug.Log($"[AssessmentEngine] Loaded {_questions.Count} questions for module {moduleId}");
                PresentCurrentQuestion();
            }
            else
            {
                Debug.LogError($"[AssessmentEngine] Could not load questions from {resName}");
            }
        }

        public void SubmitAnswer(int selectedOptionIndex)
        {
            if (_currentQuestionIndex >= _questions.Count) return;

            var q = _questions[_currentQuestionIndex];
            bool isCorrect = selectedOptionIndex == q.correctIndex;

            if (isCorrect)
            {
                _correctAnswersCount++;
                AudioManager.Instance?.PlaySuccess();
            }
            else
            {
                AudioManager.Instance?.PlayError();
            }

            _currentQuestionIndex++;
            if (_currentQuestionIndex < _questions.Count)
            {
                PresentCurrentQuestion();
            }
            else
            {
                FinishAssessment();
            }
        }

        private void PresentCurrentQuestion()
        {
            if (_currentQuestionIndex < _questions.Count)
            {
                var q = _questions[_currentQuestionIndex];
                OnQuestionPresented?.Invoke(q, _currentQuestionIndex + 1, _questions.Count);
            }
        }

        private void FinishAssessment()
        {
            float practicalScore = AppManager.Instance.LastPracticalScore;
            float theoryScore = _questions.Count > 0 ? ((float)_correctAnswersCount / _questions.Count) * 100f : 0f;
            float totalScore = ScoreCalculator.CalculateAggregateScore(practicalScore, theoryScore);
            bool passed = ScoreCalculator.IsPassingScore(totalScore);

            AppManager.Instance.LastTheoryScore = theoryScore;
            AppManager.Instance.LastTotalScore = totalScore;
            AppManager.Instance.LastPassed = passed;

            Debug.Log($"[AssessmentEngine] Assessment Finished. Theory: {theoryScore:F1}%, Practical: {practicalScore:F1}%, Total: {totalScore:F1}%, Passed: {passed}");
            OnAssessmentCompleted?.Invoke(practicalScore, theoryScore, totalScore, passed);
        }
    }
}
