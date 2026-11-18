'use client';

import React, { useState, useMemo } from 'react';
import {
  Database,
  Send,
  Trash2,
  Search,
  CheckCircle2,
  RefreshCw,
  Server,
  UploadCloud,
  Check,
} from 'lucide-react';

interface ExamScoreSyncItem {
  id: string;
  jenisUjian: string;
  kodeUjian: string;
  totalNilai: number;
  terkirim: number;
  diterima: number;
}

export default function DataNilaiUjianView() {
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Exact data from reference screenshot (Image 6)
  const [dataList, setDataList] = useState<ExamScoreSyncItem[]>([
    {
      id: 'd_1',
      jenisUjian: 'BINDO-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 1,
      terkirim: 1,
      diterima: 0,
    },
    {
      id: 'd_2',
      jenisUjian: 'SBP-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_3',
      jenisUjian: 'BING-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_4',
      jenisUjian: 'SKI-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_5',
      jenisUjian: 'B_ARAB-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_6',
      jenisUjian: 'AKAH-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_7',
      jenisUjian: 'IPAS-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_8',
      jenisUjian: 'MTK-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_9',
      jenisUjian: 'BINDO-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_10',
      jenisUjian: 'SOSIOLOGI KELAS X IPS',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
    {
      id: 'd_11',
      jenisUjian: 'PKN-KLS-VI-1',
      kodeUjian: 'UMBK',
      totalNilai: 52,
      terkirim: 0,
      diterima: 52,
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleKirim = (item: ExamScoreSyncItem) => {
    showToast(`Mengirim ${item.totalNilai} data nilai ujian ${item.jenisUjian} ke server pusat...`);
    setTimeout(() => {
      setDataList((prev) =>
        prev.map((d) =>
          d.id === item.id
            ? { ...d, terkirim: 0, diterima: d.totalNilai }
            : d
        )
      );
      showToast(`Data nilai ${item.jenisUjian} berhasil diterima server pusat (Diterima: ${item.totalNilai}).`);
    }, 1200);
  };

  const handleHapus = (item: ExamScoreSyncItem) => {
    if (confirm(`Hapus data nilai hasil ujian ${item.jenisUjian}?`)) {
      setDataList((prev) => prev.filter((d) => d.id !== item.id));
      showToast(`Data nilai ujian ${item.jenisUjian} berhasil dihapus.`);
    }
  };

  const filteredData = useMemo(() => {
    return dataList.filter((item) =>
      item.jenisUjian.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dataList, searchTerm]);

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
          DATA HASIL UJIAN
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header matching Image 6 */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <Database className="w-4 h-4 text-slate-300" />
          <span>DATA HASIL UJIAN</span>
        </div>

        {/* Notice Banner matching reference screenshot Image 6 */}
        <div className="bg-[#1c2230] border-l-4 border-blue-500 rounded-r-lg p-4 space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            Tombol Kirim Nilai, Digunakan Untuk Kirim Nilai ke Pusat (Komputer Server)
          </p>
          <p className="text-[11px] text-rose-400 font-medium">
            Tekan Tombol Pojok Kanan Atas =&gt; PUSAT Ganti LOKAL Jika Ingin Masuk Mode Client, Jika Status PUSAT Maka Masuk Mode SERVER
          </p>
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
              placeholder="Cari jenis ujian..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#181d28] border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table matching reference screenshot Image 6 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">JENIS UJIAN</th>
                <th className="py-3 px-3 text-center">KODE UJIAN</th>
                <th className="py-3 px-3 text-center">NILAI</th>
                <th className="py-3 px-3 text-center">TERKIRIM</th>
                <th className="py-3 px-3 text-center">DITERIMA</th>
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
                    <td className="py-3 px-4 font-bold text-white uppercase">
                      {item.jenisUjian}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        {item.kodeUjian}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-white">
                      {item.totalNilai}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold text-xs">
                        {item.terkirim}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold text-xs">
                        {item.diterima}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleKirim(item)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim</span>
                        </button>
                        <button
                          onClick={() => handleHapus(item)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
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
