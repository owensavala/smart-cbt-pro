'use client';

import React, { useState, useMemo } from 'react';
import {
  Shuffle,
  Trash2,
  Info,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  Check,
  X,
  FileQuestion,
} from 'lucide-react';
import { Student } from '@/lib/types';

interface QuestionShuffleItem {
  id: string;
  studentId: string;
  noPeserta: string;
  studentName: string;
  urutanSoal: string;
  urutanOpsi: string;
  urutanEssay: string;
}

interface PengacakSoalViewProps {
  students?: Student[];
}

export default function PengacakSoalView({ students = [] }: PengacakSoalViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Mock initial randomized data
  const [shuffleData, setShuffleData] = useState<QuestionShuffleItem[]>([
    {
      id: 'shf_1',
      studentId: 'std_1',
      noPeserta: '26-27-01-1-0508-0001',
      studentName: 'ABDUL ADZIM',
      urutanSoal: '12,5,3,9,1,8,2,4,7,6...',
      urutanOpsi: 'B,C,A,D | C,A,D,B...',
      urutanEssay: '1,3,2,4,5',
    },
    {
      id: 'shf_2',
      studentId: 'std_2',
      noPeserta: '26-27-01-1-0508-0027',
      studentName: 'AFHIF U SANGADJI',
      urutanSoal: '4,10,2,1,7,8,3,5,6,9...',
      urutanOpsi: 'A,D,B,C | D,B,A,C...',
      urutanEssay: '2,1,4,3,5',
    },
    {
      id: 'shf_3',
      studentId: 'std_3',
      noPeserta: '26-27-01-1-0508-0002',
      studentName: 'AHMAD JIBRIL MUHAMMAD',
      urutanSoal: '8,2,6,1,9,4,3,10,5,7...',
      urutanOpsi: 'C,B,A,D | A,C,D,B...',
      urutanEssay: '3,4,1,5,2',
    },
    {
      id: 'shf_4',
      studentId: 'std_4',
      noPeserta: '26-27-01-1-0508-0003',
      studentName: 'AHMAD SYAMIL AYYASHA',
      urutanSoal: '1,6,9,3,2,8,5,10,4,7...',
      urutanOpsi: 'D,A,C,B | B,D,A,C...',
      urutanEssay: '1,2,3,4,5',
    },
    {
      id: 'shf_5',
      studentId: 'std_5',
      noPeserta: '26-27-01-1-0508-0028',
      studentName: 'AL HAFIZD DJ. RAIS',
      urutanSoal: '7,3,1,8,4,2,9,6,5,10...',
      urutanOpsi: 'B,D,C,A | C,D,B,A...',
      urutanEssay: '4,3,2,1,5',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredData = useMemo(() => {
    return shuffleData.filter(
      (item) =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noPeserta.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shuffleData, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleResetSingle = (item: QuestionShuffleItem) => {
    if (
      confirm(
        `Reset susunan acak soal untuk siswa ${item.studentName}? Jika siswa sedang ujian, sesi akan dimulai dari awal!`
      )
    ) {
      setShuffleData((prev) => prev.filter((d) => d.id !== item.id));
      showToast(`Susunan acak soal ${item.studentName} berhasil di-reset.`);
    }
  };

  const handleBatchReset = () => {
    if (selectedIds.size === 0) {
      alert('Pilih siswa yang ingin di-reset susunan acak soalnya terlebih dahulu.');
      return;
    }
    if (
      confirm(
        `Yakin ingin mereset susunan acak untuk ${selectedIds.size} siswa terpilih?`
      )
    ) {
      setShuffleData((prev) => prev.filter((d) => !selectedIds.has(d.id)));
      setSelectedIds(new Set());
      showToast('Susunan acak soal siswa terpilih berhasil di-reset!');
    }
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
          Status Soal Peserta
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header matching reference screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <Shuffle className="w-4 h-4 text-emerald-400" />
            <span>Status Soal Peserta</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Massal Acak</span>
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Info</span>
            </button>
          </div>
        </div>

        {/* Alert box blue with red warning text matching reference */}
        <div className="bg-[#0284c7] text-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-sm block">Penting!</span>
              <p>Lakukan Reset Soal jika soal tidak tampil saat siswa memulai tes.</p>
              <p className="text-rose-200 font-bold">
                Peringatan: Jika direset saat ujian berjalan, siswa akan mengulang dari awal.
              </p>
            </div>
          </div>
        </div>

        {/* Controls: entries per page & search */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
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
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Search:</span>
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

        {/* Table matching reference screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4 text-center">AKSI RESET</th>
                <th className="py-3 px-4">NO PESERTA</th>
                <th className="py-3 px-4">NAMA PESERTA</th>
                <th className="py-3 px-4">URUTAN SOAL</th>
                <th className="py-3 px-4">URUTAN OPSI</th>
                <th className="py-3 px-4">URUTAN ESSAY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const actualIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                  const isChecked = selectedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-blue-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(item.id)}
                          className="rounded border-slate-700 bg-slate-800 text-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {actualIdx}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleResetSingle(item)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Acak</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {item.noPeserta}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-sky-400">
                        <span className="bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
                          {item.urutanSoal}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {item.urutanOpsi}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-purple-400">
                        <span className="bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
                          {item.urutanEssay}
                        </span>
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

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Petunjuk Pengacak Soal</span>
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Sistem CBT melakukan pengacakan soal, pilihan ganda (opsi A-E),
                dan nomor esai secara unik untuk tiap peserta menggunakan seed
                kriptografis.
              </p>
              <p>
                Jika seorang peserta mengalami kendala rendering soal kosong atau
                tercecer, tekan tombol <strong>Reset Acak</strong> pada baris siswa
                tersebut agar susunan dibuat ulang secara instan.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
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
