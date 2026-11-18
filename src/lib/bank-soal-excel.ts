import * as XLSX from 'xlsx';
import { Question, QuestionBank, MultipleChoiceQuestion, ComplexMultipleChoiceQuestion, MatchingQuestion, ShortAnswerQuestion, EssayQuestion } from './types';

export interface ParseResult {
  success: boolean;
  questions: Question[];
  errors: string[];
}

/**
 * 1. UNDUH TEMPLATE EXCEL KOSONG (.XLSX)
 * Format standar kolom yang mudah dipahami guru sekolah:
 * No, Tipe, Soal, Opsi A, Opsi B, Opsi C, Opsi D, Opsi E, Kunci Jawaban, Poin, Rubrik/Keterangan
 */
export function downloadExcelTemplate(): void {
  const headers = [
    'No',
    'Tipe Soal (PG/PGK/MENJODOHKAN/ISIAN/ESAI)',
    'Naskah Pertanyaan Soal',
    'Pilihan A',
    'Pilihan B',
    'Pilihan C',
    'Pilihan D',
    'Pilihan E (Khusus SMA/SMK)',
    'Kunci Jawaban',
    'Bobot Poin',
    'Rubrik Kata Kunci / Pembahasan (Khusus Esai)',
  ];

  const sampleRows = [
    [
      1,
      'PG',
      'Organel sel tumbuhan yang berfungsi sebagai tempat berlangsungnya proses fotosintesis adalah...',
      'Mitokondria',
      'Kloroplas',
      'Ribosom',
      'Badan Golgi',
      '',
      'B',
      10,
      'Kloroplas mengandung klorofil untuk menangkap cahaya matahari.',
    ],
    [
      2,
      'PGK',
      'Manakah di antara pernyataan berikut yang merupakan ciri-ciri makhluk hidup? (Pilih semua yang benar)',
      'Memerlukan nutrisi/makanan',
      'Mampu berkembang biak (reproduksi)',
      'Tersusun atas materi anorganik mati',
      'Peka terhadap rangsang (iritabilitas)',
      '',
      'A, B, D',
      15,
      'Pilihan A, B, dan D adalah ciri-ciri esensial organisme hidup.',
    ],
    [
      3,
      'MENJODOHKAN',
      'Pasangkan besaran pokok fisika berikut dengan satuan internasional (SI) yang tepat:',
      'Panjang : Meter',
      'Massa : Kilogram',
      'Waktu : Sekon',
      'Suhu : Kelvin',
      '',
      'Panjang=Meter; Massa=Kilogram; Waktu=Sekon; Suhu=Kelvin',
      20,
      'Format menjodohkan: Premis=Target; dipisahkan titik koma',
    ],
    [
      4,
      'ISIAN',
      'Zat hijau daun yang berperan vital dalam menangkap energi cahaya matahari disebut...',
      '',
      '',
      '',
      '',
      '',
      'klorofil, zat hijau daun',
      15,
      'Bisa menuliskan beberapa alternatif jawaban dipisahkan tanda koma.',
    ],
    [
      5,
      'ESAI',
      'Jelaskan perbedaan mendasar antara sel hewan dan sel tumbuhan ditinjau dari keberadaan dinding sel dan vakuola!',
      '',
      '',
      '',
      '',
      '',
      'Sel tumbuhan memiliki dinding sel kaku dan vakuola berukuran besar, sedangkan sel hewan tidak memiliki dinding sel dan vakuolanya kecil atau tidak ada.',
      40,
      'dinding sel, vakuola besar, selulosa, plastida',
    ],
  ];

  const wsData = [headers, ...sampleRows];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 25 }, // Tipe
    { wch: 55 }, // Soal
    { wch: 25 }, // Opsi A
    { wch: 25 }, // Opsi B
    { wch: 25 }, // Opsi C
    { wch: 25 }, // Opsi D
    { wch: 25 }, // Opsi E
    { wch: 30 }, // Kunci
    { wch: 12 }, // Poin
    { wch: 45 }, // Rubrik / Keterangan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Soal');

  XLSX.writeFile(workbook, 'Template_Import_Bank_Soal_SmartCBT.xlsx');
}

/**
 * 2. PARSE EXCEL / CSV MENJADI ARRAY QUESTION
 */
