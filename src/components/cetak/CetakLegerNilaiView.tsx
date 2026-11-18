'use client';

import React, { useState } from 'react';
import {
  User,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  X,
  School,
  Download,
} from 'lucide-react';
import { SchoolClass, SchoolBrandingSettings, Student } from '@/lib/types';

interface CetakLegerNilaiViewProps {
  classes?: SchoolClass[];
  students?: Student[];
  branding?: SchoolBrandingSettings;
}

export default function CetakLegerNilaiView({
  classes = [],
  students = [],
  branding,
}: CetakLegerNilaiViewProps) {
  const [filterJurusan, setFilterJurusan] = useState('ALL');
  const [filterJenjang, setFilterJenjang] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('VI');
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportExcel = () => {
    showToast(`Mengekspor Leger Nilai Kelas ${filterKelas} ke file Excel (.xlsx)...`);
    window.open(`/api/reports/export-scores?format=erapor`, '_blank');
  };

  const handleCetakHtml = () => {
    setShowHtmlModal(true);
  };

  // Sample data for ledger sheet
  const ledgerStudents = [
    { no: 1, noPeserta: '26-27-01-1-0508-0001', name: 'ABDUL ADZIM', nis: '3138848262', qh: 52.5, pkn: 80.0, sos: 92.5, mtk: 13.3, akah: 75.0, ba: 30.0, total: 343.3, avg: 57.2, rank: 5 },
    { no: 2, noPeserta: '26-27-01-1-0508-0027', name: 'AFHIF U SANGADJI', nis: '0133471482', qh: 60.0, pkn: 77.5, sos: 87.5, mtk: 30.0, akah: 85.0, ba: 25.0, total: 365.0, avg: 60.8, rank: 4 },
    { no: 3, noPeserta: '26-27-01-1-0508-0002', name: 'AHMAD JIBRIL MUHAMMAD', nis: '3139266943', qh: 40.0, pkn: 62.5, sos: 70.0, mtk: 43.3, akah: 52.5, ba: 27.5, total: 295.8, avg: 49.3, rank: 7 },
    { no: 4, noPeserta: '26-27-01-1-0508-0003', name: 'AHMAD SYAMIL AYYASHA', nis: '3138601804', qh: 60.0, pkn: 75.0, sos: 92.5, mtk: 23.3, akah: 80.0, ba: 27.5, total: 358.3, avg: 59.7, rank: 6 },
    { no: 5, noPeserta: '26-27-01-1-0508-0028', name: 'AL HAFIZD DJ. RAIS', nis: '3142416183', qh: 15.0, pkn: 35.0, sos: 20.0, mtk: 30.0, akah: 32.5, ba: 30.0, total: 162.5, avg: 27.1, rank: 8 },
    { no: 6, noPeserta: '26-27-01-1-0508-0004', name: 'ALYA ZAHIDAH DAENG MAPATO', nis: '0146882570', qh: 72.5, pkn: 80.0, sos: 87.5, mtk: 36.7, akah: 85.0, ba: 50.0, total: 411.7, avg: 68.6, rank: 1 },
    { no: 7, noPeserta: '26-27-01-1-0508-0005', name: 'ARJA FEBRIANSYAH ASRUL', nis: '0146882571', qh: 45.0, pkn: 27.5, sos: 82.5, mtk: 26.7, akah: 72.5, ba: 15.0, total: 269.2, avg: 44.9, rank: 7 },
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
          Pilih Kelas untuk Cetak Leger
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-6">
        {/* Card Header matching Image 9 */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <User className="w-4 h-4 text-slate-300" />
          <span>Cetak Leger Nilai</span>
        </div>

        {/* Filter Row matching Image 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Jurusan
            </label>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="MI">MI (Madrasah Ibtidaiyah)</option>
              <option value="UMUM">UMUM</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Jenjang
            </label>
            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="SD_MI">SD / MI</option>
              <option value="SMP_MTS">SMP / MTs</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Filter Kelas
            </label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="X">Kelas X</option>
              <option value="V">Kelas V</option>
              <option value="IV">Kelas IV</option>
            </select>
          </div>
        </div>

        {/* Action Buttons matching Image 9 */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportExcel}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handleCetakHtml}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak (HTML)</span>
          </button>
        </div>
      </div>

      {/* HTML Print View Modal */}
      {showHtmlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Dokumen Resmi: Buku Leger Nilai Hasil Ujian Kelas {filterKelas}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setShowHtmlModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Ledger Sheet */}
            <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl font-sans text-xs space-y-4">
              <div className="text-center pb-3 border-b-2 border-slate-900 space-y-1">
                <h2 className="text-sm font-bold uppercase">
                  LEGER NILAI HASIL UJIAN MADRASAH (UMBK)
                </h2>
                <h3 className="text-base font-black uppercase">
                  {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'}
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  KELAS: {filterKelas} | TAHUN PELAJARAN 2025/2026
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                      <th className="border border-slate-900 py-2 px-1 text-center w-8">#</th>
                      <th className="border border-slate-900 py-2 px-2 text-center w-28">NO PESERTA</th>
                      <th className="border border-slate-900 py-2 px-3">NAMA SISWA</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">QUHA</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">PKN</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">SOSIOLOGI</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">MTK</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">AKAH</th>
                      <th className="border border-slate-900 py-2 px-2 text-center">B.ARAB</th>
                      <th className="border border-slate-900 py-2 px-2 text-center bg-slate-200">TOTAL</th>
                      <th className="border border-slate-900 py-2 px-2 text-center bg-slate-200">RATA2</th>
                      <th className="border border-slate-900 py-2 px-2 text-center bg-amber-100 font-black">RANK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerStudents.map((st) => (
                      <tr key={st.no} className="border-b border-slate-300">
                        <td className="border border-slate-900 py-1.5 px-1 text-center font-mono">{st.no}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.noPeserta}</td>
                        <td className="border border-slate-900 py-1.5 px-3 font-bold uppercase">{st.name}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.qh.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.pkn.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.sos.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.mtk.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.akah.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">{st.ba.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono font-bold bg-slate-50">{st.total.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono font-bold bg-slate-50">{st.avg.toFixed(1)}</td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono font-black bg-amber-50">#{st.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Madrasah</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{branding?.kepalaSekolah || 'Drs. H. Ridwan Saleh, M.Pd'}</p>
                  <p className="font-mono text-slate-600">NIP. {branding?.nipKepalaSekolah || '197805122005011003'}</p>
                </div>
                <div className="text-right">
                  <p>Ternate, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Wali Kelas {filterKelas}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">Hadiyah Toatubun, A.Ma</p>
                  <p className="font-mono text-slate-600">NIP. 198906102014022001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
