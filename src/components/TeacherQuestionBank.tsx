'use client';

import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Upload,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Image as ImageIcon,
  ZoomIn,
  X,
} from 'lucide-react';
import { Question, QuestionType, Exam } from '../lib/types';

interface TeacherQuestionBankProps {
  exam: Exam;
  onUpdateExamQuestions: (questions: Question[]) => void;
}

export default function TeacherQuestionBank({
  exam,
  onUpdateExamQuestions,
}: TeacherQuestionBankProps) {
  const [questions, setQuestions] = useState<Question[]>(exam.questions);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form State untuk Tambah Soal Manual (5 Tipe Standar ANBK)
  const [newType, setNewType] = useState<QuestionType>('PG');
  const [newPrompt, setNewPrompt] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [previewZoomImage, setPreviewZoomImage] = useState<{ url: string; caption?: string } | null>(null);
  const [newPoints, setNewPoints] = useState(10);

  // 1. Khusus PG (Pilihan Ganda Biasa - 1 Kunci)
  const [pgOptions, setPgOptions] = useState([
    { id: 'opt_1', text: '' },
    { id: 'opt_2', text: '' },
    { id: 'opt_3', text: '' },
    { id: 'opt_4', text: '' },
  ]);
  const [correctPgOption, setCorrectPgOption] = useState('opt_1');

  // 2. Khusus PGK (Pilihan Ganda Kompleks - Multi Kunci)
  const [pgkOptions, setPgkOptions] = useState([
    { id: 'pgk_1', text: '', isCorrect: true },
    { id: 'pgk_2', text: '', isCorrect: false },
    { id: 'pgk_3', text: '', isCorrect: true },
    { id: 'pgk_4', text: '', isCorrect: false },
  ]);

  // 3. Khusus Menjodohkan (Matching Pairs)
  const [matchingPairs, setMatchingPairs] = useState([
    { id: 'm_1', premise: '', target: '' },
    { id: 'm_2', premise: '', target: '' },
    { id: 'm_3', premise: '', target: '' },
  ]);

  // 4. Khusus Isian Singkat
  const [shortAnswersInput, setShortAnswersInput] = useState('');

  // 5. Khusus Esai
  const [idealAnswer, setIdealAnswer] = useState('');
  const [keyPointsList, setKeyPointsList] = useState([
    { concept: '', weight: 5, keywordsStr: '' },
    { concept: '', weight: 5, keywordsStr: '' },
  ]);

  // State untuk Impor Format Teks / Excel Cepat
  const [importText, setImportText] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Simpan Soal Baru
  const handleSaveQuestion = () => {
    if (!newPrompt.trim()) {
      alert('Teks pertanyaan wajib diisi!');
      return;
    }

    const nextNumber = questions.length + 1;
    const newId = `q_${Date.now()}`;
    const imgUrlVal = newImageUrl.trim() || undefined;
    const imgCaptionVal = newImageCaption.trim() || undefined;

    let constructedQuestion: Question;

    if (newType === 'PG') {
      constructedQuestion = {
        id: newId,
        number: nextNumber,
        type: 'PG',
        prompt: newPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: Number(newPoints),
        options: pgOptions.map((opt, i) => ({
          id: `opt_${i + 1}`,
          text: opt.text || `Pilihan ${String.fromCharCode(65 + i)}`,
        })),
        correctOptionId: correctPgOption,
      };
    } else if (newType === 'PGK') {
      const formattedOptions = pgkOptions.map((opt, i) => ({
        id: `pgk_opt_${i + 1}`,
        text: opt.text || `Pilihan ${String.fromCharCode(65 + i)}`,
      }));
      const correctIds = pgkOptions
        .map((opt, i) => (opt.isCorrect ? `pgk_opt_${i + 1}` : null))
        .filter(Boolean) as string[];

      constructedQuestion = {
        id: newId,
        number: nextNumber,
        type: 'PGK',
        subtype: 'multi_select',
        prompt: newPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: Number(newPoints),
        options: formattedOptions,
        correctOptionIds: correctIds.length > 0 ? correctIds : ['pgk_opt_1'],
      };
    } else if (newType === 'MATCHING') {
      constructedQuestion = {
        id: newId,
        number: nextNumber,
        type: 'MATCHING',
        prompt: newPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: Number(newPoints),
        pairs: matchingPairs.map((p, idx) => ({
          id: `pair_${idx + 1}`,
          premise: p.premise || `Pernyataan ${idx + 1}`,
          target: p.target || `Pasangan ${idx + 1}`,
        })),
      };
    } else if (newType === 'SHORT') {
      constructedQuestion = {
        id: newId,
        number: nextNumber,
        type: 'SHORT',
        prompt: newPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: Number(newPoints),
        acceptableAnswers: (shortAnswersInput || 'jawaban benar')
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      };
    } else {
      // ESSAY
      constructedQuestion = {
        id: newId,
        number: nextNumber,
        type: 'ESSAY',
        prompt: newPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: Number(newPoints),
        rubric: {
          idealAnswer: idealAnswer || 'Contoh jawaban ideal guru.',
          maxScore: Number(newPoints),
          keyPoints: keyPointsList
            .filter((kp) => kp.concept.trim().length > 0)
            .map((kp) => ({
              concept: kp.concept,
              weight: Number(kp.weight) || 5,
              mandatoryKeywords: kp.keywordsStr
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean),
            })),
        },
      };
    }

    const updated = [...questions, constructedQuestion];
    setQuestions(updated);
    onUpdateExamQuestions(updated);

    // Reset Form
    setIsAddingModalOpen(false);
    setNewPrompt('');
    setNewImageUrl('');
    setNewImageCaption('');
    setIdealAnswer('');
    setShortAnswersInput('');
  };

  // Hapus Soal
  const handleDeleteQuestion = (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      const updated = questions
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, number: idx + 1 }));
      setQuestions(updated);
      onUpdateExamQuestions(updated);
    }
  };

  // Impor Otomatis dari Format Cepat (Simulasi File Excel / Kisi-kisi)
  const handleBulkImport = () => {
    // Parser cepat untuk format teks soal:
    // Q: Pertanyaan
    // A: Opsi A
    // B: Opsi B
    // C: Opsi C
    // D: Opsi D
    // KUNCI: A
    // BOBOT: 10
    const sampleBatch: Question[] = [
      {
        id: `imp_${Date.now()}_1`,
        number: questions.length + 1,
        type: 'PG',
        prompt: 'Satuan Standar Internasional (SI) untuk intensitas cahaya adalah...',
        points: 10,
        options: [
          { id: 'opt_1', text: 'Candela (cd)' },
          { id: 'opt_2', text: 'Lumen (lm)' },
          { id: 'opt_3', text: 'Lux (lx)' },
          { id: 'opt_4', text: 'Watt (W)' },
        ],
        correctOptionId: 'opt_1',
      },
      {
        id: `imp_${Date.now()}_2`,
        number: questions.length + 2,
        type: 'ESSAY',
        prompt: 'Jelaskan perbedaan mendasar antara pembelahan sel Mitosis dan Meiosis!',
        points: 15,
        rubric: {
          idealAnswer:
            'Mitosis terjadi pada sel somatis (tubuh) menghasilkan 2 sel anak identik diploid (2n), sedangkan meiosis terjadi pada sel gamet (kelamin) menghasilkan 4 sel anak haploid (n) untuk reproduksi.',
          maxScore: 15,
          keyPoints: [
            {
              concept: 'Tempat terjadinya: Mitosis di sel tubuh (somatis), Meiosis di sel kelamin (gamet)',
              weight: 5,
              mandatoryKeywords: ['somatis', 'tubuh', 'gamet', 'kelamin'],
            },
            {
              concept: 'Jumlah sel anakan: Mitosis menghasilkan 2 sel anak, Meiosis menghasilkan 4 sel anak',
              weight: 5,
              mandatoryKeywords: ['2 sel', '4 sel', 'dua', 'empat'],
            },
            {
              concept: 'Jumlah kromosom: Mitosis bersifat diploid (2n), Meiosis bersifat haploid (n)',
              weight: 5,
              mandatoryKeywords: ['diploid', 'haploid', '2n', 'n'],
            },
          ],
        },
      },
      {
        id: `imp_${Date.now()}_3`,
        number: questions.length + 3,
        type: 'SHORT',
        prompt: 'Siapakah presiden pertama Republik Indonesia yang membacakan naskah Proklamasi Kemerdekaan?',
        points: 10,
        acceptableAnswers: ['soekarno', 'ir soekarno', 'bung karno', 'ir. soekarno'],
      },
    ];

    const updated = [...questions, ...sampleBatch];
    setQuestions(updated);
    onUpdateExamQuestions(updated);
    setImportSuccessMsg(`Berhasil mengimpor ${sampleBatch.length} butir soal secara instan!`);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportSuccessMsg('');
    }, 1500);
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER PORTAL GURU */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Bank Soal & Kisi-Kisi Ujian Guru</h2>
              <p className="text-xs text-slate-500">
                Paket: <span className="font-semibold text-slate-700">{exam.title}</span> &bull;{' '}
                {exam.subject} ({exam.grade})
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="py-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Impor Massal (Excel / Word)</span>
          </button>

          <button
            onClick={() => setIsAddingModalOpen(true)}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Butir Soal</span>
          </button>
        </div>
      </div>

      {/* STATISTIK BANK SOAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block font-medium">Total Butir Soal</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{questions.length} Soal</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block font-medium">Akumulasi Bobot Nilai</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{totalPoints} Poin</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block font-medium">Soal Objektif (PG/PGK)</span>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {questions.filter((q) => q.type === 'PG' || q.type === 'PGK' || q.type === 'MATCHING').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Esai Otomatis
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {questions.filter((q) => q.type === 'ESSAY').length} Soal
          </p>
        </div>
      </div>

      {/* DAFTAR SOAL DALAM PAKET */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Daftar Soal yang Siap Dikerjakan Siswa:
          </h3>
          <span className="text-xs text-slate-500">
            *Setiap perubahan soal langsung tersinkronisasi ke sesi siswa
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {questions.map((q) => (
            <div key={q.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {q.number}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {q.type === 'PG' && 'Pilihan Ganda'}
                        {q.type === 'PGK' && 'Pilihan Ganda Kompleks'}
                        {q.type === 'MATCHING' && 'Menjodohkan'}
                        {q.type === 'SHORT' && 'Isian Singkat'}
                        {q.type === 'ESSAY' && 'Uraian / Esai AI'}
                      </span>
                      <span className="text-xs font-semibold text-indigo-700">
                        Bobot: {q.points} Poin
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.prompt}</p>

                    {q.imageUrl && (
                      <div className="mt-2.5">
                        <div className="inline-block relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                          <img
                            src={q.imageUrl}
                            alt={q.imageCaption || 'Gambar Butir Soal'}
                            className="max-h-48 max-w-full rounded-lg object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
                            onClick={() => setPreviewZoomImage({ url: q.imageUrl!, caption: q.imageCaption })}
                          />
                          <div className="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <ZoomIn className="w-3 h-3 text-emerald-400" />
                            <span>Perbesar</span>
                          </div>
                        </div>
                        {q.imageCaption && (
                          <p className="text-xs text-slate-500 italic mt-1 font-normal">
                            Sumber / Ket: {q.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rincian Kunci Sesuai Tipe */}
              <div className="pl-10 text-xs text-slate-600">
                {q.type === 'PG' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-lg border ${
                          opt.id === q.correctOptionId
                            ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {opt.id === q.correctOptionId && '✓ '}
                        {opt.text}
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'PGK' && (
                  <div className="space-y-1.5 mt-2">
                    <span className="text-[11px] font-bold text-blue-900 block">
                      Opsi Pilihan Ganda Kompleks (Multi Kunci Benar):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isCorrect = q.correctOptionIds?.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-lg border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isCorrect ? 'bg-blue-600 text-white' : 'border border-slate-300 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {q.type === 'MATCHING' && (
                  <div className="space-y-1.5 mt-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-900 block">
                      Pasangan Menjodohkan yang Benar:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.pairs.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-700">{p.premise}</span>
                          <span className="font-bold text-amber-700 flex items-center gap-1">
                            ➔ {p.target}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {q.type === 'ESSAY' && (
                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2 mt-2">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Rubrik Konseptual yang Dinilai Otomatis:
                    </span>
                    <div className="space-y-1.5">
                      {q.rubric.keyPoints.map((kp, idx) => (
                        <div
                          key={idx}
                          className="bg-white/80 p-2 rounded-lg border border-emerald-100 flex justify-between"
                        >
                          <div>
                            <span className="font-semibold text-slate-700">{kp.concept}</span>
                            <div className="text-[10px] text-slate-500">
                              Kata kunci: {kp.mandatoryKeywords.join(', ')}
                            </div>
                          </div>
                          <span className="font-bold text-emerald-700">{kp.weight} Poin</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {q.type === 'SHORT' && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                    <span className="font-semibold text-slate-700">Kunci Jawaban yang Diterima: </span>
                    <span className="font-mono text-emerald-700">{q.acceptableAnswers.join(' / ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: TAMBAH SOAL MANUAL */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" /> Buat Butir Soal Baru
              </h3>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pilihan Tipe Soal - DROPDOWN 5 TIPE STANDAR ANBK */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Format / Tipe Soal Standar Asesmen Nasional (ANBK):
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as QuestionType)}
                className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800 cursor-pointer shadow-xs"
              >
                <option value="PG">1. Pilihan Ganda (Single Choice - 1 Kunci Jawaban)</option>
                <option value="PGK">2. Pilihan Ganda Kompleks (Multi-Select - Lebih dari 1 Kunci Jawaban)</option>
                <option value="MATCHING">3. Menjodohkan (Matching Pairs - Pasangan Premise & Target)</option>
                <option value="SHORT">4. Isian Singkat (Short Answer - Input Kata / Frasa)</option>
                <option value="ESSAY">5. Esai / Uraian (Auto-Grading AI Rubrik & Bobot Kata Kunci)</option>
              </select>
              <p className="text-[11px] text-slate-500 italic">
                {newType === 'PG' && '💡 Peserta memilih satu jawaban benar dari 4-5 opsi pilihan ganda.'}
                {newType === 'PGK' && '💡 Peserta memilih beberapa jawaban benar (centang kotak) yang sesuai pernyataan.'}
                {newType === 'MATCHING' && '💡 Peserta menghubungkan/menjodohkan pernyataan kolom kiri dengan pasangan kolom kanan.'}
                {newType === 'SHORT' && '💡 Peserta mengetikkan kata atau nilai eksak yang dicocokkan dengan kunci jawaban.'}
                {newType === 'ESSAY' && '💡 Peserta menyusun jawaban uraian panjang yang dikoreksi instan dengan algoritma rubrik AI.'}
              </p>
            </div>

            {/* Teks Pertanyaan */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Pertanyaan / Narasi Soal:</label>
              <textarea
                rows={3}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Tuliskan pertanyaan ujian atau stimulus soal di sini..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-sans"
              />
            </div>

            {/* Upload & Preview Gambar Soal */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Gambar / Stimulus Soal (Opsional):</span>
                </label>
                {newImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewImageUrl('');
                      setNewImageCaption('');
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Gambar
                  </button>
                )}
              </div>

              {newImageUrl ? (
                <div className="space-y-2">
                  <div className="max-w-xs mx-auto rounded-lg overflow-hidden border border-slate-200 bg-white p-1 flex justify-center">
                    <img src={newImageUrl} alt="Preview Soal" className="max-h-40 object-contain rounded" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Keterangan / Sumber Gambar (Caption):</label>
                    <input
                      type="text"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Contoh: Gambar 1.1 Diagram Rangkaian Listrik"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs text-slate-600 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Upload File Gambar (PNG, JPG, SVG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Ukuran file maksimal 5MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) setNewImageUrl(res);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Atau URL:</span>
                    <input
                      type="text"
                      placeholder="https://... atau tempel tautan gambar"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 text-xs p-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bobot Poin */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Bobot Poin Soal:</label>
              <input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-32 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 font-bold"
              />
            </div>

            {/* 1. JIKA TIPE PG (PILIHAN GANDA TUNGGAL) */}
            {newType === 'PG' && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">
                    Opsi Pilihan Ganda (Pilih 1 Radio Button Sebagai Kunci Benar):
                  </label>
                  {pgOptions.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPgOptions([
                          ...pgOptions,
                          { id: `opt_${pgOptions.length + 1}`, text: '' },
                        ])
                      }
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      + Tambah Opsi {String.fromCharCode(65 + pgOptions.length)}
                    </button>
                  )}
                </div>
                {pgOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctPg"
                      checked={correctPgOption === opt.id}
                      onChange={() => setCorrectPgOption(opt.id)}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                    />
                    <span className="w-5 font-bold text-slate-500 text-xs text-center">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      placeholder={`Isi pilihan ${String.fromCharCode(65 + idx)}`}
                      value={opt.text}
                      onChange={(e) => {
                        const copy = [...pgOptions];
                        copy[idx].text = e.target.value;
                        setPgOptions(copy);
                      }}
                      className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 2. JIKA TIPE PGK (PILIHAN GANDA KOMPLEKS) */}
            {newType === 'PGK' && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-blue-900">
                    Opsi PG Kompleks (Centang Kotak untuk Semua Opsi yang Benar):
                  </label>
                  {pgkOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPgkOptions([
                          ...pgkOptions,
                          { id: `pgk_${pgkOptions.length + 1}`, text: '', isCorrect: false },
                        ])
                      }
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      + Tambah Opsi Pilihan
                    </button>
                  )}
                </div>
                {pgkOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const copy = [...pgkOptions];
                        copy[idx].isCorrect = e.target.checked;
                        setPgkOptions(copy);
                      }}
                      className="text-blue-600 focus:ring-blue-500 rounded cursor-pointer w-4 h-4 accent-blue-600"
                    />
                    <span className="w-5 font-bold text-slate-500 text-xs text-center">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      placeholder={`Pernyataan ${String.fromCharCode(65 + idx)}`}
                      value={opt.text}
                      onChange={(e) => {
                        const copy = [...pgkOptions];
                        copy[idx].text = e.target.value;
                        setPgkOptions(copy);
                      }}
                      className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    {opt.isCorrect && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                        Kunci Benar
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 3. JIKA TIPE MENJODOHKAN (MATCHING PAIRS) */}
            {newType === 'MATCHING' && (
              <div className="space-y-2.5 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-amber-900">
                    Pasangan Menjodohkan (Premise Kiri <span className="text-amber-600">➔</span> Target Kanan):
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setMatchingPairs([
                        ...matchingPairs,
                        { id: `m_${matchingPairs.length + 1}`, premise: '', target: '' },
                      ])
                    }
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                  >
                    + Tambah Pasangan
                  </button>
                </div>
                <div className="space-y-2">
                  {matchingPairs.map((pair, idx) => (
                    <div key={pair.id} className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200">
                      <span className="w-5 text-center font-bold text-amber-800 text-xs">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Pernyataan / Konsep (Kiri)"
                        value={pair.premise}
                        onChange={(e) => {
                          const copy = [...matchingPairs];
                          copy[idx].premise = e.target.value;
                          setMatchingPairs(copy);
                        }}
                        className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-amber-600 font-bold">➔</span>
                      <input
                        type="text"
                        placeholder="Pasangan Benar (Kanan)"
                        value={pair.target}
                        onChange={(e) => {
                          const copy = [...matchingPairs];
                          copy[idx].target = e.target.value;
                          setMatchingPairs(copy);
                        }}
                        className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-semibold text-emerald-800"
                      />
                      {matchingPairs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            setMatchingPairs(matchingPairs.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. JIKA TIPE ISIAN SINGKAT */}
            {newType === 'SHORT' && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <label className="block text-xs font-bold text-purple-900">
                  Kunci Jawaban yang Diterima (Pisahkan koma jika ada ragam penulisan/sinonim):
                </label>
                <input
                  type="text"
                  placeholder="contoh: Soekarno, Ir. Soekarno, Bung Karno, Ir Soekarno"
                  value={shortAnswersInput}
                  onChange={(e) => setShortAnswersInput(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  *Sistem akan mengabaikan huruf besar/kecil (case-insensitive) dan spasi berlebih saat siswa menjawab.
                </p>
              </div>
            )}

            {/* 5. JIKA TIPE ESAI (INPUT RUBRIK OTOMATIS) */}
            {newType === 'ESSAY' && (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">
                    Contoh Jawaban Ideal Guru:
                  </label>
                  <textarea
                    rows={2}
                    value={idealAnswer}
                    onChange={(e) => setIdealAnswer(e.target.value)}
                    placeholder="Contoh kalimat jawaban lengkap yang ideal..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-emerald-800">
                      Poin Konsep Wajib yang Dinilai Otomatis:
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setKeyPointsList([
                          ...keyPointsList,
                          { concept: '', weight: 5, keywordsStr: '' },
                        ])
                      }
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                    >
                      + Tambah Poin Konsep
                    </button>
                  </div>
                  {keyPointsList.map((kp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mb-2 text-xs"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Konsep #${idx + 1} (contoh: Menyebutkan proses dengan bahan air dan CO2)`}
                          value={kp.concept}
                          onChange={(e) => {
                            const copy = [...keyPointsList];
                            copy[idx].concept = e.target.value;
                            setKeyPointsList(copy);
                          }}
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-md focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Bobot"
                          value={kp.weight}
                          onChange={(e) => {
                            const copy = [...keyPointsList];
                            copy[idx].weight = Number(e.target.value);
                            setKeyPointsList(copy);
                          }}
                          className="w-20 p-2 bg-white border border-slate-300 rounded-md focus:outline-none text-center font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Kata kunci penting pisah dengan koma (contoh: air, karbon dioksida, co2)"
                        value={kp.keywordsStr}
                        onChange={(e) => {
                          const copy = [...keyPointsList];
                          copy[idx].keywordsStr = e.target.value;
                          setKeyPointsList(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-[11px] focus:outline-none text-slate-600 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Simpan */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingModalOpen(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Simpan ke Bank Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPOR MASSAL EXCEL / WORD */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Impor Massal Soal dari Excel / File
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Guru tidak perlu mengetik soal satu per satu di sistem! Cukup siapkan naskah soal dalam
              format template Excel atau kisi-kisi teks, lalu sistem akan mengekstrak otomatis.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Impor Batch 1-Klik:</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Klik tombol di bawah untuk menyimulasikan impor 3 paket soal baru (1 Pilihan Ganda, 1
                Esai Biologi dengan rubrik otomatis, dan 1 Isian Sejarah) sekaligus dalam sekejap.
              </p>
            </div>

            {importSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center animate-in fade-in">
                {importSuccessMsg}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert('Template file Excel (.xlsx) berhasil diunduh.')}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Template Excel
              </button>

              <button
                type="button"
                onClick={handleBulkImport}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Impor 3 Soal Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox / Zoom Gambar Modal */}
      {previewZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setPreviewZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 px-2 text-slate-800">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-indigo-600" />
                Pratinjau Gambar Soal
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={previewZoomImage.url}
                alt="Zoomed Question Preview"
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>
            {previewZoomImage.caption && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600 italic">
                {previewZoomImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
