'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Hourglass,
  Timer,
  Users,
  Edit3,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  BookOpen,
  Shuffle,
  ListOrdered,
  KeyRound,
  Eye,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Layers,
  Tag,
} from 'lucide-react';
import {
  ExamSchedule,
  Subject,
  SchoolClass,
  ExamSessionInfo,
  Student,
  StudentSession,
  ExamTypeMaster,
  QuestionBank,
} from '@/lib/types';

interface JadwalUjianManagementViewProps {
  schedules: ExamSchedule[];
  subjects: Subject[];
  classes?: SchoolClass[];
  sessions?: ExamSessionInfo[];
  students: Student[];
  studentSessions: StudentSession[];
  examTypes?: ExamTypeMaster[];
  questionBanks?: QuestionBank[];
  activeToken: string;
  onAddSchedule: (schedule: ExamSchedule) => void;
  onUpdateSchedule: (schedule: ExamSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onNavigateToLiveMonitor?: () => void;
}

// Initial SMA Exam Schedules
export const DEFAULT_JADWAL_SCHEDULES: ExamSchedule[] = [
  {
    id: 'sch_mat_x',
    code: 'PAS-2026-MAT-X1',
    title: 'Asesmen Sumatif Matematika Wajib Kelas X',
    subjectId: 'sub_mat',
    subjectName: 'Matematika Wajib',
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
    remedialCount: 4,
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
    title: 'Asesmen Sumatif PPKn Kelas X SMA',
    subjectId: 'sub_ppkn',
    subjectName: 'Pendidikan Pancasila dan Kewarganegaraan',
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
    remedialCount: 2,
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
    title: 'Penilaian Akhir Semester Sosiologi X IPS',
    subjectId: 'sub_sos',
    subjectName: 'Sosiologi',
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
    title: 'Asesmen Sumatif Fisika X MIPA',
    subjectId: 'sub_fis',
    subjectName: 'Fisika',
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
    id: 'sch_bindo_x',
    code: 'PAS-2026-BINDO-X1',
    title: 'Asesmen Sumatif Bahasa Indonesia Kelas X',
    subjectId: 'sub_bindo',
    subjectName: 'Bahasa Indonesia',
    examType: 'PAS',
    level: 'X',
    className: 'Semua Kelas X',
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

export default function JadwalUjianManagementView({
  schedules = DEFAULT_JADWAL_SCHEDULES,
  subjects,
  classes = [],
  sessions = [],
  students,
  studentSessions,
  examTypes = [],
  questionBanks = [],
  activeToken,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onNavigateToLiveMonitor,
}: JadwalUjianManagementViewProps) {
  // State: Status Filter Pills (ALL, ACTIVE, INACTIVE)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // State: Modal Tambah / Edit Jadwal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Daftar semua rombel unik yang ada di sistem (dari props classes, students, dan fallback umum SD/SMP/SMA)
  const allAvailableClasses = useMemo(() => {
    const list = new Set<string>();
    classes.forEach((c) => {
      if (c.name) list.add(c.name.trim());
    });
    students.forEach((s) => {
      if (s.className) list.add(s.className.trim());
    });
    if (list.size === 0) {
      ['VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'IX A', 'IX B', 'X MIPA 1', 'X MIPA 2', 'X IPS 1', 'X IPS 2', 'Kelas 6 A', 'Kelas 6 B'].forEach((c) => list.add(c));
    }
    return Array.from(list).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [classes, students]);

  // Form State (matching Image 2 + Multi-Rombel)
  const [formBankSoalCode, setFormBankSoalCode] = useState('PAS-2026-MAT-X1');
  const [formExamType, setFormExamType] = useState('PAS');
  const [formLevel, setFormLevel] = useState('VII');
  const [formSelectedClasses, setFormSelectedClasses] = useState<string[]>(['VII A', 'VII B', 'VII C']);
  const [customClassInput, setCustomClassInput] = useState('');
  const [formStartDate, setFormStartDate] = useState('18 May 2026 07:30');
  const [formEndDate, setFormEndDate] = useState('18 May 2026 09:30');
  const [formFinishButtonTime, setFormFinishButtonTime] = useState('');
  const [formAutoActiveMinutes, setFormAutoActiveMinutes] = useState(0);
  const [formSessionNumber, setFormSessionNumber] = useState(1);
  const [formDurationMinutes, setFormDurationMinutes] = useState(90);
  const [formKkm, setFormKkm] = useState(75);
  const [formRemedialCount, setFormRemedialCount] = useState(0);

  // Checkbox settings
  const [formRandomizeQuestions, setFormRandomizeQuestions] = useState(true);
  const [formRandomizeOptions, setFormRandomizeOptions] = useState(true);
  const [formTokenRequired, setFormTokenRequired] = useState(true);
  const [formShowResult, setFormShowResult] = useState(false);
  const [formResetLogin, setFormResetLogin] = useState(false);
  const [formSaveAnswerHistory, setFormSaveAnswerHistory] = useState(true);

  // State: Status Peserta Modal Popup
  const [selectedScheduleForStatus, setSelectedScheduleForStatus] = useState<ExamSchedule | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Open Modal Tambah
  const handleOpenAdd = () => {
    setEditingScheduleId(null);
    setFormBankSoalCode('BINDO-KLS-VI-1');
    setFormExamType('UMBK');
    
    // Auto-detect tingkat yang ada
    const defaultLvl = allAvailableClasses.some(c => c.startsWith('VII')) ? 'VII' : (allAvailableClasses[0]?.split(' ')[0] || 'VII');
    setFormLevel(defaultLvl);
    const initialClasses = allAvailableClasses.filter(c => c.startsWith(defaultLvl));
    setFormSelectedClasses(initialClasses.length > 0 ? initialClasses : allAvailableClasses.slice(0, 3));
    setCustomClassInput('');

    setFormStartDate('18 May 2026 17:00');
    setFormEndDate('18 May 2026 19:00');
    setFormFinishButtonTime('');
    setFormAutoActiveMinutes(0);
    setFormSessionNumber(1);
    setFormDurationMinutes(90);
    setFormKkm(70);
    setFormRemedialCount(0);
    setFormRandomizeQuestions(true);
    setFormRandomizeOptions(true);
    setFormTokenRequired(true);
    setFormShowResult(false);
    setFormResetLogin(false);
    setFormSaveAnswerHistory(true);
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEdit = (sch: ExamSchedule) => {
    setEditingScheduleId(sch.id);
    setFormBankSoalCode(sch.code || sch.title);
    setFormExamType(sch.examType || 'UMBK');
    setFormLevel(sch.level || 'VII');
    
    // Parse multi-classes
    if (sch.className) {
      const parsed = sch.className.split(/,\s*/).map(c => c.trim()).filter(Boolean);
      setFormSelectedClasses(parsed);
    } else {
      setFormSelectedClasses([]);
    }
    setCustomClassInput('');

    setFormStartDate(`${sch.examDate} ${sch.startTime}`);
    setFormEndDate(`${sch.examDate} ${sch.endTime}`);
    setFormFinishButtonTime(sch.finishButtonTime || '');
    setFormAutoActiveMinutes(sch.autoActiveMinutes || 0);
    setFormSessionNumber(sch.sessionNumber || 1);
    setFormDurationMinutes(sch.durationMinutes || 90);
    setFormKkm(sch.kkm || 70);
    setFormRemedialCount(sch.remedialCount || 0);
    setFormRandomizeQuestions(sch.randomizeQuestions !== false);
    setFormRandomizeOptions(sch.randomizeOptions !== false);
    setFormTokenRequired(sch.tokenRequired !== false);
    setFormShowResult(sch.showResult === true);
    setFormResetLogin(sch.resetLogin === true);
    setFormSaveAnswerHistory(sch.saveAnswerHistory !== false);
    setIsModalOpen(true);
  };

  // Save Schedule (Create or Update)
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse date and times
    let parsedDate = '18 May 2026';
    let parsedStart = '17:00';
    let parsedEnd = '19:00';

    if (formStartDate) {
      const parts = formStartDate.trim().split(' ');
      if (parts.length >= 4) {
        parsedDate = `${parts[0]} ${parts[1]} ${parts[2]}`;
        parsedStart = parts[3];
      }
    }

    if (formEndDate) {
      const parts = formEndDate.trim().split(' ');
      if (parts.length >= 4) {
        parsedEnd = parts[3];
      }
    }

    // Determine subject from bank or default
    const matchedSubject = subjects.find(
      (s) =>
        formBankSoalCode.toUpperCase().includes(s.code.toUpperCase()) ||
        formBankSoalCode.toUpperCase().includes(s.name.toUpperCase())
    ) || subjects[0];

    // Determine final comma-separated multi-classes
    const finalClassName =
      formSelectedClasses.length > 0 ? formSelectedClasses.join(', ') : 'Semua Kelas';

    if (editingScheduleId) {
      const existing = schedules.find((s) => s.id === editingScheduleId);
      if (existing) {
        const updated: ExamSchedule = {
          ...existing,
          code: formBankSoalCode,
          title: formBankSoalCode,
          examType: formExamType,
          level: formLevel || existing.level || 'VII',
          className: finalClassName,
          subjectId: matchedSubject?.id || existing.subjectId,
          subjectName: matchedSubject?.name || existing.subjectName,
          examDate: parsedDate,
          startTime: parsedStart,
          endTime: parsedEnd,
          durationMinutes: formDurationMinutes,
          sessionNumber: formSessionNumber,
          kkm: formKkm,
          remedialCount: formRemedialCount,
          finishButtonTime: formFinishButtonTime,
          autoActiveMinutes: formAutoActiveMinutes,
          randomizeQuestions: formRandomizeQuestions,
          randomizeOptions: formRandomizeOptions,
          tokenRequired: formTokenRequired,
          showResult: formShowResult,
          resetLogin: formResetLogin,
          saveAnswerHistory: formSaveAnswerHistory,
        };
        onUpdateSchedule(updated);
        showToast(`Jadwal ujian "${formBankSoalCode}" berhasil diperbarui!`, 'success');
      }
    } else {
      const newSchedule: ExamSchedule = {
        id: `sch_${Date.now()}`,
        code: formBankSoalCode,
        title: formBankSoalCode,
        subjectId: matchedSubject?.id || 'sub_bindo',
        subjectName: matchedSubject?.name || 'Bahasa Indonesia',
        examType: formExamType,
        level: formLevel || 'VII',
        className: finalClassName,
        teacherId: 'tch_marida',
        teacherName: 'Marida Saleh, S. Pd',
        examDate: parsedDate,
        startTime: parsedStart,
        endTime: parsedEnd,
        dayOfWeek: 'SENIN',
        durationMinutes: formDurationMinutes,
        sessionNumber: formSessionNumber,
        kkm: formKkm,
        remedialCount: formRemedialCount,
        finishButtonTime: formFinishButtonTime,
        autoActiveMinutes: formAutoActiveMinutes,
        isActive: true,
        totalQuestions: 40,
        tokenRequired: formTokenRequired,
        activeToken: activeToken || '36S7KS',
        proctorPin: '123456',
        randomizeQuestions: formRandomizeQuestions,
        randomizeOptions: formRandomizeOptions,
        showResult: formShowResult,
        resetLogin: formResetLogin,
        saveAnswerHistory: formSaveAnswerHistory,
        questions: [],
      };
      onAddSchedule(newSchedule);
      showToast(`Jadwal ujian "${formBankSoalCode}" berhasil diaktifkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  // Toggle Switch Aktif / Non-Aktif
  const handleToggleStatus = (sch: ExamSchedule) => {
    const updated = { ...sch, isActive: !sch.isActive };
    onUpdateSchedule(updated);
    showToast(
      `Status jadwal "${sch.code}" diubah menjadi ${updated.isActive ? 'AKTIF' : 'NONAKTIF'}.`,
      'info'
    );
  };

  // Delete Schedule
  const handleDelete = (sch: ExamSchedule) => {
    if (confirm(`Hapus jadwal ujian "${sch.code}"?`)) {
      onDeleteSchedule(sch.id);
      showToast(`Jadwal ujian "${sch.code}" telah dihapus.`, 'info');
    }
  };

  // Filtered Schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((sch) => {
      // Status pill filter
      if (statusFilter === 'ACTIVE' && !sch.isActive) return false;
      if (statusFilter === 'INACTIVE' && sch.isActive) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          sch.code.toLowerCase().includes(q) ||
          sch.title.toLowerCase().includes(q) ||
          sch.subjectName.toLowerCase().includes(q) ||
          sch.className.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [schedules, statusFilter, searchTerm]);

  // Paginated Schedules
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSchedules.slice(start, start + entriesPerPage);
  }, [filteredSchedules, currentPage, entriesPerPage]);

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-950 border-rose-500/50 text-rose-300'
              : 'bg-blue-950 border-blue-500/50 text-blue-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Pengaturan Jadwal Ujian
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Aktivasi jadwal ujian UBK, sinkronisasi waktu pelaksanaan, dan kontrol sesi tes.
        </p>
      </div>

      {/* Main Container Card (Matching Image 1) */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl">
        {/* Card Header with Status Filter Pills & Tambah Jadwal Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
              Aktivasi Jadwal Ujian
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pill: Aktif */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'ACTIVE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-500/30'
              }`}
            >
              Aktif
            </button>

            {/* Filter Pill: Non-Aktif */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'INACTIVE' ? 'ALL' : 'INACTIVE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'INACTIVE'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full border border-rose-400"></span>
              <span>Non-Aktif</span>
            </button>

            {/* Button: + Tambah Jadwal */}
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          </div>
        </div>

        {/* Table Controls (Show Entries & Search) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari jadwal / mapel..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Schedules Table (Matching Image 1) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3 w-12 text-center text-slate-500">#</th>
                <th className="py-3 px-3">MATA PELAJARAN / BANK SOAL</th>
                <th className="py-3 px-3">INFORMASI WAKTU</th>
                <th className="py-3 px-3">TINGKAT & MULTI-ROMBEL</th>
                <th className="py-3 px-3">SESI & SIFAT</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Tidak ada jadwal ujian yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                paginatedSchedules.map((sch, idx) => {
                  const globalIdx = (currentPage - 1) * entriesPerPage + idx + 1;

                  // Live count calculations for this schedule
                  const activeCount = sch.code.includes('BINDO') ? 1 : 0;
                  const finishedCount = sch.code.includes('BINDO') ? 0 : 52;
                  const notTakingCount = sch.code.includes('BINDO') ? 52 : 1;

                  return (
                    <tr
                      key={sch.id}
                      className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                    >
                      {/* # */}
                      <td className="py-3.5 px-3 text-center text-slate-400 font-mono">
                        {globalIdx}
                      </td>

                      {/* MATA PELAJARAN / BANK SOAL */}
                      <td className="py-3.5 px-3 space-y-1.5">
                        <div className="font-extrabold text-white text-xs tracking-wide">
                          {sch.code}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                            {sch.examType || 'UMBK'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                            {sch.className || 'VI - semua'}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedScheduleForStatus(sch)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <Users className="w-3 h-3" />
                            <span>Status Peserta</span>
                          </button>
                        </div>
                      </td>

                      {/* INFORMASI WAKTU */}
                      <td className="py-3.5 px-3 space-y-1 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-sky-400">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{sch.examDate} {sch.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-400">
                          <Hourglass className="w-3.5 h-3.5 shrink-0" />
                          <span>{sch.examDate} {sch.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Timer className="w-3.5 h-3.5 shrink-0" />
                          <span>{sch.durationMinutes} Menit</span>
                        </div>
                      </td>

                      {/* TINGKAT & MULTI-ROMBEL */}
                      <td className="py-3.5 px-3 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[11px] shadow-xs">
                            Tk. {sch.level || 'VII'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {sch.className ? (
                            sch.className.split(/,\s*/).map((cls, ci) => (
                              <span
                                key={ci}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold"
                              >
                                {cls}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Semua Kelas</span>
                          )}
                        </div>
                      </td>

                      {/* SESI & SIFAT */}
                      <td className="py-3.5 px-3 space-y-1">
                        <div className="text-slate-300 text-xs font-semibold">
                          Sesi: {sch.sessionNumber || 1}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-[10px]"
                            title="Acak Soal & Opsi Aktif"
                          >
                            <Shuffle className="w-3 h-3" />
                          </span>
                          {sch.tokenRequired && (
                            <span
                              className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-400 flex items-center justify-center text-[10px]"
                              title={`Wajib Token: ${activeToken}`}
                            >
                              <KeyRound className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS (SWITCH + STAT BADGES) */}
                      <td className="py-3.5 px-3 space-y-1.5 text-center">
                        {/* Switch Toggle */}
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(sch)}
                            className="cursor-pointer transition-colors"
                            title="Klik untuk mengubah status aktif"
                          >
                            {sch.isActive ? (
                              <ToggleRight className="w-7 h-7 text-blue-500" />
                            ) : (
                              <ToggleLeft className="w-7 h-7 text-slate-600" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-bold ${
                              sch.isActive ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {sch.isActive ? 'AKTIF' : 'NON-AKTIF'}
                          </span>
                        </div>

                        {/* Live Badges (Matching Image 1) */}
                        <div className="flex flex-col items-center gap-1">
                          {activeCount > 0 ? (
                            <span className="inline-block px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] shadow-xs">
                              ✏ {activeCount} Aktif
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] shadow-xs">
                              ✔ {finishedCount} Selesai
                            </span>
                          )}

                          <span className="inline-block px-2.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] shadow-xs">
                            ⏳ {notTakingCount} Tdk Ikut
                          </span>
                        </div>
                      </td>

                      {/* AKSI (EDIT & DELETE) */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. EDIT (Amber) */}
                          <button
                            onClick={() => handleOpenEdit(sch)}
                            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Edit Jadwal Ujian"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. DELETE (Red) */}
                          <button
                            onClick={() => handleDelete(sch)}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Hapus Jadwal Ujian"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
          <div>
            Showing {filteredSchedules.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredSchedules.length)} of {filteredSchedules.length}{' '}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === pg
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT JADWAL UJIAN (MATCHING GAMBAR 2)                     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-4 overflow-y-auto">
          <div className="bg-[#151922] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
            {/* Modal Header (Pink / Magenta #e11d48) */}
            <div className="bg-[#e11d48] px-5 py-3.5 flex items-center justify-between text-white shadow-md">
              <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center font-bold text-xs">
                  +
                </span>
                <span>{editingScheduleId ? 'Edit Jadwal Ujian' : 'Tambah Jadwal Ujian'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSchedule} className="p-5 md:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {/* Row 1: Pilih Bank Soal & Jenis Ujian */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Pilih Bank Soal
                  </label>
                  <select
                    value={formBankSoalCode}
                    onChange={(e) => setFormBankSoalCode(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-500"
                  >
                    {questionBanks.map((qb) => (
                      <option key={qb.id} value={qb.code}>
                        {qb.code} ({qb.subjectName})
                      </option>
                    ))}
                    {/* Opsi default bank soal jika belum ada di questionBanks */}
                    {[
                      { code: 'BINDO-KLS-VI-1', name: 'Bahasa Indonesia' },
                      { code: 'SOSIOLOGI KELAS X IPS', name: 'Sosiologi' },
                      { code: 'AKAH-KLS-VI-1', name: 'PPKn' },
                      { code: 'SKI-KLS-VI-1', name: 'SKI' },
                      { code: 'B_ARAB-KLS-VI-1', name: 'Bahasa Arab' },
                      { code: 'SBP-KLS-VI-1', name: 'Seni Budaya' },
                      { code: 'BING-KLS-VI-1', name: 'Bahasa Inggris' },
                    ]
                      .filter((def) => !questionBanks.some((qb) => qb.code === def.code))
                      .map((def) => (
                        <option key={def.code} value={def.code}>
                          {def.code} ({def.name})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Jenis Ujian
                  </label>
                  <select
                    value={formExamType}
                    onChange={(e) => setFormExamType(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="UMBK">UMBK (Ujian Madrasah Berbasis Komputer)</option>
                    <option value="ASAS">ASAS (Asesmen Sumatif Akhir Semester)</option>
                    <option value="ANBK">ANBK (Asesmen Nasional)</option>
                    <option value="PTS">PTS (Penilaian Tengah Semester)</option>
                    <option value="PAS">PAS (Penilaian Akhir Semester)</option>
                    <option value="PAT">PAT (Penilaian Akhir Tahun)</option>
                    {examTypes.map((et) => (
                      <option key={et.id} value={et.code}>
                        {et.code} ({et.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 1.5: Target Tingkat & Multi-Kelas Ujian (Rombel Dinamis) */}
              <div className="p-3.5 bg-[#0e121a] border border-blue-900/50 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Target Tingkat & Multi-Kelas (Rombel Ujian)
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Jadwal ini akan otomatis aktif dan dapat diakses oleh semua rombel yang dicentang.
                      </span>
                    </div>
                  </div>

                  {/* Level dropdown */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-[11px] text-slate-400 font-medium">Tingkat:</span>
                    <select
                      value={formLevel}
                      onChange={(e) => {
                        const newLvl = e.target.value;
                        setFormLevel(newLvl);
                        const matching = allAvailableClasses.filter((c) => c.startsWith(newLvl));
                        if (matching.length > 0) {
                          setFormSelectedClasses(matching);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 text-blue-300 font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-hidden"
                    >
                      <option value="VII">Kelas VII (SMP)</option>
                      <option value="VIII">Kelas VIII (SMP)</option>
                      <option value="IX">Kelas IX (SMP)</option>
                      <option value="X">Kelas X (SMA)</option>
                      <option value="XI">Kelas XI (SMA)</option>
                      <option value="XII">Kelas XII (SMA)</option>
                      <option value="VI">Kelas VI (SD/MI)</option>
                      <option value="V">Kelas V (SD/MI)</option>
                      <option value="IV">Kelas IV (SD/MI)</option>
                      <option value="III">Kelas III (SD/MI)</option>
                      <option value="II">Kelas II (SD/MI)</option>
                      <option value="I">Kelas I (SD/MI)</option>
                    </select>
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Pilih Rombel / Kelas (Centang Multi-Kelas):
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFormSelectedClasses([...allAvailableClasses])}
                      className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-semibold cursor-pointer"
                    >
                      Pilih Semua ({allAvailableClasses.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const matched = allAvailableClasses.filter((c) => c.startsWith(formLevel));
                        setFormSelectedClasses(matched.length > 0 ? matched : allAvailableClasses.slice(0, 3));
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold cursor-pointer"
                    >
                      Sesuai Tk. {formLevel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSelectedClasses([])}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-semibold cursor-pointer"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                {/* Grid of Class Checkboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                  {allAvailableClasses.map((cls) => {
                    const isChecked = formSelectedClasses.includes(cls);
                    return (
                      <label
                        key={cls}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-blue-600/20 border-blue-500/60 text-white font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormSelectedClasses((prev) => [...prev, cls]);
                            } else {
                              setFormSelectedClasses((prev) => prev.filter((c) => c !== cls));
                            }
                          }}
                          className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                        />
                        <span className="truncate">{cls}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Custom Rombel Input & Selected Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                    <input
                      type="text"
                      value={customClassInput}
                      onChange={(e) => setCustomClassInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = customClassInput.trim();
                          if (val && !formSelectedClasses.includes(val)) {
                            setFormSelectedClasses((prev) => [...prev, val]);
                            setCustomClassInput('');
                          }
                        }
                      }}
                      placeholder="+ Tambah Rombel Kustom..."
                      className="w-full bg-[#151922] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = customClassInput.trim();
                        if (val && !formSelectedClasses.includes(val)) {
                          setFormSelectedClasses((prev) => [...prev, val]);
                          setCustomClassInput('');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Tambah
                    </button>
                  </div>

                  <div className="text-[11px] text-right">
                    <span className="text-slate-400">Terpilih: </span>
                    <span className="font-bold text-blue-400">
                      {formSelectedClasses.length > 0
                        ? `${formSelectedClasses.length} Rombel (${formSelectedClasses.join(', ')})`
                        : 'Semua Kelas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Mulai Ujian & Selesai (Expired) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mulai Ujian</span>
                  </label>
                  <input
                    type="text"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    placeholder="dd/mm/tttt --.--"
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-mono focus:outline-hidden focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>Selesai (Expired)</span>
                  </label>
                  <input
                    type="text"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="dd/mm/tttt --.--"
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-mono focus:outline-hidden focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Tombol Selesai & Otomatis Aktif (Menit) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Tombol Selesai</span>
                  </label>
                  <input
                    type="text"
                    value={formFinishButtonTime}
                    onChange={(e) => setFormFinishButtonTime(e.target.value)}
                    placeholder="dd/mm/tttt --.--"
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-mono focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Kosong = Manual</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Otomatis Aktif (Menit)</span>
                  </label>
                  <input
                    type="number"
                    value={formAutoActiveMinutes}
                    onChange={(e) => setFormAutoActiveMinutes(Number(e.target.value))}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">... Menit Sebelum Selesai (0 = Nonaktif)</span>
                </div>
              </div>

              {/* Row 4: Sesi, Lama Ujian, KKM, Remidi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Sesi
                  </label>
                  <select
                    value={formSessionNumber}
                    onChange={(e) => setFormSessionNumber(Number(e.target.value))}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Lama Ujian (Menit)
                  </label>
                  <input
                    type="number"
                    value={formDurationMinutes}
                    onChange={(e) => setFormDurationMinutes(Number(e.target.value))}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    KKM
                  </label>
                  <input
                    type="number"
                    value={formKkm}
                    onChange={(e) => setFormKkm(Number(e.target.value))}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Remidi (Kali)
                  </label>
                  <input
                    type="number"
                    value={formRemedialCount}
                    onChange={(e) => setFormRemedialCount(Number(e.target.value))}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Row 5: Opsi Pengaturan Ujian (6 Checkboxes Matching Image 2) */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Opsi Pengaturan Ujian
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#0d1017] border border-slate-800/80 rounded-xl">
                  {/* 1. Acak Soal */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formRandomizeQuestions}
                      onChange={(e) => setFormRandomizeQuestions(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Acak Soal</span>
                  </label>

                  {/* 2. Gunakan Token */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formTokenRequired}
                      onChange={(e) => setFormTokenRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Gunakan Token</span>
                  </label>

                  {/* 3. Reset Login */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formResetLogin}
                      onChange={(e) => setFormResetLogin(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Reset Login</span>
                  </label>

                  {/* 4. Acak Opsi PG */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formRandomizeOptions}
                      onChange={(e) => setFormRandomizeOptions(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Acak Opsi PG</span>
                  </label>

                  {/* 5. Tampil Hasil (Nilai) */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formShowResult}
                      onChange={(e) => setFormShowResult(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Tampil Hasil (Nilai)</span>
                  </label>

                  {/* 6. Simpan History Jawaban */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={formSaveAnswerHistory}
                      onChange={(e) => setFormSaveAnswerHistory(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-medium">Simpan History Jawaban</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#e11d48] hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Aktifkan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL STATUS PESERTA (WHEN CLICKING "[ Status Peserta ]")               */}
      {/* ========================================================================= */}
      {selectedScheduleForStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-4 overflow-y-auto">
          <div className="bg-[#151922] border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-sky-300" />
                <div>
                  <h3 className="font-bold text-sm md:text-base">
                    Monitoring Status Peserta: {selectedScheduleForStatus.code}
                  </h3>
                  <span className="text-[11px] text-white/80">
                    Sesi {selectedScheduleForStatus.sessionNumber} &bull; {selectedScheduleForStatus.examDate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheduleForStatus(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Sedang Mengerjakan</span>
                  <span className="text-xl font-bold text-blue-400">
                    {selectedScheduleForStatus.code.includes('BINDO') ? 1 : 0} Siswa
                  </span>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Sudah Selesai</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {selectedScheduleForStatus.code.includes('BINDO') ? 0 : 52} Siswa
                  </span>
                </div>
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Belum Masuk / Tdk Ikut</span>
                  <span className="text-xl font-bold text-rose-400">
                    {selectedScheduleForStatus.code.includes('BINDO') ? 52 : 1} Siswa
                  </span>
                </div>
              </div>

              {/* Sample Students List */}
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0e15] text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">NO. PESERTA</th>
                      <th className="py-2.5 px-3">NAMA LENGKAP</th>
                      <th className="py-2.5 px-3">RUANG</th>
                      <th className="py-2.5 px-3">SESI</th>
                      <th className="py-2.5 px-3">STATUS PENGERJAAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {students.slice(0, 10).map((st, i) => {
                      const isArjun = st.name.includes('ARJUN');
                      const isBindo = selectedScheduleForStatus.code.includes('BINDO');
                      const status = isBindo
                        ? isArjun
                          ? 'SEDANG_MENGERJAKAN'
                          : 'BELUM_MULAI'
                        : isArjun
                        ? 'BELUM_MULAI'
                        : 'SELESAI';

                      return (
                        <tr key={st.id} className="hover:bg-slate-800/40 odd:bg-slate-900/20">
                          <td className="py-2 px-3 text-slate-500 font-mono">{i + 1}</td>
                          <td className="py-2 px-3 font-mono text-slate-200">{st.noPeserta}</td>
                          <td className="py-2 px-3 font-bold text-slate-100 uppercase">{st.name}</td>
                          <td className="py-2 px-3 text-slate-300">{st.room || 'LAB-01'}</td>
                          <td className="py-2 px-3 text-cyan-400 font-bold">{st.session || '1'}</td>
                          <td className="py-2 px-3">
                            {status === 'SEDANG_MENGERJAKAN' && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-bold">
                                Sedang Mengerjakan
                              </span>
                            )}
                            {status === 'SELESAI' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                                Selesai
                              </span>
                            )}
                            {status === 'BELUM_MULAI' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold">
                                Belum Mulai
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Menampilkan 10 peserta pertama dari total {students.length} siswa.</span>
                {onNavigateToLiveMonitor && (
                  <button
                    onClick={() => {
                      setSelectedScheduleForStatus(null);
                      onNavigateToLiveMonitor();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    <span>Buka Live Monitor Penuh</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
