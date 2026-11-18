'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Printer,
  ExternalLink,
  Eye,
  Sliders,
  CheckCircle2,
  Maximize2,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import { SchoolBrandingSettings, Student, ExamRoom } from '@/lib/types';

interface DenahLokasiViewProps {
  students?: Student[];
  rooms?: ExamRoom[];
  branding?: SchoolBrandingSettings;
}

export default function DenahLokasiView({
  students = [],
  rooms = [],
  branding,
}: DenahLokasiViewProps) {
  const [ruangan, setRuangan] = useState('ALL');
  const [sesi, setSesi] = useState('ALL');
  const [tampilan, setTampilan] = useState('Mode Lengkap (Foto/QR)');
  const [kolom, setKolom] = useState(6);
  const [baris, setBaris] = useState(5);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [fontSize, setFontSize] = useState(10);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenTab = () => {
    showToast('Membuka denah lokasi tempat duduk di tab baru...');
  };

  // 30 Sample student seats matching Images 5 & 6
  const seatStudents = [
    { no: 1, name: 'ABDUL ADZIM', noPeserta: '26-27-01-1-0508-0001' },
    { no: 2, name: 'AHMAD JIBRIL MUHAMMAD', noPeserta: '26-27-01-1-0508-0002' },
    { no: 3, name: 'AHMAD SYAMIL AYYASHA', noPeserta: '26-27-01-1-0508-0003' },
    { no: 4, name: 'ALYA ZAHIDAH DAENG MAPATO', noPeserta: '26-27-01-1-0508-0004' },
    { no: 5, name: 'ARJA FEBRIANSYAH ASRUL', noPeserta: '26-27-01-1-0508-0005' },
    { no: 6, name: 'BAZIEL AL ZAYYAN TOMIA', noPeserta: '26-27-01-1-0508-0006' },
    { no: 7, name: 'BILQIS NUR AZIZAH', noPeserta: '26-27-01-1-0508-0007' },
    { no: 8, name: 'DANIAL AL KHALIFI', noPeserta: '26-27-01-1-0508-0008' },
    { no: 9, name: 'FATHAN AL GHIFARI', noPeserta: '26-27-01-1-0508-0009' },
    { no: 10, name: 'HAURA NAZHIFAH', noPeserta: '26-27-01-1-0508-0010' },
    { no: 11, name: 'IBRAHIM AL FATIH', noPeserta: '26-27-01-1-0508-0011' },
    { no: 12, name: 'KHALID BASALAMAH', noPeserta: '26-27-01-1-0508-0012' },
    { no: 13, name: 'MUHAMMAD AL FATIH', noPeserta: '26-27-01-1-0508-0013' },
    { no: 14, name: 'NAURA ALTHAFUNNISA', noPeserta: '26-27-01-1-0508-0014' },
    { no: 15, name: 'RAYYAN AL GHANI', noPeserta: '26-27-01-1-0508-0015' },
    { no: 16, name: 'SITI AISYAH HUMAIRA', noPeserta: '26-27-01-1-0508-0016' },
    { no: 17, name: 'TALITA AZZAHRA', noPeserta: '26-27-01-1-0508-0017' },
    { no: 18, name: 'UMAR BIN KHATTAB', noPeserta: '26-27-01-1-0508-0018' },
    { no: 19, name: 'YUSUF AL HASANI', noPeserta: '26-27-01-1-0508-0019' },
    { no: 20, name: 'ZAHRA AMALIA', noPeserta: '26-27-01-1-0508-0020' },
    { no: 21, name: 'ZAYN MALIK ALFARIZI', noPeserta: '26-27-01-1-0508-0021' },
    { no: 22, name: 'AQILA FITRIANI', noPeserta: '26-27-01-1-0508-0022' },
    { no: 23, name: 'BAGAS PRATAMA', noPeserta: '26-27-01-1-0508-0023' },
    { no: 24, name: 'CINTA NUR AINI', noPeserta: '26-27-01-1-0508-0024' },
    { no: 25, name: 'DICKY KURNIAWAN', noPeserta: '26-27-01-1-0508-0025' },
    { no: 26, name: 'ENDAH RETNO', noPeserta: '26-27-01-1-0508-0026' },
    { no: 27, name: 'AFHIF U SANGADJI', noPeserta: '26-27-01-1-0508-0027' },
    { no: 28, name: 'AL HAFIZD DJ. RAIS', noPeserta: '26-27-01-1-0508-0028' },
    { no: 29, name: 'GILANG RAMADHAN', noPeserta: '26-27-01-1-0508-0029' },
    { no: 30, name: 'HANIFAH SALSABILA', noPeserta: '26-27-01-1-0508-0030' },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          Denah Ruangan & Lokasi Ujian
        </h1>
      </div>

      {/* Card Top: Pengaturan Denah Lokasi matching Images 5 & 6 */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <MapPin className="w-4 h-4 text-slate-300" />
            <span>Pengaturan Denah Lokasi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTab}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tab Baru</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Denah</span>
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Ruangan
            </label>
            <select
              value={ruangan}
              onChange={(e) => setRuangan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">Semua Ruangan</option>
              <option value="LAB-01">Lab Komputer 1 (LAB-01)</option>
              <option value="LAB-02">Lab Komputer 2 (LAB-02)</option>
              <option value="R_3">Ruang CBT 3 (R_3)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Sesi
            </label>
            <select
              value={sesi}
              onChange={(e) => setSesi(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">Semua Sesi</option>
              <option value="1">Sesi 1</option>
              <option value="2">Sesi 2</option>
              <option value="3">Sesi 3</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Tampilan
            </label>
            <select
              value={tampilan}
              onChange={(e) => setTampilan(e.target.value)}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Mode Lengkap (Foto/QR)">Mode Lengkap (Foto/QR)</option>
              <option value="Mode Ringkas">Mode Ringkas</option>
              <option value="Mode Nama Saja">Mode Nama Saja</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Kolom
            </label>
            <input
              type="number"
              value={kolom}
              onChange={(e) => setKolom(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Baris
            </label>
            <input
              type="number"
              value={baris}
              onChange={(e) => setBaris(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Collapsible: Pengaturan Lanjutan */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>{isAdvancedOpen ? '−' : '+'}</span>
            <span>Pengaturan Lanjutan (Ukuran Font & Gambar)</span>
          </button>

          {isAdvancedOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 bg-[#181d28] rounded-lg border border-slate-700/60 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Ukuran Font Nama:</label>
                <input
                  type="range"
                  min={8}
                  max={14}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-slate-400 font-mono text-[11px]">{fontSize}px</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Bottom: Live Preview Denah matching Images 5 & 6 */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Live Preview Denah</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-mono">Terupdate: 01.20.41</span>
            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* White Document Sheet matching Image 6 */}
        <div className="bg-white text-slate-900 p-6 md:p-8 rounded-lg shadow-2xl font-sans text-xs border border-slate-300 overflow-x-auto">
          {/* Header with logos matching Image 6 */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 gap-4">
            {/* Left Emblem: Kemenag / Islamic */}
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-center text-[10px] p-1 shadow-md shrink-0">
              <Shield className="w-8 h-8 fill-emerald-500 text-white" />
            </div>

            {/* Center title */}
            <div className="text-center space-y-0.5 flex-1">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900">
                DENAH LOKASI TEMPAT DUDUK
              </h2>
              <p className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                KARTU PESERTA UMBK
              </p>
              <h3 className="text-base font-black text-slate-900 uppercase">
                {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'}
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold">
                Tahun Pelajaran 2025/2026
              </p>
            </div>

            {/* Right Emblem: School */}
            <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-center text-[10px] p-1 shadow-md shrink-0">
              <Layers className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          {/* Subheaders & Meja Pengawas matching Image 6 */}
          <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-400">
            {/* Left box: Ruangan & Sesi */}
            <div className="flex gap-2">
              <div className="border border-slate-800 rounded px-3 py-1.5 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-500 block">Ruangan</span>
                <span className="font-bold text-xs">{ruangan === 'ALL' ? '-' : ruangan}</span>
              </div>
              <div className="border border-slate-800 rounded px-3 py-1.5 text-center min-w-[90px]">
                <span className="text-[10px] text-slate-500 block">Sesi</span>
                <span className="font-bold text-xs">{sesi === 'ALL' ? '-' : sesi}</span>
              </div>
            </div>

            {/* Center Podium: MEJA PENGAWAS */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-4 rounded-full bg-slate-800 mb-1" />
              <div className="border-2 border-slate-900 bg-slate-100 px-6 py-1.5 font-bold text-xs uppercase tracking-wider rounded shadow-xs">
                MEJA PENGAWAS
              </div>
            </div>

            {/* Right box: Jumlah & Layout */}
            <div className="flex gap-2">
              <div className="border border-slate-800 rounded px-3 py-1.5 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-500 block">Jumlah</span>
                <span className="font-black text-sm">53</span>
              </div>
              <div className="border border-slate-800 rounded px-3 py-1.5 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-500 block">Layout</span>
                <span className="font-black text-xs font-mono">{kolom}x{baris}</span>
              </div>
            </div>
          </div>

          {/* Grid of student desks (6 columns x 5 rows) matching Image 6 */}
          <div
            className="grid gap-3 pt-6"
            style={{
              gridTemplateColumns: `repeat(${kolom}, minmax(0, 1fr))`,
            }}
          >
            {seatStudents.slice(0, kolom * baris).map((st) => (
              <div
                key={st.no}
                className="border-2 border-slate-900 rounded p-2 text-center flex flex-col items-center justify-between min-h-[140px] bg-slate-50 shadow-xs hover:border-blue-600 transition-colors"
              >
                {/* Red background ID photo matching Image 6 */}
                <div className="w-12 h-16 bg-[#e11d48] rounded shadow-xs flex flex-col items-center justify-center text-white mb-2 shrink-0">
                  <User className="w-7 h-7 opacity-95" />
                </div>

                <div className="w-full">
                  <h4
                    style={{ fontSize: `${fontSize}px` }}
                    className="font-bold uppercase tracking-tight text-slate-900 truncate"
                    title={st.name}
                  >
                    {st.name}
                  </h4>
                  <p className="text-[9px] font-mono text-slate-600 truncate mt-0.5">
                    {st.noPeserta}
                  </p>
                </div>

                {/* Bottom line marker */}
                <div className="w-8 h-1 bg-slate-800 rounded-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
