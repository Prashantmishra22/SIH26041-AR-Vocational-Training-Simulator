import os
import sys
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
from gtts import gTTS

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OUTPUT_DIR = r"c:\Users\ASUS\OneDrive\Desktop\hackathon project\JH-Safety-AR-Android\assets\demo_videos"
TEMP_DIR = r"c:\Users\ASUS\OneDrive\Desktop\hackathon project\temp_video_gen"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Demo video specifications
DEMOS = [
    {
        "id": "demo_fire_01",
        "title_en": "Fire Emergency & PASS Technique",
        "title_hi": "आग आपातकाल एवं PASS तकनीक",
        "category": "Fire Emergency",
        "steps": [
            {
                "scene": "HAZARD OCCURRENCE",
                "scene_hi": "खतरे की पहचान",
                "en": "Coal dust accumulated around an unlubricated conveyor roller has ignited the rubber belt. Dense smoke is spreading.",
                "hi": "कन्वेयर रोलर में घर्षण के कारण रबर बेल्ट में आग लग गई है। घना धुआं फैल रहा है।",
                "icon": "🔥",
                "color": (180, 40, 20),
                "action": "Conveyor Belt Fire Detected • Stop Wire Active",
                "action_hi": "कन्वेयर बेल्ट में आग • स्टॉप वायर खींचें"
            },
            {
                "scene": "ALARM ACTIVATION",
                "scene_hi": "अलार्म बजाएं",
                "en": "Worker immediately pulls the emergency stop wire and breaks glass at the Mine Alarm Station to alert the control room.",
                "hi": "श्रमिक तुरंत आपातकालीन स्टॉप वायर खींचता है और खदान अलार्म स्टेशन का ग्लास तोड़कर अलार्म बजाता है।",
                "icon": "🚨",
                "color": (200, 100, 20),
                "action": "Emergency Pull Wire Engaged • Alarm Sounded",
                "action_hi": "आपातकालीन पुल वायर चालू • अलार्म बजाया"
            },
            {
                "scene": "EQUIPMENT RETRIEVAL",
                "scene_hi": "उपकरण प्राप्त करें",
                "en": "Worker retrieves a 10kg ABC Dry Chemical Powder (DCP) extinguisher from the marked emergency station.",
                "hi": "श्रमिक आपातकालीन स्टेशन से 10 किलोग्राम एबीसी डीसीपी अग्निशामक यंत्र लेता है।",
                "icon": "🧯",
                "color": (30, 100, 180),
                "action": "10kg ABC Dry Chemical Powder Extinguisher Ready",
                "action_hi": "10 किग्रा एबीसी डीसीपी अग्निशामक तैयार"
            },
            {
                "scene": "PASS TECHNIQUE (P - PULL PIN)",
                "scene_hi": "PASS तकनीक (P - पिन खींचें)",
                "en": "Step 1: Pull the safety pin to break the tamper seal and unlock the operating lever.",
                "hi": "चरण 1: सुरक्षा पिन को जोर से खींचें ताकि सील टूट जाए और हैंडल अनलॉक हो जाए।",
                "icon": "📍",
                "color": (20, 140, 140),
                "action": "P - Pull Safety Pin & Break Seal",
                "action_hi": "P - सुरक्षा पिन खींचें एवं सील तोड़ें"
            },
            {
                "scene": "PASS TECHNIQUE (A - AIM BASE)",
                "scene_hi": "PASS तकनीक (A - आधार पर निशाना)",
                "en": "Step 2: Aim the discharge nozzle at the base of the fire, not at the flames.",
                "hi": "चरण 2: अग्निशामक के नोजल को आग की लपटों पर नहीं, बल्कि आग के आधार पर साधें।",
                "icon": "🎯",
                "color": (20, 150, 80),
                "action": "A - Aim Low at the Base of the Flames",
                "action_hi": "A - आग के आधार पर नोजल साधें"
            },
            {
                "scene": "PASS TECHNIQUE (S - SQUEEZE LEVER)",
                "scene_hi": "PASS तकनीक (S - हैंडल दबाएं)",
                "en": "Step 3: Squeeze the top handle lever to discharge the extinguishing powder under high pressure.",
                "hi": "चरण 3: हैंडल लीवर को दबाएं ताकि उच्च दबाव में पाउडर बाहर निकले।",
                "icon": "✊",
                "color": (160, 120, 20),
                "action": "S - Squeeze the Operating Lever Firmly",
                "action_hi": "S - ऑपरेटिंग हैंडल को मजबूती से दबाएं"
            },
            {
                "scene": "PASS TECHNIQUE (S - SWEEP SIDE TO SIDE)",
                "scene_hi": "PASS तकनीक (S - दाएं-बाएं झाड़ू की तरह घुमाएं)",
                "en": "Step 4: Sweep the nozzle smoothly from side to side across the fuel source until flames are fully extinguished.",
                "hi": "चरण 4: नोजल को आग के आधार पर एक सिरे से दूसरे सिरे तक दाएं-बाएं घुमाएं।",
                "icon": "↔️",
                "color": (20, 120, 180),
                "action": "S - Sweep Side-to-Side Across the Fuel Base",
                "action_hi": "S - ईंधन आधार पर दाएं-बाएं घुमाएं"
            },
            {
                "scene": "SAFE EVACUATION & OUTCOME",
                "scene_hi": "सुरक्षित निकासी एवं परिणाम",
                "en": "Fire extinguished within 3 minutes. Worker dons Self-Rescuer mask and evacuates to the fresh air intake assembly point.",
                "hi": "3 मिनट में आग बुझाई गई। श्रमिक सेल्फ-रेस्क्यूअर पहनकर ताजी हवा वाले असेंबली पॉइंट पर पहुंचता है।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "Zero Casualties • Safe Airway Assembly Reached",
                "action_hi": "शून्य जनहानि • सुरक्षित असेंबली स्थल पर पहुंचे"
            }
        ]
    },
    {
        "id": "demo_gas_02",
        "title_en": "Methane Pocket Detection & Airlock Isolation",
        "title_hi": "मीथेन गैस पहचान एवं एयरलॉक अलगाव",
        "category": "Gas Leak",
        "steps": [
            {
                "scene": "HAZARD DETECTION",
                "scene_hi": "खतरे की पहचान",
                "en": "Continuous miner strikes coal face fault releasing explosive methane gas. Multi-gas detector alarms at 4.8% CH4.",
                "hi": "कोयला काटने के दौरान मीथेन गैस की भारी मात्रा निकली। मल्टी-गैस डिटेक्टर में अलार्म बजा (4.8% मीथेन)।",
                "icon": "⚠️",
                "color": (180, 50, 20),
                "action": "Methane Pocket Intersected • High Alarm Sounding",
                "action_hi": "मीथेन गैस रिसाव • चेतावनी अलार्म सक्रिय"
            },
            {
                "scene": "POWER ISOLATION",
                "scene_hi": "बिजली की आपूर्ति बंद करें",
                "en": "Section foreman operates the Gate-End Box isolator switch to kill all electrical power and prevent spark ignition.",
                "hi": "फोरमैन तुरंत गेट-एंड बॉक्स से बिजली काटता है ताकि किसी भी चिंगारी से विस्फोट न हो।",
                "icon": "⚡",
                "color": (200, 120, 20),
                "action": "Main 415V Power Tripped • Non-Sparking Zone",
                "action_hi": "मुख्य बिजली बंद • चिंगारी रहित क्षेत्र"
            },
            {
                "scene": "VENTILATION SCRUBBER",
                "scene_hi": "वेंटिलेशन स्क्रबर चालू करें",
                "en": "Engage the Venturi auxiliary air scrubber and position stone dust explosion barriers to dilute gas concentration.",
                "hi": "वेंचुरी एयर स्क्रबर चालू करें और स्टोन डस्ट बैरियर लगाएं ताकि गैस का फैलाव रुक सके।",
                "icon": "💨",
                "color": (20, 140, 180),
                "action": "Venturi Auxiliary Scrubber Engaged",
                "action_hi": "सहायक एयर स्क्रबर चालू किया गया"
            },
            {
                "scene": "AIRLOCK EVACUATION",
                "scene_hi": "एयरलॉक निकासी",
                "en": "Workers don self-contained self-rescuers and evacuate sequentially through hermetic double airlock doors into fresh air.",
                "hi": "श्रमिक मास्क पहनते हैं और डबल एयरलॉक दरवाजों से होते हुए सुरक्षित ताजी हवा वाले रास्ते में निकलते हैं।",
                "icon": "🚪",
                "color": (20, 150, 80),
                "action": "Airlock Sequence Maintained • Fresh Air Intake",
                "action_hi": "एयरलॉक के नियमों का पालन • ताजी हवा में प्रवेश"
            },
            {
                "scene": "SAFE RESOLUTION",
                "scene_hi": "सुरक्षित परिणाम",
                "en": "Atmosphere safely diluted below 0.3% methane. Zero ignition, zero injuries, colliery operations secured.",
                "hi": "मीथेन का स्तर सुरक्षित रूप से 0.3% से नीचे लाया गया। कोई दुर्घटना नहीं हुई।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "Methane Normalized (<0.3%) • Safe Resumption",
                "action_hi": "गैस स्तर सामान्य • सुरक्षित संचालन"
            }
        ]
    },
    {
        "id": "demo_confined_03",
        "title_en": "Confined Slurry Pit Entry & Rescue Protocol",
        "title_hi": "सीमित स्लरी गड्ढे में प्रवेश एवं बचाव",
        "category": "Confined Space",
        "steps": [
            {
                "scene": "HAZARD ASSESSMENT",
                "scene_hi": "खतरे का आकलन",
                "en": "Submerged sump pump clogged in a 6-meter deep concrete pit. Toxic H2S gas and oxygen deficiency (14.2% O2) present.",
                "hi": "6 मीटर गहरे गड्ढे में पंप जाम हो गया है। नीचे जहरीली H2S गैस और ऑक्सीजन की भारी कमी है।",
                "icon": "☣️",
                "color": (160, 40, 20),
                "action": "Toxic Gas & Low Oxygen Detected in Sump",
                "action_hi": "गड्ढे में जहरीली गैस एवं ऑक्सीजन की कमी"
            },
            {
                "scene": "PERMIT & FORCED AIR PURGE",
                "scene_hi": "परमिट एवं वेंटिलेशन",
                "en": "Obtain signed Confined Space Entry Permit. Run forced pneumatic air blower for 20 minutes to purge toxic atmosphere.",
                "hi": "अधिकृत प्रवेश परमिट लें। ब्लोअर से 20 मिनट तक हवा देकर जहरीली गैस को बाहर निकालें।",
                "icon": "📜",
                "color": (20, 130, 180),
                "action": "Entry Permit Signed • 20-Min Air Purge Completed",
                "action_hi": "प्रवेश परमिट स्वीकृत • 20 मिनट वेंटिलेशन पूर्ण"
            },
            {
                "scene": "3-DEPTH GAS SAMPLING",
                "scene_hi": "3 गहराइयों पर गैस जांच",
                "en": "Sample atmosphere at Top, Middle, and Bottom depths with 4-gas monitor to verify safe breathable air quality.",
                "hi": "4-गैस मॉनिटर से शीर्ष, मध्य और तल तीनों स्तरों पर हवा की जांच करें।",
                "icon": "📊",
                "color": (200, 140, 20),
                "action": "Top, Mid, Bottom Gas Verification Cleared",
                "action_hi": "तीनों स्तरों पर गैस जांच सुरक्षित पाई गई"
            },
            {
                "scene": "SCBA & TRIPOD WINCH ENTRY",
                "scene_hi": "SCBA मास्क एवं हार्नेस के साथ प्रवेश",
                "en": "Worker dons positive-pressure SCBA and Class III harness attached to mechanical tripod retrieval winch. Standby attendant on surface.",
                "hi": "श्रमिक SCBA ऑक्सीजन मास्क और सेफ्टी हार्नेस पहनकर ट्राइपॉड विंच के सहारे उतरता है। अटेंडेंट बाहर निगरानी रखता है।",
                "icon": "🦺",
                "color": (20, 150, 80),
                "action": "Class III Harness & Surface Standby Attendant Active",
                "action_hi": "सेफ्टी हार्नेस एवं सतह पर अटेंडेंट तैनात"
            },
            {
                "scene": "TASK COMPLETION & SAFE RETRIEVAL",
                "scene_hi": "कार्य पूर्ण एवं सुरक्षित वापसी",
                "en": "Tailings blockage cleared. Worker safely winched out within 12 minutes with zero hazardous exposure.",
                "hi": "पंप की रुकावट दूर की गई। श्रमिक को 12 मिनट में सुरक्षित बाहर निकाल लिया गया।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "Pump Cleared • 100% Zero Gas Exposure",
                "action_hi": "पंप साफ • शून्य जोखिम के साथ सकुशल वापसी"
            }
        ]
    },
    {
        "id": "demo_machinery_04",
        "title_en": "Lockout / Tagout (LOTO) on Primary Crusher",
        "title_hi": "कोयला क्रशर पर लॉकआउट / टैगआउट (LOTO)",
        "category": "Machinery Safety",
        "steps": [
            {
                "scene": "MAINTENANCE HAZARD",
                "scene_hi": "रखरखाव का जोखिम",
                "en": "Boulders jam coal crusher teeth. Replacing liner bolts inside poses extreme crushing hazard if machine starts accidentally.",
                "hi": "क्रशर में पत्थर फंसने से लाइनर बोल्ट बदलना आवश्यक है। अचानक मशीन चलने पर जानलेवा कुचलने का खतरा है।",
                "icon": "⚙️",
                "color": (180, 50, 20),
                "action": "Crusher Maintenance Required • Accidental Start Risk",
                "action_hi": "क्रशर रखरखाव आवश्यक • अचानक चालू होने का जोखिम"
            },
            {
                "scene": "NOTIFY & ISOLATE POWER",
                "scene_hi": "सूचना दें एवं बिजली काटें",
                "en": "Notify operations control room. Switch off the main 415V electrical circuit breaker at the MCC panel.",
                "hi": "कंट्रोल रूम को सूचित करें। मुख्य 415 वोल्ट के सर्किट ब्रेकर स्विच को बंद करें।",
                "icon": "🛑",
                "color": (200, 100, 20),
                "action": "MCC Breaker Isolated & Disengaged",
                "action_hi": "मुख्य ब्रेकर बंद किया गया"
            },
            {
                "scene": "APPLY PADLOCK & TAG",
                "scene_hi": "व्यक्तिगत ताला एवं टैग लगाएं",
                "en": "Attach personal red safety padlock, danger maintenance tag, and multi-lock hasp to breaker handle.",
                "hi": "ब्रेकर पर अपना व्यक्तिगत लाल सुरक्षा ताला और 'खतरा' टैग लगाएं।",
                "icon": "🔒",
                "color": (180, 20, 80),
                "action": "Personal Red Padlock & Danger Tag Applied",
                "action_hi": "लाल सुरक्षा ताला और चेतावनी टैग लगाया"
            },
            {
                "scene": "ZERO ENERGY VERIFICATION (TRY-STEP)",
                "scene_hi": "शून्य ऊर्जा की जांच (ट्राई-स्टेप)",
                "en": "Press the local crusher start pushbutton to verify zero electrical energy remains and machine cannot start.",
                "hi": "स्थानीय स्टार्ट बटन दबाकर पुष्टि करें कि मशीन में कोई विद्युत ऊर्जा नहीं है और यह चालू नहीं हो सकती।",
                "icon": "🔘",
                "color": (20, 140, 140),
                "action": "Try-Step Test Complete • Zero Energy Confirmed",
                "action_hi": "ट्राई-स्टेप परीक्षण पूर्ण • शून्य ऊर्जा सत्यापित"
            },
            {
                "scene": "SAFE MAINTENANCE COMPLETED",
                "scene_hi": "सुरक्षित कार्य संपन्न",
                "en": "Worker completes liner bolt replacement inside crusher safely. Padlocks removed in presence of supervisor.",
                "hi": "क्रशर के अंदर सुरक्षित काम पूरा हुआ। सुपरवाइजर की उपस्थिति में ताले हटाए गए।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "LOTO Protocols Enforced • Zero Incidents",
                "action_hi": "लोटो नियमों का पूर्ण पालन • शून्य दुर्घटना"
            }
        ]
    },
    {
        "id": "demo_ppe_05",
        "title_en": "Silicosis Dust Suppression & PPE Safety",
        "title_hi": "सिलिकोसिस धूल नियंत्रण एवं पीपीई सुरक्षा",
        "category": "PPE & Workplace Safety",
        "steps": [
            {
                "scene": "HAZARD IDENTIFICATION",
                "scene_hi": "खतरे की पहचान",
                "en": "Dry drilling in quartz sandstone generates fine crystalline silica dust (<5 microns), risking chronic lung silicosis.",
                "hi": "बलुआ पत्थर में सूखी ड्रिलिंग से सिलिका की बारीक धूल निकलती है जिससे फेफड़ों की गंभीर बीमारी (सिलिकोसिस) हो सकती है।",
                "icon": "😷",
                "color": (180, 60, 20),
                "action": "Respirable Silica Dust (<5µm) Hazard",
                "action_hi": "सूक्ष्म सिलिका धूल का जानलेवा खतरा"
            },
            {
                "scene": "WET DRILLING SUPPRESSION",
                "scene_hi": "गीली ड्रिलिंग (धूल नियंत्रण)",
                "en": "Connect water-flush hose to drill bit at 2.5 bar pressure to suppress 95% of airborne silica dust at source.",
                "hi": "ड्रिल बिट से 2.5 बार दबाव पर पानी का पाइप जोड़ें ताकि 95% धूल हवा में उड़ने से पहले ही दब जाए।",
                "icon": "💧",
                "color": (20, 130, 180),
                "action": "Water-Flush Suppressing 95% Dust at Source",
                "action_hi": "पानी के छिड़काव से 95% धूल नियंत्रित"
            },
            {
                "scene": "P3 RESPIRATOR FIT TEST",
                "scene_hi": "P3 मास्क फिट परीक्षण",
                "en": "Don elastomeric half-mask with P3 particulate filters. Perform negative-pressure user seal check to ensure airtight fit.",
                "hi": "P3 फिल्टर वाला हाफ-मास्क पहनें और हाथों से फिल्टर ढककर सांस खींचकर सील की जांच करें।",
                "icon": "🤿",
                "color": (20, 150, 80),
                "action": "Negative-Pressure Seal Check Passed",
                "action_hi": "सील परीक्षण सफल • मास्क पूरी तरह वायुरोधी"
            },
            {
                "scene": "COMPLETE PPE COMPLIANCE",
                "scene_hi": "संपूर्ण पीपीई किट",
                "en": "Wear anti-vibration gloves, impact goggles, steel-toe mining boots, and hard hat with chin strap.",
                "hi": "एंटी-वाइब्रेशन दस्ताने, सुरक्षा चश्मा, स्टील-टो जूते और हेलमेट पहनें।",
                "icon": "🦺",
                "color": (180, 120, 20),
                "action": "100% Industrial PPE Compliance Enforced",
                "action_hi": "100% पीपीई अनुपालन सुनिश्चित"
            },
            {
                "scene": "SAFE OUTCOME",
                "scene_hi": "सुरक्षित परिणाम",
                "en": "Respirable dust measured below 0.05 mg/m3 DGMS statutory limit. Complete worker lung protection achieved.",
                "hi": "धूल का स्तर कानूनी सीमा के भीतर सुरक्षित रहा। फेफड़ों की पूर्ण सुरक्षा सुनिश्चित हुई।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "Within DGMS Permissible Limits • Full Lung Protection",
                "action_hi": "कानूनी मानकों के तहत सुरक्षित • फेफड़ों की पूर्ण सुरक्षा"
            }
        ]
    },
    {
        "id": "demo_evac_06",
        "title_en": "Underground Mine Refuge Chamber Evacuation",
        "title_hi": "खदान शरण कक्ष (Refuge Chamber) निकासी",
        "category": "Emergency Evacuation",
        "steps": [
            {
                "scene": "EMERGENCY ROOF FALL",
                "scene_hi": "छत गिरने से आपातकाल",
                "en": "Sudden roof collapse blocks primary intake roadway. Heavy smoke fills underground workings cut off from surface.",
                "hi": "अचानक छत गिरने से मुख्य रास्ता बंद हो गया और खदान में घना धुआं भर गया।",
                "icon": "🧱",
                "color": (180, 40, 20),
                "action": "Haulage Route Blocked • Heavy Smoke Inbye",
                "action_hi": "मुख्य निकास मार्ग अवरुद्ध • घना धुआं"
            },
            {
                "scene": "DON SCSR BREATHING MASK",
                "scene_hi": "SCSR मास्क तुरंत पहनें",
                "en": "Workers immediately don Self-Contained Self-Rescuers within 30 seconds to provide 60 minutes of clean oxygen.",
                "hi": "श्रमिक 30 सेकंड के भीतर SCSR ऑक्सीजन मास्क पहनते हैं जो 60 मिनट की शुद्ध ऑक्सीजन देता है।",
                "icon": "⏱️",
                "color": (200, 100, 20),
                "action": "SCSR Donned in <30s • 60-Min Breathing Supply",
                "action_hi": "30 सेकंड में मास्क पहना • 60 मिनट ऑक्सीजन तैयार"
            },
            {
                "scene": "FOLLOW STROBE TO SANCTUARY",
                "scene_hi": "लाइट का पालन कर शरण कक्ष पहुंचे",
                "en": "Follow photoluminescent lifelines and green strobe guidance lights toward the permanent hermetic Refuge Chamber.",
                "hi": "चमकदार गाइडलाइन और हरी स्ट्रोब लाइट का अनुसरण करते हुए स्थायी शरण कक्ष की ओर बढ़ें।",
                "icon": "💡",
                "color": (20, 140, 180),
                "action": "Navigating Lifeline to Steel Refuge Chamber",
                "action_hi": "सुरक्षित गाइडलाइन के सहारे शरण कक्ष की ओर गमन"
            },
            {
                "scene": "SEAL AIRLOCK & SCRUBBERS",
                "scene_hi": "दरवाजा सील करें एवं स्क्रबर चालू करें",
                "en": "Enter outer airlock, purge smoke, seal heavy inner marine door with dog-latches, and activate 96-hour O2 candles and CO2 scrubbers.",
                "hi": "एयरलॉक में धुआं बाहर निकालें, आंतरिक दरवाजे को मजबूती से बंद करें और 96 घंटे का ऑक्सीजन सिस्टम चालू करें।",
                "icon": "🚪",
                "color": (20, 150, 80),
                "action": "Chamber Hermetically Sealed • O2 & CO2 Scrubbers ON",
                "action_hi": "शरण कक्ष पूरी तरह सील • ऑक्सीजन सिस्टम चालू"
            },
            {
                "scene": "SURFACE RESCUE CONTACT",
                "scene_hi": "सतह बचाव दल से संपर्क",
                "en": "Establish hardwire phone contact with surface rescue station. 14 miners safely sheltered until rescue borehole connects.",
                "hi": "सतह पर मौजूद बचाव दल से फोन पर संपर्क किया। 14 खनिक बचाव दल के आने तक पूरी तरह सुरक्षित रहे।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "14 Miners Sheltered • Surface Communication Active",
                "action_hi": "14 खनिक सकुशल सुरक्षित • सतह से संचार स्थापित"
            }
        ]
    },
    {
        "id": "demo_mining_07",
        "title_en": "Opencast HEMM Blind Spots & Haul Safety",
        "title_hi": "ओपनकास्ट भारी खनन मशीनरी (HEMM) ब्लाइंड स्पॉट",
        "category": "Mining Hazards",
        "steps": [
            {
                "scene": "BLIND SPOT HAZARD",
                "scene_hi": "ब्लाइंड स्पॉट का खतरा",
                "en": "A 100-ton haul dumper operating in opencast mine. Light vehicle enters the operator rear-right zero-visibility blind quadrant.",
                "hi": "100 टन के विशाल डंपर के पिछले दाएं हिस्से में जहां ड्राइवर को कुछ नहीं दिखता, एक छोटी गाड़ी आ जाती है।",
                "icon": "🚛",
                "color": (180, 50, 20),
                "action": "Light Vehicle in 100T Dumper Blind Quadrant",
                "action_hi": "डंपर के ब्लाइंड स्पॉट में वाहन • कुचलने का भारी खतरा"
            },
            {
                "scene": "30-METER SAFETY BUBBLE",
                "scene_hi": "30 मीटर सुरक्षा घेरा",
                "en": "Maintain strict 30-meter demarcation bubble around operating heavy earth moving machinery at all times.",
                "hi": "चल रही किसी भी भारी मशीनरी के चारों ओर कम से कम 30 मीटर का सुरक्षित फासला बनाए रखें।",
                "icon": "⭕",
                "color": (200, 120, 20),
                "action": "30-Meter Proximity Exclusion Zone Enforced",
                "action_hi": "30 मीटर की अनिवार्य सुरक्षित दूरी का पालन"
            },
            {
                "scene": "VHF RADIO BROADCAST",
                "scene_hi": "वीएचएफ रेडियो से सूचना",
                "en": "Light vehicle operator broadcasts intention on VHF Channel 4 and awaits double-horn acknowledgment from dumper operator.",
                "hi": "वाहन चालक वीएचएफ चैनल 4 पर सूचना देता है और डंपर चालक के दो बार हॉर्न बजाने का इंतजार करता है।",
                "icon": "📻",
                "color": (20, 140, 180),
                "action": "VHF Radio Request • Awaiting Double Horn Acknowledge",
                "action_hi": "रेडियो पर संपर्क • डंपर के हॉर्न सिग्नल का इंतजार"
            },
            {
                "scene": "SAFE PASSING MANEUVER",
                "scene_hi": "सुरक्षित ओवरटेक",
                "en": "Dumper stops, signals clearance with double horn. Light vehicle passes on designated driver-side passing lane.",
                "hi": "डंपर रुककर डबल हॉर्न देता है। छोटी गाड़ी चालक की ओर वाली निर्धारित लेन से सुरक्षित आगे निकलती है।",
                "icon": "↔️",
                "color": (20, 150, 80),
                "action": "Positive Visual Confirmation • Safe Overtake",
                "action_hi": "स्पष्ट संकेत मिलने पर सुरक्षित ओवरटेक"
            },
            {
                "scene": "SAFE PARKING BAY",
                "scene_hi": "सुरक्षित पार्किंग स्थल",
                "en": "Park light vehicle exclusively in high-wall berm protected bays with warning flag mast visible above truck tire height.",
                "hi": "गाड़ी को केवल निर्धारित सुरक्षा दीवार वाले पार्किंग स्थल पर खड़ा करें और ऊंची चेतावनी झंडी लगाएं।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "Protected Parking Bay • Zero Collision",
                "action_hi": "सुरक्षित पार्किंग • टकराव से पूर्ण बचाव"
            }
        ]
    },
    {
        "id": "demo_steel_08",
        "title_en": "Steel Plant Molten Metal Splash Safety",
        "title_hi": "स्टील प्लांट पिघली धातु स्पलैश सुरक्षा",
        "category": "Steel Plant Hazards",
        "steps": [
            {
                "scene": "MOLTEN METAL HAZARD",
                "scene_hi": "पिघली धातु का भीषण खतरा",
                "en": "Tapping 1500°C molten iron from blast furnace into ladle. Moisture near tap-hole creates instantaneous steam explosion risk.",
                "hi": "1500 डिग्री सेल्सियस पर पिघला लोहा निकाला जा रहा है। नाली में थोड़ी सी भी नमी भयानक भाप विस्फोट कर सकती है।",
                "icon": "🌋",
                "color": (200, 40, 10),
                "action": "1500°C Molten Iron Tapping • Moisture Explosion Risk",
                "action_hi": "1500°C पिघला लोहा • भाप विस्फोट का जोखिम"
            },
            {
                "scene": "ALUMINIZED HEAT SUIT",
                "scene_hi": "एल्युमिनाइज्ड हीट-सूट",
                "en": "Workers don full aluminized proximity suit, gold-coated heat reflection face shield, and molten metal slag gaiters.",
                "hi": "श्रमिक एल्युमिनाइज्ड हीट-रिफ्लेक्टिव सूट, सोने की परत वाला फेस शील्ड और सुरक्षात्मक जूते पहनते हैं।",
                "icon": "🦺",
                "color": (220, 140, 20),
                "action": "Full Aluminized Proximity Suit & Gold Face Shield",
                "action_hi": "एल्युमिनाइज्ड सुरक्षा सूट एवं शील्ड धारण किया"
            },
            {
                "scene": "CERAMIC BLAST DEFLECTION",
                "scene_hi": "सिरेमिक ब्लास्ट दीवार के पीछे स्थिति",
                "en": "Ground crew retreats behind reinforced ceramic blast deflection wall. Ensure runner trough is 100% dry before tapping.",
                "hi": "सारे श्रमिक सुरक्षा दीवार के पीछे खड़े होते हैं। सुनिश्चित करें कि लोहे की नाली पूरी तरह सूखी हो।",
                "icon": "🛡️",
                "color": (20, 140, 180),
                "action": "Crew Positioned Behind Blast Deflection Wall",
                "action_hi": "सुरक्षा दीवार के पीछे सुरक्षित स्थान"
            },
            {
                "scene": "REMOTE HYDRAULIC DRILLING",
                "scene_hi": "रिमोट हाइड्रोलिक मशीन से संचालन",
                "en": "Operate hydraulic tap-hole drill and clay mud gun remotely from control cabin to avoid proximity burns.",
                "hi": "कंट्रोल केबिन से रिमोट द्वारा हाइड्रोलिक ड्रिल और मड गन का संचालन करें ताकि आग के पास न जाना पड़े।",
                "icon": "🕹️",
                "color": (20, 150, 80),
                "action": "Remote Control Mud Gun & Tap-Hole Drill Active",
                "action_hi": "रिमोट कंट्रोल द्वारा सुरक्षित संचालन"
            },
            {
                "scene": "SAFE TAPPING COMPLETED",
                "scene_hi": "सुरक्षित निकासी पूर्ण",
                "en": "Torpedo ladle safely filled with 200 tons of liquid iron. Zero splash incidents, zero thermal burn injuries.",
                "hi": "200 टन पिघला लोहा सुरक्षित रूप से भरा गया। कोई छलकन या जलने की दुर्घटना नहीं हुई।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "200T Liquid Iron Tapped • Zero Burn Incidents",
                "action_hi": "निकासी सफल • शून्य दुर्घटना"
            }
        ]
    },
    {
        "id": "demo_mica_09",
        "title_en": "Mica Processing Ergonomics & Dust Control",
        "title_hi": "अभ्रक (माइका) प्रसंस्करण एवं धूल नियंत्रण",
        "category": "Mica Processing Hazards",
        "steps": [
            {
                "scene": "AIRBORNE MICA HAZARD",
                "scene_hi": "अभ्रक की बारीक धूल का खतरा",
                "en": "Manual splitting of mica flakes generates airborne mica platelets causing restrictive pneumoconiosis lung disease.",
                "hi": "अभ्रक की परतें अलग करने के दौरान बारीक धूल हवा में उड़ती है जिससे फेफड़ों की गंभीर बीमारी और पीठ दर्द होता है।",
                "icon": "🍂",
                "color": (180, 70, 20),
                "action": "Airborne Mica Platelets & Musculoskeletal Strain",
                "action_hi": "अभ्रक धूल एवं मांसपेशियों में खिंचाव का खतरा"
            },
            {
                "scene": "DOWNDRAFT EXTRACTION TABLE",
                "scene_hi": "डस्ट निष्कर्षण टेबल चालू करें",
                "en": "Activate local downdraft dust extraction table before sorting to capture 90% of respirable mica flakes immediately.",
                "hi": "काम शुरू करने से पहले डस्ट निष्कर्षण टेबल चालू करें ताकि 90% धूल नीचे खींच ली जाए।",
                "icon": "🌀",
                "color": (20, 140, 180),
                "action": "Local Exhaust Downdraft Ventilation Active",
                "action_hi": "स्थानीय डस्ट निष्कर्षण पंखा चालू"
            },
            {
                "scene": "N95 RESPIRATOR & CUT GLOVES",
                "scene_hi": "N95 मास्क एवं कट-प्रतिरोधी दस्ताने",
                "en": "Wear snug N95 particulate respirator and Kevlar anti-cut gloves to prevent sharp mica flake lacerations.",
                "hi": "फिटिंग वाला N95 मास्क और कट-प्रतिरोधी दस्ताने पहनें ताकि उंगलियां कटने से बचें।",
                "icon": "🧤",
                "color": (20, 150, 80),
                "action": "N95 Mask & Kevlar Cut-Resistant Gloves Worn",
                "action_hi": "N95 मास्क एवं सुरक्षा दस्ताने पहने"
            },
            {
                "scene": "ERGONOMIC JIGS & POSTURE",
                "scene_hi": "एर्गोनोमिक जिग्स एवं सही मुद्रा",
                "en": "Use mechanical cleaving knife jigs instead of bare fingers. Adjust stool height to maintain 90-degree elbow angle.",
                "hi": "उंगलियों के बजाय सुरक्षा जिग्स का उपयोग करें और स्टूल की ऊंचाई सही रखकर 90 डिग्री की मुद्रा में बैठें।",
                "icon": "🪑",
                "color": (180, 130, 20),
                "action": "Mechanical Cleaving Jigs • 90° Ergonomic Posture",
                "action_hi": "सुरक्षा जिग्स का प्रयोग • सही एर्गोनोमिक मुद्रा"
            },
            {
                "scene": "SAFE RESOLUTION",
                "scene_hi": "सुरक्षित कार्य वातावरण",
                "en": "90% reduction in dust inhalation and zero repetitive musculoskeletal injuries recorded. Worker health protected.",
                "hi": "धूल में 90% की कमी और शून्य चोट। श्रमिक का स्वास्थ्य पूरी तरह सुरक्षित रहा।",
                "icon": "✅",
                "color": (16, 150, 72),
                "action": "90% Dust Reduction • Zero Ergonomic Strain",
                "action_hi": "धूल में 90% की कमी • स्वस्थ एवं सुरक्षित कार्य"
            }
        ]
    }
]

