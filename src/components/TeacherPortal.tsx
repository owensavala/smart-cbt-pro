'use client';

import React, { useState, useMemo } from 'react';
import {
  Home,
  Layers,
  Calendar,
  Award,
  Users,
  User,
  Bell,
  Monitor,
  Printer,
  Sparkles,
  PlusCircle,
  Edit3,
  Trash2,
  Copy,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  KeyRound,
  FileCheck2,
  Check,
  ChevronDown,
  ChevronRight,
  School,
  Save,
  X,
  Code,
  Search,
  Settings,
  Clock,
  PieChart,
  Megaphone,
  UserCheck,
  BookOpen,
  ArrowRight,
  Pencil,
  BarChart3,
  Activity,
  Sliders,
  ShieldCheck,
  Wrench,
  Trophy,
  RefreshCw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Send,
  Upload,
  Menu,
  CreditCard,
  Shuffle,
  ShieldAlert,
  Plus,
  Hourglass,
  Timer,
  ToggleRight,
  ToggleLeft,
  FolderSync,
  FileText,
  Crown,
  Cpu,
} from 'lucide-react';
import HelpTutorialModal from './common/HelpTutorialModal';
import AiEssaySimulatorModal from './teacher/AiEssaySimulatorModal';
import {
  Teacher,
  Subject,
  Exam,
  Question,
  Student,
  StudentSession,
  SchoolBrandingSettings,
  ExamSchedule,
  QuestionBank,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
} from '../lib/types';
import { getResolvedThemeColors } from '../lib/theme-palettes';
import MathStudio from './MathStudio';
import BankSoalManagementView, { DEFAULT_QUESTION_BANKS } from './banksoal/BankSoalManagementView';
import JadwalUjianManagementView from './jadwal/JadwalUjianManagementView';
import { DEFAULT_EXAM_TYPES, DEFAULT_LEVELS, DEFAULT_MAJORS } from '../lib/master-template';
import AnalisaPerSoalView from './analisa/AnalisaPerSoalView';
import AnalisaNilaiMapelView from './analisa/AnalisaNilaiMapelView';
import AnalisaNilaiRankingView from './analisa/AnalisaNilaiRankingView';
import PerbaikanNilaiView from './analisa/PerbaikanNilaiView';
import HasilNilaiView from './nilai/HasilNilaiView';
import HasilNilaiPerMapelView from './nilai/HasilNilaiPerMapelView';
import HistoryNilaiView from './nilai/HistoryNilaiView';

interface TeacherPortalProps {
  currentTeacher: Teacher;
  teachers?: Teacher[];
  subjects: Subject[];
  exam: Exam;
  schedules?: ExamSchedule[];
  classes?: SchoolClass[];
  rooms?: ExamRoom[];
  sessions?: ExamSessionInfo[];
  students: Student[];
  studentSessions: StudentSession[];
  branding?: SchoolBrandingSettings;
  activeToken?: string;
  tokenRequired?: boolean;
  onUpdateExamQuestions: (questions: Question[]) => void;
  onUpdateTeacherProfile?: (updated: Teacher) => void;
  onAddSchedule?: (schedule: ExamSchedule) => void;
  onUpdateSchedule?: (schedule: ExamSchedule) => void;
  onDeleteSchedule?: (id: string) => void;
  onResetStudent?: (studentId: string) => void;
  onLogout?: () => void;
  onSwitchView?: (view: 'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA' | 'SUPERADMIN') => void;
  currentUser?: any;
}

