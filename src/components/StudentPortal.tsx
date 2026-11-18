'use client';

import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Clock,
  Award,
  Bell,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  School,
  LogOut,
  ChevronRight,
  BookOpen,
  HelpCircle,
  FileText,
  User,
  Settings,
  Menu,
  X,
  Printer,
  ChevronLeft,
  ArrowRight,
  FileCheck,
  Megaphone,
} from 'lucide-react';
import { Student, ExamSchedule, StudentSession, SchoolBrandingSettings } from '../lib/types';
import { getResolvedThemeColors } from '../lib/theme-palettes';
import StudentExamPlayer from './StudentExamPlayer';

interface StudentPortalProps {
  currentStudent: Student;
  schedules: ExamSchedule[];
  activeExam: ExamSchedule;
  studentSession: StudentSession;
  tokenRequired: boolean;
  activeToken: string;
  branding?: SchoolBrandingSettings;
  onStudentFinished: (score: number, maxScore: number) => void;
  onViolationReported: (count: number) => void;
  onLogout?: () => void;
}

export default function StudentPortal({
  currentStudent,
  schedules,
  activeExam,
  studentSession,
  tokenRequired,
  activeToken,
  branding,
  onStudentFinished,
  onViolationReported,
  onLogout,
}: StudentPortalProps) {
  // Resolved 4-Color Theme
  const theme = getResolvedThemeColors(branding);

  const [activeMenu, setActiveMenu] = useState<
    'DASHBOARD' | 'UJIAN_HARI_INI' | 'JADWAL' | 'NILAI' | 'PENGUMUMAN' | 'EXAM_PLAYER'
  >('DASHBOARD');

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Hari untuk kolom Jadwal Ujian Tersedia (Sesuai Screenshot: SENIN, SELASA, RABU, KAMIS)
  const days = ['SENIN', 'SELASA', 'RABU', 'KAMIS'] as const;

  // Jadwal SMA contoh untuk mengisi kolom hari
  const displaySchedules: ExamSchedule[] = schedules && schedules.length > 0 ? schedules : [
    {
      id: 'sch_mat_x',
      code: 'PAS-2026-MAT-X1',
      title: 'PAS-2026-MAT-X1',
      subjectId: 'sub_mat',
      subjectName: 'Matematika Wajib (PAS-2026-MAT-X1)',
      examType: 'PAS',
      level: 'X',
      className: 'X MIPA 1, X MIPA 2, X IPS 1, X IPS 2',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '18 May 2026',
      startTime: '07:30',
      endTime: '09:30',
      dayOfWeek: 'SENIN',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: true,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: '36S7KS',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
    {
      id: 'sch_ppkn_x',
      code: 'PAS-2026-PPKN-X1',
      title: 'PAS-2026-PPKN-X1',
      subjectId: 'sub_ppkn',
      subjectName: 'Pendidikan Pancasila dan Kewarganegaraan (PPKN-X1)',
      examType: 'PAS',
      level: 'X',
      className: 'Semua Kelas X',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '18 May 2026',
      startTime: '10:00',
      endTime: '12:00',
      dayOfWeek: 'SENIN',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: true,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: '36S7KS',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
    {
      id: 'sch_sos_x',
      code: 'PAS-2026-SOS-X1',
      title: 'PAS-2026-SOS-X1',
      subjectId: 'sub_sos',
      subjectName: 'Sosiologi Peminatan X IPS',
      examType: 'PAS',
      level: 'X',
      className: 'X IPS 1, X IPS 2',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '19 May 2026',
      startTime: '07:30',
      endTime: '09:30',
      dayOfWeek: 'SELASA',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: false,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: 'SOS10X',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
    {
      id: 'sch_fis_x',
      code: 'PAS-2026-FIS-X1',
      title: 'PAS-2026-FIS-X1',
      subjectId: 'sub_fis',
      subjectName: 'Fisika Peminatan X MIPA',
      examType: 'PAS',
      level: 'X',
      className: 'X MIPA 1, X MIPA 2',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '19 May 2026',
      startTime: '10:00',
      endTime: '12:00',
      dayOfWeek: 'SELASA',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: false,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: 'FIS10A',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
    {
      id: 'sch_bio_x',
      code: 'PAS-2026-BIO-X1',
      title: 'PAS-2026-BIO-X1',
      subjectId: 'sub_bio',
      subjectName: 'Biologi Peminatan X MIPA',
      examType: 'PAS',
      level: 'X',
      className: 'X MIPA 1, X MIPA 2',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '20 May 2026',
      startTime: '07:30',
      endTime: '09:30',
      dayOfWeek: 'RABU',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: false,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: 'BIO10A',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
    {
      id: 'sch_bindo_x',
      code: 'PAS-2026-BINDO-X1',
      title: 'PAS-2026-BINDO-X1',
      subjectId: 'sub_bindo',
      subjectName: 'Bahasa Indonesia Kelas X',
      examType: 'PAS',
      level: 'X',
      className: 'Semua Kelas X',
      teacherId: 'tch_dermawan',
      teacherName: 'Dermawan Surya Kencana, S. Sos',
      examDate: '21 May 2026',
      startTime: '07:30',
      endTime: '09:30',
      dayOfWeek: 'KAMIS',
      durationMinutes: 90,
      kkm: 75,
      remedialCount: 0,
      sessionNumber: 1,
      isActive: false,
      totalQuestions: 40,
      tokenRequired: true,
      activeToken: 'IND10U',
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResult: true,
      resetLogin: true,
      saveAnswerHistory: true,
      questions: [],
    },
  ];

  const studentHeaderBg =
    branding?.themeColor === 'blue'
      ? 'bg-[#2563eb]'
      : branding?.themeColor === 'indigo'
      ? 'bg-[#4f46e5]'
      : branding?.themeColor === 'rose'
      ? 'bg-[#e11d48]'
      : branding?.themeColor === 'amber'
      ? 'bg-[#d97706]'
      : branding?.themeColor === 'slate'
      ? 'bg-[#334155]'
      : 'bg-[#16a34a]';

  const studentBannerGrad =
    branding?.themeColor === 'blue'
      ? 'from-[#3b82f6] to-[#1d4ed8]'
      : branding?.themeColor === 'indigo'
      ? 'from-[#6366f1] to-[#4338ca]'
      : branding?.themeColor === 'rose'
      ? 'from-[#f43f5e] to-[#be123c]'
      : branding?.themeColor === 'amber'
      ? 'from-[#f59e0b] to-[#b45309]'
      : branding?.themeColor === 'slate'
      ? 'from-[#475569] to-[#1e293b]'
      : 'from-[#22c55e] to-[#15803d]';

  return (
    <div
      className="flex flex-col min-h-screen font-sans select-none overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOPBAR DINAMIS (MENGIKUTI 4-WARNA SISTEM)                   */}
      {/* ============================================================== */}
      <header
        className="h-14 text-white px-4 md:px-6 flex items-center justify-between flex-shrink-0 shadow-md relative z-30 transition-colors"
        style={{
          backgroundColor: theme.primaryColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Tombol Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-black/15 transition-colors cursor-pointer text-white"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Nama Sekolah di Topbar */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
              {branding?.customLogoUrl ? (
                <img src={branding.customLogoUrl} alt="Logo" className="w-5 h-5 object-contain" />
              ) : branding?.logoType === 'kemdikbud' ? (
                <span className="text-xs">🎓</span>
              ) : branding?.logoType === 'pesantren' ? (
                <span className="text-xs">⭐</span>
              ) : branding?.logoType === 'techno' ? (
                <span className="text-xs">🛡️</span>
              ) : (
                <span className="text-xs">🕌</span>
              )}
            </div>
            <span className="font-extrabold text-sm md:text-base tracking-wide text-white drop-shadow-xs truncate max-w-[240px] sm:max-w-md">
              {branding?.schoolName || 'MIS Integral Hidayatullah Kota Ternate'}
            </span>
          </div>
        </div>

        {/* User Profile Badge Siswa di Kanan Topbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-full hover:bg-black/15 transition-colors text-white/90 hover:text-white cursor-pointer"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Badge ARJUN dengan Avatar Bulat Putih */}
          <div className="flex items-center gap-2 bg-black/20 hover:bg-black/30 transition-colors px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
            <div className="w-6 h-6 rounded-full bg-white text-emerald-800 font-black flex items-center justify-center text-[10px] shadow-xs">
              {currentStudent.name ? currentStudent.name.slice(0, 2).toUpperCase() : 'AR'}
            </div>
            <span className="tracking-wider">{currentStudent.name || 'ARJUN'}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title="Keluar dari Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY CONTAINER: SIDEBAR + MAIN CONTENT AREA                 */}
      {/* ============================================================== */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR SISWA (Dinamis Menyesuaikan Permukaan Panel & Kartu) */}
        <aside
          className={`${
            sidebarOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
          } transition-all duration-300 border-r flex-shrink-0 flex flex-col justify-between text-xs z-20`}
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          <div>
            {/* Header Profil Siswa di Sidebar */}
            <div
              className="p-4 border-b flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: `${theme.primaryColor}15`,
                borderColor: theme.borderColor,
              }}
            >
              <div
                className="w-10 h-10 rounded-full font-black flex items-center justify-center text-sm shadow-md border-2"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                }}
              >
                {currentStudent.name ? currentStudent.name.slice(0, 2).toUpperCase() : 'AR'}
              </div>
              <div className="overflow-hidden">
                <span className="font-extrabold text-xs block truncate" style={{ color: theme.textColor }}>
                  {currentStudent.name || 'ARJUN'}
                </span>
                <span className="text-[10px] font-semibold flex items-center gap-1.5 mt-0.5" style={{ color: theme.secondaryColor }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.secondaryColor }} />
                  Online
                </span>
              </div>
            </div>

            {/* Navigasi Utama Siswa */}
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveMenu('DASHBOARD')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMenu === 'DASHBOARD'
                    ? 'text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeMenu === 'DASHBOARD' ? theme.primaryColor : 'transparent',
                }}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <div className="pt-3 pb-1 text-[10px] uppercase font-black px-3 tracking-widest opacity-60">
                Akademik &amp; Ujian
              </div>

              <button
                onClick={() => setActiveMenu('UJIAN_HARI_INI')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                  activeMenu === 'UJIAN_HARI_INI'
                    ? 'text-white font-bold shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeMenu === 'UJIAN_HARI_INI' ? theme.primaryColor : 'transparent',
                }}
              >
                <Play className="w-4 h-4" />
                <span>Ujian Hari Ini</span>
              </button>

              <button
                onClick={() => setActiveMenu('JADWAL')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                  activeMenu === 'JADWAL'
                    ? 'text-white font-bold shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeMenu === 'JADWAL' ? theme.primaryColor : 'transparent',
                }}
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwal Ujian</span>
              </button>

              <div className="pt-3 pb-1 text-[10px] uppercase font-black px-3 tracking-widest opacity-60">
                Hasil &amp; Info
              </div>

              <button
                onClick={() => setActiveMenu('NILAI')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                  activeMenu === 'NILAI'
                    ? 'text-white font-bold shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeMenu === 'NILAI' ? theme.primaryColor : 'transparent',
                }}
              >
                <Award className="w-4 h-4" />
                <span>Hasil Nilai</span>
              </button>

              <button
                onClick={() => setActiveMenu('PENGUMUMAN')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                  activeMenu === 'PENGUMUMAN'
                    ? 'text-white font-bold shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeMenu === 'PENGUMUMAN' ? theme.primaryColor : 'transparent',
                }}
              >
                <Megaphone className="w-4 h-4" />
                <span>Pengumuman</span>
              </button>
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div
            className="p-3 border-t text-[10px] flex items-center justify-between"
            style={{
              borderColor: theme.borderColor,
              color: theme.mutedTextColor,
            }}
          >
            <span>SmartCBT v3.2</span>
            <span className="font-bold" style={{ color: theme.secondaryColor }}>
              Kelas {currentStudent.className || 'X MIPA 1'}
            </span>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* 3. KONTEN UTAMA SESI SISWA                                    */}
        {/* ============================================================== */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-8 transition-colors duration-300"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
          }}
        >
          {/* ========================================================== */}
          {/* A. DASHBOARD VIEW (PERSIS SCREENSHOT 2)                    */}
          {/* ========================================================== */}
          {activeMenu === 'DASHBOARD' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Heading */}
              <div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.textColor }}>
                  Dashboard
                </h1>
              </div>

              {/* WELCOME BANNER DINAMIS MENGIKUTI WARNA UTAMA */}
              <div
                className="relative overflow-hidden text-white rounded-3xl p-6 md:p-8 shadow-xl flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: theme.primaryColor,
                  backgroundImage: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.surfaceColor} 100%)`,
                }}
              >
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                    Halo, {currentStudent.name || 'ARJUN'}! 👋
                  </h2>
                  <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed mt-2">
                    Selamat datang kembali di panel siswa. Pantau jadwal ujian dan materi belajarmu di sini.
                  </p>
                </div>

                {/* Ilustrasi Tumpukan Buku 3D Berwarna Merah & Biru */}
                <div className="relative z-10 shrink-0 hidden sm:flex items-center justify-center">
                  <div className="relative w-28 h-24 md:w-36 md:h-28 flex items-center justify-center">
                    <div className="text-6xl md:text-7xl filter drop-shadow-xl transform -rotate-6 hover:rotate-0 transition-transform">
                      📚
                    </div>
                  </div>
                </div>

                {/* Decorative background glows */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 left-1/3 w-40 h-40 bg-emerald-900/30 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* KARTU UJIAN (AKTIF) */}
              <div className="w-full sm:w-64">
                <div
                  onClick={() => setActiveMenu('JADWAL')}
                  className="bg-[#1e2330] hover:bg-[#252c3d] p-5 rounded-2xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-lg group"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-inner">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base">Ujian</h3>
                  <span className="mt-1.5 px-3.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                    Aktif
                  </span>
                </div>
              </div>

              {/* DUA KOLOM BAWAH: INFORMASI TERKINI & PROFIL SISWA (MATCHING SCREENSHOT 2) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Tabel Informasi Terkini (2 Span) */}
                <div className="lg:col-span-2 bg-[#1e2330] rounded-2xl border border-slate-800 p-5 shadow-lg">
                  <h3 className="text-sm font-bold text-slate-200 tracking-wide mb-4">
                    Informasi Terkini
                  </h3>
                  <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#151922] text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Topik</th>
                          <th className="py-3 px-4">Tanggal</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-slate-500 text-xs">
                            Belum ada pengumuman untuk Anda.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Kolom Kanan: Identitas Siswa Widget (1 Span) */}
                <div className="bg-[#1e2330] rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
                  <div className="flex flex-col items-center text-center">
                    {/* Lingkaran Avatar Ungu AR */}
                    <div className="w-20 h-20 rounded-full bg-purple-600 border-2 border-purple-400/60 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                      {currentStudent.name ? currentStudent.name.slice(0, 2).toUpperCase() : 'AR'}
                    </div>

                    <h4 className="text-base font-extrabold text-white mt-3 tracking-wide">
                      {currentStudent.name || 'ARJUN'}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 mt-0.5">
                      {currentStudent.className || 'X MIPA 1'}
                    </span>
                  </div>

                  {/* Kotak Bawah NIS & Sesi */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 text-center text-xs divide-x divide-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                        NIS
                      </span>
                      <span className="font-extrabold text-white text-xs mt-0.5 block font-mono">
                        {currentStudent.nis || '26001'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                        Sesi
                      </span>
                      <span className="font-extrabold text-white text-xs mt-0.5 block">
                        {currentStudent.session || 'Sesi 1 (Pagi)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* B. UJIAN HARI INI (PERSIS SCREENSHOT 3)                     */}
          {/* ========================================================== */}
          {activeMenu === 'UJIAN_HARI_INI' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Ujian Hari Ini</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar paket asesmen dan ujian yang aktif dan siap dikerjakan untuk rombel Anda
                </p>
              </div>

              {/* KARTU PREVIEW JADWAL AKTIF */}
              {activeExam ? (
                <div className="space-y-4">
                  <div className="bg-[#1b2331] rounded-3xl border-l-4 border-l-emerald-500 border border-slate-800 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold bg-emerald-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
                          SESI AKTIF HARI INI
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                          {activeExam.startTime || '07:30'} - {activeExam.endTime || '09:30'} WIT
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                          Durasi: {activeExam.durationMinutes || 90} Menit
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
                          {activeExam.subjectName} ({activeExam.code})
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Pengampu: <strong className="text-slate-300">{activeExam.teacherName || 'Dermawan Surya Kencana, S. Sos'}</strong> &bull; Ruang: <strong className="text-emerald-400">{currentStudent.room || 'LAB-01'}</strong> &bull; Server: <strong className="text-slate-300">{currentStudent.server || 'SERVER-01'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>40 Butir Soal Terstandar</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Token Pengawas: <strong className="text-amber-300 font-mono tracking-widest">{activeToken || '36S7KS'}</strong></span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMenu('EXAM_PLAYER')}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-3 cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>KERJAKAN UJIAN SEKARANG</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e2330] rounded-3xl border border-slate-800 p-12 text-center shadow-xl space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-5xl shadow-inner">
                    🕒📄
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-200">
                    Tidak ada ujian yang dijadwalkan hari ini.
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Semua paket asesmen hari ini telah selesai atau belum dimulai. Silakan cek menu{' '}
                    <strong className="text-emerald-400">Jadwal Ujian</strong> untuk melihat daftar sesi berikutnya.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveMenu('JADWAL')}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Lihat Jadwal Ujian Tersedia</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* C. JADWAL UJIAN TERSEDIA (PERSIS SCREENSHOT 4: KANBAN HARI) */}
          {/* ========================================================== */}
          {activeMenu === 'JADWAL' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Jadwal Ujian Tersedia</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar mata pelajaran ujian yang dijadwalkan untuk tingkat Anda
                </p>
              </div>

              {/* 4 KOLOM KANBAN: SENIN, SELASA, RABU, KAMIS (MATCHING SCREENSHOT 4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {days.map((day) => {
                  const daySchedules = displaySchedules.filter((s) => s.dayOfWeek === day);

                  return (
                    <div key={day} className="space-y-3">
                      {/* Header Hari Pill */}
                      <div className="bg-[#1c2230] p-2.5 rounded-xl border border-slate-800 text-center font-black text-xs tracking-wider text-slate-300 uppercase shadow-xs">
                        {day}
                      </div>

                      {/* Konten Kartu di Dalam Kolom Hari */}
                      <div className="space-y-3">
                        {daySchedules.length === 0 ? (
                          <div className="p-6 bg-[#1e2330] rounded-xl border border-slate-800/80 text-center text-xs text-slate-500 shadow-sm">
                            Tidak ada ujian
                          </div>
                        ) : (
                          daySchedules.map((sch) => (
                            <div
                              key={sch.id}
                              className={`p-4 rounded-xl border shadow-md space-y-3 text-xs ${
                                sch.isActive
                                  ? 'bg-[#1b2230] border-l-4 border-l-amber-500 border-slate-800 shadow-amber-950/20'
                                  : 'bg-[#1e2330] border-slate-800'
                              }`}
                            >
                              {/* Header Card: Sesi & Status Dot */}
                              <div className="flex justify-between items-start">
                                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                                  Sesi {sch.sessionNumber || 1}
                                </span>
                                {sch.isActive ? (
                                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                                )}
                              </div>

                              {/* Waktu & Detail Mapel */}
                              <div>
                                <span className="text-[11px] font-mono text-emerald-400 block font-bold">
                                  {sch.startTime || '17:00'} - {sch.endTime || '19:00'}
                                </span>
                                <h4 className="font-extrabold text-white text-xs mt-1 leading-snug">
                                  {sch.subjectName}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  &bull; {sch.teacherName || 'Dewan Guru'}
                                </p>
                              </div>

                              {/* Tombol Aksi */}
                              <div>
                                {sch.isActive ? (
                                  <button
                                    onClick={() => setActiveMenu('EXAM_PLAYER')}
                                    className="w-full py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-black text-xs tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                                  >
                                    <span>📝 LANJUTKAN</span>
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="w-full py-1.5 bg-rose-950/40 text-rose-400 border border-rose-900/60 rounded-lg text-center font-bold text-[11px] cursor-not-allowed opacity-80"
                                  >
                                    Telat Ujian
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* D. HASIL NILAI SISWA (REKAPITULASI & TRANSPARANSI)         */}
          {/* ========================================================== */}
          {activeMenu === 'NILAI' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.textColor }}>
                  Riwayat Hasil Nilai Ujian
                </h1>
                <p className="text-xs mt-0.5" style={{ color: theme.mutedTextColor }}>
                  Transparansi nilai pilihan ganda dan koreksi otomatis lembar esai oleh sistem
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-2xl border text-center transition-colors shadow-xs"
                  style={{ backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.mutedTextColor }}>
                    Total Ujian Diikuti
                  </span>
                  <span className="text-2xl font-black mt-1 block" style={{ color: theme.textColor }}>
                    3 Ujian
                  </span>
                </div>
                <div
                  className="p-4 rounded-2xl border text-center transition-colors shadow-xs"
                  style={{ backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.mutedTextColor }}>
                    Rata-rata Nilai
                  </span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">88.5</span>
                </div>
                <div
                  className="p-4 rounded-2xl border text-center transition-colors shadow-xs"
                  style={{ backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.mutedTextColor }}>
                    Status Ketuntasan
                  </span>
                  <span className="text-sm font-black text-cyan-400 mt-2 block">
                    100% Lulus KKM (70)
                  </span>
                </div>
              </div>

              {/* Tabel Rekap Nilai Siswa */}
              <div
                className="rounded-2xl border p-6 shadow-xl space-y-4 transition-colors"
                style={{ backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151922] text-slate-400 font-extrabold uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Mata Pelajaran</th>
                        <th className="py-3 px-4">Tanggal Ujian</th>
                        <th className="py-3 px-4 text-center">Skor Pilihan Ganda</th>
                        <th className="py-3 px-4 text-center text-emerald-400">Skor Esai</th>
                        <th className="py-3 px-4 text-center font-extrabold text-white">Total Nilai</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          Pendidikan Pancasila dan Kewarganegaraan (PPKN-KLS-VI-1)
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">18 May 2026</td>
                        <td className="py-3.5 px-4 text-center">60 / 65</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400">32 / 35</td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-cyan-300">
                          92
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold text-[10px]">
                            Tuntas (KKM: 70)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          Bahasa Indonesia (BINDO-KLS-VI-1)
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">18 May 2026</td>
                        <td className="py-3.5 px-4 text-center">55 / 65</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400">30 / 35</td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-cyan-300">
                          85
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold text-[10px]">
                            Tuntas (KKM: 70)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          Sosiologi (SOS-KLS-X-1)
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">05 May 2026</td>
                        <td className="py-3.5 px-4 text-center">58 / 65</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400">30 / 35</td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-cyan-300">
                          88
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold text-[10px]">
                            Tuntas (KKM: 70)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* E. PENGUMUMAN SISWA (PERSIS SCREENSHOT 5)                  */}
          {/* ========================================================== */}
          {activeMenu === 'PENGUMUMAN' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>📢</span>
                  <span>Pengumuman &amp; Informasi</span>
                </h1>
              </div>

              {/* CONTAINER KARTU DENGAN ILUSTRASI MEGAPHONE (PERSIS SCREENSHOT 5) */}
              <div className="bg-[#1e2330] rounded-3xl border border-slate-800 p-12 text-center shadow-xl space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-5xl shadow-inner">
                  📣
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-200">
                  Belum ada pengumuman untuk Anda.
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Informasi resmi dari proktor atau wali kelas akan ditampilkan di halaman ini saat diterbitkan.
                </p>
              </div>

              {/* INFORMASI TATA TERTIB RESMI */}
              <div className="bg-[#1b2331] rounded-2xl border border-slate-800 p-6 shadow-md text-xs space-y-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tata Tertib Ujian Berbasis Komputer (UBK)</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>Peserta wajib hadir di ruang ujian 15 menit sebelum sesi dimulai.</li>
                  <li>Dilarang membuka tab baru, browser lain, atau aplikasi di luar halaman ujian.</li>
                  <li>Sistem mencatat pelanggaran tab / perpindahan layar secara otomatis.</li>
                  <li>Pastikan token ujian diperoleh langsung dari pengawas ruang.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* F. EXAM PLAYER (LEMBAR UJIAN INTERAKTIF SISWA)             */}
          {/* ========================================================== */}
          {activeMenu === 'EXAM_PLAYER' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveMenu('DASHBOARD')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Dashboard Siswa</span>
              </button>

              <StudentExamPlayer
                exam={activeExam}
                tokenRequired={tokenRequired}
                activeToken={activeToken}
                studentId={currentStudent.id}
                studentName={currentStudent.name}
                studentNisn={currentStudent.nisn}
                studentNoPeserta={currentStudent.noPeserta}
                branding={branding}
                onStudentFinished={(score, total) => {
                  onStudentFinished(score, total);
                  setActiveMenu('NILAI');
                }}
                onViolationReported={onViolationReported}
              />
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL PENGATURAN SISWA                                      */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2330] border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>Pengaturan Akun Siswa</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Peserta</span>
                <span className="font-extrabold text-white text-sm">{currentStudent.name}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Peserta UBK</span>
                <span className="font-mono text-emerald-400 font-bold">{currentStudent.noPeserta}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rombel / Kelas</span>
                <span className="font-bold text-white">{currentStudent.className} ({currentStudent.jurusan})</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Server Terhubung</span>
                <span className="font-bold text-emerald-400">Server PUSAT MH (Online)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
