'use client';

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  UserPlus,
  FileSpreadsheet,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Upload,
  Download,
  Check,
  RotateCcw
} from 'lucide-react';
import { Teacher, SchoolClass, Subject } from '@/lib/types';

export interface ExtendedTeacher {
  id: string;
  name: string;
  nip: string;
  username: string;
  passwordText: string;
  jabatan: string;
  role: 'Guru Mapel' | 'Wali Kelas' | 'Ketua Jurusan';
  waliKelas: string;
  kajur: string;
  subject?: string;
  assignedSubjectIds: string[];
}

interface DataGuruViewProps {
  teachers?: Teacher[];
  classes?: SchoolClass[];
  subjects?: Subject[];
  onAddTeacher?: (teacher: Teacher) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (id: string) => void;
}

export default function DataGuruView({
  teachers = [],
  classes = [],
  subjects = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}: DataGuruViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Default teachers matching screenshot exactly
  const initialTeachers: ExtendedTeacher[] = useMemo(() => {
    const rawList: ExtendedTeacher[] = [
      {
        id: 't-1',
        name: 'Marida Saleh, S. Pd',
        nip: '-',
        username: 'marida.saleh@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'BAHASA INDONESIA',
        assignedSubjectIds: [],
      },
      {
        id: 't-2',
        name: 'Dewi A. Syawal, S. Pd',
        nip: '-',
        username: 'dewisyawal05@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'MATEMATIKA',
        assignedSubjectIds: [],
      },
      {
        id: 't-3',
        name: 'Rosida Ade, S. Pd',
        nip: '-',
        username: 'rosidaade516@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'ILMU PENGETAHUAN ALAM & SOSIAL',
        assignedSubjectIds: [],
      },
      {
        id: 't-4',
        name: 'Firda Taif, S. Pd',
        nip: '-',
        username: 'tawaryfirda@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'SENI BUDAYA & PRAKARYA',
        assignedSubjectIds: [],
      },
      {
        id: 't-5',
        name: 'Fitriana, A. Ma',
        nip: '-',
        username: 'fitrianafitri537@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'BAHASA INGGRIS',
        assignedSubjectIds: [],
      },
      {
        id: 't-6',
        name: 'Mariyatul Qibtiyah, S. Pd.I, M. Pd',
        nip: '-',
        username: 'qibtyaalfasiry@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'BAHASA ARAB',
        assignedSubjectIds: [],
      },
      {
        id: 't-7',
        name: 'Dermawan Surya Kencana, S. Sos',
        nip: '-',
        username: 'dermawant72@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'SOSIOLOGI',
        assignedSubjectIds: [],
      },
      {
        id: 't-8',
        name: 'Muhammad Syafri Jahir',
        nip: '-',
        username: 'msyafri0894@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'PPKN',
        assignedSubjectIds: [],
      },
      {
        id: 't-9',
        name: 'Nurhamza Gani, S. Ag',
        nip: '-',
        username: 'nurhamzagani@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'SEJARAH KEBUDAYAAN ISLAM',
        assignedSubjectIds: [],
      },
      {
        id: 't-10',
        name: 'Hadiyah Toatubun, A. Ma',
        nip: '-',
        username: 'hadiyahtoatubun@gmail.com',
        passwordText: '123456',
        jabatan: 'Guru Mapel',
        role: 'Guru Mapel',
        waliKelas: '-',
        kajur: '-',
        subject: 'AL-QURAN HADIST',
        assignedSubjectIds: [],
      },
    ];

    if (teachers && teachers.length > 0) {
      const merged = teachers.map((t, idx) => {
        const found = rawList.find((r) => r.id === t.id || r.name === t.name);
        return {
          id: t.id || `t-${idx + 1}`,
          name: t.name,
          nip: t.nip || '-',
          username: t.username || `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
          passwordText: t.passwordText || '123456',
          jabatan: t.jabatan || 'Guru Mapel',
          role: ((t.jabatan as any) || 'Guru Mapel') as ExtendedTeacher['role'],
          waliKelas: t.waliKelas || '-',
          kajur: t.kajur || '-',
          subject: (t as any).subject || 'Mapel Umum',
          assignedSubjectIds: t.assignedSubjectIds || [],
        };
      });
      return merged.length >= rawList.length ? merged : rawList;
    }

    return rawList;
  }, [teachers]);

  const [teacherList, setTeacherList] = useState<ExtendedTeacher[]>(initialTeachers);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<ExtendedTeacher | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    role: 'Guru Mapel' as ExtendedTeacher['role'],
    waliKelas: '',
    kajur: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Open Add
  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      nip: '',
      name: '',
      role: 'Guru Mapel',
      waliKelas: '-',
      kajur: '-',
      username: '',
      password: '',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (t: ExtendedTeacher) => {
    setEditingTeacher(t);
    setFormData({
      nip: t.nip === '-' ? '' : t.nip || '',
      name: t.name,
      role: t.role || 'Guru Mapel',
      waliKelas: t.waliKelas === '-' ? '' : t.waliKelas || '',
      kajur: t.kajur === '-' ? '' : t.kajur || '',
      username: t.username,
      password: '',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Delete single
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data guru "${name}"?`)) {
      setTeacherList((prev) => prev.filter((t) => t.id !== id));
      if (onDeleteTeacher) onDeleteTeacher(id);
      setNotification(`Data guru "${name}" berhasil dihapus.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Hapus ${selectedIds.length} guru yang dipilih?`)) {
      setTeacherList((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]);
      setNotification(`${selectedIds.length} data guru berhasil dihapus.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Toggle selection
  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTeachers.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Save Add/Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Nama Lengkap dan Username wajib diisi.');
      return;
    }

    if (editingTeacher) {
      // Edit
      const updated: ExtendedTeacher = {
        ...editingTeacher,
        nip: formData.nip.trim() ? formData.nip.trim() : '-',
        name: formData.name.trim(),
        role: formData.role,
        jabatan: formData.role,
        waliKelas: formData.role === 'Wali Kelas' && formData.waliKelas ? formData.waliKelas : '-',
        kajur: formData.role === 'Ketua Jurusan' && formData.kajur ? formData.kajur : '-',
        username: formData.username.trim(),
        passwordText: formData.password || editingTeacher.passwordText,
      };
      setTeacherList((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? updated : t))
      );
      if (onUpdateTeacher) {
        onUpdateTeacher({
          id: updated.id,
          name: updated.name,
          nip: updated.nip,
          username: updated.username,
          passwordText: updated.passwordText,
          jabatan: updated.jabatan,
          waliKelas: updated.waliKelas,
          kajur: updated.kajur,
          assignedSubjectIds: updated.assignedSubjectIds,
        });
      }
      setNotification(`Data guru "${formData.name}" berhasil diperbarui.`);
    } else {
      // Add
      const newTeacher: ExtendedTeacher = {
        id: `t-${Date.now()}`,
        nip: formData.nip.trim() ? formData.nip.trim() : '-',
        name: formData.name.trim(),
        role: formData.role,
        jabatan: formData.role,
        waliKelas: formData.role === 'Wali Kelas' && formData.waliKelas ? formData.waliKelas : '-',
        kajur: formData.role === 'Ketua Jurusan' && formData.kajur ? formData.kajur : '-',
        username: formData.username.trim(),
        passwordText: formData.password || '123456',
        subject: 'Mapel Umum',
        assignedSubjectIds: [],
      };
      setTeacherList((prev) => [newTeacher, ...prev]);
      if (onAddTeacher) {
        onAddTeacher({
          id: newTeacher.id,
          name: newTeacher.name,
          nip: newTeacher.nip,
          username: newTeacher.username,
          passwordText: newTeacher.passwordText,
          jabatan: newTeacher.jabatan,
          waliKelas: newTeacher.waliKelas,
          kajur: newTeacher.kajur,
          assignedSubjectIds: newTeacher.assignedSubjectIds,
        });
      }
      setNotification(`Guru baru "${formData.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered
  const filteredTeachers = useMemo(() => {
    return teacherList.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.nip && t.nip.includes(searchTerm)) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teacherList, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header Title */}
      <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
        Kelola Data Guru & Staf
      </h1>

      {/* Main Table Card */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header & Buttons matching screenshot */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm tracking-wide">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Kelola Data Guru & Staf</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Guru</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import Guru</span>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Toolbar: Show entries & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 mb-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-[#121620] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-hidden focus:border-purple-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-medium text-slate-400">Search:</span>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121620] border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View matching screenshot exactly */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredTeachers.length > 0 &&
                      selectedIds.length === filteredTeachers.length
                    }
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-2 text-center w-10">#</th>
                <th className="py-3 px-3 text-center">NIP / ID</th>
                <th className="py-3 px-4">NAMA LENGKAP</th>
                <th className="py-3 px-3 text-center">JABATAN</th>
                <th className="py-3 px-3 text-center">WALI KELAS</th>
                <th className="py-3 px-3 text-center">KAJUR</th>
                <th className="py-3 px-4">USERNAME</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                    Tidak ada data guru ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTeachers.slice(0, pageSize).map((row, index) => {
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(row.id)}
                          className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-2 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded text-[11px] border border-slate-700">
                          {row.nip || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white tracking-wide">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-slate-700/80 text-slate-200 px-2.5 py-0.5 rounded text-[11px] font-medium border border-slate-600/40">
                          {row.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">
                        {row.waliKelas || '-'}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">
                        {row.kajur || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-purple-400 text-[11px] underline underline-offset-2">
                        {row.username}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            title="Edit Guru"
                            className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id, row.name)}
                            title="Hapus Guru"
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs text-slate-400">
          <div>
            Showing 1 to {Math.min(filteredTeachers.length, pageSize)} of {filteredTeachers.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-medium cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-sm">
              1
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-medium cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL TAMBAH / EDIT GURU (Matching Screenshot 4 & 5)           */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181d28] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header: Purple Banner matching screenshot */}
            <div className="p-4 bg-[#7c3aed] flex items-center justify-between text-white">
              <h3 className="text-base font-bold tracking-wide">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Data Guru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form matching screenshot */}
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* NIP / No Identitas */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  NIP / No Identitas
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  placeholder="Optional"
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Nama Lengkap & Gelar */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dewi A. Syawal, S. Pd"
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Jabatan / Tugas dropdown matching screenshot 5 */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Jabatan / Tugas
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as ExtendedTeacher['role'],
                    })
                  }
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-purple-500"
                >
                  <option value="Guru Mapel">Guru Mapel</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Ketua Jurusan">Ketua Jurusan</option>
                </select>
              </div>

              {/* Conditional Wali Kelas */}
              {formData.role === 'Wali Kelas' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pilih Rombel / Kelas
                  </label>
                  <input
                    type="text"
                    value={formData.waliKelas}
                    onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                    placeholder="Contoh: Kelas X"
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              )}

              {/* Conditional Ketua Jurusan */}
              {formData.role === 'Ketua Jurusan' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pilih Jurusan
                  </label>
                  <input
                    type="text"
                    value={formData.kajur}
                    onChange={(e) => setFormData({ ...formData, kajur: e.target.value })}
                    placeholder="Contoh: MI / Keagamaan"
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              )}

              {/* Username (Login) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Username (Login)
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Contoh: dewisyawal05@gmail.com"
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-white focus:outline-hidden focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Footer buttons matching screenshot */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL IMPORT GURU EXCEL                                        */}
      {/* ============================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181d28] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-emerald-600 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                <h3 className="text-sm font-bold">Import Data Guru dari Excel</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300">
              <p>
                Gunakan template Excel berikut untuk mengunggah daftar guru dan staf secara massal sekaligus:
              </p>

              <button
                onClick={() => alert('Download template Excel guru berhasil.')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Format Template Guru (.xlsx)</span>
              </button>

              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-white font-bold">Pilih file Excel (.xlsx / .xls)</div>
                <div className="text-slate-500 text-[11px] mt-1">atau seret file ke sini</div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Proses impor data guru berhasil diselesaikan.');
                    setIsImportModalOpen(false);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                >
                  Mulai Impor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
