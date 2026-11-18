/**
 * SmartCBT Pro - Hybrid Auto-Save IndexedDB Engine
 * Menyimpan jawaban siswa per-milidetik secara lokal di browser,
 * tahan banting terhadap crash, mati lampu, atau refresh paksa (F5).
 */

const DB_NAME = 'SmartCBT_OfflineExam_v1';
const DB_VERSION = 1;
const STORE_ANSWERS = 'answers';
const STORE_META = 'meta';

export interface LocalAnswerRecord {
  key: string; // `${examId}_${studentId}_${questionId}`
  examId: string;
  studentId: string;
  questionId: string;
  value: any;
  isDoubtful: boolean;
  updatedAt: number;
  isSynced: boolean;
}

export interface LocalExamMeta {
  key: string; // `${examId}_${studentId}`
  examId: string;
  studentId: string;
  currentIdx: number;
  timeLeft: number;
  tokenVerified: boolean;
  violationsCount: number;
  isLockedOut: boolean;
  lastSyncAt: number;
}

// Inisialisasi Database IndexedDB
export function openExamDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada lingkungan ini'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_ANSWERS)) {
        const answerStore = db.createObjectStore(STORE_ANSWERS, { keyPath: 'key' });
        answerStore.createIndex('by_exam_student', ['examId', 'studentId'], { unique: false });
        answerStore.createIndex('by_sync', 'isSynced', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 1. SIMPAN JAWABAN KE INDEXEDDB (PER-MILIDETIK)
 */
export async function saveLocalAnswer(
  examId: string,
  studentId: string,
  questionId: string,
  value: any,
  isDoubtful: boolean = false
): Promise<void> {
  const key = `${examId}_${studentId}_${questionId}`;
  const record: LocalAnswerRecord = {
    key,
    examId,
    studentId,
    questionId,
    value,
    isDoubtful,
    updatedAt: Date.now(),
    isSynced: false,
  };

  try {
    const db = await openExamDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ANSWERS, 'readwrite');
      const store = tx.objectStore(STORE_ANSWERS);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback cadangan ke localStorage jika IndexedDB bermasalah
    try {
      localStorage.setItem(`cbt_ans_${key}`, JSON.stringify(record));
    } catch {}
  }
}

/**
 * 2. AMBIL SELURUH JAWABAN DARI INDEXEDDB UNTUK RESTORASI
 */
export async function getAllLocalAnswers(
  examId: string,
  studentId: string
): Promise<Record<string, { value: any; isDoubtful: boolean; updatedAt: number }>> {
  const result: Record<string, { value: any; isDoubtful: boolean; updatedAt: number }> = {};

  try {
    const db = await openExamDatabase();
    const records = await new Promise<LocalAnswerRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_ANSWERS, 'readonly');
      const store = tx.objectStore(STORE_ANSWERS);
      const index = store.index('by_exam_student');
      const req = index.getAll(IDBKeyRange.only([examId, studentId]));
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    for (const rec of records) {
      result[rec.questionId] = {
        value: rec.value,
        isDoubtful: rec.isDoubtful,
        updatedAt: rec.updatedAt,
      };
    }
  } catch (err) {
    // Fallback scan localStorage
    if (typeof window !== 'undefined') {
      const prefix = `cbt_ans_${examId}_${studentId}_`;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k) || '');
            if (parsed && parsed.questionId) {
              result[parsed.questionId] = {
                value: parsed.value,
                isDoubtful: parsed.isDoubtful,
                updatedAt: parsed.updatedAt || Date.now(),
              };
            }
          } catch {}
        }
      }
    }
  }

  return result;
}

/**
 * 3. TANDAI JAWABAN SUDAH TERSINKRON KE DATABASE POSTGRESQL
 */
export async function markLocalAnswerSynced(
  examId: string,
  studentId: string,
  questionId: string
): Promise<void> {
  const key = `${examId}_${studentId}_${questionId}`;
  try {
    const db = await openExamDatabase();
    const tx = db.transaction(STORE_ANSWERS, 'readwrite');
    const store = tx.objectStore(STORE_ANSWERS);
    const getReq = store.get(key);
    getReq.onsuccess = () => {
      const record = getReq.result as LocalAnswerRecord;
      if (record) {
        record.isSynced = true;
        store.put(record);
      }
    };
  } catch {}
}

/**
 * 4. SIMPAN STATUS METADATA UJIAN (INDEX SOAL, SISA WAKTU, STATUS KUNCI)
 */
export async function saveLocalExamMeta(
  examId: string,
  studentId: string,
  meta: Partial<LocalExamMeta>
): Promise<void> {
  const key = `${examId}_${studentId}`;
  try {
    const db = await openExamDatabase();
    const tx = db.transaction(STORE_META, 'readwrite');
    const store = tx.objectStore(STORE_META);

    const getReq = store.get(key);
    getReq.onsuccess = () => {
      const existing: LocalExamMeta = getReq.result || {
        key,
        examId,
        studentId,
        currentIdx: 0,
        timeLeft: 5400,
        tokenVerified: false,
        violationsCount: 0,
        isLockedOut: false,
        lastSyncAt: Date.now(),
      };

      const updated: LocalExamMeta = {
        ...existing,
        ...meta,
        lastSyncAt: Date.now(),
      };

      store.put(updated);
    };
  } catch (err) {
    try {
      localStorage.setItem(`cbt_meta_${key}`, JSON.stringify(meta));
    } catch {}
  }
}

/**
 * 5. AMBIL METADATA STATUS UJIAN TERAKHIR
 */
export async function getLocalExamMeta(
  examId: string,
  studentId: string
): Promise<LocalExamMeta | null> {
  const key = `${examId}_${studentId}`;
  try {
    const db = await openExamDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_META, 'readonly');
      const store = tx.objectStore(STORE_META);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      const raw = localStorage.getItem(`cbt_meta_${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

/**
 * 6. BERSIHKAN PENYIMPANAN SETELAH SELESAI UJIAN
 */
export async function clearLocalExam(examId: string, studentId: string): Promise<void> {
  try {
    const db = await openExamDatabase();
    const tx = db.transaction([STORE_ANSWERS, STORE_META], 'readwrite');
    const answerStore = tx.objectStore(STORE_ANSWERS);
    const metaStore = tx.objectStore(STORE_META);

    metaStore.delete(`${examId}_${studentId}`);

    const index = answerStore.index('by_exam_student');
    const req = index.openCursor(IDBKeyRange.only([examId, studentId]));
    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  } catch {}
}
