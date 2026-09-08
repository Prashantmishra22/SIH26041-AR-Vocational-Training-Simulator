using System;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;
using JHSafetyAR.Core;
using JHSafetyAR.Data;

namespace JHSafetyAR.Modules
{
    public class ModuleManager : MonoBehaviour
    {
        public static ModuleManager Instance { get; private set; }

        public event Action<TaskStepData, int, int> OnStepChanged;
        public event Action<float, bool> OnModuleFinished;

        private ModuleConfig _currentModuleConfig;
        private int _currentStepIndex = 0;
        private int _totalPointsEarned = 0;
        private int _maxPossiblePoints = 0;

        public ModuleConfig CurrentConfig => _currentModuleConfig;
        public int CurrentStepIndex => _currentStepIndex;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void LoadModule(string moduleId)
        {
            _currentStepIndex = 0;
            _totalPointsEarned = 0;
            _maxPossiblePoints = 0;

            string jsonResource = moduleId == AppConstants.MODULE_GAS ? "ModuleData/gas_leak" : "ModuleData/fire_safety";
            TextAsset textAsset = Resources.Load<TextAsset>(jsonResource);

            if (textAsset != null)
            {
                _currentModuleConfig = JsonConvert.DeserializeObject<ModuleConfig>(textAsset.text);
                foreach (var step in _currentModuleConfig.steps)
                {
                    _maxPossiblePoints += step.maxPoints;
                }
                Debug.Log($"[ModuleManager] Loaded module: {_currentModuleConfig.title} ({_currentModuleConfig.steps.Count} tasks, Max {_maxPossiblePoints} pts)");
                BroadcastCurrentStep();
            }
            else
            {
                Debug.LogError($"[ModuleManager] Failed to load JSON for module {moduleId}");
            }
        }

        public void AdvanceStep(bool success)
        {
            if (_currentModuleConfig == null || _currentStepIndex >= _currentModuleConfig.steps.Count) return;

            var step = _currentModuleConfig.steps[_currentStepIndex];
            if (success)
            {
                _totalPointsEarned += step.maxPoints;
                AudioManager.Instance?.PlaySuccess();
            }
            else
            {
                AudioManager.Instance?.PlayError();
            }

            _currentStepIndex++;
            if (_currentStepIndex < _currentModuleConfig.steps.Count)
            {
                BroadcastCurrentStep();
            }
            else
            {
                FinishModule();
            }
        }

        private void BroadcastCurrentStep()
        {
            if (_currentModuleConfig != null && _currentStepIndex < _currentModuleConfig.steps.Count)
            {
                var step = _currentModuleConfig.steps[_currentStepIndex];
                OnStepChanged?.Invoke(step, _currentStepIndex + 1, _currentModuleConfig.steps.Count);
            }
        }

        private void FinishModule()
        {
            float practicalScorePercent = _maxPossiblePoints > 0 ? ((float)_totalPointsEarned / _maxPossiblePoints) * 100f : 0f;
            bool passed = practicalScorePercent >= AppConstants.PASS_THRESHOLD_PERCENT;

            AppManager.Instance.LastPracticalScore = practicalScorePercent;
            Debug.Log($"[ModuleManager] Module finished! Practical Score: {practicalScorePercent:F1}% (Passed: {passed})");

            OnModuleFinished?.Invoke(practicalScorePercent, passed);
        }
    }
}
