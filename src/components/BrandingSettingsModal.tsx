'use client';

import React, { useState } from 'react';
import {
  School,
  Palette,
  Shield,
  Upload,
  Check,
  RotateCcw,
  Download,
  FileCode,
  Eye,
  Sliders,
  Sparkles,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { SchoolBrandingSettings, ThemeColorKey } from '../lib/types';

interface BrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: SchoolBrandingSettings;
  onSaveBranding: (newBranding: SchoolBrandingSettings) => void;
}

const THEME_PRESETS: {
  key: ThemeColorKey;
  name: string;
  sub: string;
  primaryClass: string;
  bgGrad: string;
  borderClass: string;
  hex: string;
}[] = [
  {
    key: 'blue',
    name: 'Kemdikbud Royal Blue',
    sub: 'Nuansa Resmi Kemdikbud / Tut Wuri Handayani',
    primaryClass: 'bg-blue-600',
    bgGrad: 'from-blue-600 to-indigo-700',
    borderClass: 'border-blue-500',
    hex: '#2563eb',
  },
  {
    key: 'emerald',
    name: 'Madrasah Emerald Green',
    sub: 'Nuansa Kemenag / Ikhlas Beramal',
    primaryClass: 'bg-emerald-600',
    bgGrad: 'from-emerald-600 to-teal-700',
    borderClass: 'border-emerald-500',
    hex: '#059669',
  },
  {
    key: 'indigo',
    name: 'Cyber EdTech Indigo',
    sub: 'Modern, Futuristik & Digital High-School',
    primaryClass: 'bg-indigo-600',
    bgGrad: 'from-indigo-600 to-purple-700',
    borderClass: 'border-indigo-500',
    hex: '#4f46e5',
  },
  {
    key: 'slate',
    name: 'Titanium Dark Pro',
    sub: 'Elegan, Minimalis & Kontras Maksimal',
    primaryClass: 'bg-slate-700',
    bgGrad: 'from-slate-700 to-zinc-900',
    borderClass: 'border-slate-500',
    hex: '#334155',
  },
  {
    key: 'rose',
    name: 'Patriot Ruby Crimson',
    sub: 'Tegas, Tegap & Sekolah Unggulan',
    primaryClass: 'bg-rose-600',
    bgGrad: 'from-rose-600 to-red-800',
    borderClass: 'border-rose-500',
    hex: '#e11d48',
  },
  {
    key: 'amber',
    name: 'Cendekia Gold / Amber',
    sub: 'Prestisius, Keemasan & Al-Azhar Style',
    primaryClass: 'bg-amber-600',
    bgGrad: 'from-amber-600 to-yellow-700',
    borderClass: 'border-amber-500',
    hex: '#d97706',
  },
];

const LOGO_PRESETS = [
  {
    type: 'madrasah',
    label: 'Kemenag / Madrasah',
    desc: 'Logo Kemenag Ikhlas Beramal',
    iconText: '🕌',
  },
  {
    type: 'kemdikbud',
    label: 'Tut Wuri Handayani',
    desc: 'Logo Kemdikbudristek',
    iconText: '🎓',
  },
  {
    type: 'pesantren',
    label: 'Bintang Pesantren',
    desc: 'Nuansa Lembaga Islam / Tahfidz',
    iconText: '⭐',
  },
  {
    type: 'techno',
    label: 'Cyber Shield Tech',
    desc: 'Nuansa Sekolah Kejuruan / IT',
    iconText: '🛡️',
  },
  {
    type: 'custom',
    label: 'Upload / Custom URL',
    desc: 'Gunakan File Gambar Sekolah Sendiri',
    iconText: '📁',
  },
];

