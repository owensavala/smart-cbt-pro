'use client';

import React, { useState } from 'react';
import {
  X,
  Cpu,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  BookOpen,
  Award,
  ListFilter,
  Check,
} from 'lucide-react';

interface AiEssaySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiEssaySimulatorModal({ isOpen, onClose }: AiEssaySimulatorModalProps) {
  // Preset Questions
  const PRESET_QUESTIONS = [
    {
      level: 'SD (Kelas 5-6)',
      title: 'Fotosintesis Tumbuhan',
      prompt: 'Jelaskan bagaimana proses fotosintesis pada tumbuhan hijau terjadi dan sebutkan zat yang dihasilkan!',
      idealAnswer: 'Fotosintesis adalah proses tumbuhan hijau membuat makanan (glukosa) dengan bantuan sinar matahari dan klorofil dari air dan karbon dioksida, serta menghasilkan gas oksigen.',
      maxScore: 20,
      keyPoints: [
        { concept: 'Klorofil & Sinar Matahari', weight: 8, mandatoryKeywords: ['klorofil', 'matahari'] },
        { concept: 'Hasil Fotosintesis (Oksigen & Glukosa)', weight: 12, mandatoryKeywords: ['oksigen', 'glukosa', 'makanan'] },
      ],
      demoAnswers: [
        { label: 'Jawaban Lengkap (Nilai Tinggi)', text: 'Proses fotosintesis terjadi pada daun yang memiliki zat klorofil dengan bantuan sinar matahari. Tumbuhan mengolah air dan karbon dioksida sehingga menghasilkan energi glukosa dan melepaskan gas oksigen ke udara.' },
        { label: 'Jawaban Sebagian', text: 'Tumbuhan menggunakan sinar matahari dan klorofil untuk hidup dan bernapas.' },
        { label: 'Jawaban dengan Typo / Salah Ketik', text: 'Tumbuhan berfotosintesa dengan kloropil dan sinar mentari menghasilkan oksigen.' },
        { label: 'Jawaban Negasi / Kontradiksi', text: 'Tumbuhan tidak menghasilkan oksigen dan tanpa klorofil saat siang hari.' },
      ]
    },
    {
      level: 'SMP (Kelas 7-9)',
      title: 'Sistem Pernapasan & Alveolus',
      prompt: 'Jelaskan fungsi alveolus dalam sistem pernapasan manusia dan bagaimana proses difusi gas terjadi di dalamnya!',
      idealAnswer: 'Alveolus berfungsi sebagai tempat pertukaran gas antara oksigen dari udara pernapasan ke pembuluh darah kapiler dan karbon dioksida dari darah dilepaskan keluar melalui proses difusi.',
      maxScore: 25,
      keyPoints: [
        { concept: 'Fungsi Utama Alveolus', weight: 10, mandatoryKeywords: ['alveolus', 'pertukaran', 'pernapasan'] },
        { concept: 'Mekanisme Difusi O2 & CO2', weight: 15, mandatoryKeywords: ['oksigen', 'karbon dioksida', 'darah'] },
      ],
      demoAnswers: [
        { label: 'Jawaban Lengkap (Nilai Tinggi)', text: 'Alveolus adalah kantung udara di paru-paru yang berfungsi melakukan pertukaran gas. Gas oksigen berdifusi masuk ke dalam aliran darah kapiler, sementara zat karbon dioksida dari darah dikeluarkan saat menghembuskan napas.' },
        { label: 'Jawaban Singkat', text: 'Alveolus tempat bertukarnya oksigen dan karbondioksida di paru-paru.' },
      ]
    },
    {
      level: 'SMA (Kelas 10-12)',
      title: 'Sejarah: Perang Diponegoro (1825-1830)',
      prompt: 'Analisislah penyebab utama meletusnya Perang Diponegoro antara tahun 1825 hingga 1830 di Pulau Jawa!',
      idealAnswer: 'Perang Diponegoro dipicu oleh faktor mendalam seperti campur tangan pemerintah kolonial Belanda dalam urusan keraton Yogyakarta, beban pajak tanah yang menindas rakyat, serta pemicu khusus pemasangan patok jalan oleh Belanda yang melintasi makam leluhur Pangeran Diponegoro di Tegalrejo.',
      maxScore: 30,
      keyPoints: [
        { concept: 'Intervensi Kolonial & Beban Pajak', weight: 14, mandatoryKeywords: ['belanda', 'pajak', 'penyebab', 'keraton'] },
        { concept: 'Pemasangan Patok Makam Leluhur', weight: 16, mandatoryKeywords: ['patok', 'makam', 'diponegoro', 'tegalrejo'] },
      ],
      demoAnswers: [
        { label: 'Jawaban Lengkap (Nilai Tinggi)', text: 'Penyebab perang dipicu oleh kesewenang-wenangan penjajah Belanda yang membebani rakyat dengan berbagai macam pajak. Pemicu utamanya adalah ketika Belanda memasang patok proyek jalan yang menembus tanah makam leluhur Diponegoro tanpa izin.' },
      ]
    }
  ];

  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const selectedPreset = PRESET_QUESTIONS[selectedPresetIdx];

