'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  Medal,
  Search,
  Printer,
  Download,
  RotateCcw,
  Trophy,
  Crown,
  FileSpreadsheet,
  ChevronDown,
  Wrench,
  Layers,
} from 'lucide-react';
import { SchoolClass, Subject, ExamSchedule, Student, SchoolBrandingSettings } from '@/lib/types';

interface RankedStudent {
  rank: number;
  id: string;
  noPeserta: string;
  name: string;
  className: string;
  jurusan: string;
  correctAnswers: number;
  wrongAnswers: number;
  mcScore: number;
  essayScore: number;
  totalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
}

interface AnalisaNilaiRankingViewProps {
  classes?: SchoolClass[];
  subjects?: Subject[];
  schedules?: ExamSchedule[];
  students?: Student[];
  branding?: SchoolBrandingSettings;
  onNavigateToPerbaikan?: () => void;
  onNavigateToCetakLeger?: () => void;
}

export default function AnalisaNilaiRankingView({
  classes = [],
  subjects = [],
  schedules = [],
  students = [],
  branding,
  onNavigateToPerbaikan,
  onNavigateToCetakLeger,
}: AnalisaNilaiRankingViewProps) {
  const [selectedJurusan, setSelectedJurusan] = useState('Semua');
  const [selectedLevel, setSelectedLevel] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Pilih Kelas');
  const [selectedJadwal, setSelectedJadwal] = useState('Pilih Jadwal');
  const [paperSize, setPaperSize] = useState('A4 (210x297mm)');
  const [hasSearched, setHasSearched] = useState(false);

  const sampleJadwalList = [
    { id: 'jadwal-1', name: 'BINDO-KLS-VI-1 (Bahasa Indonesia)', level: 'VI' },
    { id: 'jadwal-2', name: 'MTK-KLS-VI-1 (Matematika)', level: 'VI' },
    { id: 'jadwal-3', name: 'IPAS-KLS-VI-1 (Ilmu Pengetahuan Alam & Sosial)', level: 'VI' },
    { id: 'jadwal-4', name: 'SKI-KLS-VI-1 (Sejarah Kebudayaan Islam)', level: 'VI' },
    { id: 'jadwal-5', name: 'B_ARAB-KLS-VI-1 (Bahasa Arab)', level: 'VI' },
    { id: 'jadwal-6', name: 'SOS-KLS-X-1 (Sosiologi)', level: 'X' },
  ];

  // Ranked students generator sorted descending by total score
  const rankedList: RankedStudent[] = useMemo(() => {
    const rawData = [
      { name: 'SYIFA SYAUQIYAH HI. TAHA', correct: 39, wrong: 1, mc: 97.5, essay: 20.0, total: 98.75 },
      { name: 'UTSMAN SYAHIDUL HAQI', correct: 38, wrong: 2, mc: 95.0, essay: 20.0, total: 97.50 },
      { name: 'FATIMAH AZ-ZAHRA', correct: 38, wrong: 2, mc: 95.0, essay: 19.0, total: 96.50 },
      { name: 'ABDUL ADZIM', correct: 37, wrong: 3, mc: 92.5, essay: 19.0, total: 94.75 },
      { name: 'AFHIF U SANGADJI', correct: 36, wrong: 4, mc: 90.0, essay: 18.0, total: 92.00 },
      { name: 'AHMAD JIBRIL MUHAMMAD', correct: 35, wrong: 5, mc: 87.5, essay: 18.0, total: 90.25 },
      { name: 'AL HAFIZD DJ. RAIS', correct: 35, wrong: 5, mc: 87.5, essay: 17.5, total: 89.50 },
      { name: 'ALYA ZAHIDAH DAENG MAPATO', correct: 34, wrong: 6, mc: 85.0, essay: 17.0, total: 88.00 },
      { name: 'AHMAD SYAMIL AYYASHA', correct: 33, wrong: 7, mc: 82.5, essay: 17.0, total: 86.25 },
      { name: 'KHANSA NABILA', correct: 33, wrong: 7, mc: 82.5, essay: 16.5, total: 85.50 },
      { name: 'NURUL AISYAH', correct: 32, wrong: 8, mc: 80.0, essay: 16.0, total: 84.00 },
      { name: 'TALITHA ZAFIRA', correct: 31, wrong: 9, mc: 77.5, essay: 16.0, total: 82.50 },
      { name: 'BILAL NUR HIDAYAT', correct: 30, wrong: 10, mc: 75.0, essay: 15.0, total: 80.00 },
      { name: 'DANISH ARKAN', correct: 29, wrong: 11, mc: 72.5, essay: 15.0, total: 78.50 },
      { name: 'ARJA', correct: 28, wrong: 12, mc: 70.0, essay: 14.0, total: 76.00 },
      { name: 'HILMI FADHILAH', correct: 27, wrong: 13, mc: 67.5, essay: 14.0, total: 74.50 },
    ];

    return rawData.map((item, index) => {
      let predicate: 'A' | 'B' | 'C' | 'D' = 'C';
      if (item.total >= 90) predicate = 'A';
      else if (item.total >= 80) predicate = 'B';
      else if (item.total >= 65) predicate = 'C';
      else predicate = 'D';

      return {
        rank: index + 1,
        id: `rk-${index + 1}`,
        noPeserta: `26-27-01-1-0508-00${(index + 1).toString().padStart(2, '0')}`,
        name: item.name,
        className: 'VI',
        jurusan: 'MI',
        correctAnswers: item.correct,
        wrongAnswers: item.wrong,
        mcScore: item.mc,
        essayScore: item.essay,
        totalScore: item.total,
        predicate,
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
        DATA PERINGKAT PESERTA
      </h1>

      {/* Main Filter Card matching screenshot */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header Title */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 text-white font-bold text-sm tracking-wide uppercase">
          <Medal className="w-5 h-5 text-amber-400" />
          <span>DATA PERINGKAT PESERTA</span>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 mt-5 items-end">
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
                Pilih Level Dulu
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
                Pilih Level Dulu
              </p>
            )}
          </div>

          {/* 5. Ukuran Kertas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Ukuran Kertas
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="A4 (210x297mm)">A4 (210x297mm)</option>
              <option value="F4 / Folio (215x330mm)">F4 / Folio (215x330mm)</option>
              <option value="Letter">Letter</option>
            </select>
          </div>

          {/* 6. Button CARI */}
          <div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>CARI</span>
            </button>
          </div>
        </div>

        {/* Empty State when not searched (Matching Screenshot) */}
        {!hasSearched ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            {/* Medal Ribbon Icon matching screenshot */}
            <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-white">
              <Medal className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Silahkan pilih jadwal ujian untuk melihat peringkat peserta.
            </p>
          </div>
        ) : (
          /* Result: Leaderboard & Ranking View */
          <div className="mt-8 space-y-6 pt-6 border-t border-slate-800">
            {/* Top 3 Podium Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rank 2 (Silver) */}
              <div className="order-2 md:order-1 bg-gradient-to-b from-slate-700/20 to-transparent border border-slate-600/40 rounded-2xl p-4 text-center relative flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-300/20 border-2 border-slate-300 text-slate-200 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                  🥈
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-600">
                  PERINGKAT 2
                </span>
                <h4 className="text-sm font-black text-white mt-2 line-clamp-1">
                  {rankedList[1]?.name}
                </h4>
                <div className="text-2xl font-black text-slate-200 mt-1">
                  {rankedList[1]?.totalScore.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Kelas {rankedList[1]?.className} • {rankedList[1]?.jurusan}
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/20 to-transparent border-2 border-amber-500/60 rounded-2xl p-5 text-center relative flex flex-col items-center justify-center shadow-lg shadow-amber-500/10">
                <div className="w-14 h-14 rounded-full bg-amber-500/30 border-2 border-amber-400 text-amber-300 flex items-center justify-center text-2xl font-black mb-2 shadow-md">
                  👑
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-500/60">
                  JUARA 1 TERBAIK
                </span>
                <h4 className="text-base font-black text-white mt-2 line-clamp-1">
                  {rankedList[0]?.name}
                </h4>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  {rankedList[0]?.totalScore.toFixed(2)}
                </div>
                <div className="text-xs text-amber-200/80 font-medium">
                  Kelas {rankedList[0]?.className} • {rankedList[0]?.jurusan}
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="order-3 bg-gradient-to-b from-amber-800/20 to-transparent border border-amber-700/40 rounded-2xl p-4 text-center relative flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-700/20 border-2 border-amber-600 text-amber-400 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                  🥉
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-amber-700/60">
                  PERINGKAT 3
                </span>
                <h4 className="text-sm font-black text-white mt-2 line-clamp-1">
                  {rankedList[2]?.name}
                </h4>
                <div className="text-2xl font-black text-amber-300 mt-1">
                  {rankedList[2]?.totalScore.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Kelas {rankedList[2]?.className} • {rankedList[2]?.jurusan}
                </div>
              </div>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Peringkat Ujian: <strong className="text-white">{selectedJadwal}</strong> ({rankedList.length} Siswa Terdaftar)
              </span>
              <div className="flex flex-wrap items-center gap-2">
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
                {onNavigateToCetakLeger && (
                  <button
                    onClick={onNavigateToCetakLeger}
                    className="inline-flex items-center gap-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Cetak Leger Nilai Keseluruhan"
                  >
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>Cetak Leger</span>
                  </button>
                )}
                <button
                  onClick={() => alert(`Export Excel Peringkat Peserta ${selectedJadwal} berhasil diunduh.`)}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
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

            {/* Full Leaderboard Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 text-center w-14">PERINGKAT</th>
                    <th className="py-3 px-4">NO PESERTA</th>
                    <th className="py-3 px-4">NAMA SISWA</th>
                    <th className="py-3 px-3 text-center">KELAS</th>
                    <th className="py-3 px-3 text-center">JURUSAN</th>
                    <th className="py-3 px-3 text-center text-emerald-400">BENAR</th>
                    <th className="py-3 px-3 text-center text-rose-400">SALAH</th>
                    <th className="py-3 px-3 text-center">NILAI PG</th>
                    <th className="py-3 px-3 text-center">NILAI ESSAI</th>
                    <th className="py-3 px-4 text-center font-black text-white">TOTAL SKOR</th>
                    <th className="py-3 px-3 text-center">PREDIKAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rankedList.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        row.rank === 1
                          ? 'bg-amber-500/10'
                          : row.rank === 2
                          ? 'bg-slate-300/10'
                          : row.rank === 3
                          ? 'bg-amber-800/10'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-bold">
                        {row.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black shadow-sm">
                            🥇 1
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black shadow-sm">
                            🥈 2
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black shadow-sm">
                            🥉 3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">#{row.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {row.noPeserta}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {row.className}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">
                        {row.jurusan}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">
                        {row.correctAnswers}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-400">
                        {row.wrongAnswers}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-200">
                        {row.mcScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-200">
                        {row.essayScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-amber-400 text-sm">
                        {row.totalScore.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-black ${
                            row.predicate === 'A'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : row.predicate === 'B'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {row.predicate}
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
