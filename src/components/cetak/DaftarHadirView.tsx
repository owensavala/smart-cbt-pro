'use client';

import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  Info,
  Calendar,
  Users,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { ExamSchedule, ExamRoom, ExamSessionInfo, SchoolClass, Student, SchoolBrandingSettings } from '@/lib/types';

interface DaftarHadirViewProps {
  schedules?: ExamSchedule[];
  rooms?: ExamRoom[];
  sessions?: ExamSessionInfo[];
  classes?: SchoolClass[];
  students?: Student[];
  branding?: SchoolBrandingSettings;
}

export default function DaftarHadirView({
  schedules = [],
  rooms = [],
  sessions = [],
  classes = [],
  students = [],
  branding,
}: DaftarHadirViewProps) {
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [selectedRuangan, setSelectedRuangan] = useState('ALL');
  const [selectedSesi, setSelectedSesi] = useState('ALL');
  const [selectedKelas, setSelectedKelas] = useState('ALL');
  const [perPage, setPerPage] = useState('20 Siswa');
  const [namaPengawas, setNamaPengawas] = useState('');
  const [nipPengawas, setNipPengawas] = useState('');
  const [paperSize, setPaperSize] = useState('A4 (210mm x 297mm)');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreviewModal(true);
  };

  const handleExecutePrint = () => {
    window.print();
  };

  // Mock sample students for attendance sheet
  const sampleStudents = [
    { no: 1, noPeserta: '26-27-01-1-0508-0001', name: 'ABDUL ADZIM', nis: '3138848262', kelas: 'VI' },
    { no: 2, noPeserta: '26-27-01-1-0508-0027', name: 'AFHIF U SANGADJI', nis: '0133471482', kelas: 'VI' },
    { no: 3, noPeserta: '26-27-01-1-0508-0002', name: 'AHMAD JIBRIL MUHAMMAD', nis: '3139266943', kelas: 'VI' },
    { no: 4, noPeserta: '26-27-01-1-0508-0003', name: 'AHMAD SYAMIL AYYASHA', nis: '3138601804', kelas: 'VI' },
    { no: 5, noPeserta: '26-27-01-1-0508-0028', name: 'AL HAFIZD DJ. RAIS', nis: '3142416183', kelas: 'VI' },
    { no: 6, noPeserta: '26-27-01-1-0508-0004', name: 'ALYA ZAHIDAH DAENG MAPATO', nis: '0146882570', kelas: 'VI' },
    { no: 7, noPeserta: '26-27-01-1-0508-0005', name: 'ARJA FEBRIANSYAH ASRUL', nis: '0146882571', kelas: 'VI' },
    { no: 8, noPeserta: '26-27-01-1-0508-0006', name: 'BAZIEL AL ZAYYAN TOMIA', nis: '0146882572', kelas: 'VI' },
    { no: 9, noPeserta: '26-27-01-1-0508-0007', name: 'BILQIS NUR AZIZAH', nis: '0146882573', kelas: 'VI' },
    { no: 10, noPeserta: '26-27-01-1-0508-0008', name: 'DANIAL AL KHALIFI', nis: '0146882574', kelas: 'VI' },
  ];

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
          Laporan Kehadiran Peserta Ujian
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Form Cetak Daftar Hadir (Images 2 & 3) */}
        <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Daftar Hadir</span>
          </div>

          <form onSubmit={handlePrint} className="space-y-4">
            {/* Pilih Jadwal Ujian */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Pilih Jadwal Ujian
              </label>
              <select
                value={selectedJadwal}
                onChange={(e) => setSelectedJadwal(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="">Pilih Jadwal</option>
                <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1 (BAHASA INDONESIA)</option>
                <option value="SBP-KLS-VI-1">SBP-KLS-VI-1 (SENI BUDAYA)</option>
                <option value="BING-KLS-VI-1">BING-KLS-VI-1 (BAHASA INGGRIS)</option>
                <option value="SKI-KLS-VI-1">SKI-KLS-VI-1 (SEJARAH KEBUDAYAAN ISLAM)</option>
              </select>
            </div>

            {/* Pilih Ruangan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Pilih Ruangan
              </label>
              <select
                value={selectedRuangan}
                onChange={(e) => setSelectedRuangan(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="ALL">Semua Ruangan</option>
                <option value="LAB-01">Lab Komputer 1 (LAB-01)</option>
                <option value="LAB-02">Lab Komputer 2 (LAB-02)</option>
                <option value="R_3">Ruang CBT 3 (R_3)</option>
              </select>
            </div>

            {/* Pilih Sesi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Pilih Sesi
              </label>
              <select
                value={selectedSesi}
                onChange={(e) => setSelectedSesi(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="ALL">Semua Sesi</option>
                <option value="1">Sesi 1 (07.30 - 09.30)</option>
                <option value="2">Sesi 2 (10.00 - 12.00)</option>
                <option value="3">Sesi 3 (13.00 - 15.00)</option>
              </select>
            </div>

            {/* Pilih Kelas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Pilih Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="ALL">Semua Kelas</option>
                <option value="X">Kelas X</option>
                <option value="V">Kelas V</option>
              </select>
            </div>

            {/* Jumlah Siswa per Halaman */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Jumlah Siswa per Halaman
              </label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="20 Siswa">20 Siswa</option>
                <option value="25 Siswa">25 Siswa</option>
                <option value="30 Siswa">30 Siswa</option>
              </select>
            </div>

            {/* Nama Pengawas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Nama Pengawas
              </label>
              <input
                type="text"
                placeholder="Nama Pengawas"
                value={namaPengawas}
                onChange={(e) => setNamaPengawas(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* NIP Pengawas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                NIP Pengawas
              </label>
              <input
                type="text"
                placeholder="NIP Pengawas"
                value={nipPengawas}
                onChange={(e) => setNipPengawas(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Ukuran Kertas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Ukuran Kertas
              </label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="A4 (210mm x 297mm)">A4 (210mm x 297mm)</option>
                <option value="F4 (215mm x 330mm)">F4 / Folio (215mm x 330mm)</option>
              </select>
            </div>

            {/* Button Cetak Daftar Hadir (Matching Image 3) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Daftar Hadir</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Petunjuk Cetak (Matching Image 2) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#10b981] text-slate-950 rounded-xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
              </div>
              <h3 className="font-bold text-sm text-slate-950">Petunjuk Cetak</h3>
            </div>

            <p className="text-xs text-slate-900 leading-relaxed font-medium">
              Daftar hadir akan berisi Nama, No Peserta, dan kolom Tanda Tangan.
              Pastikan jadwal ujian telah diset agar tanggal dan jam muncul otomatis
              di lembar cetak.
            </p>

            <p className="text-xs text-rose-800 font-bold">
              *Pilih Semua Kelas jika ingin cetak per Ruang & Sesi.
            </p>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Lembar Siap Cetak: Daftar Hadir Peserta Ujian</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExecutePrint}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dokumen</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Paper Sheet */}
            <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl font-sans text-xs space-y-4 print:p-0 print:shadow-none">
              {/* Header Kop Surat */}
              <div className="text-center pb-3 border-b-2 border-slate-900 space-y-1">
                <h2 className="text-sm font-bold tracking-wider uppercase">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h2>
                <h3 className="text-base font-black tracking-wide uppercase">
                  {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'}
                </h3>
                <p className="text-[11px] text-slate-600">
                  DAFTAR HADIR PESERTA UJIAN MADRASAH BERBASIS KOMPUTER (UMBK)
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  TAHUN PELAJARAN 2025/2026
                </p>
              </div>

              {/* Exam Info Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-2">
                <div className="space-y-1">
                  <div>Mata Pelajaran: <span className="font-bold">{selectedJadwal || 'BAHASA INDONESIA'}</span></div>
                  <div>Kelas / Jurusan: <span className="font-bold">{selectedKelas === 'ALL' ? 'VI (Semua)' : selectedKelas} / MI</span></div>
                </div>
                <div className="space-y-1 text-right">
                  <div>Ruangan: <span className="font-bold">{selectedRuangan === 'ALL' ? 'Semua Ruangan' : selectedRuangan}</span></div>
                  <div>Sesi: <span className="font-bold">{selectedSesi === 'ALL' ? 'Semua Sesi' : `Sesi ${selectedSesi}`}</span></div>
                </div>
              </div>

              {/* Attendance Table */}
              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                    <th className="border border-slate-900 py-2 px-2 text-center w-10">NO</th>
                    <th className="border border-slate-900 py-2 px-3 text-center">NO PESERTA</th>
                    <th className="border border-slate-900 py-2 px-4">NAMA PESERTA</th>
                    <th className="border border-slate-900 py-2 px-2 text-center w-16">KELAS</th>
                    <th className="border border-slate-900 py-2 px-3 text-center w-36">TANDA TANGAN</th>
                    <th className="border border-slate-900 py-2 px-3 text-center w-24">KET</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((st, i) => (
                    <tr key={st.no} className="border-b border-slate-800">
                      <td className="border border-slate-900 py-2 px-2 text-center">{st.no}</td>
                      <td className="border border-slate-900 py-2 px-3 text-center font-mono">{st.noPeserta}</td>
                      <td className="border border-slate-900 py-2 px-4 font-bold uppercase">{st.name}</td>
                      <td className="border border-slate-900 py-2 px-2 text-center">{st.kelas}</td>
                      <td className="border border-slate-900 py-2 px-3 text-xs">
                        <span className="text-[10px] text-slate-400 block">{i % 2 === 0 ? `${st.no}. .............` : `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${st.no}. .............`}</span>
                      </td>
                      <td className="border border-slate-900 py-2 px-3 text-center text-[10px] text-slate-500">Hadir</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signature section */}
              <div className="pt-6 flex justify-between items-end text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Madrasah</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{branding?.kepalaSekolah || 'Drs. H. Ridwan Saleh, M.Pd'}</p>
                  <p className="font-mono text-slate-600">NIP. {branding?.nipKepalaSekolah || '197805122005011003'}</p>
                </div>
                <div className="text-right">
                  <p>Ternate, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Pengawas Ruang</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{namaPengawas || '( .......................................... )'}</p>
                  <p className="font-mono text-slate-600">NIP. {nipPengawas || '...........................................'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
