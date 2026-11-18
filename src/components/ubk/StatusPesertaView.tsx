'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Check,
  X,
  MapPin,
  Clock,
  RefreshCw,
  FolderSync,
  HelpCircle,
  KeyRound,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { StudentSession, Student, ExamSchedule, SchoolClass } from '@/lib/types';

interface StatusPesertaViewProps {
  students: Student[];
  studentSessions: StudentSession[];
  schedules?: ExamSchedule[];
  classes?: SchoolClass[];
  onResetStudentSession?: (studentId: string) => void;
  onBlockStudentSession?: (studentId: string) => void;
  onFinishStudentSession?: (studentId: string) => void;
  onRefresh?: () => void;
  onNavigateToToken?: () => void;
  onNavigateToReset?: () => void;
  onNavigateToPelanggaran?: () => void;
  onNavigateToNilai?: () => void;
}

export default function StatusPesertaView({
  students,
  studentSessions,
  schedules = [],
  classes = [],
  onResetStudentSession,
  onBlockStudentSession,
  onFinishStudentSession,
  onRefresh,
  onNavigateToToken,
  onNavigateToReset,
  onNavigateToPelanggaran,
  onNavigateToNilai,
}: StatusPesertaViewProps) {
  const [filterJurusan, setFilterJurusan] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Local state for actions
  const [blockedStudentIds, setBlockedStudentIds] = useState<Set<string>>(new Set());
  const [forceFinishedIds, setForceFinishedIds] = useState<Set<string>>(new Set());
  const [forceFinishButtonVisible, setForceFinishButtonVisible] = useState(false);
  const [finishButtonLocked, setFinishButtonLocked] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Seed live participants matching Image 2
  const participants = useMemo(() => {
    return [
      {
        id: 'p_1',
        studentId: 'std_arjun',
        name: 'ARJUN',
        nis: '12345678',
        className: 'VI',
        jurusan: 'MI',
        examCode: 'BINDO-KLS-VI-1',
        examType: 'UMBK',
        subjectName: 'BAHASA INDONESIA',
        duration: '1m 31d',
        status: forceFinishedIds.has('std_arjun') ? 'SELESAI' : 'SEDANG_MENGERJAKAN',
        isBlocked: blockedStudentIds.has('std_arjun'),
        correctCount: null,
        wrongCount: null,
        score: null,
        ipAddress: '114.125.185.122',
        location: 'GPS Aktif',
        muncul: false,
      },
      {
        id: 'p_2',
        studentId: 'std_ridho',
        name: 'MUHAMMAD RIDHO A. GANI',
        nis: '0136028486',
        className: 'VI',
        jurusan: 'MI',
        examCode: 'SBP-KLS-VI-1',
        examType: 'UMBK',
        subjectName: 'SENI BUDAYA DAN PRAKARYA',
        duration: '1j 34m 59d',
        status: 'SELESAI',
        isBlocked: false,
        correctCount: 15,
        wrongCount: 25,
        score: 37.5,
        ipAddress: '182.5.9.18',
        location: 'GPS Aktif',
        muncul: true,
      },
      {
        id: 'p_3',
        studentId: 'std_sultan',
        name: 'SULTAN AL QUSYAIRY ASRA',
        nis: '3138848262',
        className: 'VI',
        jurusan: 'MI',
        examCode: 'BING-KLS-VI-1',
        examType: 'UMBK',
        subjectName: 'BAHASA INGGRIS',
        duration: '1j 20m 10d',
        status: 'SELESAI',
        isBlocked: false,
        correctCount: 28,
        wrongCount: 12,
        score: 70.0,
        ipAddress: '114.125.180.44',
        location: 'GPS Aktif',
        muncul: true,
      },
      {
        id: 'p_4',
        studentId: 'std_rizza',
        name: 'RIZZA RAZABULLAH',
        nis: '3139266943',
        className: 'VI',
        jurusan: 'MI',
        examCode: 'SKI-KLS-VI-1',
        examType: 'UMBK',
        subjectName: 'SEJARAH KEBUDAYAAN ISLAM',
        duration: '1j 25m 00d',
        status: 'SELESAI',
        isBlocked: false,
        correctCount: 32,
        wrongCount: 8,
        score: 80.0,
        ipAddress: '182.5.9.22',
        location: 'GPS Aktif',
        muncul: true,
      },
    ];
  }, [blockedStudentIds, forceFinishedIds]);

  // Filtered List
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (filterJurusan !== 'ALL' && p.jurusan !== filterJurusan) return false;
      if (filterKelas !== 'ALL' && p.className !== filterKelas) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nis.includes(q) ||
          p.examCode.toLowerCase().includes(q) ||
          p.ipAddress.includes(q)
        );
      }
      return true;
    });
  }, [participants, filterJurusan, filterKelas, searchTerm]);

  // Handlers
  const handleToggleBlock = (studentId: string, name: string) => {
    setBlockedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
        onResetStudentSession?.(studentId);
        showToast(`Blokir / kunci ujian peserta ${name} berhasil dibuka jarak jauh.`, 'info');
      } else {
        next.add(studentId);
        onBlockStudentSession?.(studentId);
        showToast(`Peserta ${name} berhasil diblokir dari ujian!`, 'error');
      }
      return next;
    });
  };

  const handleForceFinish = (studentId: string, name: string) => {
    if (confirm(`Paksa selesaikan ujian untuk ${name}? Jawaban saat ini akan dikirim.`)) {
      setForceFinishedIds((prev) => new Set(prev).add(studentId));
      showToast(`Ujian untuk peserta ${name} berhasil dipaksa selesai!`, 'success');
    }
  };

  const handleResetStudent = (studentId: string, name: string) => {
    if (confirm(`Ulang ujian untuk ${name}? Seluruh jawaban tersimpan akan direset.`)) {
      setForceFinishedIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
      showToast(`Ujian peserta ${name} direset. Siswa dapat login kembali.`, 'info');
    }
  };

  return (
    <div className="space-y-4">
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
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          STATUS PESERTA
        </h1>
      </div>

      {/* Orange Alert Banner (Matching Image 2) */}
      <div className="bg-amber-500/90 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>Status Peserta Akan Muncul Saat Ujian Berlangsung...</span>
        </div>
        <button className="text-slate-950/70 hover:text-slate-950 font-bold cursor-pointer">✕</button>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Sub-Header */}
        <div className="text-xs text-slate-300 font-semibold">
          Status Peserta <span className="text-slate-500 font-normal">( Status Peserta Bisa Juga di Lihat Pada Menu Status Ujian -&gt; Status )</span>
        </div>

        {/* Action Buttons Row (Matching Image 2) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-3 border-b border-slate-800">
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Info Baca Dulu</span>
          </button>

          <button
            onClick={() => {
              setForceFinishButtonVisible(!forceFinishButtonVisible);
              showToast(
                forceFinishButtonVisible ? 'Tombol selesai dinonaktifkan.' : 'Tombol selesai dipaksa muncul di layar siswa!',
                'success'
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tampil Paksa Tombol Selesai</span>
          </button>

          <button
            onClick={() => {
              setFinishButtonLocked(!finishButtonLocked);
              showToast(
                finishButtonLocked ? 'Kunci tombol selesai dibuka.' : 'Tombol selesai siswa berhasil dikunci!',
                'info'
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Kunci Tombol Selesai</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Selesaikan seluruh ujian siswa yang sedang aktif?')) {
                setForceFinishedIds(new Set(['std_arjun', 'std_ridho', 'std_sultan', 'std_rizza']));
                showToast('Seluruh ujian siswa berhasil diselesaikan otomatis!', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Selesaikan Semua Ujian</span>
          </button>

          <button
            onClick={() => showToast('Sinkronisasi nilai dan rubrik esai AI selesai dilakukan.', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkron Semua Skor</span>
          </button>

          <button
            onClick={() => showToast('Seluruh nilai dipindahkan ke arsip nilai UBK.', 'success')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Pindah Semua Nilai</span>
          </button>
        </div>

        {/* Quick Cross-Menu Navigation Bar */}
        {(onNavigateToToken || onNavigateToReset || onNavigateToPelanggaran || onNavigateToNilai) && (
          <div className="flex flex-wrap items-center gap-2 py-2 px-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
            <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
              ⚡ Pintasan Menu Terkait:
            </span>
            {onNavigateToToken && (
              <button
                onClick={onNavigateToToken}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold cursor-pointer transition-colors"
                title="Buka Menu Rilis Token UBK"
              >
                <KeyRound className="w-3 h-3 text-blue-400" />
                <span>Rilis Token UBK</span>
              </button>
            )}
            {onNavigateToReset && (
              <button
                onClick={onNavigateToReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold cursor-pointer transition-colors"
                title="Buka Menu Reset Login Peserta"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset Login Siswa</span>
              </button>
            )}
            {onNavigateToPelanggaran && (
              <button
                onClick={onNavigateToPelanggaran}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold cursor-pointer transition-colors"
                title="Buka Laporan Pelanggaran / Anti-Cheat"
              >
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Laporan Pelanggaran</span>
              </button>
            )}
            {onNavigateToNilai && (
              <button
                onClick={onNavigateToNilai}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer transition-colors"
                title="Buka Hasil Nilai Ujian"
              >
                <Award className="w-3 h-3 text-emerald-400" />
                <span>Hasil Nilai</span>
              </button>
            )}
          </div>
        )}

        {/* Filter Inputs & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Pilih Jurusan</option>
              <option value="MI">Madrasah Ibtidaiyah (MI)</option>
              <option value="IPA">IPA</option>
              <option value="IPS">IPS</option>
            </select>

            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Pilih Kelas</option>
              <option value="X">Kelas X</option>
              <option value="VI-A">VI-A</option>
              <option value="VI-B">VI-B</option>
            </select>

            <button
              onClick={() => showToast('Data status peserta berhasil diperbarui.', 'info')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Data</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            Kunci Tombol Selesai Akan Berfungsi Maksimal Jika Tombol Selesai di Kosongkan
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama / NIS / mapel..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Live Status Peserta Table (Matching Image 2) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center text-slate-500">NO</th>
                <th className="py-3 px-3 text-center">AKSI CONTROL</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">NAMA PESERTA</th>
                <th className="py-3 px-3">KELAS</th>
                <th className="py-3 px-3">MATA PELAJARAN / UJIAN</th>
                <th className="py-3 px-3">DURASI</th>
                <th className="py-3 px-3 text-center">JAWABAN</th>
                <th className="py-3 px-3 text-center">SKOR</th>
                <th className="py-3 px-3">IP ADDRESS</th>
                <th className="py-3 px-3 text-center">LOKASI</th>
                <th className="py-3 px-3 text-center">MUNCUL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredParticipants.map((p, idx) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                >
                  <td className="py-3 px-3 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>

                  {/* AKSI CONTROL */}
                  <td className="py-3 px-3 text-center">
                    {p.status === 'SEDANG_MENGERJAKAN' ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleForceFinish(p.studentId, p.name)}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer"
                        >
                          Selesai
                        </button>
                        <button
                          onClick={() => handleToggleBlock(p.studentId, p.name)}
                          className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                            p.isBlocked
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600 hover:text-white'
                          }`}
                        >
                          {p.isBlocked ? 'Buka' : 'Blok'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleResetStudent(p.studentId, p.name)}
                          className="px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] cursor-pointer"
                        >
                          Ulang
                        </button>
                        <button
                          onClick={() => showToast(`Nilai ${p.name} dipindahkan ke arsip.`, 'info')}
                          className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] cursor-pointer"
                        >
                          Pindah
                        </button>
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-3">
                    {p.status === 'SEDANG_MENGERJAKAN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[11px] shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        <span>Masih Dikerjakan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
                        <span>Tes Selesai</span>
                      </span>
                    )}
                  </td>

                  {/* NAMA PESERTA */}
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-white text-xs uppercase">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.nis}</div>
                  </td>

                  {/* KELAS */}
                  <td className="py-3 px-3 font-bold text-sky-400">
                    {p.className}
                  </td>

                  {/* MATA PELAJARAN / UJIAN */}
                  <td className="py-3 px-3 space-y-1">
                    <div className="font-bold text-white text-xs">{p.examCode}</div>
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.2 rounded bg-rose-950/70 border border-rose-500/40 text-rose-300 text-[9px] font-bold">
                        {p.examType}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-bold">
                        {p.className}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold">
                        CBT
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {p.subjectName}
                    </div>
                  </td>

                  {/* DURASI */}
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {p.duration}
                  </td>

                  {/* JAWABAN */}
                  <td className="py-3 px-3 text-center">
                    {p.correctCount !== null ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                          {p.correctCount}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                          {p.wrongCount}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">--</span>
                    )}
                  </td>

                  {/* SKOR */}
                  <td className="py-3 px-3 text-center font-bold">
                    {p.score !== null ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono">
                        {p.score.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-500">--</span>
                    )}
                  </td>

                  {/* IP ADDRESS */}
                  <td className="py-3 px-3 font-mono text-rose-400 text-[11px]">
                    {p.ipAddress}
                  </td>

                  {/* LOKASI */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-[10px]">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>GPS</span>
                    </span>
                  </td>

                  {/* MUNCUL */}
                  <td className="py-3 px-3 text-center">
                    {p.muncul ? (
                      <span className="text-emerald-400 font-bold">✔</span>
                    ) : (
                      <span className="text-rose-400 font-mono text-[11px]">Null X</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
