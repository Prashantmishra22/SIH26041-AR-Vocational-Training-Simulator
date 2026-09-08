using System;
using System.Collections.Generic;
using UnityEngine;
using JHSafetyAR.Data;

namespace JHSafetyAR.Video
{
    [Serializable]
    public class LiveDemoVideoItem
    {
        public string id;
        public string category;
        public string title;
        public string titleHindi;
        public string titleSantali;
        public string duration;
        public string problemDescription;
        public string hazardIdentified;
        public string correctResponse;
        public List<string> stepByStepProcedure;
        public string safeOutcome;
        public string targetModuleId;
    }

    public class DemoVideoManager : MonoBehaviour
    {
        public static DemoVideoManager Instance { get; private set; }

        private List<LiveDemoVideoItem> _demoVideos = new List<LiveDemoVideoItem>();

        public List<LiveDemoVideoItem> DemoVideos => _demoVideos;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            InitializeDemoVideos();
        }

        private void InitializeDemoVideos()
        {
            _demoVideos = new List<LiveDemoVideoItem>
            {
                new LiveDemoVideoItem
                {
                    id = "demo_01",
                    category = "Fire Emergency",
                    title = "Underground Conveyor Belt Friction Fire & Extinguisher Deployment",
                    titleHindi = "भूमिगत कन्वेयर बेल्ट घर्षण आग एवं अग्निशामक का उपयोग",
                    titleSantali = "ᱠᱩᱭᱞᱟᱹ ᱵᱮᱞᱴ ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ",
                    duration = "3:45",
                    problemDescription = "Coal fines accumulate around seized conveyor roller creating high friction heat (>90°C).",
                    hazardIdentified = "Class B/C Conveyor Fire spreading toxic Carbon Monoxide into ventilation airway.",
                    correctResponse = "Sound klaxon alarm, isolate electrical breaker, deploy DCP extinguisher with PASS sequence.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Thermal scan detects friction hotspot at roller bearing",
                        "2. Pull emergency trip wire to halt conveyor motor",
                        "3. Pull safety pin from DCP extinguisher handle",
                        "4. Aim nozzle at base of flame from 2 meters standoff",
                        "5. Squeeze handle and sweep across base until flame is smothered"
                    },
                    safeOutcome = "Fire neutralized before spreading to coal face; miners safely evacuate along intake shaft.",
                    targetModuleId = AppConstants.MODULE_FIRE
                },
                new LiveDemoVideoItem
                {
                    id = "demo_02",
                    category = "Gas Leak",
                    title = "Roof Cavity Methane (CH4) Firedamp Detection & Air Purging",
                    titleHindi = "छत गुहा में मीथेन गैस का पता लगाना एवं निष्कासन",
                    titleSantali = "ᱪᱷᱟᱛ ᱨᱮ ᱢᱤᱛᱷᱮᱱ (CH4) ᱯᱟᱱᱛᱷᱟ ᱟᱨ ᱥᱟᱯᱷᱟ",
                    duration = "4:10",
                    problemDescription = "Pockets of lighter-than-air explosive methane accumulate in unventilated blind roof fissures.",
                    hazardIdentified = "Explosive Firedamp layer exceeding 1.25% explosive limit.",
                    correctResponse = "Use telescopic probe multi-gas detector and engage auxiliary pneumatic venturi air jet.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Fresh air zero-calibration of 4-gas monitor",
                        "2. Extend telescopic sampling wand to top 10cm of roof apex",
                        "3. Record 2.1% CH4 reading exceeding legal limit",
                        "4. Open compressed air line to activate pneumatic venturi jet",
                        "5. Fasten red Danger lockout barrier across heading"
                    },
                    safeOutcome = "Methane diluted below 0.5% into return airway; heading safely barricaded.",
                    targetModuleId = AppConstants.MODULE_GAS
                },
                new LiveDemoVideoItem
                {
                    id = "demo_03",
                    category = "Confined Space",
                    title = "Mica Adit Sump Entry & Atmospheric Testing Protocol",
                    titleHindi = "माइका भूमिगत गुहा प्रवेश एवं वायुमंडलीय परीक्षण",
                    titleSantali = "ᱢᱟᱭᱠᱟ ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱟᱨ ᱦᱚᱭ ᱯᱚᱨᱠᱷᱟᱣ",
                    duration = "3:20",
                    problemDescription = "Deep sump accumulation of heavy asphyxiating gases with oxygen depletion (<18% O2).",
                    hazardIdentified = "Atmospheric hypoxia and toxic H2S accumulation.",
                    correctResponse = "Continuous 3-level atmospheric gas test, harness connection, and designated standby attendant.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Lower sampling probe to bottom sump zone for 30s",
                        "2. Verify O2 level >= 19.5% before entry",
                        "3. Fasten full-body fall arrest harness and safety lifeline",
                        "4. Establish verbal whistle communication with surface buddy"
                    },
                    safeOutcome = "Worker safely performs maintenance under constant buddy supervision.",
                    targetModuleId = AppConstants.MODULE_GAS
                },
                new LiveDemoVideoItem
                {
                    id = "demo_04",
                    category = "Machinery Safety",
                    title = "Heavy Haulage Truck Blind Spots & Proximity Warning",
                    titleHindi = "भारी डंपर ट्रक ब्लाइंड स्पॉट एवं निकटता चेतावनी",
                    titleSantali = "ᱰᱟᱢᱯᱟᱨ ᱴᱨᱟᱠ ᱵᱞᱟᱭᱤᱱᱰ ᱥᱯᱳᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ",
                    duration = "2:50",
                    problemDescription = "Massive 100-tonne haul dumpers have large 15-meter blind spots around cab and rear wheels.",
                    hazardIdentified = "Crush and run-over hazard for ground workers in open-cast quarries.",
                    correctResponse = "Stay outside 20m safety zone, wear high-vis reflector vest, establish eye contact with driver.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Identify marked green pedestrian walkway",
                        "2. Acknowledge proximity radar audible warning beep",
                        "3. Never walk behind reversing heavy dumpers"
                    },
                    safeOutcome = "Ground personnel clear haulage corridor safely.",
                    targetModuleId = AppConstants.MODULE_MACHINERY
                },
                new LiveDemoVideoItem
                {
                    id = "demo_05",
                    category = "PPE Safety",
                    title = "Blast Furnace Aluminized Suit & Molten Splash Protection",
                    titleHindi = "ब्लास्ट फर्नेस एल्युमिनाइज्ड सूट एवं गर्म धातु सुरक्षा",
                    titleSantali = "ᱞᱚᱞᱚ ᱢᱮᱬᱦᱮᱫ ᱯᱤ.ᱯᱤ.ᱤ ᱥᱩᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ",
                    duration = "3:15",
                    problemDescription = "Tapping blast furnace molten iron (1500°C) with radiant heat and slag spitting.",
                    hazardIdentified = "Extreme thermal burns and radiant retinal injury.",
                    correctResponse = "Inspect aluminized heat suit, gold-coated visor, and thermal gauntlets.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Check aluminized suit seams for tears",
                        "2. Lower gold visor over safety helmet",
                        "3. Stay behind thermal runner deflection shield"
                    },
                    safeOutcome = "Tapping executed with 100% personal protective compliance.",
                    targetModuleId = AppConstants.MODULE_PPE
                },
                new LiveDemoVideoItem
                {
                    id = "demo_06",
                    category = "Emergency Evacuation",
                    title = "Zero-Visibility Lifeline Navigation & Self-Rescuer Donning",
                    titleHindi = "शून्य दृश्यता में लाइफलाइन नेविगेशन एवं एससीएसआर पहनना",
                    titleSantali = "ᱫᱟᱹᱲᱤ ᱥᱟᱵ ᱠᱟᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱟᱨ SCSR ᱦᱚᱨᱚᱜ",
                    duration = "4:30",
                    problemDescription = "Dense toxic smoke reduces underground visibility to under 0.5 meters.",
                    hazardIdentified = "Disorientation and toxic inhalation in gallery.",
                    correctResponse = "Don SCSR within 20s, grasp tactile directional cones on lifeline, walk briskly to intake shaft.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Break SCSR seal, insert mouthpiece and nose clip",
                        "2. Grasp tactile lifeline cord with continuous grip",
                        "3. Follow cone apex pointing towards fresh air shaft",
                        "4. Exit airlock doors to surface"
                    },
                    safeOutcome = "Complete crew arrives safely at surface check-in portal.",
                    targetModuleId = AppConstants.MODULE_EMERGENCY
                },
                new LiveDemoVideoItem
                {
                    id = "demo_07",
                    category = "Mining Hazards",
                    title = "Coal Dust Explosion Shockwave & Stone Dusting Shelves",
                    titleHindi = "कोयला धूल विस्फोट एवं स्टोन डस्टिंग शेल्फ",
                    titleSantali = "ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱵᱷᱩᱲᱠᱟᱹᱜ ᱟᱴᱠᱟᱣ",
                    duration = "3:50",
                    problemDescription = "Initial methane spark suspends dry coal dust, creating secondary high-velocity flame wave.",
                    hazardIdentified = "Catastrophic gallery-wide explosion propagation.",
                    correctResponse = "Maintain incombustible limestone dust barrier shelves at regular intervals.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Inspect stone dusting bag integrity",
                        "2. Ensure trigger trip arm is unobstructed",
                        "3. Disperse floor dust inerting mixture"
                    },
                    safeOutcome = "Flame front quenched by incombustible dust cloud.",
                    targetModuleId = AppConstants.MODULE_FIRE
                },
                new LiveDemoVideoItem
                {
                    id = "demo_08",
                    category = "Steel Plant Hazards",
                    title = "Overhead Ladle Crane Hot Metal Clearance & Acoustic Alarm",
                    titleHindi = "ओवरहेड क्रेन गर्म धातु क्लीयरेंस एवं अलार्म",
                    titleSantali = "ᱠᱨᱮᱱ ᱞᱚᱞᱚ ᱢᱮᱬᱦᱮᱫ ᱟᱞᱟᱨᱢ",
                    duration = "3:10",
                    problemDescription = "200-tonne overhead crane transfers molten steel ladle across melt shop floor.",
                    hazardIdentified = "Overhead suspended hot load fall hazard.",
                    correctResponse = "Hear crane horn -> Immediately clear gantry drop zone -> Stand in green safety zone.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Identify acoustic crane siren signal",
                        "2. Step outside yellow exclusion floor markings",
                        "3. Wait until ladle has traversed beyond workstation"
                    },
                    safeOutcome = "Zero personnel exposure under suspended load path.",
                    targetModuleId = AppConstants.MODULE_PPE
                },
                new LiveDemoVideoItem
                {
                    id = "demo_09",
                    category = "Mica Processing Hazards",
                    title = "Mica Flaking Adit Shoring & Respirable Silica Suppression",
                    titleHindi = "माइका गुहा शोरिंग एवं सिलिका धूल नियंत्रण",
                    titleSantali = "ᱢᱟᱭᱠᱟ ᱠᱷᱟᱫᱟᱱ ᱠᱷᱩᱸᱴᱤ ᱟᱨ ᱥᱤᱞᱤᱠᱟ ᱫᱷᱩᱲᱤ ᱟᱴᱠᱟᱣ",
                    duration = "3:30",
                    problemDescription = "Mica schist roof collapse risk and crystalline quartz silica inhalation leading to silicosis.",
                    hazardIdentified = "Roof strata fall and respirable toxic dust.",
                    correctResponse = "Erect friction timber props perpendicular to dip and activate wet-drilling mist nozzles.",
                    stepByStepProcedure = new List<string>
                    {
                        "1. Tap loose roof rock with sounding rod",
                        "2. Wedge friction prop with solid headboard",
                        "3. Check 3.5 bar water mist pressure to drill bit",
                        "4. Don FFP3 respirator with tight user seal check"
                    },
                    safeOutcome = "100% dust encapsulation and reinforced tunnel roof stability.",
                    targetModuleId = AppConstants.MODULE_GAS
                }
            };
        }
    }
}
