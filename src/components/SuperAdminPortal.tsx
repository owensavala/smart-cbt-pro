'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Palette,
  School,
  Upload,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  Users,
  Eye,
  LogOut,
  Layers,
  Monitor,
  GraduationCap,
  KeyRound,
  FileText,
  AlertCircle,
  ExternalLink,
  Crown,
  Database,
  Server,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Brush,
  CheckCheck,
  Image as ImageIcon,
  Trash2,
  Download,
} from 'lucide-react';
import { SchoolBrandingSettings, ThemeColorKey } from '@/lib/types';
import { DEFAULT_BRANDING_SETTINGS } from '@/lib/mock-data';
import { THEME_PALETTES, ThemePalettePreset, getResolvedThemeColors, isColorDark } from '@/lib/theme-palettes';
import HelpTutorialModal from './common/HelpTutorialModal';

interface SuperAdminPortalProps {
  branding: SchoolBrandingSettings;
  onSaveBranding: (newBranding: SchoolBrandingSettings) => void;
  onLogout: () => void;
  onSwitchView: (view: 'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA') => void;
  currentUser?: any;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  totalSubjects?: number;
}

export default function SuperAdminPortal({
  branding,
  onSaveBranding,
  onLogout,
  onSwitchView,
  currentUser,
  totalStudents = 100,
  totalTeachers = 1,
  totalClasses = 4,
  totalSubjects = 11,
}: SuperAdminPortalProps) {
  // Navigation Tab Super Admin
  const [activeTab, setActiveTab] = useState<'KUSTOMISASI' | 'PREVIEW' | 'EKOSISTEM' | 'MANAJEMEN_AKUN'>('KUSTOMISASI');
  const [previewTab, setPreviewTab] = useState<'LOGIN_SISWA' | 'LOGIN_ADMIN' | 'TOPBAR_OPERATOR' | 'TOPBAR_GURU' | 'KARTU_UJIAN'>('LOGIN_SISWA');

  // Local Form Draft State
  const [formData, setFormData] = useState<SchoolBrandingSettings>({ ...branding });
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Kombinasi 4 warna, identitas sekolah, dan logo berhasil diterapkan global!');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Resolve dynamic colors based on current formData draft
  const currentTheme = getResolvedThemeColors(formData);

  // Update field handler
  const updateField = (key: keyof SchoolBrandingSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Pilih Preset 4-Warna
  const handleSelectPalettePreset = (preset: ThemePalettePreset) => {
    setFormData((prev) => ({
      ...prev,
      themeColor: preset.key,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      bgColor: preset.bgColor,
      surfaceColor: preset.surfaceColor,
      themeMode: preset.themeMode,
    }));
  };

  // Upload Logo Kustom
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        updateField('customLogoUrl', base64);
        updateField('logoType', 'custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Custom Logo
  const handleRemoveCustomLogo = () => {
    updateField('customLogoUrl', undefined);
    updateField('logoType', 'madrasah');
  };

  // Helper Upload Gambar Dinamis (Avatar Siswa, Hero Banner, Wallpaper, Logo Operator)
  const handleGenericImageUpload = (field: keyof SchoolBrandingSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file maksimal 3 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        updateField(field, base64);
        if (field === 'customLogoUrl') {
          updateField('logoType', 'custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save
  const handleSave = () => {
    onSaveBranding(formData);
    setIsSavedAlert(true);
    setSaveMessage('Kombinasi 4 warna & identitas sistem berhasil disimpan ke database PostgreSQL & sinkron ke seluruh portal!');
    setTimeout(() => {
      setIsSavedAlert(false);
    }, 4500);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Kembalikan seluruh pengaturan branding dan warna ke standar Kemdikbud / SMA Integral Hidayatullah?')) {
      setFormData({ ...DEFAULT_BRANDING_SETTINGS });
      onSaveBranding({ ...DEFAULT_BRANDING_SETTINGS });
      setIsSavedAlert(true);
      setSaveMessage('Pengaturan branding & kombinasi warna telah dikembalikan ke standar awal.');
      setTimeout(() => {
        setIsSavedAlert(false);
      }, 4500);
    }
  };

  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const handleClearTrialData = () => {
    if (
      !window.confirm(
        'Bersihkan seluruh riwayat sesi ujian uji coba, pelanggaran siswa, dan data jawaban sementara di browser? Tindakan ini akan mengembalikan status siswa ke kondisi awal 0.'
      )
    ) {
      return;
    }
    try {
      localStorage.removeItem('smart_cbt_student_session');
      localStorage.removeItem('smart_cbt_violations');
      localStorage.removeItem('smartcbt_prep_checklist');
      localStorage.removeItem('smartcbt_essay_grades');
      localStorage.removeItem('smart_cbt_answers');
      setResetSuccessMessage('✓ Riwayat sesi uji coba & pelanggaran berhasil dibersihkan! Sistem siap untuk simulasi baru.');
      setTimeout(() => setResetSuccessMessage(null), 5000);
    } catch {
      alert('Gagal membersihkan cache lokal.');
    }
  };

  const handleBackupConfig = () => {
    const backupData = {
      branding: formData,
      exportedAt: new Date().toISOString(),
      version: '3.2.0-Enterprise',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartCBT_BackupConfig_${formData.npsn || 'School'}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper render logo icon
  const renderCurrentLogo = (sizeClass = 'w-9 h-9') => {
    if (formData.customLogoUrl) {
      return <img src={formData.customLogoUrl} alt="Logo Sekolah" className={`${sizeClass} object-contain rounded-md`} />;
    }
    if (formData.logoType === 'kemdikbud') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} fill-amber-400 drop-shadow-sm`}>
          <polygon points="50,15 90,85 10,85" stroke="#3b82f6" strokeWidth="6" fill="#1e40af" />
          <circle cx="50" cy="55" r="16" fill="#fbbf24" />
          <path d="M 40 70 Q 50 60 60 70" stroke="#ffffff" strokeWidth="4" fill="none" />
        </svg>
      );
    }
    if (formData.logoType === 'pesantren') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} fill-emerald-400`}>
          <path d="M 20 80 L 80 80 L 80 50 Q 50 15 20 50 Z" fill="#047857" stroke="#10b981" strokeWidth="4" />
          <circle cx="50" cy="30" r="10" fill="#f59e0b" />
          <path d="M 50 15 L 50 5" stroke="#fbbf24" strokeWidth="4" />
        </svg>
      );
    }
    if (formData.logoType === 'techno') {
      return (
        <svg viewBox="0 0 100 100" className={`${sizeClass} fill-cyan-400`}>
          <rect x="25" y="25" width="50" height="50" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="6" />
          <circle cx="50" cy="50" r="14" fill="#3b82f6" />
          <path d="M 35 50 L 65 50 M 50 35 L 50 65" stroke="#ffffff" strokeWidth="3" />
        </svg>
      );
    }
    // Default madrasah
    return (
      <svg viewBox="0 0 100 100" className={`${sizeClass} drop-shadow-sm`}>
        <polygon points="50,5 95,50 50,95 5,50" fill="#047857" stroke="#fbbf24" strokeWidth="4" />
        <circle cx="50" cy="50" r="28" fill="#065f46" />
        <path d="M 35 60 L 50 40 L 65 60 Z" fill="#fbbf24" />
        <circle cx="50" cy="35" r="5" fill="#ffffff" />
      </svg>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.bgColor,
        color: currentTheme.textColor,
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOPBAR COMMAND CENTER SUPER ADMIN                           */}
      {/* ============================================================== */}
      <header
        className="h-16 px-4 md:px-8 flex items-center justify-between border-b shadow-md sticky top-0 z-40 transition-colors"
        style={{
          backgroundColor: currentTheme.primaryColor,
          borderColor: currentTheme.borderColor,
          color: '#ffffff',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
            <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base md:text-lg tracking-tight text-white">
                SUPER ADMIN COMMAND CENTER
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                Root Access
              </span>
            </div>
            <p className="text-[11px] text-white/80 font-medium truncate max-w-xs md:max-w-md">
              White-Labeling &bull; 4-Layer Color Architecture &bull; {formData.schoolName}
            </p>
          </div>
        </div>

        {/* Quick Portal Switcher & Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs">
            <button
              onClick={() => onSwitchView('OPERATOR')}
              className="px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Buka Portal Operator"
            >
              <Monitor className="w-3.5 h-3.5 text-blue-300" />
              <span>Operator</span>
            </button>
            <button
              onClick={() => onSwitchView('GURU')}
              className="px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Buka Portal Guru"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>Guru</span>
            </button>
            <button
              onClick={() => onSwitchView('SISWA')}
              className="px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Buka Portal Siswa"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Siswa</span>
            </button>
          </div>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            title="Pusat Panduan & Tutorial"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Simpan Perubahan</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition-all cursor-pointer border border-white/20"
            title="Keluar dari Super Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. TAB NAVIGATION BAR                                          */}
      {/* ============================================================== */}
      <div
        className="px-4 md:px-8 border-b flex items-center justify-between overflow-x-auto select-none transition-colors"
        style={{
          backgroundColor: currentTheme.surfaceColor,
          borderColor: currentTheme.borderColor,
        }}
      >
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => setActiveTab('KUSTOMISASI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'KUSTOMISASI'
                ? 'shadow-md font-black text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'KUSTOMISASI' ? currentTheme.primaryColor : 'transparent',
            }}
          >
            <Palette className="w-4 h-4" />
            <span>Kombinasi Warna &amp; Identitas</span>
          </button>

          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PREVIEW'
                ? 'shadow-md font-black text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'PREVIEW' ? currentTheme.primaryColor : 'transparent',
            }}
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau Portal Real-Time</span>
          </button>

          <button
            onClick={() => setActiveTab('EKOSISTEM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'EKOSISTEM'
                ? 'shadow-md font-black text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'EKOSISTEM' ? currentTheme.primaryColor : 'transparent',
            }}
          >
            <Database className="w-4 h-4" />
            <span>Statistik Ekosistem ({totalStudents} Siswa)</span>
          </button>

          <button
            onClick={() => setActiveTab('MANAJEMEN_AKUN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'MANAJEMEN_AKUN'
                ? 'shadow-md font-black text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              backgroundColor: activeTab === 'MANAJEMEN_AKUN' ? currentTheme.primaryColor : 'transparent',
            }}
          >
            <KeyRound className="w-4 h-4" />
            <span>Akun Administrator</span>
          </button>
        </div>

        {/* Indikator Status Tema Aktif */}
        <div className="hidden md:flex items-center gap-3 py-2 text-xs">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5"
            style={{
              borderColor: currentTheme.borderColor,
              backgroundColor: `${currentTheme.primaryColor}15`,
              color: currentTheme.textColor,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
            <span>Mode: {currentTheme.isDark ? 'Gelap / Deep Night' : 'Terang Siang (Light)'}</span>
          </span>
        </div>
      </div>

      {/* ALERT FEEDBACK SIMPAN */}
      {isSavedAlert && (
        <>
          <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between text-xs font-bold shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-emerald-200" />
              <span>{saveMessage}</span>
            </div>
            <button onClick={() => setIsSavedAlert(false)} className="text-white hover:text-slate-200 text-base">
              &times;
            </button>
          </div>
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs animate-in fade-in slide-in-from-bottom-4 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{saveMessage}</span>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 3. KONTEN UTAMA BERDASARKAN TAB AKTIF                          */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* ============================================================ */}
        {/* TAB 1: KUSTOMISASI IDENTITAS, 4 SUSUNAN WARNA & LOGO         */}
        {/* ============================================================ */}
        {activeTab === 'KUSTOMISASI' && (
          <div className="space-y-8">
            {/* Banner Pengantar */}
            <div
              className="rounded-2xl p-6 shadow-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{
                    backgroundColor: `${currentTheme.primaryColor}25`,
                    color: currentTheme.primaryColor,
                  }}
                >
                  <Brush className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
                    Arsitektur 4 Susunan Warna &amp; Identitas Sistem
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-black border"
                      style={{
                        backgroundColor: `${currentTheme.secondaryColor}25`,
                        borderColor: currentTheme.secondaryColor,
                        color: currentTheme.secondaryColor,
                      }}
                    >
                      4-LAYER PALETTE
                    </span>
                  </h1>
                  <p
                    className="text-xs mt-1 max-w-2xl leading-relaxed"
                    style={{ color: currentTheme.mutedTextColor }}
                  >
                    Bukan hanya mengganti aksen kecil! Sistem kami mengontrol <strong>4 lapisan warna menyeluruh</strong>:
                    (1) Warna Utama, (2) Warna Aksen, (3) Warna Kanvas Latar, dan (4) Warna Panel Kartu.
                    Termasuk dukungan penuh <strong>Mode Terang Siang Hari</strong> dan <strong>Mode Gelap Mewah</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border"
                  style={{
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.mutedTextColor,
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.secondaryColor,
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>Terapkan Global</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BAGIAN UTAMA: 8 PRESET KOMBINASI 4-WARNA HARMONIS        */}
            {/* ======================================================== */}
            <div
              className="rounded-2xl p-6 border shadow-xl space-y-6 transition-colors"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: currentTheme.borderColor }}>
                <div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                    <h2 className="font-black text-base">Pilihan Cepat: 8 Preset Kombinasi Harmonis (1-Click)</h2>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: currentTheme.mutedTextColor }}>
                    Pilih salah satu susunan warna teruji di bawah untuk langsung mengubah seluruh suasana CBT.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-semibold" style={{ color: currentTheme.mutedTextColor }}>
                  Aktif: {formData.themeColor.toUpperCase()}
                </span>
              </div>

              {/* Grid 8 Kartu Preset */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {THEME_PALETTES.map((preset) => {
                  const isSelected = formData.themeColor === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleSelectPalettePreset(preset)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.02] ${
                        isSelected
                          ? 'ring-2 shadow-xl'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: preset.bgColor,
                        borderColor: isSelected ? preset.primaryColor : 'rgba(128, 128, 128, 0.2)',
                        boxShadow: isSelected ? `0 0 0 2px ${preset.primaryColor}` : 'none',
                        color: isColorDark(preset.bgColor) ? '#ffffff' : '#0f172a',
                      }}
                    >
                      {/* Top indicator & badge */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${preset.primaryColor}20`,
                              borderColor: preset.primaryColor,
                              color: isColorDark(preset.bgColor) ? '#f8fafc' : preset.primaryColor,
                            }}
                          >
                            {preset.badge}
                          </span>
                          {isSelected && (
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md"
                              style={{ backgroundColor: preset.primaryColor }}
                            >
                              ✓
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-xs tracking-tight line-clamp-1">{preset.name}</h3>
                        <p
                          className="text-[10px] mt-1 line-clamp-2 leading-relaxed"
                          style={{
                            color: isColorDark(preset.bgColor) ? '#94a3b8' : '#64748b',
                          }}
                        >
                          {preset.description}
                        </p>
                      </div>

                      {/* Baris 4 Swatch Warna */}
                      <div className="mt-4 pt-3 border-t flex items-center justify-between gap-1" style={{ borderColor: 'rgba(128, 128, 128, 0.2)' }}>
                        <div className="flex items-center gap-1.5">
                          {/* 1. Utama */}
                          <div className="text-center group/swatch">
                            <span
                              className="w-5 h-5 rounded-md block border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.primaryColor }}
                              title={`Utama: ${preset.primaryColor}`}
                            />
                            <span className="text-[8px] opacity-70 block mt-0.5">Utama</span>
                          </div>
                          {/* 2. Aksen */}
                          <div className="text-center group/swatch">
                            <span
                              className="w-5 h-5 rounded-md block border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.secondaryColor }}
                              title={`Aksen: ${preset.secondaryColor}`}
                            />
                            <span className="text-[8px] opacity-70 block mt-0.5">Aksen</span>
                          </div>
                          {/* 3. Latar */}
                          <div className="text-center group/swatch">
                            <span
                              className="w-5 h-5 rounded-md block border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.bgColor }}
                              title={`Latar: ${preset.bgColor}`}
                            />
                            <span className="text-[8px] opacity-70 block mt-0.5">Latar</span>
                          </div>
                          {/* 4. Panel */}
                          <div className="text-center group/swatch">
                            <span
                              className="w-5 h-5 rounded-md block border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.surfaceColor }}
                              title={`Panel: ${preset.surfaceColor}`}
                            />
                            <span className="text-[8px] opacity-70 block mt-0.5">Panel</span>
                          </div>
                        </div>

                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: preset.surfaceColor,
                            color: isColorDark(preset.surfaceColor) ? '#e2e8f0' : '#1e293b',
                            border: '1px solid rgba(128, 128, 128, 0.2)',
                          }}
                        >
                          {preset.themeMode === 'light' ? '☀️ Terang' : '🌙 Gelap'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* BAGIAN 2: STUDIO PENYELARASAN 4 WARNA MANDIRI (CUSTOM)   */}
            {/* ======================================================== */}
            <div
              className="rounded-2xl p-6 border shadow-xl space-y-6 transition-colors"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: currentTheme.borderColor }}>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                  <div>
                    <h2 className="font-black text-base">Studio Kustomisasi Mandiri (4 Color Pickers)</h2>
                    <p className="text-xs" style={{ color: currentTheme.mutedTextColor }}>
                      Sesuaikan setiap kode warna HEX secara spesifik sesuai seragam atau standar visual sekolah Anda.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('themeColor', 'custom')}
                  className="text-xs font-bold px-3 py-1 rounded-lg border cursor-pointer"
                  style={{
                    backgroundColor: formData.themeColor === 'custom' ? currentTheme.primaryColor : 'transparent',
                    borderColor: currentTheme.borderColor,
                    color: formData.themeColor === 'custom' ? '#ffffff' : currentTheme.mutedTextColor,
                  }}
                >
                  Set Custom
                </button>
              </div>

              {/* 4 Color Picker Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. WARNA UTAMA (PRIMARY BRAND) */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">1. Warna Utama (Primary)</span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: currentTheme.primaryColor }}
                      />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: currentTheme.mutedTextColor }}>
                      Topbar Header, Tombol Aksi Utama, Tab Navigasi Aktif
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <input
                      type="color"
                      value={currentTheme.primaryColor}
                      onChange={(e) => {
                        updateField('primaryColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || currentTheme.primaryColor}
                      onChange={(e) => {
                        updateField('primaryColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg font-mono text-xs font-bold uppercase border bg-black/10 focus:outline-none"
                      style={{
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* 2. WARNA AKSEN (SECONDARY ACCENT) */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">2. Warna Aksen (Accent)</span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: currentTheme.secondaryColor }}
                      />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: currentTheme.mutedTextColor }}>
                      Badge Status, Border Sorotan, Icon Bintang, Tag Peringatan
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <input
                      type="color"
                      value={currentTheme.secondaryColor}
                      onChange={(e) => {
                        updateField('secondaryColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || currentTheme.secondaryColor}
                      onChange={(e) => {
                        updateField('secondaryColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg font-mono text-xs font-bold uppercase border bg-black/10 focus:outline-none"
                      style={{
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* 3. WARNA LATAR BELAKANG (BACKGROUND CANVAS) */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">3. Latar Belakang (Canvas)</span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: currentTheme.bgColor }}
                      />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: currentTheme.mutedTextColor }}>
                      Kanvas layar utama (Putih/Light, Navy, Forest, Onyx, dll)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <input
                      type="color"
                      value={currentTheme.bgColor}
                      onChange={(e) => {
                        updateField('bgColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.bgColor || currentTheme.bgColor}
                      onChange={(e) => {
                        updateField('bgColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg font-mono text-xs font-bold uppercase border bg-black/10 focus:outline-none"
                      style={{
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* 4. WARNA PANEL & KARTU (SURFACE / CARD) */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">4. Panel &amp; Kartu (Surface)</span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: currentTheme.surfaceColor }}
                      />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: currentTheme.mutedTextColor }}>
                      Sidebar, Kotak Card, Kontainer Tabel, Header Dokumen
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <input
                      type="color"
                      value={currentTheme.surfaceColor}
                      onChange={(e) => {
                        updateField('surfaceColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.surfaceColor || currentTheme.surfaceColor}
                      onChange={(e) => {
                        updateField('surfaceColor', e.target.value);
                        updateField('themeColor', 'custom');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg font-mono text-xs font-bold uppercase border bg-black/10 focus:outline-none"
                      style={{
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              {/* LIVE SIMULATED SANDBOX PREVIEW */}
              <div
                className="p-5 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: currentTheme.bgColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: currentTheme.secondaryColor }} />
                    Simulasi Pratinjau Interaktif Komposisi 4 Warna:
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: currentTheme.borderColor,
                      backgroundColor: currentTheme.surfaceColor,
                      color: currentTheme.textColor,
                    }}
                  >
                    Luminance: {currentTheme.isDark ? 'Mode Gelap (Teks Putih Terang)' : 'Mode Terang (Teks Gelap Slate)'}
                  </span>
                </div>

                {/* Simulated Mini App Window */}
                <div
                  className="rounded-xl overflow-hidden border shadow-lg"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  {/* Simulated Topbar */}
                  <div
                    className="px-4 py-2.5 flex items-center justify-between text-white shadow-xs"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs font-bold">
                        {renderCurrentLogo('w-4 h-4')}
                      </div>
                      <span className="font-black text-xs">{formData.schoolName}</span>
                    </div>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: currentTheme.secondaryColor, color: '#000000' }}
                    >
                      UJIAN AKTIF
                    </span>
                  </div>

                  {/* Simulated Body: Sidebar + Card */}
                  <div className="p-4 flex flex-col sm:flex-row gap-4">
                    {/* Simulated Sidebar */}
                    <div
                      className="w-full sm:w-44 p-3 rounded-lg border space-y-2 text-xs"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <span className="text-[10px] font-black opacity-60 uppercase block">Menu Utama</span>
                      <div
                        className="px-2.5 py-1.5 rounded-md font-bold text-xs flex items-center justify-between text-white"
                        style={{ backgroundColor: currentTheme.primaryColor }}
                      >
                        <span>Dashboard</span>
                        <span>•</span>
                      </div>
                      <div
                        className="px-2.5 py-1.5 rounded-md font-semibold text-xs opacity-75 hover:opacity-100"
                        style={{ color: currentTheme.textColor }}
                      >
                        Bank Soal
                      </div>
                      <div
                        className="px-2.5 py-1.5 rounded-md font-semibold text-xs opacity-75 hover:opacity-100"
                        style={{ color: currentTheme.textColor }}
                      >
                        Jadwal Ujian
                      </div>
                    </div>

                    {/* Simulated Card Content */}
                    <div className="flex-1 space-y-3">
                      <div
                        className="p-4 rounded-xl border space-y-3"
                        style={{
                          backgroundColor: currentTheme.surfaceColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs">Kartu Informasi Asesmen</h4>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${currentTheme.secondaryColor}25`,
                              color: currentTheme.secondaryColor,
                              border: `1px solid ${currentTheme.secondaryColor}`,
                            }}
                          >
                            Tersinkronisasi
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: currentTheme.mutedTextColor }}>
                          Kombinasi warna ini otomatis diterapkan pada seluruh sesi siswa, guru, operator, dan cetak kartu ujian.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-white font-black text-xs shadow-xs"
                            style={{ backgroundColor: currentTheme.primaryColor }}
                          >
                            Tombol Primer
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-slate-950 font-black text-xs shadow-xs"
                            style={{ backgroundColor: currentTheme.secondaryColor }}
                          >
                            Tombol Aksen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BAGIAN 3: LOGO & IDENTITAS LEMBAGA                       */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KARTU LOGO */}
              <div
                className="rounded-2xl p-6 border shadow-xl space-y-6 transition-colors"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.borderColor }}>
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                    <h3 className="font-black text-sm">Logo Sistem &amp; Sekolah</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase" style={{ color: currentTheme.mutedTextColor }}>
                    {formData.logoType}
                  </span>
                </div>

                {/* Preview Logo Saat Ini */}
                <div
                  className="p-5 border rounded-xl flex flex-col items-center justify-center text-center"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center p-2 shadow-inner"
                    style={{
                      backgroundColor: currentTheme.surfaceColor,
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    {renderCurrentLogo('w-16 h-16')}
                  </div>
                  <p className="text-xs font-bold mt-3">
                    {formData.customLogoUrl ? 'Logo Kustom Sekolah (Aktif)' : `Preset: ${formData.logoType.toUpperCase()}`}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: currentTheme.mutedTextColor }}>
                    Tampil di Topbar, Login Siswa/Guru, Kartu Peserta Ujian, &amp; Watermark
                  </p>

                  {formData.customLogoUrl && (
                    <button
                      onClick={handleRemoveCustomLogo}
                      className="mt-3 text-[11px] text-rose-500 hover:text-rose-400 font-semibold underline cursor-pointer"
                    >
                      Hapus logo kustom &amp; pakai preset
                    </button>
                  )}
                </div>

                {/* Unggah Logo Kustom Sendiri */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold">Unggah Logo Sekolah Sendiri (PNG / SVG):</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="superadmin-logo-upload"
                    />
                    <label
                      htmlFor="superadmin-logo-upload"
                      className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:border-amber-400"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <Upload className="w-4 h-4" style={{ color: currentTheme.secondaryColor }} />
                      <span>Pilih File Gambar Logo (Maks. 2MB)</span>
                    </label>
                  </div>
                </div>

                {/* Preset Logo Resmi */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    Atau Pilih Logo Resmi Bawaan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'madrasah', label: 'Madrasah Kemenag' },
                      { key: 'kemdikbud', label: 'Kemdikbud Tut Wuri' },
                      { key: 'pesantren', label: 'Kubah Pesantren' },
                      { key: 'techno', label: 'Digital Cyber' },
                    ].map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => {
                          updateField('logoType', preset.key);
                          updateField('customLogoUrl', undefined);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-bold cursor-pointer transition-all ${
                          formData.logoType === preset.key && !formData.customLogoUrl
                            ? 'ring-2 font-black shadow-md'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor:
                            formData.logoType === preset.key && !formData.customLogoUrl
                              ? currentTheme.primaryColor
                              : currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.primaryColor }} />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* KARTU IDENTITAS LEMBAGA */}
              <div
                className="rounded-2xl p-6 border shadow-xl space-y-4 transition-colors"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.borderColor }}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                    <h3 className="font-black text-sm">Nama Lembaga &amp; Teks Sistem</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    IDENTITAS RESMI
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Nama Resmi Sekolah / Lembaga:</label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField('schoolName', e.target.value)}
                      placeholder="Contoh: SMA INTEGRAL HIDAYATULLAH"
                      className="w-full border rounded-xl px-3.5 py-2 font-bold focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Sub-Nama / Kota / Slogan:</label>
                    <input
                      type="text"
                      value={formData.subName}
                      onChange={(e) => updateField('subName', e.target.value)}
                      placeholder="Contoh: Kota Ternate • CBT & Asesmen Digital SMA"
                      className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">Nomor Pokok Sekolah (NPSN):</label>
                      <input
                        type="text"
                        value={formData.npsn}
                        onChange={(e) => updateField('npsn', e.target.value)}
                        placeholder="60204321"
                        className="w-full border rounded-xl px-3.5 py-2 font-mono font-bold focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Jenjang Pendidikan:</label>
                      <select
                        value={formData.jenjang}
                        onChange={(e) => updateField('jenjang', e.target.value)}
                        className="w-full border rounded-xl px-3.5 py-2 font-bold focus:outline-none cursor-pointer"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      >
                        <option value="MA/SMA/SMK">MA / SMA / SMK</option>
                        <option value="MTs/SMP">MTs / SMP</option>
                        <option value="MI/SD">MI / SD</option>
                        <option value="UNIVERSITAS / UMUM">Universitas / Umum</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">Tahun Ajaran Aktif:</label>
                      <input
                        type="text"
                        value={formData.academicYear}
                        onChange={(e) => updateField('academicYear', e.target.value)}
                        placeholder="2025/2026"
                        className="w-full border rounded-xl px-3.5 py-2 font-bold focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Semester:</label>
                      <select
                        value={formData.semester}
                        onChange={(e) => updateField('semester', e.target.value)}
                        className="w-full border rounded-xl px-3.5 py-2 font-bold focus:outline-none cursor-pointer"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      >
                        <option value="Ganjil">Semester Ganjil</option>
                        <option value="Genap">Semester Genap</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-bold mb-1">Nama Kepala Sekolah:</label>
                      <input
                        type="text"
                        value={formData.kepalaSekolah}
                        onChange={(e) => updateField('kepalaSekolah', e.target.value)}
                        placeholder="Drs. H. Ahmad Dahlan, M.Pd."
                        className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Proktor Utama CBT:</label>
                      <input
                        type="text"
                        value={formData.proktorName}
                        onChange={(e) => updateField('proktorName', e.target.value)}
                        placeholder="Ahmad Fauzi, S.Kom."
                        className="w-full border rounded-xl px-3.5 py-2 focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.bgColor,
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BAGIAN 4: KUSTOMISASI GAMBAR & LOGO TAMPILAN LOGIN        */}
            {/* ======================================================== */}
            <div
              className="rounded-3xl p-6 md:p-8 border shadow-xl space-y-6 transition-colors"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-3" style={{ borderColor: currentTheme.borderColor }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{ backgroundColor: `${currentTheme.primaryColor}20`, color: currentTheme.primaryColor }}>
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg">Kustomisasi Gambar &amp; Logo Tampilan Login</h3>
                    <p className="text-xs" style={{ color: currentTheme.mutedTextColor }}>
                      Atur gambar banner hero, avatar siswa, logo formulir operator, dan wallpaper latar belakang secara terpisah.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full border font-bold" style={{ backgroundColor: currentTheme.bgColor, borderColor: currentTheme.borderColor, color: currentTheme.secondaryColor }}>
                  MULTI-PORTAL VISUAL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* KARTU 1: AVATAR / LOGO LOGIN SISWA */}
                <div
                  className="rounded-2xl p-5 border flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
                        <span>Logo / Avatar Login Siswa</span>
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {formData.studentLoginLogoUrl ? 'Kustom' : 'Otomatis'}
                      </span>
                    </div>

                    {/* Preview Avatar Siswa */}
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div
                        className="w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center overflow-hidden p-1 transition-transform hover:scale-105"
                        style={{
                          backgroundColor: currentTheme.surfaceColor,
                          borderColor: currentTheme.primaryColor,
                        }}
                      >
                        {formData.studentLoginLogoUrl ? (
                          <img src={formData.studentLoginLogoUrl} alt="Logo Siswa" className="w-full h-full object-contain" />
                        ) : formData.customLogoUrl ? (
                          <img src={formData.customLogoUrl} alt="Logo Utama" className="w-14 h-14 object-contain" />
                        ) : formData.jenjang === 'MI/SD' ? (
                          <span className="text-3xl">🐻</span>
                        ) : (
                          <GraduationCap className="w-10 h-10" style={{ color: currentTheme.primaryColor }} />
                        )}
                      </div>
                      <p className="text-[11px] font-bold mt-2">
                        {formData.studentLoginLogoUrl ? 'Logo Kustom Siswa Aktif' : 'Menggunakan Logo / Maskot Default'}
                      </p>
                      {formData.studentLoginLogoUrl && (
                        <button
                          type="button"
                          onClick={() => updateField('studentLoginLogoUrl', undefined)}
                          className="mt-1 text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                        >
                          Hapus &amp; kembali ke default
                        </button>
                      )}
                    </div>

                    {/* Tombol Upload Siswa */}
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-student-login-logo"
                      onChange={(e) => handleGenericImageUpload('studentLoginLogoUrl', e)}
                      className="hidden"
                    />
                    <label
                      htmlFor="upload-student-login-logo"
                      className="w-full p-2.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:border-emerald-400"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <Upload className="w-3.5 h-3.5" style={{ color: currentTheme.primaryColor }} />
                      <span>Upload Logo / Maskot Siswa</span>
                    </label>
                  </div>

                  {/* Preset Cepat Siswa */}
                  <div className="pt-2 border-t space-y-1.5" style={{ borderColor: currentTheme.borderColor }}>
                    <span className="text-[10px] font-bold block" style={{ color: currentTheme.mutedTextColor }}>
                      Preset Maskot Siswa Instan:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => updateField('studentLoginLogoUrl', undefined)}
                        className="p-1.5 rounded-lg border text-left font-bold truncate hover:border-amber-400 cursor-pointer"
                        style={{ backgroundColor: currentTheme.surfaceColor, borderColor: currentTheme.borderColor }}
                      >
                        🐻 Maskot SD/MI
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.customLogoUrl) {
                            updateField('studentLoginLogoUrl', formData.customLogoUrl);
                          } else {
                            alert('Unggah logo sekolah utama terlebih dahulu.');
                          }
                        }}
                        className="p-1.5 rounded-lg border text-left font-bold truncate hover:border-amber-400 cursor-pointer"
                        style={{ backgroundColor: currentTheme.surfaceColor, borderColor: currentTheme.borderColor }}
                      >
                        🏫 Ikuti Logo Utama
                      </button>
                    </div>
                  </div>
                </div>

                {/* KARTU 2: HERO BANNER LOGIN GURU & OPERATOR */}
                <div
                  className="rounded-2xl p-5 border flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
                        <span>Banner Hero Login Guru &amp; Operator</span>
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        {formData.loginHeroImageUrl ? 'Banner Kustom' : 'Animasi 3D'}
                      </span>
                    </div>

                    {/* Preview Hero Banner */}
                    <div className="py-2">
                      <div
                        className="w-full h-28 rounded-xl border-2 overflow-hidden relative shadow-inner flex items-center justify-center"
                        style={{
                          backgroundColor: currentTheme.surfaceColor,
                          borderColor: currentTheme.borderColor,
                        }}
                      >
                        {formData.loginHeroImageUrl ? (
                          <img src={formData.loginHeroImageUrl} alt="Banner Hero" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3 text-white">
                            <span className="text-xl">💡 💻 🎓</span>
                            <p className="text-[10px] font-bold mt-1 text-slate-300">Ilustrasi Asesmen 3D Bawaan</p>
                          </div>
                        )}
                        {formData.loginHeroImageUrl && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => updateField('loginHeroImageUrl', undefined)}
                              className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-[10px] shadow-xs cursor-pointer"
                            >
                              Hapus Banner
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-center mt-2">
                        {formData.loginHeroImageUrl ? 'Banner Hero Kustom Diterapkan' : 'Menggunakan Ilustrasi Komputer 3D Bawaan'}
                      </p>
                    </div>

                    {/* Tombol Upload Hero Banner */}
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-login-hero-image"
                      onChange={(e) => handleGenericImageUpload('loginHeroImageUrl', e)}
                      className="hidden"
                    />
                    <label
                      htmlFor="upload-login-hero-image"
                      className="w-full p-2.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:border-blue-400"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <Upload className="w-3.5 h-3.5" style={{ color: currentTheme.primaryColor }} />
                      <span>Upload Banner Hero (Maks. 3MB)</span>
                    </label>
                  </div>

                  {/* Preset Cepat Banner */}
                  <div className="pt-2 border-t space-y-1.5" style={{ borderColor: currentTheme.borderColor }}>
                    <span className="text-[10px] font-bold block" style={{ color: currentTheme.mutedTextColor }}>
                      Preset Banner Siap Pakai:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'loginHeroImageUrl',
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
                          )
                        }
                        className="p-1.5 rounded-lg border text-left font-bold truncate hover:border-blue-400 cursor-pointer"
                        style={{ backgroundColor: currentTheme.surfaceColor, borderColor: currentTheme.borderColor }}
                      >
                        💻 Lab Komputer CBT
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'loginHeroImageUrl',
                            'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
                          )
                        }
                        className="p-1.5 rounded-lg border text-left font-bold truncate hover:border-blue-400 cursor-pointer"
                        style={{ backgroundColor: currentTheme.surfaceColor, borderColor: currentTheme.borderColor }}
                      >
                        🏛️ Kampus / Sekolah
                      </button>
                    </div>
                  </div>
                </div>

                {/* KARTU 3: WALLPAPER LATAR BELAKANG & LOGO OPERATOR */}
                <div
                  className="rounded-2xl p-5 border flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className="space-y-4">
                    {/* Sub A: Wallpaper Layar Login */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" style={{ color: currentTheme.secondaryColor }} />
                          <span>Wallpaper Latar Belakang</span>
                        </span>
                        {formData.loginBgImageUrl && (
                          <button
                            type="button"
                            onClick={() => updateField('loginBgImageUrl', undefined)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 underline font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-login-bg-image"
                        onChange={(e) => handleGenericImageUpload('loginBgImageUrl', e)}
                        className="hidden"
                      />
                      <label
                        htmlFor="upload-login-bg-image"
                        className="w-full p-2.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:border-amber-400"
                        style={{
                          backgroundColor: currentTheme.surfaceColor,
                          borderColor: currentTheme.borderColor,
                        }}
                      >
                        <Upload className="w-3.5 h-3.5" style={{ color: currentTheme.secondaryColor }} />
                        <span>{formData.loginBgImageUrl ? 'Ganti Wallpaper Login' : 'Upload Wallpaper Latar Belakang'}</span>
                      </label>
                    </div>

                    {/* Sub B: Logo Header Form Operator */}
                    <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentTheme.primaryColor }} />
                          <span>Logo Khusus Form Operator</span>
                        </span>
                        {formData.operatorLogoUrl && (
                          <button
                            type="button"
                            onClick={() => updateField('operatorLogoUrl', undefined)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 underline font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-operator-form-logo"
                        onChange={(e) => handleGenericImageUpload('operatorLogoUrl', e)}
                        className="hidden"
                      />
                      <label
                        htmlFor="upload-operator-form-logo"
                        className="w-full p-2.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:border-amber-400"
                        style={{
                          backgroundColor: currentTheme.surfaceColor,
                          borderColor: currentTheme.borderColor,
                        }}
                      >
                        <Upload className="w-3.5 h-3.5" style={{ color: currentTheme.primaryColor }} />
                        <span>{formData.operatorLogoUrl ? 'Ganti Logo Operator' : 'Upload Logo Khusus Operator'}</span>
                      </label>
                    </div>
                  </div>

                  <p className="text-[10px] leading-relaxed pt-2 border-t" style={{ color: currentTheme.mutedTextColor, borderColor: currentTheme.borderColor }}>
                    ✓ Seluruh gambar otomatis dioptimasi, disimpan ke PostgreSQL, dan disinkronkan ke seluruh browser siswa &amp; guru.
                  </p>
                </div>
              </div>
            </div>

            {/* BAGIAN 5: MODE UJIAN RESMI SEKOLAH & PEMBERSIHAN PINTASAN DEMO */}
            <div
              className="p-6 rounded-3xl border shadow-xl space-y-4"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-black text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Mode Ujian Resmi Sekolah (Sembunyikan Pintasan Demo)</span>
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.mutedTextColor }}>
                    Aktifkan opsi ini ketika sekolah menyelenggarakan simulasi resmi atau ujian semester PAS/PAT. Semua tombol pintasan uji coba ("Isi Cepat: ARJUN", "Akun Cepat 1-Klik Testing", dll.) akan disembunyikan sepenuhnya dari halaman login.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.hideDemoLogin ?? false}
                    onChange={(e) => updateField('hideDemoLogin', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-3 text-xs font-bold">
                    {formData.hideDemoLogin ? 'Mode Resmi (Demo Disembunyikan)' : 'Mode Demo Terbuka'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PRATINJAU PORTAL REAL-TIME (PREVIEW)                  */}
        {/* ============================================================ */}
        {activeTab === 'PREVIEW' && (
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div>
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                  Pratinjau Nyata Penampilan Sistem
                </h2>
                <p className="text-xs mt-1" style={{ color: currentTheme.mutedTextColor }}>
                  Lihat secara langsung bagaimana kombinasi 4 warna dan logo tampak pada setiap tampilan portal.
                </p>
              </div>

              {/* Sub-Tabs Pratinjau */}
              <div
                className="flex items-center gap-1.5 p-1 rounded-xl border text-xs"
                style={{
                  backgroundColor: currentTheme.bgColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                {[
                  { key: 'LOGIN_SISWA', label: 'Login Siswa' },
                  { key: 'LOGIN_ADMIN', label: 'Login Guru/Admin' },
                  { key: 'TOPBAR_OPERATOR', label: 'Dashboard Operator' },
                  { key: 'TOPBAR_GURU', label: 'Dashboard Guru' },
                  { key: 'KARTU_UJIAN', label: 'Kartu Peserta' },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setPreviewTab(st.key as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      previewTab === st.key ? 'text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: previewTab === st.key ? currentTheme.primaryColor : 'transparent',
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div
              className="p-8 rounded-3xl border shadow-2xl flex items-center justify-center min-h-[460px] overflow-hidden transition-colors relative"
              style={{
                backgroundColor: currentTheme.bgColor,
                borderColor: currentTheme.borderColor,
                backgroundImage: formData.loginBgImageUrl ? `url(${formData.loginBgImageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Optional overlay when background image is present */}
              {formData.loginBgImageUrl && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />
              )}

              {/* 1. PREVIEW LOGIN SISWA */}
              {previewTab === 'LOGIN_SISWA' && (
                <div
                  className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4 relative z-10"
                  style={{
                    backgroundColor: currentTheme.surfaceColor,
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.textColor,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto -mt-12 flex items-center justify-center shadow-lg border-4 overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.surfaceColor,
                      borderColor: currentTheme.primaryColor,
                    }}
                  >
                    {formData.studentLoginLogoUrl ? (
                      <img
                        src={formData.studentLoginLogoUrl}
                        alt="Logo Siswa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      renderCurrentLogo('w-12 h-12')
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-base">{formData.schoolName}</h3>
                    <p className="text-xs" style={{ color: currentTheme.mutedTextColor }}>
                      {formData.subName}
                    </p>
                  </div>
                  <div className="space-y-2 text-left text-xs">
                    <div
                      className="p-2.5 rounded-xl border font-mono"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      arjun
                    </div>
                    <div
                      className="p-2.5 rounded-xl border font-mono"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      ••••••••
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl text-white font-black text-xs shadow-md"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    LOGIN SEKARANG
                  </button>
                </div>
              )}

              {/* 2. PREVIEW LOGIN GURU / ADMIN */}
              {previewTab === 'LOGIN_ADMIN' && (
                <div
                  className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[300px] relative z-10"
                  style={{
                    backgroundColor: currentTheme.surfaceColor,
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.textColor,
                  }}
                >
                  <div
                    className="md:w-1/2 p-6 flex flex-col justify-between text-white relative overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      backgroundImage: formData.loginHeroImageUrl
                        ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${formData.loginHeroImageUrl})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 p-1 flex items-center justify-center">
                        {renderCurrentLogo('w-6 h-6')}
                      </div>
                      <span className="font-black text-xs">{formData.schoolName}</span>
                    </div>
                    <div className="my-6">
                      <h4 className="font-black text-lg">Portal Asesmen Digital Guru &amp; Operator</h4>
                      <p className="text-xs opacity-80 mt-1">Platform Manajemen Soal, Siswa &amp; Analisis Hasil Ujian</p>
                    </div>
                    <span className="text-[10px] opacity-70">Versi 3.2 Pro Edition</span>
                  </div>
                  <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      {formData.operatorLogoUrl ? (
                        <img
                          src={formData.operatorLogoUrl}
                          alt="Operator Logo"
                          className="w-7 h-7 rounded-lg object-contain border border-slate-200"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-black"
                          style={{ backgroundColor: currentTheme.primaryColor }}
                        >
                          CBT
                        </div>
                      )}
                      <span className="font-black text-sm">Masuk Portal Administrator</span>
                    </div>
                    <input
                      readOnly
                      value="dermawanf727@gmail.com"
                      className="p-2.5 rounded-xl border font-mono text-xs"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    />
                    <input
                      readOnly
                      value="••••••••"
                      className="p-2.5 rounded-xl border font-mono text-xs"
                      style={{
                        backgroundColor: currentTheme.bgColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    />
                    <button
                      className="w-full py-2.5 rounded-xl text-white font-black text-xs shadow-md"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      MASUK ADMIN
                    </button>
                  </div>
                </div>
              )}

              {/* 3. PREVIEW DASHBOARD OPERATOR */}
              {previewTab === 'TOPBAR_OPERATOR' && (
                <div
                  className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div
                    className="px-5 py-3 text-white flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        {renderCurrentLogo('w-5 h-5')}
                      </div>
                      <span className="font-black text-sm">{formData.schoolName}</span>
                    </div>
                    <span
                      className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: currentTheme.secondaryColor, color: '#000000' }}
                    >
                      OPERATOR SERVER
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4">
                    <div
                      className="p-4 rounded-xl border text-center space-y-1"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <span className="text-2xl font-black">{totalStudents}</span>
                      <span className="text-xs block" style={{ color: currentTheme.mutedTextColor }}>
                        Peserta Terdaftar
                      </span>
                    </div>
                    <div
                      className="p-4 rounded-xl border text-center space-y-1"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <span className="text-2xl font-black">{totalClasses}</span>
                      <span className="text-xs block" style={{ color: currentTheme.mutedTextColor }}>
                        Rombongan Belajar
                      </span>
                    </div>
                    <div
                      className="p-4 rounded-xl border text-center space-y-1"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <span className="text-2xl font-black">{totalSubjects}</span>
                      <span className="text-xs block" style={{ color: currentTheme.mutedTextColor }}>
                        Mata Pelajaran
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PREVIEW DASHBOARD GURU */}
              {previewTab === 'TOPBAR_GURU' && (
                <div
                  className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div
                    className="px-5 py-3 text-white flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        {renderCurrentLogo('w-5 h-5')}
                      </div>
                      <span className="font-black text-sm">{formData.schoolName}</span>
                    </div>
                    <span className="text-xs font-bold text-white/90">Dra. Sri Wahyuni, M.Pd.</span>
                  </div>
                  <div className="p-6">
                    <div
                      className="p-5 rounded-2xl border flex items-center justify-between"
                      style={{
                        backgroundColor: currentTheme.surfaceColor,
                        borderColor: currentTheme.borderColor,
                        color: currentTheme.textColor,
                      }}
                    >
                      <div>
                        <h4 className="font-black text-sm">Bank Soal: FIKIH KELAS VI 26</h4>
                        <p className="text-xs mt-0.5" style={{ color: currentTheme.mutedTextColor }}>
                          Target: Kelas VI &bull; 40 Butir Pilihan Ganda Siap Ujian
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 rounded-xl text-white font-bold text-xs"
                        style={{ backgroundColor: currentTheme.primaryColor }}
                      >
                        Aktivasi Jadwal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. PREVIEW KARTU UJIAN */}
              {previewTab === 'KARTU_UJIAN' && (
                <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl border-2 border-slate-300 shadow-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
                    <div className="w-10 h-10 flex-shrink-0">{renderCurrentLogo('w-10 h-10')}</div>
                    <div className="text-center flex-1">
                      <h4 className="font-black text-xs uppercase leading-tight">{formData.schoolName}</h4>
                      <p className="text-[10px] text-slate-600 font-semibold">{formData.subName}</p>
                      <span
                        className="inline-block text-[9px] font-black uppercase text-white px-2 py-0.5 rounded mt-0.5"
                        style={{ backgroundColor: currentTheme.primaryColor }}
                      >
                        KARTU PESERTA ASESMEN DIGITAL
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] grid grid-cols-3 gap-1 pt-1 font-semibold">
                    <span className="text-slate-500">Nomor Peserta:</span>
                    <span className="col-span-2 font-mono font-bold">26-27-04-1-0101-0001</span>
                    <span className="text-slate-500">Nama Siswa:</span>
                    <span className="col-span-2 font-bold">ABDUL ADZIM</span>
                    <span className="text-slate-500">Kelas / Jurusan:</span>
                    <span className="col-span-2">X MIPA 1 (IPA)</span>
                    <span className="text-slate-500">Username:</span>
                    <span className="col-span-2 font-mono font-bold text-blue-700">abdul</span>
                    <span className="text-slate-500">Password:</span>
                    <span className="col-span-2 font-mono font-bold text-emerald-700">siswa123</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: STATISTIK EKOSISTEM SEKOLAH                           */}
        {/* ============================================================ */}
        {activeTab === 'EKOSISTEM' && (
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border shadow-xl flex items-center justify-between"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div>
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                  Database Ekosistem CBT Terintegrasi
                </h2>
                <p className="text-xs mt-1" style={{ color: currentTheme.mutedTextColor }}>
                  Seluruh data siswa, guru, kelas, dan mata pelajaran tersimpan di PostgreSQL dan tersinkronisasi 100%.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className="p-6 rounded-2xl border shadow-xl space-y-2"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    Total Peserta
                  </span>
                  <Users className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                </div>
                <div className="text-3xl font-black">{totalStudents}</div>
                <p className="text-[11px]" style={{ color: currentTheme.mutedTextColor }}>
                  Kelas X MIPA 1, X MIPA 2, X IPS 1, X IPS 2
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl space-y-2"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    Guru &amp; Pengawas
                  </span>
                  <GraduationCap className="w-5 h-5" style={{ color: currentTheme.secondaryColor }} />
                </div>
                <div className="text-3xl font-black">{totalTeachers}</div>
                <p className="text-[11px]" style={{ color: currentTheme.mutedTextColor }}>
                  Akun: dermawanf727@gmail.com
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl space-y-2"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    Rombongan Belajar
                  </span>
                  <Layers className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                </div>
                <div className="text-3xl font-black">{totalClasses}</div>
                <p className="text-[11px]" style={{ color: currentTheme.mutedTextColor }}>
                  Jurusan IPA &amp; IPS Terverifikasi
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl space-y-2"
                style={{
                  backgroundColor: currentTheme.surfaceColor,
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentTheme.mutedTextColor }}>
                    Mata Pelajaran
                  </span>
                  <FileText className="w-5 h-5" style={{ color: currentTheme.secondaryColor }} />
                </div>
                <div className="text-3xl font-black">{totalSubjects}</div>
                <p className="text-[11px]" style={{ color: currentTheme.mutedTextColor }}>
                  Fikih, Matematika, Biologi, dll.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: AKUN ADMINISTRATOR & KEAMANAN                          */}
        {/* ============================================================ */}
        {activeTab === 'MANAJEMEN_AKUN' && (
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border shadow-xl space-y-4"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <h2 className="font-black text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
                Kredensial Sesi &amp; Hak Akses Khusus
              </h2>
              <p className="text-xs" style={{ color: currentTheme.mutedTextColor }}>
                Akun yang memiliki wewenang mengubah skema warna sistem, identitas sekolah, dan struktur CBT.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  className="p-4 rounded-xl border space-y-2 text-xs"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <span className="font-black block">👑 Super Administrator (Root)</span>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Username:</span>
                    <span className="font-mono font-bold">superadmin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Password:</span>
                    <span className="font-mono font-bold">superadmin123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Wewenang:</span>
                    <span className="text-emerald-500 font-bold">Full White-Label Access</span>
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl border space-y-2 text-xs"
                  style={{
                    backgroundColor: currentTheme.bgColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <span className="font-black block">🛡️ Akun Operator Sekolah</span>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Username:</span>
                    <span className="font-mono font-bold">admin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Password:</span>
                    <span className="font-mono font-bold">admin123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: currentTheme.mutedTextColor }}>Wewenang:</span>
                    <span className="text-blue-500 font-bold">Master Data &amp; Print Center</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KARTU ALAT PEMELIHARAAN & KESIAPAN UJI COBA SEKOLAH */}
            <div
              className="p-6 rounded-2xl border shadow-xl space-y-4"
              style={{
                backgroundColor: currentTheme.surfaceColor,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-400" />
                    <span>Pemeliharaan &amp; Pembersihan Data Uji Coba (Pre-Trial Tool)</span>
                  </h3>
                  <p className="text-xs mt-1" style={{ color: currentTheme.mutedTextColor }}>
                    Gunakan fitur ini sebelum melaksanakan simulasi atau ujian resmi bersama siswa untuk memastikan seluruh riwayat pengujian sebelumnya bersih.
                  </p>
                </div>
              </div>

              {resetSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resetSuccessMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearTrialData}
                  className="p-3.5 rounded-xl border border-rose-500/30 hover:border-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Trash2 className="w-4 h-4 shrink-0 text-rose-400" />
                  <div>
                    <span className="block font-black">Bersihkan Sesi &amp; Pelanggaran</span>
                    <span className="text-[10px] opacity-75 font-normal">Hapus cache jawaban &amp; catatan pelanggaran testing</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleBackupConfig}
                  className="p-3.5 rounded-xl border border-blue-500/30 hover:border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 shrink-0 text-blue-400" />
                  <div>
                    <span className="block font-black">Download Backup Konfigurasi (.JSON)</span>
                    <span className="text-[10px] opacity-75 font-normal">Cadangkan branding, kop, &amp; tema sekolah</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer
        className="mt-auto py-4 px-6 border-t text-center text-xs transition-colors"
        style={{
          backgroundColor: currentTheme.surfaceColor,
          borderColor: currentTheme.borderColor,
          color: currentTheme.mutedTextColor,
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} {formData.schoolName} &bull; SmartCBT Pro Multi-Layer Architecture
        </p>
      </footer>

      {/* MODAL PANDUAN SUPER ADMIN */}
      <HelpTutorialModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        defaultRole="SUPER_ADMIN"
        onNavigateTab={(tab) => {
          if (tab === 'superadmin_branding') setActiveTab('KUSTOMISASI');
        }}
      />
    </div>
  );
}
