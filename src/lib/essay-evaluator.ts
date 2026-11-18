import { EssayRubric, EssayEvaluationResult, KeyPoint } from './types';

// ==============================================================
// 1. KAMUS SINONIM & VARIASI KATA KUNCI BAHASA INDONESIA
// ==============================================================
export const INDONESIAN_SYNONYM_DICTIONARY: Record<string, string[]> = {
  oksigen: ['o2', 'gas oksigen', 'zat oksigen'],
  'karbon dioksida': ['co2', 'karbondioksida', 'zat asam arang', 'gas co2'],
  cahaya: ['sinar', 'radiasi', 'pancaran', 'foton'],
  matahari: ['surya', 'mentari'],
  glukosa: ['karbohidrat', 'gula', 'energi kimia', 'zat makanan', 'amilum', 'pati', 'c6h12o6'],
  klorofil: ['zat hijau daun', 'pigmen hijau', 'kloroplas'],
  tumbuhan: ['tanaman', 'flora', 'vegetasi'],
  air: ['h2o'],
  menghasilkan: ['memproduksi', 'menciptakan', 'membentuk', 'melepaskan', 'mengeluarkan', 'sintesis'],
  proses: ['tahapan', 'mekanisme', 'cara kerja', 'reaksi'],
  organ: ['bagian tubuh', 'alat tubuh'],
  pernapasan: ['respirasi', 'bernapas'],
  alveolus: ['gelembung paru paru', 'kantong udara', 'alveoli'],
  pertukaran: ['pergantian', 'difusi', 'sirkulasi', 'penyerapan'],
  darah: ['pembuluh darah', 'sel darah merah', 'eritrosit', 'hemoglobin'],
  penyebab: ['faktor', 'pemicu', 'alasan', 'latar belakang', 'dasar'],
  perang: ['pertempuran', 'perlawanan', 'konflik', 'pemberontakan', 'agresi'],
  belanda: ['kolonial', 'penjajah', 'voc', 'pemerintah hindia belanda'],
  pajak: ['upeti', 'pungutan', 'tribute'],
  makam: ['kuburan', 'tanah leluhur', 'pesarean', 'pusara'],
  patok: ['tonggak', 'tanda batas', 'pancang'],
  mitosis: ['pembelahan sel tubuh', 'somatis', 'diploid', '2n'],
  meiosis: ['pembelahan reduksi', 'gamet', 'sel kelamin', 'haploid'],
};

// ==============================================================
// 2. DAFTAR KATA NEGASI BAHASA INDONESIA (NEGATION DETECTION)
// ==============================================================
export const NEGATION_WORDS = new Set([
  'tidak',
  'bukan',
  'tanpa',
  'belum',
  'jangan',
  'kurang',
  'tiada',
  'tak',
  'bukanlah',
  'ndak',
  'nggak',
  'tidaklah',
  'tidak ada',
]);

/**
 * Normalisasi teks: hilangkan tanda baca, lowercase, spasi ganda
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenisasi teks menjadi array kata
 */
export function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(Boolean);
}

// ==============================================================
// 3. FUZZY TYPO TOLERANCE (LEVENSHTEIN DISTANCE)
// ==============================================================

/**
 * Menghitung jarak Levenshtein antara string a dan string b
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Memeriksa kecocokan kata tunggal dengan toleransi salah ketik (typo 1-2 huruf)
 */
export function isWordFuzzyMatch(
  token: string,
  targetWord: string
): { isMatch: boolean; distance: number } {
  const a = token.toLowerCase();
  const b = targetWord.toLowerCase();

  if (a === b) return { isMatch: true, distance: 0 };

  const maxLen = Math.max(a.length, b.length);
  // Kata sangat pendek (< 4 huruf) tidak ditoleransi typo (contoh: air, o2, dan)
  if (maxLen < 4) return { isMatch: false, distance: 99 };

  const dist = levenshteinDistance(a, b);

  // Panjang 4-6 huruf: toleransi 1 karakter salah ketik (contoh: kloropil -> klorofil)
  if (maxLen <= 6 && dist <= 1) {
    return { isMatch: true, distance: dist };
  }

  // Panjang >= 7 huruf: toleransi hingga 2 karakter salah ketik (contoh: fotosintesa -> fotosintesis)
  if (maxLen >= 7 && dist <= 2) {
    return { isMatch: true, distance: dist };
  }

  return { isMatch: false, distance: dist };
}

