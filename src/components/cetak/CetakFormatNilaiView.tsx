'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  FileText,
  FileCheck,
} from 'lucide-react';
import { ExamSchedule, SchoolClass } from '@/lib/types';

interface CetakFormatNilaiViewProps {
  schedules?: ExamSchedule[];
  classes?: SchoolClass[];
}

export default function CetakFormatNilaiView({
  schedules = [],
  classes = [],
}: CetakFormatNilaiViewProps) {
  const [filterJurusan, setFilterJurusan] = useState('ALL');
  const [filterJenjang, setFilterJenjang] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [exportFormat, setExportFormat] = useState<'EXCEL' | 'PDF'>('EXCEL');
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    showToast(
      `Sedang menyiapkan file laporan nilai (${exportFormat === 'EXCEL' ? 'Excel .xlsx' : 'PDF .pdf'})...`
    );

    setTimeout(() => {
      // Trigger download endpoint
      const formatParam = exportFormat === 'EXCEL' ? 'erapor' : 'pdf';
      const downloadUrl = `/api/reports/export-scores?format=${formatParam}${
        selectedJadwal ? `&examId=${selectedJadwal}` : ''
      }`;
      window.open(downloadUrl, '_blank');
      setIsExporting(false);
      showToast('Unduhan laporan nilai berhasil dimulai!');
    }, 1200);
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
          Ekspor Nilai ke Format Excel / PDF
        </h1>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-6">
        {/* Card Header matching Image 8 */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <FileText className="w-4 h-4 text-slate-300" />
          <span>Ekspor Laporan Nilai</span>
        </div>

        <form onSubmit={handleExport} className="space-y-6">
          {/* Filter Row matching Image 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <option value="SMA_MA">SMA / MA</option>
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
                <option value="ALL">Semua Kelas</option>
                <option value="X">Kelas X</option>
                <option value="V">Kelas V</option>
              </select>
            </div>

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
                <option value="QUHA-KLS-VI-1">QUHA-KLS-VI-1</option>
                <option value="PKN-KLS-VI-1">PKN-KLS-VI-1</option>
                <option value="SOSIOLOGI KELAS X IPS">SOSIOLOGI KELAS X IPS</option>
                <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1</option>
              </select>
            </div>
          </div>

          {/* Section: Pilih Format Ekspor matching Image 8 */}
          <div className="space-y-3 pt-4 border-t border-slate-800 text-center">
            <h3 className="text-xs font-bold text-slate-200">
              Pilih Format Ekspor
            </h3>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="exportFormat"
                  checked={exportFormat === 'EXCEL'}
                  onChange={() => setExportFormat('EXCEL')}
                  className="accent-blue-600"
                />
                <span>Microsoft Excel (.xlsx)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="exportFormat"
                  checked={exportFormat === 'PDF'}
                  onChange={() => setExportFormat('PDF')}
                  className="accent-blue-600"
                />
                <span>Adobe PDF (.pdf)</span>
              </label>
            </div>
          </div>

          {/* Submit Button matching Image 8 */}
          <div>
            <button
              type="submit"
              disabled={isExporting}
              className="w-full py-3 bg-[#0284c7] hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Memproses Ekspor...' : 'MULAI EKSPOR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
