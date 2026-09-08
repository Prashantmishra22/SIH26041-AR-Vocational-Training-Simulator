package in.gov.jharkhand.safetyar.core;

import android.content.Context;
import android.util.Log;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class LocalizationEngine {
    private static LocalizationEngine sInstance;
    private final Context mContext;
    private String mCurrentLanguage = "hi"; // default Hindi
    private final Map<String, String> mStrings = new HashMap<>();

    private LocalizationEngine(Context context) {
        this.mContext = context.getApplicationContext();
        loadLanguage(mCurrentLanguage);
    }

    public static synchronized LocalizationEngine getInstance(Context context) {
        if (sInstance == null) {
            sInstance = new LocalizationEngine(context);
        }
        return sInstance;
    }

    public void setLanguage(String langCode) {
        this.mCurrentLanguage = langCode;
        loadLanguage(langCode);
    }

    public String getCurrentLanguage() {
        return mCurrentLanguage;
    }

    private void loadLanguage(String langCode) {
        mStrings.clear();
        try {
            InputStream is = mContext.getAssets().open("localization/" + langCode + ".json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, StandardCharsets.UTF_8);
            JSONObject obj = new JSONObject(json);
            Iterator<String> keys = obj.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                mStrings.put(key, obj.getString(key));
            }
            Log.d("LocalizationEngine", "Loaded " + mStrings.size() + " strings for " + langCode);
        } catch (Exception e) {
            Log.e("LocalizationEngine", "Error loading localization for " + langCode, e);
        }
    }

    public String getText(String key, String fallback) {
        if (mStrings.containsKey(key)) {
            return mStrings.get(key);
        }
        return fallback != null ? fallback : key;
    }
}
