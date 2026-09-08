using System;
using System.Collections.Generic;

namespace JHSafetyAR.Modules
{
    [Serializable]
    public class TaskStepData
    {
        public int stepNumber;
        public string title;
        public string hazardType;
        public string instruction;
        public string instructionHindi;
        public string instructionSantali;
        public string targetObjectName;
        public string requiredGesture;
        public float timeLimitSeconds;
        public int maxPoints;
    }

    [Serializable]
    public class ModuleConfig
    {
        public string id;
        public string title;
        public string titleHindi;
        public string titleSantali;
        public string sector;
        public string difficulty;
        public int estimatedMinutes;
        public int passThreshold;
        public string complianceStandard;
        public List<TaskStepData> steps;
    }
}