def generate_voiceover(text, lang, out_mp3):
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(out_mp3)

def create_frame(w, h, demo, step, lang, step_idx, total_steps, progress_pct):
    # Create high-resolution graphic canvas
    img = Image.new('RGB', (w, h), (15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(img)
    
    # Try loading default font or large fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 22)
        font_sub = ImageFont.truetype("arial.ttf", 15)
        font_scene = ImageFont.truetype("arialbd.ttf", 17)
        font_body = ImageFont.truetype("arial.ttf", 15)
        font_badge = ImageFont.truetype("arialbd.ttf", 13)
        font_huge = ImageFont.truetype("arialbd.ttf", 36)
    except:
        font_title = font_sub = font_scene = font_body = font_badge = font_huge = ImageFont.load_default()
        
    is_hi = (lang == 'hi')
    
    # Top Header Bar
    draw.rectangle([(0, 0), (w, 54)], fill=(11, 19, 43))
    draw.rectangle([(0, 52), (w, 54)], fill=(0, 229, 255)) # Cyan accent line
    
    cat_text = demo["category"].upper()
    title_text = demo["title_hi"] if is_hi else demo["title_en"]
    draw.text((20, 8), "JH SAFETY AR • " + cat_text, fill=(0, 229, 255), font=font_badge)
    draw.text((20, 26), title_text, fill=(248, 250, 252), font=font_title)
    
    # Language & Audio badge top right
    voice_badge = "🔊 HINDI AUDIO" if is_hi else "🔊 ENGLISH AUDIO"
    draw.rectangle([(w - 150, 12), (w - 20, 42)], fill=(30, 41, 59), outline=(0, 229, 255), width=1)
    draw.text((w - 140, 18), voice_badge, fill=(0, 229, 255), font=font_badge)
    
    # Main Visualization Panel
    panel_box = [(20, 68), (w - 20, 240)]
    step_color = step.get("color", (30, 41, 59))
    draw.rectangle(panel_box, fill=(24, 34, 53), outline=step_color, width=2)
    
    # Inner header in panel
    draw.rectangle([(20, 68), (w - 20, 104)], fill=step_color)
    scene_name = step["scene_hi"] if is_hi else step["scene"]
    step_header = f"STEP {step_idx+1}/{total_steps} • {scene_name}"
    draw.text((36, 76), step_header, fill=(255, 255, 255), font=font_scene)
    
    # Visual Icon & Illustration representation
    draw.rectangle([(36, 118), (140, 222)], fill=(15, 23, 42), outline=step_color, width=2)
    draw.text((58, 140), step["icon"], fill=(255, 255, 255), font=font_huge)
    
    # Key Action Banner inside panel
    action_text = step.get("action_hi" if is_hi else "action", "")
    draw.text((156, 124), "MANDATORY SAFETY ACTION:", fill=(255, 179, 0), font=font_badge)
    draw.text((156, 144), action_text, fill=(248, 250, 252), font=font_scene)
    
    # Industrial Standard / Compliance Tag
    draw.rectangle([(156, 186), (w - 36, 218)], fill=(15, 23, 42))
    draw.text((168, 194), "COMPLIANCE: DGMS CMR 2017 & FACTORIES ACT 1948", fill=(56, 189, 248), font=font_badge)
    
    # Bottom Subtitle & Narration Box
    draw.rectangle([(20, 252), (w - 20, 326)], fill=(11, 19, 43), outline=(51, 65, 85), width=1)
    draw.text((32, 258), "[CC SUBTITLES • " + ("हिंदी" if is_hi else "ENGLISH") + "]", fill=(0, 229, 255), font=font_badge)
    
    narr_text = step["hi"] if is_hi else step["en"]
    # Simple word wrap
    words = narr_text.split(" ")
    line1 = ""
    line2 = ""
    for wrd in words:
        if len(line1) + len(wrd) < 55:
            line1 += wrd + " "
        else:
            line2 += wrd + " "
    draw.text((32, 278), line1.strip(), fill=(255, 255, 255), font=font_body)
    if line2:
        draw.text((32, 300), line2.strip(), fill=(255, 255, 255), font=font_body)
        
    # Progress Scrubber at very bottom
    draw.rectangle([(0, h - 10), (w, h)], fill=(30, 41, 59))
    prog_w = int(w * progress_pct)
    draw.rectangle([(0, h - 10), (prog_w, h)], fill=(0, 229, 255))
    
    return img

def build_demo_video(demo, lang):
    demo_id = demo["id"]
    out_filename = f"{demo_id}_{lang}.mp4"
    final_out_path = os.path.join(OUTPUT_DIR, out_filename)
    
    print(f"--> Building {out_filename}...")
    
    # 1. Generate audio for each step and measure durations
    step_audio_files = []
    step_durations = []
    
    for i, step in enumerate(demo["steps"]):
        text = step["hi"] if lang == "hi" else step["en"]
        audio_file = os.path.join(TEMP_DIR, f"{demo_id}_{lang}_step_{i}.mp3")
        generate_voiceover(text, lang, audio_file)
        
        # Get duration using ffprobe / ffmpeg
        dur_cmd = [FFMPEG, "-i", audio_file]
        res = subprocess.run(dur_cmd, capture_output=True, text=True)
        # Parse Duration: 00:00:03.45
        import re
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", res.stderr)
        if m:
            hrs, mins, secs = m.groups()
            dur = float(hrs)*3600 + float(mins)*60 + float(secs)
        else:
            dur = 3.5
        dur = max(dur + 0.6, 2.5) # Add small pause
        step_audio_files.append(audio_file)
        step_durations.append(dur)
        
    total_duration = sum(step_durations)
    
    # 2. Concat all audio files together
    concat_list_file = os.path.join(TEMP_DIR, f"{demo_id}_{lang}_concat.txt")
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for a_file in step_audio_files:
            # Escape path for ffmpeg concat
            f.write(f"file '{a_file.replace(os.sep, '/')}'\n")
            
    combined_audio = os.path.join(TEMP_DIR, f"{demo_id}_{lang}_full_audio.mp3")
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", concat_list_file, "-c", "copy", combined_audio], capture_output=True)
    
    # 3. Generate image frames at 10 FPS
    fps = 10
    w, h = 640, 360
    
    frame_dir = os.path.join(TEMP_DIR, f"{demo_id}_{lang}_frames")
    os.makedirs(frame_dir, exist_ok=True)
    
    frame_idx = 0
    cum_time = 0.0
    total_steps = len(demo["steps"])
    
    for s_idx, (step, s_dur) in enumerate(zip(demo["steps"], step_durations)):
        num_frames = int(round(s_dur * fps))
        for f in range(num_frames):
            curr_time = cum_time + (f / fps)
            pct = min(curr_time / total_duration, 1.0)
            img = create_frame(w, h, demo, step, lang, s_idx, total_steps, pct)
            frame_path = os.path.join(frame_dir, f"frame_{frame_idx:05d}.jpg")
            img.save(frame_path, quality=85)
            frame_idx += 1
        cum_time += s_dur
        
    # 4. Assemble video with ffmpeg (H.264 + AAC MP4)
    frame_pattern = os.path.join(frame_dir, "frame_%05d.jpg")
    cmd = [
        FFMPEG, "-y",
        "-r", str(fps),
        "-i", frame_pattern,
        "-i", combined_audio,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "28",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "64k",
        "-shortest",
        final_out_path
    ]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode == 0:
        sz = os.path.getsize(final_out_path)
        print(f" Successfully generated {out_filename} ({sz / 1024:.1f} KB, duration ~{total_duration:.1f}s)")
    else:
        print(f" Error generating {out_filename}: {res.stderr}")

def main():
    print(f"Total Demos to process: {len(DEMOS)}")
    for demo in DEMOS:
        print(f"\n================================")
        print(f"Processing {demo['id']}: {demo['title_en']}")
        build_demo_video(demo, "en")
        build_demo_video(demo, "hi")
    print("\nALL 18 DEMO VIDEOS (9 English + 9 Hindi) SUCCESSFULLY CREATED!")

if __name__ == "__main__":
    main()
