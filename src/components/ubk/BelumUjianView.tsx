'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  AlertTriangle,
  Search,
  FileSpreadsheet,
  CalendarPlus,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Student } from '@/lib/types';

interface MakeupStudentItem {
  id: string;
  noPeserta: string;
  name: string;
  className: string;
  examName: string;
  status: string;
}

interface BelumUjianViewProps {
  students?: Student[];
}

export default function BelumUjianView({ students = [] }: BelumUjianViewProps) {
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Sample data for students who have not started the active test
  const [makeupList, setMakeupList] = useState<MakeupStudentItem[]>([
    {
      id: 'mk_1',
      noPeserta: '26-27-01-1-0508-0004',
      name: 'ALYA ZAHIDAH DAENG MAPATO',
      className: 'VI',
      examName: 'BINDO-KLS-VI-1 (BAHASA INDONESIA)',
      status: 'BELUM_MULAI',
    },
    {
      id: 'mk_2',
      noPeserta: '26-27-01-1-0508-0005',
      name: 'ARJA NUR RACHMAN',
      className: 'VI',
      examName: 'BINDO-KLS-VI-1 (BAHASA INDONESIA)',
      status: 'BELUM_MULAI',
    },
    {
      id: 'mk_3',
      noPeserta: '26-27-01-1-0508-0006',
      name: 'BILQIS NUR AZIZAH',
      className: 'VI',
      examName: 'BINDO-KLS-VI-1 (BAHASA INDONESIA)',
      status: 'BELUM_MULAI',
    },
    {
      id: 'mk_4',
      noPeserta: '26-27-01-1-0508-0007',
      name: 'DANIAL AL KHALIFI',
      className: 'VI',
      examName: 'BINDO-KLS-VI-1 (BAHASA INDONESIA)',
      status: 'BELUM_MULAI',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredData = useMemo(() => {
    return makeupList.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noPeserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.examName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKelas = filterKelas === 'ALL' || item.className === filterKelas;
      return matchSearch && matchKelas;
    });
  }, [makeupList, searchTerm, filterKelas]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

  const handleExport = () => {
    showToast('Mengekspor daftar peserta susulan ke format Excel...');
  };

  const handleCreateMakeupSchedule = () => {
    showToast('Membuka form pembuatan Jadwal Ujian Susulan...');
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
          Daftar Peserta Susulan
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header matching reference screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Daftar Peserta Susulan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleCreateMakeupSchedule}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Buat Sesi Susulan</span>
            </button>
          </div>
        </div>

        {/* Amber Alert box matching reference screenshot */}
        <div className="bg-[#f59e0b] text-slate-950 rounded-lg p-3.5 shadow-sm font-medium">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-bold text-base leading-none">ℹ</span>
            <span>
              Daftar ini menampilkan siswa yang memiliki jadwal ujian namun{' '}
              <strong className="font-black">belum</strong> memulai atau belum ada data nilai tersimpan.
            </span>
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
              placeholder="Cari siswa / mapel..."
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
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">NO PESERTA</th>
                <th className="py-3 px-4">NAMA PESERTA</th>
                <th className="py-3 px-4">KELAS</th>
                <th className="py-3 px-4">MATA UJIAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const actualIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {actualIdx}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {item.noPeserta}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-400">
                        {item.className}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.examName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary matching reference */}
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
    </div>
  );
}
