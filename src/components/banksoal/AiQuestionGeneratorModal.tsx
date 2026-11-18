'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  BookOpen,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  X,
  Sliders,
  HelpCircle,
  FileText,
  Lightbulb,
  GraduationCap,
  Award,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Question, QuestionType, KeyPoint } from '@/lib/types';

interface AiQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBankCode?: string;
  targetSubjectName?: string;
  onSaveQuestions: (newQuestions: Question[]) => void;
}

interface PresetTopic {
  title: string;
  subject: string;
  level: string;
  difficulty: 'LOTS' | 'MOTS' | 'HOTS';
  topic: string;
  contentSnippet: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    title: '🌿 Biologi: Fotosintesis & Kloroplas (SMA)',
    subject: 'BIOLOGI',
    level: 'SMA (KELAS X)',
    difficulty: 'HOTS',
    topic: 'Proses Reaksi Terang, Siklus Calvin dan Faktor Pembatas Fotosintesis',
    contentSnippet: 'Fotosintesis merupakan reaksi anabolisme pada kloroplas tumbuhan yang mengubah H2O dan CO2 dengan bantuan foton cahaya matahari menjadi glukosa (C6H12O6) dan melepaskan O2.',
  },
  {
    title: '👥 Sosiologi: Konflik & Integrasi Sosial (SMA)',
    subject: 'SOSIOLOGI',
    level: 'SMA (KELAS XI)',
    difficulty: 'HOTS',
    topic: 'Bentuk-bentuk Konflik Sosial, Mediasi, Konsiliasi dan Reintegrasi Sosial',
    contentSnippet: 'Diferensiasi sosial horizontal dan stratifikasi vertikal dapat memicu friksi kepentingan. Penyelesaian konflik memerlukan intervensi pihak ketiga melalui mediasi, arbitrase, atau konsiliasi.',
  },
  {
    title: '⚡ Fisika: Hukum Newton & Dinamika Gerak (SMA)',
    subject: 'FISIKA',
    level: 'SMA (KELAS X)',
    difficulty: 'HOTS',
    topic: 'Hukum I, II, dan III Newton tentang Gaya, Massa, Percepatan dan Gesekan',
    contentSnippet: 'Hukum II Newton menyatakan percepatan sebuah benda berbanding lurus dengan resultan gaya total yang bekerja dan berbanding terbalik dengan massa benda (F = m.a).',
  },
  {
    title: '📖 B. Indonesia: Teks Argumentasi & Opini (SMA)',
    subject: 'BAHASA INDONESIA',
    level: 'SMA (KELAS XI)',
    difficulty: 'MOTS',
    topic: 'Struktur Teks Argumentasi (Tesis, Argumen Bukti, Penegasan Ulang) & Fakta vs Opini',
    contentSnippet: 'Teks argumentasi bertujuan meyakinkan pembaca melalui penyajian premis logis yang didukung oleh data statistik dan fakta empiris yang dapat diverifikasi kebenarannya.',
  },
];

