'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Edit3,
  Trash2,
  Info,
  CheckCircle2,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { ExamSchedule, SchoolBrandingSettings } from '@/lib/types';

interface BeritaAcaraRecord {
  id: string;
  jadwalUjian: string;
  mataPelajaran: string;
  sesi: number;
  ruang: string;
  tanggal: string;
  terdaftar: number;
  hadir: number;
  tidakHadir: number;
  catatan: string;
  namaPengawas: string;
  nipPengawas: string;
}

interface BeritaAcaraViewProps {
  schedules?: ExamSchedule[];
  branding?: SchoolBrandingSettings;
}

export default function BeritaAcaraView({
  schedules = [],
  branding,
}: BeritaAcaraViewProps) {
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeItem, setActiveItem] = useState<BeritaAcaraRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Exact data from reference screenshot (Image 7)
  const [beritaAcaraList, setBeritaAcaraList] = useState<BeritaAcaraRecord[]>([
    {
      id: 'ba_1',
      jadwalUjian: 'QUHA-KLS-VI-1',
      mataPelajaran: "AL-QUR'AN HADITS",
      sesi: 1,
      ruang: 'R_3',
      tanggal: '04/05/2026',
      terdaftar: 53,
      hadir: 52,
      tidakHadir: 1,
      catatan: 'Ujian berlangsung tertib, aman, dan lancar tanpa gangguan teknis.',
      namaPengawas: 'Ust. Nurhamza Gani, S.Ag',
      nipPengawas: '198203152008011015',
    },
    {
      id: 'ba_2',
      jadwalUjian: 'PKN-KLS-VI-1',
      mataPelajaran: 'PENDIDIKAN KEWARGANEGARAAN',
      sesi: 1,
      ruang: 'R_3',
      tanggal: '04/05/2026',
      terdaftar: 53,
      hadir: 52,
      tidakHadir: 1,
      catatan: 'Seluruh peserta hadir tepat waktu dan login tanpa hambatan token.',
      namaPengawas: 'Dermawan Surya Kencana, S.Sos',
      nipPengawas: '198504222010011022',
    },
    {
      id: 'ba_3',
      jadwalUjian: 'SOSIOLOGI KELAS X IPS',
      mataPelajaran: 'SOSIOLOGI',
      sesi: 1,
      ruang: 'R_3',
      tanggal: '05/05/2026',
      terdaftar: 53,
      hadir: 53,
      tidakHadir: 0,
      catatan: 'Kehadiran 100%, sistem CBT sinkronisasi otomatis berjalan normal.',
      namaPengawas: 'Hadiyah Toatubun, A.Ma',
      nipPengawas: '198906102014022001',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCetak = (item: BeritaAcaraRecord) => {
    setActiveItem(item);
    setShowPrintModal(true);
  };

  const handleHapus = (id: string, mapel: string) => {
    if (confirm(`Hapus dokumen Berita Acara untuk ujian ${mapel}?`)) {
      setBeritaAcaraList((prev) => prev.filter((b) => b.id !== id));
      showToast(`Berita Acara ${mapel} berhasil dihapus.`);
    }
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
          Pilih Jadwal untuk Berita Acara
        </h1>
      </div>

      {/* Card Top: Pilih Jadwal matching Image 7 */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <FileText className="w-4 h-4 text-slate-300" />
          <span>Pilih Jadwal</span>
        </div>

        <div className="space-y-1.5 max-w-md">
          <label className="block text-xs font-bold text-slate-300">
            Jadwal Ujian
          </label>
          <select
            value={selectedJadwal}
            onChange={(e) => setSelectedJadwal(e.target.value)}
            className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">Pilih Jadwal</option>
            <option value="QUHA-KLS-VI-1">QUHA-KLS-VI-1 (AL-QUR'AN HADITS)</option>
            <option value="PKN-KLS-VI-1">PKN-KLS-VI-1 (PENDIDIKAN KEWARGANEGARAAN)</option>
            <option value="SOSIOLOGI KELAS X IPS">SOSIOLOGI KELAS X IPS (SOSIOLOGI)</option>
            <option value="BINDO-KLS-VI-1">BINDO-KLS-VI-1 (BAHASA INDONESIA)</option>
          </select>
        </div>

        {/* Amber Alert Box matching Image 7 */}
        <div className="bg-[#1e2330] border-l-4 border-amber-500 rounded-r-lg p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
            <Info className="w-4 h-4" />
            <span>Informasi</span>
          </div>
          <p className="text-xs text-slate-300">
            Silakan pilih jadwal ujian terlebih dahulu untuk melakukan pengaturan
            Berita Acara sebelum mencetak.
          </p>
        </div>
      </div>

      {/* Card Bottom: Daftar Berita Acara Yang Sudah Dibuat matching Image 7 */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
          <FileText className="w-4 h-4 text-slate-300" />
          <span>Daftar Berita Acara Yang Sudah Dibuat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-4">JADWAL UJIAN</th>
                <th className="py-3 px-4">MATA PELAJARAN</th>
                <th className="py-3 px-3 text-center">SESI</th>
                <th className="py-3 px-3 text-center">RUANG</th>
                <th className="py-3 px-4 text-center">TANGGAL</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {beritaAcaraList.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {item.jadwalUjian}
                  </td>
                  <td className="py-3 px-4 uppercase text-slate-300 font-semibold">
                    {item.mataPelajaran}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-sky-400">
                    {item.sesi}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {item.ruang}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {item.tanggal}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => showToast(`Edit form Berita Acara ${item.jadwalUjian}`)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleCetak(item)}
                        className="px-2.5 py-1 bg-[#0284c7] hover:bg-sky-500 text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak</span>
                      </button>
                      <button
                        onClick={() => handleHapus(item.id, item.mataPelajaran)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Document Modal for Berita Acara */}
      {showPrintModal && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Format Resmi: Berita Acara Pelaksanaan Ujian (BA-CBT)</span>
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
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document sheet */}
            <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl font-sans text-xs space-y-4">
              <div className="text-center pb-3 border-b-2 border-slate-900 space-y-1">
                <h2 className="text-sm font-bold uppercase">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h2>
                <h3 className="text-base font-black uppercase">
                  {branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'}
                </h3>
                <p className="text-xs font-bold uppercase">
                  BERITA ACARA PELAKSANAAN UJIAN MADRASAH BERBASIS KOMPUTER (UMBK)
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  TAHUN PELAJARAN 2025/2026
                </p>
              </div>

              <div className="space-y-3 leading-relaxed text-justify">
                <p>
                  Pada hari ini <strong>Senin</strong> tanggal <strong>04</strong> bulan <strong>Mei</strong> tahun <strong>2026</strong>, bertempat di:
                </p>
                <div className="pl-6 space-y-1">
                  <div>Nama Sekolah : <strong>{branding?.schoolName || 'SMA INTEGRAL HIDAYATULLAH'}</strong></div>
                  <div>Ruangan : <strong>{activeItem.ruang}</strong> | Sesi : <strong>{activeItem.sesi}</strong></div>
                  <div>Mata Pelajaran : <strong>{activeItem.mataPelajaran}</strong> ({activeItem.jadwalUjian})</div>
                  <div>Waktu Ujian : <strong>07.30 - 09.30 WIT</strong></div>
                </div>

                <p>
                  Telah diselenggarakan Ujian Madrasah Berbasis Komputer (UMBK) dengan rincian data peserta sebagai berikut:
                </p>

                <div className="pl-6 space-y-1">
                  <div>1. Jumlah Peserta Terdaftar : <strong>{activeItem.terdaftar} Siswa</strong></div>
                  <div>2. Jumlah Peserta Hadir : <strong>{activeItem.hadir} Siswa</strong></div>
                  <div>3. Jumlah Peserta Tidak Hadir : <strong>{activeItem.tidakHadir} Siswa</strong></div>
                </div>

                <div className="pt-2">
                  <p className="font-bold mb-1">Catatan Selama Pelaksanaan Ujian:</p>
                  <div className="border border-slate-400 rounded p-3 bg-slate-50 min-h-[60px]">
                    {activeItem.catatan}
                  </div>
                </div>

                <p>
                  Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>
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
                  <p>Pengawas Ruang,</p>
                  <div className="h-20" />
                  <p className="font-bold underline">{activeItem.namaPengawas}</p>
                  <p className="font-mono text-slate-600">NIP. {activeItem.nipPengawas}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
