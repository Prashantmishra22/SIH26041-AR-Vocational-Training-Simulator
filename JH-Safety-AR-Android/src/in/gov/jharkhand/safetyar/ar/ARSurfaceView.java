package in.gov.jharkhand.safetyar.ar;

import android.content.Context;
import android.graphics.*;
import android.hardware.Camera;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import in.gov.jharkhand.safetyar.R;
import in.gov.jharkhand.safetyar.core.LocalizationEngine;
import in.gov.jharkhand.safetyar.data.ModuleConfig;

import java.io.IOException;

public class ARSurfaceView extends SurfaceView implements SurfaceHolder.Callback {
    private Camera mCamera;
    private SurfaceHolder mHolder;
    private ModuleConfig mModuleConfig;
    private int mCurrentTaskIndex = 0;
    private int mTotalPoints = 0;
    private int mMaxPoints = 0;
    private String mFeedbackText = "";
    private int mFeedbackColor = Color.GREEN;
    private long mFeedbackExpireTime = 0;
    private final Paint mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private ToneGenerator mTone;
    private float mAnimPhase = 0f;
    private Bitmap mSceneBgFallback;
    private boolean mCameraAvailable = false;
    private OnARFinishedListener mFinishedListener;

    public interface OnARFinishedListener {
        void onStepCompleted(int step, int pointsEarned);
        void onModuleCompleted(float practicalScorePercent);
    }

    public ARSurfaceView(Context context) {
        super(context);
        init();
    }

