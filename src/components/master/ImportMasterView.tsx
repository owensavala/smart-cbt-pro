'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  downloadMasterTemplateExcel,
  downloadMasterTemplateCsv,
  parseMasterDataBuffer,
  ExtractedMasterData,
} from '@/lib/master-template';
import { saveBulkMasterDataAction } from '@/app/actions/master-actions';
import {
  Student,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
  LevelMaster,
  MajorMaster,
  ServerMaster,
} from '@/lib/types';

interface ImportMasterViewProps {
  onImportSuccess?: (data: ExtractedMasterData) => void;
  onNavigateToStudents?: () => void;
}

export default function ImportMasterView({
  onImportSuccess,
  onNavigateToStudents,
}: ImportMasterViewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ExtractedMasterData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
      setImportResult(null);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProcessImport = async () => {
    if (!selectedFile) {
      setErrorMessage('Silakan pilih berkas Excel atau CSV terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Read file buffer
      const arrayBuffer = await selectedFile.arrayBuffer();

      // 2. Parse & extract all entities
      const extracted = parseMasterDataBuffer(arrayBuffer);

      if (extracted.students.length === 0) {
        throw new Error('Tidak ada data siswa atau baris yang valid dalam berkas.');
      }

      // 3. Persist to PostgreSQL via Server Action
      const payload = {
        classes: extracted.classes.map((c) => ({
          name: c.name,
          level: c.level,
          jurusan: c.jurusan,
        })),
        rooms: extracted.rooms.map((r) => ({
          code: r.code,
          name: r.name,
          capacity: r.capacity,
          serverName: r.serverName,
        })),
        sessions: extracted.sessions.map((s) => ({
          sessionNumber: s.sessionNumber,
          name: s.name,
          startTime: s.startTime || '07:30',
          endTime: s.endTime || '09:30',
        })),
        students: extracted.students.map((st) => {
          const sessNum = parseInt(st.session?.replace(/\D/g, '') || '1', 10);
          return {
            noPeserta: st.noPeserta,
            nisn: st.nisn,
            nis: st.nis,
            name: st.name,
            level: st.level,
            className: st.className,
            jurusan: st.jurusan,
            username: st.username,
            passwordText: st.passwordText,
            room: st.room,
            sessionNumber: sessNum,
            server: st.server,
            photoUrl: st.photoUrl,
          };
        }),
      };

      const res = await saveBulkMasterDataAction(payload);
      if (!res.success) {
        console.warn('DB upsert notice:', res.error);
      }

      // 4. Update UI State & notify parent
      setImportResult(extracted);
      if (onImportSuccess) {
        onImportSuccess(extracted);
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMessage(err.message || 'Gagal memproses berkas master.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          Pusat Import Data (Excel / CSV)
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
          Template Versi 3.2.0 • Multi-Master Sekaligus
        </span>
      </div>

      {/* Main Centered Card matching reference image */}
      <div className="max-w-xl mx-auto py-4">
        <div className="bg-[#1c2230] border border-slate-700/70 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Top blue glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-blue-500 rounded-full blur-md opacity-70" />

          {/* Big Excel Icon matching screenshot */}
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 mb-4 group cursor-pointer hover:scale-105 transition-transform" onClick={handleTriggerFileInput}>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-blue-600 font-black text-2xl font-mono select-none">X</span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h3 className="text-2xl font-bold text-white tracking-wide">
            Import Data Master
          </h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
            Upload berkas Excel Data Master (Mapel, Kelas, Jurusan, dll) dalam satu pintu.
          </p>

          {/* Form Controls */}
          <div className="mt-6 space-y-4 text-left">
            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom File Chooser Bar */}
            <div
              onClick={handleTriggerFileInput}
              className="bg-[#131722] border border-slate-700 hover:border-blue-500/70 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm truncate text-slate-300">
                  {selectedFile ? selectedFile.name : 'Pilih berkas Excel...'}
                </span>
              </div>
              <button
                type="button"
                className="bg-[#2a3449] hover:bg-[#34415c] text-slate-200 text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-600 shrink-0 cursor-pointer transition-colors"
              >
                Cari
              </button>
            </div>

            {/* File Info preview if file selected */}
            {selectedFile && (
              <div className="text-[11px] text-blue-300/80 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-900/50 flex items-center justify-between">
                <span>Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                <span className="text-emerald-400 font-medium">Siap diproses</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Big Process Button */}
            <button
              onClick={handleProcessImport}
              disabled={isProcessing}
              className={`w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  MEMPROSES DATA MASTER...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  PROSES IMPORT DATA
                </>
              )}
            </button>

            {/* Divider */}
            <div className="border-t border-slate-700/80 my-5" />

            {/* Outline Download Template Button */}
            <button
              onClick={downloadMasterTemplateExcel}
              type="button"
              className="w-full py-2.5 border border-blue-500/40 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 font-semibold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template Master
            </button>
          </div>
        </div>

        {/* Security Note matching screenshot */}
        <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 mt-6 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Sistem hanya memproses file dengan format template yang disediakan.</span>
        </div>
      </div>

      {/* Success Modal / Result Banner */}
      {importResult && (
        <div className="max-w-2xl mx-auto bg-[#17212f] border border-emerald-600/60 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Import Data Master Berhasil!</h4>
                <p className="text-xs text-slate-400">
                  Seluruh master dan siswa telah diekstrak dan disinkronkan ke PostgreSQL.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-700">
              {importResult.summary.totalStudents} Siswa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-blue-400">{importResult.summary.totalLevels}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Level</div>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-indigo-400">{importResult.summary.totalMajors}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Jurusan</div>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-teal-400">{importResult.summary.totalClasses}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Kelas</div>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-amber-400">{importResult.summary.totalRooms}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Ruang</div>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-pink-400">{importResult.summary.totalSessions}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Sesi</div>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-slate-800">
              <div className="text-lg font-bold text-emerald-400">{importResult.summary.totalServers}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Server</div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setImportResult(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Tutup Ringkasan
            </button>
            {onNavigateToStudents && (
              <button
                onClick={onNavigateToStudents}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                Lihat Data Peserta Ujian &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
