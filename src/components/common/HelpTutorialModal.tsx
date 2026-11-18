'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  AlertTriangle,
  Monitor,
  RotateCcw,
  Key,
  Layers,
  Award,
  Clock,
  ExternalLink,
  Code,
  Smartphone,
  Eye,
  Check,
  Zap,
} from 'lucide-react';

export type HelpRoleTab = 'OPERATOR' | 'TEACHER' | 'STUDENT' | 'SUPER_ADMIN' | 'TROUBLESHOOT';

interface HelpTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'OPERATOR' | 'TEACHER' | 'STUDENT' | 'SUPER_ADMIN';
  onNavigateTab?: (tab: string) => void;
}

interface StepItem {
  id: string;
  title: string;
  badge: string;
  icon: any;
  summary: string;
  details: string[];
  actionLabel?: string;
  actionTab?: string;
  proTip: string;
  importantNote?: string;
}

interface FaqItem {
  q: string;
  category: string;
  a: string;
  solutionSteps?: string[];
  badgeColor?: string;
}

export default function HelpTutorialModal({
  isOpen,
  onClose,
  defaultRole = 'OPERATOR',
  onNavigateTab,
}: HelpTutorialModalProps) {
  const [activeTab, setActiveTab] = useState<HelpRoleTab>(
    defaultRole === 'TEACHER'
      ? 'TEACHER'
      : defaultRole === 'STUDENT'
      ? 'STUDENT'
      : defaultRole === 'SUPER_ADMIN'
      ? 'SUPER_ADMIN'
      : 'OPERATOR'
  );

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('ALL');

  // Checklist Kesiapan Ujian Sekolah (disimpan ke localStorage)
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

  // Reset step index saat berganti tab
  const handleTabChange = (tab: HelpRoleTab) => {
    setActiveTab(tab);
    setCurrentStepIdx(0);
  };

  // ==============================================================
  // 1. DATA PANDUAN LENGKAP OPERATOR & PROKTOR
  // ==============================================================
  const operatorSteps: StepItem[] = [
    {
      id: 'op_1',
      title: 'Tahap 1: Pengaturan Lembaga, NPSN, & Identitas Sekolah',
      badge: 'Identitas & Kop',
      icon: Settings,
      summary:
        'Langkah pertama sebelum memulai adalah melengkapi identitas resmi lembaga agar otomatis tercetak pada Kartu Peserta Ujian, Kop Soal, dan Berita Acara.',
      details: [
        'Klik tombol "Ke Pengaturan Branding" atau buka icon Pengaturan di sudut kanan atas.',
        'Isi Nama Resmi Sekolah (contoh: SMA INTEGRAL HIDAYATULLAH), Sub-Nama/Kota, NPSN, Jenjang Pendidikan (SD, SMP, atau SMA), Tahun Ajaran, dan Semester.',
        'Isi Nama Kepala Sekolah dan Nama Proktor Utama beserta NIP resmi.',
        'Pilih Logo Resmi bawaan (Kemenag, Kemdikbud, Pesantren, Techno) atau unggah logo PNG transparan sendiri (maks 2MB).',
      ],
      actionLabel: 'Buka Pengaturan Branding',
      actionTab: 'superadmin_branding',
      proTip:
        'Semua identitas ini langsung tersimpan ke PostgreSQL Cloud dan otomatis muncul di cetak kartu peserta serta kop dokumen tanpa perlu diedit ulang.',
    },
    {
      id: 'op_2',
      title: 'Tahap 2: Data Master Sekolah (1-Klik Import Master Excel)',
      badge: 'Data Master',
      icon: DatabaseIcon,
      summary:
        'Menyiapkan struktur ruang lab, sesi waktu, tingkatan kelas, jurusan, mata pelajaran, dan jenis ujian.',
      details: [
        'Buka menu Data Master > Import Data Master.',
        'Gunakan tombol "Download Template Master Excel" untuk mendapatkan format baku.',
        'Atau cukup klik "Terapkan Template Master Bawaan (SMA / SMP)" untuk mengisi otomatis 11 Mapel, 4 Kelas, 3 Lab Komputer, dan 2 Sesi Ujian dalam 1 detik.',
        'Anda dapat mengedit kapasitas lab komputer (misal: Lab 01 = 40 PC, Lab 02 = 40 PC) dan jam sesi ujian (Sesi 1: 07.30 - 09.30, Sesi 2: 10.00 - 12.00).',
      ],
      actionLabel: 'Buka Import Master',
      actionTab: 'operator_master',
      proTip:
        'Pastikan kapasitas Ruang Lab mencukupi jumlah siswa per sesi agar tidak terjadi bentrok nomor meja.',
    },
    {
      id: 'op_3',
      title: 'Tahap 3: Pendaftaran Siswa & Cetak Kartu Massal A4 dengan QR Code',
      badge: 'Peserta & Kartu',
      icon: Users,
      summary:
        'Mengelola data peserta ujian (NISN, No. Peserta, Kelas, Ruang, Sesi) dan mencetak kartu peserta resmi berstandar ANBK.',
      details: [
        'Buka menu "Peserta Ujian" untuk melihat daftar siswa atau menambahkan siswa baru secara individual / import Excel.',
        'Nomor peserta resmi disusun dengan format terstandar: 26-27-04-1-XXXX-YYYY.',
        'Buka menu "Cetak > Cetak Kartu". Anda dapat memilih layout cetak 8 Kartu / Lembar A4 (hemat kertas) atau 4 Kartu / Lembar A4 (ekstra besar).',
        'Setiap kartu memuat pasfoto siswa dan QR Code login instan. Siswa tinggal memindai QR Code di kamera untuk login tanpa repot mengetik password rumit.',
      ],
      actionLabel: 'Buka Cetak Kartu A4',
      actionTab: 'operator_cetak',
      proTip:
        'Cetak kartu di kertas Brief Card (BC) atau HVS 80gr 1-2 hari sebelum ujian, lalu bagikan ke siswa untuk dibawa setiap hari ujian.',
    },
    {
      id: 'op_4',
      title: 'Tahap 4: Pembuatan Jadwal Ujian Multi-Kelas (Rombel Dinamis)',
      badge: 'Penjadwalan',
      icon: Calendar,
      summary:
        'Menghubungkan paket bank soal yang dibuat guru dengan kelas sasaran, menentukan tanggal, durasi pengerjaan, dan token.',
      details: [
        'Buka menu "Jadwal Ujian" > Klik "Tambah Jadwal".',
        'Pilih Bank Soal yang aktif dan tentukan Tanggal Ujian serta Durasi Pengerjaan (misal: 90 menit).',
        'Centang rombel sasaran (Multi-Kelas: X MIPA 1, X MIPA 2, X IPS 1, X IPS 2 sekaligus).',
        'Atur KKM (skor kelulusan, misal: 75.0), opsi Acak Soal, Acak Pilihan Jawaban, dan Toleransi Keluar Layar (Grace Period: 4 detik).',
        'Pastikan status jadwal disetel menjadi "AKTIF".',
      ],
      actionLabel: 'Buka Jadwal Ujian',
      actionTab: 'operator_jadwal',
      proTip:
        'Aktifkan opsi "Acak Pilihan Opsi" agar urutan A, B, C, D di layar siswa sebelah berbeda sehingga mencegah budaya saling contek.',
    },
    {
      id: 'op_5',
      title: 'Tahap 5: Operasional Hari-H UBK (Token, Monitor Live, & Reset Login)',
      badge: 'Monitoring Live',
      icon: Monitor,
      summary:
        'Memantau jalannya ujian secara real-time dari meja proktor saat seluruh siswa sedang mengerjakan soal di Lab atau HP.',
      details: [
        'Buka menu "UBK > Rilis Token". Rilis token ujian resmi (misal: 36S7KS) dan tulis di papan tulis lab komputer.',
        'Buka menu "UBK > Status Peserta". Anda akan melihat status setiap siswa secara langsung (Belum Masuk, Sedang Mengerjakan, Selesai, atau Terkunci).',
        'Jika ada siswa yang komputernya mati listrik, restart, atau browser tertutup: buka menu "UBK > Reset Login", cari namanya, dan klik "Reset / Buka Kunci". Siswa bisa langsung login kembali dan seluruh jawaban sebelumnya UTUH tersimpan.',
        'Menu "UBK > Laporan Pelanggaran": memantau siswa yang terdeteksi berganti tab, membuka Google, atau membagi layar.',
      ],
      actionLabel: 'Buka Live Monitor UBK',
      actionTab: 'operator_monitor',
      proTip:
        'Jika siswa terlempar keluar, JANGAN panik dan JANGAN buat akun baru! Cukup klik Reset Login di UBK, jawaban siswa dijamin 100% aman karena tersimpan di IndexedDB browser.',
    },
    {
      id: 'op_6',
      title: 'Tahap 6: Pasca Ujian (Koreksi Nilai, Berita Acara, & Leger e-Rapor)',
      badge: 'Pelaporan Akhir',
      icon: Award,
      summary:
        'Mencetak dokumen resmi administrasi ujian dan mengekspor rekap nilai akhir.',
      details: [
        'Buka menu "Cetak > Berita Acara". Cetak dokumen berita acara untuk ditandatangani proktor dan pengawas ruang.',
        'Buka menu "Cetak > Daftar Hadir" untuk rekap absensi kehadiran siswa.',
        'Buka menu "Nilai > Hasil Nilai". Seluruh nilai pilihan ganda sudah terhitung otomatis, dan nilai esai telah dievaluasi oleh AI.',
        'Klik tombol "Export Excel (.xlsx)" untuk mengunduh rekap nilai terstandar yang siap diimpor ke aplikasi e-Rapor Kemdikbud.',
      ],
      actionLabel: 'Buka Hasil Nilai',
      actionTab: 'operator_nilai',
      proTip:
        'Cetak Leger Nilai untuk arsip kurikulum sekolah. Rekap ranking kelas otomatis tersedia di menu Analisa Nilai Ranking.',
    },
  ];

  // ==============================================================
  // 2. DATA PANDUAN LENGKAP DEWAN GURU
  // ==============================================================
  const teacherSteps: StepItem[] = [
    {
      id: 't_1',
      title: 'Tahap 1: Membuat Bank Soal & Format Import Excel (5 Tipe Soal)',
      badge: 'Bank Soal',
      icon: FileSpreadsheet,
      summary:
        'SmartCBT Pro mendukung 5 jenis soal standar AKM/ANBK nasional, bukan hanya pilihan ganda biasa.',
      details: [
        'Buka menu "Bank Soal" > Klik "Tambah Bank Soal" atau "Import Soal (Excel)".',
        'Format 1: PG Biasa (Pilihan Ganda 1 jawaban benar: A, B, C, D, E).',
        'Format 2: PGK Multi-Pilihan (Siswa dapat mencentang 2 atau lebih jawaban benar).',
        'Format 3: PGK Matriks Benar/Salah (Tabel pernyataan dengan opsi Benar atau Salah per baris).',
        'Format 4: Menjodohkan (Premis di sebelah kiri dicocokkan dengan target di sebelah kanan).',
        'Format 5: Isian Singkat & Esai Uraian AI (Siswa menjawab kalimat bebas, dinilai otomatis oleh AI).',
      ],
      actionLabel: 'Buka Bank Soal',
      actionTab: 'guru_banksoal',
      proTip:
        'Gunakan fitur Download Template Excel Bank Soal resmi agar penulisan kolom soal, kunci jawaban, dan bobot poin langsung rapi.',
    },
    {
      id: 't_2',
      title: 'Tahap 2: Menulis Rumus Matematika & Sains di Math Studio (LaTeX)',
      badge: 'Math Studio',
      icon: Code,
      summary:
        'Fasilitas khusus guru eksakta (Matematika, Fisika, Kimia) untuk menyusun rumus rumit, pecahan, akar, integral, dan grafik.',
      details: [
        'Buka menu "Math Studio" dari sidebar.',
        'Tersedia tombol pintas instan untuk pecahan (\\frac{a}{b}), akar (\\sqrt{x}), pangkat (x^2), integral, matriks, dan huruf Yunani (\\alpha, \\beta, \\pi, \\theta).',
        'Dilengkapi Generator Sketsa Parabola interaktif untuk fungsi kuadrat f(x) = ax² + bx + c yang langsung menghasilkan visual grafik SVG beresolusi tinggi.',
        'Salin kode LaTeX atau gambar grafik yang dihasilkan langsung ke kolom teks soal di Bank Soal.',
      ],
      actionLabel: 'Buka Math Studio',
      actionTab: 'guru_mathstudio',
      proTip:
        'Soal yang memuat rumus matematika dirender dengan KaTeX berkecepatan tinggi, sehingga rumus tampil tajam di layar HP maupun laptop tanpa membebani kuota.',
    },
    {
      id: 't_3',
      title: 'Tahap 3: Menyetel Rubrik Esai AI & Kata Kunci Mandatori',
      badge: 'Esai AI Otomatis',
      icon: Cpu,
      summary:
        'Inovasi utama: Cara agar soal esai bisa dinilai otomatis tanpa guru harus memeriksa manual ratusan lembar!',
      details: [
        'Pada soal bertipe "ESSAY", masukkan Jawaban Ideal sebagai referensi pembanding.',
        'Tentukan Rubrik Konsep Utama (KeyPoints). Misalnya: Konsep 1 bobot 7 poin, Konsep 2 bobot 6 poin, Konsep 3 bobot 7 poin (Total 20 poin).',
        'Pada setiap konsep, masukkan 2-4 kata kunci esensial yang diharapkan ada di jawaban siswa.',
        'Tambahkan kata sinonim jika ada istilah setara (misal: "tanaman" untuk "tumbuhan", "o2" untuk "oksigen").',
        'Tingkat ketelitian (Strictness): Standar (toleransi typo 1-2 huruf & sinonim) atau Ketat.',
      ],
      actionLabel: 'Coba Simulator Esai AI',
      actionTab: 'guru_simulator',
      proTip:
        'Siswa tidak perlu menjawab persis 1 kata! Mesin NLP kami mengevaluasi kalimat bebas siswa secara semantik dan objektif.',
    },
    {
      id: 't_4',
      title: 'Tahap 4: Koreksi Esai Otomatis & Penyesuaian Nilai Manual',
      badge: 'Koreksi Instan',
      icon: Zap,
      summary:
        'Proses penentuan nilai otomatis dan hak veto guru untuk menyesuaikan skor jika diperlukan.',
      details: [
        'Saat ujian selesai, seluruh jawaban esai siswa langsung dinilai oleh engine NLP dalam hitungan milidetik.',
        'Buka menu "Hasil Nilai". Klik tombol "Periksa / Koreksi Esai" untuk melihat rincian evaluasi per siswa.',
        'Sistem menyajikan transparansi: konsep mana yang tercapai, kata kunci apa yang ditemukan, serta umpan balik naratif untuk siswa.',
        'Guru tetap memiliki kendali penuh: jika guru merasa siswa berhak mendapat tambahan poin, guru cukup mengedit angka skor dan klik Simpan.',
      ],
      actionLabel: 'Lihat Hasil Nilai',
      actionTab: 'guru_nilai',
      proTip:
        'Dengan fitur ini, beban koreksi esai berkurang hingga 95%. Guru tidak perlu lagi begadang memeriksa ratusan jawaban esai manual.',
    },
    {
      id: 't_5',
      title: 'Tahap 5: Analisa Butir Soal, Daya Pembeda, & Program Remedial',
      badge: 'Analisis & Remedial',
      icon: Award,
      summary:
        'Menganalisis kualitas soal dan memetakan siswa yang membutuhkan pengayaan atau perbaikan nilai (remedial).',
      details: [
        'Menu "Analisa > Analisa Per Soal": memperlihatkan butir soal mana yang terlalu sulit (tingkat kesukaran) dan daya pembeda butir soal.',
        'Menu "Analisa > Analisa Ranking": menampilkan peringkat nilai tertinggi hingga terendah beserta persentase kelulusan terhadap KKM.',
        'Menu "Analisa > Perbaikan Nilai": daftar siswa yang nilainya di bawah KKM dengan rekomendasi materi yang perlu diremedial.',
      ],
      actionLabel: 'Buka Analisa Per Soal',
      actionTab: 'guru_analisis',
      proTip:
        'Hasil analisa per butir soal sangat berguna untuk laporan penilaian kinerja guru (PKG) dan akreditasi sekolah.',
    },
  ];

  // ==============================================================
  // 3. DATA PANDUAN LENGKAP SISWA (CARA UJIAN DI PC & HP)
  // ==============================================================
  const studentSteps: StepItem[] = [
    {
      id: 'st_1',
      title: 'Langkah 1: Cara Masuk (Login) Menggunakan No. Peserta / QR Code',
      badge: 'Login Siswa',
      icon: Users,
      summary:
        'Siswa dapat login dengan cepat baik melalui Komputer Lab Sekolah maupun Smartphone pribadi.',
      details: [
        'Buka alamat aplikasi CBT yang diberikan proktor (misal: https://smart-cbt-pro.vercel.app/).',
        'Pilih tab "Login Siswa (CBT)".',
        'Metode 1 (Ketik): Masukkan Nomor Peserta (atau Username) dan Password yang tercantum pada Kartu Peserta Ujian Anda.',
        'Metode 2 (Scan QR): Arahkan kamera HP ke QR Code yang tercetak di kartu ujian untuk login otomatis dalam 1 detik tanpa mengetik.',
      ],
      actionLabel: 'Ke Halaman Ujian Siswa',
      actionTab: 'siswa_ujian',
      proTip:
        'Simpan baik-baik Kartu Peserta Ujian Anda. Jika lupa kata sandi, segera lapor ke proktor di meja pengawas untuk di-reset.',
    },
    {
      id: 'st_2',
      title: 'Langkah 2: Masukkan Token Pengawas & Cek Identitas Ujian',
      badge: 'Konfirmasi Tes',
      icon: Key,
      summary:
        'Memastikan data diri dan paket mata pelajaran sudah sesuai sebelum timer ujian dimulai.',
      details: [
        'Di halaman Dashboard Siswa, periksa kartu "Ujian Hari Ini". Pastikan nama mata pelajaran, durasi waktu, dan kelas sudah sesuai.',
        'Klik tombol "KERJAKAN UJIAN SEKARANG".',
        'Masukkan Token Ujian (6 karakter huruf/angka, contoh: 36S7KS) yang dirilis pengawas di papan tulis.',
        'Klik "Mulai Kerjakan". Timer waktu ujian akan mulai menghitung mundur.',
      ],
      actionLabel: 'Lihat Jadwal Ujian Siswa',
      actionTab: 'siswa_jadwal',
      proTip:
        'Token bersifat peka terhadap huruf besar/kecil. Pastikan menggunakan huruf kapital saat mengetik token pengawas.',
    },
    {
      id: 'st_3',
      title: 'Langkah 3: Mengerjakan Soal, Navigasi Nomor, & Tanda Ragu-Ragu',
      badge: 'Player Ujian',
      icon: Monitor,
      summary:
        'Cara memilih jawaban, menandai soal yang belum yakin, dan membaca rumus atau gambar.',
      details: [
        'Klik bulatan opsi (A, B, C, D) untuk memilih jawaban soal pilihan ganda biasa.',
        'Pada soal PGK Multi-Pilihan, Anda dapat mencentang lebih dari 1 kotak jawaban yang dianggap benar.',
        'Pada soal Menjodohkan, seret atau pilih pasangan pernyataan yang sesuai.',
        'Pada soal Esai, ketik penjelasan lengkap dengan bahasa Anda sendiri. Tidak perlu takut salah ketik sedikit, sistem AI dapat mentolerir typo wajar.',
        'Tombol "Ragu-Ragu": gunakan jika belum yakin agar nomor soal berwarna kuning di kisi-kisi navigasi.',
      ],
      actionLabel: 'Buka Dashboard Siswa',
      actionTab: 'siswa_ujian',
      proTip:
        'Gunakan daftar nomor soal di sebelah kanan untuk melompat cepat ke nomor yang belum terjawab (warna abu-abu).',
    },
    {
      id: 'st_4',
      title: 'Langkah 4: Aturan Anti-Curang & Toleransi Keluar Layar (Grace Period)',
      badge: 'Keamanan Ujian',
      icon: ShieldCheck,
      summary:
        'Pahami aturan ketat sistem agar ujian Anda tidak terkunci otomatis oleh proktor.',
      details: [
        'Layar Penuh Otomatis: Ujian berjalan dalam mode Fullscreen. Jangan menekan tombol Esc atau Home.',
        'DILARANG berganti tab browser, membuka tab baru, mencari contekan di Google, atau membuka aplikasi WhatsApp / Telegram.',
        'Sistem memiliki toleransi 4 detik (Grace Period). Jika Anda keluar dari layar lebih dari 4 detik, pelanggaran akan tercatat.',
        'Jika batas maksimal pelanggaran terlampaui (misal: 5 kali), ujian Anda akan TERKUNCI OTOMATIS dan Anda harus meminta maaf serta meminta proktor membuka kuncinya.',
      ],
      actionLabel: 'Lihat Nilai Siswa',
      actionTab: 'siswa_nilai',
      proTip:
        'Fokuslah pada layar ujian Anda sampai tombol "Selesai Ujian" ditekan untuk menghindari risiko terkunci oleh sistem proktor.',
    },
    {
      id: 'st_5',
      title: 'Langkah 5: Fitur Penyelamatan Jawaban Offline (Jika WiFi Putus / Mati Lampu)',
      badge: 'Anti-Panik',
      icon: Wifi,
      summary:
        'Teknologi Hybrid Autosave IndexedDB menjamin seluruh jawaban Anda tetap aman 100%.',
      details: [
        'Setiap kali Anda memilih opsi atau mengetik huruf di soal esai, jawaban langsung tersimpan di memori perangkat dalam waktu 1 milidetik.',
        'Jika sinyal WiFi putus atau paket internet habis di tengah ujian: JANGAN PANIK! Jangan tutup browser. Anda tetap bisa lanjut membaca soal dan menjawab.',
        'Begitu koneksi internet kembali menyala, seluruh jawaban otomatis disinkronkan ke server proktor.',
        'Jika laptop mati lampu mendadak, minta proktor melakukan "Reset Login". Saat Anda login kembali, seluruh jawaban lama akan kembali utuh seperti semula.',
      ],
      actionLabel: 'Buka Dashboard Siswa',
      actionTab: 'siswa_ujian',
      proTip:
        'Jangan pernah menekan tombol Refresh berulang-ulang saat internet lambat. Cukup tunggu beberapa detik hingga koneksi pulih.',
    },
  ];

  // ==============================================================
  // 4. DATA PANDUAN SUPER ADMIN (WHITE-LABELING & SISTEM)
  // ==============================================================
  const superAdminSteps: StepItem[] = [
    {
      id: 'sa_1',
      title: 'Arsitektur 4 Lapisan Warna (4-Layer Harmony Palette)',
      badge: 'White-Labeling',
      icon: Sparkles,
      summary:
        'Bukan hanya mengganti aksen warna kecil, sistem mengontrol 4 lapisan visual menyeluruh untuk mencerminkan identitas sekolah.',
      details: [
        'Lapisan 1 (Primary Color): Warna bar atas, tombol aksi utama, dan tab navigasi aktif.',
        'Lapisan 2 (Accent Color): Warna badge status, border sorotan, icon bintang, dan peringatan.',
        'Lapisan 3 (Canvas Color): Warna latar belakang layar utama (misal: Deep Forest, Navy, Onyx, atau Putih).',
        'Lapisan 4 (Surface Color): Warna kontainer kartu, sidebar navigasi, dan kotak tabel data.',
        'Tersedia 8 Preset Harmonis 1-Klik: Kemdikbud Royal Blue, Kemenag Madrasah Emerald, High-Tech Indigo, Crimson Bold, Light Mode Siang, Luxury Onyx, Ocean Teal, dan Classic Espresso.',
      ],
      actionLabel: 'Buka Pengaturan Branding',
      actionTab: 'superadmin_branding',
      proTip:
        'Gunakan preset "Clean Modern Light" jika sekolah menyelenggarakan ujian di ruang kelas terbuka di siang hari agar layar tidak memantul.',
    },
    {
      id: 'sa_2',
      title: 'Kustomisasi Gambar Visual Multi-Portal (Hero, Logo, & Wallpaper)',
      badge: 'Visual Identity',
      icon: Eye,
      summary:
        'Mengatur aset visual login untuk siswa, guru, dan operator secara terpisah sesuai jenjang sekolah.',
      details: [
        'Logo / Maskot Siswa: Mendukung maskot ramah anak untuk SD/MI atau logo resmi institusi untuk SMP dan SMA.',
        'Banner Hero 3D Guru & Operator: Pilihan visual ilustrasi komputer 3D, foto lab komputer, atau gedung kampus sekolah.',
        'Wallpaper Latar Belakang: Unggah gambar wallpaper kustom untuk mempercantik halaman login sekolah.',
        'Seluruh gambar otomatis dioptimasi dan disimpan di database cloud sehingga tersinkronisasi ke semua komputer lab.',
      ],
      actionLabel: 'Atur Logo & Banner',
      actionTab: 'superadmin_branding',
      proTip:
        'Format gambar terbaik adalah PNG transparan dengan resolusi 512x512 piksel untuk logo sekolah.',
    },
    {
      id: 'sa_3',
      title: 'Aktivasi Mode Ujian Resmi Sekolah (Sembunyikan Pintasan Demo)',
      badge: 'Mode Resmi',
      icon: ShieldCheck,
      summary:
        'Mempersiapkan sistem untuk pelaksanaan ujian sungguhan dengan mematikan tombol uji coba.',
      details: [
        'Pada masa uji coba / demo, tombol pintasan seperti "🐻 Demo: ARJUN", "👑 Super Admin", dan "👨‍💼 Operator" aktif untuk memudahkan pengujian.',
        'Saat sekolah menyelenggarakan Ujian Semester Resmi (PAS/PAT/ANBK): Buka menu Super Admin > hilangkan centang "Mode Demo Terbuka".',
        'Seluruh tombol pintasan 1-klik akan langsung lenyap dari halaman login, sehingga siswa wajib mengetik No. Peserta dan Password resmi.',
      ],
      actionLabel: 'Buka Pengaturan Branding',
      actionTab: 'superadmin_branding',
      proTip:
        'Pastikan mencentang kembali opsi ini sebelum hari-H ujian dimulai untuk menjamin kerahasiaan dan integritas ujian resmi sekolah.',
    },
  ];

  // ==============================================================
  // 5. DATA PUSAT SOLUSI KENDALA CEPAT (FAQ & TROUBLESHOOTING)
  // ==============================================================
  const troubleshootFaqs: FaqItem[] = [
    {
      q: 'Bagaimana jika laptop siswa mati lampu atau browser tertutup mendadak di tengah ujian?',
      category: 'UBK_LAB',
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      a: 'Jangan panik! Seluruh jawaban siswa telah tersimpan otomatis di database IndexedDB browser lokal setiap milidetik.',
      solutionSteps: [
        'Nyalakan kembali laptop siswa atau pindahkan siswa ke PC cadangan.',
        'Operator/Proktor membuka menu "UBK > Reset Login".',
        'Cari nama atau nomor peserta siswa tersebut pada tabel.',
        'Klik tombol "Reset / Buka Kunci". Status sesi siswa akan berubah menjadi terbuka kembali.',
        'Minta siswa login kembali dengan nomor peserta dan password yang sama.',
        'Seluruh sisa waktu dan jawaban yang telah dikerjakan sebelumnya akan utuh terisi kembali!',
      ],
    },
    {
      q: 'Siswa terkunci otomatis karena berganti tab atau membuka aplikasi lain. Cara membukanya bagaimana?',
      category: 'PELANGGARAN',
      badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
      a: 'Ini adalah fitur keamanan Anti-Cheat. Jika siswa keluar dari layar melebihi batas toleransi pelanggaran, sistem otomatis mengunci lembar ujian.',
      solutionSteps: [
        'Beri teguran lisan kepada siswa yang bersangkutan agar tidak mengulangi tindakan curang.',
        'Proktor membuka menu "UBK > Laporan Pelanggaran" atau "UBK > Atur Block Peserta".',
        'Periksa riwayat pelanggaran siswa (waktu kejadian dan berapa kali keluar layar).',
        'Klik tombol "Buka Kunci / Unblock".',
        'Siswa dapat melanjutkan ujian kembali.',
      ],
    },
    {
      q: 'Token ujian muncul keterangan "Token Tidak Valid" saat dimasukkan siswa.',
      category: 'TOKEN',
      badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
      a: 'Masalah ini umumnya disebabkan oleh kesalahan pengetikan huruf kapital atau jadwal ujian belum berstatus aktif.',
      solutionSteps: [
        'Pastikan siswa mengetik huruf besar (KAPITAL), karena token peka terhadap case (contoh: "36S7KS", bukan "36s7ks").',
        'Buka menu "UBK > Rilis Token", pastikan tombol "Status Token" dalam posisi AKTIF (hijau).',
        'Periksa menu "Jadwal Ujian", pastikan jam ujian saat ini berada dalam rentang jadwal yang dibuat.',
        'Jika token dinamis aktif dan sudah melewati batas 15 menit, klik tombol "Generate Token Baru" dan umumkan token terbaru.',
      ],
    },
    {
      q: 'Jaringan WiFi lab sekolah terputus total saat 40 siswa sedang ujian bersamaan.',
      category: 'JARINGAN_WIFI',
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      a: 'SmartCBT Pro dilengkapi teknologi Progressive Web App (PWA) Offline-First sehingga ujian tidak akan macet.',
      solutionSteps: [
        'Instruksikan siswa untuk TETAP TENANG dan JANGAN menekan tombol Refresh / F5 di browser.',
        'Siswa tetap dapat membaca soal, mengganti jawaban, dan mengetik esai secara normal tanpa koneksi internet.',
        'Proktor memeriksa kabel LAN atau me-restart router WiFi lab sekolah.',
        'Begitu koneksi internet tersambung kembali, sistem secara otomatis mensinkronkan seluruh jawaban yang tertampung di IndexedDB ke database server.',
        'Setelah indikator koneksi kembali hijau, siswa dapat menekan tombol "Selesai Ujian".',
      ],
    },
    {
      q: 'Guru ingin mengubah atau mengoreksi nilai esai hasil penilaian otomatis AI.',
      category: 'GURU_ESAI',
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      a: 'Guru memegang hak veto tertinggi atas seluruh penilaian akademik.',
      solutionSteps: [
        'Buka menu "Nilai > Hasil Nilai" di Portal Guru atau Operator.',
        'Pilih nama siswa yang ingin ditinjau jawaban esainya.',
        'Klik tombol "Periksa Koreksi Esai". Anda akan melihat argumen siswa beserta rincian poin per konsep yang diberikan AI.',
        'Ubah angka skor pada kolom yang tersedia (misal: dari 15 menjadi 20).',
        'Klik tombol "Simpan Perubahan Skor". Nilai akhir dan rekap e-Rapor otomatis terbarui seketika.',
      ],
    },
    {
      q: 'Bagaimana cara menambahkan pasfoto siswa pada Kartu Peserta Ujian?',
      category: 'KARTU_FOTO',
      badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-950/40',
      a: 'Sistem mendukung pasfoto siswa individual maupun foto massal via nama file NISN.',
      solutionSteps: [
        'Buka menu "Peserta Ujian". Klik icon kamera / edit pada baris siswa yang bersangkutan untuk mengunggah foto 2x3 atau 3x4.',
        'Atau unggah foto dengan format nama file sesuai NISN siswa (misal: 0081234567.jpg).',
        'Buka menu "Cetak > Cetak Kartu", pasfoto siswa akan otomatis tercetak di sebelah kiri identitas dan QR Code.',
      ],
    },
  ];

  // ==============================================================
  // SEARCH & FILTER LOGIC
  // ==============================================================
  const allStepsCombined = useMemo(() => {
    return [
      ...operatorSteps.map((s) => ({ ...s, roleName: 'Operator' })),
      ...teacherSteps.map((s) => ({ ...s, roleName: 'Guru' })),
      ...studentSteps.map((s) => ({ ...s, roleName: 'Siswa' })),
      ...superAdminSteps.map((s) => ({ ...s, roleName: 'Super Admin' })),
    ];
  }, []);

  const filteredSteps = useMemo(() => {
    if (!searchQuery.trim()) {
      if (activeTab === 'OPERATOR') return operatorSteps;
      if (activeTab === 'TEACHER') return teacherSteps;
      if (activeTab === 'STUDENT') return studentSteps;
      if (activeTab === 'SUPER_ADMIN') return superAdminSteps;
      return [];
    }

    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);
    return allStepsCombined.filter((s) => {
      const fullText = [
        s.title,
        s.summary,
        s.badge,
        s.roleName,
        s.actionLabel || '',
        ...s.details,
      ].join(' ').toLowerCase();
      return fullText.includes(q) || words.every((w) => fullText.includes(w));
    });
  }, [searchQuery, activeTab, allStepsCombined]);

  const filteredFaqs = useMemo(() => {
    return troubleshootFaqs.filter((f) => {
      const matchCat = selectedFaqCategory === 'ALL' || f.category === selectedFaqCategory;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const words = q.split(/\s+/).filter(Boolean);
      const fullText = [
        f.q,
        f.a,
        ...(f.solutionSteps || []),
      ].join(' ').toLowerCase();
      return fullText.includes(q) || words.every((w) => fullText.includes(w));
    });
  }, [searchQuery, selectedFaqCategory]);

  const currentStep = filteredSteps[Math.min(currentStepIdx, filteredSteps.length - 1)];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-[#10141f] border border-slate-700/80 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-200">
        {/* ============================================================== */}
        {/* TOPBAR HEADER MODAL                                            */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-5 md:px-7 py-4 flex items-center justify-between text-white border-b border-blue-500/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-wide">
                  Pusat Panduan & Tutorial Resmi SmartCBT Pro
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-extrabold uppercase">
                  SOP Standar 2026
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Buku panduan digital lengkap untuk Operator, Dewan Guru, Pengawas UBK, dan Siswa sekolah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-all cursor-pointer border border-white/15"
            title="Tutup Panduan (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* SEARCH BAR & PERAN TABS BAR                                    */}
        {/* ============================================================== */}
        <div className="bg-[#0b0e17] border-b border-slate-800 px-4 md:px-7 py-3 space-y-3">
          {/* Kotak Pencarian Instan */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci pencarian, misal: 'reset login', 'koreksi esai', 'wifi mati', 'rumus matematika', 'token', 'cetak kartu'..."
              className="w-full bg-[#161b26] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 5 Tab Navigasi Peran Utama */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sidebar-scrollbar">
            <button
              onClick={() => handleTabChange('OPERATOR')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'OPERATOR' && !searchQuery
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/50'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>1. Operator & Proktor ({operatorSteps.length} Tahap)</span>
            </button>

            <button
              onClick={() => handleTabChange('TEACHER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'TEACHER' && !searchQuery
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 border border-indigo-400/50'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>2. Dewan Guru (Bank Soal & Esai AI)</span>
            </button>

            <button
              onClick={() => handleTabChange('STUDENT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'STUDENT' && !searchQuery
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/50'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>3. Siswa (Panduan Ujian PC/HP)</span>
            </button>

            <button
              onClick={() => handleTabChange('SUPER_ADMIN')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'SUPER_ADMIN' && !searchQuery
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 border border-purple-400/50'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>4. Super Admin (White-Labeling)</span>
            </button>

            <button
              onClick={() => handleTabChange('TROUBLESHOOT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'TROUBLESHOOT' && !searchQuery
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 border border-amber-400/50'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>5. Solusi Kendala Cepat (FAQ Lab)</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BODY CONTENT AREA                                             */}
        {/* ============================================================== */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1 text-slate-300 text-xs leading-relaxed sidebar-scrollbar">
          {/* JIKA USER MENGGUNAKAN FITUR PENCARIAN */}
          {searchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white text-sm">
                  Hasil Pencarian untuk: <span className="text-amber-300">"{searchQuery}"</span>
                </span>
                <span className="text-slate-400 text-xs">
                  Ditemukan: {filteredSteps.length} Panduan Langkah & {filteredFaqs.length} Solusi Kendala
                </span>
              </div>

              {/* Hasil Langkah */}
              {filteredSteps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-blue-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Langkah Panduan yang Cocok:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredSteps.map((st, i) => (
                      <div
                        key={st.id || i}
                        className="p-4 bg-[#151a26] border border-slate-700/80 rounded-2xl space-y-2 hover:border-blue-500/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                            {st.badge}
                          </span>
                          {st.actionTab && onNavigateTab && (
                            <button
                              onClick={() => {
                                onNavigateTab(st.actionTab!);
                                onClose();
                              }}
                              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                            >
                              <span>Buka Menu</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <h5 className="font-bold text-white text-xs">{st.title}</h5>
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                          {st.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hasil Solusi FAQ */}
              {filteredFaqs.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Solusi Kendala & Troubleshooting:</span>
                  </h4>
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#161a24] border border-amber-500/30 rounded-2xl space-y-2"
                      >
                        <strong className="text-white text-xs block">{faq.q}</strong>
                        <p className="text-slate-300 text-xs">{faq.a}</p>
                        {faq.solutionSteps && (
                          <div className="pt-2 border-t border-slate-800 space-y-1">
                            <span className="font-bold text-amber-300 text-[11px] block">
                              Langkah Solusi Praktis:
                            </span>
                            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300">
                              {faq.solutionSteps.map((stepTxt, idx) => (
                                <li key={idx}>{stepTxt}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredSteps.length === 0 && filteredFaqs.length === 0 && (
                <div className="p-8 text-center bg-[#151a26] border border-slate-800 rounded-2xl space-y-2">
                  <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-white font-bold text-sm">Tidak ditemukan kata kunci yang cocok</p>
                  <p className="text-slate-400 text-xs">
                    Coba gunakan istilah lain seperti "token", "esai", "reset", "wifi", atau pilih tab peran di atas.
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'TROUBLESHOOT' ? (
            /* ============================================================== */
            /* TAB 5: PUSAT SOLUSI KENDALA CEPAT (FAQ & RESILIENSI LAB)      */
            /* ============================================================== */
            <div className="space-y-5">
              {/* Banner Penjelasan Resiliensi Lab */}
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-5 md:p-6 space-y-3 shadow-xl">
                <div className="flex items-center gap-2.5 text-amber-300 font-extrabold text-sm">
                  <Wifi className="w-5 h-5 text-amber-400" />
                  <span>Resiliensi Gangguan Jaringan Sekolah & Mode Hemat Kuota</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Di banyak sekolah Indonesia, kendala paling umum saat ujian CBT adalah router WiFi lab yang drop atau listrik padam mendadak saat 40–100 siswa mengakses bersamaan. SmartCBT Pro dilengkapi <strong>2 Lapisan Perlindungan Mandiri</strong>:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 bg-[#141924] border border-blue-500/30 rounded-2xl space-y-1.5 shadow-md">
                    <span className="font-extrabold text-white text-xs flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" /> 1. Hybrid Autosave IndexedDB
                    </span>
                    <span className="text-slate-400 text-[11px] block leading-relaxed">
                      Setiap kali siswa memilih opsi jawaban atau mengetik satu huruf di soal esai, jawaban langsung tersimpan dalam hitungan milidetik ke database IndexedDB lokal di browser perangkat siswa. Tahan tombol F5, mati lampu, atau browser tertutup mendadak.
                    </span>
                  </div>

                  <div className="p-4 bg-[#141924] border border-emerald-500/30 rounded-2xl space-y-1.5 shadow-md">
                    <span className="font-extrabold text-white text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Progressive Web App (PWA) Offline-First
                    </span>
                    <span className="text-slate-400 text-[11px] block leading-relaxed">
                      Aplikasi meng-cache file asset tampilan menggunakan Service Worker. Jika kabel LAN atau sinyal WiFi putus di tengah ujian, siswa tetap dapat membaca soal dan menjawab tanpa ada layar error atau reload putih.
                    </span>
                  </div>
                </div>
              </div>

              {/* Daftar Tanya Jawab (FAQ) Proktor & Pengawas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Daftar 6 Skenario Kendala Nyata & Solusi Cepat:</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Klik langkah untuk membaca solusi</span>
                </div>

                <div className="space-y-3">
                  {troubleshootFaqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 md:p-5 bg-[#141824] border border-slate-700/70 hover:border-slate-600 rounded-2xl space-y-3 transition-all shadow-md"
                    >
                      <div className="flex items-start gap-3 justify-between">
                        <strong className="text-white text-xs font-bold leading-snug">
                          {idx + 1}. {faq.q}
                        </strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 border ${faq.badgeColor}`}>
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed bg-[#0e121a] p-3 rounded-xl border border-slate-800">
                        💡 {faq.a}
                      </p>
                      {faq.solutionSteps && (
                        <div className="space-y-1.5 pt-1 pl-1">
                          <span className="font-extrabold text-amber-300 text-[11px] uppercase tracking-wide">
                            Langkah Tindakan Proktor di Tempat:
                          </span>
                          <div className="space-y-1">
                            {faq.solutionSteps.map((stepTxt, stepIdx) => (
                              <div
                                key={stepIdx}
                                className="flex items-start gap-2 text-[11px] text-slate-300"
                              >
                                <span className="w-4 h-4 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                  {stepIdx + 1}
                                </span>
                                <span>{stepTxt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* TAB 1 - 4: LANGKAH STEP-BY-STEP INTERAKTIF (PER PERAN)         */
            /* ============================================================== */
            <div className="space-y-5">
              {/* Stepper Dots & Badge Nav */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sidebar-scrollbar">
                {filteredSteps.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      currentStepIdx === idx
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 scale-102'
                        : currentStepIdx > idx
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#141924] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold">{s.badge}</span>
                  </button>
                ))}
              </div>

              {/* Step Card View Terperinci */}
              {currentStep && (
                <div className="bg-[#141824] border border-slate-700/80 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
                  {/* Header Langkah + Tombol Aksi Langsung */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                        <currentStep.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 text-[10px] font-extrabold uppercase tracking-wide">
                            Langkah {currentStepIdx + 1} dari {filteredSteps.length}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Modul: {currentStep.badge}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-extrabold text-white mt-0.5 leading-snug">
                          {currentStep.title}
                        </h3>
                      </div>
                    </div>

                    {/* Tombol Pintasan Aksi Langsung (Working Shortcut) */}
                    {currentStep.actionTab && onNavigateTab && (
                      <button
                        onClick={() => {
                          onNavigateTab(currentStep.actionTab!);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-900/30 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 border border-blue-400/40 hover:scale-102"
                      >
                        <span>{currentStep.actionLabel || 'Buka Halaman Ini'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Ringkasan & Instruksi Poin-Poin */}
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed bg-[#0d111a] p-3.5 rounded-2xl border border-slate-800">
                    {currentStep.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="font-extrabold text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Instruksi Langkah Demi Langkah:</span>
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentStep.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-2.5 p-2.5 bg-[#0e121a] rounded-xl border border-slate-800/80 text-xs text-slate-300"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                            {dIdx + 1}
                          </span>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex items-start gap-3 text-blue-200">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5 text-xs font-bold">
                        Tips Kunci Sukses:
                      </strong>
                      <span className="text-[11px] leading-relaxed">{currentStep.proTip}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigasi Panah Langkah (Sebelumnya / Selanjutnya) */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                  disabled={currentStepIdx === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Langkah Sebelumnya</span>
                </button>

                <div className="text-xs text-slate-400 font-mono font-bold">
                  {currentStepIdx + 1} / {filteredSteps.length}
                </div>

                <button
                  onClick={() =>
                    setCurrentStepIdx((p) => Math.min(filteredSteps.length - 1, p + 1))
                  }
                  disabled={currentStepIdx === filteredSteps.length - 1}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>Langkah Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Checklist Kesiapan Ujian Interaktif */}
              <div className="bg-[#141824] border border-slate-800 rounded-3xl p-5 md:p-6 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Checklist Mandiri Kesiapan Ujian Sekolah (Tersimpan Otomatis):</span>
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    {Object.values(checklist).filter(Boolean).length} / 6 Selesai
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    { id: 'chk_logo', label: '1. Identitas, NPSN & Logo Terpasang' },
                    { id: 'chk_siswa', label: '2. Data Peserta Lengkap per Rombel' },
                    { id: 'chk_kartu', label: '3. Kartu Peserta A4 Berisi QR Code Dicetak' },
                    { id: 'chk_jadwal', label: '4. Jadwal Ujian Multi-Kelas Aktif' },
                    { id: 'chk_token', label: '5. Token Pengawas Siap Dirilis' },
                    { id: 'chk_pwa', label: '6. Aplikasi Telah Diuji di Lab Komputer' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer select-none transition-all ${
                        checklist[item.id]
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 line-through'
                          : 'bg-[#0f121a] border-slate-800/90 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checklist[item.id]}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 pointer-events-none shrink-0"
                      />
                      <span className="font-medium text-[11px] leading-tight">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* FOOTER MODAL                                                   */}
        {/* ============================================================== */}
        <div className="px-5 md:px-7 py-3.5 bg-[#0b0e17] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-400">
              SmartCBT Pro Enterprise • Panduan Terpadu SD, SMP, SMA/SMK
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold cursor-pointer transition-all shadow-md text-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
