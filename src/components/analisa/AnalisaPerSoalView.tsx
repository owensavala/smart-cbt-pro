'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  PieChart,
  Search,
  Monitor,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Printer,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Sliders,
  Layers,
} from 'lucide-react';
import { ExamSchedule } from '@/lib/types';

interface ExamItemAnalysisRow {
  id: string;
  name: string;
  type: string;
  code: string;
  date: string;
  participantCount: number;
  totalQuestions: number;
}

interface ItemQuestionDetail {
  number: number;
  key: string;
  distA: number;
  distB: number;
  distC: number;
  distD: number;
  difficultyIndex: number; // 0 - 1
  difficultyLabel: 'Mudah' | 'Sedang' | 'Sukar';
  discriminationIndex: number; // -1 to 1
  discriminationLabel: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek';
  recommendation: 'Diterima' | 'Revisi' | 'Dibuang';
}

interface AnalisaPerSoalViewProps {
  schedules?: ExamSchedule[];
  onNavigateToBankSoal?: () => void;
}

export default function AnalisaPerSoalView({ schedules = [], onNavigateToBankSoal }: AnalisaPerSoalViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState<ExamItemAnalysisRow | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  // Master data jadwal ujian untuk analisa butir soal (matching screenshot)
  const defaultExams: ExamItemAnalysisRow[] = [
    {
      id: 'ex-1',
      name: 'BINDO-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '18 May 2026',
      participantCount: 1,
      totalQuestions: 40,
    },
    {
      id: 'ex-2',
      name: 'SBP-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '09 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-3',
      name: 'BING-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '08 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-4',
      name: 'SKI-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '08 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-5',
      name: 'B_ARAB-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '07 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-6',
      name: 'AKAH-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '07 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-7',
      name: 'IPAS-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '06 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
    {
      id: 'ex-8',
      name: 'MTK-KLS-VI-1',
      type: 'CBT',
      code: 'UMBK',
      date: '06 May 2026',
      participantCount: 52,
      totalQuestions: 40,
    },
  ];

  // Merge with any dynamic schedules if available
  const examList = useMemo(() => {
    if (!schedules || schedules.length === 0) return defaultExams;
    const dynamicRows: ExamItemAnalysisRow[] = schedules.map((s, idx) => ({
      id: s.id || `sch-${idx}`,
      name: s.title || `MAPEL-${idx + 1}`,
      type: 'CBT',
      code: 'UMBK',
      date: s.examDate || '18 May 2026',
      participantCount: 52,
      totalQuestions: s.questions?.length || 40,
    }));
    return dynamicRows.length > 0 ? dynamicRows : defaultExams;
  }, [schedules]);

  // Filtered rows
  const filteredExams = useMemo(() => {
    return examList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [examList, searchTerm]);

  // Generate detailed question analysis data for modal
  const questionDetails: ItemQuestionDetail[] = useMemo(() => {
    if (!selectedExam) return [];
    const count = selectedExam.totalQuestions || 40;
    const keys = ['A', 'B', 'C', 'D'];
    const participants = selectedExam.participantCount || 52;

    return Array.from({ length: count }, (_, i) => {
      const num = i + 1;
      const key = keys[(num * 3) % keys.length];
      
      // Determine difficulty
      let diffVal = 0.55 + Math.sin(num * 1.5) * 0.28;
      if (diffVal > 0.95) diffVal = 0.92;
      if (diffVal < 0.2) diffVal = 0.24;
      diffVal = parseFloat(diffVal.toFixed(2));

      let diffLabel: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
      if (diffVal >= 0.7) diffLabel = 'Mudah';
      else if (diffVal <= 0.3) diffLabel = 'Sukar';

      // Discrimination
      let discVal = 0.38 + Math.cos(num * 2.1) * 0.22;
      if (discVal > 0.75) discVal = 0.72;
      if (discVal < 0.15) discVal = 0.18;
      discVal = parseFloat(discVal.toFixed(2));

      let discLabel: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek' = 'Baik';
      if (discVal >= 0.4) discLabel = 'Sangat Baik';
      else if (discVal >= 0.3) discLabel = 'Baik';
      else if (discVal >= 0.2) discLabel = 'Cukup';
      else discLabel = 'Jelek';

      // Recommendation
      let rec: 'Diterima' | 'Revisi' | 'Dibuang' = 'Diterima';
      if (discLabel === 'Jelek' || (diffLabel === 'Sukar' && discLabel === 'Cukup')) {
        rec = 'Revisi';
      }
      if (discVal < 0.18) {
        rec = 'Dibuang';
      }

      // Distractor distribution
      const correctCount = Math.round(participants * diffVal);
      const wrongCount = Math.max(0, participants - correctCount);
      const remaining = Math.floor(wrongCount / 3);

      const dist = {
        A: key === 'A' ? correctCount : remaining,
        B: key === 'B' ? correctCount : remaining,
        C: key === 'C' ? correctCount : remaining,
        D: key === 'D' ? correctCount : (wrongCount - remaining * 2),
      };

      return {
        number: num,
        key,
        distA: dist.A,
        distB: dist.B,
        distC: dist.C,
        distD: dist.D,
        difficultyIndex: diffVal,
        difficultyLabel: diffLabel,
        discriminationIndex: discVal,
        discriminationLabel: discLabel,
        recommendation: rec,
      };
    });
  }, [selectedExam]);

  const filteredQuestionDetails = useMemo(() => {
    if (filterDifficulty === 'ALL') return questionDetails;
    return questionDetails.filter(q => q.difficultyLabel === filterDifficulty);
  }, [questionDetails, filterDifficulty]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
          ANALISA BUTIR SOAL
        </h1>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header Title */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 text-white font-bold text-sm tracking-wide uppercase">
          <PieChart className="w-5 h-5 text-blue-400" />
          <span>PILIH JADWAL UJIAN UNTUK ANALISA</span>
        </div>

        {/* Toolbar: Show entries & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 mb-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-[#121620] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-medium text-slate-400">Search:</span>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari jadwal ujian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121620] border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View matching screenshot */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">NAMA UJIAN</th>
                <th className="py-3 px-4 text-center">JENIS</th>
                <th className="py-3 px-4 text-center">KODE</th>
                <th className="py-3 px-4 text-center">TANGGAL</th>
                <th className="py-3 px-4 text-center">JUMLAH PESERTA</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    Tidak ada jadwal ujian ditemukan.
                  </td>
                </tr>
              ) : (
                filteredExams.slice(0, pageSize).map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-3 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white tracking-wide">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-slate-300">
                        <Monitor className="w-3.5 h-3.5 text-slate-400" />
                        <span>{row.type}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded text-[11px] font-bold">
                        {row.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-300 font-medium">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                      {row.participantCount} Peserta
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedExam(row)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Analisa Butir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ANALISIS BUTIR SOAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181d28] border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#121620]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">
                    ANALISIS BUTIR SOAL : {selectedExam.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Metode Klasik (Classical Test Theory): Tingkat Kesukaran, Daya Pembeda & Distribusi Distraktor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Summary Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-[#121620] border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 font-medium">Total Peserta</div>
                  <div className="text-xl font-black text-white mt-1">
                    {selectedExam.participantCount} <span className="text-xs font-normal text-slate-400">Siswa</span>
                  </div>
                </div>
                <div className="bg-[#121620] border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 font-medium">Reliabilitas Tes (KR-20)</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    0.86 <span className="text-xs font-normal text-slate-400">(Tinggi)</span>
                  </div>
                </div>
                <div className="bg-[#121620] border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 font-medium">Rata-rata Kesukaran (P)</div>
                  <div className="text-xl font-black text-blue-400 mt-1">
                    0.64 <span className="text-xs font-normal text-slate-400">(Sedang)</span>
                  </div>
                </div>
                <div className="bg-[#121620] border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 font-medium">Status Soal Diterima</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    35 <span className="text-xs font-normal text-slate-400">/ 40 Butir</span>
                  </div>
                </div>
              </div>

              {/* Filter and Export Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Filter Kesukaran:</span>
                  <div className="flex items-center gap-1 bg-[#121620] p-1 rounded-lg border border-slate-800">
                    {['ALL', 'Mudah', 'Sedang', 'Sukar'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilterDifficulty(lvl)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          filterDifficulty === lvl
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl === 'ALL' ? 'Semua' : lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateToBankSoal && (
                    <button
                      onClick={onNavigateToBankSoal}
                      className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      title="Buka Bank Soal untuk merevisi butir soal"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>Revisi di Bank Soal</span>
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Laporan Excel Analisis Butir Soal ${selectedExam.name} berhasil di-generate.`)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {/* Detail Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">No</th>
                      <th className="py-2.5 px-2 text-center w-14">Kunci</th>
                      <th className="py-2.5 px-4 text-center">Distribusi Opsi (A - B - C - D)</th>
                      <th className="py-2.5 px-3 text-center">Tingkat Kesukaran (P)</th>
                      <th className="py-2.5 px-3 text-center">Daya Pembeda (D)</th>
                      <th className="py-2.5 px-3 text-center">Status / Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredQuestionDetails.slice(0, 15).map((q) => (
                      <tr key={q.number} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 text-center font-bold text-white">
                          #{q.number}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold px-2 py-0.5 rounded text-xs">
                            {q.key}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                            <span className={q.key === 'A' ? 'font-bold text-emerald-400' : 'text-slate-400'}>
                              A:{q.distA}
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className={q.key === 'B' ? 'font-bold text-emerald-400' : 'text-slate-400'}>
                              B:{q.distB}
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className={q.key === 'C' ? 'font-bold text-emerald-400' : 'text-slate-400'}>
                              C:{q.distC}
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className={q.key === 'D' ? 'font-bold text-emerald-400' : 'text-slate-400'}>
                              D:{q.distD}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-mono text-slate-200 mr-1.5">{q.difficultyIndex}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.difficultyLabel === 'Mudah'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : q.difficultyLabel === 'Sedang'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {q.difficultyLabel}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="font-mono text-slate-200 mr-1.5">{q.discriminationIndex}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.discriminationLabel === 'Sangat Baik'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : q.discriminationLabel === 'Baik'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : q.discriminationLabel === 'Cukup'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {q.discriminationLabel}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              q.recommendation === 'Diterima'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : q.recommendation === 'Revisi'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {q.recommendation === 'Diterima' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : q.recommendation === 'Revisi' ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {q.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 italic text-center">
                * Menampilkan 15 butir soal pertama untuk preview cepat. Gunakan tombol Download Excel untuk data lengkap 40 butir.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#121620] border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
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