  const [studentAnswerInput, setStudentAnswerInput] = useState(selectedPreset.demoAnswers[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setStudentAnswerInput(PRESET_QUESTIONS[idx].demoAnswers[0].text);
    setEvaluationResult(null);
  };

  const handleEvaluate = async () => {
    if (!studentAnswerInput.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/evaluate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentAnswer: studentAnswerInput,
          rubric: {
            idealAnswer: selectedPreset.idealAnswer,
            maxScore: selectedPreset.maxScore,
            keyPoints: selectedPreset.keyPoints,
          }
        }),
      });

      const data = await res.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error('Evaluasi esai gagal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#121622] border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-extrabold tracking-wide flex items-center gap-2">
                <span>Simulator Penilaian Esai AI / NLP Python Gratis</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold">
                  100% Offline & Free
                </span>
              </h2>
              <p className="text-xs text-teal-200">
                Uji coba langsung bagaimana kecerdasan buatan NLP lokal menilai jawaban uraian secara objektif.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300">
          {/* Preset Jenjang Selector */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">
              Pilih Contoh Soal Berdasarkan Jenjang Pendidikan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_QUESTIONS.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPresetIdx === idx
                      ? 'bg-teal-950/60 border-teal-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-extrabold text-[10px] uppercase">
                    {pq.level}
                  </span>
                  <strong className="block text-xs font-bold text-slate-200 mt-1">{pq.title}</strong>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{pq.prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pertanyaan & Rubrik Preview */}
          <div className="bg-[#181d29] border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wide block">Pertanyaan:</span>
              <p className="text-sm font-semibold text-white">{selectedPreset.prompt}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wide block">Kunci / Jawaban Ideal Guru:</span>
              <p className="text-xs text-slate-300 italic">{selectedPreset.idealAnswer}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-400">Kata Kunci Wajib:</span>
              {selectedPreset.keyPoints.flatMap(kp => kp.mandatoryKeywords).map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono font-bold">
                  {kw}
                </span>
              ))}
              <span className="ml-auto text-amber-400 font-bold">Maks: {selectedPreset.maxScore} Poin</span>
            </div>
          </div>

          {/* Quick Demo Student Answer Buttons */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-xs font-bold text-white">Jawaban Siswa yang Diuji:</label>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-slate-400">Coba Kasus:</span>
                {selectedPreset.demoAnswers.map((da, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setStudentAnswerInput(da.text);
                      setEvaluationResult(null);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold cursor-pointer border border-slate-700"
                  >
                    {da.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={studentAnswerInput}
              onChange={(e) => setStudentAnswerInput(e.target.value)}
              rows={4}
              placeholder="Ketik jawaban siswa di sini..."
              className="w-full bg-[#161a24] border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-hidden focus:border-teal-500 font-sans"
            />
          </div>

          {/* Evaluate Action Button */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Diproses menggunakan Python 3.12 NLP (TF-IDF, Cosine Similarity & Fuzzy Typo)
            </span>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isLoading || !studentAnswerInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Menganalisis Jawaban...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Uji Penilaian AI Sekarang</span>
                </>
              )}
            </button>
          </div>

          {/* Evaluation Result View */}
          {evaluationResult && (
            <div className="bg-[#181d29] border border-emerald-500/40 rounded-2xl p-5 space-y-4 animate-fadeIn shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                    Hasil Analisis AI Berhasil
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    Skor: <span className="text-emerald-400">{evaluationResult.finalScore}</span> / {evaluationResult.maxScore} Poin ({evaluationResult.percentage}%)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Engine: <strong className="text-teal-300">{evaluationResult.engine}</strong> • Kemiripan Semantik: {Math.round((evaluationResult.cosineSimilarity || 0.7) * 100)}%
                  </span>
                </div>

                <div className="w-24 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-400 block">Predikat</span>
                  <span className={`text-base font-black ${evaluationResult.percentage >= 75 ? 'text-emerald-400' : evaluationResult.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {evaluationResult.percentage >= 85 ? 'Sangat Baik' : evaluationResult.percentage >= 70 ? 'Baik' : evaluationResult.percentage >= 50 ? 'Cukup' : 'Kurang'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, evaluationResult.percentage))}%` }}
                />
              </div>

              {/* Keyword Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Kata Kunci Ditemukan ({evaluationResult.matchedKeywords?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(evaluationResult.matchedKeywords || []).map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono text-[11px] font-bold">
                        ✓ {kw}
                      </span>
                    ))}
                    {(evaluationResult.matchedKeywords || []).length === 0 && (
                      <span className="text-slate-500 italic text-[11px]">Tidak ada kata kunci yang cocok</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Kata Kunci Belum Disebut ({evaluationResult.missingKeywords?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(evaluationResult.missingKeywords || []).map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 font-mono text-[11px] font-semibold">
                        ✗ {kw}
                      </span>
                    ))}
                    {(evaluationResult.missingKeywords || []).length === 0 && (
                      <span className="text-emerald-400 italic text-[11px]">Semua kata kunci utama lengkap!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pedagogical Feedback */}
              <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-1">
                <strong className="text-amber-400 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Umpan Balik Pedagogis untuk Siswa:
                </strong>
                <p className="text-slate-200 leading-relaxed">{evaluationResult.pedagogicalFeedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0e121a] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Smart CBT • AI Natural Language Processing untuk Asesmen Sekolah</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
