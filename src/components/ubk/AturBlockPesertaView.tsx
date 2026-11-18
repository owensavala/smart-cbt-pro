'use client';

import React, { useState } from 'react';
import {
  Lock,
  Save,
  Info,
  CheckCircle2,
  ShieldAlert,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export default function AturBlockPesertaView() {
  const [judulPesan, setJudulPesan] = useState('Upssss !!!');
  const [isiPesan, setIsPesan] = useState('Kamu di Block');
  const [teksFooter, setTeksFooter] = useState('Segera Hubungi Admin');
  const [notification, setNotification] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist to localStorage for client-side persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'cbt_block_screen_settings',
        JSON.stringify({ judulPesan, isiPesan, teksFooter })
      );
    }
    showToast('Pengaturan pesan pemblokiran login berhasil disimpan!');
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
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          Manajemen Pemblokiran Login Peserta
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-6">
        {/* Card Header matching reference screenshot */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Manajemen Pemblokiran Login Peserta</span>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{showLivePreview ? 'Tutup Preview' : 'Preview Layar Siswa'}</span>
          </button>
        </div>

        {/* Info Alert Box matching reference screenshot */}
        <div className="bg-[#0284c7] text-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-sm block">Informasi!</span>
              <p>
                Pengaturan ini akan ditampilkan pada layar siswa jika akun mereka
                sedang dalam status <strong className="font-bold underline">blokir</strong>. Pemblokiran per siswa tetap dapat dilakukan
                melalui menu <strong className="font-bold">Status Peserta</strong>.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Judul Pesan Blokir */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Judul Pesan Blokir
            </label>
            <input
              type="text"
              value={judulPesan}
              onChange={(e) => setJudulPesan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
              placeholder="Contoh: Upssss !!!"
            />
            <p className="text-[11px] text-slate-400">
              * Judul utama yang akan tampil di halaman login siswa.
            </p>
          </div>

          {/* Isi Pesan / Instruksi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Isi Pesan / Instruksi
            </label>
            <textarea
              rows={4}
              value={isiPesan}
              onChange={(e) => setIsPesan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium resize-y"
              placeholder="Contoh: Kamu di Block"
            />
            <p className="text-[11px] text-slate-400">
              * Berikan instruksi yang jelas bagi siswa yang terblokir.
            </p>
          </div>

          {/* Teks Footer */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Teks Footer
            </label>
            <input
              type="text"
              value={teksFooter}
              onChange={(e) => setTeksFooter(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
              placeholder="Contoh: Segera Hubungi Admin"
            />
            <p className="text-[11px] text-slate-400">
              * Teks kecil di bagian bawah layar.
            </p>
          </div>

          {/* Submit Button matching reference screenshot */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>

        {/* Live Preview Modal / Card */}
        {showLivePreview && (
          <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-slate-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Simulasi Tampilan Layar Siswa Ketika Terblokir:
            </span>
            <div className="bg-slate-950 border border-rose-900/60 rounded-xl p-8 text-center max-w-md mx-auto shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                {judulPesan}
              </h2>
              <p className="text-rose-300 text-sm font-semibold mb-6">
                {isiPesan}
              </p>
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                {teksFooter}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
