package in.gov.jharkhand.safetyar.certificate;

import android.content.Context;
import android.graphics.*;
import android.util.AttributeSet;
import android.view.View;
import in.gov.jharkhand.safetyar.R;
import in.gov.jharkhand.safetyar.data.CertificateData;

public class CertificateCanvasView extends View {
    private CertificateData mCert;
    private Bitmap mQRCodeBitmap;
    private Bitmap mAppLogo;
    private final Paint mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

    public CertificateCanvasView(Context context) {
        super(context);
        init();
    }

    public CertificateCanvasView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        try {
            mAppLogo = BitmapFactory.decodeResource(getResources(), R.drawable.app_logo);
        } catch (Exception e) {}
    }

    public void setCertificate(CertificateData cert) {
        this.mCert = cert;
        if (cert != null) {
            this.mQRCodeBitmap = QRCodeHelper.generateQRCode(cert.verificationUrl + "&hash=" + cert.signatureHash, 240);
        }
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int w = getWidth();
        int h = getHeight();
        if (w == 0 || h == 0 || mCert == null) return;

        // 1. Parchment / Gold Border Background
        canvas.drawColor(Color.parseColor("#0B132B"));

        // Outer Golden Certificate Card
        mPaint.setColor(Color.parseColor("#1E293B"));
        RectF card = new RectF(20, 20, w - 20, h - 20);
        canvas.drawRoundRect(card, 24, 24, mPaint);

        // Golden Double Filigree Border
        mPaint.setColor(Color.parseColor("#FFB300"));
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(4);
        canvas.drawRoundRect(card, 24, 24, mPaint);

        RectF innerBorder = new RectF(36, 36, w - 36, h - 36);
        mPaint.setStrokeWidth(1.5f);
        canvas.drawRoundRect(innerBorder, 16, 16, mPaint);
        mPaint.setStyle(Paint.Style.FILL);

        // 2. Government Header
        float cx = w / 2f;
        if (mAppLogo != null) {
            Rect src = new Rect(0, 0, mAppLogo.getWidth(), mAppLogo.getHeight());
            Rect dst = new Rect((int) cx - 50, 50, (int) cx + 50, 150);
            canvas.drawBitmap(mAppLogo, src, dst, null);
        }

        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setTextSize(34);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText("GOVERNMENT OF JHARKHAND", cx, 195, mPaint);

        mPaint.setColor(Color.parseColor("#94A3B8"));
        mPaint.setTextSize(22);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        canvas.drawText("Directorate of Mines & Industrial Safety", cx, 225, mPaint);

        mPaint.setColor(Color.parseColor("#FFB300"));
        mPaint.setTextSize(28);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("CERTIFICATE OF VOCATIONAL QUALIFICATION", cx, 275, mPaint);

        // 3. Worker Details Section
        mPaint.setColor(Color.parseColor("#F8FAFC"));
        mPaint.setTextSize(22);
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText("This is to certify that industrial trainee", cx, 320, mPaint);

        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setTextSize(40);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText(mCert.workerName.toUpperCase(), cx, 370, mPaint);

        mPaint.setColor(Color.parseColor("#94A3B8"));
        mPaint.setTextSize(24);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        canvas.drawText("Worker ID: " + mCert.workerId + "  •  Sector: " + mCert.sector, cx, 410, mPaint);
        canvas.drawText("District: " + mCert.district + "  •  Issued: " + mCert.issueDate, cx, 445, mPaint);

        // 4. Module Competency
        mPaint.setColor(Color.parseColor("#F8FAFC"));
        mPaint.setTextSize(22);
        canvas.drawText("has successfully completed AR simulation training & evaluation in:", cx, 490, mPaint);

        mPaint.setColor(Color.parseColor("#FFB300"));
        mPaint.setTextSize(28);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText(mCert.moduleTitle, cx, 530, mPaint);

        // Score Badge
        mPaint.setColor(Color.parseColor("#064E3B"));
        RectF scoreBadge = new RectF(cx - 160, 560, cx + 160, 615);
        canvas.drawRoundRect(scoreBadge, 16, 16, mPaint);
        mPaint.setColor(Color.parseColor("#10B981"));
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(2);
        canvas.drawRoundRect(scoreBadge, 16, 16, mPaint);
        mPaint.setStyle(Paint.Style.FILL);

        mPaint.setColor(Color.WHITE);
        mPaint.setTextSize(26);
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText("SCORE: " + String.format("%.1f", mCert.compositeScore) + "% (PASS - DISTINCTION)", cx, 597, mPaint);

        // 5. QR Code and Verification Data
        if (mQRCodeBitmap != null) {
            int qrSize = 160;
            int qrX = (int) cx - qrSize / 2;
            int qrY = 640;
            Rect src = new Rect(0, 0, mQRCodeBitmap.getWidth(), mQRCodeBitmap.getHeight());
            Rect dst = new Rect(qrX, qrY, qrX + qrSize, qrY + qrSize);
            canvas.drawBitmap(mQRCodeBitmap, src, dst, null);
        }

        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setTextSize(22);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("CERTIFICATE ID: " + mCert.certificateId, cx, 830, mPaint);

        mPaint.setColor(Color.parseColor("#64748B"));
        mPaint.setTextSize(18);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        canvas.drawText("Cryptographic Verification Hash: " + mCert.signatureHash, cx, 860, mPaint);
        canvas.drawText("Scan QR code using in-app validator to verify authenticity", cx, 885, mPaint);
    }

    public Bitmap generateFullResolutionBitmap(int width, int height) {
        Bitmap b = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(b);
        draw(c);
        return b;
    }
}
