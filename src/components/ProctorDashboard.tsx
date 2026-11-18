'use client';

import React, { useState } from 'react';
import {
  Users,
  KeyRound,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Search,
  School,
  FileSpreadsheet,
} from 'lucide-react';
import { StudentSession } from '../lib/types';

interface ProctorDashboardProps {
  students: StudentSession[];
  tokenRequired: boolean;
  activeToken: string;
  onToggleToken: (enabled: boolean) => void;
  onGenerateToken: () => void;
  onResetStudent: (studentId: string) => void;
  proctorPin: string;
}

export default function ProctorDashboard({
  students,
  tokenRequired,
  activeToken,
  onToggleToken,
  onGenerateToken,
  onResetStudent,
  proctorPin,
}: ProctorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.nisn.includes(searchTerm) ||
      std.className.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || std.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalStudents = students.length;
  const inProgressCount = students.filter((s) => s.status === 'SEDANG_MENGERJAKAN').length;
  const completedCount = students.filter((s) => s.status === 'SELESAI').length;
  const lockedCount = students.filter((s) => s.status === 'TERKUNCI').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER DASBOR PROKTOR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <School className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Ruang Pengawas & Proktor Ujian</h2>
              <p className="text-xs text-slate-500">
                Pemantauan sesi langsung, kontrol keamanan anti-cheat, dan manajemen token
              </p>
            </div>
          </div>
        </div>

        {/* PIN DARURAT PENGAWAS */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">
              PIN Darurat Pengawas
            </span>
            <span className="text-lg font-mono font-extrabold text-amber-900 tracking-widest">
              {proctorPin}
            </span>
          </div>
          <span className="text-[11px] text-amber-700/80 max-w-[140px] leading-tight">
            (Gunakan untuk buka kunci di HP/laptop siswa jika macet)
          </span>
        </div>
      </div>

      {/* KARTU KONTROL TOKEN & KEAMANAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kontrol Token */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status Token Ujian
              </span>
              <button
                onClick={() => onToggleToken(!tokenRequired)}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {tokenRequired ? (
                  <>
                    <span className="text-emerald-700">AKTIF (ON)</span>
                    <ToggleRight className="w-6 h-6 text-emerald-600" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-400">NONAKTIF (OFF)</span>
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  </>
                )}
              </button>
            </div>

            {tokenRequired ? (
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Token Saat Ini:</span>
                  <span className="text-2xl font-mono font-black text-blue-700 tracking-widest">
                    {activeToken}
                  </span>
                </div>
                <button
                  onClick={onGenerateToken}
                  className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ganti Token
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 mb-3">
                Siswa bisa langsung masuk ujian tanpa perlu memasukkan kode token.
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {tokenRequired
              ? '*Rilis token ini ke papan tulis atau siswa yang hadir di ruangan.'
              : '*Cocok untuk ulangan harian atau latihan mandiri.'}
          </p>
        </div>

        {/* Statistik Peserta */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
            Ringkasan Kehadiran Siswa
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Total Siswa</span>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalStudents}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
              <span className="text-xs text-blue-700">Mengerjakan</span>
              <p className="text-2xl font-bold text-blue-800 mt-0.5">{inProgressCount}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-xs text-emerald-700">Selesai</span>
              <p className="text-2xl font-bold text-emerald-800 mt-0.5">{completedCount}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center">
              <span className="text-xs text-red-700">Terkunci (Curang)</span>
              <p className="text-2xl font-bold text-red-800 mt-0.5">{lockedCount}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            <button className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Ekspor Rekap Nilai (Excel)
            </button>
          </div>
        </div>
      </div>

      {/* TABEL MONITORING SISWA REAL-TIME */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filter & Pencarian */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">Daftar Status Siswa Ruangan</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="SEDANG_MENGERJAKAN">Sedang Mengerjakan</option>
              <option value="TERKUNCI">Terkunci (Melanggar)</option>
              <option value="SELESAI">Selesai</option>
              <option value="BELUM_MULAI">Belum Mulai</option>
            </select>

            {/* Input Cari */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500 w-48"
              />
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Siswa / NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Status Ujian</th>
                <th className="py-3 px-4 text-center">Pelanggaran (Keluar Layar)</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-right">Tindakan Pengawas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data siswa yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{std.studentName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">NISN: {std.nisn}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{std.className}</td>
                    <td className="py-3.5 px-4">
                      {std.status === 'SEDANG_MENGERJAKAN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                          Mengerjakan
                        </span>
                      )}
                      {std.status === 'TERKUNCI' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-300">
                          <Lock className="w-3 h-3 text-red-600" /> Terkunci (Curang)
                        </span>
                      )}
                      {std.status === 'SELESAI' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                        </span>
                      )}
                      {std.status === 'BELUM_MULAI' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                          Belum Login
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.violationsCount > 0 ? (
                        <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                          {std.violationsCount}x Terdeteksi
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.totalScore !== undefined ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {std.totalScore}/{std.maxPossibleScore}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {std.status === 'TERKUNCI' && (
                        <button
                          onClick={() => onResetStudent(std.studentId)}
                          className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto shadow-xs cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Login / Buka Kunci
                        </button>
                      )}
                      {std.status === 'SEDANG_MENGERJAKAN' && (
                        <button
                          onClick={() => onResetStudent(std.studentId)}
                          className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] font-medium ml-auto cursor-pointer"
                        >
                          Refresh Sesi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
