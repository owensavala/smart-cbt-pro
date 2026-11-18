'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { EssayRubric } from '../lib/types';
import { evaluateEssay } from '../lib/essay-evaluator';

export default function EssayGradingSimulator() {
  const [rubric, setRubric] = useState<EssayRubric>({
    idealAnswer:
      'Fotosintesis adalah proses pembentukan zat makanan (glukosa) oleh tumbuhan menggunakan air dan karbon dioksida dengan bantuan sinar matahari dan klorofil, yang melepaskan gas oksigen.',
    maxScore: 20,
    keyPoints: [
      {
        concept: 'Bahan baku: Air (H2O) dan Karbon Dioksida (CO2)',
        weight: 8,
        mandatoryKeywords: ['air', 'karbon dioksida'],
      },
      {
        concept: 'Faktor pembantu: Sinar/cahaya matahari dan zat klorofil',
        weight: 6,
        mandatoryKeywords: ['cahaya', 'klorofil'],
      },
      {
        concept: 'Zat yang dihasilkan: Glukosa/energi dan gas Oksigen (O2)',
        weight: 6,
        mandatoryKeywords: ['glukosa', 'oksigen'],
      },
    ],
  });

  const [studentText, setStudentText] = useState(
    'Tumbuhan memproduksi makanan sendiri dengan cara menyerap air tanah dan menghirup karbon dioksida. Dibantu oleh pancaran sinar matahari dan zat hijau daun (klorofil), tanaman tersebut menghasilkan gula dan melepaskan oksigen ke udara.'
  );

  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateEssay> | null>(() =>
    evaluateEssay(
      'Tumbuhan memproduksi makanan sendiri dengan cara menyerap air tanah dan menghirup karbon dioksida. Dibantu oleh pancaran sinar matahari dan zat hijau daun (klorofil), tanaman tersebut menghasilkan gula dan melepaskan oksigen ke udara.',
      rubric
    )
  );

  const handleRunEvaluation = () => {
    const res = evaluateEssay(studentText, rubric);
    setEvaluation(res);
  };

  const samplePresets = [
    {
      title: 'Jawaban Sangat Bagus (Variasi Sinonim)',
      text: 'Tumbuhan memproduksi makanan sendiri dengan cara menyerap air tanah dan menghirup karbon dioksida. Dibantu oleh pancaran sinar matahari dan zat hijau daun (klorofil), tanaman tersebut menghasilkan gula dan melepaskan oksigen ke udara.',
    },
    {
      title: 'Jawaban Separuh / Parsial',
      text: 'Fotosintesis adalah proses tanaman membuat makanan menggunakan cahaya matahari dan klorofil. Menghasilkan oksigen untuk manusia bernapas.',
    },
    {
      title: 'Jawaban Salah / Ngawur',
      text: 'Tumbuhan bernapas menggunakan daun dan akar di dalam tanah ketika malam hari.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 bg-emerald-600 text-white rounded-lg">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-emerald-950">
              Laboratorium Uji Coba: Penilaian Esai Otomatis (Tanpa API Eksternal)
            </h2>
            <p className="text-xs text-emerald-800">
              Uji bagaimana mesin NLP lokal kita membaca jawaban esai siswa dan mencocokkannya
              dengan konsep kunci guru (termasuk deteksi sinonim) secara instan dan 100% gratis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KOLOM KIRI: INPUT GURU & JAWABAN SISWA */}
        <div className="space-y-5">
          {/* Rubrik Konsep Guru */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" /> Kunci Konsep Guru (Bobot Total: {rubric.maxScore} Poin)
            </h3>

            <div className="space-y-2.5">
              {rubric.keyPoints.map((kp, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Poin #{idx + 1}: {kp.concept}</span>
                    <span className="text-blue-700">{kp.weight} Poin</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kata kunci wajib: <code className="bg-white px-1.5 py-0.5 rounded border text-slate-700">{kp.mandatoryKeywords.join(', ')}</code> (termasuk sinonimnya)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Area Jawaban Siswa */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Jawaban Esai yang Ditulis Siswa:
              </h3>
              <span className="text-[11px] text-slate-400">
                {studentText.trim().split(/\s+/).filter(Boolean).length} Kata
              </span>
            </div>

            {/* Tombol Preset Jawaban */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 flex items-center mr-1">Coba Contoh:</span>
              {samplePresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setStudentText(preset.text)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {preset.title}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              placeholder="Ketik atau tempel jawaban esai siswa di sini..."
              className="w-full text-sm p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
            />

            <button
              onClick={handleRunEvaluation}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Jalankan Penilaian Otomatis Sekarang
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: HASIL KOREKSI INSTAN */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Hasil Penilaian Sistem Otomatis
            </h3>

            {evaluation ? (
              <div className="space-y-4">
                {/* Kartu Skor */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-semibold block">Skor yang Diperoleh</span>
                    <span className="text-3xl font-extrabold text-emerald-900">
                      {evaluation.totalScore}
                      <span className="text-base font-normal text-emerald-700">/{evaluation.maxScore}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold bg-white text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                      {evaluation.percentage}% Penguasaan
                    </span>
                  </div>
                </div>

                {/* Breakdown per Poin */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-600 block">
                    Rincian Pemenuhan Poin Konsep:
                  </span>

                  {evaluation.earnedPoints.map((pt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        pt.isFulfilled
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : pt.score > 0
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                          : 'bg-red-50/50 border-red-200 text-red-950'
                      }`}
                    >
                      <div className="flex justify-between font-semibold items-center">
                        <span className="flex items-center gap-1.5">
                          {pt.isFulfilled ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          )}
                          Poin #{i + 1}
                        </span>
                        <span>
                          {pt.score} / {pt.maxScore} Poin
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80">{pt.concept}</p>
                      <div className="pt-1 text-[11px] font-medium border-t border-slate-200/40">
                        {pt.reason}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ulasan Kesimpulan */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="block text-slate-500 mb-0.5">Umpan Balik Siswa:</strong>
                  {evaluation.feedback}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Klik tombol &quot;Jalankan Penilaian Otomatis&quot; untuk melihat hasil koreksi.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Penilaian diproses secara instan (&lt; 5 milidetik) di server lokal.
          </div>
        </div>
      </div>
    </div>
  );
}