export default function TeacherPortal({
  currentTeacher,
  teachers = [],
  subjects = [],
  exam,
  schedules = [],
  classes = [],
  rooms = [],
  sessions = [],
  students = [],
  studentSessions = [],
  branding,
  activeToken = '36S7KS',
  tokenRequired = true,
  onUpdateExamQuestions,
  onUpdateTeacherProfile,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onResetStudent,
  onLogout,
  onSwitchView,
  currentUser,
}: TeacherPortalProps) {
  // Resolved 4-Color Theme
  const theme = getResolvedThemeColors(branding);

  // Modal Tutorial & Simulator AI
  const [isHelpTutorialOpen, setIsHelpTutorialOpen] = useState(false);
  const [isAiEssaySimulatorOpen, setIsAiEssaySimulatorOpen] = useState(false);

  // Navigation Menu: 'beranda' | 'bankSoal' | 'mathStudio' | 'jadwalUjian' | 'nilaiHasil' | 'nilaiPerMapel' | 'nilaiHistory' | 'analisaPerSoal' | 'analisaMapel' | 'analisaRanking' | 'analisaPerbaikan' | 'pengumuman' | 'profilSaya'
  const [activeMenu, setActiveMenu] = useState<string>('beranda');
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    analisa: false,
    nilai: false,
  });

  // Dropdown Profil Guru di Topbar
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // State Profil Saya (Screenshot 2)
  const [profileName, setProfileName] = useState(currentTeacher?.name || 'Dermawan Surya Kencana, S. Sos');
  const [profileUsername, setProfileUsername] = useState(currentTeacher?.username || 'dermawanf727@gmail.com');
  const [profileNip, setProfileNip] = useState(currentTeacher?.nip && currentTeacher.nip !== '-' ? currentTeacher.nip : '198403152009021004');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileGeminiApiKey, setProfileGeminiApiKey] = useState(currentTeacher?.geminiApiKey || '••••••••••••••••');
  const [profileJabatan, setProfileJabatan] = useState(currentTeacher?.jabatan || 'Guru Sosiologi & PPKn SMA');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Sync profile form state whenever currentTeacher updates
  React.useEffect(() => {
    if (currentTeacher) {
      setProfileName(currentTeacher.name || 'Dermawan Surya Kencana, S. Sos');
      setProfileUsername(currentTeacher.username || 'dermawanf727@gmail.com');
      setProfileNip(currentTeacher.nip && currentTeacher.nip !== '-' ? currentTeacher.nip : '198403152009021004');
      setProfileJabatan(currentTeacher.jabatan || 'Guru Sosiologi & PPKn SMA');
    }
  }, [currentTeacher]);

  // State Pengumuman (Screenshot 3)
  const [announcementTarget, setAnnouncementTarget] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementsList, setAnnouncementsList] = useState<Array<{
    id: string;
    title: string;
    target: string;
    content: string;
    date: string;
    author: string;
  }>>([]);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // State Bank Soal & Jadwal Ujian
  const [localQuestionBanks, setLocalQuestionBanks] = useState<QuestionBank[]>(DEFAULT_QUESTION_BANKS);
  const [localSchedules, setLocalSchedules] = useState<ExamSchedule[]>(schedules);
  React.useEffect(() => {
    if (schedules && schedules.length > 0) {
      setLocalSchedules(schedules);
    }
  }, [schedules]);

  const handleAddSchedule = (newSch: ExamSchedule) => {
    setLocalSchedules((prev) => [...prev, newSch]);
    onAddSchedule?.(newSch);
  };

  const handleUpdateSchedule = (upd: ExamSchedule) => {
    setLocalSchedules((prev) => prev.map((s) => (s.id === upd.id ? upd : s)));
    onUpdateSchedule?.(upd);
  };

  const handleDeleteSchedule = (id: string) => {
    setLocalSchedules((prev) => prev.filter((s) => s.id !== id));
    onDeleteSchedule?.(id);
  };

  const [bankSoalSearch, setBankSoalSearch] = useState('');
  const [bankSoalEntries, setBankSoalEntries] = useState(10);
  const [jadwalSearch, setJadwalSearch] = useState('');
  const [jadwalEntries, setJadwalEntries] = useState(10);
  const [jadwalStatusFilter, setJadwalStatusFilter] = useState<'AKTIF' | 'NON_AKTIF' | 'ALL'>('AKTIF');
  const [isJadwalActive, setIsJadwalActive] = useState(true);

  // Mapel yang diampu oleh guru ini
  const myAssignedSubjects = useMemo(() => {
    return subjects.filter((s) => currentTeacher?.assignedSubjectIds?.includes(s.id));
  }, [subjects, currentTeacher]);

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim()) {
      alert('Judul pengumuman wajib diisi!');
      return;
    }
    const newAnn = {
      id: `ann_${Date.now()}`,
      title: announcementTitle,
      target: announcementTarget || 'Semua Siswa & Guru',
      content: announcementContent,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: profileName || 'Dermawan Surya Kencana, S. Sos',
    };
    setAnnouncementsList((prev) => [newAnn, ...prev]);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementTarget('');
    setPublishSuccessMsg('Pengumuman berhasil diterbitkan!');
    setTimeout(() => setPublishSuccessMsg(''), 3000);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      setAnnouncementsList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherProfile?.({
      ...currentTeacher,
      name: profileName,
      username: profileUsername,
      nip: profileNip,
      passwordText: profilePassword || currentTeacher?.passwordText,
      geminiApiKey: profileGeminiApiKey,
      jabatan: profileJabatan,
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // Sesi & Log Aktifitas Siswa (matching Image 1)
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 'log_1',
      studentName: 'ARJUN',
      date: '08/11/2026',
      time: '07:30 WIT',
      action: 'Masuk',
      avatarColor: 'bg-amber-500',
    },
    {
      id: 'log_2',
      studentName: 'ALYA ZAHIDAH DAENG MAPATO',
      date: '15/09/2026',
      time: '08:15 WIT',
      action: 'Masuk',
      avatarColor: 'bg-blue-500',
    },
    {
      id: 'log_3',
      studentName: 'AFHIF U SANGADJI',
      date: '15/09/2026',
      time: '08:16 WIT',
      action: 'Masuk',
      avatarColor: 'bg-emerald-500',
    },
    {
      id: 'log_4',
      studentName: 'AHMAD JIBRIL MUHAMMAD',
      date: '15/09/2026',
      time: '08:18 WIT',
      action: 'Masuk',
      avatarColor: 'bg-purple-500',
    },
  ]);

  // Accordion Toggle Submenu
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => {
      const willOpen = !prev[key];
      return {
        analisa: false,
        nilai: false,
        [key]: willOpen,
      };
    });
  };

  const submenuParentMap: Record<string, string> = {
    analisaPerSoal: 'analisa',
    analisaMapel: 'analisa',
    analisaRanking: 'analisa',
    analisaPerbaikan: 'analisa',

    nilaiHasil: 'nilai',
    nilaiPerMapel: 'nilai',
    nilaiHistory: 'nilai',
  };

  const navigateToMenu = (key: string, parentSubmenu?: string) => {
    setActiveMenu(key);
    const parent = parentSubmenu || submenuParentMap[key];
    setOpenSubmenus({
      analisa: parent === 'analisa',
      nilai: parent === 'nilai',
    });
  };

  const handleClearActivityLogs = () => {
    if (confirm('Bersihkan semua riwayat log aktifitas siswa?')) {
      setActivityLogs([]);
    }
  };


  // Nama inisial guru untuk avatar bulat
  const teacherInitials = (currentTeacher?.name || 'Dermawan Surya Kencana')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div
      className="flex w-full min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* ============================================================== */}
      {/* 1. SIDEBAR SESI GURU (MATCHING IMAGE 1 & 4)                   */}
      {/* ============================================================== */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col justify-between border-r text-xs select-none min-h-screen sticky top-0 h-screen overflow-y-auto overflow-x-hidden sidebar-scrollbar transition-colors"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
          color: theme.textColor,
        }}
      >
        <div>
          {/* Header Sekolah di Sidebar */}
          <div
            className="p-4 flex items-center gap-3 border-b transition-colors"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              borderColor: theme.borderColor,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md overflow-hidden">
              {branding?.customLogoUrl ? (
                <img src={branding.customLogoUrl} alt="Logo" className="w-7 h-7 object-contain" />
              ) : branding?.logoType === 'kemdikbud' ? (
                <span>🎓</span>
              ) : branding?.logoType === 'pesantren' ? (
                <span>⭐</span>
              ) : branding?.logoType === 'techno' ? (
                <span>🛡️</span>
              ) : branding?.logoType === 'madrasah' ? (
                <span>🕌</span>
              ) : (
                <School className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className="font-extrabold text-slate-100 text-xs leading-tight uppercase tracking-tight">
                {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Server PUSAT (Online)
              </span>
            </div>
          </div>

          {/* BANNER MERAH: MENU UTAMA */}
          <div className="bg-[#e11d48] text-white font-black text-[10px] tracking-wider uppercase px-4 py-2 flex items-center justify-between shadow-xs">
            <span>MENU UTAMA</span>
            <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-bold">PORTAL GURU</span>
          </div>

          {/* DAFTAR MENU SIDEBAR GURU (PEDAGOGIS & AKADEMIK) */}
          <nav className="p-2 space-y-0.5 text-slate-300">
            {/* 1. Beranda */}
            <button
              onClick={() => navigateToMenu('beranda')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'beranda'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Beranda</span>
            </button>

            {/* 2. Bank Soal (AKM & Esai AI) */}
            <button
              onClick={() => navigateToMenu('bankSoal')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'bankSoal'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Bank Soal</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/30">
                AKM + AI
              </span>
            </button>

            {/* 3. Math Studio */}
            <button
              onClick={() => navigateToMenu('mathStudio')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'mathStudio'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 text-purple-400" />
              <span>Math Studio</span>
            </button>

            {/* 4. Jadwal Ujian */}
            <button
              onClick={() => navigateToMenu('jadwalUjian')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'jadwalUjian'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Jadwal Ujian</span>
            </button>

            {/* 5. Nilai & Koreksi AI (Dropdown 3 Submenu) */}
            <div>
              <button
                onClick={() => toggleSubmenu('nilai')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Nilai & Koreksi AI</span>
                </div>
                {openSubmenus.nilai ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.nilai && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    {/* 1. Hasil Nilai */}
                    <button
                      onClick={() => setActiveMenu('nilaiHasil')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiHasil'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Hasil Nilai & Veto AI</span>
                    </button>

                    {/* 2. Nilai Per Mapel */}
                    <button
                      onClick={() => setActiveMenu('nilaiPerMapel')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiPerMapel'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <BarChart3 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Nilai Per Mapel</span>
                    </button>

                    {/* 3. History Jawaban */}
                    <button
                      onClick={() => setActiveMenu('nilaiHistory')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiHistory'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>History Jawaban</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Analisa (Dropdown with 4 Submenus - Image 4) */}
            <div>
              <button
                onClick={() => toggleSubmenu('analisa')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Analisa Butir Soal</span>
                </div>
                {openSubmenus.analisa ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.analisa && (
                <div className="pl-6 pr-2 py-1 space-y-0.5 text-[11px] bg-black/15 rounded-lg my-0.5 border-l-2 border-slate-700/80 ml-5">
                  <button
                    onClick={() => setActiveMenu('analisaPerSoal')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                      activeMenu === 'analisaPerSoal'
                        ? 'bg-blue-500/20 text-blue-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Analisa Per Soal</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu('analisaMapel')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                      activeMenu === 'analisaMapel'
                        ? 'bg-blue-500/20 text-blue-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Analisa Nilai Mapel</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu('analisaRanking')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                      activeMenu === 'analisaRanking'
                        ? 'bg-blue-500/20 text-blue-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Analisa Nilai Ranking</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu('analisaPerbaikan')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                      activeMenu === 'analisaPerbaikan'
                        ? 'bg-blue-500/20 text-blue-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Perbaikan Nilai (Remedial)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. Pengumuman */}
            <button
              onClick={() => navigateToMenu('pengumuman')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'pengumuman'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4 text-orange-400" />
              <span>Pengumuman</span>
            </button>

            {/* 8. Profil Saya */}
            <button
              onClick={() => navigateToMenu('profilSaya')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'profilSaya'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Profil Saya</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar Guru */}
        <div className="p-3 bg-[#11141c] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-300 font-semibold">SmartCBT Pro</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Keluar dari sesi akun ini"
            >
              Keluar
            </button>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. KONTEN UTAMA SESI GURU (KANAN)                              */}
      {/* ============================================================== */}
      <div
        className="flex-1 min-w-0 flex flex-col min-h-screen overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        {/* TOPBAR GURU (Tinggi Statis Anti-Layout Shift: 64px / h-16) */}
        <header
          className="h-16 border-b px-6 flex items-center justify-between flex-shrink-0 select-none sticky top-0 z-30 shadow-md text-white transition-colors"
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.borderColor,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Toggle Menu"
            >
              <div className="space-y-1">
                <span className="block w-4 h-0.5 bg-slate-300" />
                <span className="block w-4 h-0.5 bg-slate-300" />
                <span className="block w-4 h-0.5 bg-slate-300" />
              </div>
            </button>
            <span className="font-extrabold text-sm md:text-base tracking-tight text-white truncate whitespace-nowrap">
              {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 whitespace-nowrap">
            {/* Tombol AI Essay Simulator */}
            <button
              onClick={() => setIsAiEssaySimulatorOpen(true)}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shadow-md transform hover:scale-105 shrink-0 whitespace-nowrap"
              title="Simulator Penilaian Esai Otomatis AI / NLP Python Gratis"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-200" />
              <span>Simulator Esai AI</span>
            </button>

            {/* Tombol Panduan & Tutorial Guru */}
            <button
              onClick={() => setIsHelpTutorialOpen(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border border-white/20 shrink-0 whitespace-nowrap"
              title="Pusat Panduan & Tutorial Guru"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>Panduan</span>
            </button>

            {/* Tombol Cepat Sesi Super Admin (HANYA MUNCUL JIKA USER LOGIN SEBAGAI SUPER ADMIN) */}
            {currentUser?.role === 'SUPER_ADMIN' && onSwitchView && (
              <button
                onClick={() => onSwitchView('SUPERADMIN')}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shadow-md transform hover:scale-105 shrink-0 whitespace-nowrap"
                title="Buka Sesi Super Admin (Ubah Warna, Nama & Logo)"
              >
                <Crown className="w-3.5 h-3.5 text-slate-950" />
                <span>Super Admin</span>
              </button>
            )}

            {/* Settings Gear */}
            <button
              onClick={() => navigateToMenu('profilSaya')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Pengaturan Profil"
            >
              <Settings className="w-4 h-4 text-slate-300" />
            </button>

            {/* User Profile Badge (Image 1: DS Dermawan Surya Kencana, S. Sos) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:bg-slate-800/60 p-1.5 pr-2.5 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0">
                  {teacherInitials}
                </div>
                <div className="flex items-center gap-1.5 text-left truncate">
                  <span className="font-bold text-slate-200 text-xs truncate max-w-[140px] md:max-w-[180px]">
                    {currentTeacher?.name || 'Dermawan Surya Kencana, S. Sos'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#1c2230] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-700/80">
                    <p className="font-bold text-white truncate">{currentTeacher?.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NIP: {currentTeacher?.nip || '-'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigateToMenu('profilSaya');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800/80 text-slate-300 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Profil Saya</span>
                  </button>

                  {onSwitchView && (
                    <>
                      {currentUser?.role === 'SUPER_ADMIN' && (
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onSwitchView('SUPERADMIN');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-amber-500/20 text-amber-300 flex items-center gap-2 cursor-pointer font-bold border-t border-slate-700/60"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sesi Super Admin</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSwitchView('OPERATOR');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-600/20 text-blue-300 flex items-center gap-2 cursor-pointer font-bold border-t border-slate-700/60"
                      >
                        <School className="w-3.5 h-3.5 text-blue-400" />
                        <span>Beralih ke Sesi Operator</span>
                      </button>
                    </>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                      <span>Keluar (Logout)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORK AREA */}
        <div className="p-6 md:p-8 space-y-6 flex-1 w-full max-w-[1920px]">
          {/* ============================================================== */}
          {/* VIEW 1: BERANDA DASHBOARD GURU (MATCHING IMAGE 1)              */}
          {/* ============================================================== */}
          {activeMenu === 'beranda' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Dashboard</h1>
              </div>

              {/* 8 KOTAK STATISTIK WARNA-WARNI MATCHING IMAGE 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Jumlah Siswa (Blue #0284c7) */}
                <div className="bg-[#0284c7] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{students.length || 100}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Siswa</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('nilaiHasil', 'nilai')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Hasil Nilai &rarr;
                  </button>
                </div>

                {/* 2. Jumlah Nilai (Orange/Amber #f59e0b) */}
                <div className="bg-[#eab308] text-slate-900 p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">
                      {studentSessions.filter((s) => s.totalScore !== undefined).length || 75}
                    </span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Nilai</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('analisaMapel', 'analisa')}
                    className="mt-3 text-[10px] text-slate-900/80 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                {/* 3. Jumlah Soal (Red #ef4444) */}
                <div className="bg-[#ef4444] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">
                      {exam?.questions?.length || 70}
                    </span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Soal</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('bankSoal')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Bank Soal &rarr;
                  </button>
                </div>

                {/* 4. Jumlah Kelas (Green #10b981) */}
                <div className="bg-[#10b981] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{classes.length || 4}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Kelas</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('jadwalUjian')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Jadwal Ujian &rarr;
                  </button>
                </div>

                {/* 5. Jumlah Siswa Per Sesi (Cyan #06b6d4) */}
                <div className="bg-[#06b6d4] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-sm font-black tracking-tight block">
                      Sesi 1 = {students.filter((s) => s.session?.includes('1')).length || 50} Siswa
                    </span>
                    <p className="text-xs font-bold mt-2 opacity-90">Jumlah Siswa Per Sesi</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('jadwalUjian')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Jadwal &rarr;
                  </button>
                </div>

                {/* 6. Jumlah Guru (Pink #ec4899) */}
                <div className="bg-[#ec4899] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{teachers.length || 1}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Guru</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('profilSaya')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Profil Guru &rarr;
                  </button>
                </div>

                {/* 7. Jumlah Ruang (Emerald #10b981) */}
                <div className="bg-[#10b981] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{rooms.length || 3}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Ruang</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('jadwalUjian')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Jadwal &rarr;
                  </button>
                </div>

                {/* 8. Jumlah Mapel (Teal #059669) */}
                <div className="bg-[#059669] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{subjects.length || 11}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Mapel</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('bankSoal')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Bank Soal &rarr;
                  </button>
                </div>
              </div>

              {/* 2 BARIS BANNER AKTIF matching Image 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Essay Simulator Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-xl md:text-2xl font-black block flex items-center gap-2">
                      <Cpu className="w-6 h-6 text-emerald-200" />
                      <span>Simulator Esai AI</span>
                    </span>
                    <p className="text-xs opacity-90 mt-1 font-medium">Uji Coba Bobot Konsep, Sinonim & Koreksi NLP Otomatis</p>
                  </div>
                  <button
                    onClick={() => setIsAiEssaySimulatorOpen(true)}
                    className="px-4 py-2 bg-black/25 hover:bg-black/40 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <span>Buka Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Jadwal Hari Ini */}
                <div className="bg-[#f59e0b] text-slate-900 p-5 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-black block">0</span>
                    <p className="text-xs font-semibold opacity-90 mt-1">Jadwal Ujian Aktif Hari Ini</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('jadwalUjian')}
                    className="px-4 py-2 bg-black/10 hover:bg-black/20 text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Lihat Jadwal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2 PANEL BAWAH: PENGUMUMAN & LOG AKTIFITAS matching Image 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel Kiri: Pengumuman */}
                <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-xs">
                      <Megaphone className="w-4 h-4 text-slate-300" />
                      <span>Pengumuman</span>
                    </div>
                    <div className="py-12 text-center text-xs text-slate-500 font-medium">
                      Belum ada pengumuman.
                    </div>
                  </div>
                </div>

                {/* Panel Kanan: Log Aktifitas Siswa matching Image 1 */}
                <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Log Aktifitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-400 hover:text-blue-300 cursor-pointer" title="Edit Log">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleClearActivityLogs}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Bersihkan Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                        {activityLogs.length}
                      </span>
                    </div>
                  </div>

                  {/* List Feed Log Siswa */}
                  <div className="divide-y divide-slate-800/80 mt-2 max-h-56 overflow-y-auto pr-1">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${log.avatarColor} text-white font-black text-[10px] flex items-center justify-center`}>
                            {log.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-[11px] leading-tight">
                              {log.studentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 border border-emerald-500/30">
                          &rarr; {log.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          

          {/* ============================================================== */}
          {/* VIEW 2: MATH STUDIO (MATCHING IMAGES 2 & 3)                    */}
          {/* ============================================================== */}
          {activeMenu === 'mathStudio' && <MathStudio />}

          {/* ============================================================== */}
          {/* VIEW 3A: ANALISA BUTIR SOAL (MATCHING IMAGE 5)                 */}
          {/* ============================================================== */}
          {activeMenu === 'analisaPerSoal' && (
            <AnalisaPerSoalView
              schedules={schedules}
              onNavigateToBankSoal={() => navigateToMenu('bankSoal')}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 3B: ANALISA CAPAIAN NILAI MAPEL (MATCHING IMAGE 6)        */}
          {/* ============================================================== */}
          {activeMenu === 'analisaMapel' && (
            <AnalisaNilaiMapelView
              classes={classes}
              subjects={subjects}
              schedules={schedules}
              students={students}
              onNavigateToRanking={() => navigateToMenu('analisaRanking', 'analisa')}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan', 'analisa')}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 3C: ANALISA NILAI RANKING (MATCHING IMAGE 7)              */}
          {/* ============================================================== */}
          {activeMenu === 'analisaRanking' && (
            <AnalisaNilaiRankingView
              classes={classes}
              subjects={subjects}
              schedules={schedules}
              students={students}
              branding={branding}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan', 'analisa')}
              onNavigateToCetakLeger={() => navigateToMenu('nilaiHasil', 'nilai')}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 3D: KELOLA REMEDIAL & PERBAIKAN NILAI (MATCHING IMAGE 8)  */}
          {/* ============================================================== */}
          {activeMenu === 'analisaPerbaikan' && (
            <PerbaikanNilaiView
              classes={classes}
              subjects={subjects}
              students={students}
              onNavigateToHasilNilai={() => navigateToMenu('analisaMapel', 'analisa')}
              onNavigateToRanking={() => navigateToMenu('analisaRanking', 'analisa')}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 4: PROFIL SAYA (INFORMASI AKUN - MATCHING SCREENSHOT 2)  */}
          {/* ============================================================== */}
          {activeMenu === 'profilSaya' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Informasi Akun
                </h1>
              </div>

              {/* 2-Column Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Kolom Kiri: Kartu Avatar & Ringkasan Akun */}
                <div className="bg-[#141724] border border-slate-800/80 rounded-2xl p-6 text-center shadow-xl">
                  {/* Lingkaran Avatar Kuning DS */}
                  <div className="w-28 h-28 mx-auto rounded-full bg-amber-400 border-4 border-amber-300/30 flex items-center justify-center text-slate-900 font-black text-4xl shadow-lg mb-3">
                    {teacherInitials || 'DS'}
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {profileName || 'Dermawan Surya Kencana, S. Sos'}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block mt-0.5 mb-6">
                    GURU
                  </span>

                  {/* Info List with Dividers */}
                  <div className="divide-y divide-slate-800/80 text-xs text-left">
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-400">Username</span>
                      <span className="text-sky-400 font-mono font-medium">{profileUsername || 'dermawanf727@gmail.com'}</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-400">NIP</span>
                      <span className="text-slate-300 font-mono">{profileNip || '-'}</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-400">Jabatan</span>
                      <span className="text-blue-400 font-semibold">{profileJabatan || 'Guru'}</span>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Form Pengaturan Profil */}
                <div className="lg:col-span-2 bg-[#141724] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                  {/* Badge Tombol Pengaturan Profil */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Pengaturan Profil</span>
                  </div>

                  {profileSaveSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Perubahan profil berhasil disimpan!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Username</label>
                      <input
                        type="text"
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    {/* NIP */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">NIP</label>
                      <input
                        type="text"
                        value={profileNip}
                        onChange={(e) => setProfileNip(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* API Key Gemini */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">API Key Gemini</label>
                      <input
                        type="password"
                        value={profileGeminiApiKey}
                        onChange={(e) => setProfileGeminiApiKey(e.target.value)}
                        placeholder="••••••••••••••••••••"
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <span className="text-[11px] text-slate-400 italic mt-1.5 block leading-relaxed">
                        *Hanya isi jika Anda memiliki API Key <span className="text-rose-400 font-semibold">Gemini AI Studio</span> sendiri. Jika dikosongkan, sistem akan meminjam API Key milik Administrator untuk fitur generate materi/kisi-kisi.
                      </span>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Password</label>
                      <input
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="Kosongkan jika tidak ingin mengubah"
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
                      />
                      <span className="text-[11px] text-slate-400 italic mt-1.5 block">
                        *Isi hanya jika ingin mengganti password
                      </span>
                    </div>

                    {/* Foto Profil */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Foto Profil</label>
                      <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-[#10131d]">
                        <span className="flex-1 px-3.5 py-2.5 text-slate-400 text-xs">Pilih file...</span>
                        <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer border-l border-slate-700">
                          Browse
                          <input type="file" className="hidden" accept="image/*" />
                        </label>
                      </div>
                    </div>

                    {/* Tombol Simpan Perubahan */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Footer Copyright */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Copyright &copy; 2026 EL-CBT. All rights reserved.</span>
                <span>Version 3.2.0</span>
              </div>
            </div>
          )}

          

          {/* ============================================================== */}
          {/* VIEW 6: DATA BANK SOAL (FULL CRUD, LIHAT SOAL & BUTIR SOAL)    */}
          {/* ============================================================== */}
          {activeMenu === 'bankSoal' && (
            <BankSoalManagementView
              teachers={teachers && teachers.length > 0 ? teachers : [currentTeacher]}
              subjects={subjects}
              classes={classes}
              levels={DEFAULT_LEVELS}
              majors={DEFAULT_MAJORS}
              initialQuestionBanks={localQuestionBanks}
              onQuestionBanksChange={setLocalQuestionBanks}
              onOpenPrint={() => window.print()}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 7: PENGATURAN JADWAL UJIAN (FULL CRUD & AKTIVASI JADWAL)  */}
          {/* ============================================================== */}
          {activeMenu === 'jadwalUjian' && (
            <JadwalUjianManagementView
              schedules={localSchedules.length > 0 ? localSchedules : schedules}
              subjects={subjects}
              classes={classes}
              sessions={sessions}
              students={students}
              studentSessions={studentSessions}
              examTypes={DEFAULT_EXAM_TYPES}
              questionBanks={localQuestionBanks}
              activeToken={activeToken}
              onAddSchedule={handleAddSchedule}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onNavigateToLiveMonitor={() => navigateToMenu('nilaiHasil', 'nilai')}
            />
          )}

          

          {/* ============================================================== */}
          {/* VIEW 8: PENGUMUMAN (MATCHING SCREENSHOT 3)                     */}
          {/* ============================================================== */}
          {activeMenu === 'pengumuman' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Manajemen Berita &amp; Pengumuman
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Publikasikan informasi, jadwal ujian susulan, atau pengumuman penting kepada siswa dan dewan guru.
                </p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Kolom Kiri: Tulis Pengumuman (WYSIWYG Layout) */}
                <div className="bg-[#141724] border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-sm pb-3 border-b border-slate-800">
                    <Edit3 className="w-4 h-4 text-blue-400" />
                    <span>Tulis Pengumuman</span>
                  </div>

                  {publishSuccessMsg && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{publishSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Jenis Pengumuman</label>
                      <select
                        value={announcementTarget}
                        onChange={(e) => setAnnouncementTarget(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Pilih Jenis / Target Pengumuman --</option>
                        <option value="Semua Peserta Ujian & Guru">Semua Peserta Ujian &amp; Guru</option>
                        <option value="Peserta Ujian Saja (Siswa)">Peserta Ujian Saja (Siswa)</option>
                        <option value="Dewan Guru & Pengawas Saja">Dewan Guru &amp; Pengawas Saja</option>
                        <option value="Khusus Kelas X MIPA">Khusus Kelas X MIPA</option>
                        <option value="Khusus Kelas X IPS">Khusus Kelas X IPS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Judul Pengumuman</label>
                      <input
                        type="text"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Tuliskan judul pengumuman asesmen..."
                        className="w-full px-3.5 py-2.5 bg-[#10131d] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* WYSIWYG Editor Container Matching Screenshot 3 */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Isi Pengumuman</label>
                      <div className="rounded-xl overflow-hidden border border-slate-700 bg-white text-slate-800 shadow-sm">
                        {/* Menubar (File Edit View Insert Format Tools Table Help) */}
                        <div className="bg-[#f1f5f9] border-b border-slate-300 px-3 py-1 flex items-center gap-3 text-[11px] text-slate-600 select-none">
                          <span className="hover:text-blue-600 cursor-pointer">File</span>
                          <span className="hover:text-blue-600 cursor-pointer">Edit</span>
                          <span className="hover:text-blue-600 cursor-pointer">View</span>
                          <span className="hover:text-blue-600 cursor-pointer">Insert</span>
                          <span className="hover:text-blue-600 cursor-pointer">Format</span>
                          <span className="hover:text-blue-600 cursor-pointer">Tools</span>
                          <span className="hover:text-blue-600 cursor-pointer">Table</span>
                          <span className="hover:text-blue-600 cursor-pointer">Help</span>
                        </div>

                        {/* Toolbar Buttons */}
                        <div className="bg-[#f8fafc] border-b border-slate-300 px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-slate-700 select-none">
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><Undo className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><Redo className="w-3.5 h-3.5" /></button>
                          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                          <button type="button" className="p-1 hover:bg-slate-200 rounded font-bold text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded italic text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignLeft className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignCenter className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignRight className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignJustify className="w-3.5 h-3.5" /></button>
                          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><List className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600"><ListOrdered className="w-3.5 h-3.5" /></button>
                        </div>

                        {/* Textarea Area */}
                        <textarea
                          rows={6}
                          value={announcementContent}
                          onChange={(e) => setAnnouncementContent(e.target.value)}
                          placeholder="Tuliskan isi pengumuman atau instruksi asesmen di sini..."
                          className="w-full p-3 bg-white text-slate-900 text-xs focus:outline-none resize-y min-h-[140px]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>Terbitkan Pengumuman</span>
                    </button>
                  </form>
                </div>

                {/* Kolom Kanan: Riwayat Pengumuman */}
                <div className="bg-[#141724] border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Megaphone className="w-4 h-4 text-orange-400" />
                      <span>Riwayat Pengumuman</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{announcementsList.length} Pengumuman</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#10131d] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">#</th>
                          <th className="py-2.5 px-3">JUDUL / TIPE</th>
                          <th className="py-2.5 px-3">TARGET</th>
                          <th className="py-2.5 px-3 text-center w-16">AKSI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-[#121622]">
                        {announcementsList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-500 text-xs">
                              Belum ada pengumuman
                            </td>
                          </tr>
                        ) : (
                          announcementsList.map((ann, idx) => (
                            <tr key={ann.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-white block">{ann.title}</span>
                                <span className="text-[10px] text-slate-400">{ann.date} &bull; {ann.author}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold">
                                  {ann.target}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteAnnouncement(ann.id)}
                                  className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {/* ============================================================== */}
          {/* NILAI SUBVIEWS (MATCHING SCREENSHOT 4)                         */}
          {/* ============================================================== */}
          {activeMenu === 'nilaiHasil' && (
            <HasilNilaiView
              students={students}
              subjects={subjects}
              classes={classes}
              schedules={schedules}
              onNavigateToRanking={() => navigateToMenu('analisaRanking', 'analisa')}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan', 'analisa')}
              onNavigateToCetakLeger={() => navigateToMenu('nilaiHasil')}
            />
          )}

          {activeMenu === 'nilaiPerMapel' && <HasilNilaiPerMapelView />}

          {activeMenu === 'nilaiHistory' && <HistoryNilaiView />}
        </div>
      </div>

      {/* Modal Panduan & Tutorial Guru */}
      <HelpTutorialModal
        isOpen={isHelpTutorialOpen}
        onClose={() => setIsHelpTutorialOpen(false)}
        defaultRole="TEACHER"
        onNavigateTab={(tab) => {
          if (tab === 'guru_banksoal') navigateToMenu('bankSoal');
          else if (tab === 'guru_mathstudio') navigateToMenu('mathStudio');
          else if (tab === 'guru_simulator') setIsAiEssaySimulatorOpen(true);
          else if (tab === 'guru_jadwal') navigateToMenu('jadwalUjian');
          else if (tab === 'guru_analisis') navigateToMenu('analisaPerSoal');
          else if (tab === 'guru_nilai') navigateToMenu('nilaiHasil');
        }}
      />

      {/* Modal Simulator Esai AI / NLP Python */}
      <AiEssaySimulatorModal
        isOpen={isAiEssaySimulatorOpen}
        onClose={() => setIsAiEssaySimulatorOpen(false)}
      />
    </div>
  );
}
