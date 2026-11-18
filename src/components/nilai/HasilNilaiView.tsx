'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  Search,
  CheckCircle2,
  Info,
  Download,
  RotateCcw,
  Award,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  X,
  Trophy,
  Wrench,
  Layers,
} from 'lucide-react';
import { Student, Subject, SchoolClass, ExamSchedule } from '@/lib/types';

interface ExamResultItem {
  id: string;
  noPeserta: string;
  nis: string;
  name: string;
  className: string;
  jurusan: string;
  examSchedule: string;
  subjectName: string;
  correctAnswers: number;
  wrongAnswers: number;
  mcScore: number;
  essayScore: number;
  finalScore: number;
  status: 'LULUS' | 'REMIDIAL';
}

interface HasilNilaiViewProps {
  students?: Student[];
  subjects?: Subject[];
  classes?: SchoolClass[];
  schedules?: ExamSchedule[];
  onNavigateToRanking?: () => void;
  onNavigateToPerbaikan?: () => void;
  onNavigateToCetakLeger?: () => void;
}

export default function HasilNilaiView({
  students = [],
  subjects = [],
  classes = [],
  schedules = [],
  onNavigateToRanking,
  onNavigateToPerbaikan,
  onNavigateToCetakLeger,
}: HasilNilaiViewProps) {
  const [filterJurusan, setFilterJurusan] = useState('ALL');
  const [filterJenjang, setFilterJenjang] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Mock results list
  const [resultsData] = useState<ExamResultItem[]>([
    {
      id: 'res_1',
      noPeserta: '26-27-01-1-0508-0001',
      nis: '3138848262',
      name: 'ABDUL ADZIM',
      className: 'X',
      jurusan: 'MI',
      examSchedule: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      correctAnswers: 21,
      wrongAnswers: 19,
      mcScore: 52.5,
      essayScore: 35.0,
      finalScore: 87.5,
      status: 'LULUS',
    },
    {
      id: 'res_2',
      noPeserta: '26-27-01-1-0508-0027',
      nis: '0133471482',
      name: 'AFHIF U SANGADJI',
      className: 'X',
      jurusan: 'MI',
      examSchedule: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      correctAnswers: 24,
      wrongAnswers: 16,
      mcScore: 60.0,
      essayScore: 25.0,
      finalScore: 85.0,
      status: 'LULUS',
    },
    {
      id: 'res_3',
      noPeserta: '26-27-01-1-0508-0002',
      nis: '3139266943',
      name: 'AHMAD JIBRIL MUHAMMAD',
      className: 'X',
      jurusan: 'MI',
      examSchedule: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      correctAnswers: 16,
      wrongAnswers: 24,
      mcScore: 40.0,
      essayScore: 25.0,
      finalScore: 65.0,
      status: 'LULUS',
    },
    {
      id: 'res_4',
      noPeserta: '26-27-01-1-0508-0003',
      nis: '3138601804',
      name: 'AHMAD SYAMIL AYYASHA',
      className: 'X',
      jurusan: 'MI',
      examSchedule: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      correctAnswers: 24,
      wrongAnswers: 16,
      mcScore: 60.0,
      essayScore: 25.0,
      finalScore: 85.0,
      status: 'LULUS',
    },
    {
      id: 'res_5',
      noPeserta: '26-27-01-1-0508-0028',
      nis: '3142416183',
      name: 'AL HAFIZD DJ. RAIS',
      className: 'X',
      jurusan: 'MI',
      examSchedule: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      correctAnswers: 6,
      wrongAnswers: 34,
      mcScore: 15.0,
      essayScore: 22.5,
      finalScore: 37.5,
      status: 'REMIDIAL',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFilter = () => {
    setIsFiltered(true);
    showToast('Menampilkan data hasil ujian sesuai filter.');
  };

  const handleExportExcel = () => {
    showToast('Mengekspor rekap hasil ujian ke Excel (.xlsx)...');
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
          Data Hasil Ujian
        </h1>
      </div>

      {/* Main Filter Card matching Image 2 */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <Filter className="w-4 h-4 text-slate-300" />
          <span>Filter Hasil Ujian</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter Jurusan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Jurusan
            </label>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="MI">MI (Madrasah Ibtidaiyah)</option>
              <option value="UMUM">UMUM</option>
            </select>
          </div>

          {/* Filter Jenjang */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Jenjang
            </label>
            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="SD_MI">SD / MI</option>
              <option value="SMP_MTS">SMP / MTs</option>
              <option value="SMA_MA">SMA / MA</option>
            </select>
          </div>

          {/* Filter Kelas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Kelas
            </label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Kelas</option>
              <option value="VI">Kelas X</option>
              <option value="V">Kelas V</option>
              <option value="IV">Kelas IV</option>
            </select>
          </div>

          {/* Pilih Jadwal Ujian */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Pilih Jadwal Ujian
            </label>
            <select
              value={selectedJadwal}
              onChange={(e) => setSelectedJadwal(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Ujian</option>
              <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1 (BAHASA INDONESIA)</option>
              <option value="SBP-KLS-VI-1">SBP-KLS-VI-1 (SENI BUDAYA)</option>
              <option value="BING-KLS-VI-1">BING-KLS-VI-1 (BAHASA INGGRIS)</option>
              <option value="SKI-KLS-VI-1">SKI-KLS-VI-1 (SEJARAH KEBUDAYAAN ISLAM)</option>
            </select>
          </div>
        </div>

        {/* Submit Filter Button matching Image 2 */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleFilter}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Tampilkan Hasil</span>
          </button>
        </div>

        {/* Informasi Alert Box matching Image 2 */}
        <div className="bg-[#0284c7] text-white rounded-lg p-4 shadow-sm mt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-sm block">Informasi</span>
              <p>
                Silakan gunakan filter di atas untuk menampilkan hasil nilai siswa
                pada jadwal ujian tertentu. Anda dapat memfilter berdasarkan Kelas
                atau Jurusan untuk hasil yang lebih spesifik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table when filtered */}
      {isFiltered && (
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Daftar Nilai Siswa (Jadwal: BINDO-KLS-VI-1)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToRanking && (
                <button
                  onClick={onNavigateToRanking}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Lihat Peringkat Nilai Siswa"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ranking Peserta</span>
                </button>
              )}

              {onNavigateToPerbaikan && (
                <button
                  onClick={onNavigateToPerbaikan}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Kelola Perbaikan & Remedial Nilai"
                >
                  <Wrench className="w-3.5 h-3.5 text-rose-400" />
                  <span>Perbaikan Nilai</span>
                </button>
              )}

              {onNavigateToCetakLeger && (
                <button
                  onClick={onNavigateToCetakLeger}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Cetak Leger Nilai Keseluruhan"
                >
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Cetak Leger</span>
                </button>
              )}

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel e-Rapor / RDM</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4">NO PESERTA</th>
                  <th className="py-3 px-4">NAMA SISWA</th>
                  <th className="py-3 px-3 text-center">KELAS</th>
                  <th className="py-3 px-3 text-center">BENAR / SALAH</th>
                  <th className="py-3 px-3 text-center">SKOR PG</th>
                  <th className="py-3 px-3 text-center">SKOR ESAI (AI)</th>
                  <th className="py-3 px-3 text-center">NILAI AKHIR</th>
                  <th className="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {resultsData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.noPeserta}
                    </td>
                    <td className="py-3 px-4 font-bold text-white uppercase">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-400">
                      {item.className}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-emerald-400 font-bold">{item.correctAnswers} B</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-rose-400 font-bold">{item.wrongAnswers} S</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-sky-400">
                      {item.mcScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-purple-400">
                      {item.essayScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-amber-400 text-sm">
                      {item.finalScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status === 'LULUS' ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          LULUS
                        </span>
                      ) : (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          REMIDIAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
