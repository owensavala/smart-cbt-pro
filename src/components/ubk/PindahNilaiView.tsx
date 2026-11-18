'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  RotateCcw,
  Search,
  CheckCircle2,
  Info,
  Filter,
  Check,
  RotateCw,
} from 'lucide-react';

export default function PindahNilaiView() {
  const [filterJurusan, setFilterJurusan] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [filterMapel, setFilterMapel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
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
          MANAJEMEN ARSIP NILAI
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-purple-500 rounded-sm"></span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              MANAJEMEN ARSIP NILAI
            </h2>
          </div>

          <button
            onClick={() => showToast('Manajemen arsip nilai memungkinkan pemindahan nilai aktif ke arsip dan sebaliknya.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Apa ini?</span>
          </button>
        </div>

        {/* Filter Bar & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="ALL">Pilih Jurusan</option>
              <option value="MI">Madrasah Ibtidaiyah (MI)</option>
              <option value="IPA">IPA</option>
              <option value="IPS">IPS</option>
            </select>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="ALL">Pilih Level</option>
              <option value="VI">VI</option>
              <option value="V">V</option>
              <option value="VII">VII</option>
            </select>

            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="ALL">Pilih Kelas</option>
              <option value="X">Kelas X</option>
              <option value="VI-A">VI-A</option>
              <option value="VI-B">VI-B</option>
            </select>

            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
            >
              <option value="ALL">Pilih Mapel</option>
              <option value="BINDO">Bahasa Indonesia</option>
              <option value="SOS">Sosiologi</option>
              <option value="PPKN">PPKn</option>
            </select>

            <button
              onClick={() => showToast('Filter diterapkan.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Nilai terpilih berhasil direstore ke tabel aktif.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Restore Terpilih</span>
            </button>
            <button
              onClick={() => showToast('Seluruh arsip nilai berhasil direstore.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Restore Semua</span>
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1">
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1 w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table (Matching Image 3) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input type="checkbox" className="rounded bg-slate-900 border-slate-700" />
                </th>
                <th className="py-3 px-3 w-10">#</th>
                <th className="py-3 px-3">AKSI</th>
                <th className="py-3 px-3">NAMA PESERTA</th>
                <th className="py-3 px-3">KELAS</th>
                <th className="py-3 px-3">MATA PELAJARAN</th>
                <th className="py-3 px-3">WAKTU UJIAN</th>
                <th className="py-3 px-3">DURASI</th>
                <th className="py-3 px-3 text-center">JAWABAN</th>
                <th className="py-3 px-3 text-center">SKOR</th>
                <th className="py-3 px-3 text-center">LOKASI</th>
                <th className="py-3 px-3">IP AREA</th>
                <th className="py-3 px-3">NIS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-500 font-medium">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 rounded border border-slate-800 text-slate-600">
              Previous
            </button>
            <button disabled className="px-2.5 py-1 rounded border border-slate-800 text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
