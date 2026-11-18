'use client';

import React, { useState } from 'react';
import {
  Printer,
  CreditCard,
  FileText,
  FileCheck,
  CheckCircle2,
  QrCode,
  School,
  FileSpreadsheet,
  Download,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Student, StudentSession, Exam, SchoolBrandingSettings } from '../lib/types';
import {
  downloadScoresExcelFile,
  prepareStudentScoreRows,
  getScorePredicate,
} from '../lib/excel-export';

interface PrintCenterProps {
  students: Student[];
  studentSessions: StudentSession[];
  exam: Exam;
  branding?: SchoolBrandingSettings;
  initialDoc?: 'KARTU' | 'DAFTAR_HADIR' | 'BERITA_ACARA' | 'LEGER_NILAI';
}

export default function PrintCenter({
  students,
  studentSessions,
  exam,
  branding,
  initialDoc = 'KARTU',
}: PrintCenterProps) {
  const [activeDoc, setActiveDoc] = useState<'KARTU' | 'DAFTAR_HADIR' | 'BERITA_ACARA' | 'LEGER_NILAI'>(initialDoc);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [specialNotes, setSpecialNotes] = useState<string>(
    'Pelaksanaan asesmen berlangsung dengan tertib dan kondusif. Sistem Vector Anti-Cheat aktif secara otomatis dan tidak terjadi kendala pemadaman server atau jaringan.'
  );

  // Ambil daftar kelas unik untuk filter
  const classOptions = Array.from(new Set(students.map((s) => s.className).filter(Boolean)));

  // Filter siswa berdasarkan kelas yang dipilih
  const filteredStudents = selectedClass === 'ALL'
    ? students
    : students.filter((s) => s.className === selectedClass);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = (format: 'ERAPOR' | 'RDM') => {
    setIsExportingExcel(true);
    try {
      downloadScoresExcelFile(
        {
          students: filteredStudents,
          studentSessions,
          exam,
          branding,
        },
        format
      );
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor file Excel. Silakan coba lagi.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Skor dan statistik untuk tab Leger Nilai
  const studentRows = prepareStudentScoreRows({
    students: filteredStudents,
    studentSessions,
    exam,
    branding,
  });

  const scores = studentRows.map((r) => r.finalScore);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const passedCount = studentRows.filter((r) => r.status === 'TUNTAS').length;
  const remedialCount = studentRows.filter((r) => r.status === 'REMEDIAL').length;

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. HEADER PUSAT CETAK & TOMBOL AKSI UTAMA (PRINT:HIDDEN)        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Printer className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pusat Cetak Dokumen Administrasi Ujian</h2>
              <p className="text-xs text-slate-500">
                Format resmi standar Kemendikbud & Kemenag siap cetak langsung ke printer atau simpan ke PDF
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Kelas */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Filter Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kelas ({students.length})</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  Kelas {c} ({students.filter((s) => s.className === c).length})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Dokumen / Simpan PDF (Ctrl+P)
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TAB PILIHAN DOKUMEN CETAK                                  */}
      {/* ============================================================== */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1.5 text-xs font-semibold print:hidden">
        <button
          onClick={() => setActiveDoc('KARTU')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoc === 'KARTU'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cetak Kartu Peserta Ujian</span>
        </button>

        <button
          onClick={() => setActiveDoc('DAFTAR_HADIR')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoc === 'DAFTAR_HADIR'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Daftar Hadir Ruangan</span>
        </button>

        <button
          onClick={() => setActiveDoc('BERITA_ACARA')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoc === 'BERITA_ACARA'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Berita Acara Ujian (BAPU)</span>
        </button>

        <button
          onClick={() => setActiveDoc('LEGER_NILAI')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeDoc === 'LEGER_NILAI'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Rekap Nilai (PG + Esai AI) & Ekspor</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. DOKUMEN CETAK: KARTU PESERTA UJIAN (GRID 2xN)              */}
      {/* ============================================================== */}
      {activeDoc === 'KARTU' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-center mb-6 pb-4 border-b border-slate-200 print:mb-2 print:pb-2">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              Kartu Peserta Ujian Asesmen Sumatif (ASAS / ANBK)
            </h3>
            <p className="text-xs text-slate-500">
              Tahun Ajaran {branding?.academicYear || '2025/2026'} ({branding?.semester || 'Ganjil'}) &bull;{' '}
              {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'} &bull; NPSN: {branding?.npsn || '10293847'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {filteredStudents.map((std) => (
              <div
                key={std.id}
                className="border-2 border-slate-800 rounded-xl p-4 bg-white relative flex flex-col justify-between text-xs space-y-3 break-inside-avoid"
              >
                {/* Header Kartu */}
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-tight">
                      KARTU PESERTA UJIAN ASESMEN CBT
                    </h4>
                    <p className="text-[10px] text-slate-600 font-semibold">
                      {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
                    </p>
                  </div>
                  <QrCode className="w-8 h-8 text-slate-800 flex-shrink-0" />
                </div>

                {/* Biodata Siswa & Pas Foto 3x4 */}
                <div className="flex gap-3 items-center">
                  <div className="flex-1 grid grid-cols-3 gap-1.5 text-[11px]">
                    <span className="text-slate-500">Nama Siswa</span>
                    <span className="col-span-2 font-bold text-slate-900 truncate">: {std.name}</span>

                    <span className="text-slate-500">Nomor NISN</span>
                    <span className="col-span-2 font-mono font-semibold text-slate-800">: {std.nisn}</span>

                    <span className="text-slate-500">No. Peserta</span>
                    <span className="col-span-2 font-mono font-semibold text-slate-800">: {std.noPeserta}</span>

                    <span className="text-slate-500">Kelas / Rombel</span>
                    <span className="col-span-2 font-semibold text-slate-800">: {std.className}</span>

                    <span className="text-slate-500">Ruang & Sesi</span>
                    <span className="col-span-2 font-medium text-slate-700">
                      : {std.room} ({std.session})
                    </span>
                  </div>

                  {/* Pas Foto Peserta Ujian */}
                  <div className="w-16 h-20 bg-red-700 border border-slate-500 rounded-md overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                    {std.photoUrl ? (
                      <img
                        src={std.photoUrl}
                        alt={std.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-[9px] text-white/90 p-1 font-bold">
                        <span>FOTO</span>
                        <span className="block text-[8px] font-mono">2x3</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kredensial Login Siswa */}
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Username:</span>
                    <strong className="font-mono text-blue-800">{std.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Password:</span>
                    <strong className="font-mono text-emerald-800">{std.passwordText}</strong>
                  </div>
                  <span className="text-[9px] text-slate-400 italic">Jaga kerahasiaan</span>
                </div>

                <div className="flex justify-between items-end pt-1 text-[9px] text-slate-400 border-t border-slate-200">
                  <span>Dicetak otomatis oleh SmartCBT Pro</span>
                  <span>Ttd. Kepala Madrasah / Sekolah</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. DOKUMEN CETAK: DAFTAR HADIR PESERTA RUANGAN                */}
      {/* ============================================================== */}
      {activeDoc === 'DAFTAR_HADIR' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-xs text-slate-900 space-y-6">
          {/* KOP RESMI SURAT */}
          <div className="flex items-center justify-between border-b-4 border-double border-slate-900 pb-3">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold">
              <School className="w-8 h-8" />
            </div>
            <div className="text-center flex-1 px-4">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
              </h2>
              <p className="text-[11px] font-semibold text-slate-700">
                PENILAIAN ASESMEN SUMATIF BERBASIS KOMPUTER (SMARTCBT PRO)
              </p>
              <p className="text-[10px] text-slate-500">
                NPSN: {branding?.npsn || '10293847'} &bull; Tahun Ajaran {branding?.academicYear || '2025/2026'} ({branding?.semester || 'Ganjil'})
              </p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center border-2 border-slate-800 rounded-xl p-1 text-[9px] text-center font-mono">
              <QrCode className="w-10 h-10" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wide underline">
              DAFTAR HADIR PESERTA UJIAN BERBASIS KOMPUTER
            </h3>
            <p className="text-[11px] font-mono text-slate-600">
              Nomor: 046/DH-CBT/{branding?.npsn || '10293847'}/{new Date().getFullYear()}
            </p>
          </div>

          {/* Rincian Jadwal & Ruang */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs">
            <div className="space-y-1">
              <p>Mata Pelajaran: <strong className="uppercase">{exam.subjectName || exam.subject || 'IPA Terpadu'}</strong></p>
              <p>Tingkat / Kelas: <strong>{selectedClass === 'ALL' ? (exam.className || 'VI-A & VI-B') : `Kelas ${selectedClass}`}</strong></p>
              <p>Ruang Ujian: <strong>Ruang 01 (Lab Komputer A)</strong></p>
            </div>
            <div className="space-y-1">
              <p>Hari / Tanggal: <strong>{exam.examDate || 'Senin, 18 Mei 2026'}</strong></p>
              <p>Sesi / Waktu: <strong>Sesi 1 ({exam.startTime || '07:30'} - {exam.endTime || '09:30'})</strong></p>
              <p>Alokasi Waktu: <strong>{exam.durationMinutes || 90} Menit</strong></p>
            </div>
          </div>

          {/* Tabel Presensi Siswa */}
          <table className="w-full border-collapse border border-slate-900 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-center">
                <th className="border border-slate-900 p-2 w-10">No</th>
                <th className="border border-slate-900 p-2 w-28">No. Peserta</th>
                <th className="border border-slate-900 p-2 w-28">NISN</th>
                <th className="border border-slate-900 p-2 text-left">Nama Lengkap Peserta</th>
                <th className="border border-slate-900 p-2 w-16">Kelas</th>
                <th className="border border-slate-900 p-2 w-20">Status</th>
                <th className="border border-slate-900 p-2 w-44">Tanda Tangan Peserta</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std, idx) => (
                <tr key={std.id} className="h-10 hover:bg-slate-50">
                  <td className="border border-slate-900 p-2 text-center font-semibold">{idx + 1}</td>
                  <td className="border border-slate-900 p-2 text-center font-mono">{std.noPeserta}</td>
                  <td className="border border-slate-900 p-2 text-center font-mono">{std.nisn}</td>
                  <td className="border border-slate-900 p-2 font-medium">{std.name}</td>
                  <td className="border border-slate-900 p-2 text-center">{std.className}</td>
                  <td className="border border-slate-900 p-2 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      HADIR
                    </span>
                  </td>
                  {/* Tanda Tangan Selang-Seling Resmi Indonesia */}
                  <td className="border border-slate-900 p-1.5 text-slate-400 italic text-[10px]">
                    {idx % 2 === 0 ? (
                      <div className="text-left font-mono pl-1">
                        {idx + 1}. ....................
                      </div>
                    ) : (
                      <div className="text-center font-mono pr-2">
                        {idx + 1}. ....................
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Ringkasan Presensi */}
          <div className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span>Jumlah Peserta Terdaftar: <strong>{filteredStudents.length} Siswa</strong></span>
            <span>Jumlah Peserta Hadir: <strong>{filteredStudents.length} Siswa</strong></span>
            <span>Jumlah Peserta Tidak Hadir: <strong>0 Siswa</strong></span>
          </div>

          {/* Kolom Tanda Tangan Panitia & Pengawas */}
          <div className="grid grid-cols-2 pt-6 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua Panitia Ujian CBT</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan & Stempel ]</span>
              </div>
              <p className="font-bold underline">({branding?.proktorName || 'Dermawan Surya Kencana, S. Sos'})</p>
              <p className="text-[10px] text-slate-500">NIP. {branding?.nipProktor || '198403152009021004'}</p>
            </div>
            <div>
              <p>Pengawas Ruangan Ujian,</p>
              <p className="font-bold">Pengawas / Proktor</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">[ Tanda Tangan Pengawas ]</span>
              </div>
              <p className="font-bold underline">(........................................................)</p>
              <p className="text-[10px] text-slate-500">NIP. ....................................................</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DOKUMEN CETAK: BERITA ACARA PELAKSANAAN UJIAN (BAPU)       */}
      {/* ============================================================== */}
      {activeDoc === 'BERITA_ACARA' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-xs text-slate-900 space-y-5">
          {/* KOP RESMI SURAT */}
          <div className="flex items-center justify-between border-b-4 border-double border-slate-900 pb-3">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold">
              <School className="w-8 h-8" />
            </div>
            <div className="text-center flex-1 px-4">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}
              </h2>
              <p className="text-[11px] font-semibold text-slate-700">
                PANITIA ASESMEN SUMATIF AKHIR SEMESTER (ASAS) BERBASIS KOMPUTER
              </p>
              <p className="text-[10px] text-slate-500">
                NPSN: {branding?.npsn || '10293847'} &bull; Tahun Ajaran {branding?.academicYear || '2025/2026'} ({branding?.semester || 'Ganjil'})
              </p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center border-2 border-slate-800 rounded-xl p-1 text-[9px] text-center font-mono">
              <QrCode className="w-10 h-10" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wide underline">
              BERITA ACARA PELAKSANAAN ASESMEN UJIAN (BAPU)
            </h3>
            <p className="text-[11px] font-mono text-slate-600">
              Nomor: 045/BAPU-CBT/{branding?.npsn || '10293847'}/{new Date().getFullYear()}
            </p>
          </div>

          <p className="leading-relaxed text-justify">
            Pada hari ini, <strong>Senin</strong> tanggal <strong>18</strong> bulan <strong>Mei</strong> tahun <strong>2026</strong>, bertempat di <strong>{branding?.schoolName || 'SMA Integral Hidayatullah'}</strong>, telah diselenggarakan Penilaian Asesmen Berbasis Komputer (SmartCBT Pro) untuk mata pelajaran dan rincian sebagai berikut:
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Mata Pelajaran</p>
              <p className="font-bold text-slate-900 uppercase">{exam.subjectName || exam.subject || 'IPA Terpadu'}</p>
            </div>
            <div>
              <p className="text-slate-500">Tingkat / Rombongan Belajar</p>
              <p className="font-bold text-slate-900">{selectedClass === 'ALL' ? (exam.className || 'VI-A') : `Kelas ${selectedClass}`}</p>
            </div>
            <div>
              <p className="text-slate-500">Ruangan Ujian / Server</p>
              <p className="font-bold text-slate-900">Ruang 01 (Lab Komputer A) / SERVER-PUSAT-01</p>
            </div>
            <div>
              <p className="text-slate-500">Sesi & Waktu Pengerjaan</p>
              <p className="font-bold text-slate-900">Sesi 1 ({exam.startTime || '07:30'} - {exam.endTime || '09:30'}) &bull; {exam.durationMinutes || 90} Menit</p>
            </div>
            <div>
              <p className="text-slate-500">Jumlah Peserta Terdaftar</p>
              <p className="font-bold text-slate-900">{filteredStudents.length} Siswa</p>
            </div>
            <div>
              <p className="text-slate-500">Jumlah Peserta Hadir / Tidak Hadir</p>
              <p className="font-bold text-emerald-800">{filteredStudents.length} Hadir &bull; 0 Tidak Hadir</p>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Kode Token Rilis yang Digunakan:</span>
              <strong className="font-mono text-sm tracking-widest text-blue-800 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                {exam.activeToken || '36S7KS'}
              </strong>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-bold text-slate-900">Catatan Kejadian Khusus Selama Ujian:</h4>
              <span className="text-[10px] text-slate-400 print:hidden">(Dapat diedit langsung sebelum cetak)</span>
            </div>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs text-slate-700 bg-white leading-relaxed outline-none focus:border-emerald-500 resize-none print:border-none print:p-0 print:text-black"
            />
          </div>

          <p className="text-justify text-[11px] text-slate-600">
            Demikian Berita Acara Pelaksanaan Ujian ini dibuat dengan sebenar-benarnya sesuai dengan keadaan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.
          </p>

          {/* Kolom Tanda Tangan */}
          <div className="grid grid-cols-2 pt-6 text-center text-xs">
            <div>
              <p>Pengawas Ruangan Ujian,</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[ Tanda Tangan Pengawas ]</span>
              </div>
              <p className="font-bold underline">({branding?.proktorName || 'Dermawan Surya Kencana, S. Sos'})</p>
              <p className="text-[10px] text-slate-500">NIP. {branding?.nipProktor || '198403152009021004'}</p>
            </div>
            <div>
              <p>Kepala {branding?.jenjang?.includes('MI') ? 'Madrasah' : 'Sekolah'},</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[ Tanda Tangan & Cap Lembaga ]</span>
              </div>
              <p className="font-bold underline">({branding?.kepalaSekolah || 'Drs. H. Ahmad Dahlan, M.Pd.I'})</p>
              <p className="text-[10px] text-slate-500">NIP. {branding?.nipKepalaSekolah || '197505122000031002'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. DOKUMEN CETAK: LEGER NILAI & EKSPOR EXCEL (E-RAPOR & RDM)   */}
      {/* ============================================================== */}
      {activeDoc === 'LEGER_NILAI' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-xs text-slate-900 space-y-6">
          {/* HEADER DAN TOMBOL EKSPOR EXCEL */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Rekapitulasi Nilai Akhir (Nilai PG + Nilai Esai AI)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Data terintegrasi hasil asesmen objektif dan NLP Semantic Evaluator siap ekspor ke Excel
              </p>
            </div>

            {/* DUAL BUTTONS EKSPOR EXCEL */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExportExcel('ERAPOR')}
                disabled={isExportingExcel}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Format e-Rapor (.xlsx)</span>
              </button>

              <button
                onClick={() => handleExportExcel('RDM')}
                disabled={isExportingExcel}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Format RDM Kemenag (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* KOP LAPORAN UNTUK CETAK */}
          <div className="text-center space-y-1 pb-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              LEGER REKAPITULASI NILAI AKHIR ASESMEN (FORMAT E-RAPOR & RDM)
            </h3>
            <p className="text-xs font-semibold uppercase">{branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}</p>
            <p className="text-[11px] text-slate-500">
              Mata Pelajaran: {exam.subjectName || exam.subject || 'IPA Terpadu'} &bull; Tingkat / Rombel: {selectedClass === 'ALL' ? (exam.className || 'VI-A') : selectedClass} &bull; KKM: 75
            </p>
          </div>

          {/* KARTU STATISTIK NILAI */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 print:hidden">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-500 block">Rata-Rata Nilai</span>
              <strong className="text-lg font-black text-slate-800">{avgScore}</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-500 block">Nilai Tertinggi</span>
              <strong className="text-lg font-black text-emerald-600">{maxScore}</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-500 block">Nilai Terendah</span>
              <strong className="text-lg font-black text-amber-600">{minScore}</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-500 block">Jumlah Tuntas</span>
              <strong className="text-lg font-black text-emerald-700">
                {passedCount} ({Math.round((passedCount / (studentRows.length || 1)) * 100)}%)
              </strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-500 block">Jumlah Remedial</span>
              <strong className="text-lg font-black text-rose-600">{remedialCount}</strong>
            </div>
          </div>

          {/* TABEL DATA NILAI LENGKAP */}
          <table className="w-full border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-center">
                <th className="border border-slate-800 p-2 w-10">No</th>
                <th className="border border-slate-800 p-2 w-28">NISN</th>
                <th className="border border-slate-800 p-2 text-left">Nama Lengkap Siswa</th>
                <th className="border border-slate-800 p-2 w-16">Kelas</th>
                <th className="border border-slate-800 p-2 w-24">Skor PG (70%)</th>
                <th className="border border-slate-800 p-2 w-28 text-emerald-800">Skor Esai AI (30%)</th>
                <th className="border border-slate-800 p-2 w-24 bg-blue-50/50">Nilai Akhir (0-100)</th>
                <th className="border border-slate-800 p-2 w-16">Predikat</th>
                <th className="border border-slate-800 p-2 w-24">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map((r) => (
                <tr key={r.studentId} className="h-9 hover:bg-slate-50">
                  <td className="border border-slate-800 p-2 text-center font-semibold">{r.no}</td>
                  <td className="border border-slate-800 p-2 text-center font-mono">{r.nisn}</td>
                  <td className="border border-slate-800 p-2 font-medium">{r.name}</td>
                  <td className="border border-slate-800 p-2 text-center">{r.className}</td>
                  <td className="border border-slate-800 p-2 text-center font-mono">{r.pgScore}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold font-mono text-emerald-700">
                    {r.essayScore}
                  </td>
                  <td className="border border-slate-800 p-2 text-center font-black font-mono text-blue-800 bg-blue-50/30">
                    {r.finalScore}
                  </td>
                  <td className="border border-slate-800 p-2 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      r.predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                      r.predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                      r.predicate === 'C' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {r.predicate}
                    </span>
                  </td>
                  <td className="border border-slate-800 p-2 text-center">
                    {r.status === 'TUNTAS' ? (
                      <span className="font-bold text-emerald-700">Tuntas</span>
                    ) : (
                      <span className="font-bold text-rose-600">Remedial</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tanda Tangan Leger */}
          <div className="grid grid-cols-2 pt-6 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala {branding?.jenjang?.includes('MI') ? 'Madrasah' : 'Sekolah'}</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[ Tanda Tangan & Cap ]</span>
              </div>
              <p className="font-bold underline">({branding?.kepalaSekolah || 'Drs. H. Ahmad Dahlan, M.Pd.I'})</p>
              <p className="text-[10px] text-slate-500">NIP. {branding?.nipKepalaSekolah || '197505122000031002'}</p>
            </div>
            <div>
              <p>Guru Pengampu Mata Pelajaran,</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[ Tanda Tangan Guru ]</span>
              </div>
              <p className="font-bold underline">({branding?.proktorName || 'Dermawan Surya Kencana, S. Sos'})</p>
              <p className="text-[10px] text-slate-500">NIP. {branding?.nipProktor || '198403152009021004'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
