'use client';

import React, { useState } from 'react';
import {
  Folder,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Layers,
  X,
} from 'lucide-react';
import { LevelMaster } from '@/lib/types';

interface MasterLevelViewProps {
  levels: LevelMaster[];
  onAdd: (item: LevelMaster) => void;
  onUpdate: (item: LevelMaster) => void;
  onDelete: (id: string) => void;
}

export default function MasterLevelView({
  levels,
  onAdd,
  onUpdate,
  onDelete,
}: MasterLevelViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [description, setDescription] = useState('');

  const filtered = levels.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setOrder(levels.length + 1);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LevelMaster) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setOrder(item.order);
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    if (editingId) {
      onUpdate({
        id: editingId,
        code: code.trim(),
        name: name.trim(),
        order: Number(order) || 1,
        description: description.trim(),
      });
    } else {
      onAdd({
        id: `lvl_${Date.now()}`,
        code: code.trim(),
        name: name.trim(),
        order: Number(order) || 1,
        totalClasses: 1,
        description: description.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#202533] p-6 rounded-2xl border border-slate-700 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            Data Master Level & Tingkat Kelas (Full CRUD)
          </h3>
          <p className="text-xs text-slate-400">
            Kelola tingkatan jenjang pendidikan (VII, VIII, IX, X, XI, XII, RPL_X, TKJ_XII, dll).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode atau nama level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#181c26] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Level Baru
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#181c26] border border-slate-700 rounded-xl flex flex-col justify-between hover:border-slate-600 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-900/60 text-amber-300 font-mono font-bold px-2.5 py-1 rounded border border-amber-700">
                  {item.code}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-700">
                  Urutan: #{item.order}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                  {item.description || 'Tidak ada catatan.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit Level"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus level "${item.name}"?`)) {
                    onDelete(item.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Hapus Level"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Tidak ada level yang cocok dengan pencarian &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#1f2430] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-400" />
                {editingId ? 'Edit Data Level' : 'Tambah Level Baru'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Kode Level / Tingkat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: VII, VIII, IX, X, RPL_X"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Lengkap Level
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas XI (Tingkat 7 SMP/MTs)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Urutan Tingkat (Angka)
                </label>
                <input
                  type="number"
                  required
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Keterangan / Jenjang
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Jenjang Menengah Pertama Kelas 1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
