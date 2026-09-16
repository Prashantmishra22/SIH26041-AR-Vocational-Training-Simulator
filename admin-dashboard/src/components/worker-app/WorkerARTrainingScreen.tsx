import React, { useState, useEffect } from 'react';
import { Shield, Flame, Wind, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Volume2, Eye, Compass, Zap, Target } from 'lucide-react';

interface WorkerARTrainingScreenProps {
  moduleId: string;
  selectedLang: string;
  onCompleteSimulation: () => void;
  onBackToHome: () => void;
  onSendWsEvent: (eventType: string, step: number, totalSteps: number, description: string) => void;
}

export const WorkerARTrainingScreen: React.FC<WorkerARTrainingScreenProps> = ({
  moduleId,
  selectedLang,
  onCompleteSimulation,
  onBackToHome,
  onSendWsEvent,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [interactionDone, setInteractionDone] = useState<boolean>(false);
  const [hazardTemp, setHazardTemp] = useState<number>(340);
  const [gasLevel, setGasLevel] = useState<number>(1.8);
  const [arTargetLocked, setArTargetLocked] = useState<boolean>(false);

  const isFire = moduleId === 'FIRE-001';

  // Step definitions based on module
  const fireSteps = [
    {
      stepNumber: 1,
      titleEn: 'Step 1: Rapid Hazard Identification',
      titleHi: 'चरण 1: त्वरित खतरे की पहचान एवं अलार्म',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱟᱹᱰᱤ ᱞᱚᱜᱚᱱ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ',
      instructionEn: 'Scan the pit face with AR sensor. Locate the spontaneous combustion hotspot and trigger the local mine emergency bell.',
      instructionHi: 'AR सेंसर से खदान की दीवार को स्कैन करें। सुलगते कोयले की पहचान करें और आपातकालीन सायरन सक्रिय करें।',
      instructionSat: 'AR ᱥᱮᱱᱥᱚᱨ ᱛᱮ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱥᱟᱭᱨᱮᱱ ᱪᱟᱹᱞᱩ ᱢᱮ',
      actionLabelEn: '🚨 Sound Emergency Alarm',
      actionLabelHi: '🚨 आपातकालीन सायरन बजाएं',
      actionLabelSat: '🚨 ᱮᱞᱟᱨᱢ ᱪᱟᱹᱞᱩ ᱢᱮ',
      feedbackEn: 'Hotspot confirmed at Pit Face 4-B. Emergency protocol broadcasted to surface control.',
      feedbackHi: 'पिट फेस 4-B पर हॉटस्पॉट की पुष्टि हुई। सतह नियंत्रण कक्ष को सूचना प्रसारित कर दी गई।',
      feedbackSat: 'ᱯᱤᱴ ᱯᱷᱮᱥ ᱔-ᱵᱤ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱮᱱᱟ',
      hint: 'DGMS CMR 2017: Immediate alarm within 30 seconds of observation.',
    },
    {
      stepNumber: 2,
      titleEn: 'Step 2: Extinguisher Inspection & Pressure Check',
      titleHi: 'चरण 2: अग्निशामक यंत्र की जांच एवं दबाव सत्यापन',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱒: ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱯᱩᱨᱠᱷᱟᱹ (Extinguisher)',
      instructionEn: 'Inspect the Type ABC Dry Chemical Powder (DCP) extinguisher. Verify the pressure gauge is in the GREEN zone and the safety seal is intact.',
      instructionHi: 'ABC प्रकार के ड्राई केमिकल पाउडर (DCP) अग्निशामक की जांच करें। गेज के हरे निशान में होने की पुष्टि करें।',
      instructionSat: 'DCP ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱨᱮᱱᱟᱜ ᱯᱨᱮᱥᱟᱨ ᱜᱮᱡᱽ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ ᱥᱮ ᱵᱟᱝ ᱧᱮᱞ ᱢᱮ',
      actionLabelEn: '🔍 Verify Pressure Gauge',
      actionLabelHi: '🔍 दबाव गेज सत्यापित करें',
      actionLabelSat: '🔍 ᱯᱨᱮᱥᱟᱨ ᱜᱮᱡᱽ ᱯᱩᱨᱠᱷᱟᱹᱭ ᱢᱮ',
      feedbackEn: 'Pressure verified at 14.5 bar (GREEN). Safety pin and tamper seal intact.',
      feedbackHi: 'दबाव 14.5 बार (हरा क्षेत्र) पर सत्यापित। सुरक्षा सील सुरक्षित है।',
      feedbackSat: 'ᱜᱮᱡᱽ ᱴᱷᱤᱠ ᱜᱮᱭᱟ ᱟᱨ ᱥᱤᱞ ᱦᱚᱸ ᱴᱷᱤᱠ ᱢᱮᱱᱟᱜ-ᱟ',
      hint: 'DGMS CMR 2017: Never use water on electrical or combustible dust fires.',
    },
    {
      stepNumber: 3,
      titleEn: 'Step 3: Execute P.A.S.S. Suppression Method',
      titleHi: 'चरण 3: P.A.S.S. अग्निशमन तकनीक का निष्पादन',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱓: P.A.S.S. ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ',
      instructionEn: 'Perform the mandatory PASS protocol: Pull pin, Aim nozzle at the BASE of the flame, Squeeze handle firmly, Sweep side-to-side.',
      instructionHi: 'P.A.S.S. तकनीक अपनाएं: पिन खींचें (Pull), लपटों की जड़ पर निशाना लगाएं (Aim), हैंडल दबाएं (Squeeze), बाएं-दाएं घुमाएं (Sweep)।',
      instructionSat: 'ᱯᱤᱱ ᱚᱰᱚᱠ ᱢᱮ (Pull), ᱥᱮᱸᱜᱮᱞ ᱨᱮᱦᱮᱫ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ (Aim), ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱢᱮ (Squeeze), ᱟᱰᱮᱯᱟᱥᱮ ᱦᱤᱞᱟᱹᱣ ᱢᱮ (Sweep)',
      actionLabelEn: '🧯 Squeeze & Sweep at Flame Base',
      actionLabelHi: '🧯 आग की जड़ पर छिड़काव करें',
      actionLabelSat: '🧯 ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱥᱯᱨᱮ ᱢᱮ',
      feedbackEn: 'Flame suppressed by 92%. Residual cooling initiated. Airflow maintained.',
      feedbackHi: 'आग 92% तक बुझाई गई। अवशेषों को ठंडा किया जा रहा है। वायु प्रवाह सामान्य है।',
      feedbackSat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ',
      hint: 'Always stand upwind at minimum 2-3 meters safe distance.',
    },
    {
      stepNumber: 4,
      titleEn: 'Step 4: Safe Evacuation via Intake Airway',
      titleHi: 'चरण 4: इनटेक एयरवे के रास्ते सुरक्षित निकासी',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱔: ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱰᱟᱦᱟᱨ ᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
      instructionEn: 'Follow the illuminated green refuge markers along the fresh air intake gallery. Never retreat into the return airway contaminated with toxic CO fumes.',
      instructionHi: 'ताजा हवा के इनटेक मार्ग पर लगे हरे रिफ्यूज मार्करों का अनुसरण करें। कभी भी विषैले धुएं वाले रिटर्न मार्ग की ओर न जाएं।',
      instructionSat: 'ᱦᱟᱹᱨᱭᱟᱹᱲ ᱵᱟᱹᱛᱤ ᱪᱤᱱᱦᱟᱹ ᱯᱟᱸᱡᱟ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
      actionLabelEn: '🚶 Follow Safe Escape Pathway',
      actionLabelHi: '🚶 सुरक्षित निकास पथ का अनुसरण करें',
      actionLabelSat: '🚶 ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ',
      feedbackEn: 'Reached Main Intake Shaft #1 safely. Atmospheric readings clear. Simulation accomplished!',
      feedbackHi: 'मुख्य इनटेक शाफ्ट #1 पर सुरक्षित पहुंचे। वायुमंडलीय स्तर सामान्य। सिमुलेशन पूर्ण!',
      feedbackSat: 'ᱥᱟᱯᱷᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱴᱮᱨ ᱮᱱᱟ',
      hint: 'Check Self-Contained Self-Rescuer (SCSR) seal before entering smoke.',
    },
  ];

  const gasSteps = [
    {
      stepNumber: 1,
      titleEn: 'Step 1: Multi-Gas Detector Sampling',
      titleHi: 'चरण 1: मल्टी-गैस डिटेक्टर से वायुमंडलीय जांच',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱜᱮᱥ ᱪᱮᱠ ᱢᱤᱥᱤᱱ ᱛᱮ ᱦᱚᱭ ᱯᱩᱨᱠᱷᱟᱹ',
      instructionEn: 'Turn on calibrated multi-gas monitor. Sample roof cavities for lighter-than-air Methane (CH4) and floor zones for Carbon Monoxide (CO).',
      instructionHi: 'कैलिब्रेटेड मल्टी-गैस डिटेक्टर चालू करें। छत की गुहाओं में मीथेन (CH4) और फर्श पर कार्बन मोनोऑक्साइड (CO) का परीक्षण करें।',
      instructionSat: 'ᱢᱤᱥᱤᱱ ᱪᱟᱹᱞᱩ ᱠᱟᱛᱮ ᱪᱮᱛᱟᱱ ᱟᱨ ᱞᱟᱛᱟᱨ ᱦᱚᱭ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱧᱮᱞ ᱢᱮ',
      actionLabelEn: '📡 Sample Gas Levels',
      actionLabelHi: '📡 गैस स्तर का नमूना लें',
      actionLabelSat: '📡 ᱜᱮᱥ ᱞᱮᱵᱷᱮᱞ ᱧᱮᱞ ᱢᱮ',
      feedbackEn: 'CH4 detected at 1.8% (DGMS Permissible Limit: 1.25%). Immediate ventilation required.',
      feedbackHi: 'मीथेन स्तर 1.8% दर्ज (DGMS सुरक्षित सीमा: 1.25%)। तुरंत वेंटिलेशन आवश्यक है।',
      feedbackSat: 'ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱡᱟᱹᱥᱛᱤ ᱢᱮᱱᱟᱜ-ᱟ, ᱦᱚᱭ ᱪᱟᱹᱞᱩ ᱦᱩᱭᱩᱜ-ᱟ',
      hint: 'DGMS Reg 169: Cut electric power when methane exceeds 1.25%.',
    },
    {
      stepNumber: 2,
      titleEn: 'Step 2: Electrical Isolation & Power Trip',
      titleHi: 'चरण 2: विद्युत आइसोलेशन एवं पावर ट्रिप',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱒: ᱵᱤᱡᱽᱞᱤ ᱞᱟᱭᱤᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱹᱢᱤ',
      instructionEn: 'Immediately isolate the flameproof gate-end switch box to eliminate spark risks before methane reaches explosive threshold (5.0%).',
      instructionHi: 'स्पार्क के खतरे को समाप्त करने के लिए गेट-एंड स्विच बॉक्स से विद्युत आपूर्ति तुरंत बंद (ट्रिप) करें।',
      instructionSat: 'ᱥᱮᱸᱜᱮᱞ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ',
      actionLabelEn: '⚡ Trip Flameproof Power Switch',
      actionLabelHi: '⚡ फ्लेमप्रूफ पावर स्विच ट्रिप करें',
      actionLabelSat: '⚡ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱢᱮ',
      feedbackEn: 'Section power isolated. Spark hazard neutralized.',
      feedbackHi: 'अनुभाग की बिजली सफलतापूर्वक बंद। स्पार्क का खतरा टला।',
      feedbackSat: 'ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱮᱱᱟ',
      hint: 'Never operate non-intrinsically safe radios in high methane zones.',
    },
    {
      stepNumber: 3,
      titleEn: 'Step 3: Auxiliary Fan & Brattice Cloth Routing',
      titleHi: 'चरण 3: सहायक पंखा एवं ब्रैंटिस क्लॉथ एयर डक्टिंग',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱓: ᱯᱷᱮᱱ ᱟᱨ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱴᱷᱤᱠ ᱢᱮ',
      instructionEn: 'Deploy flexible ducting from the auxiliary forcing fan. Direct fresh air stream to dilute the stagnant gas pocket.',
      instructionHi: 'सहायक पंखे से लचीली डक्टिंग बिछाएं। स्थिर गैस को पतला करने के लिए ताजी हवा का प्रवाह केंद्रित करें।',
      instructionSat: 'ᱯᱷᱮᱱ ᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱪᱟᱹᱞᱩ ᱠᱟᱛᱮ ᱵᱤᱥ ᱜᱮᱥ ᱚᱰᱚᱠ ᱢᱮ',
      actionLabelEn: '💨 Activate Auxiliary Ventilation',
      actionLabelHi: '💨 सहायक वेंटिलेशन सक्रिय करें',
      actionLabelSat: '💨 ᱦᱚᱭ ᱪᱟᱹᱞᱩ ᱢᱮ',
      feedbackEn: 'Airflow achieved 18 m3/min. Methane level dropped from 1.8% to 0.4% (SAFE).',
      feedbackHi: 'हवा का प्रवाह 18 घन मीटर/मिनट। मीथेन स्तर गिरकर 0.4% (सुरक्षित) हुआ।',
      feedbackSat: 'ᱜᱮᱥ ᱠᱚᱢ ᱮᱱᱟ, ᱱᱤᱛᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ',
      hint: 'Air velocity in heading must not fall below 0.5 m/s.',
    },
    {
      stepNumber: 4,
      titleEn: 'Step 4: Final Gas Clearance & Section Tagging',
      titleHi: 'चरण 4: अंतिम गैस क्लीयरेंस एवं सुरक्षा टैगिंग',
      titleSat: 'ᱦᱟᱹᱴᱤᱧ ᱔: ᱢᱩᱪᱟᱹᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱮᱜᱽ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
      instructionEn: 'Log atmospheric readings on the statutory DGMS board. Affix green safety clearance tag before resuming work.',
      instructionHi: 'वैधानिक DGMS बोर्ड पर गैस स्तर दर्ज करें। कार्य पुनः आरंभ करने से पहले हरा सुरक्षा टैग लगाएं।',
      instructionSat: 'ᱵᱳᱨᱰ ᱨᱮ ᱚᱞ ᱢᱮ ᱟᱨ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ',
      actionLabelEn: '🏷️ Tag Section as SAFE',
      actionLabelHi: '🏷️ क्षेत्र को सुरक्षित टैग करें',
      actionLabelSat: '🏷️ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ',
      feedbackEn: 'Section tagged SAFE. Clearance reported to DGMS inspectorate dashboard.',
      feedbackHi: 'क्षेत्र को सुरक्षित घोषित किया गया। रिपोर्ट DGMS डैशबोर्ड पर प्रेषित।',
      feedbackSat: 'ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ',
      hint: 'Keep continuous monitoring active during all shifts.',
    },
  ];

  const steps = isFire ? fireSteps : gasSteps;
  const currentStep = steps[currentStepIndex];

  // Notify backend WebSocket when module starts
  useEffect(() => {
    onSendWsEvent('MODULE_STARTED', 1, steps.length, `Worker launched ${moduleId} AR Vocational Simulation`);
  }, [moduleId]);

  const handleInteractiveAction = () => {
    setInteractionDone(true);
    if (isFire) {
      setHazardTemp((prev) => Math.max(45, prev - 85));
    } else {
      setGasLevel((prev) => Math.max(0.3, prev - 0.5));
    }

    // Send real-time step completed event to backend WebSocket
    onSendWsEvent(
      'MODULE_STEP_COMPLETED',
      currentStepIndex + 1,
      steps.length,
      `Completed Step ${currentStepIndex + 1}: ${currentStep.titleEn}`
    );
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setInteractionDone(false);
      setArTargetLocked(false);
    } else {
      // Finished all vocational steps
      onSendWsEvent('MODULE_COMPLETED', steps.length, steps.length, `Worker accomplished all practical steps for ${moduleId}`);
      onCompleteSimulation();
    }
  };

  const localizedTitle =
    selectedLang === 'hi'
      ? currentStep.titleHi
      : selectedLang === 'sat'
      ? currentStep.titleSat
      : currentStep.titleEn;

  const localizedInstruction =
    selectedLang === 'hi'
      ? currentStep.instructionHi
      : selectedLang === 'sat'
      ? currentStep.instructionSat
      : currentStep.instructionEn;

  const localizedAction =
    selectedLang === 'hi'
      ? currentStep.actionLabelHi
      : selectedLang === 'sat'
      ? currentStep.actionLabelSat
      : currentStep.actionLabelEn;

  const localizedFeedback =
    selectedLang === 'hi'
      ? currentStep.feedbackHi
      : selectedLang === 'sat'
      ? currentStep.feedbackSat
      : currentStep.feedbackEn;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 p-4 justify-between space-y-3">
      {/* Top Header & Step Progress Bar */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quit AR</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
              {moduleId}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all ${
                idx < currentStepIndex
                  ? 'bg-emerald-400'
                  : idx === currentStepIndex
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Realistic Simulated AR Camera / 3D Spatial Canvas */}
        <div className="relative mt-3 h-52 sm:h-60 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-700/80 overflow-hidden flex flex-col justify-between p-3 shadow-2xl">
          {/* Simulated Mine Atmosphere & Camera Overlay */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* AR Target Reticle / Visual Hazard */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center">
              {isFire ? (
                <div className={`relative transition-transform duration-700 ${interactionDone ? 'scale-75 opacity-60' : 'scale-125 animate-pulse'}`}>
                  <Flame className="w-16 h-16 text-rose-500 filter drop-shadow-[0_0_16px_rgba(244,63,94,0.8)]" />
                  <div className="absolute -bottom-1 -left-2 -right-2 h-4 bg-amber-500/40 blur-md rounded-full" />
                </div>
              ) : (
                <div className={`relative transition-transform duration-700 ${interactionDone ? 'scale-75 opacity-50' : 'scale-125 animate-pulse'}`}>
                  <Wind className="w-16 h-16 text-cyan-400 filter drop-shadow-[0_0_16px_rgba(6,182,212,0.8)]" />
                  <div className="absolute -bottom-1 -left-2 -right-2 h-4 bg-cyan-500/40 blur-md rounded-full" />
                </div>
              )}

              {/* Bounding Box HUD */}
              <div className="mt-2 px-2.5 py-0.5 rounded bg-black/80 border border-amber-400/80 text-[10px] font-mono text-amber-300 flex items-center space-x-1.5 shadow-lg">
                <Target className="w-3 h-3 text-amber-400 animate-spin" />
                <span>
                  {isFire ? `SEAM TEMP: ${hazardTemp}°C` : `CH4 CONC: ${gasLevel.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* AR HUD Top Overlay */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700">
              <Compass className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>PIT FACE #4 • SEAM III</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700 text-amber-400">
              <Eye className="w-3 h-3" />
              <span>AR SPATIAL TRACKING: ACTIVE</span>
            </div>
          </div>

          {/* AR HUD Bottom Overlay */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <div className="bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700">
              DGMS CMR 2017 REGULATION VERIFIED
            </div>
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-lg font-bold">
              GPS: 23.7957° N, 86.4304° E
            </div>
          </div>
        </div>

        {/* Step Instruction Card */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-xs font-bold text-amber-400">{localizedTitle}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Vocational Task
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {localizedInstruction}
          </p>

          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">
            💡 <span className="font-semibold">DGMS Standard:</span> {currentStep.hint}
          </div>

          {/* Interactive Action Button for this step */}
          {!interactionDone ? (
            <button
              onClick={handleInteractiveAction}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{localizedAction}</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-xs text-emerald-300 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{localizedFeedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation: Next Step or Finish */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          disabled={currentStepIndex === 0}
          onClick={() => {
            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            setInteractionDone(true);
          }}
          className="px-3 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          disabled={!interactionDone}
          onClick={handleNextStep}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <span>{currentStepIndex === steps.length - 1 ? 'Take Assessment Exam' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
