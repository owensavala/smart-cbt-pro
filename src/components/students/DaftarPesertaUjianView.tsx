'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Plus,
  Upload,
  Download,
  Camera,
  RotateCcw,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  AlertCircle,
  Info,
  Archive,
  ArrowLeft,
  Check,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {
  Student,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
  LevelMaster,
  MajorMaster,
  ServerMaster,
} from '@/lib/types';

interface DaftarPesertaUjianViewProps {
  students: Student[];
  classes: SchoolClass[];
  rooms: ExamRoom[];
  sessions: ExamSessionInfo[];
  levels?: LevelMaster[];
  majors?: MajorMaster[];
  servers?: ServerMaster[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkUpdatePhotos?: (photosMap: Record<string, string>) => void;
  onClearAllPhotos?: () => void;
  onOpenImportMaster: () => void;
  onNavigateToCetakKartu?: () => void;
  onRefresh: () => void;
}

// Generate default formal Indonesian school pass photo (Red background)
export function generateDefaultPhoto(name: string, gender: 'L' | 'P' = 'L'): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="120" height="150">
    <rect width="120" height="150" fill="#c02626"/>
    <!-- Head silhouette -->
    <circle cx="60" cy="52" r="26" fill="#fcd34d"/>
    <!-- Hair / Peci / Jilbab -->
    ${
      gender === 'P'
        ? '<path d="M34,55 C34,25 86,25 86,55 C86,70 78,85 60,85 C42,85 34,70 34,55 Z" fill="#ffffff" opacity="0.9"/>'
        : '<rect x="36" y="22" width="48" height="18" rx="3" fill="#18181b"/>'
    }
    <!-- Face details -->
    <circle cx="51" cy="52" r="3" fill="#1e293b"/>
    <circle cx="69" cy="52" r="3" fill="#1e293b"/>
    <path d="M54,63 Q60,67 66,63" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Uniform Collar (White & Vest) -->
    <path d="M20,150 L20,110 C20,95 40,88 60,88 C80,88 100,95 100,110 L100,150 Z" fill="#ffffff"/>
    <path d="M30,150 L30,115 C30,102 42,96 60,96 C78,96 90,102 90,115 L90,150 Z" fill="#7f1d1d"/>
    <!-- Tie / Badge -->
    <path d="M57,96 L63,96 L65,125 L60,132 L55,125 Z" fill="#1e3a8a"/>
    <text x="60" y="145" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="8" font-weight="bold">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function DaftarPesertaUjianView({
  students,
  classes,
  rooms,
  sessions,
  levels = [],
  majors = [],
  servers = [],
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkUpdatePhotos,
  onClearAllPhotos,
  onOpenImportMaster,
  onNavigateToCetakKartu,
  onRefresh,
}: DaftarPesertaUjianViewProps) {
  // Mode View: 'LIST' | 'FOTO_MASSAL'
  const [currentSubView, setCurrentSubView] = useState<'LIST' | 'FOTO_MASSAL'>('LIST');

  // Table pagination & search
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Modal Tambah / Edit Siswa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form Fields
  const [nis, setNis] = useState('');
  const [noPeserta, setNoPeserta] = useState('');
  const [nama, setNama] = useState('');
  const [jurusan, setJurusan] = useState('Semua');
  const [level, setLevel] = useState('VI');
  const [selectedClass, setSelectedClass] = useState('');
  const [sesi, setSesi] = useState('1');
  const [ruang, setRuang] = useState('LAB-01');
  const [server, setServer] = useState('MH');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusAktif, setStatusAktif] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showConfirmPasswordInput, setShowConfirmPasswordInput] = useState(false);

  // Foto Massal State
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [matchIdentityBy, setMatchIdentityBy] = useState<'username' | 'noPeserta' | 'nisn'>('username');
  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null);
  const [extractErrorMsg, setExtractErrorMsg] = useState<string | null>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const singlePhotoInputRef = useRef<HTMLInputElement>(null);
  const [selectedStudentForSinglePhoto, setSelectedStudentForSinglePhoto] = useState<string | null>(null);

  // Filtered students for table
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.noPeserta.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        (s.room && s.room.toLowerCase().includes(q))
      );
    });
  }, [students, searchTerm]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / (entriesPerPage || 1)) || 1;
  const paginatedStudents = useMemo(() => {
    if (entriesPerPage === 0) return filteredStudents; // 0 = Semua
    const start = (currentPage - 1) * entriesPerPage;
    return filteredStudents.slice(start, start + entriesPerPage);
  }, [filteredStudents, currentPage, entriesPerPage]);

  // Photo statistics
  const studentsWithPhotoCount = useMemo(() => {
    return students.filter((s) => s.photoUrl && s.photoUrl.trim() !== '').length;
  }, [students]);

  const photoPercentage = students.length > 0
    ? Math.round((studentsWithPhotoCount / students.length) * 100)
    : 0;

  // Toggle single password visibility
  const toggleShowPassword = (id: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setNis('');
    const nextSeq = String(students.length + 1).padStart(4, '0');
    setNoPeserta(`26-27-01-1-0508-${nextSeq}`);
    setNama('');
    setJurusan(majors[0]?.code || 'MI');
    setLevel(levels[0]?.code || 'VI');
    setSelectedClass(classes[0]?.name || 'VI');
    setSesi('1');
    setRuang(rooms[0]?.code || 'LAB-01');
    setServer(servers[0]?.code || 'MH');
    setUsername('');
    setPassword('siswa123');
    setConfirmPassword('siswa123');
    setStatusAktif(true);
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (st: Student) => {
    setEditingStudentId(st.id);
    setNis(st.nis || '');
    setNoPeserta(st.noPeserta);
    setNama(st.name);
    setJurusan(st.jurusan || 'MI');
    setLevel(st.level || 'VI');
    setSelectedClass(st.className);
    setSesi(st.session?.replace(/\D/g, '') || '1');
    setRuang(st.room);
    setServer(st.server || 'MH');
    setUsername(st.username);
    setPassword(st.passwordText || '123456');
    setConfirmPassword(st.passwordText || '123456');
    setStatusAktif(st.isActive ?? true);
    setPhotoUrl(st.photoUrl || '');
    setIsModalOpen(true);
  };

  // Save Student (Create or Update)
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim()) return;
    if (password !== confirmPassword) {
      alert('Password dan Ulang Password tidak cocok!');
      return;
    }

    const assignedPhoto = photoUrl || generateDefaultPhoto(nama);

    if (editingStudentId) {
      const existing = students.find((s) => s.id === editingStudentId);
      if (existing) {
        onUpdateStudent({
          ...existing,
          nis: nis.trim(),
          noPeserta: noPeserta.trim(),
          name: nama.trim(),
          jurusan,
          level,
          className: selectedClass,
          session: `Sesi ${sesi}`,
          room: ruang,
          server,
          username: username.trim(),
          passwordText: password,
          photoUrl: assignedPhoto,
          isActive: statusAktif,
        });
      }
    } else {
      const newStudent: Student = {
        id: `std_${Date.now()}`,
        nisn: `00${nis || '1010'}${Date.now().toString().slice(-4)}`,
        nis: nis.trim(),
        noPeserta: noPeserta.trim(),
        name: nama.trim(),
        jurusan,
        level,
        className: selectedClass,
        session: `Sesi ${sesi}`,
        room: ruang,
        server,
        username: username.trim(),
        passwordText: password,
        photoUrl: assignedPhoto,
        isActive: statusAktif,
      };
      onAddStudent(newStudent);
    }

    setIsModalOpen(false);
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const headers = [
      '#',
      'NO_PESERTA',
      'NIS',
      'NISN',
      'NAMA',
      'LEVEL',
      'KELAS',
      'JURUSAN',
      'SESI',
      'RUANG',
      'USERNAME',
      'PASSWORD',
      'SERVER',
    ];

    const dataRows = students.map((s, idx) => [
      idx + 1,
      s.noPeserta,
      s.nis || '-',
      s.nisn,
      s.name,
      s.level,
      s.className,
      s.jurusan || '-',
      s.session || '-',
      s.room || '-',
      s.username,
      s.passwordText,
      s.server || 'MH',
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Peserta_Ujian');
    XLSX.writeFile(wb, `Daftar_Peserta_Ujian_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Process ZIP Photo Extraction
  const handleProcessZipPhotos = async () => {
    if (!zipFile) {
      setExtractErrorMsg('Silakan pilih berkas .ZIP foto terlebih dahulu.');
      return;
    }

    setIsExtractingZip(true);
    setExtractSuccessMsg(null);
    setExtractErrorMsg(null);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(zipFile);
      const photoMap: Record<string, string> = {};
      let matchedCount = 0;

      const fileEntries: { name: string; file: JSZip.JSZipObject }[] = [];
      loadedZip.forEach((relativePath, file) => {
        if (!file.dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(relativePath)) {
          fileEntries.push({ name: relativePath, file });
        }
      });

      if (fileEntries.length === 0) {
        throw new Error('Tidak ditemukan file foto (.jpg, .png, .webp) di dalam berkas ZIP.');
      }

      for (const entry of fileEntries) {
        // Strip path and extension: e.g. "photos/abduladzim.jpg" -> "abduladzim"
        const baseName = entry.name.split('/').pop()?.replace(/\.[^/.]+$/, '').trim().toLowerCase();
        if (!baseName) continue;

        // Find matching student
        const targetStudent = students.find((s) => {
          if (matchIdentityBy === 'username') {
            return s.username.toLowerCase() === baseName;
          } else if (matchIdentityBy === 'noPeserta') {
            return s.noPeserta.toLowerCase().replace(/\s+/g, '') === baseName.replace(/\s+/g, '');
          } else {
            return s.nisn.toLowerCase() === baseName || (s.nis && s.nis.toLowerCase() === baseName);
          }
        });

        if (targetStudent) {
          const blob = await entry.file.async('blob');
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          photoMap[targetStudent.id] = dataUrl;
          matchedCount++;
        }
      }

      if (matchedCount === 0) {
        throw new Error(
          `Ekstraksi berhasil menemukan ${fileEntries.length} foto, namun tidak ada nama file yang cocok dengan ${matchIdentityBy} siswa.`
        );
      }

      // Update in state
      if (onBulkUpdatePhotos) {
        onBulkUpdatePhotos(photoMap);
      } else {
        // Fallback update
        students.forEach((s) => {
          if (photoMap[s.id]) {
            onUpdateStudent({ ...s, photoUrl: photoMap[s.id] });
          }
        });
      }

      setExtractSuccessMsg(`Berhasil mengekstrak & menetapkan ${matchedCount} foto siswa!`);
      setZipFile(null);
    } catch (err: any) {
      console.error('ZIP extraction error:', err);
      setExtractErrorMsg(err.message || 'Gagal mengekstrak berkas ZIP.');
    } finally {
      setIsExtractingZip(false);
    }
  };

  // Auto populate sample red-background photos for all students without photos
  const handleAutoPopulateSamplePhotos = () => {
    const photoMap: Record<string, string> = {};
    let count = 0;
    students.forEach((s) => {
      if (!s.photoUrl || s.photoUrl.trim() === '') {
        const photo = generateDefaultPhoto(s.name);
        photoMap[s.id] = photo;
        onUpdateStudent({ ...s, photoUrl: photo });
        count++;
      }
    });
    if (onBulkUpdatePhotos) onBulkUpdatePhotos(photoMap);
    setExtractSuccessMsg(`Berhasil menghasilkan ${count} pas foto formal (Background Merah) secara otomatis.`);
  };

  // Clear all photos
  const handleClearAllPhotos = () => {
    if (confirm('Yakin ingin mengosongkan seluruh foto peserta ujian?')) {
      if (onClearAllPhotos) {
        onClearAllPhotos();
      } else {
        students.forEach((s) => {
          onUpdateStudent({ ...s, photoUrl: undefined });
        });
      }
      setExtractSuccessMsg('Seluruh foto peserta telah dikosongkan.');
    }
  };

  // Upload single photo for a student
  const handleSinglePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedStudentForSinglePhoto) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const target = students.find((s) => s.id === selectedStudentForSinglePhoto);
      if (target) {
        onUpdateStudent({ ...target, photoUrl: dataUrl });
      }
      setSelectedStudentForSinglePhoto(null);
    };
    reader.readAsDataURL(file);
  };

  // ==============================================================
  // SUB-VIEW 2: MANAJEMEN UNGGAH FOTO PESERTA MASSAL (IMAGE 4)
  // ==============================================================
  if (currentSubView === 'FOTO_MASSAL') {
    return (
      <div className="w-full space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Manajemen Unggah Foto Peserta Massal
          </h2>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            Format ZIP • Auto Mapping Identitas
          </span>
        </div>

        {/* Hidden single photo input */}
        <input
          ref={singlePhotoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSinglePhotoSelected}
        />

        {/* Top 2 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Card: Upload ZIP */}
          <div className="lg:col-span-2 bg-[#1c2230] border border-slate-700/70 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Manajemen Unggah Foto Peserta Massal
              </h3>
              <button
                onClick={() => setCurrentSubView('LIST')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
            </div>

            {/* Info Notice */}
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Pastikan file foto dikompresi dalam format <strong>.ZIP</strong> dan nama file sesuai dengan <strong>Username Siswa</strong> atau <strong>No Peserta</strong>.
              </span>
            </div>

            {/* Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Pilih File ZIP Foto
                </label>
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setZipFile(e.target.files[0]);
                      setExtractSuccessMsg(null);
                      setExtractErrorMsg(null);
                    }
                  }}
                  className="hidden"
                />
                <div
                  onClick={() => zipInputRef.current?.click()}
                  className="bg-[#131722] border border-slate-700 hover:border-blue-500/70 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="text-slate-400 truncate mr-2">
                    {zipFile ? zipFile.name : 'Pilih file...'}
                  </span>
                  <button
                    type="button"
                    className="bg-[#2a3449] hover:bg-[#34415c] text-slate-200 text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-600 shrink-0 cursor-pointer"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Identitas File
                </label>
                <select
                  value={matchIdentityBy}
                  onChange={(e: any) => setMatchIdentityBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#131722] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="username">Berdasarkan Username</option>
                  <option value="noPeserta">Berdasarkan No Peserta</option>
                  <option value="nisn">Berdasarkan NISN / NIS</option>
                </select>
              </div>

              {extractSuccessMsg && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{extractSuccessMsg}</span>
                </div>
              )}

              {extractErrorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{extractErrorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleProcessZipPhotos}
                  disabled={isExtractingZip}
                  className={`flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isExtractingZip ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {isExtractingZip ? 'Mengekstrak Foto...' : 'Mulai Unggah & Ekstrak'}
                </button>

                <button
                  type="button"
                  onClick={handleAutoPopulateSamplePhotos}
                  className="py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Generate otomatis pas foto formal latar merah bagi siswa yang belum punya foto"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Pasang Foto Formal Otomatis
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Statistik Foto */}
          <div className="bg-[#1c2230] border border-slate-700/70 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-center">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white text-left pb-3 border-b border-slate-700">
                Statistik Foto
              </h3>

              <div className="py-2">
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Siswa Dengan Foto
                </span>
                <span className="text-4xl font-black text-white font-mono tracking-tight">
                  {photoPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700 p-0.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${photoPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-400">
                Sebanyak <strong className="text-white font-bold">{studentsWithPhotoCount}</strong> dari {students.length} siswa saat ini memiliki foto.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={handleClearAllPhotos}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan Semua Foto
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Card: Daftar Foto Siswa (Terakhir diupload) matching Image 4 */}
        <div className="bg-[#1c2230] border border-slate-700/70 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Daftar Foto Siswa (Terakhir diupload)
            </h3>
            <span className="text-xs text-slate-400">
              Tampil pada Kartu Peserta Ujian
            </span>
          </div>

          {/* Grid of Student Photos with red background */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {students.slice(0, 18).map((st) => {
              const displayPhoto = st.photoUrl || generateDefaultPhoto(st.name);
              return (
                <div
                  key={st.id}
                  className="bg-[#141822] border border-slate-700/80 hover:border-blue-500/60 rounded-xl p-2.5 text-center space-y-2 group transition-all"
                >
                  <div className="w-full aspect-[3/4] bg-red-700 rounded-lg overflow-hidden border border-red-800/80 shadow-inner relative flex items-center justify-center">
                    <img
                      src={displayPhoto}
                      alt={st.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setSelectedStudentForSinglePhoto(st.id);
                        singlePhotoInputRef.current?.click();
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-white text-[10px] font-bold transition-opacity cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> Ganti
                    </button>
                  </div>

                  <div className="text-left">
                    <h5 className="text-[11px] font-bold text-white truncate" title={st.name}>
                      {st.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {st.username}
                    </p>
                    <span className="text-[9px] text-cyan-400 font-semibold block truncate">
                      {st.className} &bull; {st.room}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // SUB-VIEW 1: DAFTAR SELURUH PESERTA UJIAN (TABLE MATCHING IMAGE 1)
  // ==============================================================
  return (
    <div className="w-full space-y-5">
      {/* Top Header outside card */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Daftar Seluruh Peserta Ujian
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
          Total: {students.length} Peserta Terdaftar
        </span>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1c2230] border border-slate-700/70 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Card Toolbar matching Image 1 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Daftar Seluruh Peserta Ujian
            </h3>
          </div>

          {/* Action Buttons matching Image 1 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Tambah (Blue) */}
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>

            {/* 2. Import (Cyan) */}
            <button
              onClick={onOpenImportMaster}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Import
            </button>

            {/* 3. Export (Amber) */}
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>

            {/* 4. Foto (Emerald) */}
            <button
              onClick={() => setCurrentSubView('FOTO_MASSAL')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" /> Foto
            </button>

            {/* 5. Cetak Kartu Login (Indigo/Purple) */}
            {onNavigateToCetakKartu && (
              <button
                onClick={onNavigateToCetakKartu}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                title="Lanjut Cetak Kartu Peserta Ujian"
              >
                <CreditCard className="w-3.5 h-3.5" /> Cetak Kartu
              </button>
            )}

            {/* 6. Refresh (Dark Outline) */}
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Muat Ulang Data Peserta"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Table Controls (Show entries + Search) matching Image 1 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-[#141822] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>Semua</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari..."
              className="px-3 py-1.5 bg-[#141822] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 w-52"
            />
          </div>
        </div>

        {/* Table matching Image 1 */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/80">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#141822] text-slate-300 font-bold uppercase text-[11px] border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-3">NO_PESERTA ↕</th>
                <th className="py-3 px-3">NAMA ↕</th>
                <th className="py-3 px-3">LEVEL ↕</th>
                <th className="py-3 px-3">KELAS ↕</th>
                <th className="py-3 px-3">JURUSAN ↕</th>
                <th className="py-3 px-3 text-center">SESI ↕</th>
                <th className="py-3 px-3">RUANG ↕</th>
                <th className="py-3 px-3">USERNAME ↕</th>
                <th className="py-3 px-3">PASSWORD ↕</th>
                <th className="py-3 px-3">SERVER ↕</th>
                <th className="py-3 px-3 text-center">AKSI ↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedStudents.map((st, index) => {
                const globalIndex = entriesPerPage === 0 ? index + 1 : (currentPage - 1) * entriesPerPage + index + 1;
                const isPasswordShown = showPasswordMap[st.id];

                return (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {globalIndex}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                      {st.noPeserta}
                    </td>
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      {st.photoUrl && (
                        <img
                          src={st.photoUrl}
                          alt=""
                          className="w-5 h-6 object-cover rounded bg-red-700 border border-slate-700 shrink-0"
                        />
                      )}
                      <span>{st.name}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      {st.level || 'VI'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      {st.className}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      {st.jurusan || 'MI'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                      {st.session?.replace(/\D/g, '') || '1'}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-300">
                      {st.room}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 uppercase font-semibold">
                      {st.username}
                    </td>
                    <td className="py-3 px-3 font-mono text-rose-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>
                          {isPasswordShown
                            ? st.passwordText
                            : `$2y$10$${st.username.slice(0, 3)}...`}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(st.id)}
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                          title="Toggle Password"
                        >
                          {isPasswordShown ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-300">
                      {st.server || 'MH'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button (Amber) */}
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md shadow-xs cursor-pointer transition-colors"
                          title="Edit Data Siswa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Button (Red) */}
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus siswa "${st.name}"?`)) {
                              onDeleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md shadow-xs cursor-pointer transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500">
                    Tidak ada data peserta ujian yang sesuai dengan kata kunci &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
          <div>
            Menampilkan {filteredStudents.length > 0 ? (currentPage - 1) * (entriesPerPage || filteredStudents.length) + 1 : 0} sampai{' '}
            {entriesPerPage === 0
              ? filteredStudents.length
              : Math.min(currentPage * entriesPerPage, filteredStudents.length)}{' '}
            dari {filteredStudents.length} entri
          </div>

          {entriesPerPage > 0 && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-300 font-semibold cursor-pointer"
              >
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    currentPage === pg
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-300 font-semibold cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL TAMBAH / EDIT SISWA (EXACT MATCH TO IMAGE 2)             */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#1f2533] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Cyan Modal Header matching Image 2 */}
            <div className="bg-[#0ea5e9] px-6 py-3.5 flex items-center justify-between text-white shadow-md">
              <h4 className="text-base font-bold tracking-wide">
                {editingStudentId ? 'Edit Data Siswa' : 'Tambah Siswa'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs">
              {/* Row 1: NIS and Nomor Peserta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    NIS
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1010"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nomor Peserta
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 26-27-01-1-0508-0001"
                    value={noPeserta}
                    onChange={(e) => setNoPeserta(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Row 2: Nama */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap peserta didik..."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              {/* Row 3: Jurusan, Level, Kelas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jurusan
                  </label>
                  <select
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Semua">Semua</option>
                    <option value="MI">MI</option>
                    {majors.map((m) => (
                      <option key={m.id} value={m.code}>
                        {m.code} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                  >
                    <option value="VI">VI</option>
                    {levels.map((l) => (
                      <option key={l.id} value={l.code}>
                        {l.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kelas
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="VI">VI</option>
                    <option value="VI-A">VI-A</option>
                    <option value="VI-B">VI-B</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Sesi, Ruang, Server */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sesi
                  </label>
                  <select
                    value={sesi}
                    onChange={(e) => setSesi(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={String(s.sessionNumber)}>
                        Sesi {s.sessionNumber} ({s.timeRange})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Ruang
                  </label>
                  <select
                    value={ruang}
                    onChange={(e) => setRuang(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                  >
                    <option value="LAB-01">LAB-01</option>
                    <option value="LAB-02">LAB-02</option>
                    <option value="R_3">R_3</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.code}>
                        {r.code} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Server
                  </label>
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                  >
                    <option value="MH">MH</option>
                    <option value="SR01">SR01</option>
                    {servers.map((srv) => (
                      <option key={srv.id} value={srv.code}>
                        {srv.code} ({srv.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Username */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Username login ujian (huruf kecil/angka)..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Row 6: Password and Ulang Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordInput ? 'text' : 'password'}
                      required
                      placeholder="Password login..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono pr-10 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordInput(!showPasswordInput)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Ulang Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPasswordInput ? 'text' : 'password'}
                      required
                      placeholder="Ulangi password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white font-mono pr-10 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPasswordInput(!showConfirmPasswordInput)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 7: Status */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Status
                </label>
                <select
                  value={statusAktif ? 'Aktif' : 'Nonaktif'}
                  onChange={(e) => setStatusAktif(e.target.value === 'Aktif')}
                  className="w-full px-3 py-2.5 bg-[#141822] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Row 8: Foto Profil untuk Kartu Login */}
              <div className="p-3 bg-[#141822] border border-slate-700/80 rounded-xl flex items-center gap-4">
                <div className="w-14 h-18 bg-red-700 rounded-lg overflow-hidden border border-slate-600 shrink-0 flex items-center justify-center shadow-md">
                  <img
                    src={photoUrl || (nama ? generateDefaultPhoto(nama) : generateDefaultPhoto('Siswa'))}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-white block">
                    Foto Peserta (Untuk Kartu Login Ujian)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Foto ini akan otomatis dicetak pada Kartu Peserta Ujian. Latar belakang merah standar nasional.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Footer matching Image 2 */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md"
                >
                  SIMPAN DATA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