// ==============================================================
// 4. PENDETEKSI KATA KUNCI + NEGASI + FUZZY TYPO
// ==============================================================

export interface KeywordMatchResult {
  found: boolean;
  matchedTerm: string;
  isNegated: boolean;
  negationTerm?: string;
  isFuzzy: boolean;
  fuzzyDistance?: number;
  matchIndex?: number;
}

/**
 * Memeriksa apakah kata/frasa kunci ada dalam teks siswa,
 * sekaligus mendeteksi apakah didahului oleh kata negasi (dalam jarak 1-3 kata)
 * atau merupakan kecocokan fuzzy karena salah ketik.
 */
export function checkKeywordWithNegationAndFuzzy(
  studentTokens: string[],
  keyword: string,
  extraSynonyms?: string[]
): KeywordMatchResult {
  const normKeyword = normalizeText(keyword);
  const keywordTokens = tokenize(normKeyword);

  // Kumpulkan kandidat: kata kunci asli + sinonim
  const candidatePhrases: string[] = [normKeyword];

  if (INDONESIAN_SYNONYM_DICTIONARY[normKeyword]) {
    candidatePhrases.push(...INDONESIAN_SYNONYM_DICTIONARY[normKeyword].map(normalizeText));
  }
  if (extraSynonyms && extraSynonyms.length > 0) {
    candidatePhrases.push(...extraSynonyms.map(normalizeText));
  }

  // Cari apakah ada sinonim parsial
  for (const [key, synonyms] of Object.entries(INDONESIAN_SYNONYM_DICTIONARY)) {
    if (normKeyword.includes(key)) {
      candidatePhrases.push(...synonyms.map(normalizeText));
    }
  }

  // Iterasi teks siswa untuk menemukan kecocokan (Exact atau Fuzzy)
  for (const phrase of candidatePhrases) {
    const pTokens = tokenize(phrase);
    const pLen = pTokens.length;

    for (let i = 0; i <= studentTokens.length - pLen; i++) {
      let matchCount = 0;
      let totalDist = 0;

      for (let j = 0; j < pLen; j++) {
        const studentWord = studentTokens[i + j];
        const targetWord = pTokens[j];

        const fuzzy = isWordFuzzyMatch(studentWord, targetWord);
        if (fuzzy.isMatch) {
          matchCount++;
          totalDist += fuzzy.distance;
        }
      }

      // Jika seluruh kata dalam frasa cocok (exact maupun fuzzy)
      if (matchCount === pLen) {
        // PERIKSA NEGASI: Periksa 1-3 kata sebelum posisi kata kunci
        let isNegated = false;
        let negationTerm = '';

        const lookbackStart = Math.max(0, i - 3);
        for (let k = lookbackStart; k < i; k++) {
          const prevWord = studentTokens[k];
          if (NEGATION_WORDS.has(prevWord)) {
            isNegated = true;
            negationTerm = prevWord;
            break;
          }
        }

        const matchedTerm = studentTokens.slice(i, i + pLen).join(' ');

        return {
          found: true,
          matchedTerm,
          isNegated,
          negationTerm: isNegated ? negationTerm : undefined,
          isFuzzy: totalDist > 0,
          fuzzyDistance: totalDist,
          matchIndex: i,
        };
      }
    }
  }

  return { found: false, matchedTerm: '', isNegated: false, isFuzzy: false };
}

// ==============================================================
// 5. EVALUASI LENGKAP JAWABAN ESAI SISWA
// ==============================================================

