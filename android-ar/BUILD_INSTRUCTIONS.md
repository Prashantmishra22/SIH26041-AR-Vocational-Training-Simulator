# Unity Android AR App — Build & Setup Instructions

## Project Overview
**Application Name:** JH Safety AR (`in.gov.jharkhand.safetyar`)  
**Subtitle:** Industrial Safety Training & Certification  
**Unity Version:** Unity 2022.3.x LTS (or 2023.x LTS)  
**Target Platform:** Android 10+ (API Level 29 to 34)  
**Hardware Requirements:** Any mid-range Android phone with camera. ARCore supported, with automatic fallback to 3D Simulation Mode for devices without AR sensors. No wearable VR/AR headset required.

---

## 1. Prerequisites
1. **Unity Hub & Unity Editor:**
   - Install **Unity 2022.3 LTS** via Unity Hub.
   - During installation, check the module: **Android Build Support** (including *Android SDK & NDK Tools* and *OpenJDK*).
2. **Android Device:**
   - Mid-range Android smartphone running Android 10 or newer.
   - Developer Options & USB Debugging enabled.

---

## 2. Opening the Project
1. Open **Unity Hub**.
2. Click **Add** -> **Add project from disk**.
3. Select the `android-ar` directory.
4. Open the project with Unity 2022.3 LTS. Unity will automatically resolve and import dependencies from `Packages/manifest.json` (AR Foundation, ARCore XR, TextMeshPro, Newtonsoft JSON).

---

## 3. Project Configuration Verification
1. Open **Edit** -> **Project Settings**:
   - **XR Plug-in Management:** Check **Google ARCore** under the Android tab.
   - **Player Settings** -> **Other Settings**:
     - *Package Name:* `in.gov.jharkhand.safetyar`
     - *Minimum API Level:* Android 10.0 (API level 29)
     - *Target API Level:* Automatic (highest installed / API 34)
     - *Scripting Backend:* IL2CPP (or Mono for rapid development builds)
     - *Target Architectures:* ARM64, ARMv7
   - **Camera Usage Description:** `"Camera access is required for Augmented Reality surface detection and industrial safety training simulations."`

---

## 4. Scene Setup & Prefabs
1. Create a main scene in `Assets/Scenes/MainScene.unity`.
2. Add the core managers to the scene:
   - Create an empty GameObject `[APP_MANAGERS]` and attach:
     - `AppManager.cs`
     - `NavigationManager.cs`
     - `LocalizationManager.cs`
     - `AudioManager.cs`
     - `VideoManager.cs`
     - `DemoVideoManager.cs`
     - `OfflineDatabase.cs`
     - `SyncManager.cs`
     - `ModuleManager.cs`
     - `AssessmentEngine.cs`
     - `CertificateVerifier.cs`
3. Add AR Foundation Session:
   - GameObject -> XR -> **AR Session**
   - GameObject -> XR -> **XR Origin (AR Session Origin)**
   - Attach `ARSessionManager.cs`, `ARPlaneDetector.cs`, `ARObjectPlacer.cs`, `ARInteractionManager.cs`.
4. Create Canvas (Screen Space - Overlay) with Canvas Scaler (1080 x 2400 reference resolution):
   - Wire each screen GameObject (`SplashScreen`, `LanguageScreen`, `LoginScreen`, `HomeScreen`, `ModuleListScreen`, `ModuleIntroScreen`, `VideoLearningScreen`, `DemoVideosScreen`, `ARTrainingScreen`, `AssessmentScreen`, `ScoreScreen`, `CertificateScreen`, `CertificateHistoryScreen`, `QRScannerScreen`, `OfflineSyncScreen`, `ProfileScreen`, `SettingsScreen`) into `NavigationManager.cs`.

---

## 5. End-to-End Worker Flow Verification
Test this sequence in the Android APK:
1. **Splash Screen** -> **Select Language** (हिन्दी / Santali ᱥᱟᱱᱛᱟᱲᱤ / English).
2. **Worker Login** -> Tap **DEMO MODE** (Rahul Kumar, DEMO-001, Mining, Dhanbad).
3. **Home Dashboard** -> View Progress (40%), Modules (2/5), Latest Score (91%), Certificates (1).
4. **Select Module (Fire & Explosion / Gas Leak)** -> Watch **Cartoon Safety Lesson** featuring Raju — Safety Trainee.
5. **Video Complete (>= 90%)** -> "NOW IT'S YOUR TURN" -> Tap **CONTINUE TO AR PRACTICE**.
6. **AR Camera & Surface Detection** -> Interactive Task Execution (Hotspots, Exits, DCP Extinguisher, Lifeline, Assembly Point) with immediate **CORRECT ✓ / INCORRECT ✕** feedback.
7. **Post-Training Assessment** -> 10 Questions (MCQ / True-False / Sequence Ordering).
8. **Scoring Summary** -> Practical (92%) + Knowledge (90%) = Final Score (91%) -> **PASS ✓**.
9. **Digital Certificate** -> Govt of Jharkhand Certificate with unique ID (`JH-SAFE-2026-000142`) and dynamic QR.
10. **QR Verification** -> Scan QR code -> Instant **VALID (AUTHENTIC)** certification badge.
11. **Offline & Sync** -> Switch to Airplane Mode -> Complete training offline -> Reconnect -> Auto-sync to state portal.

---

## 6. Building the Android APK
1. Connect your Android smartphone via USB with USB Debugging enabled.
2. In Unity, go to **File** -> **Build Settings**:
   - Platform: **Android** (Click *Switch Platform* if not already active).
   - Add `MainScene` to *Scenes in Build*.
3. Click **Build and Run** (or **Build** to output `JH-Safety-AR.apk`).
4. Unity will compile C# scripts, package IL2CPP binaries, bundle assets from `Assets/Resources/`, and install the APK directly to your phone.
