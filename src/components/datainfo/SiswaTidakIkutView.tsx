'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  FileSpreadsheet,
  RotateCcw,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Student,
  StudentSession,
  ExamSchedule,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
  LevelMaster,
} from '@/lib/types';

interface SiswaTidakIkutViewProps {
  students: Student[];
  studentSessions: StudentSession[];
  schedules?: ExamSchedule[];
  classes?: SchoolClass[];
  levels?: LevelMaster[];
  rooms?: ExamRoom[];
  sessions?: ExamSessionInfo[];
  onRefresh?: () => void;
}

export default function SiswaTidakIkutView({
  students,
  studentSessions,
  schedules = [],
  classes = [],
  levels = [],
  rooms = [],
  sessions = [],
  onRefresh,
}: SiswaTidakIkutViewProps) {
  // Filter States
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterSchedule, setFilterSchedule] = useState<string>('ALL');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');

  // Table controls
  const [entriesPerPage, setEntriesPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [instantSearch, setInstantSearch] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Student | 'namaMapel'>('noPeserta');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Extract available unique levels & classes for filters
  const availableLevels = useMemo(() => {
    const set = new Set<string>();
    levels.forEach((l) => set.add(l.code));
    students.forEach((s) => {
      if (s.level) set.add(s.level);
    });
    return Array.from(set).filter(Boolean);
  }, [levels, students]);

  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.name));
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set).filter(Boolean);
  }, [classes, students]);

  // Determine active exam subject name badge
  const defaultSubjectBadge = useMemo(() => {
    if (schedules && schedules.length > 0) {
      const activeSched = schedules.find((s) => s.id === filterSchedule) || schedules[0];
      return activeSched.title || activeSched.subjectId || 'BINDO-KLS-VI-1';
    }
    return 'BINDO-KLS-VI-1';
  }, [schedules, filterSchedule]);

  // Handle Search button click
  const handleApplyFilter = () => {
    setAppliedSearch(filterSearch.trim());
    setCurrentPage(1);
  };

  // Filter students who did NOT participate / have not started the exam
  const unparticipatedStudents = useMemo(() => {
    // Collect student IDs that are currently taking or have completed the exam
    const activeStudentIds = new Set<string>();
    studentSessions.forEach((sess) => {
      if (sess.status === 'SEDANG_MENGERJAKAN' || sess.status === 'SELESAI') {
        activeStudentIds.add(sess.studentId);
      }
    });

    return students.filter((s) => {
      // Must not be actively in session or finished
      if (activeStudentIds.has(s.id)) return false;

      // Filter Level
      if (filterLevel !== 'ALL' && s.level !== filterLevel) {
        return false;
      }

      // Filter Class
      if (filterClass !== 'ALL' && s.className !== filterClass) {
        return false;
      }

      // Applied Search Filter (from filter bar button)
      if (appliedSearch) {
        const q = appliedSearch.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchUser = s.username.toLowerCase().includes(q);
        const matchNis = (s.nis || '').toLowerCase().includes(q);
        const matchNisn = (s.nisn || '').toLowerCase().includes(q);
        const matchNoPeserta = (s.noPeserta || '').toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchNis && !matchNisn && !matchNoPeserta) {
          return false;
        }
      }

      // Instant Table Search
      if (instantSearch.trim()) {
        const q = instantSearch.trim().toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchUser = s.username.toLowerCase().includes(q);
        const matchNis = (s.nis || '').toLowerCase().includes(q);
        const matchNoPeserta = (s.noPeserta || '').toLowerCase().includes(q);
        const matchClass = (s.className || '').toLowerCase().includes(q);
        const matchRoom = (s.room || '').toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchNis && !matchNoPeserta && !matchClass && !matchRoom) {
          return false;
        }
      }

      return true;
    });
  }, [students, studentSessions, filterLevel, filterClass, appliedSearch, instantSearch]);

  // Sorted list
  const sortedStudents = useMemo(() => {
    return [...unparticipatedStudents].sort((a, b) => {
      let valA: any = a[sortField as keyof Student] || '';
      let valB: any = b[sortField as keyof Student] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [unparticipatedStudents, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / entriesPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return sortedStudents.slice(start, start + entriesPerPage);
  }, [sortedStudents, currentPage, entriesPerPage]);

  const toggleSort = (field: keyof Student | 'namaMapel') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = sortedStudents.map((s, idx) => ({
      No: idx + 1,
      'No. Peserta': s.noPeserta,
      NIS: s.nis || '-',
      NISN: s.nisn || '-',
      'Nama Lengkap': s.name,
      Level: s.level || '-',
      Kelas: s.className || '-',
      Jurusan: s.jurusan || '-',
      Sesi: s.session || '-',
      Ruang: s.room || '-',
      'Nama Mapel': defaultSubjectBadge,
      Status: 'Tidak Mengikuti Ujian / Belum Mulai',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Siswa Tidak Ikut');

    const cleanName = defaultSubjectBadge.replace(/[^a-zA-Z0-9_-]/g, '_');
    XLSX.writeFile(wb, `Daftar_Siswa_Tidak_Ikut_Ujian_${cleanName}.xlsx`);
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Daftar Siswa Tidak Mengikuti Ujian
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitoring dan rekapitulasi siswa yang belum masuk atau tidak mengikuti sesi asesmen UBK.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl">
        {/* Card Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
              Daftar Siswa Tidak Mengikuti Ujian
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 4-Input Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-5 p-4 bg-[#0d1017] border border-slate-800/80 rounded-xl">
          {/* 1. Filter Level */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Filter Level:
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500 transition-colors"
            >
              <option value="ALL">Semua Level</option>
              {availableLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter Kelas */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Filter Kelas:
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500 transition-colors"
            >
              <option value="ALL">Semua Kelas</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Jadwal Ujian */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Jadwal Ujian:
            </label>
            <select
              value={filterSchedule}
              onChange={(e) => setFilterSchedule(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500 transition-colors"
            >
              <option value="ALL">Semua Jadwal</option>
              {schedules.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.title} ({sch.className})
                </option>
              ))}
            </select>
          </div>

          {/* 4. Cari Nama / Username / NIS */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Cari Nama / Username / NIS:
            </label>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
              placeholder="Ketik nama, username, atau NIS..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 5. Button CARI DATA */}
          <div className="flex items-end">
            <button
              onClick={handleApplyFilter}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md uppercase tracking-wider cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>CARI DATA</span>
            </button>
          </div>
        </div>

        {/* Table Controls (Show Entries & Search) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={instantSearch}
              onChange={(e) => {
                setInstantSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter cepat tabel..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table Display */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3 w-12 text-center text-slate-500">#</th>
                <th
                  onClick={() => toggleSort('noPeserta')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>NO. PESERTA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('nis')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>NIS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>NAMA LENGKAP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('className')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>KELAS / JURUSAN</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('session')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>SESI</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('room')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>RUANG</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span>NAMA MAPEL</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span>STATUS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Tidak ada siswa yang belum mengikuti ujian dengan kriteria ini.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const globalIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                  // Format session display (e.g., extract '1' if 'Sesi 1')
                  const cleanSession = (student.session || '1').replace(/[^0-9]/g, '') || '1';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                    >
                      {/* # */}
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                        {globalIdx}
                      </td>

                      {/* NO. PESERTA */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-mono text-[11px] bg-slate-900 border border-slate-700/80 text-slate-200">
                          {student.noPeserta}
                        </span>
                      </td>

                      {/* NIS */}
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {student.nis || student.nisn || '-'}
                      </td>

                      {/* NAMA LENGKAP */}
                      <td className="py-2.5 px-3 font-bold text-slate-100 uppercase tracking-wide">
                        {student.name}
                      </td>

                      {/* KELAS / JURUSAN */}
                      <td className="py-2.5 px-3 leading-tight">
                        <div className="font-bold text-slate-200">{student.className || '-'}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{student.jurusan || '-'}</div>
                      </td>

                      {/* SESI */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs">
                          {cleanSession}
                        </span>
                      </td>

                      {/* RUANG */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-slate-300 font-medium text-xs">
                          {student.room || 'LAB-01'}
                        </span>
                      </td>

                      {/* NAMA MAPEL */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[11px] shadow-xs">
                          {defaultSubjectBadge}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Aktif</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
          <div>
            Showing {sortedStudents.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, sortedStudents.length)} of {sortedStudents.length}{' '}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
              if (
                pg === 1 ||
                pg === totalPages ||
                (pg >= currentPage - 1 && pg <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === pg
                        ? 'bg-blue-600 text-white font-bold'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pg}
                  </button>
                );
              }
              if (pg === currentPage - 2 || pg === currentPage + 2) {
                return (
                  <span key={pg} className="px-1 text-slate-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
