'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  RotateCcw,
  Download,
  Printer,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  BarChart,
  AreaChart,
  Sliders,
  ChevronRight,
  Trophy,
  Wrench,
} from 'lucide-react';
import { SchoolClass, Subject, ExamSchedule, Student } from '@/lib/types';

interface StudentScoreRecord {
  id: string;
  noPeserta: string;
  name: string;
  className: string;
  jurusan: string;
  mcScore: number;
  essayScore: number;
  finalScore: number;
  status: 'TUNTAS' | 'REMEDIAL';
}

interface AnalisaNilaiMapelViewProps {
  classes?: SchoolClass[];
  subjects?: Subject[];
  schedules?: ExamSchedule[];
  students?: Student[];
  onNavigateToRanking?: () => void;
  onNavigateToPerbaikan?: () => void;
}

export default function AnalisaNilaiMapelView({
  classes = [],
  subjects = [],
  schedules = [],
  students = [],
  onNavigateToRanking,
  onNavigateToPerbaikan,
}: AnalisaNilaiMapelViewProps) {
  const [selectedJurusan, setSelectedJurusan] = useState('Semua');
  const [selectedLevel, setSelectedLevel] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Pilih Kelas');
  const [selectedJadwal, setSelectedJadwal] = useState('Pilih Jadwal');
  const [hasSearched, setHasSearched] = useState(false);

  // Available sample schedules
  const sampleJadwalList = [
    { id: 'jadwal-1', name: 'BINDO-KLS-VI-1 (Bahasa Indonesia)', level: 'VI' },
    { id: 'jadwal-2', name: 'MTK-KLS-VI-1 (Matematika)', level: 'VI' },
    { id: 'jadwal-3', name: 'IPAS-KLS-VI-1 (Ilmu Pengetahuan Alam & Sosial)', level: 'VI' },
    { id: 'jadwal-4', name: 'SKI-KLS-VI-1 (Sejarah Kebudayaan Islam)', level: 'VI' },
    { id: 'jadwal-5', name: 'B_ARAB-KLS-VI-1 (Bahasa Arab)', level: 'VI' },
    { id: 'jadwal-6', name: 'SOS-KLS-X-1 (Sosiologi)', level: 'X' },
  ];

  // Mock list of 52 students for subject performance
  const mockScores: StudentScoreRecord[] = useMemo(() => {
    const rawNames = [
      'ABDUL ADZIM',
      'AFHIF U SANGADJI',
      'AHMAD JIBRIL MUHAMMAD',
      'AHMAD SYAMIL AYYASHA',
      'AL HAFIZD DJ. RAIS',
      'ALYA ZAHIDAH DAENG MAPATO',
      'ARJA',
      'BILAL NUR HIDAYAT',
      'DANISH ARKAN',
      'FATIMAH AZ-ZAHRA',
      'HILMI FADHILAH',
      'IBRAHIM MALIK',
      'KHANSA NABILA',
      'MUHAMMAD AL FATIH',
      'NURUL AISYAH',
      'RAFIF DZAKY',
      'SITI AISYAH',
      'SYIFA SYAUQIYAH HI. TAHA',
      'TALITHA ZAFIRA',
      'UTSMAN SYAHIDUL HAQI',
      'YASMIN NUR KAMILA',
      'ZAYN MALIK IBRAHIM'
    ];

    return rawNames.map((name, idx) => {
      const mc = Math.round((70 + ((idx * 7) % 28)) * 10) / 10;
      const essay = Math.round((idx % 4 === 0 ? 15 : 20) * 10) / 10;
      const total = Math.min(100, Math.round((mc * 0.7 + essay * 1.5) * 10) / 10);
      const isPass = total >= 65;

      return {
        id: `scr-${idx + 1}`,
        noPeserta: `26-27-01-1-0508-00${(idx + 1).toString().padStart(2, '0')}`,
        name,
        className: 'VI',
        jurusan: 'MI',
        mcScore: mc,
        essayScore: essay,
        finalScore: total,
        status: isPass ? 'TUNTAS' : 'REMEDIAL',
      };
    });
  }, []);

  const handleSearch = () => {
    if (selectedLevel === 'Semua' || selectedJadwal === 'Pilih Jadwal') {
      alert('Silakan pilih Level dan Jadwal Mapel terlebih dahulu.');
      return;
    }
    setHasSearched(true);
  };

  const handleReset = () => {
    setSelectedJurusan('Semua');
    setSelectedLevel('Semua');
    setSelectedKelas('Pilih Kelas');
    setSelectedJadwal('Pilih Jadwal');
    setHasSearched(false);
  };

  // Performance calculations
  const stats = useMemo(() => {
    if (!hasSearched || mockScores.length === 0) return null;
    const scores = mockScores.map(s => s.finalScore);
    const total = scores.length;
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = parseFloat((sum / total).toFixed(1));
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const passCount = mockScores.filter(s => s.status === 'TUNTAS').length;
    const passPercent = parseFloat(((passCount / total) * 100).toFixed(1));

    // Distribution ranges
    const range1 = mockScores.filter(s => s.finalScore < 60).length;
    const range2 = mockScores.filter(s => s.finalScore >= 60 && s.finalScore <= 75).length;
    const range3 = mockScores.filter(s => s.finalScore > 75 && s.finalScore <= 85).length;
    const range4 = mockScores.filter(s => s.finalScore > 85).length;

    return {
      total,
      avg,
      max,
      min,
      passCount,
      passPercent,
      range1,
      range2,
      range3,
      range4,
    };
  }, [hasSearched, mockScores]);

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
        Analisa Capaian Nilai Per Mata Pelajaran
      </h1>

      {/* Filter Card */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header Title */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Analisa Capaian Nilai</span>
        </div>

        {/* Filter Controls Row matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 items-end">
          {/* 1. Jurusan */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Jurusan
            </label>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua">Semua</option>
              <option value="MI">MI</option>
              <option value="MTS">MTS</option>
              <option value="MA">MA</option>
            </select>
          </div>

          {/* 2. Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                if (e.target.value === 'Semua') {
                  setSelectedKelas('Pilih Kelas');
                  setSelectedJadwal('Pilih Jadwal');
                  setHasSearched(false);
                } else {
                  setSelectedKelas('VI');
                  setSelectedJadwal(sampleJadwalList[0].name);
                }
              }}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua">Semua</option>
              <option value="VI">VI</option>
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
            </select>
          </div>

          {/* 3. Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Kelas
            </label>
            <select
              disabled={selectedLevel === 'Semua'}
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-hidden focus:border-blue-500"
            >
              {selectedLevel === 'Semua' ? (
                <option value="Pilih Kelas">Pilih Kelas</option>
              ) : (
                <>
                  <option value="Semua">Semua Kelas Level {selectedLevel}</option>
                  <option value="X">Kelas X</option>
                  <option value="X MIPA 1">X MIPA 1</option>
                  <option value="X IPS 1">X IPS 1</option>
                </>
              )}
            </select>
            {selectedLevel === 'Semua' && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                Pilih Level Terlebih Dahulu
              </p>
            )}
          </div>

          {/* 4. Jadwal Mapel */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Jadwal Mapel
            </label>
            <select
              disabled={selectedLevel === 'Semua'}
              value={selectedJadwal}
              onChange={(e) => setSelectedJadwal(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-hidden focus:border-blue-500"
            >
              {selectedLevel === 'Semua' ? (
                <option value="Pilih Jadwal">Pilih Jadwal</option>
              ) : (
                sampleJadwalList.map((j) => (
                  <option key={j.id} value={j.name}>
                    {j.name}
                  </option>
                ))
              )}
            </select>
            {selectedLevel === 'Semua' && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                Pilih Level Terlebih Dahulu
              </p>
            )}
          </div>

          {/* 5. Action Button CARI */}
          <div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>CARI</span>
            </button>
          </div>
        </div>

        {/* Empty State when no search done (Matching Screenshot) */}
        {!hasSearched ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            {/* Custom Mountain / Chart Icon matching reference */}
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-slate-300">
              <svg
                className="w-8 h-8 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M19 9l-5 5-4-4-3 3" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Silahkan pilih jadwal ujian untuk melihat analisa capaian nilai.
            </p>
          </div>
        ) : (
          /* Result View when search is active */
          <div className="mt-8 space-y-6 pt-6 border-t border-slate-800">
            {/* Key Metrics Cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-400 font-medium text-xs">Total Siswa Ujian</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {stats.total} <span className="text-xs font-normal text-slate-400">Siswa</span>
                  </div>
                </div>

                <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-400 font-medium text-xs">Rata-Rata Nilai (Mean)</div>
                  <div className="text-2xl font-black text-blue-400 mt-1">
                    {stats.avg}
                  </div>
                </div>

                <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-400 font-medium text-xs">Nilai Tertinggi / Terendah</div>
                  <div className="text-xl font-black text-white mt-1">
                    <span className="text-emerald-400">{stats.max}</span> / <span className="text-rose-400">{stats.min}</span>
                  </div>
                </div>

                <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-400 font-medium text-xs">Ketuntasan KKM (≥65)</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {stats.passPercent}% <span className="text-xs font-normal text-slate-400">({stats.passCount}/{stats.total})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Distribution Chart */}
            {stats && (
              <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Distribusi Rentang Nilai Peserta Ujian</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center text-rose-300 font-bold mb-1">
                      <span>0 - 59 (Perlu Bimbingan)</span>
                      <span>{stats.range1} Siswa</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${(stats.range1 / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center text-amber-300 font-bold mb-1">
                      <span>60 - 75 (Cukup)</span>
                      <span>{stats.range2} Siswa</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${(stats.range2 / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center text-blue-300 font-bold mb-1">
                      <span>76 - 85 (Baik)</span>
                      <span>{stats.range3} Siswa</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(stats.range3 / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center text-emerald-300 font-bold mb-1">
                      <span>86 - 100 (Sangat Baik)</span>
                      <span>{stats.range4} Siswa</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(stats.range4 / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Menampilkan hasil analisis untuk jadwal: <strong className="text-white">{selectedJadwal}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {onNavigateToRanking && (
                  <button
                    onClick={onNavigateToRanking}
                    className="inline-flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Lihat Peringkat Nilai Siswa"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ranking Peserta</span>
                  </button>
                )}
                {onNavigateToPerbaikan && (
                  <button
                    onClick={onNavigateToPerbaikan}
                    className="inline-flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Buka Perbaikan Nilai / Remedial"
                  >
                    <Wrench className="w-3.5 h-3.5 text-rose-400" />
                    <span>Perbaikan Nilai</span>
                  </button>
                )}
                <button
                  onClick={() => alert('Download Excel Hasil Analisa Mapel berhasil.')}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Table of student results */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-4">NO PESERTA</th>
                    <th className="py-3 px-4">NAMA SISWA</th>
                    <th className="py-3 px-3 text-center">KELAS</th>
                    <th className="py-3 px-3 text-center">NILAI PG</th>
                    <th className="py-3 px-3 text-center">NILAI ESSAI</th>
                    <th className="py-3 px-3 text-center">NILAI AKHIR</th>
                    <th className="py-3 px-4 text-center">STATUS KKM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {mockScores.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-300">
                        {row.noPeserta}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white">
                        {row.name}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-300">
                        {row.className}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-200">
                        {row.mcScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-200">
                        {row.essayScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-white">
                        {row.finalScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                            row.status === 'TUNTAS'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