export function evaluateEssay(
  studentAnswer: string,
  rubric: EssayRubric
): EssayEvaluationResult {
  const cleanAnswer = normalizeText(studentAnswer);
  const studentTokens = tokenize(cleanAnswer);

  if (!cleanAnswer || studentTokens.length < 2) {
    return {
      totalScore: 0,
      maxScore: rubric.maxScore,
      percentage: 0,
      earnedPoints: rubric.keyPoints.map((kp) => ({
        concept: kp.concept,
        score: 0,
        maxScore: kp.weight,
        matchedKeywords: [],
        isFulfilled: false,
        reason: 'Jawaban kosong atau terlalu singkat untuk dinilai.',
      })),
      feedback: 'Jawaban belum diisi atau terlalu singkat untuk dinilai.',
    };
  }

  let totalEarnedScore = 0;
  const breakdown = [];

  for (const keyPoint of rubric.keyPoints) {
    const validMatches: string[] = [];
    const negatedMatches: { keyword: string; negationWord: string }[] = [];
    const fuzzyMatches: { keyword: string; matched: string; dist: number }[] = [];
    const missingKeywords: string[] = [];

    const customSynonyms = keyPoint.synonyms?.flat();

    // Periksa setiap kata kunci wajib
    for (const keyword of keyPoint.mandatoryKeywords) {
      const result = checkKeywordWithNegationAndFuzzy(studentTokens, keyword, customSynonyms);

      if (result.found) {
        if (result.isNegated) {
          // NEGASI TERDETEKSI: Kata kunci ditemukan tetapi berlawanan arti!
          negatedMatches.push({
            keyword,
            negationWord: result.negationTerm || 'tidak',
          });
        } else {
          // Valid match
          validMatches.push(result.matchedTerm);
          if (result.isFuzzy) {
            fuzzyMatches.push({
              keyword,
              matched: result.matchedTerm,
              dist: result.fuzzyDistance || 1,
            });
          }
        }
      } else {
        missingKeywords.push(keyword);
      }
    }

    const totalKeywords = keyPoint.mandatoryKeywords.length;
    let earnedPoint = 0;
    let isFulfilled = false;
    let reason = '';

    if (totalKeywords === 0) {
      earnedPoint = keyPoint.weight;
      isFulfilled = true;
      reason = 'Konsep umum terpenuhi.';
    } else {
      const matchRatio = validMatches.length / totalKeywords;

      // Jika terdapat negasi langsung terhadap konsep utama
      if (negatedMatches.length > 0 && validMatches.length === 0) {
        earnedPoint = 0;
        isFulfilled = false;
        reason = `Poin dianulir karena terdapat pernyataan negasi/sanggahan ('${negatedMatches[0].negationWord} ${negatedMatches[0].keyword}') pada konsep ini.`;
      } else if (matchRatio >= 0.75) {
        earnedPoint = keyPoint.weight;
        isFulfilled = true;
        let note = `Konsep terpenuhi dengan baik (memuat: ${validMatches.join(', ')})`;
        if (fuzzyMatches.length > 0) {
          note += ` [Toleransi salah ketik: ${fuzzyMatches.map((f) => `'${f.matched}'~'${f.keyword}'`).join(', ')}]`;
        }
        reason = note;
      } else if (matchRatio >= 0.35) {
        earnedPoint = Math.round(keyPoint.weight * 0.5 * 10) / 10;
        isFulfilled = false;
        let note = `Konsep terjawab sebagian (terdeteksi: ${validMatches.join(', ')}, belum ada: ${missingKeywords.join(', ')})`;
        if (negatedMatches.length > 0) {
          note += ` (Catatan: '${negatedMatches[0].negationWord} ${negatedMatches[0].keyword}' berpotensi menganulir poin)`;
        }
        reason = note;
      } else {
        earnedPoint = 0;
        isFulfilled = false;
        reason = `Konsep belum tersampaikan. Kata kunci yang diharapkan: ${keyPoint.mandatoryKeywords.join(', ')}.`;
      }
    }

    totalEarnedScore += earnedPoint;
    breakdown.push({
      concept: keyPoint.concept,
      score: earnedPoint,
      maxScore: keyPoint.weight,
      matchedKeywords: validMatches,
      isFulfilled,
      reason,
    });
  }

  // Batasi total score tidak melebihi maxScore
  const finalScore = Math.min(Math.round(totalEarnedScore * 10) / 10, rubric.maxScore);
  const percentage = Math.round((finalScore / rubric.maxScore) * 100);

  // Buat kesimpulan umpan balik komprehensif
  let feedback = '';
  if (percentage >= 90) {
    feedback = 'Luar biasa! Pemahaman konsep sangat lengkap, akurat, dan argumen tersusun dengan sempurna.';
  } else if (percentage >= 70) {
    feedback = 'Bagus! Sebagian besar konsep inti sudah dijelaskan dengan tepat, hanya ada detail kecil yang terlewat.';
  } else if (percentage >= 40) {
    feedback = 'Cukup. Beberapa konsep dasar sudah disebutkan, namun penjelasan pendukung atau akurasi konsep masih kurang.';
  } else {
    feedback = 'Perlu ditingkatkan. Jawaban belum memuat poin-poin konsep penting yang diharapkan oleh pertanyaan.';
  }

  return {
    totalScore: finalScore,
    maxScore: rubric.maxScore,
    percentage,
    earnedPoints: breakdown,
    feedback,
  };
}
