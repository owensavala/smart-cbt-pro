'use client';

import React, { useState } from 'react';
import {
  Folder,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  X,
} from 'lucide-react';
import { ExamSessionInfo } from '@/lib/types';

interface MasterSesiViewProps {
  sessions: ExamSessionInfo[];
  onAdd: (item: ExamSessionInfo) => void;
  onUpdate: (item: ExamSessionInfo) => void;
  onDelete: (id: string) => void;
}

export default function MasterSesiView({
  sessions,
  onAdd,
  onUpdate,
  onDelete,
}: MasterSesiViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [sessionNumber, setSessionNumber] = useState<number>(1);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:30');
  const [description, setDescription] = useState('');

  const filtered = sessions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.sessionNumber).includes(searchTerm) ||
      item.timeRange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    const nextNum = sessions.length > 0 ? Math.max(...sessions.map((s) => s.sessionNumber)) + 1 : 1;
    setSessionNumber(nextNum);
    setName(`Sesi ${nextNum}`);
    setStartTime('07:30');
    setEndTime('09:30');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExamSessionInfo) => {
    setEditingId(item.id);
    setSessionNumber(item.sessionNumber);
    setName(item.name);
    setStartTime(item.startTime || '07:30');
    setEndTime(item.endTime || '09:30');
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const timeRange = `${startTime} - ${endTime} WIT`;

    if (editingId) {
      onUpdate({
        id: editingId,
        sessionNumber: Number(sessionNumber) || 1,
        name: name.trim(),
        timeRange,
        startTime,
        endTime,
        description: description.trim(),
      });
    } else {
      onAdd({
        id: `ses_${Date.now()}`,
        sessionNumber: Number(sessionNumber) || 1,
        name: name.trim(),
        timeRange,
        startTime,
        endTime,
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
            Data Master Sesi Ujian (Full CRUD)
          </h3>
          <p className="text-xs text-slate-400">
            Atur rentang jam kerja sesi pelaksanaan asesmen (Sesi 1 Pagi, Sesi 2 Siang, Sesi 3 Sore).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari sesi atau rentang jam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#181c26] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Sesi Ujian
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
                  SESI #{item.sessionNumber}
                </span>
                <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : item.timeRange}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rentang Pelaksanaan: {item.timeRange}
                </p>
              </div>

              {item.description && (
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  {item.description}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit Sesi"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus sesi "${item.name}"?`)) {
                    onDelete(item.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Hapus Sesi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Tidak ada sesi yang cocok dengan pencarian &quot;{searchTerm}&quot;.
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
                {editingId ? 'Edit Data Sesi UBK' : 'Tambah Sesi UBK Baru'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nomor Sesi (Angka)
                  </label>
                  <input
                    type="number"
                    required
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Label Sesi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sesi 1 (Pagi)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Keterangan Pelaksanaan
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Gelombang 1 untuk siswa reguler pagi..."
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
