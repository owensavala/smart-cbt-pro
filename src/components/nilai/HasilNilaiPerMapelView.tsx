'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';
import { Subject } from '@/lib/types';

interface SubjectScoreSummary {
  id: string;
  code: string;
  subjectName: string;
  type: string;
  participantCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export default function HasilNilaiPerMapelView() {
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Exact data from reference screenshot (Image 3)
  const [summaryList] = useState<SubjectScoreSummary[]>([
    {
      id: 'sub_1',
      code: 'IPAS-KLS-VI-1',
      subjectName: 'ILMU PENGETAHUAN ALAM SOSIAL',
      type: 'CBT',
      participantCount: 52,
      averageScore: 58.03,
      highestScore: 95.0,
      lowestScore: 22.5,
    },
    {
      id: 'sub_2',
      code: 'MTK-KLS-VI-1',
      subjectName: 'MATEMATIKA',
      type: 'CBT',
      participantCount: 52,
      averageScore: 29.81,
      highestScore: 76.67,
      lowestScore: 13.33,
    },
    {
      id: 'sub_3',
      code: 'BINDO-KLS-VI-1',
      subjectName: 'BAHASA INDONESIA',
      type: 'CBT',
      participantCount: 53,
      averageScore: 58.16,
      highestScore: 90.0,
      lowestScore: 0.0,
    },
    {
      id: 'sub_4',
      code: 'PKN-KLS-VI-1',
      subjectName: 'PENDIDIKAN KEWARGANEGARAAN',
      type: 'CBT',
      participantCount: 52,
      averageScore: 61.06,
      highestScore: 85.0,
      lowestScore: 15.0,
    },
    {
      id: 'sub_5',
      code: 'BING-KLS-VI-1',
      subjectName: 'BAHASA INGGRIS',
      type: 'CBT',
      participantCount: 52,
      averageScore: 54.92,
      highestScore: 92.0,
      lowestScore: 20.0,
    },
    {
      id: 'sub_6',
      code: 'SBP-KLS-VI-1',
      subjectName: 'SENI BUDAYA DAN PRAKARYA',
      type: 'CBT',
      participantCount: 52,
      averageScore: 54.33,
      highestScore: 95.0,
      lowestScore: 20.0,
    },
    {
      id: 'sub_7',
      code: 'SKI-KLS-VI-1',
      subjectName: 'SEJARAH KEBUDAYAAN ISLAM',
      type: 'CBT',
      participantCount: 52,
      averageScore: 65.4,
      highestScore: 92.5,
      lowestScore: 30.0,
    },
    {
      id: 'sub_8',
      code: 'AKAH-KLS-VI-1',
      subjectName: 'PPKN',
      type: 'CBT',
      participantCount: 52,
      averageScore: 68.25,
      highestScore: 95.0,
      lowestScore: 35.0,
    },
    {
      id: 'sub_9',
      code: 'SOSIOLOGI KELAS X IPS',
      subjectName: 'SOSIOLOGI',
      type: 'CBT',
      participantCount: 52,
      averageScore: 71.15,
      highestScore: 97.5,
      lowestScore: 40.0,
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownload = (code: string) => {
    showToast(`Mengunduh rekap nilai mapel ${code} ke format Excel...`);
  };

  const filteredData = useMemo(() => {
    return summaryList.filter(
      (item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [summaryList, searchTerm]);

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
          Laporan Nilai Berdasarkan Mata Pelajaran
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header matching Image 3 */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <span>Laporan Nilai Berdasarkan Mata Pelajaran</span>
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
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Search:</span>
            <input
              type="text"
              placeholder="Cari mapel / kode..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#181d28] border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table matching reference screenshot Image 3 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">MATA PELAJARAN / BANK SOAL</th>
                <th className="py-3 px-3 text-center">JENIS</th>
                <th className="py-3 px-3 text-center">JML PESERTA</th>
                <th className="py-3 px-3 text-center">RATA-RATA</th>
                <th className="py-3 px-3 text-center">SKOR TERTINGGI</th>
                <th className="py-3 px-3 text-center">SKOR TERENDAH</th>
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
                    <td className="py-3.5 px-3 text-center font-mono text-slate-500">
                      {actualIdx}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          {item.subjectName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded font-mono font-bold text-xs">
                        {item.participantCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                      {item.averageScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-400">
                      {item.highestScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-rose-400">
                      {item.lowestScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDownload(item.code)}
                        className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
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
