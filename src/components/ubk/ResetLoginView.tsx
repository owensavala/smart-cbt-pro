'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Student } from '@/lib/types';

interface ResetLoginViewProps {
  students: Student[];
  onResetLogin?: (studentId: string) => void;
}

export default function ResetLoginView({ students, onResetLogin }: ResetLoginViewProps) {
  const [activeTab, setActiveTab] = useState<'RESET_USER' | 'LOGGED_IN'>('RESET_USER');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Mock logged-in students that need reset if trouble occurs
  const loggedInStudents = [
    {
      id: 'std_arjun',
      noPeserta: '26-27-01-1-0508-0001',
      name: 'ARJUN',
      tglLogin: '18/05/2026 17:02:14',
      isOnline: true,
    },
    {
      id: 'std_ridho',
      noPeserta: '26-27-01-1-0508-0002',
      name: 'MUHAMMAD RIDHO A. GANI',
      tglLogin: '18/05/2026 17:01:45',
      isOnline: true,
    },
  ];

  const handleToggleSelect = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(new Set(loggedInStudents.map((s) => s.id)));
    } else {
      setSelectedStudentIds(new Set());
    }
  };

  const handleBatchReset = () => {
    if (selectedStudentIds.size === 0) {
      showToast('Pilih setidaknya 1 siswa untuk direset login.');
      return;
    }
    selectedStudentIds.forEach((id) => onResetLogin?.(id));
    showToast(`Berhasil mereset session login untuk ${selectedStudentIds.size} siswa terpilih.`);
    setSelectedStudentIds(new Set());
  };

  const handleSingleReset = (id: string, name: string) => {
    onResetLogin?.(id);
    showToast(`Status login siswa ${name} berhasil direset.`);
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
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Manajemen Reset Login Peserta
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Login Peserta</span>
          </div>

          <button
            onClick={() => showToast('Fitur ini untuk membuka kunci siswa yang logout paksa atau freeze.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Info Reset</span>
          </button>
        </div>

        {/* Tabs: Reset Login User & User Yang Masih Login (Matching Image 4) */}
        <div className="flex items-center gap-4 text-xs font-bold border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('RESET_USER')}
            className={`flex items-center gap-1.5 cursor-pointer pb-1 transition-colors ${
              activeTab === 'RESET_USER'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Reset Login User</span>
          </button>
          <button
            onClick={() => setActiveTab('LOGGED_IN')}
            className={`flex items-center gap-1.5 cursor-pointer pb-1 transition-colors ${
              activeTab === 'LOGGED_IN'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-sky-400 hover:text-sky-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>User Yang Masih Login</span>
          </button>
        </div>

        {/* Alert Warning Box */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Checklist siswa yang bermasalah, kemudian klik tombol <strong>Reset Login</strong> di bawah. Fitur ini mereset status online pada tabel nilai agar siswa dapat melanjutkan ujian.
          </span>
        </div>

        {/* Action Button: Reset Login Terpilih */}
        <div>
          <button
            onClick={handleBatchReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Reset Login Terpilih</span>
          </button>
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

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedStudentIds.size > 0 && selectedStudentIds.size === loggedInStudents.length}
                    className="rounded bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-10">#</th>
                <th className="py-3 px-3">NO PESERTA</th>
                <th className="py-3 px-3">NAMA PESERTA</th>
                <th className="py-3 px-3">TGL LOGIN</th>
                <th className="py-3 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loggedInStudents.map((st, i) => (
                <tr key={st.id} className="hover:bg-slate-800/40 odd:bg-slate-900/20">
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.has(st.id)}
                      onChange={() => handleToggleSelect(st.id)}
                      className="rounded bg-slate-900 border-slate-700 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{st.noPeserta}</td>
                  <td className="py-3 px-3 font-bold text-white uppercase">{st.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{st.tglLogin}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleSingleReset(st.id, st.name)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer shadow-xs"
                    >
                      Reset Login
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
