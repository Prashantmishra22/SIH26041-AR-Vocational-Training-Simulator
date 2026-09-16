import React, { useState } from 'react';
import { Shield, User, Lock, Building2, Phone, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface WorkerAuthScreenProps {
  onLoginSuccess: (userData: any, token: string) => void;
  selectedLang: string;
  onLanguageChange: (lang: string) => void;
}

const DISTRICTS = [
  'Dhanbad',
  'Bokaro',
  'Ranchi',
  'Ramgarh',
  'Koderma',
  'Giridih',
  'Hazaribagh',
  'West Singhbhum',
];

const SECTORS = [
  { id: 'Mining', label: 'Coal & Mineral Mining (DGMS)', code: 'MINING' },
  { id: 'Steel', label: 'Iron & Steel Manufacturing', code: 'STEEL' },
  { id: 'Mica', label: 'Mica & Processing Units', code: 'MICA' },
];

export const WorkerAuthScreen: React.FC<WorkerAuthScreenProps> = ({
  onLoginSuccess,
  selectedLang,
  onLanguageChange,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>('Rohan Murmu');
  const [workerId, setWorkerId] = useState<string>(`JH-MIN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [phone, setPhone] = useState<string>('+91 94311 78420');
  const [password, setPassword] = useState<string>('safety123');
  const [sector, setSector] = useState<string>('Mining');
  const [organization, setOrganization] = useState<string>('BCCL Dhanbad - Pit #4');
  const [district, setDistrict] = useState<string>('Dhanbad');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Translations
  const t = {
    en: {
      portalTitle: 'Jharkhand State Industrial Safety AR',
      subTitle: 'DGMS Accredited AR Vocational Training Simulator',
      newRegistration: 'New Worker Registration',
      login: 'Worker Login',
      fullName: 'Full Name (श्रमिक का नाम)',
      workerId: 'Worker ID / Gate Pass No.',
      phone: 'Mobile Number',
      sector: 'Industrial Sector',
      district: 'District',
      facility: 'Mine / Factory Unit',
      password: 'PIN / Password',
      submitRegister: 'Register & Launch AR Training',
      submitLogin: 'Login to Portal',
      quickDemo: '⚡ Quick Demo Worker (1-Click Fill)',
      switchLogin: 'Already registered? Login with Worker ID',
      switchRegister: 'New trainee? Register new worker profile',
    },
    hi: {
      portalTitle: 'झारखंड राज्य औद्योगिक सुरक्षा AR',
      subTitle: 'DGMS मान्यता प्राप्त AR व्यावसायिक प्रशिक्षण सिमुलेटर',
      newRegistration: 'नया श्रमिक पंजीकरण',
      login: 'श्रमिक लॉगिन',
      fullName: 'श्रमिक का पूरा नाम',
      workerId: 'श्रमिक आईडी / गेट पास संख्या',
      phone: 'मोबाइल नंबर',
      sector: 'औद्योगिक क्षेत्र',
      district: 'जिला',
      facility: 'खदान / फैक्ट्री इकाई',
      password: 'पिन / पासवर्ड',
      submitRegister: 'पंजीकरण करें एवं AR प्रशिक्षण शुरू करें',
      submitLogin: 'पोर्टल में लॉगिन करें',
      quickDemo: '⚡ त्वरित डेमो वर्कर (1-क्लिक भरें)',
      switchLogin: 'पहले से पंजीकृत हैं? श्रमिक आईडी से लॉगिन करें',
      switchRegister: 'नए प्रशिक्षु? नया श्रमिक प्रोफ़ाइल पंजीकृत करें',
    },
    sat: {
      portalTitle: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱯᱚᱱᱚᱛ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ AR',
      subTitle: 'DGMS ᱢᱟᱱᱟᱣ ᱵᱟᱛᱟᱣ AR ᱥᱮᱪᱮᱫ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ',
      newRegistration: 'ᱱᱟᱣᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ ᱚᱞ',
      login: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ',
      fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
      workerId: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱱᱚᱢᱵᱚᱨ (Worker ID)',
      phone: 'ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ',
      sector: 'ᱠᱟᱹᱢᱤ ᱦᱟᱹᱴᱤᱧ (Sector)',
      district: 'ᱡᱤᱞᱟᱹ (District)',
      facility: 'ᱠᱷᱟᱫᱟᱱ / ᱠᱟᱹᱨᱜᱟᱲ ᱴᱷᱟᱶ',
      password: 'ᱯᱟᱥᱣᱟᱨᱰ',
      submitRegister: 'ᱧᱩᱛᱩᱢ ᱚᱞ ᱟᱨ AR ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ',
      submitLogin: 'ᱵᱚᱞᱚᱱ ᱢᱮ',
      quickDemo: '⚡ ᱞᱚᱜᱚᱱ ᱰᱮᱢᱳ ᱠᱟᱹᱢᱤᱭᱟᱹ (1-Click Fill)',
      switchLogin: 'ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮᱱᱟᱜ-ᱟ? ᱵᱚᱞᱚᱱ ᱢᱮ',
      switchRegister: 'ᱱᱟᱣᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ? ᱱᱟᱣᱟ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ ᱵᱮᱱᱟᱣ ᱢᱮ',
    },
  }[selectedLang as 'en' | 'hi' | 'sat'] || {
    portalTitle: 'Jharkhand Industrial Safety AR',
    subTitle: 'DGMS AR Training Simulator',
    newRegistration: 'New Worker Registration',
    login: 'Worker Login',
    fullName: 'Full Name',
    workerId: 'Worker ID',
    phone: 'Phone',
    sector: 'Sector',
    district: 'District',
    facility: 'Facility Unit',
    password: 'Password',
    submitRegister: 'Register & Launch AR Training',
    submitLogin: 'Login',
    quickDemo: '⚡ Quick Demo Worker (1-Click Fill)',
    switchLogin: 'Already registered? Login',
    switchRegister: 'New trainee? Register',
  };

  const handleQuickDemo = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const demoNames = [
      { name: 'Rohan Murmu', id: `JH-MIN-${randomSuffix}`, district: 'Dhanbad', org: 'BCCL Dhanbad - Pit #4' },
      { name: 'Pooja Soren', id: `JH-MIN-${randomSuffix}`, district: 'Bokaro', org: 'Tata Steel Bokaro Unit' },
      { name: 'Amitabh Oraon', id: `JH-STEEL-${randomSuffix}`, district: 'Ranchi', org: 'SAIL RDCIS Ranchi' },
      { name: 'Sanjay Mahto', id: `JH-MICA-${randomSuffix}`, district: 'Koderma', org: 'Koderma Mica Works' },
    ];
    const picked = demoNames[Math.floor(Math.random() * demoNames.length)];
    setFullName(picked.name);
    setWorkerId(picked.id);
    setDistrict(picked.district);
    setOrganization(picked.org);
    setPhone(`+91 94311 ${randomSuffix}12`);
    setPassword('safety123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode
      ? {
          name: fullName,
          worker_id: workerId.trim().toUpperCase(),
          phone: phone,
          password: password,
          sector: sector,
          organization: organization,
          district: district,
          language: selectedLang,
        }
      : {
          worker_id: workerId.trim().toUpperCase(),
          password: password,
        };

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      onLoginSuccess(
        {
          id: data.user_id,
          workerId: data.worker_id || workerId,
          name: data.name || fullName,
          sector: data.sector || sector,
          district: data.district || district,
          organization: organization,
          language: selectedLang,
        },
        data.access_token
      );
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMessage(err.message || 'Connection failed. Please verify backend is active.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 p-4 sm:p-6 justify-between">
      {/* Top Header & Multi-Language Selector */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-wider uppercase text-amber-400">Govt of Jharkhand</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">DGMS</span>
              </div>
              <h1 className="text-sm font-bold text-slate-100 leading-tight">JH-Safety AR Portal</h1>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 space-x-1">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-all ${
                selectedLang === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-all ${
                selectedLang === 'hi'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('sat')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-all ${
                selectedLang === 'sat'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ᱥᱟᱱᱛᱟᱲᱤ
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{t.portalTitle}</h2>
              <p className="text-[11px] text-slate-300 mt-0.5">{t.subTitle}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
              v2.4 Live
            </span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex mt-5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              isRegisterMode
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.newRegistration}</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              !isRegisterMode
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.login}</span>
          </button>
        </div>

        {/* Quick Demo Fill Button */}
        {isRegisterMode && (
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full mt-3 py-2 px-3 bg-slate-900 hover:bg-slate-800/90 border border-dashed border-amber-500/50 rounded-xl text-amber-400 text-xs font-semibold flex items-center justify-center space-x-2 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>{t.quickDemo}</span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {t.workerId}
              </label>
              <input
                type="text"
                required
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                placeholder="e.g. JH-MIN-1001"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {isRegisterMode ? (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.phone}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {isRegisterMode && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t.sector}
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t.district}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.facility}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. BCCL Dhanbad Pit #2"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create PIN or Password"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4 stroke-[2.5]" />
                <span>{isRegisterMode ? t.submitRegister : t.submitLogin}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer / DGMS Note */}
      <div className="mt-6 pt-3 border-t border-slate-800/80 text-center">
        <p className="text-[10px] text-slate-500 font-medium">
          Directorate General of Mines Safety (DGMS) • Coal Mines Regulations 2017
        </p>
      </div>
    </div>
  );
};
