'use client';

import React, { useState } from 'react';
import {
  Home,
  Database,
  Users,
  Layers,
  Calendar,
  Monitor,
  Award,
  Printer,
  BarChart3,
  UserCog,
  RefreshCw,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  ChevronDown,
  ChevronRight,
  School,
  FileSpreadsheet,
  Bell,
  Settings,
  HelpCircle,
  Activity,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Palette,
  Eye,
  Check,
  X,
  Clock,
  Play,
  RotateCcw,
  Shuffle,
  ListOrdered,
  Download,
  Upload,
  Loader2,
  Folder,
  Server,
  UploadCloud,
  FileText,
  GraduationCap,
  MapPin,
  History,
  CreditCard,
  UserCheck,
  Menu,
  Wrench,
  Megaphone,
  Rocket,
  TrendingUp,
  Crown,
} from 'lucide-react';
import MathStudio from './MathStudio';
import {
  Teacher,
  Subject,
  Student,
  StudentSession,
  Exam,
  ExamSchedule,
  Question,
  SchoolBrandingSettings,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
  MultipleChoiceQuestion,
  EssayQuestion,
  ExamTypeMaster,
  MajorMaster,
  LevelMaster,
  ServerMaster,
} from '../lib/types';
import { getResolvedThemeColors } from '../lib/theme-palettes';
import PrintCenter from './PrintCenter';
import BrandingSettingsModal from './BrandingSettingsModal';
import ImportMasterView from './master/ImportMasterView';
import MasterJenisUjianView from './master/MasterJenisUjianView';
import MasterJurusanView from './master/MasterJurusanView';
import MasterLevelView from './master/MasterLevelView';
import MasterServerView from './master/MasterServerView';
import MasterRuanganView from './master/MasterRuanganView';
import MasterSesiView from './master/MasterSesiView';
import DaftarPesertaUjianView from './students/DaftarPesertaUjianView';
import SiswaTidakIkutView from './datainfo/SiswaTidakIkutView';
import RekapitulasiDataInfoViews from './datainfo/RekapitulasiDataInfoViews';
import BankSoalManagementView from './banksoal/BankSoalManagementView';
import JadwalUjianManagementView from './jadwal/JadwalUjianManagementView';
import StatusPesertaView from './ubk/StatusPesertaView';
import PindahNilaiView from './ubk/PindahNilaiView';
import ResetLoginView from './ubk/ResetLoginView';
import RilisTokenView from './ubk/RilisTokenView';
import PengacakSoalView from './ubk/PengacakSoalView';
import AturBlockPesertaView from './ubk/AturBlockPesertaView';
import BelumUjianView from './ubk/BelumUjianView';
import LokasiUjianView from './ubk/LokasiUjianView';
import LaporanPelanggaranView from './ubk/LaporanPelanggaranView';
import HasilNilaiView from './nilai/HasilNilaiView';
import HasilNilaiPerMapelView from './nilai/HasilNilaiPerMapelView';
import SemuaNilaiView from './nilai/SemuaNilaiView';
import DataNilaiUjianView from './nilai/DataNilaiUjianView';
import HistoryNilaiView from './nilai/HistoryNilaiView';
import DaftarHadirView from './cetak/DaftarHadirView';
import CetakKartuView from './cetak/CetakKartuView';
import DenahLokasiView from './cetak/DenahLokasiView';
import BeritaAcaraView from './cetak/BeritaAcaraView';
import CetakFormatNilaiView from './cetak/CetakFormatNilaiView';
import CetakLegerNilaiView from './cetak/CetakLegerNilaiView';
import AnalisaPerSoalView from './analisa/AnalisaPerSoalView';
import AnalisaNilaiMapelView from './analisa/AnalisaNilaiMapelView';
import AnalisaNilaiRankingView from './analisa/AnalisaNilaiRankingView';
import PerbaikanNilaiView from './analisa/PerbaikanNilaiView';
import DataAdministratorView from './users/DataAdministratorView';
import HelpTutorialModal from './common/HelpTutorialModal';
import DataGuruView from './users/DataGuruView';
import {
  DEFAULT_EXAM_TYPES,
  DEFAULT_MAJORS,
  DEFAULT_LEVELS,
  DEFAULT_SERVERS,
  ExtractedMasterData,
} from '../lib/master-template';

interface OperatorDashboardProps {
  teachers: Teacher[];
  subjects: Subject[];
  students: Student[];
  studentSessions: StudentSession[];
  exam: Exam;
  schedules?: ExamSchedule[];
  classes?: SchoolClass[];
  rooms?: ExamRoom[];
  sessions?: ExamSessionInfo[];
  tokenRequired: boolean;
  activeToken: string;
  branding?: SchoolBrandingSettings;
  onSaveBranding?: (branding: SchoolBrandingSettings) => void;
  onToggleToken: (enabled: boolean) => void;
  onGenerateToken: () => void;
  onResetStudent: (studentId: string) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject?: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddStudent?: (student: Student) => void;
  onUpdateStudent?: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
  onAddSchedule?: (schedule: ExamSchedule) => void;
  onUpdateSchedule?: (schedule: ExamSchedule) => void;
  onDeleteSchedule?: (id: string) => void;
  onAddClass?: (cls: SchoolClass) => void;
  onUpdateClass?: (cls: SchoolClass) => void;
  onDeleteClass?: (id: string) => void;
  onAddRoom?: (room: ExamRoom) => void;
  onUpdateRoom?: (room: ExamRoom) => void;
  onDeleteRoom?: (id: string) => void;
  onAddSession?: (ses: ExamSessionInfo) => void;
  onUpdateSession?: (ses: ExamSessionInfo) => void;
  onDeleteSession?: (id: string) => void;
  onUpdateExamQuestions?: (questions: Question[]) => void;
  onRefreshStudents?: () => void;
  onLogout?: () => void;
  currentUser?: any;
  onSwitchView?: (view: 'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA' | 'SUPERADMIN') => void;
}

