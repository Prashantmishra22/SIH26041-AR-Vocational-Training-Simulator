package in.gov.jharkhand.safetyar.network;

import android.content.Context;
import android.content.SharedPreferences;

public class ApiConfig {
    private static final String PREF_NAME = "jh_safety_ar_prefs";
    private static final String KEY_BASE_URL = "api_base_url";
    private static final String KEY_TOKEN = "jwt_access_token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_WORKER_ID = "worker_id";
    private static final String KEY_WORKER_NAME = "worker_name";
    private static final String KEY_SECTOR = "worker_sector";
    private static final String KEY_DISTRICT = "worker_district";
    private static final String KEY_LANGUAGE = "worker_language";

    // Default to 10.0.2.2:8000 (Android emulator pointing to host machine FastAPI)
    // On physical phone over WiFi, user or tester can configure IP e.g. http://192.168.1.5:8000
    public static final String DEFAULT_BASE_URL = "http://10.0.2.2:8000";

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static String getBaseUrl(Context context) {
        return getPrefs(context).getString(KEY_BASE_URL, DEFAULT_BASE_URL);
    }

    public static void setBaseUrl(Context context, String url) {
        if (url != null) {
            String clean = url.trim();
            if (clean.endsWith("/")) {
                clean = clean.substring(0, clean.length() - 1);
            }
            getPrefs(context).edit().putString(KEY_BASE_URL, clean).apply();
        }
    }

    public static String getToken(Context context) {
        return getPrefs(context).getString(KEY_TOKEN, "");
    }

    public static void setToken(Context context, String token) {
        getPrefs(context).edit().putString(KEY_TOKEN, token != null ? token : "").apply();
    }

    public static int getUserId(Context context) {
        return getPrefs(context).getInt(KEY_USER_ID, -1);
    }

    public static void setUserId(Context context, int userId) {
        getPrefs(context).edit().putInt(KEY_USER_ID, userId).apply();
    }

    public static String getWorkerId(Context context) {
        return getPrefs(context).getString(KEY_WORKER_ID, "DEMO-001");
    }

    public static void setWorkerId(Context context, String workerId) {
        getPrefs(context).edit().putString(KEY_WORKER_ID, workerId).apply();
    }

    public static String getWorkerName(Context context) {
        return getPrefs(context).getString(KEY_WORKER_NAME, "Rahul Kumar");
    }

    public static void setWorkerName(Context context, String name) {
        getPrefs(context).edit().putString(KEY_WORKER_NAME, name).apply();
    }

    public static String getSector(Context context) {
        return getPrefs(context).getString(KEY_SECTOR, "Mining");
    }

    public static void setSector(Context context, String sector) {
        getPrefs(context).edit().putString(KEY_SECTOR, sector).apply();
    }

    public static String getDistrict(Context context) {
        return getPrefs(context).getString(KEY_DISTRICT, "Dhanbad");
    }

    public static void setDistrict(Context context, String district) {
        getPrefs(context).edit().putString(KEY_DISTRICT, district).apply();
    }

    public static String getLanguage(Context context) {
        return getPrefs(context).getString(KEY_LANGUAGE, "hi");
    }

    public static void setLanguage(Context context, String language) {
        getPrefs(context).edit().putString(KEY_LANGUAGE, language).apply();
    }

    public static void clearAuth(Context context) {
        getPrefs(context).edit()
                .remove(KEY_TOKEN)
                .remove(KEY_USER_ID)
                .apply();
    }
}
