package in.gov.jharkhand.safetyar.offline;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import in.gov.jharkhand.safetyar.data.CertificateData;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class OfflineDatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "jh_safety_ar_offline.db";
    private static final int DATABASE_VERSION = 2;

    public static final String TABLE_ATTEMPTS = "attempts";
    public static final String TABLE_CERTIFICATES = "certificates";
    public static final String TABLE_SYNC_QUEUE = "sync_queue";

    public static class SyncQueueItem {
        public long id;
        public String payloadType;
        public String payloadJson;
        public String status;
        public String createdAt;
    }

    public OfflineDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS " + TABLE_ATTEMPTS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "attempt_id TEXT UNIQUE, " +
                "worker_id TEXT, " +
                "module_id TEXT, " +
                "practical_score REAL, " +
                "theory_score REAL, " +
                "composite_score REAL, " +
                "passed INTEGER, " +
                "timestamp TEXT);");

        db.execSQL("CREATE TABLE IF NOT EXISTS " + TABLE_CERTIFICATES + " (" +
                "certificate_id TEXT PRIMARY KEY, " +
                "worker_name TEXT, " +
                "worker_id TEXT, " +
                "sector TEXT, " +
                "district TEXT, " +
                "module_id TEXT, " +
                "module_title TEXT, " +
                "composite_score REAL, " +
                "issue_date TEXT, " +
                "verification_url TEXT, " +
                "hash TEXT);");

        db.execSQL("CREATE TABLE IF NOT EXISTS " + TABLE_SYNC_QUEUE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "attempt_id TEXT UNIQUE, " +
                "payload_type TEXT, " +
                "payload_json TEXT, " +
                "status TEXT, " +
                "created_at TEXT);");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ATTEMPTS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CERTIFICATES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SYNC_QUEUE);
        onCreate(db);
    }

    public void saveCertificate(CertificateData cert) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("certificate_id", cert.certificateId);
        cv.put("worker_name", cert.workerName);
        cv.put("worker_id", cert.workerId);
        cv.put("sector", cert.sector);
        cv.put("district", cert.district);
        cv.put("module_id", cert.moduleId);
        cv.put("module_title", cert.moduleTitle);
        cv.put("composite_score", cert.compositeScore);
        cv.put("issue_date", cert.issueDate);
        cv.put("verification_url", cert.verificationUrl);
        cv.put("hash", cert.signatureHash);
        db.insertWithOnConflict(TABLE_CERTIFICATES, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public List<CertificateData> getAllCertificates() {
        List<CertificateData> list = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_CERTIFICATES + " ORDER BY issue_date DESC", null);
        if (cursor.moveToFirst()) {
            do {
                CertificateData cert = new CertificateData();
                cert.certificateId = cursor.getString(cursor.getColumnIndexOrThrow("certificate_id"));
                cert.workerName = cursor.getString(cursor.getColumnIndexOrThrow("worker_name"));
                cert.workerId = cursor.getString(cursor.getColumnIndexOrThrow("worker_id"));
                cert.sector = cursor.getString(cursor.getColumnIndexOrThrow("sector"));
                cert.district = cursor.getString(cursor.getColumnIndexOrThrow("district"));
                cert.moduleId = cursor.getString(cursor.getColumnIndexOrThrow("module_id"));
                cert.moduleTitle = cursor.getString(cursor.getColumnIndexOrThrow("module_title"));
                cert.compositeScore = cursor.getFloat(cursor.getColumnIndexOrThrow("composite_score"));
                cert.issueDate = cursor.getString(cursor.getColumnIndexOrThrow("issue_date"));
                cert.verificationUrl = cursor.getString(cursor.getColumnIndexOrThrow("verification_url"));
                cert.signatureHash = cursor.getString(cursor.getColumnIndexOrThrow("hash"));
                cert.isValid = true;
                list.add(cert);
            } while (cursor.moveToNext());
        }
        cursor.close();
        return list;
    }

    public CertificateData findCertificate(String certId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_CERTIFICATES + " WHERE certificate_id = ? OR certificate_id LIKE ?",
                new String[]{certId, "%" + certId + "%"});
        CertificateData cert = null;
        if (cursor.moveToFirst()) {
            cert = new CertificateData();
            cert.certificateId = cursor.getString(cursor.getColumnIndexOrThrow("certificate_id"));
            cert.workerName = cursor.getString(cursor.getColumnIndexOrThrow("worker_name"));
            cert.workerId = cursor.getString(cursor.getColumnIndexOrThrow("worker_id"));
            cert.sector = cursor.getString(cursor.getColumnIndexOrThrow("sector"));
            cert.district = cursor.getString(cursor.getColumnIndexOrThrow("district"));
            cert.moduleId = cursor.getString(cursor.getColumnIndexOrThrow("module_id"));
            cert.moduleTitle = cursor.getString(cursor.getColumnIndexOrThrow("module_title"));
            cert.compositeScore = cursor.getFloat(cursor.getColumnIndexOrThrow("composite_score"));
            cert.issueDate = cursor.getString(cursor.getColumnIndexOrThrow("issue_date"));
            cert.verificationUrl = cursor.getString(cursor.getColumnIndexOrThrow("verification_url"));
            cert.signatureHash = cursor.getString(cursor.getColumnIndexOrThrow("hash"));
            cert.isValid = true;
        }
        cursor.close();
        return cert;
    }

    // ──────────────────────────────────────────────
    // ATTEMPT RECORDING & QUEUE OPERATIONS
    // ──────────────────────────────────────────────

    public void saveAttempt(String attemptId, String workerId, String moduleId, float practical, float theory, float composite, boolean passed) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("attempt_id", attemptId);
        cv.put("worker_id", workerId);
        cv.put("module_id", moduleId);
        cv.put("practical_score", practical);
        cv.put("theory_score", theory);
        cv.put("composite_score", composite);
        cv.put("passed", passed ? 1 : 0);
        cv.put("timestamp", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date()));
        db.insertWithOnConflict(TABLE_ATTEMPTS, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public long enqueueSync(String attemptId, String payloadType, String payloadJson) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("attempt_id", attemptId);
        cv.put("payload_type", payloadType);
        cv.put("payload_json", payloadJson);
        cv.put("status", "PENDING");
        cv.put("created_at", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date()));
        return db.insertWithOnConflict(TABLE_SYNC_QUEUE, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public List<SyncQueueItem> getPendingSyncItems() {
        List<SyncQueueItem> list = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_SYNC_QUEUE + " WHERE status = 'PENDING' ORDER BY id ASC", null);
        if (c.moveToFirst()) {
            do {
                SyncQueueItem item = new SyncQueueItem();
                item.id = c.getLong(c.getColumnIndexOrThrow("id"));
                item.payloadType = c.getString(c.getColumnIndexOrThrow("payload_type"));
                item.payloadJson = c.getString(c.getColumnIndexOrThrow("payload_json"));
                item.status = c.getString(c.getColumnIndexOrThrow("status"));
                item.createdAt = c.getString(c.getColumnIndexOrThrow("created_at"));
                list.add(item);
            } while (c.moveToNext());
        }
        c.close();
        return list;
    }

    public void deleteSyncItem(long id) {
        SQLiteDatabase db = getWritableDatabase();
        db.delete(TABLE_SYNC_QUEUE, "id = ?", new String[]{String.valueOf(id)});
    }

    public int getPendingSyncCount() {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT COUNT(*) FROM " + TABLE_SYNC_QUEUE + " WHERE status = 'PENDING'", null);
        int count = 0;
        if (c.moveToFirst()) {
            count = c.getInt(0);
        }
        c.close();
        return count;
    }
}
