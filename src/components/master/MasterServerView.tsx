'use client';

import React, { useState } from 'react';
import {
  Folder,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Wifi,
} from 'lucide-react';
import { ServerMaster } from '@/lib/types';

interface MasterServerViewProps {
  servers: ServerMaster[];
  onAdd: (item: ServerMaster) => void;
  onUpdate: (item: ServerMaster) => void;
  onDelete: (id: string) => void;
}

export default function MasterServerView({
  servers,
  onAdd,
  onUpdate,
  onDelete,
}: MasterServerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<'ONLINE' | 'STANDBY' | 'OFFLINE'>('ONLINE');
  const [assignedRooms, setAssignedRooms] = useState('');

  const filtered = servers.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ipAddress.includes(searchTerm) ||
      (item.assignedRooms && item.assignedRooms.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setIpAddress('192.168.0.200');
    setStatus('ONLINE');
    setAssignedRooms('LAB-01, LAB-02, R_3');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ServerMaster) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setIpAddress(item.ipAddress);
    setStatus(item.status);
    setAssignedRooms(item.assignedRooms || '');
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
        ipAddress: ipAddress.trim(),
        status,
        assignedRooms: assignedRooms.trim(),
        lastPing: 'Baru saja',
      });
    } else {
      onAdd({
        id: `srv_${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        ipAddress: ipAddress.trim(),
        status,
        assignedRooms: assignedRooms.trim(),
        lastPing: 'Baru saja',
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
            Data Master Server CBT & Host Node (Full CRUD)
          </h3>
          <p className="text-xs text-slate-400">
            Monitoring dan manajemen alokasi mesin server UBK sekolah (SR01, Cloud CBT Cluster, dll).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode, IP, atau nama server..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#181c26] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Server CBT
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
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                    item.status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : item.status === 'STANDBY'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'ONLINE'
                        ? 'bg-emerald-400 animate-pulse'
                        : item.status === 'STANDBY'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                  />
                  {item.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mt-1">
                  <Wifi className="w-3.5 h-3.5" /> {item.ipAddress}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500">Ruang Ditugaskan:</span>{' '}
                <span className="text-slate-300 font-semibold">{item.assignedRooms || '-'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-500">
              <span>Ping: {item.lastPing || 'Aktif'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Server"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus server "${item.name}"?`)) {
                      onDelete(item.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Server"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Tidak ada server yang cocok dengan pencarian &quot;{searchTerm}&quot;.
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
                {editingId ? 'Edit Data Server CBT' : 'Tambah Server CBT Baru'}
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
                  Kode Server (ID Host)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SR01, SERVER-PUSAT-01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Server CBT
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Server UBK Utama 01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  IP Address Server
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 192.168.0.200"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Status Server
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ONLINE">ONLINE (Aktif Melayani Klien)</option>
                  <option value="STANDBY">STANDBY (Cadangan Siaga)</option>
                  <option value="OFFLINE">OFFLINE (Maintenance / Mati)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ruangan Yang Ditugaskan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: LAB-01, LAB-02, R_3"
                  value={assignedRooms}
                  onChange={(e) => setAssignedRooms(e.target.value)}
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
