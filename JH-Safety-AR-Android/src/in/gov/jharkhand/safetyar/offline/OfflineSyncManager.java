package in.gov.jharkhand.safetyar.offline;

import android.content.Context;
import android.util.Log;

import in.gov.jharkhand.safetyar.network.ApiClient;
import in.gov.jharkhand.safetyar.network.ApiConfig;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class OfflineSyncManager {
    private static final String TAG = "OfflineSyncManager";
    private static OfflineSyncManager sInstance;

    private final Context mContext;
    private final OfflineDatabaseHelper mDb;

    public interface SyncCallback {
        void onComplete(boolean success, int syncedCount, String message);
    }

    public static synchronized OfflineSyncManager getInstance(Context context) {
        if (sInstance == null) {
            sInstance = new OfflineSyncManager(context.getApplicationContext());
        }
        return sInstance;
    }

    private OfflineSyncManager(Context context) {
        this.mContext = context;
        this.mDb = new OfflineDatabaseHelper(context);
    }

    public int getPendingCount() {
        return mDb.getPendingSyncCount();
    }

    public void recordTrainingAttempt(String moduleId, float practicalScore, float theoryScore, SyncCallback callback) {
        float composite = (practicalScore * 0.6f) + (theoryScore * 0.4f);
        boolean passed = composite >= 70.0f;
        String workerId = ApiConfig.getWorkerId(mContext);

        String attemptId = "AT-" + workerId.replaceAll("[^a-zA-Z0-9]", "") + "-" + System.currentTimeMillis();

        mDb.saveAttempt(attemptId, workerId, moduleId, practicalScore, theoryScore, composite, passed);

        JSONObject payload = new JSONObject();
        try {
            payload.put("attempt_id", attemptId);
            payload.put("module_id", moduleId);
            payload.put("score", Math.round(composite));
            payload.put("passed", passed);
            payload.put("ar_score", Math.round(practicalScore));
            payload.put("knowledge_score", Math.round(theoryScore));
            payload.put("duration_seconds", 240);
            payload.put("correct_answers", Math.min(10, Math.max(0, Math.round(theoryScore / 10f))));
            payload.put("incorrect_answers", Math.max(0, 10 - Math.min(10, Math.round(theoryScore / 10f))));
            payload.put("completed_at", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US).format(new Date()));
        } catch (Exception e) {
            Log.e(TAG, "Error building payload", e);
        }

        ApiClient.post(mContext, "/api/attempts", payload, new DirectAttemptCallback(mDb, attemptId, payload.toString(), callback));
    }

    private static class DirectAttemptCallback implements ApiClient.ApiCallback {
        private final OfflineDatabaseHelper mDb;
        private final String mAttemptId;
        private final String mPayloadStr;
        private final SyncCallback mCallback;

        public DirectAttemptCallback(OfflineDatabaseHelper db, String attemptId, String payloadStr, SyncCallback callback) {
            this.mDb = db;
            this.mAttemptId = attemptId;
            this.mPayloadStr = payloadStr;
            this.mCallback = callback;
        }

        @Override
        public void onSuccess(int statusCode, String response) {
            Log.d(TAG, "Direct online attempt recorded: " + response);
            if (mCallback != null) {
                mCallback.onComplete(true, 1, "Attempt synced with State Registry");
            }
        }

        @Override
        public void onError(int statusCode, String errorMessage) {
            Log.w(TAG, "Online attempt submission failed, queuing for offline sync: " + errorMessage);
            mDb.enqueueSync(mAttemptId, "ATTEMPT", mPayloadStr);
            if (mCallback != null) {
                mCallback.onComplete(false, 0, "Network offline: Saved to local sync queue");
            }
        }
    }

    public void flushSyncQueue(SyncCallback callback) {
        List<OfflineDatabaseHelper.SyncQueueItem> pending = mDb.getPendingSyncItems();
        if (pending.isEmpty()) {
            if (callback != null) {
                callback.onComplete(true, 0, "No pending records to sync");
            }
            return;
        }

        try {
            JSONArray recordsArray = new JSONArray();
            for (OfflineDatabaseHelper.SyncQueueItem item : pending) {
                try {
                    recordsArray.put(new JSONObject(item.payloadJson));
                } catch (Exception e) {}
            }

            JSONObject syncRequest = new JSONObject();
            syncRequest.put("device_id", "ANDR-" + ApiConfig.getWorkerId(mContext) + "-" + android.os.Build.MODEL);
            syncRequest.put("records", recordsArray);

            ApiClient.post(mContext, "/api/sync/", syncRequest, new BatchSyncCallback(mDb, pending, callback));
        } catch (Exception e) {
            if (callback != null) {
                callback.onComplete(false, 0, "Sync preparation error: " + e.getMessage());
            }
        }
    }

    private static class BatchSyncCallback implements ApiClient.ApiCallback {
        private final OfflineDatabaseHelper mDb;
        private final List<OfflineDatabaseHelper.SyncQueueItem> mPending;
        private final SyncCallback mCallback;

        public BatchSyncCallback(OfflineDatabaseHelper db, List<OfflineDatabaseHelper.SyncQueueItem> pending, SyncCallback callback) {
            this.mDb = db;
            this.mPending = pending;
            this.mCallback = callback;
        }

        @Override
        public void onSuccess(int statusCode, String response) {
            for (OfflineDatabaseHelper.SyncQueueItem item : mPending) {
                mDb.deleteSyncItem(item.id);
            }
            Log.d(TAG, "Batch sync successful: " + response);
            if (mCallback != null) {
                mCallback.onComplete(true, mPending.size(), "Synchronized " + mPending.size() + " records to State Registry");
            }
        }

        @Override
        public void onError(int statusCode, String errorMessage) {
            Log.e(TAG, "Batch sync failed: " + errorMessage);
            if (mCallback != null) {
                mCallback.onComplete(false, 0, "Sync failed: " + errorMessage);
            }
        }
    }
}