    public ARSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        mHolder = getHolder();
        mHolder.addCallback(this);
        setWillNotDraw(false);
        try {
            mTone = new ToneGenerator(AudioManager.STREAM_MUSIC, 80);
        } catch (Exception e) {}
    }

    public void setupModule(ModuleConfig config, Bitmap sceneBg, OnARFinishedListener listener) {
        this.mModuleConfig = config;
        this.mSceneBgFallback = sceneBg;
        this.mFinishedListener = listener;
        this.mCurrentTaskIndex = 0;
        this.mTotalPoints = 0;
        this.mMaxPoints = 0;
        if (config != null) {
            for (ModuleConfig.ARTask t : config.arTasks) {
                mMaxPoints += t.points;
            }
        }
        invalidate();
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        try {
            mCamera = Camera.open();
            mCamera.setDisplayOrientation(90);
            mCamera.setPreviewDisplay(holder);
            mCamera.startPreview();
            mCameraAvailable = true;
        } catch (Exception e) {
            mCameraAvailable = false;
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        if (mCamera != null) {
            try {
                mCamera.stopPreview();
                mCamera.setPreviewDisplay(holder);
                mCamera.startPreview();
            } catch (Exception e) {}
        }
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        if (mCamera != null) {
            mCamera.stopPreview();
            mCamera.release();
            mCamera = null;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int w = getWidth();
        int h = getHeight();
        if (w == 0 || h == 0) return;

        mAnimPhase += 0.08f;

        // If camera not available, draw fallback industrial 3D simulation background
        if (!mCameraAvailable && mSceneBgFallback != null) {
            Rect src = new Rect(0, 0, mSceneBgFallback.getWidth(), mSceneBgFallback.getHeight());
            Rect dst = new Rect(0, 0, w, h);
            canvas.drawBitmap(mSceneBgFallback, src, dst, null);
        }

        // Draw AR Grid / Spatial Surface Plane Detection overlay
        drawARSurfaceGrid(canvas, w, h);

        if (mModuleConfig == null || mModuleConfig.arTasks.isEmpty()) return;

        ModuleConfig.ARTask task = mModuleConfig.arTasks.get(mCurrentTaskIndex);
        String lang = LocalizationEngine.getInstance(getContext()).getCurrentLanguage();

        // Draw Holographic AR Interactive Target based on current task
        drawARTargetObject(canvas, w, h, task);

        // Draw HUD Header with Step Instruction
        drawHUDHeader(canvas, w, h, task, lang);

        // Draw Real-Time Feedback Banner if active
        if (System.currentTimeMillis() < mFeedbackExpireTime && !mFeedbackText.isEmpty()) {
            drawFeedbackBanner(canvas, w, h);
        }

        // Continuous redraw loop for AR animations
        invalidate();
    }

    private void drawARSurfaceGrid(Canvas canvas, int w, int h) {
        mPaint.setColor(Color.parseColor("#4000E5FF"));
        mPaint.setStrokeWidth(1.5f);
        mPaint.setStyle(Paint.Style.STROKE);

        // Perspective grid on ground
        int groundY = (int) (h * 0.65f);
        for (int i = 0; i < w; i += 80) {
            canvas.drawLine(i, groundY, (i - w / 2) * 2 + w / 2, h, mPaint);
        }
        for (int y = groundY; y < h; y += 50) {
            canvas.drawLine(0, y, w, y, mPaint);
        }

        // Center reticle
        float cx = w / 2f;
        float cy = h / 2f;
        float pulse = (float) Math.sin(mAnimPhase) * 6f;
        mPaint.setColor(Color.parseColor("#00E5FF"));
        canvas.drawCircle(cx, cy, 32 + pulse, mPaint);
        canvas.drawLine(cx - 50, cy, cx + 50, cy, mPaint);
        canvas.drawLine(cx, cy - 50, cx, cy + 50, mPaint);
    }

    private void drawARTargetObject(Canvas canvas, int w, int h, ModuleConfig.ARTask task) {
        float cx = w / 2f;
        float cy = h / 2f + 40;
        float glow = (float) (Math.sin(mAnimPhase * 2) * 15f);

        mPaint.setStyle(Paint.Style.FILL);
        if (task.targetObject.contains("fire") || task.targetObject.contains("hotspot")) {
            // Glowing Fire Hazard 3D Hologram
            mPaint.setColor(Color.parseColor("#D9FF1744"));
            canvas.drawCircle(cx, cy, 75 + glow, mPaint);
            mPaint.setColor(Color.parseColor("#FFFFB300"));
            canvas.drawCircle(cx, cy - 10, 50 + glow * 0.6f, mPaint);
            mPaint.setColor(Color.WHITE);
            canvas.drawCircle(cx, cy - 20, 25, mPaint);

            drawTargetLabel(canvas, cx, cy - 110, "🔥 DANGER: FIRE HAZARD [TAP]");
        } else if (task.targetObject.contains("alarm")) {
            // Emergency Alarm Station
            mPaint.setColor(Color.parseColor("#E6EF4444"));
            RectF alarmBox = new RectF(cx - 70, cy - 70, cx + 70, cy + 70);
            canvas.drawRoundRect(alarmBox, 16, 16, mPaint);
            mPaint.setColor(Color.WHITE);
            mPaint.setTextSize(32);
            mPaint.setTextAlign(Paint.Align.CENTER);
            canvas.drawText("PULL ALARM", cx, cy + 10, mPaint);
            drawTargetLabel(canvas, cx, cy - 90, "🚨 EMERGENCY ALARM [TAP]");
        } else if (task.targetObject.contains("dcp") || task.targetObject.contains("extinguisher")) {
            // DCP Extinguisher (Correct) vs Water (Incorrect)
            mPaint.setColor(Color.parseColor("#E600E5FF"));
            RectF dcpBox = new RectF(cx - 140, cy - 80, cx - 20, cy + 80);
            canvas.drawRoundRect(dcpBox, 16, 16, mPaint);
            mPaint.setColor(Color.BLACK);
            mPaint.setTextSize(26);
            mPaint.setTextAlign(Paint.Align.CENTER);
            canvas.drawText("DCP", dcpBox.centerX(), dcpBox.centerY() - 10, mPaint);
            canvas.drawText("ABC", dcpBox.centerX(), dcpBox.centerY() + 20, mPaint);

            mPaint.setColor(Color.parseColor("#8064748B"));
            RectF waterBox = new RectF(cx + 20, cy - 80, cx + 140, cy + 80);
            canvas.drawRoundRect(waterBox, 16, 16, mPaint);
            mPaint.setColor(Color.WHITE);
            canvas.drawText("WATER", waterBox.centerX(), waterBox.centerY() + 6, mPaint);

            drawTargetLabel(canvas, cx, cy - 110, "🧯 SELECT DCP EXTINGUISHER [TAP LEFT]");
        } else if (task.targetObject.contains("gas") || task.targetObject.contains("plume")) {
            // Toxic Gas Plume
            mPaint.setColor(Color.parseColor("#B338BDF8"));
            canvas.drawCircle(cx, cy, 80 + glow, mPaint);
            mPaint.setColor(Color.parseColor("#E600E5FF"));
            canvas.drawCircle(cx - 20, cy - 20, 45, mPaint);
            drawTargetLabel(canvas, cx, cy - 110, "⚠️ TOXIC GAS PLUME (CH4 4.8%) [TAP]");
        } else {
            // Evacuation Lifeline & Assembly Point
            mPaint.setColor(Color.parseColor("#E600E676"));
            canvas.drawCircle(cx, cy, 70 + glow, mPaint);
            mPaint.setColor(Color.WHITE);
            mPaint.setTextSize(32);
            mPaint.setTextAlign(Paint.Align.CENTER);
            canvas.drawText("SAFE EXIT", cx, cy + 10, mPaint);
            drawTargetLabel(canvas, cx, cy - 100, "🟢 SECURE SAFE ZONE [TAP]");
        }
    }

    private void drawTargetLabel(Canvas canvas, float x, float y, String text) {
        mPaint.setColor(Color.parseColor("#CC0B132B"));
        Rect bounds = new Rect();
        mPaint.setTextSize(28);
        mPaint.getTextBounds(text, 0, text.length(), bounds);
        RectF labelCard = new RectF(x - bounds.width() / 2f - 20, y - bounds.height() - 10, x + bounds.width() / 2f + 20, y + 10);
        canvas.drawRoundRect(labelCard, 12, 12, mPaint);

        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText(text, x, y, mPaint);
        mPaint.setTextAlign(Paint.Align.LEFT);
    }

    private void drawHUDHeader(Canvas canvas, int w, int h, ModuleConfig.ARTask task, String lang) {
        mPaint.setColor(Color.parseColor("#E60F172A"));
        RectF hud = new RectF(20, 30, w - 20, 190);
        canvas.drawRoundRect(hud, 16, 16, mPaint);
        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(2);
        canvas.drawRoundRect(hud, 16, 16, mPaint);
        mPaint.setStyle(Paint.Style.FILL);

        mPaint.setColor(Color.parseColor("#FFB300"));
        mPaint.setTextSize(28);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("AR STEP " + (mCurrentTaskIndex + 1) + " OF " + mModuleConfig.arTasks.size(), 40, 70, mPaint);

        String inst = lang.equals("hi") ? task.instructionHindi : (lang.equals("sat") ? task.instructionSantali : task.instruction);
        mPaint.setColor(Color.WHITE);
        mPaint.setTextSize(30);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        canvas.drawText(inst, 40, 115, mPaint);

        mPaint.setColor(Color.parseColor("#38BDF8"));
        mPaint.setTextSize(24);
        canvas.drawText("Score Earned: " + mTotalPoints + " / " + mMaxPoints + " pts", 40, 155, mPaint);
    }

    private void drawFeedbackBanner(Canvas canvas, int w, int h) {
        mPaint.setColor(mFeedbackColor);
        RectF banner = new RectF(30, h / 2f - 70, w - 30, h / 2f + 70);
        canvas.drawRoundRect(banner, 20, 20, mPaint);

        mPaint.setColor(Color.WHITE);
        mPaint.setTextSize(36);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText(mFeedbackText, banner.centerX(), banner.centerY() + 12, mPaint);
        mPaint.setTextAlign(Paint.Align.LEFT);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_UP) {
            handleARTap(event.getX(), event.getY());
            return true;
        }
        return true;
    }

    private void handleARTap(float x, float y) {
        if (mModuleConfig == null || mCurrentTaskIndex >= mModuleConfig.arTasks.size()) return;

        ModuleConfig.ARTask currentTask = mModuleConfig.arTasks.get(mCurrentTaskIndex);
        boolean isCorrect = true;

        // Check if tapping correct option for extinguisher
        if (currentTask.targetObject.contains("dcp")) {
            if (x > getWidth() / 2f) {
                isCorrect = false; // Tapped water bucket instead of DCP
            }
        }

        if (isCorrect) {
            mTotalPoints += currentTask.points;
            showFeedback("✓ CORRECT ACTION COMPLETED!", Color.parseColor("#064E3B"));
            if (mTone != null) mTone.startTone(ToneGenerator.TONE_PROP_PROMPT, 150);

            if (mFinishedListener != null) {
                mFinishedListener.onStepCompleted(mCurrentTaskIndex + 1, currentTask.points);
            }

            mCurrentTaskIndex++;
            if (mCurrentTaskIndex >= mModuleConfig.arTasks.size()) {
                float finalPercent = mMaxPoints > 0 ? ((float) mTotalPoints / mMaxPoints) * 100f : 100f;
                if (mFinishedListener != null) {
                    mFinishedListener.onModuleCompleted(finalPercent);
                }
            }
        } else {
            showFeedback("✕ INCORRECT! WATER CAUSES SHOCK!", Color.parseColor("#7F1D1D"));
            if (mTone != null) mTone.startTone(ToneGenerator.TONE_PROP_BEEP2, 300);
        }
    }

    private void showFeedback(String text, int color) {
        mFeedbackText = text;
        mFeedbackColor = color;
        mFeedbackExpireTime = System.currentTimeMillis() + 1800;
        invalidate();
    }
}
