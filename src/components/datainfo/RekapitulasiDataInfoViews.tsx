'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Search,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Student,
  ExamRoom,
  ExamSessionInfo,
  SchoolClass,
  MajorMaster,
} from '@/lib/types';

export type RecapMode = 'SESI' | 'RUANG' | 'KELAS' | 'JURUSAN';

interface RekapitulasiDataInfoViewsProps {
  mode: RecapMode;
  students: Student[];
  rooms?: ExamRoom[];
  sessions?: ExamSessionInfo[];
  classes?: SchoolClass[];
  majors?: MajorMaster[];
  onRefresh?: () => void;
}

export default function RekapitulasiDataInfoViews({
  mode,
  students,
  rooms = [],
  sessions = [],
  classes = [],
  majors = [],
  onRefresh,
}: RekapitulasiDataInfoViewsProps) {
  // Selected category card to drill down into student list
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailSearch, setDetailSearch] = useState<string>('');

  // Config mapping based on mode
  const config = useMemo(() => {
    switch (mode) {
      case 'SESI':
        return {
          title: 'Rekapitulasi Peserta Per Sesi Ujian',
          cardLabel: 'SESI',
          singular: 'Sesi',
          iconColor: 'text-cyan-400',
        };
      case 'RUANG':
        return {
          title: 'Rekapitulasi Peserta Per Ruang Ujian',
          cardLabel: 'RUANG',
          singular: 'Ruang',
          iconColor: 'text-emerald-400',
        };
      case 'KELAS':
        return {
          title: 'Rekapitulasi Peserta Per Kelas',
          cardLabel: 'KELAS',
          singular: 'Kelas',
          iconColor: 'text-purple-400',
        };
      case 'JURUSAN':
        return {
          title: 'Rekapitulasi Peserta Per Jurusan',
          cardLabel: 'JURUSAN',
          singular: 'Jurusan',
          iconColor: 'text-amber-400',
        };
    }
  }, [mode]);

  // Aggregate student counts by category
  const recapData = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number; students: Student[] }>();

    // Pre-populate with known master categories to preserve standard order
    if (mode === 'SESI') {
      if (sessions.length > 0) {
        sessions.forEach((s) => {
          const key = String(s.sessionNumber);
          map.set(key, { key, label: key, count: 0, students: [] });
        });
      }
    } else if (mode === 'RUANG') {
      if (rooms.length > 0) {
        rooms.forEach((r) => {
          const key = r.code || r.name;
          map.set(key, { key, label: key, count: 0, students: [] });
        });
      }
    } else if (mode === 'KELAS') {
      if (classes.length > 0) {
        classes.forEach((c) => {
          const key = c.name;
          map.set(key, { key, label: key, count: 0, students: [] });
        });
      }
    } else if (mode === 'JURUSAN') {
      if (majors.length > 0) {
        majors.forEach((m) => {
          const key = m.code;
          map.set(key, { key, label: key, count: 0, students: [] });
        });
      }
    }

    // Now populate actual students
    students.forEach((st) => {
      let rawKey = '';
      if (mode === 'SESI') {
        // Normalize session to number or string like '1', '2', etc.
        const numOnly = (st.session || '1').replace(/[^0-9]/g, '');
        rawKey = numOnly || st.session || '1';
      } else if (mode === 'RUANG') {
        rawKey = st.room || 'LAB-01';
      } else if (mode === 'KELAS') {
        rawKey = st.className || 'VI';
      } else if (mode === 'JURUSAN') {
        rawKey = st.jurusan || 'MI';
      }

      if (!map.has(rawKey)) {
        map.set(rawKey, { key: rawKey, label: rawKey, count: 0, students: [] });
      }

      const item = map.get(rawKey)!;
      item.count += 1;
      item.students.push(st);
    });

    // Convert map to array and filter out empty pre-populated ones unless no data at all
    const items = Array.from(map.values()).filter((item) => item.count > 0 || students.length === 0);

    // Natural sort: numeric if possible, else alphabetical
    return items.sort((a, b) => {
      const numA = parseInt(a.key, 10);
      const numB = parseInt(b.key, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.key.localeCompare(b.key);
    });
  }, [mode, students, rooms, sessions, classes, majors]);

  // Selected category student details
  const activeCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return recapData.find((r) => r.key === selectedCategory) || null;
  }, [selectedCategory, recapData]);

  const filteredCategoryStudents = useMemo(() => {
    if (!activeCategoryData) return [];
    if (!detailSearch.trim()) return activeCategoryData.students;
    const q = detailSearch.toLowerCase();
    return activeCategoryData.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.noPeserta.toLowerCase().includes(q) ||
        (s.nis || '').toLowerCase().includes(q) ||
        (s.className || '').toLowerCase().includes(q)
    );
  }, [activeCategoryData, detailSearch]);

  // Export Category Students to Excel
  const handleExportCategoryExcel = (catKey: string, catStudents: Student[]) => {
    const exportData = catStudents.map((s, idx) => ({
      No: idx + 1,
      'No. Peserta': s.noPeserta,
      NIS: s.nis || '-',
      NISN: s.nisn || '-',
      'Nama Lengkap': s.name,
      Kelas: s.className,
      Jurusan: s.jurusan,
      Sesi: s.session,
      Ruang: s.room,
      Server: s.server,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Peserta_${config.cardLabel}_${catKey}`);
    XLSX.writeFile(wb, `Peserta_${config.cardLabel}_${catKey}.xlsx`);
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {config.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Distribusi dan ringkasan kuota jumlah peserta ujian berdasarkan {config.singular.toLowerCase()}.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl">
        {/* Card Header with Refresh Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
              {config.title}
            </h2>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6">
          {recapData.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Belum ada data peserta yang tersedia.</p>
            </div>
          ) : (
            recapData.map((item) => {
              const isSelected = selectedCategory === item.key;

              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : item.key)
                  }
                  className={`bg-[#141722] border rounded-xl p-5 border-l-4 border-l-emerald-400 shadow-lg relative overflow-hidden transition-all cursor-pointer group hover:border-slate-600 hover:shadow-emerald-950/20 ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#171b28]'
                      : 'border-slate-800/90'
                  }`}
                >
                  {/* Top: Label and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {config.cardLabel}
                    </span>
                    <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Middle: Name/Code */}
                  <div className="text-2xl md:text-3xl font-extrabold text-white mt-1.5 mb-2.5 tracking-tight">
                    {item.label}
                  </div>

                  {/* Bottom: Count */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl md:text-2xl font-bold text-emerald-400">
                      {item.count}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Peserta
                    </span>
                  </div>

                  {/* Click indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <span>{isSelected ? 'Tutup rincian' : 'Klik untuk lihat rincian'}</span>
                    {isSelected ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drilldown Table when a card is selected */}
        {activeCategoryData && (
          <div className="my-6 p-4 bg-[#0d1017] border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>
                    Daftar Peserta: {config.cardLabel} {activeCategoryData.label} ({activeCategoryData.count} Siswa)
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={detailSearch}
                  onChange={(e) => setDetailSearch(e.target.value)}
                  placeholder="Cari siswa dalam grup ini..."
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-blue-500 w-48 sm:w-60"
                />
                <button
                  onClick={() =>
                    handleExportCategoryExcel(
                      activeCategoryData.label,
                      activeCategoryData.students
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Ekspor</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0e15] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">#</th>
                    <th className="py-2 px-3">NO. PESERTA</th>
                    <th className="py-2 px-3">NIS</th>
                    <th className="py-2 px-3">NAMA LENGKAP</th>
                    <th className="py-2 px-3">KELAS</th>
                    <th className="py-2 px-3">JURUSAN</th>
                    <th className="py-2 px-3">SESI</th>
                    <th className="py-2 px-3">RUANG</th>
                    <th className="py-2 px-3">SERVER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCategoryStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-500">
                        Tidak ada siswa yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredCategoryStudents.map((st, i) => (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">
                          {i + 1}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-200">
                          {st.noPeserta}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-400">
                          {st.nis || st.nisn || '-'}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-100 uppercase">
                          {st.name}
                        </td>
                        <td className="py-2 px-3 text-slate-300">
                          {st.className || '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {st.jurusan || '-'}
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-[11px]">
                            {st.session || '-'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                            {st.room || '-'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">
                          {st.server || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-800/80 mt-6">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Menampilkan total {recapData.length} kategori berdasarkan data yang tersedia.
          </span>
        </div>
      </div>
    </div>
  );
}