export default function BrandingSettingsModal({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
}: BrandingSettingsModalProps) {
  const [form, setForm] = useState<SchoolBrandingSettings>({ ...branding });
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'THEME' | 'SECURITY' | 'BACKUP'>('IDENTITY');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          logoType: 'custom',
          customLogoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveBranding(form);
    try {
      localStorage.setItem('smart_cbt_branding', JSON.stringify(form));
    } catch {
      // Local storage fallback
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 900);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `config_cbt_${form.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.schoolName) {
            setForm((prev) => ({ ...prev, ...parsed }));
            alert('Konfigurasi sekolah berhasil diimpor!');
          }
        } catch {
          alert('Format file JSON tidak valid!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#121620] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-[#181d2a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Super Admin: Pengaturan Identitas & White-Label Sekolah
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Zero-Code Rebranding
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ubah nama sekolah, logo, kop ujian resmi, dan tema warna tanpa menyentuh baris kode program.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-6 bg-[#141824] border-b border-slate-800 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('IDENTITY')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'IDENTITY'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <School className="w-4 h-4" />
            <span>1. Profil Sekolah & Kop</span>
          </button>

          <button
            onClick={() => setActiveTab('THEME')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'THEME'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. Logo & Tema Warna</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'SECURITY'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>3. Keamanan & Anti-Bocor</span>
          </button>

          <button
            onClick={() => setActiveTab('BACKUP')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'BACKUP'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>4. Ekspor / Impor JSON</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: IDENTITY */}
          {activeTab === 'IDENTITY' && (
            <div className="space-y-5">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200 leading-relaxed">
                  Data profil di bawah ini akan <strong>otomatis tertera</strong> di seluruh header dashboard Operator, Guru, Siswa, Kartu Peserta Ujian, Daftar Hadir Ruangan, dan Berita Acara UBK tanpa perlu kompilasi ulang.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lembaga / Sekolah <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.schoolName}
                    onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                    placeholder="Contoh: SMP NEGERI 1 SURABAYA"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sub-Judul / Wilayah
                  </label>
                  <input
                    type="text"
                    value={form.subName}
                    onChange={(e) => setForm({ ...form, subName: e.target.value })}
                    placeholder="Contoh: Kota Surabaya &bull; CBT Mandiri"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NPSN / NSM Sekolah
                  </label>
                  <input
                    type="text"
                    value={form.npsn}
                    onChange={(e) => setForm({ ...form, npsn: e.target.value })}
                    placeholder="Contoh: 60204321"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jenjang Pendidikan
                  </label>
                  <select
                    value={form.jenjang}
                    onChange={(e) => setForm({ ...form, jenjang: e.target.value as any })}
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="MI/SD">Madrasah Ibtidaiyah / SD</option>
                    <option value="MTs/SMP">Madrasah Tsanawiyah / SMP</option>
                    <option value="MA/SMA/SMK">Madrasah Aliyah / SMA / SMK</option>
                    <option value="UNIVERSITAS / UMUM">Perguruan Tinggi / Kursus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={form.academicYear}
                    onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                    placeholder="2025/2026"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value as any })}
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={form.kepalaSekolah}
                    onChange={(e) => setForm({ ...form, kepalaSekolah: e.target.value })}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={form.nipKepalaSekolah}
                    onChange={(e) => setForm({ ...form, nipKepalaSekolah: e.target.value })}
                    placeholder="197505122000031002"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Penanggung Jawab Proktor
                  </label>
                  <input
                    type="text"
                    value={form.proktorName}
                    onChange={(e) => setForm({ ...form, proktorName: e.target.value })}
                    placeholder="Nama Proktor CBT"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NIP Proktor
                  </label>
                  <input
                    type="text"
                    value={form.nipProktor}
                    onChange={(e) => setForm({ ...form, nipProktor: e.target.value })}
                    placeholder="198403152009021004"
                    className="w-full bg-[#181d2a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME & LOGO */}
          {activeTab === 'THEME' && (
            <div className="space-y-6">
              {/* SELECT COLOR PRESET */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">
                  Pilih Skema Warna Identitas Sekolah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = form.themeColor === preset.key;
                    return (
                      <div
                        key={preset.key}
                        onClick={() => setForm({ ...form, themeColor: preset.key })}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? `${preset.borderClass} bg-slate-800/80 shadow-lg scale-[1.02]`
                            : 'border-slate-800 bg-[#161a24] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full inline-block shadow-sm"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span className="text-xs font-bold text-white">{preset.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">{preset.sub}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SELECT LOGO TYPE */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">
                  Pilih Gaya Logo Sekolah
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {LOGO_PRESETS.map((logo) => {
                    const isSelected = form.logoType === logo.type;
                    return (
                      <div
                        key={logo.type}
                        onClick={() => setForm({ ...form, logoType: logo.type as any })}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600/15 text-white font-bold'
                            : 'border-slate-800 bg-[#161a24] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-2xl mb-1">{logo.iconText}</div>
                        <div className="text-xs font-semibold">{logo.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* IF CUSTOM LOGO SELECTED */}
                {form.logoType === 'custom' && (
                  <div className="mt-4 p-4 bg-[#181d2a] border border-dashed border-slate-700 rounded-xl space-y-3">
                    <div className="flex items-center gap-4">
                      {form.customLogoUrl ? (
                        <img
                          src={form.customLogoUrl}
                          alt="Custom Logo"
                          className="w-16 h-16 rounded-xl object-contain bg-white/5 p-1 border border-slate-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                          <Upload className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1">
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Upload File Logo (PNG / JPG / SVG)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Atau masukkan URL gambar langsung:
                      </label>
                      <input
                        type="text"
                        value={form.customLogoUrl || ''}
                        onChange={(e) => setForm({ ...form, customLogoUrl: e.target.value })}
                        placeholder="https://sekolah.sch.id/logo.png"
                        className="w-full bg-[#121620] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* LIVE PREVIEW CARD */}
              <div className="p-4 bg-[#161a24] border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Pratinjau Langsung (Live Preview Header Sekolah)</span>
                </div>
                <div className="p-4 rounded-xl bg-[#10131a] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg text-2xl font-black">
                      {form.logoType === 'custom' && form.customLogoUrl ? (
                        <img src={form.customLogoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                      ) : form.logoType === 'madrasah' ? (
                        '🕌'
                      ) : form.logoType === 'kemdikbud' ? (
                        '🎓'
                      ) : form.logoType === 'pesantren' ? (
                        '⭐'
                      ) : (
                        '🛡️'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base tracking-tight">
                          SmartCBT Pro
                        </span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold px-2 py-0.5 rounded-full uppercase">
                          {form.schoolName || 'NAMA SEKOLAH'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {form.subName || 'CBT & Asesmen Digital'} &bull; NPSN: {form.npsn}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right text-xs">
                    <span className="text-slate-400">Tahun Ajaran:</span>{' '}
                    <span className="font-semibold text-white">{form.academicYear} ({form.semester})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ANTI-CHEAT */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-5">
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200 leading-relaxed">
                  Konfigurasi proteksi ujian dapat disesuaikan untuk tipe ujian formal berintegritas tinggi (seperti Ujian Kelulusan/ANBK) atau ujian santai berbasis tugas rumah.
                </div>
              </div>

              {/* WATERMARK ANTI BOCOR */}
              <div className="p-4 bg-[#181d2a] border border-slate-700/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Watermark Layar Siswa (Anti-Foto HP & Joki)
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        Fitur Unggulan
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Menampilkan nama siswa, NISN, dan IP address melayang secara transparan menyilang di layar ujian. Bila siswa memfoto layar dengan HP, identitasnya akan langsung tertempel di foto.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableWatermark}
                      onChange={(e) => setForm({ ...form, enableWatermark: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {form.enableWatermark && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-4">
                    <span className="text-xs text-slate-300">Tingkat Keburaman Watermark:</span>
                    <input
                      type="range"
                      min="0.05"
                      max="0.30"
                      step="0.01"
                      value={form.watermarkOpacity}
                      onChange={(e) => setForm({ ...form, watermarkOpacity: parseFloat(e.target.value) })}
                      className="flex-1 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-emerald-400">
                      {Math.round(form.watermarkOpacity * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* FULLSCREEN LOCK */}
              <div className="p-4 bg-[#181d2a] border border-slate-700/80 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Wajib Layar Penuh Kiosk (Fullscreen Enforcer)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mengharuskan siswa tetap dalam mode layar penuh (F11/Kiosk). Keluar dari layar penuh akan otomatis dicatat sebagai pelanggaran.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enableFullscreenLock}
                    onChange={(e) => setForm({ ...form, enableFullscreenLock: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* MAX VIOLATIONS */}
              <div className="p-4 bg-[#181d2a] border border-slate-700/80 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Batas Maksimal Pelanggaran Sebelum Terkunci
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Jumlah toleransi pindah tab / minimalkan jendela sebelum siswa diblokir dan wajib minta reset ke operator.
                  </p>
                </div>
                <select
                  value={form.maxViolationsAllowed}
                  onChange={(e) => setForm({ ...form, maxViolationsAllowed: parseInt(e.target.value) })}
                  className="bg-[#121620] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
                >
                  <option value={3}>3 Kali (Sangat Ketat)</option>
                  <option value={5}>5 Kali (Standar ANBK)</option>
                  <option value={10}>10 Kali (Toleran)</option>
                </select>
              </div>

              {/* AUTO SAVE */}
              <div className="p-4 bg-[#181d2a] border border-slate-700/80 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Pencadangan Otomatis Jawaban (Anti Mati Lampu)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Menyimpan setiap jawaban siswa ke memori peramban secara real-time sehingga jika PC mati, jawaban tidak hilang.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enableAutoSave}
                    onChange={(e) => setForm({ ...form, enableAutoSave: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & EXPORT JSON */}
          {activeTab === 'BACKUP' && (
            <div className="space-y-5">
              <div className="p-5 bg-[#181d2a] border border-slate-700/80 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Ekspor Konfigurasi Sekolah (.JSON)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Simpan seluruh identitas sekolah, logo, dan pengaturan warna ini menjadi file master JSON. Sangat berguna saat Anda menjual sistem ini ke sekolah lain.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File JSON Konfigurasi</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Impor File JSON Sekolah</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h5 className="text-xs font-bold text-slate-300 mb-2">
                  Pratinjau Struktur Data JSON:
                </h5>
                <pre className="text-[11px] font-mono text-emerald-400 bg-black/40 p-3 rounded-lg overflow-x-auto max-h-48">
                  {JSON.stringify(form, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-[#181d2a] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Kembalikan semua pengaturan ke setelan awal pabrik?')) {
                setForm({
                  schoolName: 'SMA INTEGRAL HIDAYATULLAH',
                  subName: 'Kota Ternate &bull; CBT & Asesmen Digital',
                  npsn: '60204321',
                  jenjang: 'MI/SD',
                  academicYear: '2025/2026',
                  semester: 'Ganjil',
                  kepalaSekolah: 'Drs. H. Ahmad Dahlan, M.Pd.I',
                  nipKepalaSekolah: '197505122000031002',
                  proktorName: 'Dermawan Surya Kencana, S. Sos',
                  nipProktor: '198403152009021004',
                  logoType: 'madrasah',
                  customLogoUrl: '',
                  themeColor: 'blue',
                  loginHeroText: 'Sistem Ujian Berbasis Komputer & Asesmen Digital',
                  loginSubText: 'Platform CBT Modern Terpadu dengan Koreksi Esai Otomatis Berbasis AI',
                  enableWatermark: true,
                  watermarkOpacity: 0.12,
                  maxViolationsAllowed: 5,
                  enableFullscreenLock: true,
                  enableAutoSave: true,
                  allowTokenBypass: false,
                });
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Bawaan</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {saveSuccessNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Berhasil Disimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Floating Success Toast */}
        {saveSuccessNotice && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Pengaturan branding &amp; identitas sekolah berhasil disimpan!</span>
          </div>
        )}
      </div>
    </div>
  );
}