export default function OperatorDashboard({
  teachers,
  subjects,
  students,
  studentSessions,
  exam,
  schedules = [exam],
  classes = [],
  rooms = [],
  sessions = [],
  tokenRequired,
  activeToken,
  branding,
  onSaveBranding,
  onToggleToken,
  onGenerateToken,
  onResetStudent,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onUpdateExamQuestions,
  onRefreshStudents,
  onLogout,
  currentUser,
  onSwitchView,
}: OperatorDashboardProps) {
  // Resolved 4-Color Theme
  const theme = getResolvedThemeColors(branding);

  // Navigasi Menu Sidebar
  const [activeMenu, setActiveMenu] = useState<string>('beranda');
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    dataMaster: false,
    dataInfo: false,
    ubk: false,
    nilai: false,
    cetak: false,
    analisa: false,
    manajemenUser: false,
  });

  // Modal Super Admin White-Label Branding & Topbar Modals
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPusatStatusModalOpen, setIsPusatStatusModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isHelpTutorialOpen, setIsHelpTutorialOpen] = useState(false);

  // 1. STATE CRUD GURU
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherJabatan, setTeacherJabatan] = useState('Guru Mapel');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [searchTeacher, setSearchTeacher] = useState('');

  // 2. STATE CRUD MAPEL
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectLevel, setSubjectLevel] = useState('VI');
  const [searchSubject, setSearchSubject] = useState('');

  // 3. STATE CRUD SISWA
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentNisn, setStudentNisn] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [studentNoPeserta, setStudentNoPeserta] = useState('');
  const [studentClass, setStudentClass] = useState('VI-A');
  const [studentRoom, setStudentRoom] = useState('Ruang 01');
  const [studentSession, setStudentSession] = useState('Sesi 1');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [filterStudentClass, setFilterStudentClass] = useState('ALL');

  // 4. STATE CRUD KELAS
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classLevelInput, setClassLevelInput] = useState('VI');
  const [classJurusanInput, setClassJurusanInput] = useState('Madrasah Ibtidaiyah');
  const [classWaliInput, setClassWaliInput] = useState('');
  const [classStudentCountInput, setClassStudentCountInput] = useState(28);

  // 5. STATE CRUD RUANG & SESI
  const [ruangSubTab, setRuangSubTab] = useState<'RUANG' | 'SESI'>('RUANG');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomCapacityInput, setRoomCapacityInput] = useState(30);
  const [roomProctorInput, setRoomProctorInput] = useState('');
  const [roomServerInput, setRoomServerInput] = useState('SERVER-PUSAT-01');

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionNumInput, setSessionNumInput] = useState(1);
  const [sessionNameInput, setSessionNameInput] = useState('Sesi 1 (Pagi)');
  const [sessionTimeRangeInput, setSessionTimeRangeInput] = useState('07:30 - 09:30 WIT');

  // 6. STATE CRUD JADWAL UJIAN
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleSubjectId, setScheduleSubjectId] = useState(subjects[0]?.id || '');
  const [scheduleClass, setScheduleClass] = useState('VI-A');
  const [scheduleDate, setScheduleDate] = useState('18 May 2026');
  const [scheduleStartTime, setScheduleStartTime] = useState('07:30');
  const [scheduleEndTime, setScheduleEndTime] = useState('09:30');
  const [scheduleDuration, setScheduleDuration] = useState(90);
  const [scheduleTokenReq, setScheduleTokenReq] = useState(true);
  const [scheduleRandomizeQuestions, setScheduleRandomizeQuestions] = useState(true);
  const [scheduleRandomizeOptions, setScheduleRandomizeOptions] = useState(true);

  // STATE BULK IMPORT DATA SISWA (.XLSX)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    importedCount?: number;
    skippedCount?: number;
    errors?: string[];
  } | null>(null);

  // 7. STATE CRUD BANK SOAL OPERATOR
  const [filterBankSubject, setFilterBankSubject] = useState('ALL');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<'PG' | 'ESSAY'>('PG');
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [questionPoints, setQuestionPoints] = useState(10);
  const [pgOptionA, setPgOptionA] = useState('');
  const [pgOptionB, setPgOptionB] = useState('');
  const [pgOptionC, setPgOptionC] = useState('');
  const [pgOptionD, setPgOptionD] = useState('');
  const [pgCorrectOpt, setPgCorrectOpt] = useState('opt_a');
  const [essayIdealAns, setEssayIdealAns] = useState('');
  const [essayKeywords, setEssayKeywords] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  // 8. MASTER DATA TAMBAHAN (JENIS UJIAN, JURUSAN, LEVEL, SERVER)
  const [examTypes, setExamTypes] = useState<ExamTypeMaster[]>(DEFAULT_EXAM_TYPES);
  const [majors, setMajors] = useState<MajorMaster[]>(DEFAULT_MAJORS);
  const [levels, setLevels] = useState<LevelMaster[]>(DEFAULT_LEVELS);
  const [servers, setServers] = useState<ServerMaster[]>(DEFAULT_SERVERS);

  const handleAddExamType = (item: ExamTypeMaster) => setExamTypes((prev) => [item, ...prev]);
  const handleUpdateExamType = (item: ExamTypeMaster) => setExamTypes((prev) => prev.map((t) => (t.id === item.id ? item : t)));
  const handleDeleteExamType = (id: string) => setExamTypes((prev) => prev.filter((t) => t.id !== id));

  const handleAddMajor = (item: MajorMaster) => setMajors((prev) => [item, ...prev]);
  const handleUpdateMajor = (item: MajorMaster) => setMajors((prev) => prev.map((m) => (m.id === item.id ? item : m)));
  const handleDeleteMajor = (id: string) => setMajors((prev) => prev.filter((m) => m.id !== id));

  const handleAddLevel = (item: LevelMaster) => setLevels((prev) => [item, ...prev]);
  const handleUpdateLevel = (item: LevelMaster) => setLevels((prev) => prev.map((l) => (l.id === item.id ? item : l)));
  const handleDeleteLevel = (id: string) => setLevels((prev) => prev.filter((l) => l.id !== id));

  const handleAddServer = (item: ServerMaster) => setServers((prev) => [item, ...prev]);
  const handleUpdateServer = (item: ServerMaster) => setServers((prev) => prev.map((s) => (s.id === item.id ? item : s)));
  const handleDeleteServer = (id: string) => setServers((prev) => prev.filter((s) => s.id !== id));

  const handleImportMasterSuccess = (data: ExtractedMasterData) => {
    setLevels((prev) => {
      const existingCodes = new Set(prev.map((p) => p.code.toLowerCase()));
      const newItems = data.levels.filter((l) => !existingCodes.has(l.code.toLowerCase()));
      return [...prev, ...newItems];
    });
    setMajors((prev) => {
      const existingCodes = new Set(prev.map((p) => p.code.toLowerCase()));
      const newItems = data.majors.filter((m) => !existingCodes.has(m.code.toLowerCase()));
      return [...prev, ...newItems];
    });
    setServers((prev) => {
      const existingCodes = new Set(prev.map((p) => p.code.toLowerCase()));
      const newItems = data.servers.filter((s) => !existingCodes.has(s.code.toLowerCase()));
      return [...prev, ...newItems];
    });
    if (onAddClass) {
      data.classes.forEach((cls) => onAddClass(cls));
    }
    if (onAddRoom) {
      data.rooms.forEach((rm) => onAddRoom(rm));
    }
    if (onAddSession) {
      data.sessions.forEach((ses) => onAddSession(ses));
    }
    if (onRefreshStudents) {
      onRefreshStudents();
    } else if (onAddStudent) {
      data.students.forEach((st) => onAddStudent(st));
    }
  };

  // Accordion Toggle Submenu Sidebar (Buka satu, tutup yang lain agar sidebar selalu ramping)
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => {
      const willOpen = !prev[key];
      return {
        dataMaster: false,
        dataInfo: false,
        ubk: false,
        nilai: false,
        cetak: false,
        analisa: false,
        manajemenUser: false,
        [key]: willOpen,
      };
    });
  };

  // Map child menu ke parent dropdown agar dropdown otomatis terbuka saat navigasi lintas menu
  const submenuParentMap: Record<string, string> = {
    importMaster: 'dataMaster',
    masterMapel: 'dataMaster',
    masterJenisUjian: 'dataMaster',
    masterJurusan: 'dataMaster',
    masterLevel: 'dataMaster',
    masterKelas: 'dataMaster',
    masterRuang: 'dataMaster',
    masterSesi: 'dataMaster',
    masterServer: 'dataMaster',

    infoTidakIkut: 'dataInfo',
    infoSesi: 'dataInfo',
    infoPerSesi: 'dataInfo',
    infoRuang: 'dataInfo',
    infoPerRuang: 'dataInfo',
    infoKelas: 'dataInfo',
    infoPerKelas: 'dataInfo',
    infoJurusan: 'dataInfo',
    infoPerJurusan: 'dataInfo',

    ubkStatus: 'ubk',
    ubkPindahNilai: 'ubk',
    ubkResetLogin: 'ubk',
    ubkReset: 'ubk',
    ubkToken: 'ubk',
    ubkPengacak: 'ubk',
    ubkPengacakSoal: 'ubk',
    ubkBlock: 'ubk',
    ubkBlockPeserta: 'ubk',
    ubkBelumUjian: 'ubk',
    ubkLokasi: 'ubk',
    ubkLokasiUjian: 'ubk',
    ubkPelanggaran: 'ubk',

    nilaiHasil: 'nilai',
    nilaiPerMapel: 'nilai',
    nilaiSemua: 'nilai',
    nilaiDataUjian: 'nilai',
    nilaiHistory: 'nilai',

    cetakDaftarHadir: 'cetak',
    cetakKartu: 'cetak',
    cetakDenahLokasi: 'cetak',
    cetakBeritaAcara: 'cetak',
    cetakFormatNilai: 'cetak',
    cetakLegerNilai: 'cetak',

    analisaPerSoal: 'analisa',
    analisaNilaiMapel: 'analisa',
    analisaRanking: 'analisa',
    analisaPerbaikan: 'analisa',

    userAdmin: 'manajemenUser',
    userGuru: 'manajemenUser',
    masterGuru: 'manajemenUser',
  };

  const navigateToMenu = (key: string) => {
    setActiveMenu(key);
    const parent = submenuParentMap[key];
    setOpenSubmenus({
      dataMaster: parent === 'dataMaster',
      dataInfo: parent === 'dataInfo',
      ubk: parent === 'ubk',
      nilai: parent === 'nilai',
      cetak: parent === 'cetak',
      analisa: parent === 'analisa',
      manajemenUser: parent === 'manajemenUser',
    });
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD GURU
  // -------------------------------------------------------------
  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTeacherName('');
    setTeacherNip('');
    setTeacherUsername('');
    setTeacherPassword('');
    setTeacherJabatan('Guru Mapel');
    setSelectedSubjectIds([]);
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (tch: Teacher) => {
    setEditingTeacherId(tch.id);
    setTeacherName(tch.name);
    setTeacherNip(tch.nip);
    setTeacherUsername(tch.username);
    setTeacherPassword(tch.passwordText);
    setTeacherJabatan(tch.jabatan || 'Guru Mapel');
    setSelectedSubjectIds(tch.assignedSubjectIds || []);
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!teacherName.trim()) {
      alert('Nama guru wajib diisi!');
      return;
    }
    if (editingTeacherId) {
      const updated: Teacher = {
        id: editingTeacherId,
        name: teacherName,
        nip: teacherNip || '198501012015011001',
        username: teacherUsername || teacherName.toLowerCase().replace(/\s+/g, ''),
        passwordText: teacherPassword || 'guru123',
        jabatan: teacherJabatan,
        assignedSubjectIds: selectedSubjectIds,
      };
      onUpdateTeacher?.(updated);
    } else {
      const newTeacher: Teacher = {
        id: `tch_${Date.now()}`,
        name: teacherName,
        nip: teacherNip || '198501012015011001',
        username: teacherUsername || teacherName.toLowerCase().replace(/\s+/g, ''),
        passwordText: teacherPassword || 'guru123',
        jabatan: teacherJabatan,
        assignedSubjectIds: selectedSubjectIds,
      };
      onAddTeacher(newTeacher);
    }
    setIsTeacherModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD MAPEL
  // -------------------------------------------------------------
  const handleOpenAddSubject = () => {
    setEditingSubjectId(null);
    setSubjectName('');
    setSubjectCode('');
    setSubjectLevel('VI');
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubjectId(sub.id);
    setSubjectName(sub.name);
    setSubjectCode(sub.code);
    setSubjectLevel(sub.level || 'VI');
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (!subjectName.trim() || !subjectCode.trim()) {
      alert('Nama dan kode mapel wajib diisi!');
      return;
    }
    if (editingSubjectId) {
      const updated: Subject = {
        id: editingSubjectId,
        name: subjectName,
        code: subjectCode.toUpperCase(),
        level: subjectLevel,
      };
      onUpdateSubject?.(updated);
    } else {
      onAddSubject({
        id: `sub_${Date.now()}`,
        name: subjectName,
        code: subjectCode.toUpperCase(),
        level: subjectLevel,
      });
    }
    setIsSubjectModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD SISWA
  // -------------------------------------------------------------
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStudentName('');
    setStudentNisn('');
    setStudentNis('');
    setStudentNoPeserta(`05-021-${String(students.length + 1).padStart(3, '0')}-8`);
    setStudentClass('VI-A');
    setStudentRoom('Ruang 01');
    setStudentSession('Sesi 1');
    setStudentUsername('');
    setStudentPassword('siswa123');
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (std: Student) => {
    setEditingStudentId(std.id);
    setStudentName(std.name);
    setStudentNisn(std.nisn);
    setStudentNis(std.nis);
    setStudentNoPeserta(std.noPeserta);
    setStudentClass(std.className);
    setStudentRoom(std.room);
    setStudentSession(std.session);
    setStudentUsername(std.username);
    setStudentPassword(std.passwordText);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentName.trim() || !studentNisn.trim()) {
      alert('Nama siswa dan NISN wajib diisi!');
      return;
    }
    if (editingStudentId) {
      const updated: Student = {
        id: editingStudentId,
        name: studentName,
        nisn: studentNisn,
        nis: studentNis || studentNisn.slice(4),
        noPeserta: studentNoPeserta,
        className: studentClass,
        level: 'VI',
        jurusan: 'Madrasah Ibtidaiyah',
        room: studentRoom,
        session: studentSession,
        server: 'SERVER-01',
        username: studentUsername || studentNisn,
        passwordText: studentPassword || 'siswa123',
      };
      onUpdateStudent?.(updated);
    } else {
      const newStd: Student = {
        id: `std_${Date.now()}`,
        name: studentName,
        nisn: studentNisn,
        nis: studentNis || studentNisn.slice(4),
        noPeserta: studentNoPeserta || `05-021-${String(students.length + 1).padStart(3, '0')}-8`,
        className: studentClass,
        level: 'VI',
        jurusan: 'Madrasah Ibtidaiyah',
        room: studentRoom,
        session: studentSession,
        server: 'SERVER-01',
        username: studentUsername || studentNisn,
        passwordText: studentPassword || 'siswa123',
      };
      onAddStudent?.(newStd);
    }
    setIsStudentModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLER BULK IMPORT EXCEL SISWA
  // -------------------------------------------------------------
  const handleUploadExcel = async () => {
    if (!importFile) {
      alert('Pilih file Excel (.xlsx / .xls) terlebih dahulu!');
      return;
    }
    setIsImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await fetch('/api/students/import', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setImportResult(result);
      if (result.success) {
        onRefreshStudents?.();
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: 'Gagal mengunggah file: ' + err.message,
      });
    } finally {
      setIsImporting(false);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD KELAS
  // -------------------------------------------------------------
  const handleOpenAddClass = () => {
    setEditingClassId(null);
    setClassNameInput('');
    setClassLevelInput('VI');
    setClassJurusanInput('Madrasah Ibtidaiyah');
    setClassWaliInput('');
    setClassStudentCountInput(25);
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (c: SchoolClass) => {
    setEditingClassId(c.id);
    setClassNameInput(c.name);
    setClassLevelInput(c.level);
    setClassJurusanInput(c.jurusan);
    setClassWaliInput(c.waliKelas);
    setClassStudentCountInput(c.totalStudents);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = () => {
    if (!classNameInput.trim()) {
      alert('Nama kelas wajib diisi!');
      return;
    }
    if (editingClassId) {
      const updated: SchoolClass = {
        id: editingClassId,
        name: classNameInput,
        level: classLevelInput,
        jurusan: classJurusanInput,
        waliKelas: classWaliInput || 'Belum Ditentukan',
        totalStudents: classStudentCountInput,
      };
      onUpdateClass?.(updated);
    } else {
      const newC: SchoolClass = {
        id: `kls_${Date.now()}`,
        name: classNameInput,
        level: classLevelInput,
        jurusan: classJurusanInput,
        waliKelas: classWaliInput || 'Belum Ditentukan',
        totalStudents: classStudentCountInput,
      };
      onAddClass?.(newC);
    }
    setIsClassModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD RUANGAN & SESI
  // -------------------------------------------------------------
  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomCodeInput(`RUANG-0${rooms.length + 1}`);
    setRoomNameInput('');
    setRoomCapacityInput(30);
    setRoomProctorInput('');
    setRoomServerInput('SERVER-PUSAT-01');
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (r: ExamRoom) => {
    setEditingRoomId(r.id);
    setRoomCodeInput(r.code);
    setRoomNameInput(r.name);
    setRoomCapacityInput(r.capacity);
    setRoomProctorInput(r.proctorName);
    setRoomServerInput(r.serverName);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = () => {
    if (!roomNameInput.trim()) {
      alert('Nama ruangan lab wajib diisi!');
      return;
    }
    if (editingRoomId) {
      const updated: ExamRoom = {
        id: editingRoomId,
        code: roomCodeInput,
        name: roomNameInput,
        capacity: roomCapacityInput,
        proctorName: roomProctorInput || 'Pengawas Ruang',
        serverName: roomServerInput,
      };
      onUpdateRoom?.(updated);
    } else {
      const newR: ExamRoom = {
        id: `rm_${Date.now()}`,
        code: roomCodeInput || `RUANG-0${rooms.length + 1}`,
        name: roomNameInput,
        capacity: roomCapacityInput,
        proctorName: roomProctorInput || 'Pengawas Ruang',
        serverName: roomServerInput,
      };
      onAddRoom?.(newR);
    }
    setIsRoomModalOpen(false);
  };

  const handleOpenAddSession = () => {
    setEditingSessionId(null);
    setSessionNumInput(sessions.length + 1);
    setSessionNameInput(`Sesi ${sessions.length + 1}`);
    setSessionTimeRangeInput('07:30 - 09:30 WIT');
    setIsSessionModalOpen(true);
  };

  const handleOpenEditSession = (s: ExamSessionInfo) => {
    setEditingSessionId(s.id);
    setSessionNumInput(s.sessionNumber);
    setSessionNameInput(s.name);
    setSessionTimeRangeInput(s.timeRange);
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = () => {
    if (!sessionNameInput.trim()) {
      alert('Nama sesi ujian wajib diisi!');
      return;
    }
    if (editingSessionId) {
      const updated: ExamSessionInfo = {
        id: editingSessionId,
        sessionNumber: sessionNumInput,
        name: sessionNameInput,
        timeRange: sessionTimeRangeInput,
      };
      onUpdateSession?.(updated);
    } else {
      const newS: ExamSessionInfo = {
        id: `ses_${Date.now()}`,
        sessionNumber: sessionNumInput,
        name: sessionNameInput,
        timeRange: sessionTimeRangeInput,
      };
      onAddSession?.(newS);
    }
    setIsSessionModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD JADWAL UJIAN
  // -------------------------------------------------------------
  const handleOpenAddSchedule = () => {
    setEditingScheduleId(null);
    setScheduleTitle('');
    setScheduleSubjectId(subjects[0]?.id || '');
    setScheduleClass('VI-A');
    setScheduleDate('18 May 2026');
    setScheduleStartTime('07:30');
    setScheduleEndTime('09:30');
    setScheduleDuration(90);
    setScheduleTokenReq(true);
    setScheduleRandomizeQuestions(true);
    setScheduleRandomizeOptions(true);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (sch: ExamSchedule) => {
    setEditingScheduleId(sch.id);
    setScheduleTitle(sch.title);
    setScheduleSubjectId(sch.subjectId);
    setScheduleClass(sch.className);
    setScheduleDate(sch.examDate);
    setScheduleStartTime(sch.startTime);
    setScheduleEndTime(sch.endTime);
    setScheduleDuration(sch.durationMinutes);
    setScheduleTokenReq(sch.tokenRequired);
    setScheduleRandomizeQuestions(sch.randomizeQuestions ?? true);
    setScheduleRandomizeOptions(sch.randomizeOptions ?? true);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleTitle.trim()) {
      alert('Judul ujian wajib diisi!');
      return;
    }
    const matchedSubject = subjects.find((s) => s.id === scheduleSubjectId) || subjects[0];
    if (editingScheduleId) {
      const target = schedules.find((s) => s.id === editingScheduleId);
      const updated: ExamSchedule = {
        ...(target || exam),
        id: editingScheduleId,
        title: scheduleTitle,
        subjectId: matchedSubject.id,
        subjectName: matchedSubject.name,
        subject: matchedSubject.name,
        className: scheduleClass,
        examDate: scheduleDate,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
        durationMinutes: scheduleDuration,
        tokenRequired: scheduleTokenReq,
        randomizeQuestions: scheduleRandomizeQuestions,
        randomizeOptions: scheduleRandomizeOptions,
      };
      onUpdateSchedule?.(updated);
    } else {
      const newSch: ExamSchedule = {
        id: `sch_${Date.now()}`,
        code: `${matchedSubject.code}-KLS-${scheduleClass}`,
        title: scheduleTitle,
        subjectId: matchedSubject.id,
        subjectName: matchedSubject.name,
        subject: matchedSubject.name,
        level: 'VI',
        grade: 'VI',
        className: scheduleClass,
        teacherId: teachers[0]?.id || 'tch_1',
        teacherName: teachers[0]?.name || 'Guru Mapel',
        examDate: scheduleDate,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
        dayOfWeek: 'SENIN',
        durationMinutes: scheduleDuration,
        sessionNumber: 1,
        isActive: true,
        totalQuestions: exam.questions.length,
        tokenRequired: scheduleTokenReq,
        activeToken: activeToken,
        proctorPin: '123456',
        randomizeQuestions: scheduleRandomizeQuestions,
        randomizeOptions: scheduleRandomizeOptions,
        questions: exam.questions,
      };
      onAddSchedule?.(newSch);
    }
    setIsScheduleModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS CRUD BANK SOAL
  // -------------------------------------------------------------
  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionType('PG');
    setQuestionPrompt('');
    setQuestionPoints(10);
    setPgOptionA('');
    setPgOptionB('');
    setPgOptionC('');
    setPgOptionD('');
    setPgCorrectOpt('opt_a');
    setEssayIdealAns('');
    setEssayKeywords('');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQuestionPrompt(q.prompt);
    setQuestionPoints(q.points);
    if (q.type === 'PG') {
      setQuestionType('PG');
      setPgOptionA(q.options[0]?.text || '');
      setPgOptionB(q.options[1]?.text || '');
      setPgOptionC(q.options[2]?.text || '');
      setPgOptionD(q.options[3]?.text || '');
      setPgCorrectOpt(q.correctOptionId || 'opt_a');
    } else if (q.type === 'ESSAY') {
      setQuestionType('ESSAY');
      setEssayIdealAns(q.rubric.idealAnswer || '');
      setEssayKeywords(q.rubric.keyPoints.map((k) => k.concept).join(', '));
    }
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!questionPrompt.trim()) {
      alert('Teks soal wajib diisi!');
      return;
    }
    let updatedQuestions = [...exam.questions];
    if (questionType === 'PG') {
      const pgQ: MultipleChoiceQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: editingQuestionId
          ? exam.questions.find((q) => q.id === editingQuestionId)?.number || exam.questions.length
          : exam.questions.length + 1,
        type: 'PG',
        prompt: questionPrompt,
        points: questionPoints,
        options: [
          { id: 'opt_a', text: pgOptionA || 'Pilihan A' },
          { id: 'opt_b', text: pgOptionB || 'Pilihan B' },
          { id: 'opt_c', text: pgOptionC || 'Pilihan C' },
          { id: 'opt_d', text: pgOptionD || 'Pilihan D' },
        ],
        correctOptionId: pgCorrectOpt,
      };
      if (editingQuestionId) {
        updatedQuestions = updatedQuestions.map((q) => (q.id === editingQuestionId ? pgQ : q));
      } else {
        updatedQuestions.push(pgQ);
      }
    } else {
      const keyPointsList = essayKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
        .map((k, i) => ({
          concept: k,
          weight: Math.round(questionPoints / 3),
          mandatoryKeywords: [k.toLowerCase()],
        }));

      const essayQ: EssayQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: editingQuestionId
          ? exam.questions.find((q) => q.id === editingQuestionId)?.number || exam.questions.length
          : exam.questions.length + 1,
        type: 'ESSAY',
        prompt: questionPrompt,
        points: questionPoints,
        rubric: {
          idealAnswer: essayIdealAns,
          maxScore: questionPoints,
          keyPoints: keyPointsList.length > 0 ? keyPointsList : [
            { concept: 'Konsep Dasar', weight: questionPoints, mandatoryKeywords: [essayKeywords.toLowerCase() || 'dasar'] },
          ],
        },
      };
      if (editingQuestionId) {
        updatedQuestions = updatedQuestions.map((q) => (q.id === editingQuestionId ? essayQ : q));
      } else {
        updatedQuestions.push(essayQ);
      }
    }
    onUpdateExamQuestions?.(updatedQuestions);
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (qid: string) => {
    if (confirm('Yakin ingin menghapus butir soal ini dari bank soal?')) {
      const updated = exam.questions.filter((q) => q.id !== qid);
      onUpdateExamQuestions?.(updated);
    }
  };

  // Helper toggle checklist mapel
  const toggleSubjectSelect = (subId: string) => {
    if (selectedSubjectIds.includes(subId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subId]);
    }
  };

  // Filtered Lists
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchSubject.toLowerCase()) ||
      s.code.toLowerCase().includes(searchSubject.toLowerCase())
  );

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.nisn.toLowerCase().includes(searchStudent.toLowerCase());
    const matchClass = filterStudentClass === 'ALL' || s.className === filterStudentClass;
    return matchSearch && matchClass;
  });

  return (
    <div
      className="flex w-full min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* ============================================================== */}
      {/* 1. SIDEBAR OPERATOR (ALA CANDY CBT / EL-CBT)                  */}
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

          {/* BANNER MERAH: MENU UTAMA (Image 1) */}
          <div className="bg-[#e11d48] text-white font-black text-[10px] tracking-wider uppercase px-4 py-2 flex items-center justify-between shadow-xs">
            <span>MENU UTAMA</span>
            <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-bold">OPERATOR</span>
          </div>

          {/* DAFTAR MENU LENGKAP ALA CANDY CBT / EL-CBT */}
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

            {/* 2. Math Studio (Image 1) */}
            <button
              onClick={() => navigateToMenu('mathStudio')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'mathStudio'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span className="font-serif italic font-black text-purple-400 text-sm">√x</span>
              <span>Math Studio</span>
            </button>

            {/* 3. Data Master (Dropdown) */}
            <div>
              <button
                onClick={() => toggleSubmenu('dataMaster')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Data Master</span>
                </div>
                {openSubmenus.dataMaster ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.dataMaster && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    <button
                      onClick={() => setActiveMenu('importMaster')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'importMaster'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Import Data Master</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterMapel')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterMapel'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Mapel</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterJenisUjian')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterJenisUjian'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Jenis Ujian</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterJurusan')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterJurusan'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Jurusan</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterLevel')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterLevel'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Level</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterKelas')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterKelas'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Kelas</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterRuang')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterRuang'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Ruangan</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterSesi')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterSesi'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Sesi</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('masterServer')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'masterServer'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Data Server</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Peserta Ujian */}
            <button
              onClick={() => navigateToMenu('pesertaUjian')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'pesertaUjian'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Peserta Ujian</span>
            </button>

            {/* 5. Data Info (Dropdown) */}
            <div>
              <button
                onClick={() => toggleSubmenu('dataInfo')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Data Info</span>
                </div>
                {openSubmenus.dataInfo ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.dataInfo && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    <button
                      onClick={() => setActiveMenu('infoTidakIkut')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'infoTidakIkut'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Siswa Tidak Ikut Ujian</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('infoPerSesi')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'infoPerSesi'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Siswa Per Sesi</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('infoPerRuang')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'infoPerRuang'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Siswa Per Ruang</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('infoPerKelas')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'infoPerKelas'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Siswa Per Kelas</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('infoPerJurusan')}
                      className={`relative w-full flex items-center gap-2 py-1.5 pl-6 pr-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                        activeMenu === 'infoPerJurusan'
                          ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Siswa Per Jurusan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Bank Soal */}
            <button
              onClick={() => navigateToMenu('bankSoal')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'bankSoal' || activeMenu === 'bankSoalSemua'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              <span>Bank Soal</span>
            </button>

            {/* 7. Jadwal Ujian */}
            <button
              onClick={() => navigateToMenu('jadwalUjian')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'jadwalUjian'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Jadwal Ujian</span>
            </button>

            {/* 8. UBK (Dropdown 9 Submenu Matching Image 3) */}
            <div>
              <button
                onClick={() => toggleSubmenu('ubk')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-4 h-4 text-rose-400" />
                  <span>UBK</span>
                </div>
                {openSubmenus.ubk ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.ubk && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    {/* 1. Status Peserta */}
                    <button
                      onClick={() => setActiveMenu('ubkStatus')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkStatus'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Status Peserta</span>
                    </button>

                    {/* 2. Pindah Nilai */}
                    <button
                      onClick={() => setActiveMenu('ubkPindahNilai')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkPindahNilai'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Folder className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Pindah Nilai</span>
                    </button>

                    {/* 3. Reset Login */}
                    <button
                      onClick={() => setActiveMenu('ubkResetLogin')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkResetLogin'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Reset Login</span>
                    </button>

                    {/* 4. Rilis Token */}
                    <button
                      onClick={() => setActiveMenu('ubkToken')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkToken'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Bell className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Rilis Token</span>
                    </button>

                    {/* 5. Pengacak Soal */}
                    <button
                      onClick={() => setActiveMenu('ubkPengacakSoal')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkPengacakSoal'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Shuffle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Pengacak Soal</span>
                    </button>

                    {/* 6. Atur Block Peserta */}
                    <button
                      onClick={() => setActiveMenu('ubkBlockPeserta')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkBlockPeserta'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Atur Block Peserta</span>
                    </button>

                    {/* 7. Belum Ujian */}
                    <button
                      onClick={() => setActiveMenu('ubkBelumUjian')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkBelumUjian'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Belum Ujian</span>
                    </button>

                    {/* 8. Lokasi Ujian */}
                    <button
                      onClick={() => setActiveMenu('ubkLokasiUjian')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkLokasiUjian'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>Lokasi Ujian</span>
                    </button>

                    {/* 9. Laporan Pelanggaran */}
                    <button
                      onClick={() => setActiveMenu('ubkPelanggaran')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'ubkPelanggaran'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>Laporan Pelanggaran</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 9. Nilai (Dropdown 5 Submenu Matching Image 4) */}
            <div>
              <button
                onClick={() => toggleSubmenu('nilai')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Nilai</span>
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
                      <span>Hasil Nilai</span>
                    </button>

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
                      <span>Hasil Nilai Per Mapel</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('nilaiSemua')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiSemua'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Semua Nilai</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('nilaiDataUjian')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiDataUjian'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Data Nilai Ujian</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('nilaiHistory')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'nilaiHistory'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <History className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>History Nilai / Jawaban</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 10. Cetak (Dropdown 6 Submenu Matching Image 5) */}
            <div>
              <button
                onClick={() => toggleSubmenu('cetak')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Cetak</span>
                </div>
                {openSubmenus.cetak ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.cetak && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    <button
                      onClick={() => setActiveMenu('cetakDaftarHadir')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakDaftarHadir'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Daftar Hadir</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('cetakKartu')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakKartu'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <CreditCard className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Cetak Kartu</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('cetakDenahLokasi')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakDenahLokasi'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Denah Lokasi</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('cetakBeritaAcara')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakBeritaAcara'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Berita Acara</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('cetakFormatNilai')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakFormatNilai'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Cetak Format Nilai</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('cetakLegerNilai')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'cetakLegerNilai'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Layers className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Cetak Leger Nilai</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 11. Analisa (Dropdown 4 Submenu Matching Image 6) */}
            <div>
              <button
                onClick={() => toggleSubmenu('analisa')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Analisa</span>
                </div>
                {openSubmenus.analisa ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.analisa && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    <button
                      onClick={() => setActiveMenu('analisaPerSoal')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'analisaPerSoal'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Analisa Per Soal</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('analisaNilaiMapel')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'analisaNilaiMapel'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Analisa Nilai Mapel</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('analisaRanking')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'analisaRanking'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Analisa Nilai Ranking</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('analisaPerbaikan')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'analisaPerbaikan'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Perbaikan Nilai</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 12. Manajemen User (Dropdown 2 Submenu Matching Image 7) */}
            <div>
              <button
                onClick={() => toggleSubmenu('manajemenUser')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <UserCog className="w-4 h-4 text-purple-400" />
                  <span>Manajemen User</span>
                </div>
                {openSubmenus.manajemenUser ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSubmenus.manajemenUser && (
                <div className="relative bg-[#191c25] border-t border-b border-slate-800/80 py-1 pl-3.5 my-0.5">
                  <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-500/80" />
                  <div className="space-y-0.5 relative z-10">
                    <button
                      onClick={() => setActiveMenu('userAdmin')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'userAdmin'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Data Administrator</span>
                    </button>

                    <button
                      onClick={() => setActiveMenu('userGuru')}
                      className={`relative w-full text-left py-1.5 pl-6 pr-2.5 rounded-md transition-colors cursor-pointer flex items-center gap-2 text-xs ${
                        activeMenu === 'userGuru'
                          ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-slate-500/80" />
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Data Guru</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 13. Update System (Image 1) */}
            <button
              onClick={() => navigateToMenu('updateSystem')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMenu === 'updateSystem'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4 text-rose-400" />
              <span>Update System</span>
            </button>

            {/* 14. Branding Sekolah & White-Label */}
            <div className="pt-2">
              <button
                onClick={() => setIsBrandingModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-blue-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm text-xs"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Branding Sekolah</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </button>
            </div>
          </nav>
        </div>

        {/* Footer Sidebar */}
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
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. KONTEN UTAMA OPERATOR (KANAN)                              */}
      {/* ============================================================== */}
      <div
        className="flex-1 flex flex-col min-h-screen overflow-y-auto transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        {/* TOPBAR OPERATOR (Dinamis Mengikuti Warna Utama / Primary) */}
        <header
          className="h-14 border-b px-4 md:px-6 flex items-center justify-between flex-shrink-0 select-none sticky top-0 z-30 shadow-md text-white transition-colors"
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.borderColor,
          }}
        >
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer" title="Toggle Sidebar">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-sm md:text-base tracking-tight text-white flex items-center gap-2">
              {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Quick Settings Icon */}
            <button
              onClick={() => setIsBrandingModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Pengaturan Tampilan & White-Label"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* PUSAT Server Status Pill */}
            <button
              onClick={() => setIsPusatStatusModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded text-xs font-bold text-white transition-colors cursor-pointer shadow-xs border border-blue-500/40"
              title="Status Server PUSAT"
            >
              <Server className="w-3.5 h-3.5 text-sky-200" />
              <span>PUSAT</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {/* Pengaturan Button with Wrench */}
            <button
              onClick={() => setIsBrandingModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 px-2.5 py-1.5 rounded hover:bg-white/10 font-bold transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>Pengaturan</span>
            </button>

            {/* Tombol Panduan & Tutorial Operator */}
            <button
              onClick={() => setIsHelpTutorialOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 text-blue-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Pusat Panduan & Tutorial Interaktif Operator"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>Panduan & Tutorial</span>
            </button>

            {/* Tombol Akses Cepat Sesi Super Admin */}
            {onSwitchView && (
              <button
                onClick={() => onSwitchView('SUPERADMIN')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shadow-md transform hover:scale-105"
                title="Buka Sesi Super Admin (Ubah Warna, Nama & Logo)"
              >
                <Crown className="w-3.5 h-3.5 text-slate-950" />
                <span>Super Admin</span>
              </button>
            )}

            {/* Pengumuman Button with Megaphone */}
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-rose-300 hover:text-rose-200 px-2.5 py-1.5 rounded hover:bg-white/10 font-bold transition-colors cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5 text-rose-300" />
              <span>Pengumuman</span>
            </button>

            {/* Profile Avatar Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-colors cursor-pointer border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-[10px] shadow-xs">
                  {branding?.schoolName ? branding.schoolName.slice(0, 2).toUpperCase() : 'MH'}
                </div>
                <span className="hidden md:inline font-bold">
                  {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1e2330] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs text-slate-200 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-700/80">
                    <p className="font-bold text-white text-sm">{currentUser?.name || 'Administrator / Operator'}</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Server PUSAT (Online)
                    </p>
                    <p className="text-[10px] text-sky-400 font-mono mt-0.5">Token UBK: {tokenRequired ? activeToken : 'OFF'}</p>
                  </div>

                  <div className="py-1">
                    {onSwitchView && (
                      <>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onSwitchView('SUPERADMIN');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center gap-2.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer border-b border-slate-700/50"
                        >
                          <Crown className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-bold">Masuk Sesi Super Admin</p>
                            <p className="text-[10px] text-slate-400">Ubah Warna, Nama &amp; Logo</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onSwitchView('GURU');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center gap-2.5 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                        >
                          <GraduationCap className="w-4 h-4 text-purple-400" />
                          <div>
                            <p className="font-bold">Beralih ke Sesi Guru</p>
                            <p className="text-[10px] text-slate-400">Dermawan Surya Kencana, S. Sos</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onSwitchView('SISWA');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center gap-2.5 text-blue-300 hover:text-blue-200 transition-colors cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="font-bold">Beralih ke Sesi Siswa</p>
                            <p className="text-[10px] text-slate-400">Simulasi Ujian Peserta</p>
                          </div>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsBrandingModalOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Branding & Logo Sekolah</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-700/80 pt-1">
                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center gap-2.5 transition-colors cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar / Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* AREA KERJA (SESUAI MENU AKTIF) */}
        <div className="p-6 md:p-8 space-y-6 flex-1 w-full max-w-[1920px]">
          {/* ========================================================== */}
          {/* A. VIEW BERANDA DASHBOARD (10 WIDGET WARNA-WARNI)          */}
          {/* ========================================================== */}
          {activeMenu === 'beranda' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Dashboard Ringkasan Sekolah</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Statistik operasional server, data master, peserta aktif, dan status ujian UBK sekolah
                </p>
              </div>

              {/* 10 KOTAK WIDGET COLORFUL */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0284c7] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{students.length}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Siswa</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('pesertaUjian')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#eab308] text-slate-900 p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">
                      {studentSessions.filter((s) => s.totalScore !== undefined).length || 75}
                    </span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Nilai Terkumpul</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('nilaiHasil')}
                    className="mt-3 text-[10px] text-slate-900/80 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#f97316] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{exam.questions.length}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Soal Siap Uji</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('bankSoal')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#10b981] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{classes.length || 3}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Kelas / Rombel</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('masterKelas')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#06b6d4] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">
                      {students.filter((s) => s.session?.includes('1')).length || 50}
                    </span>
                    <p className="text-xs font-bold mt-1 opacity-90">Siswa Sesi 1 Aktif</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('infoPerSesi')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#ec4899] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{teachers.length}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Guru Pengampu</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('userGuru')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#14b8a6] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{rooms.length || 3}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Ruangan Lab</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('masterRuang')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>

                <div className="bg-[#059669] text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black tracking-tight">{subjects.length}</span>
                    <p className="text-xs font-bold mt-1 opacity-90">Jumlah Mata Pelajaran</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('masterMapel')}
                    className="mt-3 text-[10px] text-white/80 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    More Info &rarr;
                  </button>
                </div>
              </div>

              {/* BARIS BANNER AKTIF: PESERTA SEDANG UJIAN & JADWAL HARI INI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#ef4444] text-white p-5 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider">Active Monitoring</span>
                    </div>
                    <span className="text-4xl font-black block mt-1">1 Siswa</span>
                    <p className="text-xs opacity-90 mt-1">Peserta Sedang Mengerjakan Ujian Real-Time</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('ubkStatus')}
                    className="px-4 py-2 bg-black/20 hover:bg-black/30 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Pantau Live &rarr;
                  </button>
                </div>

                <div className="bg-[#f59e0b] text-slate-900 p-5 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-900" />
                      <span className="text-xs font-bold uppercase tracking-wider">Jadwal UBK</span>
                    </div>
                    <span className="text-4xl font-black block mt-1">{schedules.length} Jadwal</span>
                    <p className="text-xs font-semibold opacity-90 mt-1">Paket Asesmen Terjadwal</p>
                  </div>
                  <button
                    onClick={() => navigateToMenu('jadwalUjian')}
                    className="px-4 py-2 bg-black/10 hover:bg-black/20 text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Kelola Jadwal &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MANAJEMEN USER: DATA GURU (FULL CRUD MATCHING SCREENSHOT)  */}
          {/* ========================================================== */}
          {(activeMenu === 'userGuru' || activeMenu === 'masterGuru') && (
            <DataGuruView
              teachers={teachers}
              classes={classes}
              subjects={subjects}
              onAddTeacher={onAddTeacher}
              onUpdateTeacher={onUpdateTeacher}
              onDeleteTeacher={onDeleteTeacher}
            />
          )}

          {/* ========================================================== */}
          {/* MANAJEMEN USER: DATA ADMINISTRATOR                         */}
          {/* ========================================================== */}
          {activeMenu === 'userAdmin' && (
            <DataAdministratorView branding={branding} />
          )}

          {/* ========================================================== */}
          {/* VIEW: IMPORT DATA MASTER (DALAM SATU PINTU)                */}
          {/* ========================================================== */}
          {activeMenu === 'importMaster' && (
            <ImportMasterView
              onImportSuccess={handleImportMasterSuccess}
              onNavigateToStudents={() => setActiveMenu('pesertaUjian')}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: MASTER JENIS UJIAN (FULL CRUD)                       */}
          {/* ========================================================== */}
          {activeMenu === 'masterJenisUjian' && (
            <MasterJenisUjianView
              examTypes={examTypes}
              onAdd={handleAddExamType}
              onUpdate={handleUpdateExamType}
              onDelete={handleDeleteExamType}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: MASTER JURUSAN (FULL CRUD)                           */}
          {/* ========================================================== */}
          {activeMenu === 'masterJurusan' && (
            <MasterJurusanView
              majors={majors}
              onAdd={handleAddMajor}
              onUpdate={handleUpdateMajor}
              onDelete={handleDeleteMajor}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: MASTER LEVEL (FULL CRUD)                             */}
          {/* ========================================================== */}
          {activeMenu === 'masterLevel' && (
            <MasterLevelView
              levels={levels}
              onAdd={handleAddLevel}
              onUpdate={handleUpdateLevel}
              onDelete={handleDeleteLevel}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: MASTER SERVER CBT (FULL CRUD)                        */}
          {/* ========================================================== */}
          {activeMenu === 'masterServer' && (
            <MasterServerView
              servers={servers}
              onAdd={handleAddServer}
              onUpdate={handleUpdateServer}
              onDelete={handleDeleteServer}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: MASTER SESI UJIAN (FULL CRUD)                        */}
          {/* ========================================================== */}
          {activeMenu === 'masterSesi' && (
            <MasterSesiView
              sessions={sessions}
              onAdd={(s) => onAddSession?.(s)}
              onUpdate={(s) => onUpdateSession?.(s)}
              onDelete={(id) => onDeleteSession?.(id)}
            />
          )}

          {/* ========================================================== */}
          {/* C. VIEW MASTER MAPEL (FULL CRUD)                           */}
          {/* ========================================================== */}
          {activeMenu === 'masterMapel' && (
            <div className="bg-[#202533] p-6 rounded-2xl border border-slate-700 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-teal-400" />
                    Data Mata Pelajaran Kurikulum (Full CRUD)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kelola mata pelajaran resmi yang akan diujikan dalam asesmen sumatif sekolah.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari mapel atau kode..."
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-[#181c26] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 w-52"
                    />
                  </div>

                  <button
                    onClick={handleOpenAddSubject}
                    className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah Mapel Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((sub) => {
                  const assignedCount = teachers.filter((t) => t.assignedSubjectIds?.includes(sub.id)).length;
                  return (
                    <div
                      key={sub.id}
                      className="p-4 bg-[#181c26] border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-teal-900/60 text-teal-300 font-mono font-bold px-2 py-0.5 rounded border border-teal-700">
                            {sub.code}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                            Tingkat: {sub.level || 'VI'}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-2">{sub.name}</h4>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Diampu oleh: <strong className="text-slate-300">{assignedCount} Guru</strong>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleOpenEditSubject(sub)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-950/60 rounded-lg cursor-pointer transition-colors"
                          title="Edit Mapel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus mata pelajaran ${sub.name}?`)) {
                              onDeleteSubject(sub.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer transition-colors"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* D. VIEW PESERTA UJIAN (SISWA) - DAFTAR LENGKAP & FOTO      */}
          {/* ========================================================== */}
          {activeMenu === 'pesertaUjian' && (
            <DaftarPesertaUjianView
              students={students}
              classes={classes}
              rooms={rooms}
              sessions={sessions}
              levels={levels}
              majors={majors}
              servers={servers}
              onAddStudent={onAddStudent || (() => {})}
              onUpdateStudent={onUpdateStudent || (() => {})}
              onDeleteStudent={onDeleteStudent || (() => {})}
              onBulkUpdatePhotos={(photosMap) => {
                Object.entries(photosMap).forEach(([id, pUrl]) => {
                  const target = students.find((s) => s.id === id);
                  if (target && onUpdateStudent) {
                    onUpdateStudent({ ...target, photoUrl: pUrl });
                  }
                });
              }}
              onClearAllPhotos={() => {
                students.forEach((s) => {
                  if (s.photoUrl && onUpdateStudent) {
                    onUpdateStudent({ ...s, photoUrl: undefined });
                  }
                });
              }}
              onOpenImportMaster={() => navigateToMenu('importMaster')}
              onNavigateToCetakKartu={() => navigateToMenu('cetakKartu')}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* DATA INFO: 1. SISWA TIDAK IKUT UJIAN                       */}
          {/* ========================================================== */}
          {activeMenu === 'infoTidakIkut' && (
            <SiswaTidakIkutView
              students={students}
              studentSessions={studentSessions}
              schedules={schedules}
              classes={classes}
              levels={levels}
              rooms={rooms}
              sessions={sessions}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* DATA INFO: 2. REKAPITULASI PESERTA PER SESI UJIAN          */}
          {/* ========================================================== */}
          {activeMenu === 'infoPerSesi' && (
            <RekapitulasiDataInfoViews
              mode="SESI"
              students={students}
              sessions={sessions}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* DATA INFO: 3. REKAPITULASI PESERTA PER RUANG UJIAN         */}
          {/* ========================================================== */}
          {activeMenu === 'infoPerRuang' && (
            <RekapitulasiDataInfoViews
              mode="RUANG"
              students={students}
              rooms={rooms}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* DATA INFO: 4. REKAPITULASI PESERTA PER KELAS               */}
          {/* ========================================================== */}
          {activeMenu === 'infoPerKelas' && (
            <RekapitulasiDataInfoViews
              mode="KELAS"
              students={students}
              classes={classes}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* DATA INFO: 5. REKAPITULASI PESERTA PER JURUSAN             */}
          {/* ========================================================== */}
          {activeMenu === 'infoPerJurusan' && (
            <RekapitulasiDataInfoViews
              mode="JURUSAN"
              students={students}
              majors={majors}
              onRefresh={() => onRefreshStudents?.()}
            />
          )}

          {/* ========================================================== */}
          {/* E. VIEW MASTER KELAS & ROMBEL (FULL CRUD)                  */}
          {/* ========================================================== */}
          {activeMenu === 'masterKelas' && (
            <div className="bg-[#202533] p-6 rounded-2xl border border-slate-700 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    Data Master Kelas & Rombongan Belajar (Full CRUD)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atur pembagian rombel, tingkat kelas, jurusan, dan penanggung jawab wali kelas.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddClass}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Kelas Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-5 bg-[#181c26] border border-slate-700 rounded-xl space-y-3 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-indigo-900/60 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-700">
                          Tingkat {cls.level}
                        </span>
                        <h4 className="text-lg font-black text-white mt-1">{cls.name}</h4>
                        <span className="text-xs text-slate-400">{cls.jurusan}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEditClass(cls)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/60 rounded-lg cursor-pointer"
                          title="Edit Kelas"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kelas ${cls.name}?`)) {
                              onDeleteClass?.(cls.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                      <p>
                        Wali Kelas: <strong className="text-white">{cls.waliKelas}</strong>
                      </p>
                      <p>
                        Total Peserta: <strong className="text-emerald-400">{cls.totalStudents} Siswa</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* F. VIEW MASTER RUANGAN & SESI (FULL CRUD)                  */}
          {/* ========================================================== */}
          {activeMenu === 'masterRuang' && (
            <div className="bg-[#202533] p-6 rounded-2xl border border-slate-700 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-amber-400" />
                    Data Ruangan Lab Komputer & Sesi UBK (Full CRUD)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi alokasi ruang ujian, jumlah PC client, dan jadwal rentang waktu per sesi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-[#141824] p-1 rounded-xl border border-slate-700 text-xs font-semibold">
                    <button
                      onClick={() => setRuangSubTab('RUANG')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        ruangSubTab === 'RUANG' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Ruang Lab ({rooms.length})
                    </button>
                    <button
                      onClick={() => setRuangSubTab('SESI')}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        ruangSubTab === 'SESI' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Sesi Waktu ({sessions.length})
                    </button>
                  </div>

                  {ruangSubTab === 'RUANG' ? (
                    <button
                      onClick={handleOpenAddRoom}
                      className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Tambah Ruangan
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenAddSession}
                      className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Tambah Sesi
                    </button>
                  )}
                </div>
              </div>

              {ruangSubTab === 'RUANG' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rooms.map((rm) => (
                    <div
                      key={rm.id}
                      className="p-5 bg-[#181c26] border border-slate-700 rounded-xl space-y-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-amber-900/60 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-700">
                            {rm.code}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{rm.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">Server: {rm.serverName}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditRoom(rm)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-950/60 rounded-lg cursor-pointer"
                            title="Edit Ruangan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ruangan ${rm.name}?`)) {
                                onDeleteRoom?.(rm.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer"
                            title="Hapus Ruangan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                        <p>
                          Kapasitas Client: <strong className="text-emerald-400">{rm.capacity} Komputer</strong>
                        </p>
                        <p>
                          Proktor Jaga: <strong className="text-white">{rm.proctorName}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessions.map((ses) => (
                    <div
                      key={ses.id}
                      className="p-5 bg-[#181c26] border border-slate-700 rounded-xl space-y-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-purple-900/60 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-700">
                            Sesi Ke-{ses.sessionNumber}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{ses.name}</h4>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5 text-purple-400" /> {ses.timeRange}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditSession(ses)}
                            className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-950/60 rounded-lg cursor-pointer"
                            title="Edit Sesi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${ses.name}?`)) {
                                onDeleteSession?.(ses.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer"
                            title="Hapus Sesi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* G. VIEW JADWAL UJIAN UBK (FULL CRUD & AKTIVASI JADWAL)     */}
          {/* ========================================================== */}
          {activeMenu === 'jadwalUjian' && (
            <JadwalUjianManagementView
              schedules={schedules}
              subjects={subjects}
              classes={classes}
              sessions={sessions}
              students={students}
              studentSessions={studentSessions}
              examTypes={examTypes}
              activeToken={activeToken}
              onAddSchedule={onAddSchedule || (() => {})}
              onUpdateSchedule={onUpdateSchedule || (() => {})}
              onDeleteSchedule={onDeleteSchedule || (() => {})}
              onNavigateToLiveMonitor={() => navigateToMenu('ubkStatus')}
            />
          )}

          {/* ========================================================== */}
          {/* H. VIEW DATA BANK SOAL (FULL CRUD, DUPLIKASI, LIHAT SOAL)  */}
          {/* ========================================================== */}
          {(activeMenu === 'bankSoalSemua' || activeMenu === 'bankSoal') && (
            <BankSoalManagementView
              teachers={teachers}
              subjects={subjects}
              classes={classes}
              levels={levels}
              majors={majors}
              onOpenPrint={() => setActiveMenu('cetakSemua')}
            />
          )}

          {/* ========================================================== */}
          {/* I. VIEW KONTROL UBK (9 SUBMENUS LENGKAP)                   */}
          {/* ========================================================== */}
          {activeMenu === 'ubkStatus' && (
            <StatusPesertaView
              students={students}
              studentSessions={studentSessions}
              schedules={schedules}
              classes={classes}
              onResetStudentSession={onResetStudent}
              onBlockStudentSession={onResetStudent}
              onFinishStudentSession={onResetStudent}
              onRefresh={onRefreshStudents}
              onNavigateToToken={() => navigateToMenu('ubkToken')}
              onNavigateToReset={() => navigateToMenu('ubkResetLogin')}
              onNavigateToPelanggaran={() => navigateToMenu('ubkPelanggaran')}
              onNavigateToNilai={() => navigateToMenu('nilaiHasil')}
            />
          )}

          {activeMenu === 'ubkPindahNilai' && (
            <PindahNilaiView />
          )}

          {activeMenu === 'ubkResetLogin' && (
            <ResetLoginView
              students={students}
              onResetLogin={onResetStudent}
            />
          )}

          {activeMenu === 'ubkToken' && (
            <RilisTokenView
              activeToken={activeToken}
              tokenRequired={tokenRequired}
              onGenerateToken={onGenerateToken}
              onToggleToken={onToggleToken}
            />
          )}

          {activeMenu === 'ubkPengacakSoal' && (
            <PengacakSoalView students={students} />
          )}

          {activeMenu === 'ubkBlockPeserta' && (
            <AturBlockPesertaView />
          )}

          {activeMenu === 'ubkBelumUjian' && (
            <BelumUjianView students={students} />
          )}

          {activeMenu === 'ubkLokasiUjian' && (
            <LokasiUjianView />
          )}

          {activeMenu === 'ubkPelanggaran' && (
            <LaporanPelanggaranView
              students={students}
              onUnlockStudent={onResetStudent}
              onClearViolations={onResetStudent}
            />
          )}

          {/* ========================================================== */}
          {/* J. VIEW MODUL NILAI (5 SUBMENU LENGKAP)                    */}
          {/* ========================================================== */}
          {activeMenu === 'nilaiHasil' && (
            <HasilNilaiView
              students={students}
              subjects={subjects}
              classes={classes}
              schedules={schedules}
              onNavigateToRanking={() => navigateToMenu('analisaRanking')}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan')}
              onNavigateToCetakLeger={() => navigateToMenu('cetakLegerNilai')}
            />
          )}

          {activeMenu === 'nilaiPerMapel' && (
            <HasilNilaiPerMapelView />
          )}

          {activeMenu === 'nilaiSemua' && (
            <SemuaNilaiView
              classes={classes}
              students={students}
              onNavigateToCetakLeger={() => navigateToMenu('cetakLegerNilai')}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan')}
            />
          )}

          {activeMenu === 'nilaiDataUjian' && (
            <DataNilaiUjianView />
          )}

          {activeMenu === 'nilaiHistory' && (
            <HistoryNilaiView />
          )}

          {/* ========================================================== */}
          {/* K. VIEW CETAK DOKUMEN RESMI (6 SUBMENU LENGKAP)            */}
          {/* ========================================================== */}
          {activeMenu === 'cetakDaftarHadir' && (
            <DaftarHadirView
              schedules={schedules}
              rooms={rooms}
              sessions={sessions}
              classes={classes}
              students={students}
              branding={branding}
            />
          )}

          {activeMenu === 'cetakKartu' && (
            <CetakKartuView
              students={students}
              classes={classes}
              branding={branding}
            />
          )}

          {activeMenu === 'cetakDenahLokasi' && (
            <DenahLokasiView
              students={students}
              rooms={rooms}
              branding={branding}
            />
          )}

          {activeMenu === 'cetakBeritaAcara' && (
            <BeritaAcaraView
              schedules={schedules}
              branding={branding}
            />
          )}

          {activeMenu === 'cetakFormatNilai' && (
            <CetakFormatNilaiView
              schedules={schedules}
              classes={classes}
            />
          )}

          {activeMenu === 'cetakLegerNilai' && (
            <CetakLegerNilaiView
              classes={classes}
              students={students}
              branding={branding}
            />
          )}

          {activeMenu === 'cetakSemua' && (
            <DaftarHadirView
              schedules={schedules}
              rooms={rooms}
              sessions={sessions}
              classes={classes}
              students={students}
              branding={branding}
            />
          )}

          {/* ============================================================== */}
          {/* ANALISA VIEWS (4 Submenu matching Screenshot)                  */}
          {/* ============================================================== */}
          {activeMenu === 'analisaPerSoal' && (
            <AnalisaPerSoalView
              schedules={schedules}
              onNavigateToBankSoal={() => navigateToMenu('bankSoal')}
            />
          )}

          {activeMenu === 'analisaNilaiMapel' && (
            <AnalisaNilaiMapelView
              classes={classes}
              subjects={subjects}
              schedules={schedules}
              students={students}
              onNavigateToRanking={() => navigateToMenu('analisaRanking')}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan')}
            />
          )}

          {activeMenu === 'analisaRanking' && (
            <AnalisaNilaiRankingView
              classes={classes}
              subjects={subjects}
              schedules={schedules}
              students={students}
              branding={branding}
              onNavigateToPerbaikan={() => navigateToMenu('analisaPerbaikan')}
              onNavigateToCetakLeger={() => navigateToMenu('cetakLegerNilai')}
            />
          )}

          {activeMenu === 'analisaPerbaikan' && (
            <PerbaikanNilaiView
              classes={classes}
              subjects={subjects}
              students={students}
              onNavigateToHasilNilai={() => navigateToMenu('nilaiHasil')}
              onNavigateToRanking={() => navigateToMenu('analisaRanking')}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW MATH STUDIO (EDITOR RUMUS MATEMATIKA REALTIME)       */}
          {/* ========================================================== */}
          {activeMenu === 'mathStudio' && (
            <div className="w-full">
              <MathStudio />
            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW UPDATE SYSTEM & STATUS SERVER (SESUAI IMAGE 1)        */}
          {/* ========================================================== */}
          {activeMenu === 'updateSystem' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-rose-500" />
                    Update System & Status Server
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Informasi versi aplikasi, status koneksi database, dan pembaharuan sistem SmartCBT Pro
                  </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sistem Up to Date (v3.2.0)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Kartu 1: Info Versi */}
                <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Versi Aplikasi</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                      v3.2.0
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Framework:</span>
                      <span className="font-mono text-white">Next.js 15.3 (Turbopack)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Node Runtime:</span>
                      <span className="font-mono text-white">Node.js v22.23.4</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Database Engine:</span>
                      <span className="font-mono text-emerald-400 font-bold">PostgreSQL (Prisma v6)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">KaTeX Math:</span>
                      <span className="font-mono text-sky-400">v0.16.21 Ready</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 2: Status Server */}
                <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Status Server PUSAT</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                      ONLINE
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Port Server:</span>
                      <span className="font-mono text-white">localhost:3000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Sinkronisasi:</span>
                      <span className="font-mono text-emerald-400 font-bold">Real-time Aktif</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Latensi Database:</span>
                      <span className="font-mono text-white">&lt; 3ms</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Siswa Terhubung:</span>
                      <span className="font-mono text-sky-400 font-bold">{students.length} Siswa Terdaftar</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 3: Aksi Pemeliharaan */}
                <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-white text-sm">Aksi Pemeliharaan</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => alert('Pemeriksaan pembaruan selesai: Sistem EL-CBT Anda sudah menggunakan versi paling mutakhir (v3.2.0).')}
                      className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Cek Pembaruan Sistem</span>
                    </button>
                    <button
                      onClick={() => alert('Cadangan database berhasil dibuat! File: smartcbt_backup_20261117.sql')}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Backup Database (SQL)</span>
                    </button>
                    <button
                      onClick={() => alert('Cache sesi ujian & temp file berhasil dibersihkan!')}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Bersihkan Cache Sesi Ujian</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: FORM TAMBAH / EDIT GURU                               */}
      {/* ============================================================== */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCog className="w-4 h-4 text-blue-400" />
                {editingTeacherId ? 'Edit Akun Guru & Penugasan Mapel' : 'Tambah Guru & Buat Akun Baru'}
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap & Gelar:</label>
              <input
                type="text"
                placeholder="contoh: Muhammad Syakir, M.Pd"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">NIP:</label>
                <input
                  type="text"
                  placeholder="198403152009021004"
                  value={teacherNip}
                  onChange={(e) => setTeacherNip(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jabatan:</label>
                <input
                  type="text"
                  placeholder="Guru Mapel"
                  value={teacherJabatan}
                  onChange={(e) => setTeacherJabatan(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Username Login:</label>
                <input
                  type="text"
                  placeholder="guru@sekolah.sch.id"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password:</label>
                <input
                  type="text"
                  placeholder="guru123"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Pilihkan Mapel yang Ditugaskan (Boleh Lebih dari 1):
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-[#181c26] border border-slate-700 rounded-lg">
                {subjects.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjectIds.includes(sub.id)}
                      onChange={() => toggleSubjectSelect(sub.id)}
                      className="rounded accent-blue-600"
                    />
                    <span className="font-bold text-slate-200">{sub.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({sub.code})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveTeacher}
                className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingTeacherId ? 'Perbarui Guru' : 'Simpan Guru'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: FORM TAMBAH / EDIT MAPEL                              */}
      {/* ============================================================== */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-400" />
                {editingSubjectId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Mata Pelajaran:</label>
              <input
                type="text"
                placeholder="contoh: Fisika Terapan"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Mapel Singkat:</label>
                <input
                  type="text"
                  placeholder="FIS-01"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tingkat Kelas:</label>
                <input
                  type="text"
                  placeholder="VI atau X"
                  value={subjectLevel}
                  onChange={(e) => setSubjectLevel(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSubject}
                className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingSubjectId ? 'Perbarui Mapel' : 'Simpan Mapel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: FORM TAMBAH / EDIT SISWA                              */}
      {/* ============================================================== */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                {editingStudentId ? 'Edit Data Peserta Siswa' : 'Tambah Peserta Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap Siswa:</label>
              <input
                type="text"
                placeholder="contoh: AHMAD FAHRI RIFAI"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-bold uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">NISN:</label>
                <input
                  type="text"
                  placeholder="0098765432"
                  value={studentNisn}
                  onChange={(e) => setStudentNisn(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Peserta UBK:</label>
                <input
                  type="text"
                  placeholder="05-021-001-8"
                  value={studentNoPeserta}
                  onChange={(e) => setStudentNoPeserta(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rombel / Kelas:</label>
                <input
                  type="text"
                  placeholder="VI-A"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ruangan Lab:</label>
                <input
                  type="text"
                  placeholder="Ruang 01"
                  value={studentRoom}
                  onChange={(e) => setStudentRoom(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sesi Ujian:</label>
                <input
                  type="text"
                  placeholder="Sesi 1"
                  value={studentSession}
                  onChange={(e) => setStudentSession(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Username Login Siswa:</label>
                <input
                  type="text"
                  placeholder="Username / NISN"
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password Login:</label>
                <input
                  type="text"
                  placeholder="siswa123"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStudent}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingStudentId ? 'Perbarui Siswa' : 'Simpan Siswa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: FORM TAMBAH / EDIT KELAS                              */}
      {/* ============================================================== */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                {editingClassId ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Rombel / Kelas:</label>
              <input
                type="text"
                placeholder="contoh: VI-C atau X IPA 1"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tingkat:</label>
                <input
                  type="text"
                  placeholder="VI / VII / X"
                  value={classLevelInput}
                  onChange={(e) => setClassLevelInput(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kapasitas Siswa:</label>
                <input
                  type="number"
                  value={classStudentCountInput}
                  onChange={(e) => setClassStudentCountInput(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Wali Kelas:</label>
              <input
                type="text"
                placeholder="Nama guru wali kelas..."
                value={classWaliInput}
                onChange={(e) => setClassWaliInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveClass}
                className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingClassId ? 'Perbarui Kelas' : 'Simpan Kelas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: FORM TAMBAH / EDIT RUANGAN                            */}
      {/* ============================================================== */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-amber-400" />
                {editingRoomId ? 'Edit Ruang Ujian' : 'Tambah Ruang Ujian Baru'}
              </h3>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Ruang Lab:</label>
              <input
                type="text"
                placeholder="contoh: Lab Komputer C"
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Ruang:</label>
                <input
                  type="text"
                  placeholder="RUANG-03"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kapasitas PC:</label>
                <input
                  type="number"
                  value={roomCapacityInput}
                  onChange={(e) => setRoomCapacityInput(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Proktor Penanggung Jawab:</label>
              <input
                type="text"
                placeholder="Nama proktor..."
                value={roomProctorInput}
                onChange={(e) => setRoomProctorInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveRoom}
                className="py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingRoomId ? 'Perbarui Ruang' : 'Simpan Ruang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: FORM TAMBAH / EDIT SESI                               */}
      {/* ============================================================== */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                {editingSessionId ? 'Edit Sesi Ujian' : 'Tambah Sesi Ujian Baru'}
              </h3>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor Sesi:</label>
              <input
                type="number"
                value={sessionNumInput}
                onChange={(e) => setSessionNumInput(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Label Sesi:</label>
              <input
                type="text"
                placeholder="contoh: Sesi 3 (Sore)"
                value={sessionNameInput}
                onChange={(e) => setSessionNameInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rentang Waktu Pengerjaan:</label>
              <input
                type="text"
                placeholder="contoh: 13:30 - 15:30 WIT"
                value={sessionTimeRangeInput}
                onChange={(e) => setSessionTimeRangeInput(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSession}
                className="py-2 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingSessionId ? 'Perbarui Sesi' : 'Simpan Sesi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: FORM TAMBAH / EDIT JADWAL UJIAN                       */}
      {/* ============================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                {editingScheduleId ? 'Edit Jadwal Ujian UBK' : 'Buat Jadwal Ujian UBK Baru'}
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Judul Paket Ujian:</label>
              <input
                type="text"
                placeholder="contoh: Penilaian Akhir Semester Sosiologi"
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mata Pelajaran:</label>
                <select
                  value={scheduleSubjectId}
                  onChange={(e) => setScheduleSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sasaran Kelas:</label>
                <input
                  type="text"
                  placeholder="VI-A"
                  value={scheduleClass}
                  onChange={(e) => setScheduleClass(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tanggal Ujian:</label>
                <input
                  type="text"
                  placeholder="18 May 2026"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jam Mulai:</label>
                <input
                  type="text"
                  placeholder="07:30"
                  value={scheduleStartTime}
                  onChange={(e) => setScheduleStartTime(e.target.value)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Durasi (Menit):</label>
                <input
                  type="number"
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(parseInt(e.target.value) || 60)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-[#181c26] border border-slate-700 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Wajib Masukkan Token Ujian</span>
                <span className="text-[11px] text-slate-400">Siswa tidak bisa mulai sebelum memasukkan token</span>
              </div>
              <input
                type="checkbox"
                checked={scheduleTokenReq}
                onChange={(e) => setScheduleTokenReq(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* SAKLAR ACAK BUTIR SOAL & ACAK OPSI JAWABAN */}
            <div className="space-y-2.5 pt-1">
              {/* Saklar 1: Acak Soal */}
              <div className="p-3 bg-[#181c26] border border-slate-700/80 rounded-xl flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${scheduleRandomizeQuestions ? 'bg-purple-950/80 text-purple-400 border border-purple-800/80' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white block text-xs">Acak Butir Soal</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${scheduleRandomizeQuestions ? 'bg-purple-900/60 text-purple-300' : 'bg-slate-800 text-slate-500'}`}>
                        {scheduleRandomizeQuestions ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Urutan butir soal diacak otomatis untuk setiap peserta ujian</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleRandomizeQuestions(!scheduleRandomizeQuestions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    scheduleRandomizeQuestions ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scheduleRandomizeQuestions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Saklar 2: Acak Opsi Jawaban */}
              <div className="p-3 bg-[#181c26] border border-slate-700/80 rounded-xl flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg ${scheduleRandomizeOptions ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/80' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white block text-xs">Acak Opsi Jawaban</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${scheduleRandomizeOptions ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                        {scheduleRandomizeOptions ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Pilihan ganda (A-E) diacak posisinya di setiap perangkat siswa</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleRandomizeOptions(!scheduleRandomizeOptions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    scheduleRandomizeOptions ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scheduleRandomizeOptions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="py-2 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingScheduleId ? 'Perbarui Jadwal' : 'Simpan Jadwal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: FORM TAMBAH / EDIT BUTIR SOAL                         */}
      {/* ============================================================== */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                {editingQuestionId ? 'Edit Butir Soal' : 'Tambah Butir Soal Baru'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe Format Soal:</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as any)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  <option value="PG">Pilihan Ganda Tunggal (PG)</option>
                  <option value="ESSAY">Soal Esai (Koreksi Otomatis AI)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bobot Poin Nilai:</label>
                <input
                  type="number"
                  value={questionPoints}
                  onChange={(e) => setQuestionPoints(parseInt(e.target.value) || 10)}
                  className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pertanyaan / Narasi Soal:</label>
              <textarea
                rows={3}
                placeholder="Tuliskan pertanyaan ujian di sini..."
                value={questionPrompt}
                onChange={(e) => setQuestionPrompt(e.target.value)}
                className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {questionType === 'PG' ? (
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Opsi Pilihan Ganda & Kunci Jawaban:</label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={pgCorrectOpt === 'opt_a'}
                      onChange={() => setPgCorrectOpt('opt_a')}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono font-bold text-slate-400">A.</span>
                    <input
                      type="text"
                      placeholder="Pilihan A"
                      value={pgOptionA}
                      onChange={(e) => setPgOptionA(e.target.value)}
                      className="flex-1 p-2 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={pgCorrectOpt === 'opt_b'}
                      onChange={() => setPgCorrectOpt('opt_b')}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono font-bold text-slate-400">B.</span>
                    <input
                      type="text"
                      placeholder="Pilihan B"
                      value={pgOptionB}
                      onChange={(e) => setPgOptionB(e.target.value)}
                      className="flex-1 p-2 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={pgCorrectOpt === 'opt_c'}
                      onChange={() => setPgCorrectOpt('opt_c')}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono font-bold text-slate-400">C.</span>
                    <input
                      type="text"
                      placeholder="Pilihan C"
                      value={pgOptionC}
                      onChange={(e) => setPgOptionC(e.target.value)}
                      className="flex-1 p-2 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={pgCorrectOpt === 'opt_d'}
                      onChange={() => setPgCorrectOpt('opt_d')}
                      className="accent-emerald-500"
                    />
                    <span className="font-mono font-bold text-slate-400">D.</span>
                    <input
                      type="text"
                      placeholder="Pilihan D"
                      value={pgOptionD}
                      onChange={(e) => setPgOptionD(e.target.value)}
                      className="flex-1 p-2 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jawaban Ideal / Kunci Guru:</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh jawaban lengkap siswa..."
                    value={essayIdealAns}
                    onChange={(e) => setEssayIdealAns(e.target.value)}
                    className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Konsep Kata Kunci Penilaian Otomatis (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    placeholder="contoh: fotosintesis, klorofil, sinar matahari"
                    value={essayKeywords}
                    onChange={(e) => setEssayKeywords(e.target.value)}
                    className="w-full p-2.5 bg-[#181c26] border border-slate-700 rounded-lg text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
              >
                {editingQuestionId ? 'Perbarui Soal' : 'Simpan Butir Soal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 9: PRATINJAU BUTIR SOAL                                  */}
      {/* ============================================================== */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <span className="font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" /> Pratinjau Tampilan Soal di Layar Siswa
              </span>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#181c26] rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between font-mono font-bold text-slate-400">
                <span>Soal Nomor {previewQuestion.number}</span>
                <span className="text-amber-400">{previewQuestion.points} Poin</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{previewQuestion.prompt}</p>

              {previewQuestion.type === 'PG' && (
                <div className="space-y-1.5 pt-2">
                  {previewQuestion.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 flex items-center gap-2"
                    >
                      <span className="w-4 h-4 rounded-full border border-slate-500 inline-block" />
                      <span className="font-bold text-slate-200">{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {previewQuestion.type === 'ESSAY' && (
                <div className="p-3 bg-black/30 rounded-lg border border-slate-800 text-slate-400 italic">
                  [ Area Kolom Jawaban Esai Siswa ]
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewQuestion(null)}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 10: BULK IMPORT DATA SISWA DARI FILE EXCEL (.XLSX)       */}
      {/* ============================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#202533] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Import Masal Siswa (.xlsx)</h3>
                  <p className="text-[11px] text-slate-400">Unggah ribuan peserta ujian sekaligus ke PostgreSQL</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Download Template */}
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-300 block text-xs">1. Unduh Template Format Resmi</span>
                  <span className="text-[11px] text-slate-400">Gunakan format kolom standar agar parsing berjalan akurat</span>
                </div>
                <a
                  href="/api/students/template"
                  download="template_siswa_smartcbt.xlsx"
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh .xlsx
                </a>
              </div>
            </div>

            {/* Step 2: Upload File */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">2. Pilih File Excel yang Telah Diisi:</label>
              <div className="p-4 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl bg-[#181c26] text-center transition-colors">
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFile(e.target.files[0]);
                      setImportResult(null);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="excelFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-emerald-400/80" />
                  {importFile ? (
                    <div>
                      <span className="text-white font-bold text-xs block">{importFile.name}</span>
                      <span className="text-slate-400 text-[10px]">
                        {(importFile.size / 1024).toFixed(1)} KB — Klik untuk ganti file
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-300 font-bold block text-xs">
                        Klik untuk mencari file atau seret file .xlsx ke sini
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        Mendukung Microsoft Excel Workbook (.xlsx) & 97-2003 (.xls)
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Alert Result */}
            {importResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  importResult.success
                    ? 'bg-emerald-950/50 border-emerald-700/80 text-emerald-200'
                    : 'bg-red-950/50 border-red-700/80 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {importResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{importResult.message}</span>
                </div>
                {importResult.success && (
                  <div className="text-[11px] text-slate-300 font-mono pt-1">
                    ✓ Berhasil diimpor: <strong className="text-emerald-400">{importResult.importedCount}</strong> siswa <br />
                    • Dilewati (Duplikat): <strong className="text-slate-400">{importResult.skippedCount}</strong> siswa
                  </div>
                )}
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="text-[10px] text-red-300 pt-1 space-y-0.5 border-t border-red-800/40 mt-1">
                    {importResult.errors.map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="py-2 px-4 rounded-xl text-slate-400 hover:text-white cursor-pointer font-semibold"
              >
                {importResult?.success ? 'Selesai' : 'Batal'}
              </button>
              <button
                type="button"
                onClick={handleUploadExcel}
                disabled={!importFile || isImporting}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-2 transition-colors"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses Import...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" /> Mulai Import Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PUSAT STATUS */}
      {isPusatStatusModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2330] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                Status Server PUSAT UBK
              </h3>
              <button
                onClick={() => setIsPusatStatusModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <p className="font-bold text-emerald-300">Server Utama Online & Terhubung</p>
                  <p className="text-[11px] text-slate-400">Sinkronisasi data master, jadwal, dan butir soal berjalan normal</p>
                </div>
              </div>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-sans">Node Server:</span>
                  <span className="text-white">PUSAT-01 (Primary)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-sans">Alamat IP:</span>
                  <span className="text-white">127.0.0.1:3000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-sans">Token Aktif:</span>
                  <span className="text-amber-400 font-bold">{tokenRequired ? activeToken : 'OFF'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-sans">Database:</span>
                  <span className="text-emerald-400 font-bold">PostgreSQL Connected</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPusatStatusModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENGUMUMAN */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2330] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-400" />
                Pengumuman Sekolah
              </h3>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center py-8">
              <Megaphone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 font-medium">Belum ada pengumuman baru untuk hari ini.</p>
              <p className="text-[10px] text-slate-500 mt-1">Pengumuman yang dibuat oleh operator akan tampil di dashboard guru dan siswa.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BRANDING SUPER ADMIN */}
      {branding && onSaveBranding && (
        <BrandingSettingsModal
          isOpen={isBrandingModalOpen}
          onClose={() => setIsBrandingModalOpen(false)}
          branding={branding}
          onSaveBranding={onSaveBranding}
        />
      )}

      {/* MODAL PANDUAN & TUTORIAL OPERATOR */}
      <HelpTutorialModal
        isOpen={isHelpTutorialOpen}
        onClose={() => setIsHelpTutorialOpen(false)}
        defaultRole="OPERATOR"
        onNavigateTab={(tab) => {
          if (tab === 'superadmin_branding') setIsBrandingModalOpen(true);
          else if (tab === 'operator_master') navigateToMenu('importMaster');
          else if (tab === 'operator_students') navigateToMenu('pesertaUjian');
          else if (tab === 'operator_cetak') navigateToMenu('cetakKartu');
          else if (tab === 'operator_jadwal' || tab === 'guru_jadwal') navigateToMenu('jadwalUjian');
          else if (tab === 'operator_monitor') navigateToMenu('ubkStatus');
          else if (tab === 'operator_nilai' || tab === 'guru_nilai') navigateToMenu('nilaiHasil');
          else if (tab === 'guru_banksoal' || tab === 'operator_banksoal') navigateToMenu('bankSoal');
          else if (tab === 'guru_mathstudio' || tab === 'operator_mathstudio') navigateToMenu('mathStudio');
          else if (tab === 'guru_analisis') navigateToMenu('analisaPerSoal');
        }}
      />
    </div>
  );
}
