'use client';

import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Filter,
  Info,
  FileSpreadsheet,
  Printer,
  Search,
  Edit,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  Trophy,
} from 'lucide-react';
import { SchoolClass, Subject, Student } from '@/lib/types';

interface RemedialStudentRow {
  id: string;
  name: string;
  className: string;
  jurusan: string;
  subjectTitle: string;
  subjectCode: string;
  mcScore: number;
  essayScore: number;
  totalScore: number;
  kkm: number;
  status: 'LULUS' | 'REMEDIAL';
  notes?: string;
  remedialDate?: string;
}

interface PerbaikanNilaiViewProps {
  classes?: SchoolClass[];
  subjects?: Subject[];
  students?: Student[];
  onNavigateToHasilNilai?: () => void;
  onNavigateToRanking?: () => void;
}

export default function PerbaikanNilaiView({
  classes = [],
  subjects = [],
  students = [],
  onNavigateToHasilNilai,
  onNavigateToRanking,
}: PerbaikanNilaiViewProps) {
  const [filterJurusan, setFilterJurusan] = useState('Semua Jurusan');
  const [filterLevel, setFilterLevel] = useState('Semua Level');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');
  const [filterMapel, setFilterMapel] = useState('Semua Mapel');

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [notification, setNotification] = useState<string | null>(null);

  // Remedial & score list state matching screenshot
  const [scoreList, setScoreList] = useState<RemedialStudentRow[]>([
    {
      id: 'rem-1',
      name: 'SYIFA SYAUQIYAH HI. TAHA',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'SEJARA KEBUDAYAAN ISLAM',
      subjectCode: 'SKI-KLS-VI-1',
      mcScore: 97.50,
      essayScore: 0.00,
      totalScore: 97.50,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-2',
      name: 'SYIFA SYAUQIYAH HI. TAHA',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'SOSIOLOGI',
      subjectCode: 'SOSIOLOGI KELAS X IPS',
      mcScore: 97.50,
      essayScore: 0.00,
      totalScore: 97.50,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-3',
      name: 'UTSMAN SYAHIDUL HAQI',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'SOSIOLOGI',
      subjectCode: 'SOSIOLOGI KELAS X IPS',
      mcScore: 97.50,
      essayScore: 0.00,
      totalScore: 97.50,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-4',
      name: 'ABDUL ADZIM',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'BAHASA INDONESIA',
      subjectCode: 'BINDO-KLS-VI-1',
      mcScore: 52.50,
      essayScore: 0.00,
      totalScore: 52.50,
      kkm: 60,
      status: 'REMEDIAL',
    },
    {
      id: 'rem-5',
      name: 'AFHIF U SANGADJI',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'MATEMATIKA',
      subjectCode: 'MTK-KLS-VI-1',
      mcScore: 55.00,
      essayScore: 0.00,
      totalScore: 55.00,
      kkm: 60,
      status: 'REMEDIAL',
    },
    {
      id: 'rem-6',
      name: 'AHMAD JIBRIL MUHAMMAD',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'BAHASA ARAB',
      subjectCode: 'B_ARAB-KLS-VI-1',
      mcScore: 90.00,
      essayScore: 0.00,
      totalScore: 90.00,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-7',
      name: 'AL HAFIZD DJ. RAIS',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'PPKN',
      subjectCode: 'AKAH-KLS-VI-1',
      mcScore: 87.50,
      essayScore: 0.00,
      totalScore: 87.50,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-8',
      name: 'ALYA ZAHIDAH DAENG MAPATO',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'ILMU PENGETAHUAN ALAM & SOSIAL',
      subjectCode: 'IPAS-KLS-VI-1',
      mcScore: 92.50,
      essayScore: 0.00,
      totalScore: 92.50,
      kkm: 60,
      status: 'LULUS',
    },
    {
      id: 'rem-9',
      name: 'BILAL NUR HIDAYAT',
      className: 'VI',
      jurusan: 'MI',
      subjectTitle: 'SENI BUDAYA & PRAKARYA',
      subjectCode: 'SBP-KLS-VI-1',
      mcScore: 57.50,
      essayScore: 0.00,
      totalScore: 57.50,
      kkm: 60,
      status: 'REMEDIAL',
    },
  ]);

  // Modal edit / perbaikan state
  const [editingItem, setEditingItem] = useState<RemedialStudentRow | null>(null);
  const [modalMcScore, setModalMcScore] = useState<number>(0);
  const [modalEssayScore, setModalEssayScore] = useState<number>(0);
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalDate, setModalDate] = useState<string>('2026-05-20');

  // Open modal
  const handleOpenEdit = (item: RemedialStudentRow) => {
    setEditingItem(item);
    setModalMcScore(item.mcScore);
    setModalEssayScore(item.essayScore);
    setModalNotes(item.notes || 'Telah menyelesaikan tugas remedial kompetensi dasar.');
    setModalDate(item.remedialDate || new Date().toISOString().split('T')[0]);
  };

  // Calculated new total and status
  const modalCalculatedTotal = useMemo(() => {
    return Math.min(100, Math.round((Number(modalMcScore) + Number(modalEssayScore)) * 100) / 100);
  }, [modalMcScore, modalEssayScore]);

  const modalCalculatedStatus: 'LULUS' | 'REMEDIAL' = useMemo(() => {
    if (!editingItem) return 'LULUS';
    return modalCalculatedTotal >= editingItem.kkm ? 'LULUS' : 'REMEDIAL';
  }, [modalCalculatedTotal, editingItem]);

  // Save changes
  const handleSaveEdit = () => {
    if (!editingItem) return;

    setScoreList((prev) =>
      prev.map((row) =>
        row.id === editingItem.id
          ? {
              ...row,
              mcScore: Number(modalMcScore),
              essayScore: Number(modalEssayScore),
              totalScore: modalCalculatedTotal,
              status: modalCalculatedStatus,
              notes: modalNotes,
              remedialDate: modalDate,
            }
          : row
      )
    );

    setNotification(`Nilai remedial ${editingItem.name} berhasil diperbarui.`);
    setEditingItem(null);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return scoreList.filter((row) => {
      const matchSearch =
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchJurusan =
        filterJurusan === 'Semua Jurusan' || row.jurusan === filterJurusan;
      const matchKelas =
        filterKelas === 'Semua Kelas' || row.className === filterKelas;
      const matchMapel =
        filterMapel === 'Semua Mapel' ||
        row.subjectTitle.toLowerCase().includes(filterMapel.toLowerCase());

      return matchSearch && matchJurusan && matchKelas && matchMapel;
    });
  }, [scoreList, searchTerm, filterJurusan, filterKelas, filterMapel]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
        Kelola Remedial & Perbaikan Nilai
      </h1>

      {/* Main Card */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header Title matching screenshot */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <Wrench className="w-5 h-5 text-slate-300" />
          <span>Kelola Remedial & Perbaikan Nilai</span>
        </div>

        {/* Filters Row matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-5 items-end">
          {/* 1. Jurusan */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Jurusan
            </label>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua Jurusan">Semua Jurusan</option>
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
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua Level">Semua Level</option>
              <option value="VI">Level VI</option>
              <option value="VII">Level VII</option>
              <option value="VIII">Level VIII</option>
            </select>
          </div>

          {/* 3. Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Kelas
            </label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="X">Kelas X</option>
              <option value="X MIPA 1">X MIPA 1</option>
              <option value="X IPS 1">X IPS 1</option>
            </select>
          </div>

          {/* 4. Mata Pelajaran/Bank Soal */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Mata Pelajaran/Bank Soal
            </label>
            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="Semua Mapel">Semua Mapel</option>
              <option value="SEJARA KEBUDAYAAN ISLAM">Sejarah Kebudayaan Islam</option>
              <option value="SOSIOLOGI">Sosiologi</option>
              <option value="BAHASA INDONESIA">Bahasa Indonesia</option>
              <option value="MATEMATIKA">Matematika</option>
              <option value="PPKN">PPKn</option>
              <option value="ILMU PENGETAHUAN ALAM & SOSIAL">IPAS</option>
            </select>
          </div>

          {/* 5. Filter Button */}
          <div>
            <button
              onClick={() => {}}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Info Callout Banner matching screenshot */}
        <div className="flex items-start gap-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 mt-5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <span>
            Daftar di bawah menampilkan <strong className="text-white">semua siswa</strong>. Silakan pilih Level untuk mempersempit daftar Kelas dan Mata Pelajaran secara otomatis.
          </span>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Toolbar: Export Excel, Cetak PDF, Show entries, Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onNavigateToHasilNilai && (
              <button
                onClick={onNavigateToHasilNilai}
                className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
                title="Buka Data Hasil Ujian"
              >
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>Hasil Nilai</span>
              </button>
            )}
            {onNavigateToRanking && (
              <button
                onClick={onNavigateToRanking}
                className="inline-flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
                title="Lihat Peringkat Nilai Siswa"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Ranking Peserta</span>
              </button>
            )}
            <button
              onClick={() => alert('Data Remedial & Perbaikan Nilai berhasil diekspor ke Excel.')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-slate-400">
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

            <div className="flex items-center gap-2">
              <span>Search:</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari peserta/mapel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#121620] border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table matching screenshot */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-4">NAMA PESERTA</th>
                <th className="py-3 px-3 text-center">KELAS</th>
                <th className="py-3 px-3 text-center">JURUSAN</th>
                <th className="py-3 px-4">MATA PELAJARAN</th>
                <th className="py-3 px-3 text-center">P.GANDA</th>
                <th className="py-3 px-3 text-center">ESSAI</th>
                <th className="py-3 px-3 text-center">TOTAL</th>
                <th className="py-3 px-3 text-center">KKM</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRows.slice(0, pageSize).map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 text-center font-medium text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white uppercase tracking-wide">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-300 font-medium">
                    {row.className}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-medium">
                    {row.jurusan}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-cyan-400 font-bold text-xs uppercase">
                      {row.subjectTitle}
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                      {row.subjectCode}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="bg-emerald-600/90 text-white font-bold px-2.5 py-1 rounded text-xs">
                      {row.mcScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-300 font-medium">
                    {row.essayScore.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-white text-xs">
                    {row.totalScore.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-bold">
                    {row.kkm}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded text-[11px] font-black ${
                        row.status === 'LULUS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleOpenEdit(row)}
                      className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Perbaiki</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PERBAIKAN NILAI */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181d28] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#121620] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Perbaikan & Remedial Nilai
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui nilai pilihan ganda / essai setelah program remedial
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Student Info Box */}
              <div className="bg-[#121620] border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peserta:</span>
                  <span className="font-bold text-white">{editingItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelas / Jurusan:</span>
                  <span className="text-slate-200">Kelas {editingItem.className} • {editingItem.jurusan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mata Pelajaran:</span>
                  <span className="text-cyan-400 font-semibold">{editingItem.subjectTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">KKM Kelulusan:</span>
                  <span className="font-bold text-amber-400">{editingItem.kkm}</span>
                </div>
              </div>

              {/* Input Nilai Baru */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Nilai PG Baru
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={modalMcScore}
                    onChange={(e) => setModalMcScore(Number(e.target.value))}
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Nilai Essai Baru
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={modalEssayScore}
                    onChange={(e) => setModalEssayScore(Number(e.target.value))}
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Date & Notes */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Tanggal Remedial
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Catatan Guru Pengampu
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Contoh: Mengulang kompetensi dasar bab 3 & 4..."
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Result Preview Box */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Total Nilai Baru:</div>
                  <div className="text-xl font-black text-emerald-400">
                    {modalCalculatedTotal.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Status Akhir:</div>
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-black mt-0.5 ${
                      modalCalculatedStatus === 'LULUS'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {modalCalculatedStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#121620] border-t border-slate-800 flex justify-end gap-2.5">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Nilai</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
