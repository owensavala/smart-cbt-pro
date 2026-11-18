'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  School,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  FileText,
  PlusCircle,
  Wrench,
  Printer,
} from 'lucide-react';
import { SchoolClass, Student } from '@/lib/types';

interface MatrixStudentRow {
  no: number;
  noPeserta: string;
  name: string;
  scores: Record<
    string,
    {
      correct: number | string;
      wrong: number | string;
      score: number | string;
    }
  >;
}

interface SemuaNilaiViewProps {
  classes?: SchoolClass[];
  students?: Student[];
  onNavigateToCetakLeger?: () => void;
  onNavigateToPerbaikan?: () => void;
}

export default function SemuaNilaiView({
  classes = [],
  students = [],
  onNavigateToCetakLeger,
  onNavigateToPerbaikan,
}: SemuaNilaiViewProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const subjectColumns = [
    { code: 'QUHA-KLS-VI-1', title: 'QURAN HADITS', type: 'UMBK' },
    { code: 'PKN-KLS-VI-1', title: 'PKN', type: 'UMBK' },
    { code: 'SOSIOLOGI KELAS X IPS', title: 'SOSIOLOGI', type: 'UMBK' },
    { code: 'MTK-KLS-VI-1', title: 'MATEMATIKA', type: 'UMBK' },
    { code: 'AKAH-KLS-VI-1', title: 'PPKN', type: 'UMBK' },
    { code: 'B_ARAB-KLS-VI-1', title: 'B. ARAB', type: 'UMBK' },
  ];

  // Exact data from reference screenshot (Image 5)
  const matrixRows: MatrixStudentRow[] = [
    {
      no: 1,
      noPeserta: '26-27-01-1-0508-0001',
      name: 'ABDUL ADZIM',
      scores: {
        'QUHA-KLS-VI-1': { correct: 21, wrong: 19, score: 52.5 },
        'PKN-KLS-VI-1': { correct: 32, wrong: 8, score: 80.0 },
        'SOSIOLOGI KELAS X IPS': { correct: 37, wrong: 3, score: 92.5 },
        'MTK-KLS-VI-1': { correct: 4, wrong: 26, score: 13.3 },
        'AKAH-KLS-VI-1': { correct: 30, wrong: 10, score: 75.0 },
        'B_ARAB-KLS-VI-1': { correct: 12, wrong: 28, score: 30.0 },
      },
    },
    {
      no: 2,
      noPeserta: '26-27-01-1-0508-0027',
      name: 'AFHIF U SANGADJI',
      scores: {
        'QUHA-KLS-VI-1': { correct: 24, wrong: 16, score: 60.0 },
        'PKN-KLS-VI-1': { correct: 31, wrong: 9, score: 77.5 },
        'SOSIOLOGI KELAS X IPS': { correct: 35, wrong: 5, score: 87.5 },
        'MTK-KLS-VI-1': { correct: 9, wrong: 21, score: 30.0 },
        'AKAH-KLS-VI-1': { correct: 34, wrong: 6, score: 85.0 },
        'B_ARAB-KLS-VI-1': { correct: 10, wrong: 30, score: 25.0 },
      },
    },
    {
      no: 3,
      noPeserta: '26-27-01-1-0508-0002',
      name: 'AHMAD JIBRIL MUHAMMAD',
      scores: {
        'QUHA-KLS-VI-1': { correct: 16, wrong: 24, score: 40.0 },
        'PKN-KLS-VI-1': { correct: 25, wrong: 15, score: 62.5 },
        'SOSIOLOGI KELAS X IPS': { correct: 26, wrong: 12, score: 70.0 },
        'MTK-KLS-VI-1': { correct: 13, wrong: 17, score: 43.3 },
        'AKAH-KLS-VI-1': { correct: 21, wrong: 19, score: 52.5 },
        'B_ARAB-KLS-VI-1': { correct: 11, wrong: 29, score: 27.5 },
      },
    },
    {
      no: 4,
      noPeserta: '26-27-01-1-0508-0003',
      name: 'AHMAD SYAMIL AYYASHA',
      scores: {
        'QUHA-KLS-VI-1': { correct: 24, wrong: 16, score: 60.0 },
        'PKN-KLS-VI-1': { correct: 30, wrong: 10, score: 75.0 },
        'SOSIOLOGI KELAS X IPS': { correct: 37, wrong: 3, score: 92.5 },
        'MTK-KLS-VI-1': { correct: 7, wrong: 23, score: 23.3 },
        'AKAH-KLS-VI-1': { correct: 32, wrong: 8, score: 80.0 },
        'B_ARAB-KLS-VI-1': { correct: 11, wrong: 29, score: 27.5 },
      },
    },
    {
      no: 5,
      noPeserta: '26-27-01-1-0508-0028',
      name: 'AL HAFIZD DJ. RAIS',
      scores: {
        'QUHA-KLS-VI-1': { correct: 6, wrong: 34, score: 15.0 },
        'PKN-KLS-VI-1': { correct: 14, wrong: 26, score: 35.0 },
        'SOSIOLOGI KELAS X IPS': { correct: 8, wrong: 32, score: 20.0 },
        'MTK-KLS-VI-1': { correct: 9, wrong: 21, score: 30.0 },
        'AKAH-KLS-VI-1': { correct: 13, wrong: 27, score: 32.5 },
        'B_ARAB-KLS-VI-1': { correct: 12, wrong: 28, score: 30.0 },
      },
    },
    {
      no: 6,
      noPeserta: '26-27-01-1-0508-0004',
      name: 'ALYA ZAHIDAH DAENG MAPATO',
      scores: {
        'QUHA-KLS-VI-1': { correct: 29, wrong: 11, score: 72.5 },
        'PKN-KLS-VI-1': { correct: 32, wrong: 8, score: 80.0 },
        'SOSIOLOGI KELAS X IPS': { correct: 35, wrong: 5, score: 87.5 },
        'MTK-KLS-VI-1': { correct: 11, wrong: 19, score: 36.7 },
        'AKAH-KLS-VI-1': { correct: 34, wrong: 6, score: 85.0 },
        'B_ARAB-KLS-VI-1': { correct: 20, wrong: 20, score: 50.0 },
      },
    },
    {
      no: 7,
      noPeserta: '26-27-01-1-0508-0005',
      name: 'ARJA FEBRIANSYAH ASRUL',
      scores: {
        'QUHA-KLS-VI-1': { correct: 18, wrong: 22, score: 45.0 },
        'PKN-KLS-VI-1': { correct: 11, wrong: 29, score: 27.5 },
        'SOSIOLOGI KELAS X IPS': { correct: 33, wrong: 7, score: 82.5 },
        'MTK-KLS-VI-1': { correct: 8, wrong: 22, score: 26.7 },
        'AKAH-KLS-VI-1': { correct: 29, wrong: 11, score: 72.5 },
        'B_ARAB-KLS-VI-1': { correct: 6, wrong: 34, score: 15.0 },
      },
    },
    {
      no: 8,
      noPeserta: '18052026',
      name: 'ARJUN',
      scores: {
        'QUHA-KLS-VI-1': { correct: '-', wrong: '-', score: '-' },
        'PKN-KLS-VI-1': { correct: '-', wrong: '-', score: '-' },
        'SOSIOLOGI KELAS X IPS': { correct: '-', wrong: '-', score: '-' },
        'MTK-KLS-VI-1': { correct: '-', wrong: '-', score: '-' },
        'AKAH-KLS-VI-1': { correct: '-', wrong: '-', score: '-' },
        'B_ARAB-KLS-VI-1': { correct: '-', wrong: '-', score: '-' },
      },
    },
  ];

  const filteredRows = useMemo(() => {
    return matrixRows.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.noPeserta.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [matrixRows, searchTerm]);

  const handleExportExcel = () => {
    showToast(`Mengekspor rekap seluruh nilai kelas ${selectedClass} ke Excel...`);
  };

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
          Dashboard
        </h1>
      </div>

      {/* VIEW 1: PILIH KELAS (Image 4) */}
      {!selectedClass ? (
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-slate-300" />
              <span>Pilih Kelas</span>
            </div>
            <p className="text-xs text-slate-400">
              Klik salah satu kelas untuk melihat rekapitulasi nilai semua mapel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {/* Card Kelas X matching Image 4 */}
            <div
              onClick={() => setSelectedClass('X')}
              className="bg-[#181d28] hover:bg-[#1e2433] border border-slate-700 hover:border-blue-500/60 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between h-44 group shadow-md"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">
                    VI
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold block">
                    VI
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                <span>Lihat Nilai</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Optional other classes */}
            <div
              onClick={() => setSelectedClass('V')}
              className="bg-[#181d28] hover:bg-[#1e2433] border border-slate-700 hover:border-blue-500/60 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between h-44 group shadow-md opacity-80"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">V</h3>
                  <span className="text-xs text-slate-400 font-semibold block">
                    V
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-400">
                <span>Lihat Nilai</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: REKAP NILAI KELAS (Image 5) */
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedClass(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                title="Pilih Kelas Lain"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pilih Kelas</span>
              </button>
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Rekap Nilai Kelas: {selectedClass}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToCetakLeger && (
                <button
                  onClick={onNavigateToCetakLeger}
                  className="px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Buka Cetak Leger Nilai"
                >
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Cetak Leger Nilai</span>
                </button>
              )}

              {onNavigateToPerbaikan && (
                <button
                  onClick={onNavigateToPerbaikan}
                  className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Buka Perbaikan Nilai / Remedial"
                >
                  <Wrench className="w-3.5 h-3.5 text-rose-400" />
                  <span>Perbaikan Nilai</span>
                </button>
              )}

              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel CBT</span>
              </button>
            </div>
          </div>

          {/* Controls: entries & search */}
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
                <option value={100}>100</option>
              </select>
              <span>entri</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Cari:</span>
              <input
                type="text"
                placeholder="Cari siswa / no peserta..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#181d28] border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
              />
            </div>
          </div>

          {/* Ledger / Matrix Table matching reference Image 5 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#181d28] text-slate-300 font-bold border-b border-slate-700">
                {/* Header Row 1: Subjects */}
                <tr>
                  <th
                    rowSpan={2}
                    className="py-2.5 px-3 text-center border-r border-slate-700 w-12"
                  >
                    #
                  </th>
                  <th
                    rowSpan={2}
                    className="py-2.5 px-4 border-r border-slate-700 whitespace-nowrap"
                  >
                    NO PESERTA
                  </th>
                  <th
                    rowSpan={2}
                    className="py-2.5 px-4 border-r border-slate-700 whitespace-nowrap"
                  >
                    NAMA SISWA
                  </th>
                  {subjectColumns.map((col) => (
                    <th
                      key={col.code}
                      colSpan={3}
                      className="py-2 px-3 text-center border-r border-slate-700 bg-slate-900/60"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-white text-[11px] font-bold">
                            {col.code}
                          </span>
                          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                            CBT
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {col.type}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Header Row 2: B | S | SKOR */}
                <tr className="bg-[#141823] text-[10px] uppercase text-slate-400">
                  {subjectColumns.map((col) => (
                    <React.Fragment key={`${col.code}-subs`}>
                      <th className="py-1 px-2 text-center text-emerald-400">
                        B
                      </th>
                      <th className="py-1 px-2 text-center text-rose-400">
                        S
                      </th>
                      <th className="py-1 px-2.5 text-center text-amber-400 border-r border-slate-700">
                        SKOR
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredRows.map((row) => (
                  <tr
                    key={row.no}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-800/80">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                          +
                        </span>
                        <span>{row.no}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-300 border-r border-slate-800/80 whitespace-nowrap">
                      {row.noPeserta}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-white border-r border-slate-800/80 whitespace-nowrap uppercase">
                      {row.name}
                    </td>

                    {/* Subject scores cells */}
                    {subjectColumns.map((col) => {
                      const sc = row.scores[col.code] || {
                        correct: '-',
                        wrong: '-',
                        score: '-',
                      };
                      return (
                        <React.Fragment key={`${row.no}-${col.code}`}>
                          <td className="py-2 px-2 text-center font-mono text-emerald-400">
                            {sc.correct}
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-rose-400">
                            {sc.wrong}
                          </td>
                          <td className="py-2 px-2.5 text-center font-mono font-bold text-white border-r border-slate-800/80 bg-slate-900/30">
                            {typeof sc.score === 'number'
                              ? sc.score.toFixed(1)
                              : sc.score}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Menampilkan {filteredRows.length} siswa kelas {selectedClass}
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              Keterangan: B = Benar, S = Salah, SKOR = Nilai Akhir
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
