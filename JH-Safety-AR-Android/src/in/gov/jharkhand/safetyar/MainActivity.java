package in.gov.jharkhand.safetyar;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.*;
import in.gov.jharkhand.safetyar.ar.ARSurfaceView;
import in.gov.jharkhand.safetyar.certificate.CertificateCanvasView;
import in.gov.jharkhand.safetyar.core.LocalizationEngine;
import in.gov.jharkhand.safetyar.data.*;
import in.gov.jharkhand.safetyar.network.ApiClient;
import in.gov.jharkhand.safetyar.network.ApiConfig;
import in.gov.jharkhand.safetyar.network.WebSocketClient;
import in.gov.jharkhand.safetyar.offline.OfflineDatabaseHelper;
import in.gov.jharkhand.safetyar.offline.OfflineSyncManager;
import in.gov.jharkhand.safetyar.video.CartoonPlayerView;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class MainActivity extends Activity implements View.OnClickListener {

    private FrameLayout mRootContainer;
    private WorkerProfile mCurrentWorker;
    private LocalizationEngine mLoc;
    private OfflineDatabaseHelper mDb;

    private ModuleConfig mFireModule;
    private ModuleConfig mGasModule;
    private List<QuestionItem> mFireQuestions = new ArrayList<>();
    private List<QuestionItem> mGasQuestions = new ArrayList<>();
    private List<DemoVideoItem> mDemoVideos = new ArrayList<>();

    private String mActiveModuleId = "module_fire";
    private float mLastPracticalScore = 92.0f;
    private float mLastTheoryScore = 90.0f;
    private CertificateData mActiveCertificate;

    private Bitmap mLogoBitmap;
    private Bitmap mRajuBitmap;
    private Bitmap mFireSceneBitmap;
    private Bitmap mGasSceneBitmap;

    private int mCurrentQuestionIdx = 0;
    private int mCorrectAnswersCount = 0;
    private EditText mWorkerIdInput;
    private CartoonPlayerView mActiveCartoonPlayer;

    private final Stack<Integer> mNavigationStack = new Stack<>();
    private final Map<String, Integer> mModuleStepProgressMap = new HashMap<>();
    private int mCurrentScreen = ScreenType.SPLASH;
    private boolean mIsNavigatingBack = false;

    private static final int ID_BTN_LOGIN = 1001;
    private static final int ID_BTN_DEMO = 1002;
    private static final int ID_BTN_START_AR = 1003;
    private static final int ID_BTN_PREV_LESSON = 1004;
    private static final int ID_BTN_NEXT_LESSON = 1005;
    private static final int ID_BTN_CC = 1006;
    private static final int ID_BTN_GEN_CERT = 1007;
    private static final int ID_BTN_RETRY = 1008;
    private static final int ID_BTN_VERIFY_QR = 1009;
    private static final int ID_BTN_BACK_HOME = 1010;
    private static final int ID_BTN_SYNC_REGISTRY = 1011;
    private static final int ID_BTN_SWITCH_LANG = 1012;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mLoc = LocalizationEngine.getInstance(this);
        mDb = new OfflineDatabaseHelper(this);
        mCurrentWorker = WorkerProfile.createDefaultDemoUser();

        loadBitmaps();
        loadModuleConfigs();
        loadQuestions();
        loadDemoVideos();

        CertificateData seedCert = CertificateData.generateForWorker(mCurrentWorker, "module_fire", "Mine Fire & Explosion Protocol (CMR 2017 Reg 133)", 92.0f, 90.0f);
        mDb.saveCertificate(seedCert);
        mActiveCertificate = seedCert;

        mRootContainer = new FrameLayout(this);
        mRootContainer.setBackgroundColor(Color.parseColor("#0F172A"));
        setContentView(mRootContainer);

        showSplashScreen();
    }

    public void navigateToScreen(int targetScreen) {
        if (!mIsNavigatingBack && mCurrentScreen != targetScreen && mCurrentScreen != ScreenType.SPLASH) {
            mNavigationStack.push(mCurrentScreen);
        }
        mIsNavigatingBack = false;
        mCurrentScreen = targetScreen;

        switch (targetScreen) {
            case ScreenType.DASHBOARD:
                renderDashboardScreen();
                break;
            case ScreenType.CARTOON_VIDEO:
                renderCartoonVideoScreen();
                break;
            case ScreenType.AR_TRAINING:
                renderARTrainingScreen();
                break;
            case ScreenType.ASSESSMENT:
                renderAssessmentScreen();
                break;
            case ScreenType.SCORE_RESULT:
                renderScoreResultScreen();
                break;
            case ScreenType.CERTIFICATE:
                renderCertificateScreen();
                break;
            case ScreenType.DEMO_VIDEOS:
                renderDemoVideosScreen();
                break;
            case ScreenType.PROFILE:
                renderProfileScreen();
                break;
            case ScreenType.LANGUAGE:
                renderLanguageScreen();
                break;
            case ScreenType.LOGIN:
                renderLoginScreen();
                break;
            default:
                renderDashboardScreen();
                break;
        }
    }

    public void handleBackNavigation() {
        if (!mNavigationStack.isEmpty()) {
            int prevScreen = mNavigationStack.pop();
            mIsNavigatingBack = true;
            navigateToScreen(prevScreen);
        } else if (mCurrentScreen == ScreenType.DASHBOARD || mCurrentScreen == ScreenType.LOGIN || mCurrentScreen == ScreenType.SPLASH) {
            showExitConfirmationDialog();
        } else {
            mIsNavigatingBack = true;
            navigateToScreen(ScreenType.DASHBOARD);
        }
    }

    @Override
    public void onBackPressed() {
        handleBackNavigation();
    }

    private void showExitConfirmationDialog() {
        final Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.card_login_dark);
        card.setPadding(44, 40, 44, 40);
        card.setGravity(Gravity.CENTER_HORIZONTAL);

        TextView icon = new TextView(this);
        icon.setText("🚪");
        icon.setTextSize(36);
        card.addView(icon);

        TextView title = new TextView(this);
        title.setText("Exit JH-SAFETY?");
        title.setTextSize(22);
        title.setTextColor(Color.WHITE);
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams tLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tLp.topMargin = 16;
        card.addView(title, tLp);

        TextView msg = new TextView(this);
        msg.setText("Are you sure you want to exit the application?");
        msg.setTextSize(14);
        msg.setTextColor(Color.parseColor("#94A3B8"));
        msg.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams mLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        mLp.topMargin = 10;
        mLp.bottomMargin = 30;
        card.addView(msg, mLp);

        LinearLayout btnRow = new LinearLayout(this);
        btnRow.setOrientation(LinearLayout.HORIZONTAL);

        Button btnCancel = new Button(this);
        btnCancel.setText("CANCEL");
        btnCancel.setTextColor(Color.WHITE);
        btnCancel.setBackgroundResource(R.drawable.card_bg);
        btnCancel.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        cLp.rightMargin = 16;
        btnCancel.setLayoutParams(cLp);
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        Button btnExit = new Button(this);
        btnExit.setText("EXIT");
        btnExit.setTextColor(Color.WHITE);
        btnExit.setBackgroundResource(R.drawable.card_red);
        btnExit.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams eLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        btnExit.setLayoutParams(eLp);
        btnExit.setOnClickListener(v -> {
            dialog.dismiss();
            finish();
        });

        btnRow.addView(btnCancel);
        btnRow.addView(btnExit);
        card.addView(btnRow);

        dialog.setContentView(card);
        dialog.show();
    }

    private void loadBitmaps() {
        try {
            mLogoBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.app_logo);
            mRajuBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.raju_avatar);
            mFireSceneBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.fire_scene);
            mGasSceneBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.gas_scene);
        } catch (Exception e) {}
    }

    private void loadModuleConfigs() {
        mFireModule = parseModuleJson("modules/fire_safety.json");
        mGasModule = parseModuleJson("modules/gas_leak.json");
    }

    private ModuleConfig parseModuleJson(String assetPath) {
        try {
            InputStream is = getAssets().open(assetPath);
            int size = is.available();
            byte[] buf = new byte[size];
            is.read(buf);
            is.close();
            String jsonStr = new String(buf, StandardCharsets.UTF_8);
            JSONObject obj = new JSONObject(jsonStr);

            ModuleConfig cfg = new ModuleConfig();
            cfg.id = obj.getString("id");
            cfg.title = obj.getString("title");
            cfg.titleHindi = obj.optString("titleHindi", cfg.title);
            cfg.titleSantali = obj.optString("titleSantali", cfg.title);
            cfg.sector = obj.optString("sector", "Mining");
            cfg.difficulty = obj.optString("difficulty", "Intermediate");
            cfg.estimatedMinutes = obj.optInt("estimatedMinutes", 20);

            JSONArray lessonsArr = obj.getJSONArray("cartoonLessons");
            for (int i = 0; i < lessonsArr.length(); i++) {
                JSONObject lObj = lessonsArr.getJSONObject(i);
                ModuleConfig.CartoonLesson l = new ModuleConfig.CartoonLesson();
                l.step = lObj.getInt("step");
                l.title = lObj.getString("title");
                l.titleHindi = lObj.optString("titleHindi", l.title);
                l.titleSantali = lObj.optString("titleSantali", l.title);
                l.description = lObj.getString("description");
                l.descriptionHindi = lObj.optString("descriptionHindi", l.description);
                l.descriptionSantali = lObj.optString("descriptionSantali", l.description);
                l.dialogue = lObj.getString("dialogue");
                l.dialogueHindi = lObj.optString("dialogueHindi", l.dialogue);
                l.dialogueSantali = lObj.optString("dialogueSantali", l.dialogue);
                cfg.cartoonLessons.add(l);
            }

            JSONArray arArr = obj.getJSONArray("arTasks");
            for (int i = 0; i < arArr.length(); i++) {
                JSONObject aObj = arArr.getJSONObject(i);
                ModuleConfig.ARTask t = new ModuleConfig.ARTask();
                t.step = aObj.getInt("step");
                t.title = aObj.getString("title");
                t.instruction = aObj.getString("instruction");
                t.instructionHindi = aObj.optString("instructionHindi", t.instruction);
                t.instructionSantali = aObj.optString("instructionSantali", t.instruction);
                t.targetObject = aObj.getString("targetObject");
                t.points = aObj.optInt("points", 10);
                cfg.arTasks.add(t);
            }
            return cfg;
        } catch (Exception e) {
            return new ModuleConfig();
        }
    }

    private void loadQuestions() {
        mFireQuestions = parseQuestionsJson("questions/fire_questions.json");
        mGasQuestions = parseQuestionsJson("questions/gas_questions.json");
    }

    private List<QuestionItem> parseQuestionsJson(String path) {
        List<QuestionItem> list = new ArrayList<>();
        try {
            InputStream is = getAssets().open(path);
            int size = is.available();
            byte[] buf = new byte[size];
            is.read(buf);
            is.close();
            String jsonStr = new String(buf, StandardCharsets.UTF_8);
            JSONArray arr = new JSONArray(jsonStr);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                QuestionItem q = new QuestionItem();
                q.id = obj.getInt("id");
                q.question = obj.getString("question");
                q.questionHindi = obj.optString("questionHindi", q.question);
                q.questionSantali = obj.optString("questionSantali", q.question);
                q.correctIndex = obj.getInt("correctIndex");
                q.explanation = obj.optString("explanation", "");

                JSONArray opts = obj.getJSONArray("options");
                for (int j = 0; j < opts.length(); j++) q.options.add(opts.getString(j));

                JSONArray optsHi = obj.optJSONArray("optionsHindi");
                if (optsHi != null) {
                    for (int j = 0; j < optsHi.length(); j++) q.optionsHindi.add(optsHi.getString(j));
                }
                JSONArray optsSat = obj.optJSONArray("optionsSantali");
                if (optsSat != null) {
                    for (int j = 0; j < optsSat.length(); j++) q.optionsSantali.add(optsSat.getString(j));
                }
                list.add(q);
            }
        } catch (Exception e) {}
        return list;
    }

    private void loadDemoVideos() {
        try {
            InputStream is = getAssets().open("demo_videos/demo_catalog.json");
            int size = is.available();
            byte[] buf = new byte[size];
            is.read(buf);
            is.close();
            String jsonStr = new String(buf, StandardCharsets.UTF_8);
            JSONArray arr = new JSONArray(jsonStr);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                DemoVideoItem item = new DemoVideoItem();
                item.id = obj.getString("id");
                item.title = obj.getString("title");
                item.titleHindi = obj.optString("titleHindi", item.title);
                item.titleSantali = obj.optString("titleSantali", item.title);
                item.category = obj.getString("category");
                item.durationSeconds = obj.getInt("durationSeconds");
                item.thumbnail = obj.getString("thumbnail");
                item.problem = obj.getString("problem");
                item.problemHindi = obj.optString("problemHindi", item.problem);
                item.problemSantali = obj.optString("problemSantali", item.problem);
                item.hazard = obj.getString("hazard");
                item.hazardHindi = obj.optString("hazardHindi", item.hazard);
                item.hazardSantali = obj.optString("hazardSantali", item.hazard);
                item.response = obj.getString("response");
                item.responseHindi = obj.optString("responseHindi", item.response);
                item.responseSantali = obj.optString("responseSantali", item.response);
                item.safeOutcome = obj.getString("safeOutcome");
                item.safeOutcomeHindi = obj.optString("safeOutcomeHindi", item.safeOutcome);
                item.safeOutcomeSantali = obj.optString("safeOutcomeSantali", item.safeOutcome);
                item.targetModuleId = obj.optString("targetModuleId", "module_fire");

                JSONArray proc = obj.getJSONArray("procedure");
                for (int j = 0; j < proc.length(); j++) item.procedure.add(proc.getString(j));

                JSONArray procHi = obj.optJSONArray("procedureHindi");
                if (procHi != null) {
                    for (int j = 0; j < procHi.length(); j++) item.procedureHindi.add(procHi.getString(j));
                }
                JSONArray procSat = obj.optJSONArray("procedureSantali");
                if (procSat != null) {
                    for (int j = 0; j < procSat.length(); j++) item.procedureSantali.add(procSat.getString(j));
                }
                mDemoVideos.add(item);
            }
        } catch (Exception e) {}
    }

    private static class SplashHandler implements Runnable {
        private final MainActivity mActivity;
        public SplashHandler(MainActivity act) { this.mActivity = act; }
        @Override
        public void run() {
            mActivity.showLanguageScreen();
        }
    }

    private void showSplashScreen() {
        mRootContainer.removeAllViews();

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundColor(Color.parseColor("#0F172A"));
        layout.setPadding(40, 40, 40, 40);

        if (mLogoBitmap != null) {
            ImageView logo = new ImageView(this);
            logo.setImageBitmap(mLogoBitmap);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(400, 400);
            lp.bottomMargin = 30;
            layout.addView(logo, lp);
        }

        TextView title = new TextView(this);
        title.setText("JH SAFETY AR");
        title.setTextSize(36);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        title.setGravity(Gravity.CENTER);
        layout.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Industrial Safety Training & Certification");
        subtitle.setTextSize(18);
        subtitle.setTextColor(Color.parseColor("#FFB300"));
        subtitle.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        subLp.topMargin = 10;
        layout.addView(subtitle, subLp);

        TextView govt = new TextView(this);
        govt.setText("Directorate of Mines & Industrial Safety\nGovernment of Jharkhand");
        govt.setTextSize(14);
        govt.setTextColor(Color.parseColor("#94A3B8"));
        govt.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams govtLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        govtLp.topMargin = 40;
        layout.addView(govt, govtLp);

        ProgressBar pb = new ProgressBar(this);
        LinearLayout.LayoutParams pbLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        pbLp.topMargin = 50;
        layout.addView(pb, pbLp);

        mRootContainer.addView(layout);

        new Handler(Looper.getMainLooper()).postDelayed(new SplashHandler(this), 2200);
    }

    private static class LangClickListener implements View.OnClickListener {
        private final MainActivity mActivity;
        private final String mLang;
        public LangClickListener(MainActivity act, String lang) {
            this.mActivity = act;
            this.mLang = lang;
        }
        @Override
        public void onClick(View v) {
            mActivity.mLoc.setLanguage(mLang);
            mActivity.mCurrentWorker.selectedLanguage = mLang;
            mActivity.showLoginScreen();
        }
    }

    public void showLanguageScreen() {
        navigateToScreen(ScreenType.LANGUAGE);
    }

    private void renderLanguageScreen() {
        mRootContainer.removeAllViews();

        ScrollView sv = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER_HORIZONTAL);
        layout.setPadding(36, 60, 36, 60);

        if (mLogoBitmap != null) {
            ImageView logo = new ImageView(this);
            logo.setImageBitmap(mLogoBitmap);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(220, 220);
            lp.bottomMargin = 24;
            layout.addView(logo, lp);
        }

        TextView heading = new TextView(this);
        heading.setText("Select Training Language\nप्रशिक्षण भाषा चुनें / ᱥᱮᱪᱮᱫ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ");
        heading.setTextSize(22);
        heading.setTextColor(Color.parseColor("#F8FAFC"));
        heading.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        heading.setGravity(Gravity.CENTER);
        layout.addView(heading);

        layout.addView(createLanguageCard("हिंदी (Hindi)", "प्राथमिक औद्योगिक सुरक्षा प्रशिक्षण भाषा", "hi"));
        layout.addView(createLanguageCard("ᱥᱟᱱᱛᱟᱲᱤ (Santali)", "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤ", "sat"));
        layout.addView(createLanguageCard("English", "Standard Industrial & DGMS Curriculum", "en"));

        sv.addView(layout);
        mRootContainer.addView(sv);
    }

    private View createLanguageCard(String titleStr, String descStr, String langCode) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.card_bg);
        card.setPadding(30, 24, 30, 24);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = 24;
        card.setLayoutParams(lp);

        TextView title = new TextView(this);
        title.setText(titleStr);
        title.setTextSize(22);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        card.addView(title);

        TextView desc = new TextView(this);
        desc.setText(descStr);
        desc.setTextSize(14);
        desc.setTextColor(Color.parseColor("#94A3B8"));
        card.addView(desc);

        card.setOnClickListener(new LangClickListener(this, langCode));
        return card;
    }

    public void showLoginScreen() {
        navigateToScreen(ScreenType.LOGIN);
    }

    private void renderLoginScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0B1120"));

        // Top Bar with Language Selector
        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL | Gravity.END);
        topBar.setPadding(30, 24, 30, 10);

        TextView langBtn = new TextView(this);
        langBtn.setText("🌐  English ∨");
        langBtn.setTextSize(13);
        langBtn.setTextColor(Color.WHITE);
        langBtn.setBackgroundResource(R.drawable.btn_lang_dropdown);
        langBtn.setPadding(24, 12, 24, 12);
        langBtn.setOnClickListener(v -> showLanguageScreen());
        topBar.addView(langBtn);

        root.addView(topBar);

        ScrollView sv = new ScrollView(this);
        LinearLayout.LayoutParams svLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        sv.setLayoutParams(svLp);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(40, 10, 40, 40);
        layout.setGravity(Gravity.CENTER_HORIZONTAL);

        // Center Logo Branding
        if (mLogoBitmap != null) {
            ImageView logo = new ImageView(this);
            logo.setImageBitmap(mLogoBitmap);
            LinearLayout.LayoutParams lgLp = new LinearLayout.LayoutParams(160, 160);
            lgLp.bottomMargin = 10;
            layout.addView(logo, lgLp);
        }

        TextView logoTxt = new TextView(this);
        logoTxt.setText("JH-SAFETY");
        logoTxt.setTextSize(24);
        logoTxt.setTextColor(Color.WHITE);
        logoTxt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(logoTxt);

        TextView logoSub = new TextView(this);
        logoSub.setText("AR TRAINING PLATFORM");
        logoSub.setTextSize(11);
        logoSub.setTextColor(Color.parseColor("#94A3B8"));
        layout.addView(logoSub);

        TextView title = new TextView(this);
        title.setText("Login to Continue");
        title.setTextSize(22);
        title.setTextColor(Color.WHITE);
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams tLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tLp.topMargin = 16;
        layout.addView(title, tLp);

        TextView sub = new TextView(this);
        sub.setText("Access your safety training journey");
        sub.setTextSize(13);
        sub.setTextColor(Color.parseColor("#94A3B8"));
        LinearLayout.LayoutParams sLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        sLp.bottomMargin = 24;
        layout.addView(sub, sLp);

        // Login Card Container
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.card_login_dark);
        card.setPadding(30, 30, 30, 30);
        LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        card.setLayoutParams(cLp);

        // Field 1: Worker ID / Email
        TextView lblWorkerId = new TextView(this);
        lblWorkerId.setText("Worker ID / Email");
        lblWorkerId.setTextSize(13);
        lblWorkerId.setTextColor(Color.parseColor("#CBD5E1"));
        card.addView(lblWorkerId);

        mWorkerIdInput = new EditText(this);
        mWorkerIdInput.setHint("Enter your Worker ID or Email");
        mWorkerIdInput.setText(mCurrentWorker.workerId != null ? mCurrentWorker.workerId : "JH1024");
        mWorkerIdInput.setTextColor(Color.WHITE);
        mWorkerIdInput.setHintTextColor(Color.parseColor("#64748B"));
        mWorkerIdInput.setBackgroundResource(R.drawable.input_box_dark);
        mWorkerIdInput.setPadding(30, 20, 30, 20);
        LinearLayout.LayoutParams in1Lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        in1Lp.topMargin = 10;
        in1Lp.bottomMargin = 20;
        card.addView(mWorkerIdInput, in1Lp);

        // Field 2: Password
        TextView lblPassword = new TextView(this);
        lblPassword.setText("Password");
        lblPassword.setTextSize(13);
        lblPassword.setTextColor(Color.parseColor("#CBD5E1"));
        card.addView(lblPassword);

        EditText passInput = new EditText(this);
        passInput.setHint("Enter your password");
        passInput.setText("••••••••");
        passInput.setTextColor(Color.WHITE);
        passInput.setHintTextColor(Color.parseColor("#64748B"));
        passInput.setBackgroundResource(R.drawable.input_box_dark);
        passInput.setPadding(30, 20, 30, 20);
        LinearLayout.LayoutParams in2Lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        in2Lp.topMargin = 10;
        in2Lp.bottomMargin = 20;
        card.addView(passInput, in2Lp);

        // Checkbox & Link row
        LinearLayout optionRow = new LinearLayout(this);
        optionRow.setOrientation(LinearLayout.HORIZONTAL);
        optionRow.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams optLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        optLp.bottomMargin = 24;
        optionRow.setLayoutParams(optLp);

        CheckBox chkRemember = new CheckBox(this);
        chkRemember.setText("Remember me");
        chkRemember.setTextColor(Color.parseColor("#CBD5E1"));
        chkRemember.setChecked(true);
        LinearLayout.LayoutParams chkLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        optionRow.addView(chkRemember, chkLp);

        TextView forgotTxt = new TextView(this);
        forgotTxt.setText("Forgot Password?");
        forgotTxt.setTextSize(13);
        forgotTxt.setTextColor(Color.parseColor("#38BDF8"));
        optionRow.addView(forgotTxt);

        card.addView(optionRow);

        // Login Button
        Button btnLogin = new Button(this);
        btnLogin.setId(ID_BTN_LOGIN);
        btnLogin.setText("Login");
        btnLogin.setBackgroundResource(R.drawable.btn_login_yellow);
        btnLogin.setTextColor(Color.BLACK);
        btnLogin.setTextSize(16);
        btnLogin.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams btnLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 110);
        btnLogin.setLayoutParams(btnLp);
        btnLogin.setOnClickListener(this);
        card.addView(btnLogin);

        // Divider OR
        TextView divider = new TextView(this);
        divider.setText("────────  OR  ────────");
        divider.setTextSize(12);
        divider.setTextColor(Color.parseColor("#64748B"));
        divider.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams divLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        divLp.topMargin = 20;
        divLp.bottomMargin = 20;
        card.addView(divider, divLp);

        // Google Button
        Button btnGoogle = new Button(this);
        btnGoogle.setText("G  Continue with Google");
        btnGoogle.setBackgroundResource(R.drawable.input_box_dark);
        btnGoogle.setTextColor(Color.WHITE);
        btnGoogle.setTextSize(14);
        btnGoogle.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams gLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 110);
        btnGoogle.setLayoutParams(gLp);
        btnGoogle.setOnClickListener(this);
        card.addView(btnGoogle);

        // New user link
        TextView newUserTxt = new TextView(this);
        newUserTxt.setText("New user?  Create Account");
        newUserTxt.setTextSize(13);
        newUserTxt.setTextColor(Color.parseColor("#38BDF8"));
        newUserTxt.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams nuLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        nuLp.topMargin = 20;
        newUserTxt.setLayoutParams(nuLp);
        newUserTxt.setOnClickListener(v -> showDashboardScreen());
        card.addView(newUserTxt);

        layout.addView(card);

        // 3 Feature Icons Row
        LinearLayout featuresRow = new LinearLayout(this);
        featuresRow.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams frLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        frLp.topMargin = 30;
        featuresRow.setLayoutParams(frLp);

        featuresRow.addView(createFeatureItem("🛡️", "Learn\nSafety"));
        featuresRow.addView(createFeatureItem("👥", "Work\nSafer"));
        featuresRow.addView(createFeatureItem("🍃", "Build a\nBetter Jharkhand"));

        layout.addView(featuresRow);

        // Bottom Banner Quote
        LinearLayout bottomQuoteCard = new LinearLayout(this);
        bottomQuoteCard.setOrientation(LinearLayout.VERTICAL);
        bottomQuoteCard.setBackgroundResource(R.drawable.card_login_dark);
        bottomQuoteCard.setPadding(20, 24, 20, 24);
        bottomQuoteCard.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams bqcLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bqcLp.topMargin = 24;
        bottomQuoteCard.setLayoutParams(bqcLp);

        TextView bqTxt = new TextView(this);
        bqTxt.setText("“Safety is not just a rule,\nit's a way of life.”");
        bqTxt.setTextSize(15);
        bqTxt.setTextColor(Color.WHITE);
        bqTxt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.ITALIC));
        bqTxt.setGravity(Gravity.CENTER);
        bottomQuoteCard.addView(bqTxt);

        layout.addView(bottomQuoteCard);

        sv.addView(layout);
        root.addView(sv);

        mRootContainer.addView(root);
    }

    private View createFeatureItem(String iconStr, String titleStr) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        box.setLayoutParams(lp);

        TextView icon = new TextView(this);
        icon.setText(iconStr);
        icon.setTextSize(24);
        box.addView(icon);

        TextView title = new TextView(this);
        title.setText(titleStr);
        title.setTextSize(12);
        title.setTextColor(Color.WHITE);
        title.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams tLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tLp.topMargin = 6;
        title.setLayoutParams(tLp);
        box.addView(title);

        return box;
    }

    public void showDashboardScreen() {
        navigateToScreen(ScreenType.DASHBOARD);
    }

    private void renderDashboardScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0B1120"));

        // Top App Header Bar
        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        topBar.setPadding(30, 20, 30, 16);
        topBar.setBackgroundColor(Color.parseColor("#0B1120"));

        if (mLogoBitmap != null) {
            ImageView logoView = new ImageView(this);
            logoView.setImageBitmap(mLogoBitmap);
            LinearLayout.LayoutParams logoLp = new LinearLayout.LayoutParams(80, 80);
            logoLp.rightMargin = 16;
            topBar.addView(logoView, logoLp);
        }

        LinearLayout titleBox = new LinearLayout(this);
        titleBox.setOrientation(LinearLayout.VERTICAL);

        TextView appTitle = new TextView(this);
        appTitle.setText("JH-SAFETY");
        appTitle.setTextSize(20);
        appTitle.setTextColor(Color.WHITE);
        appTitle.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        titleBox.addView(appTitle);

        TextView appSub = new TextView(this);
        appSub.setText("AR TRAINING PLATFORM");
        appSub.setTextSize(10);
        appSub.setTextColor(Color.parseColor("#94A3B8"));
        titleBox.addView(appSub);

        LinearLayout.LayoutParams tbLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        topBar.addView(titleBox, tbLp);

        TextView btnBell = new TextView(this);
        btnBell.setText("🔔");
        btnBell.setTextSize(20);
        btnBell.setPadding(16, 10, 16, 10);
        btnBell.setOnClickListener(v -> Toast.makeText(this, "4 Active Safety Notifications", Toast.LENGTH_SHORT).show());
        topBar.addView(btnBell);

        TextView btnGear = new TextView(this);
        btnGear.setText("⚙️");
        btnGear.setTextSize(20);
        btnGear.setPadding(16, 10, 16, 10);
        btnGear.setOnClickListener(v -> showLanguageScreen());
        topBar.addView(btnGear);

        root.addView(topBar);

        ScrollView sv = new ScrollView(this);
        LinearLayout.LayoutParams svLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        sv.setLayoutParams(svLp);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(24, 16, 24, 24);

        // Worker Profile Header Card
        LinearLayout profileHeader = new LinearLayout(this);
        profileHeader.setOrientation(LinearLayout.HORIZONTAL);
        profileHeader.setBackgroundResource(R.drawable.card_login_dark);
        profileHeader.setPadding(24, 24, 24, 24);
        profileHeader.setGravity(Gravity.CENTER_VERTICAL);

        if (mRajuBitmap != null) {
            ImageView avatarView = new ImageView(this);
            avatarView.setImageBitmap(mRajuBitmap);
            LinearLayout.LayoutParams avLp = new LinearLayout.LayoutParams(130, 130);
            avLp.rightMargin = 20;
            profileHeader.addView(avatarView, avLp);
        }

        LinearLayout infoBox = new LinearLayout(this);
        infoBox.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams ibLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        infoBox.setLayoutParams(ibLp);

        TextView welcomeTxt = new TextView(this);
        welcomeTxt.setText("Welcome,");
        welcomeTxt.setTextSize(13);
        welcomeTxt.setTextColor(Color.parseColor("#94A3B8"));
        infoBox.addView(welcomeTxt);

        TextView nameTxt = new TextView(this);
        nameTxt.setText(mCurrentWorker.fullName);
        nameTxt.setTextSize(20);
        nameTxt.setTextColor(Color.WHITE);
        nameTxt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        infoBox.addView(nameTxt);

        TextView idTxt = new TextView(this);
        idTxt.setText("Worker ID: " + mCurrentWorker.workerId);
        idTxt.setTextSize(13);
        idTxt.setTextColor(Color.parseColor("#94A3B8"));
        infoBox.addView(idTxt);

        TextView activeBadge = new TextView(this);
        activeBadge.setText("✓ Active");
        activeBadge.setTextSize(11);
        activeBadge.setTextColor(Color.WHITE);
        activeBadge.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        activeBadge.setBackgroundResource(R.drawable.badge_active_green);
        activeBadge.setPadding(16, 6, 16, 6);
        LinearLayout.LayoutParams abLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        abLp.topMargin = 10;
        infoBox.addView(activeBadge, abLp);

        profileHeader.addView(infoBox);

        TextView sloganTxt = new TextView(this);
        sloganTxt.setText("Safe Worker\nStronger\nJharkhand");
        sloganTxt.setTextSize(13);
        sloganTxt.setTextColor(Color.parseColor("#F59E0B"));
        sloganTxt.setTypeface(Typeface.create(Typeface.SERIF, Typeface.BOLD_ITALIC));
        sloganTxt.setGravity(Gravity.END);
        profileHeader.addView(sloganTxt);

        layout.addView(profileHeader);

        // Your Training Progress Card
        LinearLayout progressCard = new LinearLayout(this);
        progressCard.setOrientation(LinearLayout.VERTICAL);
        progressCard.setBackgroundResource(R.drawable.card_login_dark);
        progressCard.setPadding(24, 20, 24, 20);
        LinearLayout.LayoutParams pcLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        pcLp.topMargin = 20;
        progressCard.setLayoutParams(pcLp);

        LinearLayout prgHeaderRow = new LinearLayout(this);
        prgHeaderRow.setOrientation(LinearLayout.HORIZONTAL);

        TextView prgTitle = new TextView(this);
        prgTitle.setText("Your Training Progress");
        prgTitle.setTextSize(15);
        prgTitle.setTextColor(Color.WHITE);
        prgTitle.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams ptLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        prgHeaderRow.addView(prgTitle, ptLp);

        TextView prgPercent = new TextView(this);
        prgPercent.setText(mCurrentWorker.trainingProgressPercent + "% Complete");
        prgPercent.setTextSize(14);
        prgPercent.setTextColor(Color.WHITE);
        prgPercent.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        prgHeaderRow.addView(prgPercent);

        progressCard.addView(prgHeaderRow);

        // Progress bar line
        View pbBg = new View(this);
        pbBg.setBackgroundColor(Color.parseColor("#10B981"));
        LinearLayout.LayoutParams pbfLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 20);
        pbfLp.topMargin = 16;
        pbfLp.bottomMargin = 16;
        pbBg.setLayoutParams(pbfLp);
        progressCard.addView(pbBg);

        LinearLayout prgFooterRow = new LinearLayout(this);
        prgFooterRow.setOrientation(LinearLayout.HORIZONTAL);

        TextView prgSub = new TextView(this);
        prgSub.setText(mCurrentWorker.completedModulesCount + " of " + mCurrentWorker.totalModulesCount + " modules completed");
        prgSub.setTextSize(13);
        prgSub.setTextColor(Color.parseColor("#94A3B8"));
        LinearLayout.LayoutParams psLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        prgFooterRow.addView(prgSub, psLp);

        TextView prgArrow = new TextView(this);
        prgArrow.setText(">");
        prgArrow.setTextSize(16);
        prgArrow.setTextColor(Color.parseColor("#94A3B8"));
        prgFooterRow.addView(prgArrow);

        progressCard.addView(prgFooterRow);
        progressCard.setOnClickListener(v -> showCartoonVideoScreen());

        layout.addView(progressCard);

        // Grid of 6 Cards (2 Columns x 3 Rows)
        LinearLayout gridLayout = new LinearLayout(this);
        gridLayout.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams glLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        glLp.topMargin = 20;
        gridLayout.setLayoutParams(glLp);

        // Row 1
        LinearLayout row1 = new LinearLayout(this);
        row1.setOrientation(LinearLayout.HORIZONTAL);
        row1.addView(createGridCard("🔥", "Training Modules >", "Learn with AR simulations", R.drawable.card_red, v -> showCartoonVideoScreen()));
        row1.addView(createGridCard("📄", "Assessments >", "Test your knowledge", R.drawable.card_blue, v -> showAssessmentScreen()));
        gridLayout.addView(row1);

        // Row 2
        LinearLayout row2 = new LinearLayout(this);
        row2.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams r2Lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        r2Lp.topMargin = 16;
        row2.setLayoutParams(r2Lp);
        row2.addView(createGridCard("📜", "My Certificates >", "View & Download", R.drawable.card_green, v -> showCertificateScreen()));
        row2.addView(createGridCard("📊", "My Progress >", "Track your learning", R.drawable.card_purple, v -> showProfileScreen()));
        gridLayout.addView(row2);

        // Row 3
        LinearLayout row3 = new LinearLayout(this);
        row3.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams r3Lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        r3Lp.topMargin = 16;
        row3.setLayoutParams(r3Lp);
        row3.addView(createGridCard("📖", "Safety Library >", "Guides & Resources", R.drawable.card_orange, v -> showDemoVideosScreen()));
        row3.addView(createGridCard("☁️", "Offline Content >", "Available for you", R.drawable.card_teal, v -> Toast.makeText(this, "Offline Content Available", Toast.LENGTH_SHORT).show()));
        gridLayout.addView(row3);

        layout.addView(gridLayout);

        // Banner Quote Card
        LinearLayout bannerCard = new LinearLayout(this);
        bannerCard.setOrientation(LinearLayout.VERTICAL);
        bannerCard.setBackgroundResource(R.drawable.card_login_dark);
        bannerCard.setPadding(26, 26, 26, 26);
        LinearLayout.LayoutParams bcLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bcLp.topMargin = 20;
        bannerCard.setLayoutParams(bcLp);

        TextView quoteTxt = new TextView(this);
        quoteTxt.setText("“A Safer Today\nfor a Brighter\nTomorrow”");
        quoteTxt.setTextSize(20);
        quoteTxt.setTextColor(Color.WHITE);
        quoteTxt.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        bannerCard.addView(quoteTxt);

        TextView subTxt = new TextView(this);
        subTxt.setText("— JH-SAFETY");
        subTxt.setTextSize(13);
        subTxt.setTextColor(Color.parseColor("#94A3B8"));
        LinearLayout.LayoutParams stLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        stLp.topMargin = 10;
        bannerCard.addView(subTxt, stLp);

        layout.addView(bannerCard);

        // Sync Status Bar
        LinearLayout syncBar = new LinearLayout(this);
        syncBar.setOrientation(LinearLayout.HORIZONTAL);
        syncBar.setBackgroundResource(R.drawable.card_login_dark);
        syncBar.setPadding(20, 16, 20, 16);
        syncBar.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams sbLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        sbLp.topMargin = 20;
        sbLp.bottomMargin = 20;
        syncBar.setLayoutParams(sbLp);

        TextView wifiIcon = new TextView(this);
        wifiIcon.setText("📶 ");
        wifiIcon.setTextSize(18);
        syncBar.addView(wifiIcon);

        LinearLayout syncTextContainer = new LinearLayout(this);
        syncTextContainer.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams stcLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        syncTextContainer.setLayoutParams(stcLp);

        TextView syncTitle = new TextView(this);
        syncTitle.setText("Sync Status");
        syncTitle.setTextSize(14);
        syncTitle.setTextColor(Color.WHITE);
        syncTitle.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        syncTextContainer.addView(syncTitle);

        TextView syncSub = new TextView(this);
        syncSub.setText("Last synced: 2 mins ago");
        syncSub.setTextSize(12);
        syncSub.setTextColor(Color.parseColor("#94A3B8"));
        syncTextContainer.addView(syncSub);

        syncBar.addView(syncTextContainer);

        TextView syncBtn = new TextView(this);
        syncBtn.setText("Synced");
        syncBtn.setTextSize(12);
        syncBtn.setTextColor(Color.WHITE);
        syncBtn.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        syncBtn.setBackgroundResource(R.drawable.badge_active_green);
        syncBtn.setPadding(24, 10, 24, 10);
        syncBtn.setOnClickListener(v -> showProfileScreen());
        syncBar.addView(syncBtn);

        layout.addView(syncBar);

        sv.addView(layout);
        root.addView(sv);
        root.addView(createBottomNavBar(0));

        mRootContainer.addView(root);
    }

    private View createGridCard(String iconStr, String titleStr, String descStr, int bgDrawableRes, View.OnClickListener listener) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(bgDrawableRes);
        card.setPadding(24, 24, 24, 24);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        lp.setMargins(6, 0, 6, 0);
        card.setLayoutParams(lp);

        TextView icon = new TextView(this);
        icon.setText(iconStr);
        icon.setTextSize(26);
        card.addView(icon);

        TextView title = new TextView(this);
        title.setText(titleStr);
        title.setTextSize(15);
        title.setTextColor(Color.WHITE);
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams tLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tLp.topMargin = 12;
        card.addView(title, tLp);

        TextView desc = new TextView(this);
        desc.setText(descStr);
        desc.setTextSize(11);
        desc.setTextColor(Color.parseColor("#E2E8F0"));
        LinearLayout.LayoutParams dLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dLp.topMargin = 4;
        card.addView(desc, dLp);

        if (listener != null) card.setOnClickListener(listener);
        return card;
    }

    private View createStatsRow() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = 20;
        row.setLayoutParams(lp);

        row.addView(createMiniStat("40%", "Progress", "#00E5FF", 1.0f));
        row.addView(createMiniStat("2 / 5", "Modules", "#10B981", 1.0f));
        row.addView(createMiniStat("91.5%", "Latest Score", "#FFB300", 1.0f));
        row.addView(createMiniStat("1", "Certificate", "#38BDF8", 1.0f));

        return row;
    }

    private View createMiniStat(String value, String label, String colorHex, float weight) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackgroundResource(R.drawable.card_bg);
        box.setGravity(Gravity.CENTER);
        box.setPadding(16, 20, 16, 20);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, weight);
        lp.setMargins(6, 0, 6, 0);
        box.setLayoutParams(lp);

        TextView v = new TextView(this);
        v.setText(value);
        v.setTextSize(18);
        v.setTextColor(Color.parseColor(colorHex));
        v.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        box.addView(v);

        TextView l = new TextView(this);
        l.setText(label);
        l.setTextSize(11);
        l.setTextColor(Color.parseColor("#94A3B8"));
        box.addView(l);

        return box;
    }

    private static class ModuleItemListener implements View.OnClickListener {
        private final MainActivity mActivity;
        private final String mModId;
        public ModuleItemListener(MainActivity act, String modId) {
            this.mActivity = act;
            this.mModId = modId;
        }
        @Override
        public void onClick(View v) {
            mActivity.mActiveModuleId = mModId;
            mActivity.showCartoonVideoScreen();
        }
    }

    private View createModuleCard(String modId, String titleEn, String titleHi, String standard, String badgeText, boolean isEnabled) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.card_bg);
        card.setPadding(26, 22, 26, 22);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = 16;
        card.setLayoutParams(lp);

        String lang = mLoc.getCurrentLanguage();
        String displayTitle = lang.equals("hi") ? titleHi : titleEn;

        TextView title = new TextView(this);
        title.setText(displayTitle);
        title.setTextSize(18);
        title.setTextColor(Color.parseColor("#F8FAFC"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        card.addView(title);

        TextView std = new TextView(this);
        std.setText("Standard: " + standard + "  •  " + badgeText);
        std.setTextSize(13);
        std.setTextColor(isEnabled ? Color.parseColor("#00E5FF") : Color.parseColor("#64748B"));
        card.addView(std);

        if (isEnabled) {
            card.setOnClickListener(new ModuleItemListener(this, modId));
        }
        return card;
    }

    private static class CartoonCompletionHandler implements CartoonPlayerView.OnCompletionListener {
        private final MainActivity mActivity;
        public CartoonCompletionHandler(MainActivity act) { this.mActivity = act; }
        @Override
        public void onWatchProgressUpdated(float percent, boolean unlocked) {}
        @Override
        public void onStartARRequested() {
            mActivity.showARTrainingScreen();
        }
    }

    public void showCartoonVideoScreen() {
        navigateToScreen(ScreenType.CARTOON_VIDEO);
    }

    private void renderCartoonVideoScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        ModuleConfig config = mActiveModuleId.equals("module_gas") ? mGasModule : mFireModule;
        Bitmap sceneBg = mActiveModuleId.equals("module_gas") ? mGasSceneBitmap : mFireSceneBitmap;

        mActiveCartoonPlayer = new CartoonPlayerView(this);
        LinearLayout.LayoutParams playerLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        mActiveCartoonPlayer.setLayoutParams(playerLp);

        LinearLayout controls = new LinearLayout(this);
        controls.setOrientation(LinearLayout.VERTICAL);
        controls.setBackgroundColor(Color.parseColor("#1E293B"));
        controls.setPadding(30, 20, 30, 20);

        Button btnStartAR = new Button(this);
        btnStartAR.setId(ID_BTN_START_AR);
        btnStartAR.setText("⚡ " + mLoc.getText("btn_start_ar", "NOW YOUR TURN — PRACTICE IN AR"));
        btnStartAR.setBackgroundResource(R.drawable.btn_demo);
        btnStartAR.setTextColor(Color.BLACK);
        btnStartAR.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams arLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 120);
        btnStartAR.setLayoutParams(arLp);
        btnStartAR.setOnClickListener(this);

        mActiveCartoonPlayer.setModuleConfig(config, sceneBg, new CartoonCompletionHandler(this));

        LinearLayout btnRow = new LinearLayout(this);
        btnRow.setOrientation(LinearLayout.HORIZONTAL);
        btnRow.setPadding(0, 10, 0, 10);

        Button btnPrev = new Button(this);
        btnPrev.setId(ID_BTN_PREV_LESSON);
        btnPrev.setText("◀ PREV");
        btnPrev.setBackgroundResource(R.drawable.card_bg);
        btnPrev.setTextColor(Color.WHITE);
        LinearLayout.LayoutParams pLp = new LinearLayout.LayoutParams(0, 100, 1.0f);
        pLp.rightMargin = 10;
        btnPrev.setLayoutParams(pLp);
        btnPrev.setOnClickListener(this);

        Button btnCC = new Button(this);
        btnCC.setId(ID_BTN_CC);
        btnCC.setText("CC");
        btnCC.setBackgroundResource(R.drawable.card_bg);
        btnCC.setTextColor(Color.parseColor("#00E5FF"));
        LinearLayout.LayoutParams ccLp = new LinearLayout.LayoutParams(0, 100, 0.6f);
        ccLp.rightMargin = 10;
        btnCC.setLayoutParams(ccLp);
        btnCC.setOnClickListener(this);

        Button btnNext = new Button(this);
        btnNext.setId(ID_BTN_NEXT_LESSON);
        btnNext.setText("NEXT ▶");
        btnNext.setBackgroundResource(R.drawable.card_bg);
        btnNext.setTextColor(Color.WHITE);
        LinearLayout.LayoutParams nLp = new LinearLayout.LayoutParams(0, 100, 1.0f);
        btnNext.setLayoutParams(nLp);
        btnNext.setOnClickListener(this);

        btnRow.addView(btnPrev);
        btnRow.addView(btnCC);
        btnRow.addView(btnNext);

        controls.addView(btnRow);
        controls.addView(btnStartAR);

        root.addView(mActiveCartoonPlayer);
        root.addView(controls);

        mRootContainer.addView(root);
    }

    private static class ARSessionHandler implements ARSurfaceView.OnARFinishedListener {
        private final MainActivity mActivity;
        public ARSessionHandler(MainActivity act) { this.mActivity = act; }
        @Override
        public void onStepCompleted(int step, int pointsEarned) {}
        @Override
        public void onModuleCompleted(float practicalScorePercent) {
            mActivity.mLastPracticalScore = practicalScorePercent;
            mActivity.navigateToScreen(ScreenType.ASSESSMENT);
        }
    }

    public void showARTrainingScreen() {
        navigateToScreen(ScreenType.AR_TRAINING);
    }

    private void renderARTrainingScreen() {
        mRootContainer.removeAllViews();

        ModuleConfig config = mActiveModuleId.equals("module_gas") ? mGasModule : mFireModule;
        Bitmap sceneBg = mActiveModuleId.equals("module_gas") ? mGasSceneBitmap : mFireSceneBitmap;

        FrameLayout frameLayout = new FrameLayout(this);

        final ARSurfaceView arView = new ARSurfaceView(this);
        arView.setupModule(config, sceneBg, new ARSessionHandler(this));

        // Restore saved step progress if user previously exited training
        Integer savedStep = mModuleStepProgressMap.get(mActiveModuleId);
        if (savedStep != null) {
            arView.setStepIndex(savedStep);
        }
        frameLayout.addView(arView);

        // Bottom In-App Navigation Bar (← BACK & NEXT →)
        LinearLayout navOverlay = new LinearLayout(this);
        navOverlay.setOrientation(LinearLayout.HORIZONTAL);
        navOverlay.setPadding(30, 20, 30, 30);
        navOverlay.setBackgroundColor(Color.parseColor("#990B1120")); // Translucent dark background

        FrameLayout.LayoutParams overlayLp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        overlayLp.gravity = Gravity.BOTTOM;
        navOverlay.setLayoutParams(overlayLp);

        // BOTTOM LEFT: ← BACK
        Button btnBack = new Button(this);
        btnBack.setText("← BACK");
        btnBack.setTextSize(15);
        btnBack.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        btnBack.setTextColor(Color.WHITE);
        btnBack.setBackgroundResource(R.drawable.card_login_dark);
        btnBack.setPadding(30, 20, 30, 20);
        LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        bLp.rightMargin = 20;
        btnBack.setLayoutParams(bLp);
        btnBack.setOnClickListener(v -> {
            mModuleStepProgressMap.put(mActiveModuleId, arView.getCurrentStepIndex());
            handleBackNavigation();
        });
        navOverlay.addView(btnBack);

        // BOTTOM RIGHT: NEXT →
        Button btnNext = new Button(this);
        btnNext.setText("NEXT →");
        btnNext.setTextSize(15);
        btnNext.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        btnNext.setTextColor(Color.BLACK);
        btnNext.setBackgroundResource(R.drawable.btn_login_yellow);
        btnNext.setPadding(30, 20, 30, 20);
        LinearLayout.LayoutParams nLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        btnNext.setLayoutParams(nLp);
        btnNext.setOnClickListener(v -> {
            boolean hasMore = arView.advanceNextStep();
            mModuleStepProgressMap.put(mActiveModuleId, arView.getCurrentStepIndex());
            if (!hasMore) {
                navigateToScreen(ScreenType.ASSESSMENT);
            }
        });
        navOverlay.addView(btnNext);

        frameLayout.addView(navOverlay);
        mRootContainer.addView(frameLayout);
    }

    public void showAssessmentScreen() {
        navigateToScreen(ScreenType.ASSESSMENT);
    }

    private void renderAssessmentScreen() {
        mRootContainer.removeAllViews();
        mCurrentQuestionIdx = 0;
        mCorrectAnswersCount = 0;
        renderQuestion();
    }

    private static class OptionSelectListener implements View.OnClickListener {
        private final MainActivity mActivity;
        private final int mIdx;
        private final int mCorrect;
        public OptionSelectListener(MainActivity act, int idx, int correct) {
            this.mActivity = act;
            this.mIdx = idx;
            this.mCorrect = correct;
        }
        @Override
        public void onClick(View v) {
            if (mIdx == mCorrect) {
                mActivity.mCorrectAnswersCount++;
            }
            mActivity.mCurrentQuestionIdx++;
            mActivity.renderQuestion();
        }
    }

    private void renderQuestion() {
        mRootContainer.removeAllViews();

        List<QuestionItem> questions = mActiveModuleId.equals("module_gas") ? mGasQuestions : mFireQuestions;
        if (mCurrentQuestionIdx >= questions.size()) {
            mLastTheoryScore = ((float) mCorrectAnswersCount / questions.size()) * 100f;
            navigateToScreen(ScreenType.SCORE_RESULT);
            return;
        }

        QuestionItem q = questions.get(mCurrentQuestionIdx);
        String lang = mLoc.getCurrentLanguage();

        ScrollView sv = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(36, 40, 36, 40);

        TextView qNum = new TextView(this);
        qNum.setText("QUESTION " + (mCurrentQuestionIdx + 1) + " OF " + questions.size());
        qNum.setTextSize(16);
        qNum.setTextColor(Color.parseColor("#FFB300"));
        qNum.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(qNum);

        String qText = lang.equals("hi") ? q.questionHindi : (lang.equals("sat") ? q.questionSantali : q.question);
        TextView qBody = new TextView(this);
        qBody.setText(qText);
        qBody.setTextSize(22);
        qBody.setTextColor(Color.WHITE);
        qBody.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams qbLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        qbLp.topMargin = 14;
        qbLp.bottomMargin = 24;
        layout.addView(qBody, qbLp);

        List<String> options = lang.equals("hi") ? q.optionsHindi : (lang.equals("sat") ? q.optionsSantali : q.options);
        for (int i = 0; i < options.size(); i++) {
            Button btnOpt = new Button(this);
            btnOpt.setText(options.get(i));
            btnOpt.setBackgroundResource(R.drawable.card_bg);
            btnOpt.setTextColor(Color.parseColor("#F8FAFC"));
            btnOpt.setTextSize(15);
            btnOpt.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            btnOpt.setPadding(30, 20, 30, 20);

            LinearLayout.LayoutParams optLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            optLp.topMargin = 16;
            btnOpt.setLayoutParams(optLp);
            btnOpt.setOnClickListener(new OptionSelectListener(this, i, q.correctIndex));
            layout.addView(btnOpt);
        }

        sv.addView(layout);
        mRootContainer.addView(sv);
    }

    public void showScoreResultScreen() {
        navigateToScreen(ScreenType.SCORE_RESULT);
    }

    private void renderScoreResultScreen() {
        mRootContainer.removeAllViews();

        ScrollView sv = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER_HORIZONTAL);
        layout.setPadding(36, 50, 36, 50);

        float composite = (mLastPracticalScore * 0.6f) + (mLastTheoryScore * 0.4f);
        boolean passed = composite >= 70.0f;

        TextView title = new TextView(this);
        title.setText(mLoc.getText("score_summary_title", "Evaluation Summary"));
        title.setTextSize(24);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(title);

        TextView badge = new TextView(this);
        badge.setText(passed ? "🏆 " + mLoc.getText("status_passed", "PASSED — DISTINCTION") : "❌ " + mLoc.getText("status_failed", "NEEDS RETRAINING"));
        badge.setTextSize(20);
        badge.setTextColor(passed ? Color.parseColor("#10B981") : Color.parseColor("#EF4444"));
        badge.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bLp.topMargin = 20;
        bLp.bottomMargin = 30;
        layout.addView(badge, bLp);

        LinearLayout scoreCard = new LinearLayout(this);
        scoreCard.setOrientation(LinearLayout.VERTICAL);
        scoreCard.setBackgroundResource(R.drawable.card_bg);
        scoreCard.setPadding(30, 24, 30, 24);
        LinearLayout.LayoutParams scLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        scoreCard.setLayoutParams(scLp);

        scoreCard.addView(createScoreRow("AR Practical Score (60%)", String.format("%.1f", mLastPracticalScore) + "%", "#00E5FF"));
        scoreCard.addView(createScoreRow("Theory Exam Score (40%)", String.format("%.1f", mLastTheoryScore) + "%", "#38BDF8"));
        scoreCard.addView(createScoreRow("Final Composite Score", String.format("%.1f", composite) + "%", "#FFB300"));

        layout.addView(scoreCard);

        if (passed) {
            Button btnCert = new Button(this);
            btnCert.setId(ID_BTN_GEN_CERT);
            btnCert.setText("📜 " + mLoc.getText("btn_view_certificate", "Generate Official Certificate"));
            btnCert.setBackgroundResource(R.drawable.btn_demo);
            btnCert.setTextColor(Color.BLACK);
            btnCert.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 120);
            cLp.topMargin = 30;
            btnCert.setLayoutParams(cLp);
            btnCert.setOnClickListener(this);
            layout.addView(btnCert);
        } else {
            Button btnRetry = new Button(this);
            btnRetry.setId(ID_BTN_RETRY);
            btnRetry.setText("🔄 Review Lessons & Retrain");
            btnRetry.setBackgroundResource(R.drawable.btn_primary);
            btnRetry.setTextColor(Color.BLACK);
            LinearLayout.LayoutParams rLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 120);
            rLp.topMargin = 30;
            btnRetry.setLayoutParams(rLp);
            btnRetry.setOnClickListener(this);
            layout.addView(btnRetry);
        }

        sv.addView(layout);
        mRootContainer.addView(sv);
    }

    private View createScoreRow(String label, String value, String colorHex) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setPadding(0, 10, 0, 10);

        TextView l = new TextView(this);
        l.setText(label);
        l.setTextSize(15);
        l.setTextColor(Color.parseColor("#94A3B8"));
        LinearLayout.LayoutParams lLp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        l.setLayoutParams(lLp);

        TextView v = new TextView(this);
        v.setText(value);
        v.setTextSize(16);
        v.setTextColor(Color.parseColor(colorHex));
        v.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));

        row.addView(l);
        row.addView(v);
        return row;
    }

    public void showCertificateScreen() {
        navigateToScreen(ScreenType.CERTIFICATE);
    }

    private void renderCertificateScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        CertificateCanvasView certView = new CertificateCanvasView(this);
        certView.setCertificate(mActiveCertificate);
        LinearLayout.LayoutParams cvLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        certView.setLayoutParams(cvLp);

        LinearLayout actBar = new LinearLayout(this);
        actBar.setOrientation(LinearLayout.HORIZONTAL);
        actBar.setBackgroundColor(Color.parseColor("#1E293B"));
        actBar.setPadding(20, 20, 20, 20);

        Button btnVerify = new Button(this);
        btnVerify.setId(ID_BTN_VERIFY_QR);
        btnVerify.setText("🔍 " + mLoc.getText("btn_verify_qr", "Verify QR"));
        btnVerify.setBackgroundResource(R.drawable.btn_primary);
        btnVerify.setTextColor(Color.BLACK);
        btnVerify.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams vLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        vLp.rightMargin = 10;
        btnVerify.setLayoutParams(vLp);
        btnVerify.setOnClickListener(this);

        Button btnHome = new Button(this);
        btnHome.setId(ID_BTN_BACK_HOME);
        btnHome.setText("🏠 Dashboard");
        btnHome.setBackgroundResource(R.drawable.btn_demo);
        btnHome.setTextColor(Color.BLACK);
        btnHome.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams hLp = new LinearLayout.LayoutParams(0, 110, 1.0f);
        btnHome.setLayoutParams(hLp);
        btnHome.setOnClickListener(this);

        actBar.addView(btnVerify);
        actBar.addView(btnHome);

        root.addView(certView);
        root.addView(actBar);

        mRootContainer.addView(root);
    }

    private void showQRVerificationScreen(String certId) {
        mRootContainer.removeAllViews();

        ScrollView sv = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER_HORIZONTAL);
        layout.setPadding(36, 50, 36, 50);

        TextView title = new TextView(this);
        title.setText(mLoc.getText("qr_scan_title", "Certificate QR Validator"));
        title.setTextSize(24);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(title);

        CertificateData cert = mDb.findCertificate(certId);
        boolean isValid = cert != null;

        LinearLayout badge = new LinearLayout(this);
        badge.setOrientation(LinearLayout.VERTICAL);
        badge.setBackgroundResource(isValid ? R.drawable.badge_verified : R.drawable.card_bg);
        badge.setGravity(Gravity.CENTER);
        badge.setPadding(30, 30, 30, 30);
        LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bLp.topMargin = 30;
        bLp.bottomMargin = 30;
        badge.setLayoutParams(bLp);

        TextView badgeText = new TextView(this);
        badgeText.setText(isValid ? mLoc.getText("qr_valid_badge", "✓ VERIFIED / VALID CERTIFICATE") : mLoc.getText("qr_invalid_badge", "✕ INVALID CERTIFICATE"));
        badgeText.setTextSize(20);
        badgeText.setTextColor(isValid ? Color.parseColor("#10B981") : Color.parseColor("#EF4444"));
        badgeText.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        badge.addView(badgeText);

        if (isValid) {
            TextView certIdTxt = new TextView(this);
            certIdTxt.setText("Certificate ID: " + cert.certificateId);
            certIdTxt.setTextSize(16);
            certIdTxt.setTextColor(Color.WHITE);
            badge.addView(certIdTxt);

            TextView workerTxt = new TextView(this);
            workerTxt.setText("Worker: " + cert.workerName + " (" + cert.workerId + ")");
            workerTxt.setTextSize(14);
            workerTxt.setTextColor(Color.parseColor("#94A3B8"));
            badge.addView(workerTxt);
        }

        layout.addView(badge);

        Button btnBack = new Button(this);
        btnBack.setId(ID_BTN_GEN_CERT);
        btnBack.setText("Back to Certificate");
        btnBack.setBackgroundResource(R.drawable.btn_primary);
        btnBack.setTextColor(Color.BLACK);
        LinearLayout.LayoutParams bkLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 110);
        btnBack.setLayoutParams(bkLp);
        btnBack.setOnClickListener(this);
        layout.addView(btnBack);

        sv.addView(layout);
        mRootContainer.addView(sv);
    }

    private static class DemoVideoStartListener implements View.OnClickListener {
        private final MainActivity mActivity;
        private final String mTarget;
        public DemoVideoStartListener(MainActivity act, String target) {
            this.mActivity = act;
            this.mTarget = target;
        }
        @Override
        public void onClick(View v) {
            mActivity.mActiveModuleId = mTarget;
            mActivity.showCartoonVideoScreen();
        }
    }

    public void showDemoVideosScreen() {
        navigateToScreen(ScreenType.DEMO_VIDEOS);
    }

    private void renderDemoVideosScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        ScrollView sv = new ScrollView(this);
        LinearLayout.LayoutParams svLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        sv.setLayoutParams(svLp);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(30, 30, 30, 30);

        TextView title = new TextView(this);
        title.setText("🎥 " + mLoc.getText("nav_demo_videos", "Live Industrial Safety Demos"));
        title.setTextSize(24);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Step-by-step problem, hazard identification, and procedures across 9 industrial sectors.");
        sub.setTextSize(14);
        sub.setTextColor(Color.parseColor("#94A3B8"));
        layout.addView(sub);

        String lang = mLoc.getCurrentLanguage();
        for (DemoVideoItem item : mDemoVideos) {
            LinearLayout card = new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setBackgroundResource(R.drawable.card_bg);
            card.setPadding(26, 20, 26, 20);
            LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            cLp.topMargin = 16;
            card.setLayoutParams(cLp);

            String dTitle = lang.equals("hi") ? item.titleHindi : (lang.equals("sat") ? item.titleSantali : item.title);
            TextView cTitle = new TextView(this);
            cTitle.setText(dTitle);
            cTitle.setTextSize(17);
            cTitle.setTextColor(Color.parseColor("#FFB300"));
            cTitle.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            card.addView(cTitle);

            TextView cCat = new TextView(this);
            cCat.setText("Category: " + item.category + "  •  Duration: " + item.durationSeconds + "s");
            cCat.setTextSize(13);
            cCat.setTextColor(Color.parseColor("#38BDF8"));
            card.addView(cCat);

            String dProb = lang.equals("hi") ? item.problemHindi : (lang.equals("sat") ? item.problemSantali : item.problem);
            TextView cProb = new TextView(this);
            cProb.setText("Problem: " + dProb);
            cProb.setTextSize(13);
            cProb.setTextColor(Color.parseColor("#F8FAFC"));
            card.addView(cProb);

            Button btnStart = new Button(this);
            btnStart.setText("START TRAINING MODULE ▶");
            btnStart.setBackgroundResource(R.drawable.btn_primary);
            btnStart.setTextColor(Color.BLACK);
            btnStart.setTextSize(12);
            btnStart.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, 90);
            bLp.topMargin = 10;
            btnStart.setLayoutParams(bLp);
            btnStart.setOnClickListener(new DemoVideoStartListener(this, item.targetModuleId));
            card.addView(btnStart);

            layout.addView(card);
        }

        sv.addView(layout);
        root.addView(sv);
        root.addView(createBottomNavBar(2));

        mRootContainer.addView(root);
    }

    public void showProfileScreen() {
        navigateToScreen(ScreenType.PROFILE);
    }

    private void renderProfileScreen() {
        mRootContainer.removeAllViews();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);

        ScrollView sv = new ScrollView(this);
        LinearLayout.LayoutParams svLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f);
        sv.setLayoutParams(svLp);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(36, 36, 36, 36);

        TextView title = new TextView(this);
        title.setText("👤 " + mLoc.getText("nav_profile", "Worker Profile & Compliance"));
        title.setTextSize(24);
        title.setTextColor(Color.parseColor("#00E5FF"));
        title.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        layout.addView(title);

        LinearLayout pCard = new LinearLayout(this);
        pCard.setOrientation(LinearLayout.VERTICAL);
        pCard.setBackgroundResource(R.drawable.card_bg_accent);
        pCard.setPadding(30, 24, 30, 24);
        LinearLayout.LayoutParams pcLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        pcLp.topMargin = 20;
        pCard.setLayoutParams(pcLp);

        pCard.addView(createScoreRow("Worker Name", mCurrentWorker.fullName, "#F8FAFC"));
        pCard.addView(createScoreRow("Worker ID", mCurrentWorker.workerId, "#00E5FF"));
        pCard.addView(createScoreRow("Sector", mCurrentWorker.sector, "#F8FAFC"));
        pCard.addView(createScoreRow("District", mCurrentWorker.district, "#F8FAFC"));
        pCard.addView(createScoreRow("Employer Colliery", mCurrentWorker.employer, "#38BDF8"));

        layout.addView(pCard);

        Button btnSync = new Button(this);
        btnSync.setId(ID_BTN_SYNC_REGISTRY);
        btnSync.setText("🔄 " + mLoc.getText("sync_now", "Sync to State Registry"));
        btnSync.setBackgroundResource(R.drawable.btn_demo);
        btnSync.setTextColor(Color.BLACK);
        btnSync.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams syLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 120);
        syLp.topMargin = 30;
        btnSync.setLayoutParams(syLp);
        btnSync.setOnClickListener(this);
        layout.addView(btnSync);

        Button btnLang = new Button(this);
        btnLang.setId(ID_BTN_SWITCH_LANG);
        btnLang.setText("🌐 Switch Language / भाषा बदलें");
        btnLang.setBackgroundResource(R.drawable.btn_primary);
        btnLang.setTextColor(Color.BLACK);
        btnLang.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        LinearLayout.LayoutParams lmLp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 120);
        lmLp.topMargin = 20;
        btnLang.setLayoutParams(lmLp);
        btnLang.setOnClickListener(this);
        layout.addView(btnLang);

        sv.addView(layout);
        root.addView(sv);
        root.addView(createBottomNavBar(4));

        mRootContainer.addView(root);
    }

    private static class TabNavListener implements View.OnClickListener {
        private final MainActivity mActivity;
        private final int mIdx;
        public TabNavListener(MainActivity act, int idx) {
            this.mActivity = act;
            this.mIdx = idx;
        }
        @Override
        public void onClick(View v) {
            if (mIdx == 0) mActivity.showDashboardScreen();
            else if (mIdx == 1) mActivity.showCartoonVideoScreen();
            else if (mIdx == 2) mActivity.showCertificateScreen();
            else if (mIdx == 3) mActivity.showProfileScreen();
        }
    }

    private View createBottomNavBar(int activeTabIdx) {
        LinearLayout nav = new LinearLayout(this);
        nav.setOrientation(LinearLayout.HORIZONTAL);
        nav.setBackgroundColor(Color.parseColor("#0B1120"));
        nav.setPadding(10, 16, 10, 16);
        nav.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 140));

        String[] tabs = {"🏠 Home", "📚 Modules", "📜 Certificates", "👤 Profile"};
        for (int i = 0; i < tabs.length; i++) {
            Button btn = new Button(this);
            btn.setText(tabs[i]);
            btn.setTextSize(12);
            btn.setTextColor(i == activeTabIdx ? Color.parseColor("#F59E0B") : Color.parseColor("#94A3B8"));
            btn.setBackgroundColor(Color.TRANSPARENT);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1.0f);
            btn.setLayoutParams(lp);
            btn.setOnClickListener(new TabNavListener(this, i));
            nav.addView(btn);
        }
        return nav;
    }

    // ──────────────────────────────────────────────
    // API INTEGRATION: Named static callback classes
    // ──────────────────────────────────────────────

    private static class LoginApiCallback implements ApiClient.ApiCallback {
        private final MainActivity mActivity;
        public LoginApiCallback(MainActivity act) { this.mActivity = act; }
        @Override
        public void onSuccess(int statusCode, String response) {
            try {
                JSONObject resp = new JSONObject(response);
                String token = resp.optString("access_token", "");
                int userId = resp.optInt("user_id", -1);
                if (!token.isEmpty()) {
                    ApiConfig.setToken(mActivity, token);
                    ApiConfig.setUserId(mActivity, userId);
                }
                ApiConfig.setWorkerId(mActivity, mActivity.mCurrentWorker.workerId);
                ApiConfig.setWorkerName(mActivity, mActivity.mCurrentWorker.fullName);
                ApiConfig.setSector(mActivity, mActivity.mCurrentWorker.sector);
                ApiConfig.setDistrict(mActivity, mActivity.mCurrentWorker.district);
                Toast.makeText(mActivity, "Connected to State Registry", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(mActivity, "Offline mode: Data saved locally", Toast.LENGTH_SHORT).show();
            }
            // Connect Real-Time WebSocket Pipeline
            WebSocketClient.getInstance().connect(mActivity, mActivity.mCurrentWorker.workerId);
            mActivity.showDashboardScreen();
        }
        @Override
        public void onError(int statusCode, String errorMessage) {
            ApiConfig.setWorkerId(mActivity, mActivity.mCurrentWorker.workerId);
            ApiConfig.setWorkerName(mActivity, mActivity.mCurrentWorker.fullName);
            Toast.makeText(mActivity, "Offline mode: " + errorMessage, Toast.LENGTH_SHORT).show();
            // Connect Real-Time WebSocket Pipeline even in offline fallback
            WebSocketClient.getInstance().connect(mActivity, mActivity.mCurrentWorker.workerId);
            mActivity.showDashboardScreen();
        }
    }

    private void doLoginWithBackend() {
        ApiConfig.setWorkerId(this, mCurrentWorker.workerId);
        JSONObject body = new JSONObject();
        try {
            body.put("name", mCurrentWorker.fullName != null ? mCurrentWorker.fullName : "Prashant Mishra");
            body.put("worker_id", mCurrentWorker.workerId != null ? mCurrentWorker.workerId : "JH1024");
            body.put("password", "password123");
            body.put("sector", mCurrentWorker.sector != null ? mCurrentWorker.sector : "Mining");
            body.put("organization", mCurrentWorker.employer != null ? mCurrentWorker.employer : "BCCL Dhanbad");
            body.put("district", mCurrentWorker.district != null ? mCurrentWorker.district : "Dhanbad");
            body.put("language", mCurrentWorker.selectedLanguage != null ? mCurrentWorker.selectedLanguage : "en");
        } catch (Exception e) {}
        ApiClient.post(this, "/api/auth/register", body, new LoginApiCallback(this));
    }

    private static class SyncFlushCallback implements OfflineSyncManager.SyncCallback {
        private final MainActivity mActivity;
        public SyncFlushCallback(MainActivity act) { this.mActivity = act; }
        @Override
        public void onComplete(boolean success, int syncedCount, String message) {
            Toast.makeText(mActivity, message, Toast.LENGTH_LONG).show();
        }
    }

    private static class AttemptRecordCallback implements OfflineSyncManager.SyncCallback {
        private final MainActivity mActivity;
        public AttemptRecordCallback(MainActivity act) { this.mActivity = act; }
        @Override
        public void onComplete(boolean success, int syncedCount, String message) {
            Toast.makeText(mActivity, message, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == ID_BTN_LOGIN) {
            if (mWorkerIdInput != null) {
                mCurrentWorker.workerId = mWorkerIdInput.getText().toString().trim();
            }
            doLoginWithBackend();
        } else if (id == ID_BTN_DEMO) {
            mCurrentWorker = WorkerProfile.createDefaultDemoUser();
            mCurrentWorker.selectedLanguage = mLoc.getCurrentLanguage();
            doLoginWithBackend();
        } else if (id == ID_BTN_START_AR) {
            showARTrainingScreen();
        } else if (id == ID_BTN_PREV_LESSON) {
            if (mActiveCartoonPlayer != null) mActiveCartoonPlayer.prevLesson();
        } else if (id == ID_BTN_NEXT_LESSON) {
            if (mActiveCartoonPlayer != null) mActiveCartoonPlayer.nextLesson();
        } else if (id == ID_BTN_CC) {
            if (mActiveCartoonPlayer != null) mActiveCartoonPlayer.toggleSubtitles();
        } else if (id == ID_BTN_GEN_CERT) {
            ModuleConfig cfg = mActiveModuleId.equals("module_gas") ? mGasModule : mFireModule;
            mActiveCertificate = CertificateData.generateForWorker(mCurrentWorker, cfg.id, cfg.title, mLastPracticalScore, mLastTheoryScore);
            mDb.saveCertificate(mActiveCertificate);
            // Record the training attempt to backend
            OfflineSyncManager.getInstance(this).recordTrainingAttempt(
                    mActiveModuleId, mLastPracticalScore, mLastTheoryScore,
                    new AttemptRecordCallback(this));
            
            // Broadcast CERTIFICATE_GENERATED over WebSocket
            WebSocketClient.getInstance().sendEvent(
                    "CERTIFICATE_GENERATED",
                    mActiveModuleId,
                    "DGMS Accredited Certificate issued: " + (mActiveCertificate != null ? mActiveCertificate.certificateId : "JH-SAFE-2026"),
                    null,
                    null,
                    mActiveCertificate != null ? (double) mActiveCertificate.compositeScore : 80.0,
                    null
            );

            showCertificateScreen();
        } else if (id == ID_BTN_RETRY) {
            showCartoonVideoScreen();
        } else if (id == ID_BTN_VERIFY_QR) {
            showQRVerificationScreen(mActiveCertificate != null ? mActiveCertificate.certificateId : "JH-SAFE-2026-000142");
        } else if (id == ID_BTN_BACK_HOME) {
            showDashboardScreen();
        } else if (id == ID_BTN_SYNC_REGISTRY) {
            Toast.makeText(this, "Syncing to State Registry...", Toast.LENGTH_SHORT).show();
            OfflineSyncManager.getInstance(this).flushSyncQueue(new SyncFlushCallback(this));
        } else if (id == ID_BTN_SWITCH_LANG) {
            showLanguageScreen();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        WebSocketClient.getInstance().disconnect();
    }
}
