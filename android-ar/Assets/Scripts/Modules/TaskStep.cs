using System;
using UnityEngine;

namespace JHSafetyAR.Modules
{
    public class TaskStep : MonoBehaviour
    {
        public event Action<int, bool> OnStepCompleted;

        [SerializeField] private TaskStepData stepData;
        private float _timeRemaining;
        private bool _isStepActive = false;

        public TaskStepData Data => stepData;
        public float TimeRemaining => _timeRemaining;

        public void InitializeStep(TaskStepData data)
        {
            stepData = data;
            _timeRemaining = data.timeLimitSeconds > 0 ? data.timeLimitSeconds : 30f;
            _isStepActive = true;
        }

        private void Update()
        {
            if (_isStepActive && _timeRemaining > 0)
            {
                _timeRemaining -= Time.deltaTime;
                if (_timeRemaining <= 0)
                {
                    _timeRemaining = 0;
                    CompleteStep(false);
                }
            }
        }

        public void CompleteStep(bool success)
        {
            if (!_isStepActive) return;
            _isStepActive = false;
            int earnedPoints = success ? stepData.maxPoints : 0;
            OnStepCompleted?.Invoke(earnedPoints, success);
        }
    }
}