export async function parseExcelToQuestions(file: File): Promise<ParseResult> {
  const errors: string[] = [];
  const questions: Question[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return { success: false, questions: [], errors: ['File Excel tidak memiliki lembar kerja (worksheet).'] };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

    if (rawRows.length < 2) {
      return { success: false, questions: [], errors: ['File Excel kosong atau tidak memiliki data butir soal.'] };
    }

    // Skip header row
    const dataRows = rawRows.slice(1);

    dataRows.forEach((row, idx) => {
      if (!row || row.length === 0 || !row[1] || !row[2]) {
        // Abaikan baris kosong
        return;
      }

      const rowNumber = idx + 2; // Row di excel (1-based + 1 header)
      const qNum = Number(row[0]) || questions.length + 1;
      const rawType = String(row[1] || '').trim().toUpperCase();
      const prompt = String(row[2] || '').trim();
      const optA = String(row[3] || '').trim();
      const optB = String(row[4] || '').trim();
      const optC = String(row[5] || '').trim();
      const optD = String(row[6] || '').trim();
      const optE = String(row[7] || '').trim();
      const rawKey = String(row[8] || '').trim();
      const points = Number(row[9]) || 10;
      const rubricOrNotes = String(row[10] || '').trim();

      const qId = `q_import_${Date.now()}_${idx}`;

      // A. PILIHAN GANDA (PG)
      if (rawType === 'PG' || rawType === 'PILIHAN GANDA' || rawType === 'SINGLE') {
        const optionsList = [
          { id: 'opt_a', text: optA },
          { id: 'opt_b', text: optB },
          { id: 'opt_c', text: optC },
          { id: 'opt_d', text: optD },
        ];
        if (optE) optionsList.push({ id: 'opt_e', text: optE });

        const cleanKey = rawKey.toUpperCase().replace(/[^A-E]/g, '');
        let correctOptionId = 'opt_a';
        if (cleanKey === 'B') correctOptionId = 'opt_b';
        else if (cleanKey === 'C') correctOptionId = 'opt_c';
        else if (cleanKey === 'D') correctOptionId = 'opt_d';
        else if (cleanKey === 'E') correctOptionId = 'opt_e';

        const q: MultipleChoiceQuestion = {
          id: qId,
          number: qNum,
          prompt,
          points,
          type: 'PG',
          options: optionsList.filter((o) => o.text !== ''),
          correctOptionId,
        };
        questions.push(q);
      }
      // B. PILIHAN GANDA KOMPLEKS (PGK)
      else if (rawType === 'PGK' || rawType === 'KOMPLEKS' || rawType === 'MULTI') {
        const optionsList = [
          { id: 'opt_a', text: optA },
          { id: 'opt_b', text: optB },
          { id: 'opt_c', text: optC },
          { id: 'opt_d', text: optD },
        ];
        if (optE) optionsList.push({ id: 'opt_e', text: optE });

        const correctIds: string[] = [];
        const splittedKeys = rawKey.toUpperCase().split(/[,;\s]+/);
        splittedKeys.forEach((k) => {
          const letter = k.trim();
          if (letter === 'A') correctIds.push('opt_a');
          if (letter === 'B') correctIds.push('opt_b');
          if (letter === 'C') correctIds.push('opt_c');
          if (letter === 'D') correctIds.push('opt_d');
          if (letter === 'E') correctIds.push('opt_e');
        });

        const q: ComplexMultipleChoiceQuestion = {
          id: qId,
          number: qNum,
          prompt,
          points,
          type: 'PGK',
          subtype: 'multi_select',
          options: optionsList.filter((o) => o.text !== ''),
          correctOptionIds: correctIds.length > 0 ? correctIds : ['opt_a', 'opt_b'],
        };
        questions.push(q);
      }
      // C. MENJODOHKAN (MATCHING)
      else if (rawType.includes('JODOH') || rawType === 'MATCHING') {
        const pairs: { id: string; premise: string; target: string }[] = [];

        // Bisa parsing dari format "Premis : Target" di kolom opsi atau kolom kunci
        const candidatePairs = [optA, optB, optC, optD, optE].filter(Boolean);
        if (candidatePairs.length > 0) {
          candidatePairs.forEach((pairStr, pIdx) => {
            const parts = pairStr.split(/[:=]/);
            if (parts.length >= 2) {
              pairs.push({
                id: `p_${pIdx + 1}`,
                premise: parts[0].trim(),
                target: parts.slice(1).join(':').trim(),
              });
            }
          });
        }

        // Jika kosong, parse dari rawKey "P1=T1; P2=T2"
        if (pairs.length === 0 && rawKey) {
          const splitted = rawKey.split(/[,;]/);
          splitted.forEach((item, pIdx) => {
            const parts = item.split(/[:=]/);
            if (parts.length >= 2) {
              pairs.push({
                id: `p_${pIdx + 1}`,
                premise: parts[0].trim(),
                target: parts.slice(1).join('=').trim(),
              });
            }
          });
        }

        const q: MatchingQuestion = {
          id: qId,
          number: qNum,
          prompt,
          points,
          type: 'MATCHING',
          pairs: pairs.length > 0 ? pairs : [
            { id: 'p_1', premise: 'Premis 1', target: 'Jawaban 1' },
            { id: 'p_2', premise: 'Premis 2', target: 'Jawaban 2' },
          ],
        };
        questions.push(q);
      }
      // D. ISIAN SINGKAT (SHORT ANSWER)
      else if (rawType.includes('ISIAN') || rawType === 'SHORT' || rawType === 'SHORT_ANSWER') {
        const acceptableAnswers = rawKey
          .split(/[,;\/]/)
          .map((s) => s.trim())
          .filter(Boolean);

        const q: ShortAnswerQuestion = {
          id: qId,
          number: qNum,
          prompt,
          points,
          type: 'SHORT',
          acceptableAnswers: acceptableAnswers.length > 0 ? acceptableAnswers : ['jawaban'],
        };
        questions.push(q);
      }
      // E. ESAI / URAIAN
      else if (rawType.includes('ESAI') || rawType.includes('URAIAN') || rawType === 'ESSAY') {
        const rawKeywords = rubricOrNotes
          ? rubricOrNotes.split(/[,;]/).map((k) => k.trim()).filter(Boolean)
          : ['konsep', 'penjelasan'];

        const rubricKeywords = rawKeywords.map((kw, kwIdx) => ({
          keyword: kw,
          weight: Math.round(points / Math.max(rawKeywords.length, 1)) || 5,
          synonyms: [],
        }));

        const q: EssayQuestion = {
          id: qId,
          number: qNum,
          prompt,
          points,
          type: 'ESSAY',
          rubric: {
            idealAnswer: rawKey || 'Jawaban uraian sesuai rubrik penilaian',
            maxScore: points,
            keyPoints: [
              {
                concept: 'Konsep Jawaban Utama',
                weight: points,
                mandatoryKeywords: rubricKeywords.map((k) => k.keyword),
              },
            ],
            strictness: 'standard',
          },
        };
        questions.push(q);
      } else {
        errors.push(`Baris ${rowNumber}: Tipe soal "${rawType}" tidak dikenali (gunakan PG, PGK, MENJODOHKAN, ISIAN, atau ESAI).`);
      }
    });

    return {
      success: questions.length > 0,
      questions,
      errors,
    };
  } catch (err: any) {
    return {
      success: false,
      questions: [],
      errors: [`Gagal memproses file Excel: ${err?.message || 'Format tidak valid'}`],
    };
  }
}

