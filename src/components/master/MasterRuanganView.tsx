'use client';

import React, { useState } from 'react';
import {
  Folder,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Monitor,
  Users,
  Server,
  X,
} from 'lucide-react';
import { ExamRoom } from '@/lib/types';

interface MasterRuanganViewProps {
  rooms: ExamRoom[];
  onAdd: (item: ExamRoom) => void;
  onUpdate: (item: ExamRoom) => void;
  onDelete: (id: string) => void;
}

export default function MasterRuanganView({
  rooms,
  onAdd,
  onUpdate,
  onDelete,
}: MasterRuanganViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(36);
  const [serverName, setServerName] = useState('SR01');
  const [proctorName, setProctorName] = useState('Proktor Ruang UBK');

  const filtered = rooms.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setCapacity(36);
    setServerName('SR01');
    setProctorName('Proktor Ruang UBK');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExamRoom) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setCapacity(item.capacity);
    setServerName(item.serverName);
    setProctorName(item.proctorName || 'Proktor Ruang UBK');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    if (editingId) {
      onUpdate({
        id: editingId,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        capacity: Number(capacity) || 36,
        serverName: serverName.trim(),
        proctorName: proctorName.trim(),
      });
    } else {
      onAdd({
        id: `rm_${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        capacity: Number(capacity) || 36,
        serverName: serverName.trim(),
        proctorName: proctorName.trim(),
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
            Data Master Ruangan Ujian (Full CRUD)
          </h3>
          <p className="text-xs text-slate-400">
            Daftar ruang lab komputer / kelas pelaksanaan CBT (LAB-01, LAB-02, R_3, Lab Komputer).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode atau nama ruangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#181c26] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Ruangan Baru
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-900/60 text-amber-300 font-mono font-bold px-2.5 py-1 rounded border border-amber-700">
                  {item.code}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-700 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  {item.capacity} Kursi
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Server className="w-3.5 h-3.5 text-cyan-400" /> Server: {item.serverName || 'SR01'}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500">Penanggung Jawab / Proktor:</span>{' '}
                <span className="text-slate-300 font-medium">{item.proctorName || 'Proktor Ruang UBK'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit Ruangan"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus ruangan "${item.name}"?`)) {
                    onDelete(item.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Hapus Ruangan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Tidak ada ruangan yang cocok dengan pencarian &quot;{searchTerm}&quot;.
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
                {editingId ? 'Edit Data Ruangan UBK' : 'Tambah Ruangan UBK Baru'}
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
                  Kode Ruangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LAB-01, LAB-02, LAB-01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Ruangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang Ujian 01 (Lab Komputer A)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kapasitas Kursi / PC
                  </label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Server Terhubung
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SR01"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Proktor / Penanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dermawan Surya Kencana, S. Sos"
                  value={proctorName}
                  onChange={(e) => setProctorName(e.target.value)}
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
