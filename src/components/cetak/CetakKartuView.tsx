'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Save,
  Printer,
  CheckCircle2,
  CheckSquare,
  Square,
  X,
  User,
  LayoutGrid,
  Filter,
  School,
  QrCode,
  Download,
} from 'lucide-react';
import { Student, SchoolClass, SchoolBrandingSettings } from '@/lib/types';
import { generateStudentQrSvg } from '@/lib/qrcode';

interface CetakKartuViewProps {
  students?: Student[];
  classes?: SchoolClass[];
  branding?: SchoolBrandingSettings;
}

export default function CetakKartuView({
  students = [],
  classes = [],
  branding,
}: CetakKartuViewProps) {
  const [headerKartu, setHeaderKartu] = useState('KARTU PESERTA UJIAN BERBASIS KOMPUTER (UBK)');
  const [atasKeBawah, setAtasKeBawah] = useState('0');
  const [kiriKeKanan, setKiriKeKanan] = useState('0');
  const [layoutMode, setLayoutMode] = useState<'8_PER_PAGE' | '4_PER_PAGE'>('8_PER_PAGE');

  // Available classes dynamically extracted
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.name));
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    if (set.size === 0) {
      ['VII A', 'VII B', 'VIII A', 'IX A', 'X MIPA 1', 'X MIPA 2', 'X IPS 1', 'VI SD'].forEach((c) => set.add(c));
    }
    return Array.from(set).sort();
  }, [classes, students]);

  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    () => new Set(availableClasses)
  );

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'cbt_kartu_settings',
        JSON.stringify({ headerKartu, atasKeBawah, kiriKeKanan, layoutMode })
      );
    }
    showToast('Parameter tata letak kartu peserta berhasil disimpan!');
  };

  const toggleClass = (clsName: string) => {
    const next = new Set(selectedClasses);
    if (next.has(clsName)) {
      next.delete(clsName);
    } else {
      next.add(clsName);
    }
    setSelectedClasses(next);
  };

  const selectAllClasses = () => setSelectedClasses(new Set(availableClasses));
  const clearAllClasses = () => setSelectedClasses(new Set());

  // Printable students matching selected classes
  const printableStudents = useMemo(() => {
    let list = students.filter((s) => s.className && selectedClasses.has(s.className));
    if (list.length === 0) {
      if (selectedClasses.size === availableClasses.length && students.length > 0) {
        list = students;
      } else {
        // Fallback sample students if no students loaded
        return [
          {
            id: 'demo_1',
            noPeserta: '26-27-04-1-0101-0001',
            name: 'ARJUN',
            nisn: '0129481923',
            nis: '26001',
            className: 'VII A',
            room: 'LAB-01',
            session: 'Sesi 1 (Pagi)',
            username: 'arjun',
            passwordText: '12345678',
          },
          {
            id: 'demo_2',
            noPeserta: '26-27-04-1-0101-0002',
            name: 'ABDUL ADZIM',
            nisn: '3138848262',
            nis: '26002',
            className: 'VII A',
            room: 'LAB-01',
            session: 'Sesi 1 (Pagi)',
            username: 'abdul',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_3',
            noPeserta: '26-27-04-1-0101-0003',
            name: 'AFHIF U SANGADJI',
            nisn: '0133471482',
            nis: '26003',
            className: 'VII A',
            room: 'LAB-02',
            session: 'Sesi 1 (Pagi)',
            username: 'afhif',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_4',
            noPeserta: '26-27-04-1-0101-0004',
            name: 'AHMAD JIBRIL MUHAMMAD',
            nisn: '3139266943',
            nis: '26004',
            className: 'VII B',
            room: 'LAB-01',
            session: 'Sesi 1 (Pagi)',
            username: 'jibril',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_5',
            noPeserta: '26-27-04-1-0101-0005',
            name: 'ALYA ZAHIDAH DAENG MAPATO',
            nisn: '0146882570',
            nis: '26005',
            className: 'VII B',
            room: 'LAB-02',
            session: 'Sesi 2 (Siang)',
            username: 'alya',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_6',
            noPeserta: '26-27-04-1-0101-0006',
            name: 'ANDI MUHAMMAD FAIZ',
            nisn: '3142416183',
            nis: '26006',
            className: 'VIII A',
            room: 'LAB-01',
            session: 'Sesi 1 (Pagi)',
            username: 'faiz',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_7',
            noPeserta: '26-27-04-1-0101-0007',
            name: 'ANNISA NURUL FADHILAH',
            nisn: '3142416184',
            nis: '26007',
            className: 'VIII A',
            room: 'LAB-02',
            session: 'Sesi 2 (Siang)',
            username: 'annisa',
            passwordText: 'siswa123',
          },
          {
            id: 'demo_8',
            noPeserta: '26-27-04-1-0101-0008',
            name: 'ARYA FEBRIANSYAH ASRUL',
            nisn: '3142416185',
            nis: '26008',
            className: 'IX A',
            room: 'LAB-01',
            session: 'Sesi 1 (Pagi)',
            username: 'arya.asrul',
            passwordText: 'siswa123',
          },
        ] as any[];
      }
    }
    return list;
  }, [students, selectedClasses, availableClasses]);

  // Chunk students into pages of 8 (or 4) for exact A4 layout
  const cardsPerPage = layoutMode === '8_PER_PAGE' ? 8 : 4;
  const studentPages = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < printableStudents.length; i += cardsPerPage) {
      pages.push(printableStudents.slice(i, i + cardsPerPage));
    }
    return pages;
  }, [printableStudents, cardsPerPage]);

  return (
    <div className="space-y-5">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          Cetak Kartu Peserta Ujian (Massal A4)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tata letak cetak massal kartu peserta ujian terstandar ANBK dengan Foto, Akun Login, dan QR Code Scannable.
        </p>
      </div>

      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-6">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <span>Parameter Cetak Kartu Peserta</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Parameter</span>
            </button>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Pratinjau &amp; Cetak Massal A4</span>
            </button>
          </div>
        </div>

        {/* Header Kartu Text Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            Judul / Header Kop Kartu Ujian
          </label>
          <input
            type="text"
            value={headerKartu}
            onChange={(e) => setHeaderKartu(e.target.value)}
            placeholder="Contoh: KARTU PESERTA ASESMEN SUMATIF BERBASIS KOMPUTER"
            className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
          />
        </div>

        {/* Layout Mode Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span>Format Cetak Lembar A4</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label
              onClick={() => setLayoutMode('8_PER_PAGE')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                layoutMode === '8_PER_PAGE'
                  ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold'
                  : 'border-slate-800 bg-[#161a25] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                8
              </div>
              <div>
                <p className="text-white text-xs font-bold">8 Kartu / Lembar A4 (Standar Asesmen)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tata letak 2 kolom x 4 baris, hemat kertas &amp; pas di dompet kartu ujian siswa.</p>
              </div>
            </label>

            <label
              onClick={() => setLayoutMode('4_PER_PAGE')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                layoutMode === '4_PER_PAGE'
                  ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold'
                  : 'border-slate-800 bg-[#161a25] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                4
              </div>
              <div>
                <p className="text-white text-xs font-bold">4 Kartu / Lembar A4 (Ukuran Besar)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tata letak 2 kolom x 2 baris, tulisan ekstra besar ramah untuk siswa kelas awal SD.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Filter Kelas Rombel */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-sky-400" />
              <span>Filter Rombel / Kelas yang Dicetak ({selectedClasses.size}/{availableClasses.length} Terpilih)</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAllClasses}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                Pilih Semua
              </button>
              <span className="text-slate-600">&bull;</span>
              <button
                type="button"
                onClick={clearAllClasses}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                Bersihkan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {availableClasses.map((clsName) => {
              const isChecked = selectedClasses.has(clsName);
              return (
                <div
                  key={clsName}
                  onClick={() => toggleClass(clsName)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                    isChecked
                      ? 'border-sky-500 bg-sky-950/40 text-white font-semibold'
                      : 'border-slate-800 bg-[#161a25] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{clsName}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *Jumlah kartu yang siap dicetak: <strong className="text-emerald-400">{printableStudents.length} kartu</strong> ({studentPages.length} lembar A4).
          </p>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[96vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>
                  Pratinjau Lembar A4 ({printableStudents.length} Kartu &bull; {studentPages.length} Lembar A4)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Lembar A4 Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Stylesheet Injection */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-cards-container,
                #printable-cards-container * {
                  visibility: visible;
                }
                #printable-cards-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  background: #ffffff !important;
                  color: #000000 !important;
                  margin: 0;
                  padding: 0;
                }
                .a4-page {
                  page-break-after: always;
                  break-after: page;
                  width: 210mm;
                  min-height: 297mm;
                  padding: 8mm;
                  margin: 0 auto;
                  box-sizing: border-box;
                  background: #ffffff !important;
                }
                .card-item {
                  page-break-inside: avoid;
                  break-inside: avoid;
                  border: 1.5px solid #0f172a !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            ` }} />

            {/* Container Lembar Halaman A4 */}
            <div id="printable-cards-container" className="space-y-6">
              {studentPages.map((pageStudents, pageIdx) => (
                <div
                  key={pageIdx}
                  className="a4-page bg-white text-slate-900 rounded-xl p-4 sm:p-6 shadow-xl border border-slate-300 space-y-4"
                >
                  {/* Watermark/Halaman Info */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-b pb-1">
                    <span>Smart CBT Pro &bull; Lembar Kartu Peserta Ujian</span>
                    <span className="font-bold">Halaman {pageIdx + 1} dari {studentPages.length}</span>
                  </div>

                  {/* Grid 2 Kolom x 4 Baris (atau 2x2) */}
                  <div
                    className={`grid gap-3 ${
                      layoutMode === '8_PER_PAGE' ? 'grid-cols-2' : 'grid-cols-2'
                    }`}
                  >
                    {pageStudents.map((st) => {
                      const qrPayload = JSON.stringify({
                        u: st.username,
                        p: st.passwordText || '12345678',
                        n: st.noPeserta,
                        sch: branding?.schoolName || 'CBT',
                      });
                      const qrSvgString = generateStudentQrSvg(qrPayload, 68);

                      return (
                        <div
                          key={st.id || st.noPeserta}
                          className="card-item bg-white border-2 border-slate-900 rounded-lg p-2.5 shadow-xs text-xs relative flex flex-col justify-between"
                          style={{
                            minHeight: layoutMode === '8_PER_PAGE' ? '64mm' : '120mm',
                          }}
                        >
                          {/* Kop Kartu */}
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-slate-300">
                              {branding?.customLogoUrl ? (
                                <img
                                  src={branding.customLogoUrl}
                                  alt="Logo"
                                  className="w-7 h-7 object-contain"
                                />
                              ) : (
                                <School className="w-5 h-5 text-blue-700" />
                              )}
                            </div>
                            <div className="flex-1 text-center pr-2">
                              <h4 className="text-[9px] font-bold tracking-wider text-slate-600 uppercase leading-none">
                                {headerKartu}
                              </h4>
                              <h3 className="text-xs font-black text-slate-950 uppercase mt-0.5 leading-tight">
                                {branding?.schoolName || 'SMP NEGERI 1 TERNATE'}
                              </h3>
                              <p className="text-[8px] text-slate-500 leading-tight">
                                {branding?.subName || 'Tahun Ajaran 2025/2026'} &bull; NPSN: {branding?.npsn || '60201234'}
                              </p>
                            </div>
                          </div>

                          {/* Body: Foto & Identitas Peserta */}
                          <div className="flex gap-2.5 items-center my-1.5">
                            {/* Kotak Foto 2x3 */}
                            <div className="w-14 h-18 rounded border border-slate-400 bg-slate-100 flex flex-col items-center justify-center text-slate-400 shrink-0 shadow-inner overflow-hidden">
                              {st.photoUrl ? (
                                <img
                                  src={st.photoUrl}
                                  alt={st.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <>
                                  <User className="w-6 h-6 text-slate-400" />
                                  <span className="text-[8px] font-bold text-slate-500 mt-0.5">2 x 3</span>
                                </>
                              )}
                            </div>

                            {/* Data Rinci Siswa */}
                            <div className="space-y-0.5 text-[10px] leading-tight flex-1">
                              <div className="truncate">
                                <span className="text-slate-500">No. Peserta:</span>{' '}
                                <strong className="font-mono text-slate-900">{st.noPeserta}</strong>
                              </div>
                              <div className="truncate">
                                <span className="text-slate-500">Nama:</span>{' '}
                                <strong className="text-slate-950 uppercase">{st.name}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500">NISN / NIS:</span>{' '}
                                <span className="font-mono text-slate-800">{st.nisn} / {st.nis || '-'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Kelas / Ruang:</span>{' '}
                                <strong className="text-blue-800">{st.className || 'VII A'}</strong> / <span>{st.room || 'LAB-01'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Sesi:</span>{' '}
                                <span>{st.session || 'Sesi 1 (Pagi)'}</span>
                              </div>

                              {/* Box Kredensial Login */}
                              <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between font-mono text-[9px] bg-slate-50 px-1.5 py-0.5 rounded">
                                <div>
                                  <span className="text-slate-500">User:</span>{' '}
                                  <strong className="text-blue-700">{st.username}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">Pass:</span>{' '}
                                  <strong className="text-rose-700">{st.passwordText || '12345678'}</strong>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer: Scannable QR Code + Tanda Tangan */}
                          <div className="pt-1.5 border-t border-slate-800 flex items-end justify-between text-[9px]">
                            {/* Real Scannable QR Code */}
                            <div className="flex items-center gap-1.5">
                              <div
                                dangerouslySetInnerHTML={{ __html: qrSvgString }}
                                className="border border-slate-300 rounded p-0.5 shadow-xs"
                                title="Pindai QR untuk Login Instan"
                              />
                              <div className="text-[7.5px] text-slate-500 leading-tight">
                                <span className="font-bold block text-slate-700">QR LOGIN</span>
                                <span>Scan di kamera</span>
                              </div>
                            </div>

                            {/* Tanda Tangan Proktor / Kepala */}
                            <div className="text-right leading-none">
                              <p className="text-[8px] text-slate-600">Kepala Sekolah,</p>
                              <div className="h-4" />
                              <p className="font-bold underline text-[8.5px] text-slate-900">
                                {branding?.kepalaSekolah || 'Drs. H. Ahmad Dahlan, M.Pd.'}
                              </p>
                              <p className="text-[7.5px] text-slate-500 font-mono mt-0.5">
                                NIP. {branding?.nipKepalaSekolah || '197505122000031002'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