/**
 * 3. EXPORT BANK SOAL KE EXCEL (.XLSX)
 */
export function exportBankSoalToExcel(bank: QuestionBank): void {
  const headers = [
    'No',
    'Tipe Soal',
    'Naskah Pertanyaan',
    'Pilihan A',
    'Pilihan B',
    'Pilihan C',
    'Pilihan D',
    'Pilihan E',
    'Kunci Jawaban',
    'Poin',
    'Rubrik / Catatan',
  ];

  const rows = bank.questions.map((q, idx) => {
    let optA = '';
    let optB = '';
    let optC = '';
    let optD = '';
    let optE = '';
    let keyStr = '';
    let notes = '';

    if (q.type === 'PG') {
      const mc = q as MultipleChoiceQuestion;
      optA = mc.options?.[0]?.text || '';
      optB = mc.options?.[1]?.text || '';
      optC = mc.options?.[2]?.text || '';
      optD = mc.options?.[3]?.text || '';
      optE = mc.options?.[4]?.text || '';
      const keyOpt = mc.options?.findIndex((o) => o.id === mc.correctOptionId);
      keyStr = keyOpt >= 0 ? String.fromCharCode(65 + keyOpt) : 'A';
    } else if (q.type === 'PGK') {
      const pgk = q as ComplexMultipleChoiceQuestion;
      optA = pgk.options?.[0]?.text || '';
      optB = pgk.options?.[1]?.text || '';
      optC = pgk.options?.[2]?.text || '';
      optD = pgk.options?.[3]?.text || '';
      optE = pgk.options?.[4]?.text || '';
      const keys = (pgk.correctOptionIds || []).map((id) => {
        const foundIdx = pgk.options?.findIndex((o) => o.id === id);
        return foundIdx >= 0 ? String.fromCharCode(65 + foundIdx) : id;
      });
      keyStr = keys.join(', ');
    } else if (q.type === 'MATCHING') {
      const m = q as MatchingQuestion;
      const pairs = m.pairs || [];
      keyStr = pairs.map((p) => `${p.premise} = ${p.target}`).join('; ');
      optA = pairs[0] ? `${pairs[0].premise} : ${pairs[0].target}` : '';
      optB = pairs[1] ? `${pairs[1].premise} : ${pairs[1].target}` : '';
      optC = pairs[2] ? `${pairs[2].premise} : ${pairs[2].target}` : '';
    } else if (q.type === 'SHORT') {
      const s = q as ShortAnswerQuestion;
      keyStr = (s.acceptableAnswers || []).join(', ');
    } else if (q.type === 'ESSAY') {
      const e = q as EssayQuestion;
      keyStr = e.rubric?.idealAnswer || 'Jawaban Uraian Berbobot Rubrik AI';
      notes = (e.rubric?.keyPoints || [])
        .flatMap((kp) => kp.mandatoryKeywords || [])
        .join(', ');
    }

    return [
      q.number || idx + 1,
      q.type,
      q.prompt,
      optA,
      optB,
      optC,
      optD,
      optE,
      keyStr,
      q.points,
      notes,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 50 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 30 },
    { wch: 10 },
    { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bank Soal');

  const fileName = `BankSoal_${bank.code.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 4. EXPORT BANK SOAL KE WORD (.DOC / FORMAT CETAK NATIVE)
 */
export function exportBankSoalToWord(bank: QuestionBank, schoolName: string = 'SEKOLAH SMART CBT'): void {
  let content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Naskah Soal - ${bank.code}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 20mm; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
        .kop h2 { margin: 0; font-size: 16pt; text-transform: uppercase; }
        .kop h3 { margin: 4px 0; font-size: 14pt; }
        .kop p { margin: 0; font-size: 10pt; font-style: italic; }
        .meta-table { width: 100%; margin-bottom: 20px; font-size: 11pt; border-collapse: collapse; }
        .meta-table td { padding: 3px 6px; }
        .soal-item { margin-bottom: 18px; page-break-inside: avoid; }
        .soal-num { font-weight: bold; }
        .soal-prompt { margin-bottom: 8px; }
        .options-table { width: 100%; border-collapse: collapse; margin-left: 15px; }
        .options-table td { padding: 2px 4px; vertical-align: top; }
        .badge { font-size: 9pt; font-weight: bold; padding: 2px 6px; border: 1px solid #666; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
        .kunci-footer { margin-top: 40px; border-top: 2px solid #000; padding-top: 15px; page-break-before: always; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${schoolName}</h2>
        <h3>NASKAH BANK SOAL & KISI-KISI ASESMEN</h3>
        <p>Sistem Ujian Berbasis Komputer & Asesmen Digital Smart CBT</p>
      </div>

      <table class="meta-table">
        <tr>
          <td width="20%"><strong>Kode Bank Soal</strong></td>
          <td width="30%">: ${bank.code}</td>
          <td width="20%"><strong>Tingkat / Rombel</strong></td>
          <td width="30%">: Kelas ${bank.level || 'Semua'}</td>
        </tr>
        <tr>
          <td><strong>Mata Pelajaran</strong></td>
          <td>: ${bank.subjectName || bank.code}</td>
          <td><strong>Guru Pengampu</strong></td>
          <td>: ${bank.teacherName || 'Dewan Guru'}</td>
        </tr>
        <tr>
          <td><strong>Format Soal</strong></td>
          <td>: ${bank.format === 'AKM_KOMPLEKS' ? 'AKM / Asesmen Nasional' : 'CBT Standar'}</td>
          <td><strong>Total Butir Soal</strong></td>
          <td>: ${bank.questions.length} Butir</td>
        </tr>
      </table>

      <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 20px;" />
  `;

  bank.questions.forEach((q, idx) => {
    const qNum = q.number || idx + 1;
    content += `
      <div class="soal-item">
        <span class="badge">[Tipe: ${q.type} | Bobot: ${q.points} Poin]</span>
        <div class="soal-prompt">
          <span class="soal-num">${qNum}.</span> ${q.prompt}
        </div>
    `;

    if (q.type === 'PG' && (q as MultipleChoiceQuestion).options) {
      content += `<table class="options-table">`;
      (q as MultipleChoiceQuestion).options.forEach((opt, optIdx) => {
        const char = String.fromCharCode(65 + optIdx);
        content += `<tr><td width="25px"><strong>${char}.</strong></td><td>${opt.text}</td></tr>`;
      });
      content += `</table>`;
    } else if (q.type === 'PGK' && (q as ComplexMultipleChoiceQuestion).options) {
      content += `<table class="options-table">`;
      (q as ComplexMultipleChoiceQuestion).options.forEach((opt, optIdx) => {
        const char = String.fromCharCode(65 + optIdx);
        content += `<tr><td width="25px"><strong>[ ] ${char}.</strong></td><td>${opt.text}</td></tr>`;
      });
      content += `</table>`;
    } else if (q.type === 'MATCHING' && (q as MatchingQuestion).pairs) {
      content += `<table style="width: 90%; margin-left: 20px; border: 1px solid #999; border-collapse: collapse;">
        <tr style="background: #eee;"><th style="border: 1px solid #999; padding: 4px;">Pernyataan / Premis</th><th style="border: 1px solid #999; padding: 4px;">Pasangan Jawaban Target</th></tr>`;
      (q as MatchingQuestion).pairs.forEach((pair) => {
        content += `<tr><td style="border: 1px solid #999; padding: 4px;">${pair.premise}</td><td style="border: 1px solid #999; padding: 4px;">${pair.target}</td></tr>`;
      });
      content += `</table>`;
    } else if (q.type === 'SHORT') {
      content += `<div style="margin-left: 20px; font-style: italic; color: #555;">[Kolom Isian Singkat Siswa: ........................................................................]</div>`;
    } else if (q.type === 'ESSAY') {
      content += `<div style="margin-left: 20px; font-style: italic; color: #555;">[Kolom Uraian / Jawaban Esai Siswa:...................................................................................................................................................]</div>`;
    }

    content += `</div>`;
  });

  // Kunci Jawaban di Halaman Terpisah
  content += `
    <div class="kunci-footer">
      <h3 style="text-align: center;">LAMPIRAN KUNCI JAWABAN & RUBRIK ASESMEN</h3>
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; font-size: 10pt;">
        <tr style="background: #e5e7eb;">
          <th style="border: 1px solid #000; padding: 5px; width: 40px;">No</th>
          <th style="border: 1px solid #000; padding: 5px; width: 80px;">Tipe</th>
          <th style="border: 1px solid #000; padding: 5px;">Kunci Jawaban / Kriteria Penilaian</th>
          <th style="border: 1px solid #000; padding: 5px; width: 60px;">Poin</th>
        </tr>
  `;

  bank.questions.forEach((q, idx) => {
    let keyInfo = '';
    if (q.type === 'PG') {
      const mc = q as MultipleChoiceQuestion;
      const foundIdx = mc.options?.findIndex((o) => o.id === mc.correctOptionId);
      keyInfo = foundIdx >= 0 ? `${String.fromCharCode(65 + foundIdx)}. ${mc.options[foundIdx]?.text}` : 'A';
    } else if (q.type === 'PGK') {
      const pgk = q as ComplexMultipleChoiceQuestion;
      keyInfo = (pgk.correctOptionIds || []).map((id) => {
        const found = pgk.options?.findIndex((o) => o.id === id);
        return found >= 0 ? String.fromCharCode(65 + found) : id;
      }).join(', ');
    } else if (q.type === 'MATCHING') {
      keyInfo = ((q as MatchingQuestion).pairs || []).map((p) => `${p.premise} â†’ ${p.target}`).join(' | ');
    } else if (q.type === 'SHORT') {
      keyInfo = ((q as ShortAnswerQuestion).acceptableAnswers || []).join(' ATAU ');
    } else if (q.type === 'ESSAY') {
      const e = q as EssayQuestion;
      const kw = (e.rubric?.keyPoints || [])
        .flatMap((kp) => kp.mandatoryKeywords || [])
        .join(', ');
      keyInfo = `Ideal: ${e.rubric?.idealAnswer || 'Jawaban Uraian'} | Kata Kunci: ${kw || '-'}`;
    }

    content += `
      <tr>
        <td style="border: 1px solid #000; text-align: center; padding: 4px;">${q.number || idx + 1}</td>
        <td style="border: 1px solid #000; text-align: center; padding: 4px;">${q.type}</td>
        <td style="border: 1px solid #000; padding: 4px;">${keyInfo}</td>
        <td style="border: 1px solid #000; text-align: center; padding: 4px;">${q.points}</td>
      </tr>
    `;
  });

  content += `
      </table>
    </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Naskah_Soal_${bank.code.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
