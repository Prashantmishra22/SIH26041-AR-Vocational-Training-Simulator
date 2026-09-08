package in.gov.jharkhand.safetyar.offline;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import in.gov.jharkhand.safetyar.data.CertificateData;

import java.util.ArrayList;
import java.util.List;

public class OfflineDatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "jh_safety_ar_offline.db";
    private static final int DATABASE_VERSION = 1;

    public static final String TABLE_ATTEMPTS = "attempts";
    public static final String TABLE_CERTIFICATES = "certificates";
    public static final String TABLE_SYNC_QUEUE = "sync_queue";

    public OfflineDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + TABLE_ATTEMPTS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "worker_id TEXT, " +
                "module_id TEXT, " +
                "practical_score REAL, " +
                "theory_score REAL, " +
                "composite_score REAL, " +
                "passed INTEGER, " +
                "timestamp TEXT);");

        db.execSQL("CREATE TABLE " + TABLE_CERTIFICATES + " (" +
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

        db.execSQL("CREATE TABLE " + TABLE_SYNC_QUEUE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
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
}
