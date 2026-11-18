'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Save,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { SchoolBrandingSettings } from '@/lib/types';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  level: 'SUPER ADMIN' | 'ADMIN UBK' | 'PROKTOR' | 'PENGAWAS';
  status: 'AKTIF' | 'NONAKTIF';
  createdAt?: string;
}

interface DataAdministratorViewProps {
  branding?: SchoolBrandingSettings;
}

export default function DataAdministratorView({ branding }: DataAdministratorViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [notification, setNotification] = useState<string | null>(null);

  // Initial Admin list matching screenshot
  const [adminList, setAdminList] = useState<AdminUser[]>([
    {
      id: 'adm-1',
      name: branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH',
      username: 'smaintegralhidayatullah@gmail.com',
      level: 'SUPER ADMIN',
      status: 'AKTIF',
      createdAt: '2026-01-10',
    },
    {
      id: 'adm-2',
      name: 'Operator Utama UBK',
      username: 'operator.cbt@madrasah.id',
      level: 'ADMIN UBK',
      status: 'AKTIF',
      createdAt: '2026-02-15',
    },
    {
      id: 'adm-3',
      name: 'Proktor Ruang 1 (Lab CBT)',
      username: 'proktor.lab1@madrasah.id',
      level: 'PROKTOR',
      status: 'AKTIF',
      createdAt: '2026-03-01',
    },
    {
      id: 'adm-4',
      name: 'Pengawas Ruang Ujian',
      username: 'pengawas.sesi1@madrasah.id',
      level: 'PENGAWAS',
      status: 'AKTIF',
      createdAt: '2026-04-12',
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    level: 'ADMIN UBK' as AdminUser['level'],
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      level: 'ADMIN UBK',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      username: admin.username,
      password: '',
      level: admin.level,
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (adminList.length <= 1) {
      alert('Tidak dapat menghapus satu-satunya akun Administrator.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun administrator "${name}"?`)) {
      setAdminList((prev) => prev.filter((a) => a.id !== id));
      setNotification(`Akun administrator "${name}" berhasil dihapus.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Nama Lengkap dan Username wajib diisi.');
      return;
    }

    if (editingAdmin) {
      // Update
      setAdminList((prev) =>
        prev.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...a,
                name: formData.name,
                username: formData.username,
                level: formData.level,
              }
            : a
        )
      );
      setNotification(`Data akun administrator "${formData.name}" berhasil diperbarui.`);
    } else {
      // Create
      const newAdmin: AdminUser = {
        id: `adm-${Date.now()}`,
        name: formData.name,
        username: formData.username,
        level: formData.level,
        status: 'AKTIF',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAdminList((prev) => [newAdmin, ...prev]);
      setNotification(`Administrator baru "${formData.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredAdmins = useMemo(() => {
    return adminList.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.level.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [adminList, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
        Kelola Administrator & Pengawas
      </h1>

      {/* Main Table Card */}
      <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Card Header & Add Button matching screenshot */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm tracking-wide">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <span>Kelola Administrator & Pengawas</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Admin</span>
          </button>
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
              className="bg-[#121620] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-hidden focus:border-blue-500"
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
                placeholder="Cari administrator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121620] border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View matching screenshot */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121620] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">NAMA LENGKAP</th>
                <th className="py-3 px-4">USERNAME</th>
                <th className="py-3 px-4 text-center">LEVEL</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    Tidak ada data administrator ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAdmins.slice(0, pageSize).map((row, index) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white tracking-wide">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">
                      {row.username}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded text-[11px] font-black ${
                          row.level === 'SUPER ADMIN'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : row.level === 'ADMIN UBK'
                            ? 'bg-blue-600 text-white'
                            : row.level === 'PROKTOR'
                            ? 'bg-purple-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {row.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(row)}
                          title="Edit Admin"
                          className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {row.level !== 'SUPER ADMIN' && (
                          <button
                            onClick={() => handleDelete(row.id, row.name)}
                            title="Hapus Admin"
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination summary matching screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs text-slate-400">
          <div>
            Showing 1 to {Math.min(filteredAdmins.length, pageSize)} of {filteredAdmins.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-medium cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
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

      {/* MODAL TAMBAH / EDIT ADMIN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181d28] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#121620] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-white">
                  {editingAdmin ? 'Edit Data Administrator' : 'Tambah Administrator Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Operator CBT Madrasah"
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Username / Email Login
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Contoh: operator@madrasah.id"
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Level Hak Akses
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value as AdminUser['level'] })
                  }
                  className="w-full bg-[#121620] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="ADMIN UBK">ADMIN UBK</option>
                  <option value="PROKTOR">PROKTOR</option>
                  <option value="PENGAWAS">PENGAWAS</option>
                  <option value="SUPER ADMIN">SUPER ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  {editingAdmin ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Login'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingAdmin}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-[#121620] border border-slate-700 rounded-xl pl-3 pr-9 py-2 text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#121620] -mx-5 -mb-5 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
