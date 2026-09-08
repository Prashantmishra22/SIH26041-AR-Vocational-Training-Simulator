namespace JHSafetyAR.Data
{
    public static class AppConstants
    {
        public const string APP_NAME = "JH Safety AR";
        public const string APP_SUBTITLE = "Industrial Safety Training & Certification";
        public const string APP_VERSION = "1.0.0";
        public const string API_BASE_URL = "http://10.0.2.2:8000/api/v1";

        public const string PREF_KEY_TOKEN = "jwt_token";
        public const string PREF_KEY_WORKER_ID = "worker_id";
        public const string PREF_KEY_WORKER_NAME = "worker_name";
        public const string PREF_KEY_LANGUAGE = "preferred_language";
        public const string PREF_KEY_OFFLINE_MODE = "is_offline_demo";

        public const int PASS_THRESHOLD_PERCENT = 70;
        public const float VIDEO_COMPLETION_THRESHOLD = 0.90f; // 90% watch percentage required
        public const float PRACTICAL_WEIGHT = 0.60f;
        public const float THEORY_WEIGHT = 0.40f;

        public const string MODULE_FIRE = "fire_safety_01";
        public const string MODULE_GAS = "gas_leak_02";
        public const string MODULE_MACHINERY = "machinery_safety_03";
        public const string MODULE_PPE = "ppe_workplace_04";
        public const string MODULE_EMERGENCY = "emergency_response_05";

        public const string LANG_ENGLISH = "en";
        public const string LANG_HINDI = "hi";
        public const string LANG_SANTALI = "sat";

        public const string SAFETY_DISCLAIMER = "This application is a training simulator and does not replace official workplace safety procedures or supervisor instructions.";
    }
}
