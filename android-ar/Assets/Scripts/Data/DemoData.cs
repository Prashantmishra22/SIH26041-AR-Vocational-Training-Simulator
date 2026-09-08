using System;

namespace JHSafetyAR.Data
{
    [Serializable]
    public class DemoWorkerProfile
    {
        public string workerId = "DEMO-001";
        public string fullName = "Rahul Kumar";
        public string phone = "+91 94311 28941";
        public string company = "Bharat Coking Coal Ltd (BCCL)";
        public string facility = "Moonidih Deep Underground Mine, Pit No. 3";
        public string district = "Dhanbad";
        public string sector = "Mining";
        public string preferredLanguage = "hi";
        public float trainingProgress = 40.0f;
        public int completedModules = 2;
        public int totalModules = 5;
        public float latestScore = 91.0f;
        public int certificatesCount = 1;
        public bool isCertified = true;
    }

    public static class DemoData
    {
        public static DemoWorkerProfile GetDefaultDemoUser()
        {
            return new DemoWorkerProfile();
        }
    }
}