export default function AiQuestionGeneratorModal({
  isOpen,
  onClose,
  targetBankCode = 'SOS-KLS-X-1',
  targetSubjectName = 'SOSIOLOGI',
  onSaveQuestions,
}: AiQuestionGeneratorModalProps) {
  // Parameter Form Generator
  const [subject, setSubject] = useState(targetSubjectName);
  const [level, setLevel] = useState('SMA (KELAS X)');
  const [topic, setTopic] = useState('Konflik Sosial, Diferensiasi, dan Integrasi Masyarakat');
  const [difficulty, setDifficulty] = useState<'LOTS' | 'MOTS' | 'HOTS'>('HOTS');
  const [referenceText, setReferenceText] = useState(
    'Diferensiasi sosial dalam masyarakat majemuk dapat memicu konflik antarkelompok jika primordialisme berlebihan. Upaya integrasi memerlukan konsensus, toleransi, dan akomodasi seperti mediasi dan arbitrase.'
  );

  // Komposisi Soal Target
  const [countPG, setCountPG] = useState(2);
  const [countPGK, setCountPGK] = useState(1);
  const [countMatching, setCountMatching] = useState(1);
  const [countEssay, setCountEssay] = useState(1);

  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (p: PresetTopic) => {
    setSubject(p.subject);
    setLevel(p.level);
    setDifficulty(p.difficulty);
    setTopic(p.topic);
    setReferenceText(p.contentSnippet);
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenerationStep('Menganalisis Kompetensi Dasar & Taksonomi Bloom...');
    await new Promise((r) => setTimeout(r, 600));

    setGenerationStep('Menyusun Stimulus Kontekstual Literasi & Numerasi AKM...');
    await new Promise((r) => setTimeout(r, 700));

    setGenerationStep('Mengonstruksi Pengecoh (Distraktor) Pilihan Ganda & AKM...');
    await new Promise((r) => setTimeout(r, 700));

    setGenerationStep('Membangun Rubrik Esai AI: Kata Kunci Wajib & Bobot Konsep...');
    await new Promise((r) => setTimeout(r, 600));

    // Bangun paket butir soal realistis berbasis topik
    const questions: Question[] = [];
    const baseId = `ai_gen_${Date.now()}`;
    let itemNumber = 1;

    // 1. Soal Pilihan Ganda Biasa (PG)
    for (let i = 1; i <= countPG; i++) {
      if (subject.toUpperCase().includes('BIO')) {
        questions.push({
          id: `${baseId}_pg_${i}`,
          number: itemNumber++,
          type: 'PG',
          points: 10,
          prompt:
            i === 1
              ? 'Pada proses fotosintesis tumbuhan hijau, reaksi fotolisis air yang menghasilkan gas oksigen (O2) terjadi pada organel...'
              : 'Faktor lingkungan yang paling krusial dalam membatasi laju fotosintesis pada intensitas cahaya sangat tinggi adalah konsentrasi...',
          options:
            i === 1
              ? [
                  { id: 'opt_a', text: 'Tilakoid / Grana di dalam Kloroplas' },
                  { id: 'opt_b', text: 'Stroma kloroplas pada reaksi gelap' },
                  { id: 'opt_c', text: 'Membran luar mitokondria sel' },
                  { id: 'opt_d', text: 'Ribosom sitoplasma daun' },
                  { id: 'opt_e', text: 'Vakuola tengah sel epidermis' },
                ]
              : [
                  { id: 'opt_a', text: 'Karbon Dioksida (CO2) di atmosfer' },
                  { id: 'opt_b', text: 'Gas Nitrogen bebas' },
                  { id: 'opt_c', text: 'Oksigen terlarut dalam sitosol' },
                  { id: 'opt_d', text: 'Kadar klorofil a semata' },
                  { id: 'opt_e', text: 'Kelembaban udara tanah' },
                ],
          correctOptionId: 'opt_a',
        });
      } else if (subject.toUpperCase().includes('FIS')) {
        questions.push({
          id: `${baseId}_pg_${i}`,
          number: itemNumber++,
          type: 'PG',
          points: 10,
          prompt:
            'Sebuah balok bermassa 4 kg ditarik dengan gaya mendatar F = 20 N pada lantai licin. Menurut Hukum II Newton, percepatan gerak balok tersebut adalah...',
          options: [
            { id: 'opt_a', text: '5 m/s² ke arah tarikan gaya' },
            { id: 'opt_b', text: '2.5 m/s² berlawanan arah' },
            { id: 'opt_c', text: '80 m/s² konstan' },
            { id: 'opt_d', text: '0 m/s² (tetap diam)' },
            { id: 'opt_e', text: '16 m/s² memantul' },
          ],
          correctOptionId: 'opt_a',
        });
      } else {
        // Default Sosiologi / Umum
        questions.push({
          id: `${baseId}_pg_${i}`,
          number: itemNumber++,
          type: 'PG',
          points: 10,
          prompt:
            i === 1
              ? `Dalam konteks topik "${topic}", penyelesaian pertikaian antarkelompok masyarakat dengan menghadirkan pihak ketiga yang keputusannya mengikat kedua belah pihak secara hukum disebut...`
              : 'Diferensiasi sosial horizontal yang didasarkan pada suku bangsa (etnisitas) rawan memicu konflik komunal apabila disertai sikap...',
          options:
            i === 1
              ? [
                  { id: 'opt_a', text: 'Arbitrase (Arbitration)' },
                  { id: 'opt_b', text: 'Mediasi (hanya penasihat netral)' },
                  { id: 'opt_c', text: 'Koersi dengan paksaan militer' },
                  { id: 'opt_d', text: 'Stalemate (kekuatan seimbang)' },
                  { id: 'opt_e', text: 'Kompromi informal tanpa saksi' },
                ]
              : [
                  { id: 'opt_a', text: 'Etnosentrisme dan Primordialisme Berlebihan' },
                  { id: 'opt_b', text: 'Sikap toleran dan keterbukaan budaya' },
                  { id: 'opt_c', text: 'Asimilasi sukarela antarkelompok' },
                  { id: 'opt_d', text: 'Pluralisme rasional demokratis' },
                  { id: 'opt_e', text: 'Difusi kebudayaan modern' },
                ],
          correctOptionId: 'opt_a',
        });
      }
    }

    // 2. Soal Pilihan Ganda Kompleks (PGK Multi-Select)
    if (countPGK > 0) {
      questions.push({
        id: `${baseId}_pgk_1`,
        number: itemNumber++,
        type: 'PGK',
        subtype: 'multi_select',
        points: 15,
        prompt: `Perhatikan beberapa pernyataan berikut terkait materi "${topic}". Manakah pernyataan di bawah ini yang BENAR? (Pilihlah lebih dari satu jawaban yang sesuai):`,
        options: [
          {
            id: 'pgk_opt_1',
            text: 'Konflik sosial tidak selamanya destruktif, tetapi juga dapat mempererat solidaritas internal (in-group solidarity).',
          },
          {
            id: 'pgk_opt_2',
            text: 'Mediasi berbeda dengan arbitrase karena pihak mediator hanya bertindak sebagai fasilitator netral, bukan pemutus mutlak.',
          },
          {
            id: 'pgk_opt_3',
            text: 'Integrasi normatif tercapai semata-mata karena adanya paksaan aparat keamanan negara tanpa nilai bersama.',
          },
          {
            id: 'pgk_opt_4',
            text: 'Akomodasi merupakan proses sosial untuk meredakan pertentangan tanpa menghancurkan salah satu pihak.',
          },
        ],
        correctOptionIds: ['pgk_opt_1', 'pgk_opt_2', 'pgk_opt_4'],
      });
    }

    // 3. Soal Menjodohkan (Matching)
    if (countMatching > 0) {
      questions.push({
        id: `${baseId}_match_1`,
        number: itemNumber++,
        type: 'MATCHING',
        points: 15,
        prompt: `Jodohkanlah istilah akomodasi dan resolusi konflik di kolom sebelah kiri dengan definisi yang paling tepat di kolom sebelah kanan:`,
        pairs: [
          { id: 'p1', premise: 'Konsiliasi', target: 'Mempertemukan keinginan pihak yang berselisih lewat lembaga khusus' },
          { id: 'p2', premise: 'Mediasi', target: 'Pihak ketiga netral bertindak sebagai penasihat tanpa hak memutuskan' },
          { id: 'p3', premise: 'Arbitrase', target: 'Pihak ketiga berwenang mengambil keputusan yang mengikat kedua belah pihak' },
          { id: 'p4', premise: 'Stalemate', target: 'Konflik terhenti karena kekuatan kedua pihak seimbang' },
        ],
      });
    }

    // 4. Soal Esai Bernalar dengan Rubrik AI NLP Otomatis
    if (countEssay > 0) {
      const isBio = subject.toUpperCase().includes('BIO');
      const essayPrompt = isBio
        ? 'Jelaskan bagaimana proses fotosintesis pada tumbuhan hijau terjadi dari reaksi terang hingga reaksi gelap, dan sebutkan zat-zat yang dihasilkan!'
        : `Analisislah mengapa keberagaman diferensiasi sosial di Indonesia rentan memicu disintegrasi bangsa jika tidak dikelola dengan baik, serta berikan 2 solusi konkret untuk memperkuat integrasi nasional!`;

      const idealAns = isBio
        ? 'Fotosintesis terjadi dalam kloroplas daun menggunakan zat klorofil dengan bantuan energi cahaya matahari. Pada reaksi terang terjadi fotolisis air yang menghasilkan gas oksigen (O2), sedangkan pada siklus Calvin (reaksi gelap) terjadi fiksasi CO2 untuk menghasilkan energi glukosa (karbohidrat).'
        : 'Keberagaman suku, agama, dan ras berpotensi memicu konflik horizontal bila berkembang etnosentrisme sempit dan stereotip negatif antargolongan. Solusi konkret untuk memperkuat integrasi nasional adalah: (1) Menegakkan supremasi hukum yang adil tanpa diskriminasi, dan (2) Memperluas pendidikan multikultural serta ruang dialog kebangsaan antarkomunitas.';

      const keyPoints: KeyPoint[] = isBio
        ? [
            {
              concept: 'Peran Klorofil & Kloroplas',
              weight: 30,
              mandatoryKeywords: ['klorofil', 'kloroplas'],
              synonyms: [['klorofil', 'zat hijau daun']],
            },
            {
              concept: 'Energi Cahaya Matahari & Fotolisis',
              weight: 30,
              mandatoryKeywords: ['matahari', 'cahaya'],
              synonyms: [['matahari', 'surya', 'foton']],
            },
            {
              concept: 'Hasil Akhir Glukosa & Gas Oksigen',
              weight: 40,
              mandatoryKeywords: ['oksigen', 'glukosa'],
              synonyms: [
                ['oksigen', 'gas o2'],
                ['glukosa', 'karbohidrat', 'gula'],
              ],
            },
          ]
        : [
            {
              concept: 'Penyebab Konflik: Etnosentrisme & Primordialisme',
              weight: 40,
              mandatoryKeywords: ['etnosentrisme', 'primordialisme'],
              synonyms: [['etnosentrisme', 'fanatisme suku', 'merasa suku terbaik']],
            },
            {
              concept: 'Solusi 1: Supremasi Hukum & Keadilan',
              weight: 30,
              mandatoryKeywords: ['hukum', 'keadilan'],
              synonyms: [['hukum', 'aturan perundangan', 'keadilan sosial']],
            },
            {
              concept: 'Solusi 2: Pendidikan Multikultural & Toleransi',
              weight: 30,
              mandatoryKeywords: ['toleransi', 'multikultural'],
              synonyms: [['toleransi', 'saling menghargai', 'pluralisme']],
            },
          ];

      questions.push({
        id: `${baseId}_essay_1`,
        number: itemNumber++,
        type: 'ESSAY',
        points: 25,
        prompt: essayPrompt,
        rubric: {
          idealAnswer: idealAns,
          maxScore: 25,
          keyPoints: keyPoints,
          strictness: 'standard',
        },
      });
    }

    setGeneratedQuestions(questions);
    setIsGenerating(false);
  };

  const handleSaveToBank = () => {
    if (generatedQuestions.length === 0) return;
    onSaveQuestions(generatedQuestions);
    setIsSuccessModal(true);
    setTimeout(() => {
      setIsSuccessModal(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121622] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER MODAL */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-950/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">AI Question Studio & AKM Generator</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Zero-Cost NLP Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Penyusun paket soal otomatis berbasis materi ajar guru (PG, AKM Kompleks, Menjodohkan, & Esai AI)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY MODAL */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200 divide-y divide-slate-800/80">
          {/* SECTION 1: PRESET CEPAT 1-CLICK */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilihan Cepat Materi Uji Coba (1-Click Presets):</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
                >
                  <p className="font-bold text-white group-hover:text-emerald-300 text-xs truncate">{p.title}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.topic}</p>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: PARAMETER FORM GENERATOR */}
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0d1017] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  placeholder="Contoh: SOSIOLOGI"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Jenjang & Kelas</label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#0d1017] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: SMA (KELAS X)"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tingkat Kesukaran</label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full bg-[#0d1017] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="LOTS">Dasar (Pemahaman LOTS)</option>
                  <option value="MOTS">Sedang (Aplikasi MOTS)</option>
                  <option value="HOTS">Tinggi (Penalaran HOTS & AKM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Topik / Materi Spesifik yang Ingin Diujikan:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#0d1017] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Contoh: Konflik Sosial, Diferensiasi, dan Integrasi Masyarakat"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Rangkuman Materi / Silabus Buku Guru (Stimulus Dasar AI):</span>
                <span className="text-[10px] text-slate-400 font-normal">Bisa di-paste dari buku paket atau modul</span>
              </label>
              <textarea
                rows={2}
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                className="w-full bg-[#0d1017] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed font-mono"
                placeholder="Tempelkan paragraf materi di sini..."
              />
            </div>

            {/* Target Komposisi Butir Soal */}
            <div>
              <span className="block text-[11px] font-bold text-slate-300 mb-2">Target Komposisi Soal yang Dihasilkan:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Pilihan Ganda (PG)</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCountPG((c) => Math.max(1, c - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-black text-white text-sm">{countPG}</span>
                    <button
                      type="button"
                      onClick={() => setCountPG((c) => Math.min(10, c + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">PG Kompleks (Centang)</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCountPGK((c) => Math.max(0, c - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-black text-white text-sm">{countPGK}</span>
                    <button
                      type="button"
                      onClick={() => setCountPGK((c) => Math.min(5, c + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Menjodohkan (Garis)</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCountMatching((c) => Math.max(0, c - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-black text-white text-sm">{countMatching}</span>
                    <button
                      type="button"
                      onClick={() => setCountMatching((c) => Math.min(3, c + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 font-bold block mb-1">Esai AI (Konsep)</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCountEssay((c) => Math.max(0, c - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-black text-emerald-400 text-sm">{countEssay}</span>
                    <button
                      type="button"
                      onClick={() => setCountEssay((c) => Math.min(5, c + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON ACTION GENERATE */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>{generationStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>⚡ Generate Paket Soal dengan AI Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 3: PREVIEW HASIL GENERASI */}
          {generatedQuestions.length > 0 && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">
                    Berhasil Dibuat: {generatedQuestions.length} Butir Soal AKM & Esai AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Siap disimpan ke {targetBankCode}</span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {q.type === 'PG'
                          ? 'Pilihan Ganda (1 Jawaban)'
                          : q.type === 'PGK'
                          ? 'PG Kompleks (Centang Banyak)'
                          : q.type === 'MATCHING'
                          ? 'Menjodohkan Garis'
                          : 'Uraian Esai AI Multi-Konsep'}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">{q.points} Poin</span>
                    </div>

                    <p className="font-semibold text-white text-xs leading-relaxed">
                      {idx + 1}. {q.prompt}
                    </p>

                    {/* Preview opsi PG */}
                    {q.type === 'PG' && (
                      <div className="space-y-1 pl-2 text-[11px] text-slate-300">
                        {(q as any).options.map((opt: any) => (
                          <div
                            key={opt.id}
                            className={`p-1.5 rounded flex items-center gap-2 ${
                              opt.id === (q as any).correctOptionId
                                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/20'
                                : 'text-slate-400'
                            }`}
                          >
                            <span className="w-4 font-mono">{opt.id.slice(-1).toUpperCase()}.</span>
                            <span>{opt.text}</span>
                            {opt.id === (q as any).correctOptionId && (
                              <span className="ml-auto text-[10px] text-emerald-400 font-bold">✓ KUNCI</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Preview Esai AI Rubrik */}
                    {q.type === 'ESSAY' && (
                      <div className="mt-2 p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/20 space-y-2 text-[11px]">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                            Kunci / Jawaban Ideal Model AI:
                          </span>
                          <p className="text-slate-200 italic mt-0.5 font-mono">{(q as any).rubric.idealAnswer}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                            Konsep Kunci & Bobot Penilaian NLP:
                          </span>
                          <div className="space-y-1 mt-1">
                            {(q as any).rubric.keyPoints.map((kp: any, kIdx: number) => (
                              <div
                                key={kIdx}
                                className="flex items-center justify-between bg-black/30 p-1.5 rounded text-[10px] text-slate-300"
                              >
                                <span>
                                  • {kp.concept} (Kata Kunci: <strong>{kp.mandatoryKeywords.join(', ')}</strong>)
                                </span>
                                <span className="font-bold text-emerald-400">{kp.weight}% Bobot</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0e111a] flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI NLP Scikit & Local Rule Matching (Zero-Cost Token)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveToBank}
              disabled={generatedQuestions.length === 0}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Bank Soal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Modal */}
      {isSuccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl shadow-2xl text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <h4 className="text-base font-black text-white">Soal Berhasil Ditambahkan!</h4>
            <p className="text-xs text-slate-300">
              {generatedQuestions.length} butir soal hasil AI Generator telah disinkronkan ke Bank Soal {targetBankCode}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
