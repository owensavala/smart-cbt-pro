'use client';

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  School,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Layers,
  Monitor,
  BarChart3,
  KeyRound,
  Users,
  Compass,
  GraduationCap,
  Mail,
  Key,
  RefreshCw,
  X,
  HelpCircle,
  Send,
} from 'lucide-react';
import { Role, SchoolBrandingSettings } from '../lib/types';
import {
  loginAction,
  requestPasswordResetOtpAction,
  verifyResetOtpAndChangePasswordAction,
  emergencyResetPasswordAction,
} from '../app/actions/auth-actions';
import { getResolvedThemeColors } from '../lib/theme-palettes';
import HelpTutorialModal from './common/HelpTutorialModal';

interface LoginViewProps {
  onLogin: (role: Role, username: string, sessionUser?: any) => void;
  branding?: SchoolBrandingSettings;
}

export default function LoginView({ onLogin, branding }: LoginViewProps) {
  // Mode Login: 'ADMIN_GURU' (Split screen) atau 'SISWA' (Centered green card ala Screenshot Siswa)
  const [loginMode, setLoginMode] = useState<'ADMIN_GURU' | 'SISWA'>('ADMIN_GURU');

  // Resolved 4-Color Theme
  const theme = getResolvedThemeColors(branding);

  // Auto-detect login mode preferences based on last session
  React.useEffect(() => {
    try {
      const savedMode = localStorage.getItem('smart_cbt_login_mode');
      const lastRole = localStorage.getItem('smart_cbt_last_role');
      if (savedMode === 'ADMIN_GURU' || lastRole === 'guru' || lastRole === 'operator') {
        setLoginMode('ADMIN_GURU');
      } else if (savedMode === 'SISWA' || lastRole === 'siswa') {
        setLoginMode('SISWA');
      }
    } catch {}
  }, []);

  const handleSwitchMode = (mode: 'ADMIN_GURU' | 'SISWA') => {
    setLoginMode(mode);
    setErrorMessage(null);
    try {
      localStorage.setItem('smart_cbt_login_mode', mode);
    } catch {}
  };

  // State Form Admin / Guru
  const [adminUsername, setAdminUsername] = useState('dermawanf727@gmail.com');
  const [adminPassword, setAdminPassword] = useState('guru123');

  // State Form Siswa (Default ARJUN sesuai screenshot)
  const [studentUsername, setStudentUsername] = useState('arjun');
  const [studentPassword, setStudentPassword] = useState('12345678');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State Modal Lupa Password Admin & Guru
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotRecoveryMode, setForgotRecoveryMode] = useState<'OTP_EMAIL' | 'EMERGENCY_KEY'>('OTP_EMAIL');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotEmergencyKey, setForgotEmergencyKey] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [maskedEmailNotice, setMaskedEmailNotice] = useState<string | null>(null);
  const [simulatedDevOtp, setSimulatedDevOtp] = useState<string | null>(null);

  // State Modal Bantuan Password Siswa
  const [isStudentHelpOpen, setIsStudentHelpOpen] = useState(false);
  const [isHelpTutorialOpen, setIsHelpTutorialOpen] = useState(false);

  // Handler Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      const res = await requestPasswordResetOtpAction(forgotIdentifier);
      if (res.success) {
        setMaskedEmailNotice(res.maskedEmail || null);
        setSimulatedDevOtp(res.devOtp || null);
        setForgotStep(2);
      } else {
        setForgotError(res.message);
      }
    } catch {
      setForgotError('Terjadi kendala jaringan saat meminta kode OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handler Submit OTP & Password Baru
  const handleVerifyOtpAndChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await verifyResetOtpAndChangePasswordAction(
        forgotIdentifier,
        forgotOtp,
        forgotNewPassword
      );
      if (res.success) {
        setForgotSuccess(res.message);
        setAdminUsername(forgotIdentifier);
        setAdminPassword(forgotNewPassword);
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setForgotStep(1);
          setForgotOtp('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setForgotSuccess(null);
        }, 2200);
      } else {
        setForgotError(res.message);
      }
    } catch {
      setForgotError('Gagal memverifikasi OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handler Emergency Master Recovery
  const handleEmergencyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await emergencyResetPasswordAction(
        forgotIdentifier,
        forgotEmergencyKey,
        forgotNewPassword
      );
      if (res.success) {
        setForgotSuccess(res.message);
        setAdminUsername(forgotIdentifier);
        setAdminPassword(forgotNewPassword);
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setForgotEmergencyKey('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setForgotSuccess(null);
        }, 2200);
      } else {
        setForgotError(res.message);
      }
    } catch {
      setForgotError('Gagal memproses pemulihan darurat.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handler Login Terpadu
  const handleProcessLogin = async (usr: string, pwd: string, isStudentPortal: boolean) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      localStorage.setItem('smart_cbt_login_mode', isStudentPortal ? 'SISWA' : 'ADMIN_GURU');
      localStorage.setItem('smart_cbt_last_role', isStudentPortal ? 'siswa' : 'guru');
    } catch {}

    const cleanUser = usr.trim().toLowerCase();

    // 1. Coba verifikasi dengan Server Action (PostgreSQL Database)
    try {
      const res = await loginAction(cleanUser, pwd);

      if (res && res.success && res.user) {
        let mappedRole: Role = 'operator';
        if (res.user.role === 'SUPER_ADMIN') {
          mappedRole = 'superadmin';
        } else if (res.user.role === 'TEACHER') {
          mappedRole = 'guru';
        } else if (res.user.role === 'STUDENT') {
          mappedRole = 'siswa';
        } else {
          mappedRole = 'operator';
        }

        onLogin(mappedRole, res.user.username, res.user);
        setIsLoading(false);
        return;
      }

      if (res && !res.success) {
        setErrorMessage(res.message || 'Username atau Password salah!');
        setIsLoading(false);
        return;
      }
    } catch (dbErr) {
      console.warn('Database login action unreachable, checking offline demo credentials:', dbErr);
    }

    // 2. Fallback Khusus Kredensial Demo Terdaftar (Hanya jika server DB offline/unreachable)
    // Super Administrator: 'superadmin' / 'admin' dengan password resmi
    if (
      (cleanUser === 'superadmin' || cleanUser === 'root' || cleanUser === 'super') &&
      (pwd === 'superadmin123' || pwd === 'admin123')
    ) {
      onLogin('superadmin', usr, {
        id: 'usr_superadmin',
        name: 'Super Administrator',
        username: usr,
        role: 'SUPER_ADMIN',
        jabatan: 'Super Administrator CBT',
      });
      setIsLoading(false);
      return;
    }

    // Siswa Demo Terdaftar
    if (
      (cleanUser === 'arjun' || cleanUser === 'std_arjun' || cleanUser === 'abdul') &&
      pwd === '12345678'
    ) {
      const isArjun = cleanUser === 'arjun' || cleanUser === 'std_arjun';
      onLogin('siswa', usr, {
        id: isArjun ? 'std_arjun' : 'std_abdul',
        name: isArjun ? 'ARJUN' : 'ABDUL ADZIM',
        username: usr,
        role: 'STUDENT',
        level: 'X',
        className: 'X MIPA 1',
        jurusan: 'IPA',
        nis: isArjun ? '26001' : '26002',
        session: 'Sesi 1 (Pagi)',
        room: 'LAB-01',
        noPeserta: isArjun ? '26-27-04-1-0101-0001' : '26-27-04-1-0101-0002',
      });
      setIsLoading(false);
      return;
    }

    // Guru Pengampu Demo Terdaftar
    if (
      (cleanUser === 'dermawanf727@gmail.com' || cleanUser === 'guru') &&
      pwd === 'guru123'
    ) {
      onLogin('guru', usr, {
        id: 'tch_dermawan',
        name: 'Dermawan Surya Kencana, S. Sos',
        username: usr,
        role: 'TEACHER',
        nip: '198403152009021004',
        jabatan: 'Guru Sosiologi & PPKn SMA',
      });
      setIsLoading(false);
      return;
    }

    // Operator UBK Demo Terdaftar
    if (
      (cleanUser === 'operator' || cleanUser === 'admin' || cleanUser === 'ahmad.fauzi' || cleanUser === 'proktor') &&
      pwd === 'operator123'
    ) {
      onLogin('operator', usr, {
        id: 'op_ahmad',
        name: 'Ahmad Fauzi, S.Kom.',
        username: usr,
        role: 'ADMIN',
        jabatan: 'Operator UBK Sekolah',
      });
      setIsLoading(false);
      return;
    }

    setErrorMessage('Username atau Password tidak cocok. Silakan coba kembali.');
    setIsLoading(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessLogin(adminUsername, adminPassword, false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessLogin(studentUsername, studentPassword, true);
  };

  const themeGrad =
    branding?.themeColor === 'blue'
      ? 'from-[#2563eb] via-[#1d4ed8] to-[#1e40af]'
      : branding?.themeColor === 'indigo'
      ? 'from-[#4f46e5] via-[#4338ca] to-[#3730a3]'
      : branding?.themeColor === 'rose'
      ? 'from-[#e11d48] via-[#be123c] to-[#9f1239]'
      : branding?.themeColor === 'amber'
      ? 'from-[#d97706] via-[#b45309] to-[#78350f]'
      : branding?.themeColor === 'slate'
      ? 'from-[#475569] via-[#334155] to-[#0f172a]'
      : 'from-[#10b981] via-[#059669] to-[#047857]';

  const themeBtnBg =
    branding?.themeColor === 'blue'
      ? 'bg-[#2563eb] hover:bg-[#1d4ed8]'
      : branding?.themeColor === 'indigo'
      ? 'bg-[#4f46e5] hover:bg-[#4338ca]'
      : branding?.themeColor === 'rose'
      ? 'bg-[#e11d48] hover:bg-[#be123c]'
      : branding?.themeColor === 'amber'
      ? 'bg-[#d97706] hover:bg-[#b45309]'
      : branding?.themeColor === 'slate'
      ? 'bg-[#334155] hover:bg-[#1e293b]'
      : 'bg-[#00897b] hover:bg-[#00796b]';

  const renderLogo = (sizeClass = 'w-16 h-16') => {
    if (branding?.customLogoUrl) {
      return (
        <img
          src={branding.customLogoUrl}
          alt="Logo Sekolah"
          className={`${sizeClass} object-contain rounded-xl shadow-lg bg-white/10 p-1`}
        />
      );
    }
    if (branding?.logoType === 'kemdikbud') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} drop-shadow-xl`}>
          <polygon points="50,15 90,85 10,85" stroke="#3b82f6" strokeWidth="6" fill="#1e40af" />
          <circle cx="50" cy="55" r="16" fill="#fbbf24" />
          <path d="M 40 70 Q 50 60 60 70" stroke="#ffffff" strokeWidth="4" fill="none" />
        </svg>
      );
    }
    if (branding?.logoType === 'pesantren') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} drop-shadow-xl`}>
          <path d="M 20 80 L 80 80 L 80 50 Q 50 15 20 50 Z" fill="#047857" stroke="#10b981" strokeWidth="4" />
          <circle cx="50" cy="30" r="10" fill="#f59e0b" />
          <path d="M 50 15 L 50 5" stroke="#fbbf24" strokeWidth="4" />
        </svg>
      );
    }
    if (branding?.logoType === 'techno') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} drop-shadow-xl`}>
          <rect x="25" y="25" width="50" height="50" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="6" />
          <circle cx="50" cy="50" r="14" fill="#3b82f6" />
          <path d="M 35 50 L 65 50 M 50 35 L 50 65" stroke="#ffffff" strokeWidth="3" />
        </svg>
      );
    }
    // Default madrasah star
    return (
      <svg viewBox="0 0 100 100" className={`${sizeClass} drop-shadow-xl`}>
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#starGrad)" stroke="url(#goldBorder)" strokeWidth="3" />
        <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#starGrad)" stroke="url(#goldBorder)" strokeWidth="3" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="28" fill="#f8fafc" stroke="url(#goldBorder)" strokeWidth="3" />
        <path d="M 36 52 Q 43 45 50 49 Q 57 45 64 52 L 64 58 Q 57 52 50 55 Q 43 52 36 58 Z" fill="#047857" />
        <line x1="50" y1="49" x2="50" y2="60" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0d1c14] select-none font-sans overflow-x-hidden">
      {/* =================================================================== */}
      {/* FLOATING TOP SWITCHER PILL (TOGGLE GURU/OPERATOR VS SISWA)           */}
      {/* =================================================================== */}
      <div className="fixed top-4 z-50 flex items-center gap-1.5 p-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-2xl text-xs">
        <button
          type="button"
          onClick={() => handleSwitchMode('SISWA')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            loginMode === 'SISWA'
              ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Login Siswa (CBT)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchMode('ADMIN_GURU')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
            loginMode === 'ADMIN_GURU'
              ? 'bg-teal-500 text-slate-950 shadow-md scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Login Guru &amp; Admin</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAMPILAN 1: LOGIN SISWA (CENTERED DINAMIS MENGIKUTI 4-WARNA SISTEM)   */}
      {/* =================================================================== */}
      {loginMode === 'SISWA' ? (
        <div
          className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            backgroundImage: branding?.loginBgImageUrl ? `url(${branding.loginBgImageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {branding?.loginBgImageUrl && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-xs pointer-events-none" />
          )}
          {/* Background Ambient Glows & Grid Pattern */}
          <div
            className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none opacity-25"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full blur-2xl pointer-events-none opacity-25"
            style={{ backgroundColor: theme.secondaryColor }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Latar Belakang Laptop 3D Elegan (Samar di Belakang Card) */}
          <div className="absolute inset-0 flex items-center justify-between px-8 md:px-24 opacity-30 pointer-events-none">
            <div
              className="w-64 h-44 rounded-t-xl p-2 transform -rotate-6 hidden lg:block border-2"
              style={{
                backgroundColor: theme.surfaceColor,
                borderColor: theme.borderColor,
              }}
            >
              <div
                className="h-full rounded p-2 text-[8px] font-mono"
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.secondaryColor,
                }}
              >
                &gt; SISTEM ASESMEN SISWA
                <br />
                &gt; STATUS: ONLINE
              </div>
            </div>
            <div
              className="w-64 h-44 rounded-t-xl p-2 transform rotate-6 hidden lg:block border-2"
              style={{
                backgroundColor: theme.surfaceColor,
                borderColor: theme.borderColor,
              }}
            >
              <div
                className="h-full rounded p-2 text-[8px] font-mono"
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.primaryColor,
                }}
              >
                &gt; EL-CBT PORTAL SISWA
                <br />
                &gt; KELAS X MIPA / IPS
              </div>
            </div>
          </div>

          {/* KOTAK LOGIN SISWA (PERSIS SCREENSHOT 1: media_1794853018990_cfadf0d0.jpg) */}
          <div
            className="relative z-10 w-full max-w-[420px] rounded-3xl shadow-2xl p-7 md:p-9 mt-8 border transition-colors"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
              color: theme.textColor,
            }}
          >
            {/* AVATAR LOGIN SISWA - ADAPTIF BERDASARKAN JENJANG & LOGO */}
            <div
              className="relative -mt-16 md:-mt-18 mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4"
              style={{
                borderColor: theme.primaryColor,
              }}
            >
              {branding?.studentLoginLogoUrl ? (
                <img src={branding.studentLoginLogoUrl} alt="Logo Siswa" className="w-16 h-16 md:w-20 md:h-20 object-contain p-1" />
              ) : branding?.customLogoUrl ? (
                <img src={branding.customLogoUrl} alt="Logo Sekolah" className="w-16 h-16 md:w-20 md:h-20 object-contain p-1" />
              ) : branding?.jenjang === 'MI/SD' ? (
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  {/* Bear Ears */}
                  <circle cx="28" cy="30" r="16" fill="#e2e8f0" />
                  <circle cx="28" cy="30" r="10" fill="#fecdd3" />
                  <circle cx="92" cy="30" r="16" fill="#e2e8f0" />
                  <circle cx="92" cy="30" r="10" fill="#fecdd3" />
                  {/* Bear Head */}
                  <circle cx="60" cy="65" r="45" fill="#f8fafc" />
                  {/* Cheeks Blush */}
                  <ellipse cx="38" cy="72" rx="8" ry="5" fill="#fda4af" opacity="0.6" />
                  <ellipse cx="82" cy="72" rx="8" ry="5" fill="#fda4af" opacity="0.6" />
                  {/* Bear Eyes */}
                  <circle cx="45" cy="58" r="5" fill="#1e293b" />
                  <circle cx="47" cy="56" r="1.8" fill="#ffffff" />
                  <circle cx="75" cy="58" r="5" fill="#1e293b" />
                  <circle cx="77" cy="56" r="1.8" fill="#ffffff" />
                  {/* Bear Muzzle */}
                  <ellipse cx="60" cy="72" rx="14" ry="10" fill="#e2e8f0" />
                  {/* Nose */}
                  <path d="M 56 68 Q 60 65 64 68 Q 60 73 56 68 Z" fill="#0f172a" />
                  {/* Smiling Mouth */}
                  <path d="M 56 73 Q 60 77 64 73" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-2"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center shadow-inner">
                    <GraduationCap className="w-8 h-8 md:w-9 md:h-9 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* HEADER SEKOLAH SISWA */}
            <div className="text-center mt-3">
              <h2 className="text-lg md:text-xl font-black tracking-wide" style={{ color: theme.textColor }}>
                {branding?.schoolName || 'SMA Integral Hidayatullah'}
              </h2>
              <h3 className="text-sm md:text-base font-bold tracking-wide mt-0.5" style={{ color: theme.primaryColor }}>
                {branding?.subName || 'Kota Ternate'}
              </h3>
              <p className="text-[11px] font-medium mt-1" style={{ color: theme.mutedTextColor }}>
                &bull; Alamat : Jl. Pesantren Kalumata Puncak &bull;
              </p>
              <p className="text-[11px] font-medium" style={{ color: theme.mutedTextColor }}>
                &bull; Telp : 0821XXXX &bull;
              </p>
            </div>

            {/* ERROR NOTIFIKASI */}
            {errorMessage && (
              <div className="mt-4 p-2.5 bg-rose-950/80 border border-rose-600 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FORM LOGIN SISWA */}
            <form onSubmit={handleStudentSubmit} className="mt-6 space-y-4 text-left">
              {/* Field: Username */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: theme.mutedTextColor }}>
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentUsername}
                    onChange={(e) => setStudentUsername(e.target.value)}
                    placeholder="arjun"
                    className="w-full px-4 py-2.5 border-b-2 rounded-t-lg text-sm font-semibold focus:outline-none transition-all"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.primaryColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: theme.mutedTextColor }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border-b-2 rounded-t-lg text-sm font-mono tracking-widest focus:outline-none transition-all pr-10"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.primaryColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                    style={{ color: theme.textColor }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsStudentHelpOpen(true)}
                    className="text-[11px] font-medium hover:underline cursor-pointer opacity-75 hover:opacity-100 flex items-center gap-1"
                    style={{ color: theme.textColor }}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Lupa Password Siswa?</span>
                  </button>
                </div>
              </div>

              {/* Tombol: LOGIN SEKARANG */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-white font-black text-sm tracking-widest uppercase rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primaryColor,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>MEMVALIDASI...</span>
                    </>
                  ) : (
                    <span>LOGIN SEKARANG</span>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Fill untuk Demo Siswa (Hanya tampil jika tidak disembunyikan) */}
            <div className="mt-5 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-[11px] text-emerald-200">
              {!branding?.hideDemoLogin ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentUsername('arjun');
                      setStudentPassword('12345678');
                    }}
                    className="hover:text-amber-300 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <span>🐻 Demo: <strong>ARJUN</strong></span>
                  </button>
                  <span className="opacity-40">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentUsername('abdul');
                      setStudentPassword('12345678');
                    }}
                    className="hover:text-amber-300 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>ABDUL</span>
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-emerald-300/70 font-mono">Status: Sesi Ujian Aktif</span>
              )}

              <button
                type="button"
                onClick={() => handleSwitchMode('ADMIN_GURU')}
                className="text-emerald-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>👤 Portal Admin &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* TAMPILAN 2: LOGIN ADMIN & GURU (SPLIT SCREEN MENGIKUTI 4-WARNA)     */
        /* =================================================================== */
        <div
          className="min-h-screen w-full flex flex-col lg:flex-row select-none font-sans overflow-x-hidden transition-colors duration-300"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
          }}
        >
          {/* BAGIAN KIRI: HERO PANEL & ILUSTRASI 3D CBT */}
          <div
            className="relative flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[460px] lg:min-h-screen text-white transition-colors"
            style={{
              backgroundColor: theme.primaryColor,
              backgroundImage: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.bgColor} 100%)`,
            }}
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-black/30 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Logo Bintang Segidelapan Emas & Hijau */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0 drop-shadow-xl">
                {renderLogo('w-full h-full')}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] md:text-xs font-bold tracking-widest px-2.5 py-0.5 rounded-full border uppercase"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: '#ffffff',
                    }}
                  >
                    Sekolah Menengah Atas (SMA)
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 tracking-wider flex items-center gap-1">
                    ★ Terakreditasi A
                  </span>
                </div>
                <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md mt-0.5">
                  {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
                </h1>
                <p className="text-xs md:text-sm text-white/90 font-medium tracking-wide">
                  {branding?.subName || 'Kota Ternate • Maluku Utara'}
                </p>
              </div>
            </div>

            {/* Ilustrasi 3D CBT & Asesmen Digital ATAU Banner Gambar Kustom */}
            <div className="relative z-10 my-8 flex items-center justify-center">
              <div className="w-full max-w-2xl relative">
                {branding?.loginHeroImageUrl ? (
                  <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <img
                      src={branding.loginHeroImageUrl}
                      alt="Banner Hero Login"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="font-bold tracking-wide drop-shadow-md">
                        {branding?.schoolName}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-[10px] font-mono font-bold shadow-xs">
                        Portal Asesmen Aktif
                      </span>
                    </div>
                  </div>
                ) : (
                <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
                  <div className="absolute top-4 left-8 md:left-16 animate-bounce [animation-duration:4s]">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-300/40 transform -rotate-12">
                      <span className="text-lg">💡</span>
                    </div>
                  </div>

                  <div className="absolute top-10 left-2 md:left-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 border-2 border-rose-300/40 transform rotate-12">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="absolute top-2 right-28 md:right-36 animate-bounce [animation-duration:5s]">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-sky-300/40 transform rotate-6">
                      <span className="text-lg">🎓</span>
                    </div>
                  </div>

                  <div className="absolute top-12 right-12 md:right-16">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-purple-300/40 transform -rotate-6">
                      <span className="text-lg">🧠</span>
                    </div>
                  </div>

                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-amber-300" />
                    <div className="text-left">
                      <span className="text-[10px] text-white/80 font-bold block uppercase tracking-wider">Tingkat Ketuntasan</span>
                      <span className="text-base font-extrabold text-white">98.4% Lulus KKM</span>
                    </div>
                  </div>

                  {/* Dua Laptop 3D di Bawah */}
                  <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-4 md:gap-8 px-4">
                    <div className="flex-1 max-w-[260px] bg-slate-900 border-2 border-slate-700/80 rounded-t-xl p-2 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform">
                      <div className="bg-[#141720] rounded-t p-2 border border-slate-800 text-[9px] text-slate-300">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[8px] text-emerald-400 font-bold">
                          <span>MONITOR CBT REALTIME</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-center">
                          <div className="bg-blue-950/60 p-1 rounded border border-blue-500/30">
                            <span className="text-blue-300 font-bold block text-[10px]">53</span>
                            <span className="text-[7px] text-slate-400">Siswa Ujian</span>
                          </div>
                          <div className="bg-emerald-950/60 p-1 rounded border border-emerald-500/30">
                            <span className="text-emerald-300 font-bold block text-[10px]">100%</span>
                            <span className="text-[7px] text-slate-400">Terkoneksi</span>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-4/5" />
                        </div>
                      </div>
                      <div className="h-2 bg-slate-400 rounded-b mt-0.5" />
                    </div>

                    <div className="flex-1 max-w-[260px] bg-slate-900 border-2 border-slate-700/80 rounded-t-xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                      <div className="bg-[#141720] rounded-t p-2 border border-slate-800 text-[9px] text-slate-300">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[8px] text-sky-400 font-bold">
                          <span>MATH STUDIO &amp; BANK SOAL</span>
                          <span className="text-amber-400 font-mono">√x LaTeX</span>
                        </div>
                        <div className="mt-1.5 p-1 bg-slate-950 rounded border border-slate-800 font-mono text-[7px] text-slate-300 text-left">
                          <p className="text-emerald-400 font-bold">Pilihan Ganda 40/40</p>
                          <p className="text-slate-400">Tingkat Kesukaran: Sedang</p>
                          <p className="text-sky-300">Kunci Jawaban: Terenkripsi</p>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-400 rounded-b mt-0.5" />
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80 border-t border-white/20 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                <span className="font-semibold text-white tracking-wide">
                  Server PUSAT UBK (Online) &bull; Latensi: 1ms &bull; Enkripsi AES-256
                </span>
              </div>
              <span className="text-[11px] bg-black/30 px-3 py-1 rounded-full border border-white/20 font-mono text-white">
                T.A {branding?.academicYear || '2026/2027'} (Semester {branding?.semester || 'Genap'})
              </span>
            </div>
          </div>

          {/* BAGIAN KANAN: PANEL LOGIN FORM */}
          <div
            className="w-full lg:w-[460px] xl:w-[490px] flex flex-col justify-between p-8 md:p-12 shadow-2xl relative z-20 border-l transition-colors"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
              color: theme.textColor,
            }}
          >
            <div>
              {/* Header EL - CBT */}
              <div className="text-center pt-2">
                {branding?.operatorLogoUrl && (
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 p-2 border border-white/20 shadow-md flex items-center justify-center">
                    <img src={branding.operatorLogoUrl} alt="Logo Operator" className="w-full h-full object-contain" />
                  </div>
                )}
                <h2 className="text-4xl md:text-5xl font-black tracking-wider" style={{ color: theme.textColor }}>
                  {branding?.loginHeroText || 'EL - CBT'}
                </h2>
                <h3 className="text-xs md:text-sm font-bold tracking-wider uppercase mt-1" style={{ color: theme.primaryColor }}>
                  {branding?.loginSubText || (branding?.schoolName ? `${branding?.schoolName} • KOTA TERNATE` : 'KOTA TERNATE • SMAINTEGRALHIDAYATULLAH.SCH.ID')}
                </h3>
                <div className="mt-2 inline-block">
                  <span
                    className="text-[11px] font-semibold border rounded-full px-3.5 py-1"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.mutedTextColor,
                    }}
                  >
                    &bull; Alamat : {branding?.subName || 'Jl. Pesantren Kalumata Puncak'} &bull;
                  </span>
                </div>
              </div>

              {/* Badge Informasi */}
              <div
                className="mt-8 mb-4 p-2.5 border rounded-xl flex items-center justify-between text-xs font-bold"
                style={{
                  backgroundColor: `${theme.primaryColor}15`,
                  borderColor: theme.primaryColor,
                  color: theme.textColor,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" style={{ color: theme.primaryColor }} />
                  <span>Portal Login Operator &amp; Dewan Guru</span>
                </div>
                <span
                  className="text-[10px] text-white font-black px-2 py-0.5 rounded-full uppercase"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  1 Form Terpadu
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Login Admin/Guru */}
              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black tracking-wider uppercase mb-1.5" style={{ color: theme.textColor }}>
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Masukkan username atau email..."
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none border transition-all"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black tracking-wider uppercase" style={{ color: theme.textColor }}>
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(adminUsername || '');
                        setForgotError(null);
                        setForgotSuccess(null);
                        setForgotStep(1);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-bold hover:underline cursor-pointer transition-colors"
                      style={{ color: theme.primaryColor }}
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none border transition-all pr-12 font-mono"
                      style={{
                        backgroundColor: theme.bgColor,
                        borderColor: theme.borderColor,
                        color: theme.textColor,
                      }}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                      style={{ color: theme.textColor }}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 text-white font-extrabold text-sm tracking-wider uppercase rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{
                      backgroundColor: theme.primaryColor,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>MEMVALIDASI KREDENSIAL...</span>
                      </>
                    ) : (
                      <span>MASUK ADMIN</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Login Selector (Hanya tampil jika tidak disembunyikan oleh Super Admin) */}
              {!branding?.hideDemoLogin && (
                <div className="mt-8 pt-5 border-t border-slate-200 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                    AKUN CEPAT (1-KLIK UNTUK TESTING &amp; DEMO):
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminUsername('dermawanf727@gmail.com');
                        setAdminPassword('guru123');
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        adminUsername === 'dermawanf727@gmail.com'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-[11px] text-blue-700">
                        <span>👩‍🏫 Guru</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block truncate mt-0.5">
                        dermawanf727
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminUsername('operator');
                        setAdminPassword('operator123');
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        adminUsername === 'operator'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-700">
                        <span>👨‍💼 Operator</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5 truncate">
                        operator123
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminUsername('superadmin');
                        setAdminPassword('superadmin123');
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        adminUsername === 'superadmin'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-[11px] text-amber-800">
                        <span>👑 Super Admin</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5 truncate">
                        superadmin
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                  👤
                </div>
                <span>Admin by &bull; TIM IT SMA Integral Hidayatullah</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                SmartCBT Pro &bull; Version 3.2.0 &bull; All rights reserved.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: PEMULIHAN KATA SANDI (SUPER ADMIN & OPERATOR)              */}
      {/* =================================================================== */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 relative overflow-hidden"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
              color: theme.textColor,
            }}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.borderColor }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">Pemulihan Kata Sandi</h3>
                  <p className="text-[11px]" style={{ color: theme.mutedTextColor }}>
                    Super Administrator, Operator, dan Guru
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotError(null);
                  setForgotSuccess(null);
                  setForgotStep(1);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-colors cursor-pointer hover:bg-black/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tab: Online Email OTP vs Offline Master Key */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl mt-4 border text-xs font-bold" style={{ borderColor: theme.borderColor, backgroundColor: theme.bgColor }}>
              <button
                type="button"
                onClick={() => {
                  setForgotRecoveryMode('OTP_EMAIL');
                  setForgotError(null);
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  forgotRecoveryMode === 'OTP_EMAIL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Via Email OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotRecoveryMode('EMERGENCY_KEY');
                  setForgotError(null);
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  forgotRecoveryMode === 'EMERGENCY_KEY'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kunci Darurat (Offline)</span>
              </button>
            </div>

            {/* Notifikasi Error & Sukses */}
            {forgotError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* OPSI A: PEMULIHAN VIA EMAIL OTP                                */}
            {/* ------------------------------------------------------------- */}
            {forgotRecoveryMode === 'OTP_EMAIL' && (
              <div className="mt-4">
                {forgotStep === 1 ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                    <p className="text-xs leading-relaxed" style={{ color: theme.mutedTextColor }}>
                      Masukkan <strong>Email Resmi</strong> atau <strong>Username Akun</strong> Anda. Kode OTP 6 digit akan dikirimkan ke email yang terdaftar.
                    </p>

                    <div>
                      <label className="block font-bold mb-1.5">Email atau Username Terdaftar</label>
                      <input
                        type="text"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="Contoh: smaintegralhidayatullah@gmail.com atau operator"
                        className="w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none transition-all"
                        style={{
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                          color: theme.textColor,
                        }}
                        required
                        disabled={forgotLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>MENGIRIMKAN KODE OTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>KIRIM KODE OTP KE EMAIL</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpAndChange} className="space-y-3.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] space-y-1">
                      <p>
                        Kode OTP 6 digit telah dikirim ke <strong>{maskedEmailNotice || forgotIdentifier}</strong>.
                      </p>
                      {simulatedDevOtp && (
                        <div className="flex items-center justify-between pt-1 border-t border-blue-500/20 text-[10px]">
                          <span>Simulasi Server Offline/Dev OTP:</span>
                          <button
                            type="button"
                            onClick={() => setForgotOtp(simulatedDevOtp)}
                            className="font-mono font-bold bg-blue-500/30 px-1.5 py-0.5 rounded text-white underline cursor-pointer"
                          >
                            Isi OTP: {simulatedDevOtp}
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Kode OTP 6-Digit</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full px-4 py-2.5 rounded-xl border text-center font-mono font-black text-lg tracking-widest focus:outline-none"
                        style={{
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                          color: theme.textColor,
                        }}
                        required
                        disabled={forgotLoading}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Kata Sandi Baru</label>
                      <input
                        type="password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter..."
                        className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none"
                        style={{
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                          color: theme.textColor,
                        }}
                        required
                        disabled={forgotLoading}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Konfirmasi Kata Sandi Baru</label>
                      <input
                        type="password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi baru..."
                        className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none"
                        style={{
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                          color: theme.textColor,
                        }}
                        required
                        disabled={forgotLoading}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="px-3 py-2.5 rounded-xl border font-bold text-xs hover:bg-white/5 cursor-pointer"
                        style={{ borderColor: theme.borderColor }}
                        disabled={forgotLoading}
                      >
                        Kembali
                      </button>

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {forgotLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>MEMVALIDASI...</span>
                          </>
                        ) : (
                          <span>PERBARUI KATA SANDI</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* OPSI B: PEMULIHAN DARURAT OFFLINE (MASTER RECOVERY KEY)        */}
            {/* ------------------------------------------------------------- */}
            {forgotRecoveryMode === 'EMERGENCY_KEY' && (
              <form onSubmit={handleEmergencyReset} className="mt-4 space-y-3.5 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                  Metode ini dirancang untuk <strong>Server Mini PC / Lab Sekolah yang Offline</strong> tanpa internet SMTP. Masukkan Master Recovery Key bawaan sekolah.
                </div>

                <div>
                  <label className="block font-bold mb-1">Username / Email Akun</label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="superadmin / operator / guru"
                    className="w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={forgotLoading}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">Kunci Pemulihan Darurat (Master Key)</label>
                    <button
                      type="button"
                      onClick={() => setForgotEmergencyKey('SMARTCBT-MASTER-RECOVERY-2026')}
                      className="text-[10px] text-amber-400 hover:underline font-mono"
                    >
                      Gunakan Key Bawaan
                    </button>
                  </div>
                  <input
                    type="text"
                    value={forgotEmergencyKey}
                    onChange={(e) => setForgotEmergencyKey(e.target.value)}
                    placeholder="SMARTCBT-MASTER-RECOVERY-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={forgotLoading}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={forgotLoading}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru..."
                    className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                    }}
                    required
                    disabled={forgotLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase text-slate-950 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>MEMVERIFIKASI MASTER KEY...</span>
                    </>
                  ) : (
                    <span>RESET KATA SANDI DARURAT</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: BANTUAN LUPA PASSWORD SISWA (PROKTOR DESK)                 */}
      {/* =================================================================== */}
      {isStudentHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4 relative overflow-hidden"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
              color: theme.textColor,
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base">Bantuan Akun &amp; Kata Sandi Siswa</h3>
              <p className="text-xs" style={{ color: theme.mutedTextColor }}>
                {branding?.schoolName || 'SMA Integral Hidayatullah'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left space-y-2 leading-relaxed">
              <p className="font-bold">🔒 Aturan Keamanan Ujian CBT:</p>
              <p className="text-[11px] opacity-90">
                Untuk menjaga keaslian identitas peserta ujian, akun siswa <strong>tidak memerlukan verifikasi email mandiri</strong>.
              </p>
              <p className="text-[11px] opacity-90">
                Silakan hubungi <strong>Pengawas Ruang Ujian</strong> atau temui <strong>Proktor / Operator CBT</strong> di Ruang Server.
              </p>
            </div>

            <div className="p-3 rounded-2xl border text-xs text-left space-y-1.5" style={{ borderColor: theme.borderColor, backgroundColor: theme.bgColor }}>
              <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: theme.mutedTextColor }}>
                Kontak Proktor / Operator Sekolah:
              </span>
              <div className="flex items-center justify-between font-bold">
                <span>Nama Proktor:</span>
                <span className="text-emerald-400">{branding?.proktorName || 'Ahmad Fauzi, S.Kom.'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.mutedTextColor }}>NIP Proktor:</span>
                <span className="font-mono text-[11px]">{branding?.nipProktor || '198502152010011015'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.mutedTextColor }}>Lokasi:</span>
                <span>Laboratorium Komputer / CBT</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStudentHelpOpen(false)}
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase shadow-md cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              SAYA MENGERTI &amp; KEMBALI
            </button>
          </div>
        </div>
      )}

      {/* Tombol Melayang Buka Panduan & Tutorial */}
      <button
        type="button"
        onClick={() => setIsHelpTutorialOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400/50 cursor-pointer transform hover:scale-105 transition-all"
        title="Buka Pusat Panduan & Tutorial Resmi"
      >
        <BookOpen className="w-4 h-4 text-amber-300" />
        <span>Buku Panduan &amp; Tutorial</span>
      </button>

      {/* MODAL PANDUAN RESMI SMARTCBT */}
      <HelpTutorialModal
        isOpen={isHelpTutorialOpen}
        onClose={() => setIsHelpTutorialOpen(false)}
        defaultRole="OPERATOR"
      />
    </div>
  );
}
