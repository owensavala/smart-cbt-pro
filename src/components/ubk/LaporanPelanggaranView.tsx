'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Save,
  Users,
  AlertTriangle,
  Calendar,
  Lock,
  Unlock,
  Trash2,
  Filter,
  RotateCw,
  Search,
  Eye,
  CheckCircle2,
  X,
  Info,
  Clock,
} from 'lucide-react';
import { Student } from '@/lib/types';

interface ViolationLogDetail {
  id: string;
  timestamp: string;
  type: string;
  badgeColor: string;
  description: string;
}

interface StudentViolationItem {
  id: string;
  studentId: string;
  name: string;
  nisn: string;
  subjectCode: string;
  subjectName: string;
  className: string;
  totalViolations: number;
  maxLimit: number;
  isExceeded: boolean;
  isBlocked: boolean;
  lastViolationTime: string;
  logs: ViolationLogDetail[];
}

interface LaporanPelanggaranViewProps {
  students?: Student[];
  onUnlockStudent?: (studentId: string) => void;
  onClearViolations?: (studentId: string) => void;
}

export default function LaporanPelanggaranView({
  students = [],
  onUnlockStudent,
  onClearViolations,
}: LaporanPelanggaranViewProps) {
  // Security configuration states
  const [detectionFeature, setDetectionFeature] = useState<'AKTIF' | 'NON_AKTIF'>('AKTIF');
  const [maxViolations, setMaxViolations] = useState('5');
  const [reloginTime, setReloginTime] = useState('300');
  const [refreshInterval, setRefreshInterval] = useState('120');

  // Filter states
  const [filterExam, setFilterExam] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);

  // Selected student for detail log modal
  const [activeDetailItem, setActiveDetailItem] = useState<StudentViolationItem | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Seed sample violation items matching Images 10 & 11
  const [violationList, setViolationList] = useState<StudentViolationItem[]>([
    {
      id: 'v_7',
      studentId: 'std_sultan',
      name: 'SULTAN AL QUSYAIRY ASRA',
      nisn: '0136028490',
      subjectCode: 'BING-KLS-VI-1',
      subjectName: 'BAHASA INGGRIS',
      className: 'VI',
      totalViolations: 9,
      maxLimit: 5,
      isExceeded: true,
      isBlocked: true,
      lastViolationTime: '08/05/2026 09:59',
      logs: [
        {
          id: 'log_1',
          timestamp: '08/05/2026 09:42:10',
          type: 'Tab Switch',
          badgeColor: 'bg-yellow-400 text-black',
          description: 'Berpindah tab browser selama 6 detik (Grace Period 4 detik terlewati)',
        },
        {
          id: 'log_2',
          timestamp: '08/05/2026 09:46:15',
          type: 'Window Blur',
          badgeColor: 'bg-slate-500 text-white',
          description: 'Fokus jendela hilang (terbuka pop-up aplikasi eksternal)',
        },
        {
          id: 'log_3',
          timestamp: '08/05/2026 09:48:33',
          type: 'DevTools',
          badgeColor: 'bg-slate-700 text-white border border-slate-500',
          description: 'Mencoba menekan F12 atau membuka Inspect Element',
        },
        {
          id: 'log_4',
          timestamp: '08/05/2026 09:51:02',
          type: 'Copy',
          badgeColor: 'bg-red-500 text-white',
          description: 'Mencoba menyalin teks soal ujian (Ctrl+C)',
        },
        {
          id: 'log_5',
          timestamp: '08/05/2026 09:54:19',
          type: 'Right Click',
          badgeColor: 'bg-cyan-500 text-white',
          description: 'Mencoba klik kanan mouse pada layar lembar soal',
        },
        {
          id: 'log_6',
          timestamp: '08/05/2026 09:59:00',
          type: 'Fullscreen Exit',
          badgeColor: 'bg-blue-600 text-white',
          description: 'Keluar dari mode Fullscreen - Akun otomatis TERKUNCI (melebihi batas)',
        },
      ],
    },
    {
      id: 'v_8',
      studentId: 'std_ridho',
      name: 'MUHAMMAD RIDHO A. GANI',
      nisn: '0136028486',
      subjectCode: 'SBP-KLS-VI-1',
      subjectName: 'SENI BUDAYA DAN PRAKARYA',
      className: 'VI',
      totalViolations: 9,
      maxLimit: 5,
      isExceeded: true,
      isBlocked: true,
      lastViolationTime: '09/05/2026 08:16',
      logs: [
        {
          id: 'log_r1',
          timestamp: '09/05/2026 08:05:12',
          type: 'Tab Switch',
          badgeColor: 'bg-yellow-400 text-black',
          description: 'Beralih tab browser mencari contekan (7 detik)',
        },
        {
          id: 'log_r2',
          timestamp: '09/05/2026 08:12:44',
          type: 'Split Screen',
          badgeColor: 'bg-rose-500 text-white',
          description: 'Membuka dua jendela berdampingan di Android / Windows',
        },
        {
          id: 'log_r3',
          timestamp: '09/05/2026 08:16:00',
          type: 'App Switch',
          badgeColor: 'bg-amber-500 text-white',
          description: 'Membuka aplikasi WhatsApp / Telegram saat ujian',
        },
      ],
    },
    {
      id: 'v_9',
      studentId: 'std_rizza',
      name: 'RIZZA RAZABULLAH',
      nisn: '0136028492',
      subjectCode: 'SBP-KLS-VI-1',
      subjectName: 'SENI BUDAYA DAN PRAKARYA',
      className: 'VI',
      totalViolations: 9,
      maxLimit: 5,
      isExceeded: true,
      isBlocked: true,
      lastViolationTime: '09/05/2026 08:37',
      logs: [
        {
          id: 'log_z1',
          timestamp: '09/05/2026 08:20:10',
          type: 'Paste',
          badgeColor: 'bg-pink-500 text-white',
          description: 'Mencoba menempel teks dari clipboard (Ctrl+V)',
        },
        {
          id: 'log_z2',
          timestamp: '09/05/2026 08:30:22',
          type: 'Resize',
          badgeColor: 'bg-emerald-500 text-white',
          description: 'Mengecilkan ukuran jendela ujian ke background',
        },
        {
          id: 'log_z3',
          timestamp: '09/05/2026 08:37:00',
          type: 'Keyboard Shortcut',
          badgeColor: 'bg-teal-600 text-white',
          description: 'Menekan kombinasi tombol terlarang (Alt+Tab)',
        },
      ],
    },
  ]);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'cbt_security_config',
        JSON.stringify({ detectionFeature, maxViolations, reloginTime, refreshInterval })
      );
    }
    showToast('Pengaturan keamanan dan anti-cheat ujian berhasil disimpan!');
  };

  const handleUnblockAll = () => {
    if (confirm('Buka blokir untuk semua siswa yang saat ini terkunci?')) {
      setViolationList((prev) =>
        prev.map((item) => ({ ...item, isBlocked: false, isExceeded: false }))
      );
      showToast('Seluruh siswa terblokir berhasil dibuka kuncinya!');
    }
  };

  const handleClearAll = () => {
    if (confirm('Hapus seluruh riwayat log pelanggaran dari sistem?')) {
      setViolationList([]);
      showToast('Semua catatan pelanggaran berhasil dihapus!');
    }
  };

  const handleClearSingle = (id: string, name: string) => {
    if (confirm(`Hapus catatan pelanggaran untuk ${name}?`)) {
      setViolationList((prev) => prev.filter((d) => d.id !== id));
      if (onClearViolations) {
        onClearViolations(id);
      }
      showToast(`Catatan pelanggaran ${name} berhasil dibersihkan.`);
    }
  };

  const filteredData = useMemo(() => {
    return violationList.filter((item) => {
      const matchExam = filterExam === 'ALL' || item.subjectCode === filterExam;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchExam && matchSearch;
    });
  }, [violationList, filterExam, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

  // 13 Badges list matching reference screenshot
  const violationBadges = [
    { name: 'Tab Switch', color: 'bg-yellow-400 text-black' },
    { name: 'Copy', color: 'bg-red-500 text-white' },
    { name: 'Paste', color: 'bg-pink-500 text-white' },
    { name: 'Right Click', color: 'bg-cyan-500 text-white' },
    { name: 'DevTools', color: 'bg-slate-700 text-white border border-slate-500' },
    { name: 'Fullscreen Exit', color: 'bg-blue-600 text-white' },
    { name: 'Window Blur', color: 'bg-slate-500 text-white' },
    { name: 'Resize', color: 'bg-emerald-500 text-white' },
    { name: 'Print', color: 'bg-purple-600 text-white' },
    { name: 'Split Screen', color: 'bg-rose-500 text-white' },
    { name: 'App Switch', color: 'bg-amber-500 text-white' },
    { name: 'Keyboard Shortcut', color: 'bg-teal-600 text-white' },
    { name: 'Gesture Curiga', color: 'bg-indigo-600 text-white' },
  ];

  return (
    <div className="space-y-4">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          Laporan Pelanggaran Keamanan Ujian
        </h1>
      </div>

      {/* Card 1: Pengaturan Keamanan Ujian matching reference */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <ShieldAlert className="w-4 h-4 text-slate-300" />
          <span>Pengaturan Keamanan Ujian</span>
        </div>

        <form onSubmit={handleSaveSecurity} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fitur Deteksi Pelanggaran */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Fitur Deteksi Pelanggaran:
              </label>
              <select
                value={detectionFeature}
                onChange={(e) => setDetectionFeature(e.target.value as any)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="NON_AKTIF">NON-AKTIF</option>
              </select>
            </div>

            {/* Maksimal Pelanggaran (Blokir) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Maksimal Pelanggaran (Blokir):
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={maxViolations}
                  onChange={(e) => setMaxViolations(e.target.value)}
                  className="w-full bg-[#1e2330] border border-r-0 border-slate-700 rounded-l-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="bg-slate-800 border border-slate-700 rounded-r-lg px-3 py-2 text-xs text-slate-300 font-semibold flex items-center">
                  Kali
                </span>
              </div>
            </div>

            {/* Waktu Login Kembali */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Waktu Login Kembali:
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={reloginTime}
                  onChange={(e) => setReloginTime(e.target.value)}
                  className="w-full bg-[#1e2330] border border-r-0 border-slate-700 rounded-l-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="bg-slate-800 border border-slate-700 rounded-r-lg px-3 py-2 text-xs text-slate-300 font-semibold flex items-center">
                  Detik
                </span>
              </div>
            </div>

            {/* Waktu Refresh Monitoring */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Waktu Refresh Monitoring:
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="w-full bg-[#1e2330] border border-r-0 border-slate-700 rounded-l-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="bg-slate-800 border border-slate-700 rounded-r-lg px-3 py-2 text-xs text-slate-300 font-semibold flex items-center">
                  Detik
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4 Stat Cards matching reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pelanggaran (Red) */}
        <div className="bg-[#e74c3c] text-white p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-28">
          <div>
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              196
            </span>
            <span className="text-xs font-semibold opacity-90 mt-1 block">
              Total Pelanggaran
            </span>
          </div>
          <AlertTriangle className="absolute right-3 top-3 w-20 h-20 text-white/10 pointer-events-none" />
        </div>

        {/* Card 2: Siswa Melanggar (Amber/Orange) */}
        <div className="bg-[#f39c12] text-white p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-28">
          <div>
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              27
            </span>
            <span className="text-xs font-semibold opacity-90 mt-1 block">
              Siswa Melanggar
            </span>
          </div>
          <Users className="absolute right-3 top-3 w-20 h-20 text-white/10 pointer-events-none" />
        </div>

        {/* Card 3: Pelanggaran Hari Ini (Teal/Emerald) */}
        <div className="bg-[#1abc9c] text-white p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-28">
          <div>
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              0
            </span>
            <span className="text-xs font-semibold opacity-90 mt-1 block">
              Pelanggaran Hari Ini
            </span>
          </div>
          <Calendar className="absolute right-3 top-3 w-20 h-20 text-white/10 pointer-events-none" />
        </div>

        {/* Card 4: Siswa Terblokir (Grey) */}
        <div className="bg-[#7f8c8d] text-white p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-28">
          <div>
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              6
            </span>
            <span className="text-xs font-semibold opacity-90 mt-1 block">
              Siswa Terblokir
            </span>
          </div>
          <Lock className="absolute right-3 top-3 w-20 h-20 text-white/10 pointer-events-none" />
        </div>
      </div>

      {/* Main Filter & Action Bar */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Left: Filter Exam Dropdown + Filter & Refresh buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              FILTER UJIAN:
            </span>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="bg-[#1e2330] border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-52"
            >
              <option value="ALL">- Semua Ujian -</option>
              <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1</option>
              <option value="SBP-KLS-VI-1">SBP-KLS-VI-1</option>
              <option value="BING-KLS-VI-1">BING-KLS-VI-1</option>
              <option value="SKI-KLS-VI-1">SKI-KLS-VI-1</option>
            </select>
            <button
              onClick={() => showToast('Filter diterapkan.')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Search className="w-3.5 h-3.5" />
              <span>FILTER</span>
            </button>
            <button
              onClick={() => showToast('Memperbarui data pelanggaran...')}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Buka Blokir Semua & Hapus Semua buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUnblockAll}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>BUKA BLOK SEMUA</span>
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>HAPUS SEMUA</span>
            </button>
          </div>
        </div>

        {/* 13 Badges Legend matching reference screenshot */}
        <div className="bg-[#181d28] border border-slate-700/60 rounded-lg p-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-semibold text-[11px] shrink-0">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Jenis Pelanggaran:</span>
            </span>
            {violationBadges.map((b) => (
              <span
                key={b.name}
                className={`${b.color} font-semibold rounded-full px-2.5 py-0.5 text-[10px] tracking-wide inline-flex items-center shadow-xs`}
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Entries & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#181d28] border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Data</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Cari Siswa:</span>
            <input
              type="text"
              placeholder="Ketik nama siswa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#181d28] border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table matching reference screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-4">NAMA SISWA</th>
                <th className="py-3 px-4">MATA PELAJARAN</th>
                <th className="py-3 px-4 text-center">KELAS</th>
                <th className="py-3 px-4 text-center">TOTAL PELANGGARAN</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center">WAKTU TERAKHIR</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Tidak ada data pelanggaran yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const actualIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {actualIdx}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">
                        {item.subjectCode}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-400">
                        {item.className}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="bg-[#f1c40f] text-slate-950 font-black px-2.5 py-0.5 rounded text-xs shadow-xs">
                            {item.totalViolations} Kali
                          </span>
                          {item.totalViolations > item.maxLimit && (
                            <span className="text-[10px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Melebihi batas ({item.maxLimit})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.isExceeded ? (
                          <span className="bg-[#f39c12] text-slate-950 font-bold px-3 py-1 rounded text-[11px] inline-flex items-center gap-1.5 shadow-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Batas Terlampaui</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300">
                        {item.lastViolationTime}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.isBlocked && (
                            <button
                              onClick={() => {
                                onUnlockStudent?.(item.studentId);
                                setViolationList((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id ? { ...i, isBlocked: false, isExceeded: false, totalViolations: 0 } : i
                                  )
                                );
                                showToast(`Kunci ujian untuk ${item.name} berhasil dibuka jarak jauh!`);
                              }}
                              title="Buka Kunci Ujian Siswa (Remote Unlock)"
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold hidden sm:inline">Buka Kunci</span>
                            </button>
                          )}
                          <button
                            onClick={() => setActiveDetailItem(item)}
                            title="Lihat Detail Log Pelanggaran"
                            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleClearSingle(item.id, item.name)}
                            title="Hapus Pelanggaran Siswa"
                            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors shadow-xs cursor-pointer"
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

        {/* Pagination & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing{' '}
            {filteredData.length === 0
              ? '0 to 0 of 0'
              : `${(currentPage - 1) * entriesPerPage + 1} to ${Math.min(
                  currentPage * entriesPerPage,
                  filteredData.length
                )} of ${filteredData.length}`}{' '}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#181d28] border border-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded font-bold">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-[#181d28] border border-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Violation Logs Modal (When 'Eye' button is clicked) */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Detail Log Pelanggaran Anti-Cheat
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeDetailItem.name} ({activeDetailItem.subjectCode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDetailItem(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student info summary */}
            <div className="bg-[#181d28] rounded-xl p-4 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Peserta</span>
                <span className="font-bold text-white text-sm">{activeDetailItem.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kelas & Mapel</span>
                <span className="font-mono text-sky-400">
                  {activeDetailItem.className} - {activeDetailItem.subjectCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Pelanggaran</span>
                <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-xs">
                  {activeDetailItem.totalViolations} Kali
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status Kunci</span>
                <span className="text-rose-400 font-bold block">
                  {activeDetailItem.isBlocked ? '🔒 Terkunci' : 'Aktif'}
                </span>
                {activeDetailItem.isBlocked && (
                  <button
                    onClick={() => {
                      onUnlockStudent?.(activeDetailItem.studentId);
                      setViolationList((prev) =>
                        prev.map((i) =>
                          i.id === activeDetailItem.id
                            ? { ...i, isBlocked: false, isExceeded: false, totalViolations: 0 }
                            : i
                        )
                      );
                      setActiveDetailItem((prev) =>
                        prev ? { ...prev, isBlocked: false, isExceeded: false, totalViolations: 0 } : null
                      );
                      showToast(`Kunci ujian untuk ${activeDetailItem.name} berhasil dibuka jarak jauh!`);
                    }}
                    className="mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Buka Kunci Remote</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Kronologi Kejadian Rekaman Anti-Cheat:
              </span>
              <div className="space-y-2.5">
                {activeDetailItem.logs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#181d28] border border-slate-700/60 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          #{idx + 1}
                        </span>
                        <span
                          className={`${log.badgeColor} font-bold rounded-full px-2 py-0.5 text-[10px] tracking-wide inline-flex items-center`}
                        >
                          {log.type}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 pl-5">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  if (activeDetailItem) {
                    setViolationList((prev) =>
                      prev.map((item) =>
                        item.id === activeDetailItem.id
                          ? { ...item, isBlocked: false, isExceeded: false }
                          : item
                      )
                    );
                    setActiveDetailItem(null);
                    showToast(`Siswa ${activeDetailItem.name} berhasil di-unblock!`);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Buka Blokir Siswa Ini</span>
              </button>

              <button
                onClick={() => setActiveDetailItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
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
