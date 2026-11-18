'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  RotateCw,
  CheckCircle2,
  Clock,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import { Student } from '@/lib/types';

interface HistoryAnswerItem {
  id: string;
  name: string;
  nis: string;
  className: string;
  examCode: string;
  examType: string;
  examDate: string;
  correctAnswers: number;
  wrongAnswers: number;
  historyScore: number;
  currentScore: number;
  status: 'Lulus' | 'Belum Lulus';
}

export default function HistoryNilaiView() {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [filterUjian, setFilterUjian] = useState('ALL');
  const [showAllData, setShowAllData] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Exact data from reference screenshot (Images 7 & 8)
  const [historyList, setHistoryList] = useState<HistoryAnswerItem[]>([
    {
      id: 'h_1',
      name: 'ABDUL ADZIM',
      nis: '3138848262',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 35,
      wrongAnswers: 5,
      historyScore: 86.63,
      currentScore: 87.5,
      status: 'Lulus',
    },
    {
      id: 'h_2',
      name: 'AFHIF U SANGADJI',
      nis: '0133471482',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 34,
      wrongAnswers: 6,
      historyScore: 84.15,
      currentScore: 85.0,
      status: 'Lulus',
    },
    {
      id: 'h_3',
      name: 'AHMAD JIBRIL MUHAMMAD',
      nis: '3139266943',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 26,
      wrongAnswers: 14,
      historyScore: 64.35,
      currentScore: 65.0,
      status: 'Lulus',
    },
    {
      id: 'h_4',
      name: 'AHMAD SYAMIL AYYASHA',
      nis: '3138601804',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 34,
      wrongAnswers: 6,
      historyScore: 84.15,
      currentScore: 85.0,
      status: 'Lulus',
    },
    {
      id: 'h_5',
      name: 'AL HAFIZD DJ. RAIS',
      nis: '3142416183',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 15,
      wrongAnswers: 25,
      historyScore: 37.13,
      currentScore: 37.5,
      status: 'Belum Lulus',
    },
    {
      id: 'h_6',
      name: 'ALYA ZAHIDAH DAENG MAPATO',
      nis: '0146882570',
      className: 'X',
      examCode: 'SKI-KLS-VI-1',
      examType: 'CBT',
      examDate: '2026-05-08 09:00:00',
      correctAnswers: 36,
      wrongAnswers: 4,
      historyScore: 89.1,
      currentScore: 90.0,
      status: 'Lulus',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSync = (item: HistoryAnswerItem) => {
    showToast(`Menyelaraskan nilai terkini untuk ${item.name}...`);
    setTimeout(() => {
      setHistoryList((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, historyScore: h.currentScore } : h
        )
      );
      showToast(`Nilai ${item.name} berhasil disinkronkan ke skor database: ${item.currentScore.toFixed(2)}`);
    }, 800);
  };

  const handleExportExcel = () => {
    showToast('Mengekspor riwayat jawaban siswa ke format Excel...');
  };

  const filteredData = useMemo(() => {
    return historyList.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.examCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [historyList, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

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
          Detail Riwayat Jawaban Siswa
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header matching Images 7 & 8 */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <History className="w-4 h-4 text-slate-300" />
          <span>Detail Riwayat Jawaban Siswa</span>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              PILIH LEVEL
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Pilih Level</option>
              <option value="VI">Tingkat VI</option>
              <option value="V">Tingkat V</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              PILIH KELAS
            </label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Pilih Kelas</option>
              <option value="VI">Kelas X</option>
              <option value="V">Kelas V</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              PILIH UJIAN/JADWAL
            </label>
            <select
              value={filterUjian}
              onChange={(e) => setFilterUjian(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Pilih Ujian</option>
              <option value="SKI-KLS-VI-1">SKI-KLS-VI-1</option>
              <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1</option>
              <option value="SBP-KLS-VI-1">SBP-KLS-VI-1</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => showToast('Filter pencarian riwayat diterapkan.')}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>CARI</span>
            </button>
          </div>
        </div>

        {/* Secondary toolbar matching reference screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download to Excel</span>
          </button>

          {/* Toggle Switch */}
          <div
            onClick={() => setShowAllData(!showAllData)}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div
              className={`w-9 h-5 rounded-full transition-colors relative ${
                showAllData ? 'bg-rose-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                  showAllData ? 'left-5' : 'left-1'
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Tampilkan Semua Data (Tanpa Filter Anomali)
            </span>
          </div>
        </div>

        {/* Controls: entries per page & search */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Show</span>
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
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Search:</span>
            <input
              type="text"
              placeholder="Cari siswa / NIS..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#181d28] border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table matching reference screenshot Images 7 & 8 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">SISWA (NIS)</th>
                <th className="py-3 px-4">UJIAN / JADWAL</th>
                <th className="py-3 px-3 text-center">PG (B/S)</th>
                <th className="py-3 px-3 text-center">SKOR HISTORI</th>
                <th className="py-3 px-4 text-center">NILAI SEKARANG</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedData.map((item, idx) => {
                const actualIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {actualIdx}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block uppercase">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          NIS: {item.nis} | Kelas: {item.className}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">
                            {item.examCode}
                          </span>
                          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                            {item.examType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.examDate}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="bg-emerald-500 text-white font-black px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-0.5 shadow-xs">
                          <span>{item.correctAnswers}</span>
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-0.5 shadow-xs">
                          <span>{item.wrongAnswers}</span>
                          <X className="w-3 h-3" />
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded font-mono font-black text-xs">
                        {item.historyScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="bg-slate-900/80 border border-slate-700/80 rounded px-2.5 py-1 inline-block">
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Database:
                        </span>
                        <span className="text-white font-black font-mono text-xs block">
                          {item.currentScore.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status === 'Lulus' ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded font-bold text-[11px]">
                          Lulus
                        </span>
                      ) : (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded font-bold text-[11px]">
                          Belum Lulus
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSync(item)}
                        className="px-2.5 py-1 bg-[#0f766e] hover:bg-[#0d9488] text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Sinkron</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing 1 to {Math.min(entriesPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
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
    </div>
  );
}
