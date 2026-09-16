import React from 'react';
import { Shield, Award, Flame, Wind, HardHat, CheckCircle2, Play, LogOut, Radio, ChevronRight, Check } from 'lucide-react';

interface WorkerHomeScreenProps {
  user: any;
  selectedLang: string;
  onStartModule: (moduleId: string) => void;
  onLogout: () => void;
  isWsConnected: boolean;
  userCertificates?: any[];
}

export const WorkerHomeScreen: React.FC<WorkerHomeScreenProps> = ({
  user,
  selectedLang,
  onStartModule,
  onLogout,
  isWsConnected,
  userCertificates = [],
}) => {
  const isCertified = userCertificates.length > 0;

  const t = {
    en: {
      welcome: 'Welcome Worker',
      idBadge: 'Gate Pass / ID',
      sector: 'Sector',
      district: 'District',
      complianceStatus: 'Compliance Status',
      certified: 'CERTIFIED (DGMS Valid)',
      inTraining: 'TRAINING PENDING',
      modulesTitle: 'DGMS Mandatory AR Safety Modules',
      modulesSubtitle: 'Complete simulated vocational practice and assessment to earn official license',
      startTraining: 'Launch AR Training',
      retake: 'Review / Retake Module',
      passed: 'Certified Passed',
      logout: 'Logout Worker',
    },
    hi: {
      welcome: 'स्वागत है श्रमिक साथी',
      idBadge: 'गेट पास / आईडी',
      sector: 'औद्योगिक क्षेत्र',
      district: 'जिला',
      complianceStatus: 'सुरक्षा अनुपालन स्थिति',
      certified: 'प्रमाणित (DGMS मान्य)',
      inTraining: 'प्रशिक्षण प्रतीक्षारत',
      modulesTitle: 'DGMS अनिवार्य AR सुरक्षा मॉड्यूल',
      modulesSubtitle: 'आधिकारिक लाइसेंस प्राप्त करने के लिए सिम्युलेटेड अभ्यास और परीक्षा पूर्ण करें',
      startTraining: 'AR प्रशिक्षण शुरू करें',
      retake: 'पुनः अभ्यास करें',
      passed: 'उत्तीर्ण एवं प्रमाणित',
      logout: 'लॉगआउट करें',
    },
    sat: {
      welcome: 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ᱠᱟᱹᱢᱤᱭᱟᱹ',
      idBadge: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ (ID)',
      sector: 'ᱠᱟᱹᱢᱤ ᱦᱟᱹᱴᱤᱧ',
      district: 'ᱡᱤᱞᱟᱹ',
      complianceStatus: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱟᱱᱟᱣ ᱵᱟᱛᱟᱣ',
      certified: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ ᱟᱠᱟᱱᱟ (DGMS)',
      inTraining: 'ᱥᱮᱪᱮᱫ ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜ-ᱟ',
      modulesTitle: 'DGMS ᱞᱟᱹᱠᱛᱤᱭᱟᱱ AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱰᱭᱩᱞ',
      modulesSubtitle: 'ᱞᱟᱭᱥᱮᱱᱥ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ AR ᱥᱮᱪᱮᱫ ᱟᱨ ᱵᱤᱱᱤᱰ ᱯᱩᱨᱟᱹᱣ ᱢᱮ',
      startTraining: 'AR ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ ᱢᱮ',
      retake: 'ᱫᱚᱲᱦᱟ ᱪᱮᱫᱚᱜ ᱢᱮ',
      passed: 'ᱯᱟᱥ ᱟᱠᱟᱱᱟ',
      logout: 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
    },
  }[selectedLang as 'en' | 'hi' | 'sat'] || {
    welcome: 'Welcome Worker',
    idBadge: 'ID',
    sector: 'Sector',
    district: 'District',
    complianceStatus: 'Compliance',
    certified: 'CERTIFIED',
    inTraining: 'IN TRAINING',
    modulesTitle: 'DGMS AR Safety Modules',
    modulesSubtitle: 'Complete vocational practice and assessment',
    startTraining: 'Launch AR Training',
    retake: 'Review Module',
    passed: 'Passed',
    logout: 'Logout',
  };

  const modules = [
    {
      id: 'FIRE-001',
      titleEn: 'Fire & Explosion Response',
      titleHi: 'आग एवं विस्फोट आपातकालीन प्रतिक्रिया',
      titleSat: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱚᱢᱵᱽ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ',
      standard: 'DGMS Coal Mines Reg. 2017 (Reg 168)',
      icon: Flame,
      color: 'from-amber-500 to-rose-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      duration: '8 mins',
      passingScore: 70,
      stepsCount: 4,
      isCompleted: userCertificates.some((c) => c.moduleId === 'FIRE-001'),
    },
    {
      id: 'GAS-001',
      titleEn: 'Gas Leak & Confined Space Protocol',
      titleHi: 'जहरीली गैस रिसाव एवं सीमित स्थान प्रोटोकॉल',
      titleSat: 'ᱵᱤᱥ ᱦᱚᱭ ᱚᱰᱚᱠ ᱟᱨ ᱥᱟᱸᱜᱤᱧ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ',
      standard: 'DGMS Technical Circular (CH4/CO Limit)',
      icon: Wind,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      duration: '10 mins',
      passingScore: 70,
      stepsCount: 4,
      isCompleted: userCertificates.some((c) => c.moduleId === 'GAS-001'),
    },
    {
      id: 'PPE-001',
      titleEn: 'PPE & Workplace Safety Standards',
      titleHi: 'व्यक्तिगत सुरक्षा उपकरण (PPE) मानक',
      titleSat: 'ᱟᱯᱱᱟᱨᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ (PPE) ᱱᱤᱭᱚᱢ',
      standard: 'Factories Act 1948 & DGMS Mandate',
      icon: HardHat,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      duration: '6 mins',
      passingScore: 70,
      stepsCount: 3,
      isCompleted: userCertificates.some((c) => c.moduleId === 'PPE-001'),
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 space-y-4">
      {/* Worker Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-4 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shadow-amber-500/20">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'WM'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-100">{user.name}</h2>
                <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>
              <p className="text-xs font-mono text-amber-400 font-bold mt-0.5">{user.workerId}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{user.organization || 'Jharkhand Industrial Zone'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title={t.logout}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Attributes Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">{t.sector}</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block">{user.sector || 'Mining'}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">{t.district}</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block">{user.district || 'Dhanbad'}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Status</span>
            <span className={`text-[11px] font-black mt-0.5 block ${isCertified ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isCertified ? 'CERTIFIED' : 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Sync / Connection Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Radio className={`w-3.5 h-3.5 ${isWsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="text-slate-300 font-medium text-[11px]">
            {isWsConnected ? 'Direct WebSocket link active with Admin Portal' : 'Connecting WebSocket stream...'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">PORT 8000</span>
      </div>

      {/* Modules Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.modulesTitle}</h3>
            <p className="text-[11px] text-slate-400">{t.modulesSubtitle}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {modules.map((m) => {
            const Icon = m.icon;
            const localizedTitle =
              selectedLang === 'hi'
                ? m.titleHi
                : selectedLang === 'sat'
                ? m.titleSat
                : m.titleEn;

            return (
              <div
                key={m.id}
                className="group relative rounded-xl bg-slate-900 border border-slate-800/90 hover:border-amber-500/50 p-3.5 transition-all shadow-md hover:shadow-amber-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border ${m.badgeColor}`}>
                          {m.id}
                        </span>
                        {m.isCompleted && (
                          <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.passed}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 mt-1 leading-snug">{localizedTitle}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{m.standard}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-medium">
                    <span>⏱ {m.duration}</span>
                    <span>🎯 Passing: {m.passingScore}%</span>
                    <span>🕹 {m.stepsCount} Steps</span>
                  </div>

                  <button
                    onClick={() => onStartModule(m.id)}
                    className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{m.isCompleted ? t.retake : t.startTraining}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
