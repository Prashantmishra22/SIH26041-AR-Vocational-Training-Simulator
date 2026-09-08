package in.gov.jharkhand.safetyar.video;

import android.content.Context;
import android.graphics.*;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import in.gov.jharkhand.safetyar.R;
import in.gov.jharkhand.safetyar.core.LocalizationEngine;
import in.gov.jharkhand.safetyar.data.ModuleConfig;

public class CartoonPlayerView extends View implements Runnable {
    private ModuleConfig mConfig;
    private int mCurrentLessonIndex = 0;
    private boolean mIsPlaying = true;
    private boolean mShowSubtitles = true;
    private float mWatchPercent = 0f;
    private Bitmap mRajuAvatar;
    private Bitmap mSceneBackground;
    private final Paint mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Handler mHandler = new Handler(Looper.getMainLooper());
    private ToneGenerator mToneGenerator;
    private OnCompletionListener mCompletionListener;
    private float mAnimationPhase = 0f;

    public interface OnCompletionListener {
        void onWatchProgressUpdated(float percent, boolean unlocked);
        void onStartARRequested();
    }

    public CartoonPlayerView(Context context) {
        super(context);
        init();
    }

    public CartoonPlayerView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        try {
            mToneGenerator = new ToneGenerator(AudioManager.STREAM_MUSIC, 70);
            mRajuAvatar = BitmapFactory.decodeResource(getResources(), R.drawable.raju_avatar);
        } catch (Exception e) {
            // ignore
        }
        mHandler.postDelayed(this, 50);
    }

    @Override
    public void run() {
        if (mIsPlaying) {
            mAnimationPhase += 0.05f;
            invalidate();
        }
        mHandler.postDelayed(this, 50);
    }

    public void setModuleConfig(ModuleConfig config, Bitmap sceneBg, OnCompletionListener listener) {
        this.mConfig = config;
        this.mSceneBackground = sceneBg;
        this.mCompletionListener = listener;
        this.mCurrentLessonIndex = 0;
        this.mWatchPercent = 8.3f; // 1/12
        this.mIsPlaying = true;
        invalidate();
    }

    public void setPlaying(boolean playing) {
        this.mIsPlaying = playing;
        invalidate();
    }

    public void nextLesson() {
        if (mConfig != null && mCurrentLessonIndex < mConfig.cartoonLessons.size() - 1) {
            mCurrentLessonIndex++;
            updateProgress();
            playAudioCue();
            invalidate();
        }
    }

    public void prevLesson() {
        if (mCurrentLessonIndex > 0) {
            mCurrentLessonIndex--;
            invalidate();
        }
    }

    public void toggleSubtitles() {
        mShowSubtitles = !mShowSubtitles;
        invalidate();
    }

    private void updateProgress() {
        if (mConfig != null && !mConfig.cartoonLessons.isEmpty()) {
            mWatchPercent = Math.min(100f, ((mCurrentLessonIndex + 1f) / mConfig.cartoonLessons.size()) * 100f);
            if (mCompletionListener != null) {
                mCompletionListener.onWatchProgressUpdated(mWatchPercent, mWatchPercent >= 90f);
            }
        }
    }

    private void playAudioCue() {
        if (mToneGenerator != null) {
            mToneGenerator.startTone(ToneGenerator.TONE_PROP_BEEP, 100);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int w = getWidth();
        int h = getHeight();
        if (w == 0 || h == 0 || mConfig == null || mConfig.cartoonLessons.isEmpty()) return;

        // 1. Draw Scene Background
        if (mSceneBackground != null) {
            Rect src = new Rect(0, 0, mSceneBackground.getWidth(), mSceneBackground.getHeight());
            Rect dst = new Rect(0, 0, w, h);
            canvas.drawBitmap(mSceneBackground, src, dst, null);
        } else {
            canvas.drawColor(Color.parseColor("#0F172A"));
        }

        // Dark gradient scrim overlay
        mPaint.setShader(new LinearGradient(0, 0, 0, h,
                new int[]{Color.parseColor("#990B132B"), Color.parseColor("#44020617"), Color.parseColor("#E6020617")},
                null, Shader.TileMode.CLAMP));
        canvas.drawRect(0, 0, w, h, mPaint);
        mPaint.setShader(null);

        ModuleConfig.CartoonLesson lesson = mConfig.cartoonLessons.get(mCurrentLessonIndex);
        String lang = LocalizationEngine.getInstance(getContext()).getCurrentLanguage();

        // 2. Draw Top Lesson Header Card
        mPaint.setColor(Color.parseColor("#1E293B"));
        mPaint.setStyle(Paint.Style.FILL);
        RectF headerCard = new RectF(24, 24, w - 24, 130);
        canvas.drawRoundRect(headerCard, 16, 16, mPaint);
        mPaint.setColor(Color.parseColor("#00E5FF"));
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(2);
        canvas.drawRoundRect(headerCard, 16, 16, mPaint);

        // Lesson Title
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setColor(Color.parseColor("#FFB300"));
        mPaint.setTextSize(32);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("LESSON " + (mCurrentLessonIndex + 1) + " OF 12", 48, 64, mPaint);

        String lessonTitle = lang.equals("hi") ? lesson.titleHindi : (lang.equals("sat") ? lesson.titleSantali : lesson.title);
        mPaint.setColor(Color.WHITE);
        mPaint.setTextSize(36);
        canvas.drawText(lessonTitle, 48, 106, mPaint);

        // 3. Draw Character Raju Avatar (Bouncing gently)
        float bounceY = (float) Math.sin(mAnimationPhase) * 8f;
        int avatarSize = Math.min(w / 3, 260);
        int avatarX = 36;
        int avatarY = h - 420 + (int) bounceY;

        if (mRajuAvatar != null) {
            Rect src = new Rect(0, 0, mRajuAvatar.getWidth(), mRajuAvatar.getHeight());
            Rect dst = new Rect(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
            canvas.drawBitmap(mRajuAvatar, src, dst, null);
        }

        // Raju Badge
        mPaint.setColor(Color.parseColor("#FF6D00"));
        RectF badge = new RectF(avatarX, avatarY + avatarSize + 8, avatarX + avatarSize, avatarY + avatarSize + 48);
        canvas.drawRoundRect(badge, 12, 12, mPaint);
        mPaint.setColor(Color.WHITE);
        mPaint.setTextSize(24);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        mPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText("RAJU — TRAINEE", badge.centerX(), badge.centerY() + 8, mPaint);
        mPaint.setTextAlign(Paint.Align.LEFT);

        // 4. Draw Speech Balloon with Dialogue
        int balloonX = avatarX + avatarSize + 20;
        int balloonY = avatarY - 20;
        int balloonW = w - balloonX - 24;
        int balloonH = 260;

        mPaint.setColor(Color.parseColor("#1E293B"));
        RectF speechCard = new RectF(balloonX, balloonY, balloonX + balloonW, balloonY + balloonH);
        canvas.drawRoundRect(speechCard, 16, 16, mPaint);
        mPaint.setColor(Color.parseColor("#38BDF8"));
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(2);
        canvas.drawRoundRect(speechCard, 16, 16, mPaint);
        mPaint.setStyle(Paint.Style.FILL);

        // Dialogue text
        String dialogue = lang.equals("hi") ? lesson.dialogueHindi : (lang.equals("sat") ? lesson.dialogueSantali : lesson.dialogue);
        mPaint.setColor(Color.parseColor("#F8FAFC"));
        mPaint.setTextSize(28);
        mPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        drawMultiLineText(canvas, dialogue, balloonX + 16, balloonY + 40, balloonW - 32, 34);

        // 5. Draw Subtitles Box at bottom
        if (mShowSubtitles) {
            mPaint.setColor(Color.parseColor("#CC0B132B"));
            RectF subBox = new RectF(24, h - 120, w - 24, h - 30);
            canvas.drawRoundRect(subBox, 12, 12, mPaint);
            mPaint.setColor(Color.parseColor("#00E5FF"));
            mPaint.setTextSize(26);
            mPaint.setTextAlign(Paint.Align.CENTER);
            String desc = lang.equals("hi") ? lesson.descriptionHindi : (lang.equals("sat") ? lesson.descriptionSantali : lesson.description);
            canvas.drawText("[CC] " + desc, subBox.centerX(), subBox.centerY() + 8, mPaint);
            mPaint.setTextAlign(Paint.Align.LEFT);
        }

        // 6. Draw Progress Bar at top
        mPaint.setColor(Color.parseColor("#334155"));
        canvas.drawRect(0, h - 8, w, h, mPaint);
        mPaint.setColor(Color.parseColor("#00E5FF"));
        canvas.drawRect(0, h - 8, (w * (mWatchPercent / 100f)), h, mPaint);
    }

    private void drawMultiLineText(Canvas canvas, String text, float x, float y, float maxWidth, float lineHeight) {
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();
        float currentY = y;

        for (String word : words) {
            String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
            float measuredWidth = mPaint.measureText(testLine);
            if (measuredWidth > maxWidth && currentLine.length() > 0) {
                canvas.drawText(currentLine.toString(), x, currentY, mPaint);
                currentLine = new StringBuilder(word);
                currentY += lineHeight;
            } else {
                currentLine = new StringBuilder(testLine);
            }
        }
        if (currentLine.length() > 0) {
            canvas.drawText(currentLine.toString(), x, currentY, mPaint);
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_UP) {
            float x = event.getX();
            int w = getWidth();
            if (x < w * 0.35f) {
                prevLesson();
            } else {
                nextLesson();
            }
            return true;
        }
        return true;
    }
}
