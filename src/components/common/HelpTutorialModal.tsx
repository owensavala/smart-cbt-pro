'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Calendar,
  FileSpreadsheet,
  Cpu,
  Wifi,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Users,
  Settings,
  Printer,
  Download,
  Flame,
} from 'lucide-react';

interface HelpTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'OPERATOR' | 'TEACHER' | 'STUDENT';
  onNavigateTab?: (tab: string) => void;
}

export default function HelpTutorialModal({
  isOpen,
  onClose,
  defaultRole = 'OPERATOR',
  onNavigateTab,
}: HelpTutorialModalProps) {
  const [activeRoleTab, setActiveRoleTab] = useState<'OPERATOR' | 'TEACHER' | 'OFFLINE_LAB'>(
    defaultRole === 'TEACHER' ? 'TEACHER' : 'OPERATOR'
  );
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Checklist Kesiapan Ujian (disimpan ke localStorage)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartcbt_prep_checklist');
      if (saved) setChecklist(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    try {
      localStorage.setItem('smartcbt_prep_checklist', JSON.stringify(updated));
    } catch {}
  };

  if (!isOpen) return null;

  // Data Langkah Panduan Operator
  const operatorSteps = [
    {
      title: 'Langkah 1: Atur Identitas & Logo Sekolah',
      badge: 'Branding & Kop',
      icon: Settings,
      desc: 'Buka menu Pengaturan Sekolah / Branding. Atur Nama Sekolah, NPSN, Jenjang (SD/MI, SMP/MTs, SMA/MA), Nama Kepala Sekolah, dan unggah Logo Resmi. Identitas ini akan otomatis tercetak di Kop Soal Word dan Kartu Peserta Ujian.',
      actionLabel: 'Ke Pengaturan Branding',
      actionTab: 'superadmin_branding',
    },
    {
      title: 'Langkah 2: Kelola Data Siswa & Rombel',
      badge: 'Manajemen Peserta',
      icon: Users,
      desc: 'Masukkan data siswa per kelas. Anda dapat menambah satu per satu atau memanfaatkan tombol Import Siswa Excel (.xlsx / .csv) dari file Dapodik/EMIS. Data rombel akan otomatis terbentuk.',
      actionLabel: 'Ke Data Siswa',
      actionTab: 'operator_students',
    },
    {
      title: 'Langkah 3: Cetak Kartu Peserta Massal A4 dengan QR Code',
      badge: 'Kartu ANBK / UMBK',
      icon: Printer,
      desc: 'Buka modul Cetak Kartu. Pilih format 8 Kartu / Lembar A4 (standar) atau 4 Kartu / Lembar A4 (besar). Setiap kartu memuat pasfoto 2x3 dan QR Code resmi. Siswa dapat login instan tanpa mengetik password dengan memindai QR.',
      actionLabel: 'Buka Cetak Kartu',
      actionTab: 'operator_cetak',
    },
    {
      title: 'Langkah 4: Buat Jadwal Ujian Multi-Kelas (Rombel Dinamis)',
      badge: 'Jadwal Multi-Rombel',
      icon: Calendar,
      desc: 'Buka menu Jadwal Ujian > Tambah Jadwal. Pilih Bank Soal, tentukan tanggal, durasi, dan centang Multi-Kelas (misal: VII A, VII B, VII C sekaligus). Jadwal akan otomatis muncul di portal siswa kelas tersebut.',
      actionLabel: 'Atur Jadwal Ujian',
      actionTab: 'operator_jadwal',
    },
    {
      title: 'Langkah 5: Pantau Ujian Realtime & Reset Login',
      badge: 'Monitoring Live',
      icon: ShieldCheck,
      desc: 'Saat ujian berlangsung, gunakan menu Monitoring Live. Anda dapat melihat siswa yang sedang aktif, status baterai, jumlah pelanggaran ganti tab, serta tombol Reset Login jika siswa tidak sengaja menutup browser.',
      actionLabel: 'Buka Monitoring Live',
      actionTab: 'operator_monitor',
    },
  ];

  // Data Langkah Panduan Guru
  const teacherSteps = [
    {
      title: 'Langkah 1: Download Template & Buat Bank Soal',
      badge: 'Bank Soal',
      icon: FileSpreadsheet,
      desc: 'Buka menu Bank Soal. Klik "Download Template Excel" untuk mendapatkan format kolom resmi. Anda dapat menginput 5 tipe soal (PG, PGK Kompleks, Menjodohkan, Isian Singkat, dan Esai Uraian) lalu klik "Import Soal (Excel)".',
      actionLabel: 'Kelola Bank Soal',
      actionTab: 'guru_banksoal',
    },
    {
      title: 'Langkah 2: Atur Rubrik Esai AI & Kata Kunci Mandatori',
      badge: 'Fitur Unggulan AI',
      icon: Cpu,
      desc: 'Untuk soal esai/uraian, tentukan Jawaban Ideal dan Kata Kunci Wajib beserta bobot nilainya. Sistem AI / NLP Python lokal kami akan otomatis memeriksa jawaban siswa, mendeteksi sinonim, toleransi typo, dan memberikan nilai objektif tanpa kuota!',
      actionLabel: 'Coba Simulator Esai AI',
      actionTab: 'guru_banksoal',
    },
    {
      title: 'Langkah 3: Publikasi Ujian & Pengaturan Token',
      badge: 'Rilis Ujian',
      icon: Calendar,
      desc: 'Setelah bank soal siap, koordinasikan dengan proktor untuk mengaktifkan jadwal. Tentukan apakah soal dan opsi diacak, nilai langsung ditampilkan ke siswa, atau memerlukan Token Rilis proktor.',
      actionLabel: 'Lihat Jadwal Ujian',
      actionTab: 'guru_jadwal',
    },
    {
      title: 'Langkah 4: Koreksi Massal & Export Nilai ke e-Rapor',
      badge: 'Analisis & e-Rapor',
      icon: Download,
      desc: 'Setelah ujian selesai, periksa hasil koreksi otomatis di menu Penilaian. Guru tetap dapat meninjau umpan balik AI dan menyesuaikan skor manual sebelum mengekspor rekap nilai berbobot format Excel e-Rapor Kemdikbud.',
      actionLabel: 'Lihat Hasil & Analisis',
      actionTab: 'guru_analisis',
    },
  ];

  const currentSteps = activeRoleTab === 'OPERATOR' ? operatorSteps : teacherSteps;
  const step = currentSteps[Math.min(currentStepIdx, currentSteps.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#121622] border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-extrabold tracking-wide flex items-center gap-2">
                <span>Pusat Panduan & Tutorial Interaktif Smart CBT</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold">
                  v2026.1
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Panduan langkah demi langkah implementasi ujian digital sukses untuk SD, SMP, dan SMA.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Nav (Operator vs Guru vs Lab WiFi) */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 bg-[#0e121a] border-b border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveRoleTab('OPERATOR');
              setCurrentStepIdx(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeRoleTab === 'OPERATOR'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Panduan Operator (5 Langkah)</span>
          </button>

          <button
            onClick={() => {
              setActiveRoleTab('TEACHER');
              setCurrentStepIdx(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeRoleTab === 'TEACHER'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Panduan Guru (Bank Soal & Esai AI)</span>
          </button>

          <button
            onClick={() => setActiveRoleTab('OFFLINE_LAB')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeRoleTab === 'OFFLINE_LAB'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Tips Lab & Mode PWA Offline</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          {activeRoleTab !== 'OFFLINE_LAB' ? (
            <>
              {/* Stepper Dots */}
              <div className="flex items-center justify-between gap-2 max-w-xl mx-auto py-2">
                {currentSteps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      currentStepIdx === idx
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md scale-105'
                        : currentStepIdx > idx
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="hidden sm:inline text-[11px] font-semibold">{s.badge}</span>
                  </button>
                ))}
              </div>

              {/* Step Card View */}
              <div className="bg-[#181d29] border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-wide">
                        Langkah {currentStepIdx + 1} dari {currentSteps.length}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{step.title}</h3>
                    </div>
                  </div>

                  {step.actionTab && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab(step.actionTab!);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>{step.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>

                {/* Pro Tip Box */}
                <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-start gap-2.5 text-blue-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Tips Sukses:</strong>
                    <span>
                      {activeRoleTab === 'OPERATOR'
                        ? 'Simpan template Excel hasil ekspor siswa dan bank soal sebagai cadangan master offline di flashdisk proktor.'
                        : 'Pada soal esai uraian, tambahkan 2-4 kata kunci sinonim agar siswa yang menggunakan istilah setara tetap memperoleh nilai penuh secara otomatis.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                  disabled={currentStepIdx === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs text-slate-500">
                  {currentStepIdx + 1} / {currentSteps.length}
                </span>

                <button
                  onClick={() => setCurrentStepIdx((p) => Math.min(currentSteps.length - 1, p + 1))}
                  disabled={currentStepIdx === currentSteps.length - 1}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Checklist Kesiapan Ujian */}
              <div className="bg-[#151922] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Checklist Kesiapan Ujian Sekolah (Disimpan Otomatis):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'chk_logo', label: 'Identitas Sekolah, NPSN & Logo Terpasang' },
                    { id: 'chk_siswa', label: 'Data Peserta Ujian Lengkap per Rombel' },
                    { id: 'chk_kartu', label: 'Kartu Peserta A4 Berisi QR Code Sudah Dicetak' },
                    { id: 'chk_jadwal', label: 'Jadwal Ujian Multi-Kelas Sudah Dibuat & Aktif' },
                    { id: 'chk_token', label: 'Token Ujian Telah Diumumkan ke Pengawas' },
                    { id: 'chk_pwa', label: 'Aplikasi PWA Telah Diuji di Komputer Lab' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        checklist[item.id]
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 line-through'
                          : 'bg-[#0f121a] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checklist[item.id]}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 pointer-events-none"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* TAB 3: TIPS RESILIENSI LAB & OFFLINE PWA */
            <div className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Wifi className="w-5 h-5 text-amber-400" />
                  <span>Resiliensi Gangguan Jaringan & Mode Hemat Kuota</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Di banyak sekolah Indonesia, kendala utama CBT adalah router WiFi lab yang drop saat diakses 40–80 siswa bersamaan. Smart CBT dilengkapi 2 lapisan perlindungan mandiri:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-400" /> 1. Hybrid Autosave IndexedDB
                    </span>
                    <span className="text-slate-400 text-xs block">
                      Setiap kali siswa memilih opsi atau mengetik huruf di soal esai, jawaban langsung tersimpan dalam hitungan milidetik ke database IndexedDB lokal di browser perangkat siswa. Tahan tombol F5, mati lampu, atau laptop restart.
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Progressive Web App (PWA)
                    </span>
                    <span className="text-slate-400 text-xs block">
                      Aplikasi meng-cache file asset tampilan menggunakan Service Worker. Jika kabel LAN atau sinyal WiFi putus di tengah ujian, siswa tetap dapat membaca soal dan menjawab tanpa ada layar error atau reload putih.
                    </span>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Tips */}
              <div className="bg-[#151922] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-white text-xs">Pertanyaan yang Sering Diajukan (FAQ Proktor):</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">
                      Bagaimana jika ada siswa yang terlempar keluar browser?
                    </strong>
                    <span className="text-slate-400">
                      Buka menu Monitoring Live di Operator, cari nama siswa, lalu klik <strong>Reset Login</strong>. Siswa dapat login kembali dan seluruh jawaban sebelumnya akan utuh ter-restore dari IndexedDB.
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">
                      Apakah penilaian esai AI membutuhkan koneksi internet berkecepatan tinggi?
                    </strong>
                    <span className="text-slate-400">
                      <strong>Tidak sama sekali.</strong> Smart CBT menggunakan engine Python NLP lokal dan algoritma semantic rule-based internal yang berjalan 100% offline tanpa perlu koneksi ke OpenAI atau cloud server eksternal berbayar.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0e121a] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Smart CBT © 2026 • Panduan Terpadu SD, SMP, SMA/SMK</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-colors shadow-md"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
