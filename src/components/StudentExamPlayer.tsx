'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ShieldAlert,
  Maximize2,
  Minimize2,
  Clock,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Unlock,
  KeyRound,
  FileCheck2,
  Database,
  CloudCheck,
  Check,
  EyeOff,
  RefreshCw,
  Loader2,
  X,
  ZoomIn,
  Volume2,
  VolumeX,
  Type,
  PartyPopper,
  Smile,
  Trophy,
  Award,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Exam, Question, EssayEvaluationResult, SchoolBrandingSettings } from '../lib/types';
import { evaluateEssay } from '../lib/essay-evaluator';
import {
  saveLocalAnswer,
  getAllLocalAnswers,
  saveLocalExamMeta,
  getLocalExamMeta,
  markLocalAnswerSynced,
  clearLocalExam,
} from '../lib/indexed-db';
import {
  startExamAttemptAction,
  backgroundSyncAnswerAction,
  recordViolationAction,
  unlockAttemptWithPinAction,
  getAttemptStatusAction,
  submitExamAttemptAction,
} from '../app/actions/attempt-actions';

interface StudentExamPlayerProps {
  exam: Exam;
  tokenRequired: boolean;
  activeToken: string;
  studentId?: string;
  studentName?: string;
  studentNisn?: string;
  studentNoPeserta?: string;
  branding?: SchoolBrandingSettings;
  onStudentFinished?: (score: number, total: number) => void;
  onViolationReported?: (count: number) => void;
}

export default function StudentExamPlayer({
  exam,
  tokenRequired,
  activeToken,
  studentId = 'std_demo_1',
  studentName = 'ARJUN',
  studentNisn = '0098765432',
  studentNoPeserta = '05-021-001-8',
  branding,
  onStudentFinished,
  onViolationReported,
}: StudentExamPlayerProps) {
  const effectiveStudentId = studentId || studentNisn || 'std_default';

  // ==============================================================
  // 1. STATE TOKEN GATE & ATTEMPT ID
  // ==============================================================
  const [enteredToken, setEnteredToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isTokenVerified, setIsTokenVerified] = useState(!tokenRequired);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isStartingAttempt, setIsStartingAttempt] = useState(false);

  // ==============================================================
  // 2. STATE PROGRESS LEMBAR UJIAN & HYBRID AUTO-SAVE
  // ==============================================================
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncSuccess, setLastSyncSuccess] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');

  // ==============================================================
  // 3. STATE VECTOR ANTI-CHEAT & GRACE PERIOD (4 DETIK)
  // ==============================================================
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState(0);
  const [maxViolations, setMaxViolations] = useState(branding?.maxViolationsAllowed || 3);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [proctorPinInput, setProctorPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Grace Period Overlay State
  const [isBlurOverlayActive, setIsBlurOverlayActive] = useState(false);
  const [graceSecondsLeft, setGraceSecondsLeft] = useState(4);
  const graceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blurStartTimeRef = useRef<number>(0);

  // Toast Notifikasi Halus
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  // Lightbox / Image Zoom Modal
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [zoomedImageCaption, setZoomedImageCaption] = useState<string | null>(null);

  // Multi-Jenjang Detector (SD / MI, SMP / MTs, SMA / MA / SMK)
  const schoolJenjang: 'SD' | 'SMP' | 'SMA' = useMemo(() => {
    if (branding?.jenjang === 'MI/SD') return 'SD';
    if (branding?.jenjang === 'MTs/SMP') return 'SMP';
    if (branding?.jenjang === 'MA/SMA/SMK') return 'SMA';
    const lvl = (exam.level || '').toUpperCase();
    if (['I', 'II', 'III', 'IV', 'V', 'VI', '1', '2', '3', '4', '5', '6'].includes(lvl)) return 'SD';
    if (['VII', 'VIII', 'IX', '7', '8', '9'].includes(lvl)) return 'SMP';
    return 'SMA';
  }, [branding?.jenjang, exam.level]);

  // Mode Hemat Kuota & Offline PWA State (Resiliensi Wi-Fi Lab)
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        showToast('Koneksi internet / WiFi lab kembali online 🟢 Sinkronisasi aktif.', 'success');
      };
      const handleOffline = () => {
        setIsOnline(false);
        showToast('Jaringan terputus / offline 🟡 Mode Offline aktif! Jawaban aman di IndexedDB.', 'warn');
      };
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Audio Text-to-Speech (TTS) / Soal Bersuara State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Pilihan Ukuran Huruf (A- / A / A+)
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartcbt_font_size');
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') {
        setFontSizeMode(saved);
      } else if (schoolJenjang === 'SD') {
        setFontSizeMode('large'); // default ramah baca untuk tingkat SD
      }
    } catch {}
  }, [schoolJenjang]);

  // Stiker / Pesan Apresiasi Maskot (Setiap 5 Nomor Soal Terjawab)
  const [lastMilestoneShown, setLastMilestoneShown] = useState<number>(0);
  const [mascotMilestone, setMascotMilestone] = useState<{
    count: number;
    title: string;
    message: string;
    sticker: string;
  } | null>(null);

  // ==============================================================
  // 4. FLOATING WATERMARK REALTIME CLOCK
  // ==============================================================
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper Toast
  const showToast = (text: string, type: 'success' | 'warn' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ==============================================================
  // 5. INISIALISASI & RESTORE DARI INDEXEDDB (TAHAN REFRESH F5)
  // ==============================================================
  useEffect(() => {
    async function restoreFromIndexedDB() {
      try {
        // Ambil dari IndexedDB lokal terlebih dahulu
        const localAnswers = await getAllLocalAnswers(exam.id, effectiveStudentId);
        const localMeta = await getLocalExamMeta(exam.id, effectiveStudentId);

        const restoredAnswers: Record<string, any> = {};
        const restoredFlagged: Record<string, boolean> = {};

        Object.keys(localAnswers).forEach((qId) => {
          restoredAnswers[qId] = localAnswers[qId].value;
          if (localAnswers[qId].isDoubtful) restoredFlagged[qId] = true;
        });

        if (Object.keys(restoredAnswers).length > 0) {
          setAnswers((prev) => ({ ...restoredAnswers, ...prev }));
          setFlagged((prev) => ({ ...restoredFlagged, ...prev }));
        }

        if (localMeta) {
          if (localMeta.currentIdx !== undefined) setCurrentIdx(localMeta.currentIdx);
          if (localMeta.timeLeft && localMeta.timeLeft > 0) setTimeLeft(localMeta.timeLeft);
          if (localMeta.tokenVerified) setIsTokenVerified(true);
          if (localMeta.violationsCount) setViolations(localMeta.violationsCount);
          if (localMeta.isLockedOut) setIsLockedOut(true);
        }
      } catch (err) {
        console.warn('Gagal membaca IndexedDB:', err);
      }
    }

    restoreFromIndexedDB();
  }, [exam.id, effectiveStudentId]);

  // ==============================================================
  // 6. TOKEN VERIFICATION & ATTEMPT START
  // ==============================================================
  const handleVerifyTokenAndStart = async () => {
    if (tokenRequired && !enteredToken.trim()) {
      setTokenError('Token ujian wajib diisi!');
      return;
    }

    setIsStartingAttempt(true);
    setTokenError('');

    try {
      const res = await startExamAttemptAction({
        examId: exam.id,
        studentId: effectiveStudentId,
        enteredToken: enteredToken.trim().toUpperCase(),
      });

      if (!res.success || !res.data) {
        setTokenError(res.error || 'Token tidak valid!');
        setIsStartingAttempt(false);
        return;
      }

      setAttemptId(res.data.attemptId);
      setIsTokenVerified(true);
      setMaxViolations(res.data.maxViolationsAllowed || 3);
      setViolations(res.data.violationsCount || 0);
      setIsLockedOut(res.data.isLocked || false);

      if (res.data.remainingSeconds) {
        setTimeLeft(res.data.remainingSeconds);
      }

      // Merge saved answers dari PostgreSQL jika ada
      if (res.data.savedAnswers && Object.keys(res.data.savedAnswers).length > 0) {
        setAnswers((prev) => ({ ...res.data?.savedAnswers, ...prev }));
      }
      if (res.data.flaggedQuestions) {
        setFlagged((prev) => ({ ...res.data?.flaggedQuestions, ...prev }));
      }

      // Simpan status verified ke IndexedDB
      await saveLocalExamMeta(exam.id, effectiveStudentId, {
        tokenVerified: true,
        timeLeft: res.data.remainingSeconds,
      });

      // Request fullscreen otomatis saat mulai
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }

      showToast('Ujian dimulai. Jawaban Anda tersimpan otomatis di IndexedDB.', 'success');
    } catch (err: any) {
      setTokenError('Terjadi kesalahan saat memulai ujian: ' + err.message);
    } finally {
      setIsStartingAttempt(false);
    }
  };

  // ==============================================================
  // 7. TIMER COUNTDOWN
  // ==============================================================
  useEffect(() => {
    if (!isTokenVerified || isSubmitted || isLockedOut) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }

        // Simpan sisa waktu ke IndexedDB setiap 15 detik
        if (prev % 15 === 0) {
          saveLocalExamMeta(exam.id, effectiveStudentId, { timeLeft: prev - 1 });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTokenVerified, isSubmitted, isLockedOut, exam.id, effectiveStudentId]);

  // ==============================================================
  // 8. HYBRID AUTO-SAVE ENGINE: LOCAL (INDEXEDDB) + REMOTE (POSTGRESQL)
  // ==============================================================
  // Trigger pesan apresiasi maskot setiap 5 soal terjawab
  const triggerMascotEncouragement = (count: number) => {
    let title = '';
    let message = '';
    let sticker = '⭐';

    if (schoolJenjang === 'SD') {
      const messages: Record<number, string> = {
        5: 'Luar biasa! 🐻‍❄️ Kamu sudah selesai menjawab 5 soal pertama! Tetap teliti ya, kamu anak hebat! ⭐',
        10: 'Hore! 🌟 10 soal sudah berhasil kamu kerjakan! Istirahatkan mata sejenak lalu lanjut lagi ya!',
        15: 'Keren banget! 🚀 15 soal tuntas! Maskot beruang bangga sekali sama ketelitianmu!',
        20: 'Wah hebat juara! 🏆 20 soal sudah terisi rapi! Periksa kembali jawabanmu sebelum selesai ya!',
      };
      title = `Pencapaian Hebat! (${count} Soal Selesai)`;
      message = messages[count] || `Hebat sekali! ${count} soal telah kamu jawab! Tetap fokus ya! 🌟`;
      sticker = count % 10 === 0 ? '🏆' : '⭐';
    } else if (schoolJenjang === 'SMP') {
      title = `Progres Mantap! (${count} Soal Terjawab)`;
      message = count % 10 === 0
        ? `Luar biasa! ${count} soal telah dikerjakan. Manfaatkan waktu dengan cermat dan jaga ketelitian!`
        : `Kerja bagus! ${count} butir soal telah terselesaikan. Ritme ujianmu sangat solid!`;
      sticker = '🎯';
    } else {
      title = `Milestone Asesmen (${count} Soal Terjawab)`;
      message = `Konsistensi luar biasa! ${count} soal telah selesai dikerjakan. Pertahankan fokus analisa dan penalaran Anda.`;
      sticker = '🎖️';
    }

    setMascotMilestone({ count, title, message, sticker });

    // Auto-dismiss after 6.5 seconds
    setTimeout(() => {
      setMascotMilestone((cur) => (cur?.count === count ? null : cur));
    }, 6500);
  };

  // Audio Text-to-Speech (TTS) / Soal Bersuara
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setToastMessage({ text: 'Perangkat atau browser ini belum mendukung fitur suara otomatis.', type: 'warn' });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Susun narasi pembacaan ramah telinga
    const cleanPrompt = (currentQuestion.prompt || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    let textToRead = `Soal nomor ${currentQuestion.number}. `;
    textToRead += `${cleanPrompt}. `;

    const isShortType = currentQuestion.type === 'SHORT' || (currentQuestion as any).type === 'SHORT_ANSWER' || (currentQuestion as any).type === 'ISIAN' || (currentQuestion as any).type === 'ISIAN_SINGKAT';
    const isEssayType = currentQuestion.type === 'ESSAY' || (currentQuestion as any).type === 'URAIAN';

    if (currentQuestion.type === 'PG' && currentQuestion.options) {
      textToRead += 'Pilihan jawaban: ';
      currentQuestion.options.forEach((opt, idx) => {
        const char = String.fromCharCode(65 + idx);
        textToRead += `Pilihan ${char}, ${opt.text}. `;
      });
    } else if (currentQuestion.type === 'PGK' && currentQuestion.options) {
      textToRead += 'Pilihan pernyataan: ';
      currentQuestion.options.forEach((opt, idx) => {
        const char = String.fromCharCode(65 + idx);
        textToRead += `Pilihan ${char}, ${opt.text}. `;
      });
    } else if (currentQuestion.type === 'MATCHING') {
      const qPairs = ((currentQuestion as any).pairs || (currentQuestion as any).matchingPairs || []) as any[];
      if (qPairs.length > 0) {
        textToRead += 'Jodohkan pernyataan berikut. ';
        qPairs.forEach((p: any, idx: number) => {
          textToRead += `Pernyataan ${idx + 1}: ${p.premise}. `;
        });
      }
    } else if (isShortType) {
      textToRead += 'Tuliskan jawaban singkat Anda pada kolom isian. ';
    } else if (isEssayType) {
      textToRead += 'Tuliskan uraian jawaban Anda pada kotak esai. ';
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = schoolJenjang === 'SD' ? 0.90 : 0.95; // Sedikit lebih perlahan untuk anak SD
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesia'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Simpan instan per-milidetik ke IndexedDB lokal saat siswa memilih jawaban
  const handleAnswerChange = async (questionId: string, value: any) => {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(nextAnswers);

    // Hitung soal terjawab untuk milestone apresiasi maskot setiap 5 soal
    const answeredCount = Object.keys(nextAnswers).filter((k) => {
      const v = nextAnswers[k];
      if (v === undefined || v === null || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      if (typeof v === 'object' && Object.keys(v).length === 0) return false;
      return true;
    }).length;

    if (answeredCount > 0 && answeredCount % 5 === 0 && answeredCount !== lastMilestoneShown) {
      setLastMilestoneShown(answeredCount);
      triggerMascotEncouragement(answeredCount);
    }

    // Simpan ke IndexedDB lokal
    await saveLocalAnswer(
      exam.id,
      effectiveStudentId,
      questionId,
      value,
      flagged[questionId] || false
    );

    // Update meta
    await saveLocalExamMeta(exam.id, effectiveStudentId, {
      currentIdx,
      timeLeft,
    });
  };

  // Toggle Ragu-ragu
  const toggleFlag = async (questionId: string) => {
    const nextVal = !flagged[questionId];
    setFlagged((prev) => ({
      ...prev,
      [questionId]: nextVal,
    }));

    await saveLocalAnswer(
      exam.id,
      effectiveStudentId,
      questionId,
      answers[questionId] ?? null,
      nextVal
    );
  };

  // Background Sync ke PostgreSQL setiap kali siswa berpindah nomor soal
  const triggerBackgroundSync = async (targetQuestionIdx: number) => {
    if (!attemptId) return;

    const currentQ = exam.questions[currentIdx];
    if (!currentQ) return;

    const currentAns = answers[currentQ.id];
    const isDoubt = flagged[currentQ.id] || false;

    setIsSyncing(true);
    try {
      const res = await backgroundSyncAnswerAction({
        attemptId,
        questionId: currentQ.id,
        questionType: currentQ.type,
        answerValue: currentAns,
        isDoubtful: isDoubt,
        remainingSeconds: timeLeft,
        currentQuestionIndex: targetQuestionIdx,
      });

      if (res.success) {
        setLastSyncSuccess(true);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        await markLocalAnswerSynced(exam.id, effectiveStudentId, currentQ.id);
      } else {
        setLastSyncSuccess(false);
      }
    } catch {
      setLastSyncSuccess(false);
    } finally {
      setIsSyncing(false);
    }
  };

  // Navigasi nomor soal dengan auto background sync
  const navigateToQuestion = (targetIdx: number) => {
    if (targetIdx === currentIdx) return;
    const safeIdx = Math.max(0, Math.min(exam.questions.length - 1, targetIdx));

    // Hentikan suara TTS jika sedang aktif saat berganti nomor
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    // 1. Trigger background sync data nomor sebelumnya ke PostgreSQL
    triggerBackgroundSync(safeIdx);

    // 2. Ubah index aktif
    setCurrentIdx(safeIdx);

    // 3. Simpan posisi ke IndexedDB
    saveLocalExamMeta(exam.id, effectiveStudentId, { currentIdx: safeIdx, timeLeft });
  };

  // ==============================================================
  // 9. VECTOR ANTI-CHEAT DENGAN GRACE PERIOD 4 DETIK
  // ==============================================================
  const triggerGracePeriodBlur = useCallback(() => {
    if (!isTokenVerified || isSubmitted || isLockedOut || isBlurOverlayActive) return;

    blurStartTimeRef.current = Date.now();
    setIsBlurOverlayActive(true);
    setGraceSecondsLeft(4);

    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    graceTimerRef.current = setInterval(() => {
      setGraceSecondsLeft((prev) => {
        if (prev <= 1) {
          // GRACE PERIOD 4 DETIK HABIS! CATAT PELANGGARAN KE DATABASE
          if (graceTimerRef.current) clearInterval(graceTimerRef.current);
          handleGracePeriodExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isTokenVerified, isSubmitted, isLockedOut, isBlurOverlayActive]);

  // Siswa kembali ke layar sebelum 4 detik habis -> BATALKAN TANPA PELANGGARAN
  const handleWindowRefocus = useCallback(() => {
    if (!isBlurOverlayActive) return;

    if (graceTimerRef.current) {
      clearInterval(graceTimerRef.current);
      graceTimerRef.current = null;
    }

    setIsBlurOverlayActive(false);
    setGraceSecondsLeft(4);
    showToast('Fokus layar kembali. Ujian dilanjutkan tanpa pelanggaran.', 'info');
  }, [isBlurOverlayActive]);

  // Grace Period 4 detik gagal / lewat batas -> CATAT PELANGGARAN KE DB
  const handleGracePeriodExpired = async () => {
    setIsBlurOverlayActive(false);
    const duration = Date.now() - blurStartTimeRef.current;

    const nextCount = violations + 1;
    setViolations(nextCount);
    onViolationReported?.(nextCount);

    if (attemptId) {
      try {
        const res = await recordViolationAction({
          attemptId,
          examId: exam.id,
          studentId: effectiveStudentId,
          violationType: 'GRACE_PERIOD_EXCEEDED',
          durationMs: duration,
          details: `Siswa keluar dari layar melebihi grace period 4 detik (${nextCount}/${maxViolations})`,
        });

        if (res.isLocked) {
          setIsLockedOut(true);
          await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: true });
        }
      } catch (err) {
        console.error('Gagal mencatat pelanggaran:', err);
      }
    }

    if (nextCount >= maxViolations) {
      setIsLockedOut(true);
      await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: true });
    } else {
      showToast(`Peringatan: Pelanggaran ke-${nextCount} dicatat oleh pengawas!`, 'warn');
    }
  };

  // Helper pencatatan pelanggaran langsung ke PostgreSQL & State
  const reportDirectViolation = useCallback(
    async (type: any, details: string, countAsStrike = true) => {
      if (!isTokenVerified || isSubmitted || isLockedOut) return;

      const nextCount = countAsStrike ? violations + 1 : violations;
      if (countAsStrike) {
        setViolations(nextCount);
        onViolationReported?.(nextCount);
      }

      if (attemptId) {
        try {
          const res = await recordViolationAction({
            attemptId,
            examId: exam.id,
            studentId: effectiveStudentId,
            violationType: type,
            durationMs: 1000,
            details: `${details} (${nextCount}/${maxViolations})`,
          });

          if (res.isLocked || nextCount >= maxViolations) {
            setIsLockedOut(true);
            await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: true });
          }
        } catch (err) {
          console.warn('Gagal record direct violation:', err);
        }
      }

      if (countAsStrike && nextCount >= maxViolations) {
        setIsLockedOut(true);
        await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: true });
      }
    },
    [attemptId, exam.id, effectiveStudentId, isTokenVerified, isSubmitted, isLockedOut, violations, maxViolations, onViolationReported]
  );

  // Event Listeners: window.onblur, visibilitychange, contextmenu, keydown, keyup, resize, fullscreenchange
  useEffect(() => {
    if (!isTokenVerified || isSubmitted || isLockedOut) return;

    const onBlur = () => {
      triggerGracePeriodBlur();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        triggerGracePeriodBlur();
      } else {
        handleWindowRefocus();
      }
    };

    const onFocus = () => {
      handleWindowRefocus();
    };

    // Deteksi Fullscreen Exit
    const onFullscreenChange = () => {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isCurrentlyFs);

      if (!isCurrentlyFs && isTokenVerified && !isSubmitted && !isLockedOut) {
        showToast('Peringatan: Anda keluar dari mode layar penuh (Fullscreen)!', 'warn');
        triggerGracePeriodBlur();
        reportDirectViolation('FULLSCREEN_EXIT', 'Keluar dari mode Fullscreen', false);
      }
    };

    // Deteksi Split-Screen / Jendela Ganda menyusut
    const onWindowResize = () => {
      if (!isTokenVerified || isSubmitted || isLockedOut) return;
      if (typeof window !== 'undefined' && window.screen) {
        // Jika layar desktop/laptop dipisah (lebar < 720px saat screen width >= 1024px)
        if (window.screen.width >= 1024 && window.innerWidth < 720) {
          showToast('Peringatan: Terdeteksi pembagian layar ganda (Split-Screen)! Kembalikan ukuran jendela.', 'warn');
          triggerGracePeriodBlur();
          reportDirectViolation('WINDOW_BLUR', 'Terdeteksi Split-Screen / Jendela Berdampingan', false);
        }
      }
    };

    // Deteksi Tangkapan Layar (PrintScreen / Screenshot)
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch {}
        showToast('Tangkapan layar (Screenshot) dilarang selama ujian!', 'warn');
        reportDirectViolation('KEYBOARD_SHORTCUT', 'Mencoba mengambil screenshot dengan tombol PrintScreen', false);
      }
    };

    // Blokir klik kanan
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast('Klik kanan dinonaktifkan demi keamanan ujian.', 'warn');
      reportDirectViolation('RIGHT_CLICK', 'Mencoba klik kanan mouse pada lembar soal', false);
    };

    // Blokir shortcut tombol inspect & copy-paste
    const onKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        showToast('F12 (Inspect) dilarang selama ujian!', 'warn');
        reportDirectViolation('DEVTOOLS_OPEN', 'Mencoba membuka inspect element (F12)');
        return;
      }

      // Ctrl+Shift+I / J / C
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        showToast('Developer tools dilarang!', 'warn');
        reportDirectViolation('DEVTOOLS_OPEN', `Mencoba shortcut developer tools (Ctrl+Shift+${e.key.toUpperCase()})`);
        return;
      }

      // Alt+Tab
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        showToast('Alt+Tab dilarang selama ujian!', 'warn');
        reportDirectViolation('KEYBOARD_SHORTCUT', 'Mencoba beralih aplikasi dengan Alt+Tab', false);
        return;
      }

      // Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, Ctrl+P, Ctrl+S, Ctrl+A
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'u', 'p', 's', 'a'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        showToast('Shortcut keyboard dinonaktifkan.', 'warn');
        reportDirectViolation('KEYBOARD_SHORTCUT', `Mencoba shortcut keyboard Ctrl+${e.key.toUpperCase()}`, false);
        return;
      }
    };

    // Blokir copy, cut, paste event
    const onCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast('Fungsi copy-paste dinonaktifkan pada lembar ujian.', 'warn');
      reportDirectViolation('COPY_PASTE', `Mencoba aksi ${e.type} pada lembar ujian`, false);
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('copy', onCopyCutPaste);
    document.addEventListener('cut', onCopyCutPaste);
    document.addEventListener('paste', onCopyCutPaste);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('copy', onCopyCutPaste);
      document.removeEventListener('cut', onCopyCutPaste);
      document.removeEventListener('paste', onCopyCutPaste);
      if (graceTimerRef.current) clearInterval(graceTimerRef.current);
    };
  }, [isTokenVerified, isSubmitted, isLockedOut, triggerGracePeriodBlur, handleWindowRefocus, reportDirectViolation]);

  // Polling Remote Unlock: Saat siswa terkunci, cek berkala apakah Pengawas telah membuka kunci dari Dashboard
  useEffect(() => {
    if (!isLockedOut || !attemptId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await getAttemptStatusAction(attemptId);
        if (res.success && !res.isLocked && res.status !== 'LOCKED') {
          setIsLockedOut(false);
          setViolations(0);
          setPinError('');
          await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: false, violationsCount: 0 });
          showToast('Ujian Anda telah dibuka kembali oleh Pengawas Ruangan!', 'success');
        }
      } catch (err) {
        // Abaikan error jaringan sementara saat polling
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isLockedOut, attemptId, exam.id, effectiveStudentId]);

  // Buka Kunci Layar dengan PIN Proktor
  const handleUnlockWithPin = async () => {
    if (!proctorPinInput.trim()) {
      setPinError('Masukkan PIN Pengawas!');
      return;
    }

    setIsUnlocking(true);
    setPinError('');

    try {
      if (attemptId) {
        const res = await unlockAttemptWithPinAction(attemptId, proctorPinInput.trim());
        if (!res.success) {
          setPinError(res.error || 'PIN Pengawas salah!');
          setIsUnlocking(false);
          return;
        }
      } else {
        // Fallback local check
        if (proctorPinInput.trim() !== exam.proctorPin) {
          setPinError('PIN Pengawas salah!');
          setIsUnlocking(false);
          return;
        }
      }

      setIsLockedOut(false);
      setViolations(0);
      setProctorPinInput('');
      setPinError('');
      await saveLocalExamMeta(exam.id, effectiveStudentId, { isLockedOut: false, violationsCount: 0 });
      showToast('Ujian berhasil dibuka kembali oleh pengawas.', 'success');
    } catch (err: any) {
      setPinError('Gagal membuka kunci: ' + err.message);
    } finally {
      setIsUnlocking(false);
    }
  };

  // ==============================================================
  // 10. SUBMIT FINAL UJIAN & PERHITUNGAN NILAI INSTAN
  // ==============================================================
  const [evaluationResults, setEvaluationResults] = useState<{
    objectiveScore: number;
    essayScore: number;
    totalScore: number;
    maxScore: number;
    essayDetails: Record<string, EssayEvaluationResult>;
  } | null>(null);

  const handleFinalSubmit = async () => {
    if (!confirm('Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban Anda akan dikirim dan dinilai.')) {
      return;
    }

    // 1. Simpan semua data lokal terakhir
    await triggerBackgroundSync(currentIdx);

    // 2. Evaluasi lokal untuk respons instan
    let objTotal = 0;
    let essTotal = 0;
    let maxTotal = 0;
    const detailsMap: Record<string, EssayEvaluationResult> = {};

    for (const q of exam.questions) {
      maxTotal += q.points;
      const ans = answers[q.id];

      if (q.type === 'PG') {
        if (ans === q.correctOptionId) objTotal += q.points;
      } else if (q.type === 'PGK' && q.subtype === 'multi_select') {
        const correctSet = new Set(q.correctOptionIds || []);
        const studentSet = new Set(Array.isArray(ans) ? ans : []);
        if (correctSet.size === studentSet.size && [...correctSet].every((id) => studentSet.has(id))) {
          objTotal += q.points;
        }
      } else if (q.type === 'MATCHING') {
        let matches = 0;
        const qPairs = (q as any).pairs || (q as any).matchingPairs || [];
        qPairs.forEach((p: any) => {
          if (ans && ans[p.id] === p.target) matches++;
        });
        if (qPairs.length > 0) objTotal += Math.round((matches / qPairs.length) * q.points);
      } else if (q.type === 'SHORT' || (q as any).type === 'SHORT_ANSWER' || (q as any).type === 'ISIAN' || (q as any).type === 'ISIAN_SINGKAT') {
        const clean = (ans || '').trim().toLowerCase();
        const rawAcceptable = (q as any).acceptableAnswers;
        const acceptable: string[] = Array.isArray(rawAcceptable)
          ? rawAcceptable
          : typeof rawAcceptable === 'string'
          ? rawAcceptable.split(',').map((s: string) => s.trim())
          : typeof (q as any).correctAnswer === 'string'
          ? [(q as any).correctAnswer]
          : [];
        if (acceptable.some((a: string) => a.trim().toLowerCase() === clean)) {
          objTotal += q.points;
        }
      } else if (q.type === 'ESSAY' || (q as any).type === 'URAIAN') {
        const res = evaluateEssay(ans || '', (q as any).rubric);
        detailsMap[q.id] = res;
        essTotal += res.totalScore;
      }
    }

    const finalTotal = objTotal + essTotal;

    setEvaluationResults({
      objectiveScore: objTotal,
      essayScore: essTotal,
      totalScore: finalTotal,
      maxScore: maxTotal,
      essayDetails: detailsMap,
    });

    setIsSubmitted(true);
    onStudentFinished?.(finalTotal, maxTotal);

    // 3. Submit ke database PostgreSQL jika ada attemptId
    if (attemptId) {
      try {
        await submitExamAttemptAction(attemptId, exam.id, effectiveStudentId, answers);
      } catch (err) {
        console.error('Gagal submit ke server:', err);
      }
    }

    // 4. Bersihkan IndexedDB
    await clearLocalExam(exam.id, effectiveStudentId);

    // Buka fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // ==============================================================
  // VIEW 1: TOKEN GATE (SEBELUM SOAL TERBUKA)
  // ==============================================================
  if (!isTokenVerified) {
    return (
      <div className="min-h-[560px] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#181c26] rounded-2xl shadow-2xl border border-slate-700/80 p-8 text-center text-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <KeyRound className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full inline-block mb-2">
            Token Gate Pengawas
          </span>

          <h2 className="text-xl font-bold text-white mb-1">{exam.title}</h2>
          <p className="text-xs text-slate-400 mb-6">
            Mata Pelajaran: <span className="font-semibold text-emerald-300">{exam.subjectName || exam.subject}</span> ({exam.className || 'Kelas X'})
          </p>

          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Protokol Keamanan & Anti-Cheat Aktif:</span>
            </div>
            <ul className="text-slate-300 text-[11px] space-y-1.5 pl-5 list-disc">
              <li>Layar ujian akan masuk ke mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
              <li>Toleransi pindah tab/notifikasi: <strong>Grace Period 4 detik</strong> sebelum blur overlay mengunci.</li>
              <li>Jawaban Anda tersimpan otomatis per-milidetik ke <strong>IndexedDB lokal</strong> & background sync ke PostgreSQL.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Masukkan Token Ujian (6 Karakter):
              </label>
              <input
                type="text"
                maxLength={8}
                value={enteredToken}
                onChange={(e) => setEnteredToken(e.target.value.toUpperCase())}
                placeholder="CONTOH: 36S7KS"
                className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 bg-[#12151d] border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-emerald-400 uppercase focus:outline-none transition-colors"
              />
              {tokenError && (
                <p className="text-xs text-red-400 mt-2 font-semibold flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {tokenError}
                </p>
              )}
            </div>

            <button
              onClick={handleVerifyTokenAndStart}
              disabled={isStartingAttempt}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isStartingAttempt ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Token & Menyiapkan Soal...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Mulai Mengerjakan Ujian</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 pt-2">
              Peserta: <strong className="text-slate-400">{studentName}</strong> (NISN: {studentNisn})
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // VIEW 2: LOCKOUT SCREEN (TERKUNCI KARENA PELANGGARAN MELEBIHI BATAS)
  // ==============================================================
  if (isLockedOut) {
    return (
      <div className="min-h-[580px] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1214] border-2 border-red-500/80 rounded-2xl shadow-2xl p-8 text-center text-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-950/80 border border-red-600/50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-wider text-red-400 uppercase bg-red-950/90 border border-red-800 px-3 py-1 rounded-full inline-block mb-3">
            Sistem Lockout Anti-Cheat
          </span>

          <h2 className="text-2xl font-black text-white mb-1">Ujian Anda Terkunci!</h2>
          <p className="text-xs text-red-300 mb-6 leading-relaxed">
            Sistem mendeteksi Anda meninggalkan layar ujian sebanyak{' '}
            <strong className="underline text-red-100">{violations} kali</strong> dan melewati batas toleransi grace period.
          </p>

          <div className="bg-[#120a0c] rounded-xl p-5 border border-red-900/80 text-left mb-6 shadow-inner space-y-3">
            <p className="text-xs text-slate-300">
              Silakan panggil <strong>Pengawas / Proktor Ruangan</strong> untuk membuka kembali lembar ujian menggunakan PIN Otorisasi:
            </p>
            <input
              type="password"
              maxLength={10}
              value={proctorPinInput}
              onChange={(e) => setProctorPinInput(e.target.value)}
              placeholder="Masukkan PIN Pengawas (default: 123456)"
              className="w-full text-center text-xl font-mono py-2.5 px-4 bg-[#1e1316] border border-red-800 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
            {pinError && <p className="text-xs text-red-400 font-semibold">{pinError}</p>}
            <button
              onClick={handleUnlockWithPin}
              disabled={isUnlocking}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              {isUnlocking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Membuka Kunci...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Buka Kunci Layar (Otorisasi Proktor)
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            ✓ Seluruh jawaban yang telah Anda isi tersimpan utuh dan aman di database IndexedDB & PostgreSQL.
          </p>
        </div>
      </div>
    );
  }

  // ==============================================================
  // VIEW 3: HASIL PENILAIAN INSTAN & REVIEW ESAI
  // ==============================================================
  if (isSubmitted && evaluationResults) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-[#181c26] rounded-2xl shadow-xl border border-slate-700 p-8 text-center text-slate-200">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Ujian Berhasil Diselesaikan!</h2>
          <p className="text-xs text-slate-400 mb-6">
            Hasil evaluasi instan koreksi otomatis objektif dan Local Semantic NLP Engine:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-[#12151d] p-4 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium">Skor Pilihan Ganda/Objektif</span>
              <p className="text-2xl font-bold text-white mt-1">{evaluationResults.objectiveScore}</p>
            </div>
            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Skor Esai (Auto AI NLP)
              </span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{evaluationResults.essayScore}</p>
            </div>
            <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-800/60">
              <span className="text-[11px] text-blue-300 font-medium">Total Skor Akhir</span>
              <p className="text-3xl font-black text-blue-400 mt-1">
                {evaluationResults.totalScore}
                <span className="text-sm text-slate-400 font-normal">/{evaluationResults.maxScore}</span>
              </p>
            </div>
          </div>

          <div className="text-left border-t border-slate-700/80 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Rincian Koreksi Butir Soal Esai (Local Semantic Rubric NLP):
            </h3>

            <div className="space-y-4">
              {exam.questions
                .filter((q) => q.type === 'ESSAY')
                .map((q) => {
                  const evalData = evaluationResults.essayDetails[q.id];
                  const studentText = answers[q.id] || '(Tidak dijawab)';
                  if (!evalData) return null;

                  return (
                    <div key={q.id} className="bg-[#12151d] rounded-xl p-5 border border-slate-700 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                            Soal No. {q.number} (Esai)
                          </span>
                          <p className="text-xs font-semibold text-slate-200 mt-1">{q.prompt}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 shrink-0">
                          Skor: {evalData.totalScore} / {evalData.maxScore}
                        </span>
                      </div>

                      <div className="bg-[#181c26] p-3 rounded-lg border border-slate-700/80 text-xs text-slate-300">
                        <strong className="text-slate-400 block mb-1">Jawaban yang Ditulis Siswa:</strong>
                        <p className="italic font-sans leading-relaxed">{studentText}</p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <strong className="text-[11px] text-slate-400 block">
                          Pemeriksaan Kata Kunci Konsep oleh Mesin NLP:
                        </strong>
                        {evalData.earnedPoints.map((ep, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                              ep.isFulfilled
                                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                                : ep.score > 0
                                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                                : 'bg-red-950/40 border-red-800/80 text-red-200'
                            }`}
                          >
                            {ep.isFulfilled ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between font-semibold">
                                <span>{ep.concept}</span>
                                <span>
                                  {ep.score}/{ep.maxScore} Poin
                                </span>
                              </div>
                              <p className="text-[11px] opacity-80 mt-0.5">{ep.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-300 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/60">
                        <strong className="text-blue-400">Ulasan Evaluasi:</strong> {evalData.feedback}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIdx] || exam.questions[0];

  // ==============================================================
  // VIEW 4: LEMBAR SOAL UTAMA SISWA (WITH ALL FEATURES)
  // ==============================================================
  return (
    <div className="relative min-h-[720px] flex flex-col font-sans select-none">
      {/* ============================================================ */}
      {/* A. FLOATING WATERMARK OVERLAY (ANTI-CAMERA LEAK / FOTO HP)    */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none opacity-[0.07]">
        <div className="w-[160%] h-[160%] -ml-[30%] -mt-[30%] flex flex-wrap gap-12 -rotate-12 items-center justify-center text-slate-100 font-mono text-[11px] uppercase tracking-wider font-extrabold">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap px-3 py-1.5 border border-white/20 rounded">
              {studentName} • NISN: {studentNisn} • {studentNoPeserta} • {currentTimeStr} • CBT-SECURE
            </div>
          ))}
        </div>
      </div>

      {/* Floating moving dynamic pill watermark */}
      <div className="fixed bottom-3 right-3 pointer-events-none z-30 bg-black/40 border border-slate-700/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 flex items-center gap-1.5 opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>
          {studentName} ({studentNisn}) • {currentTimeStr}
        </span>
      </div>

      {/* ============================================================ */}
      {/* B. GRACE PERIOD CSS BLUR OVERLAY (4 DETIK TOLERANSI BLUR)     */}
      {/* ============================================================ */}
      {isBlurOverlayActive && (
        <div
          onClick={handleWindowRefocus}
          className="fixed inset-0 z-50 backdrop-blur-3xl bg-black/90 flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer animate-in fade-in duration-100"
        >
          <div className="max-w-md w-full bg-[#1e1316] border-2 border-amber-500 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
              <EyeOff className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-amber-400 uppercase tracking-wide">
                Fokus Layar Ujian Terlepas!
              </h2>
              <p className="text-xs text-slate-300">
                Sistem mendeteksi Anda berpindah ke tab atau aplikasi lain.
              </p>
            </div>

            {/* Countdown Lingkaran Besar */}
            <div className="py-2">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-amber-950/60 flex flex-col items-center justify-center mx-auto shadow-lg animate-pulse">
                <span className="text-3xl font-black text-white font-mono">{graceSecondsLeft}</span>
                <span className="text-[9px] uppercase font-bold text-amber-400">Detik</span>
              </div>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-amber-900/60 text-[11px] text-amber-200/90 leading-relaxed">
              Segera <strong>klik di mana saja pada layar ini</strong> atau kembali ke tab ujian sebelum waktu habis agar tidak dicatat sebagai pelanggaran!
            </div>

            <button
              onClick={handleWindowRefocus}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Kembali ke Lembar Ujian Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* C. TOAST NOTIFIKASI SEMENTARA                                */}
      {/* ============================================================ */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-40 animate-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                : toastMessage.type === 'warn'
                ? 'bg-amber-950 border-amber-600 text-amber-200'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* D. HEADER BAR (TIMER, FULLSCREEN, HYBRID AUTO-SAVE STATUS)   */}
      {/* ============================================================ */}
      <header className="bg-[#181c26] rounded-2xl border border-slate-700/80 p-4 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full inline-block">
            {exam.subjectName || exam.subject} • {exam.className || 'Kelas X'}
          </span>
          <h1 className="text-sm md:text-base font-extrabold text-white mt-1">{exam.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Status Jaringan & Mode Offline PWA */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/80 border-amber-500/80 text-amber-300 animate-pulse'
            }`}
            title={
              isOnline
                ? 'Koneksi Server Online: Jawaban disinkronkan ke PostgreSQL & IndexedDB'
                : 'Mode Hemat Kuota / Offline Aktif: Jawaban aman tersimpan di IndexedDB browser'
            }
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold">Online 🟢</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold">Mode Offline (IndexedDB) 🟡</span>
              </>
            )}
          </div>

          {/* Status Hybrid Auto-Save */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[#12151d] text-slate-300 font-mono text-[11px]"
            title={`Status Auto-Save: Tersimpan di IndexedDB & PostgreSQL (${lastSyncTime})`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Auto-Save:</span>
            {isSyncing ? (
              <span className="text-amber-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Syncing...
              </span>
            ) : lastSyncSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ IndexedDB
              </span>
            ) : (
              <span className="text-slate-400">Lokal</span>
            )}
          </div>

          {/* Sisa Waktu Ujian */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold border transition-colors ${
              timeLeft < 300
                ? 'bg-red-950/80 border-red-700 text-red-300 animate-pulse'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {/* Pelanggaran Count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px]">
            <ShieldAlert className={`w-3.5 h-3.5 ${violations > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-slate-300">
              Pelanggaran: <strong className={violations > 0 ? 'text-amber-400' : 'text-white'}>{violations}/{maxViolations}</strong>
            </span>
          </div>

          {/* Pilihan Ukuran Huruf (A- / A / A+) */}
          <div className="flex items-center gap-1 bg-[#12151d] border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
            <span className="text-[10px] text-slate-400 px-1 font-bold flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Huruf:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setFontSizeMode('normal');
                try { localStorage.setItem('smartcbt_font_size', 'normal'); } catch {}
              }}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'normal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Ukuran Standar"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => {
                setFontSizeMode('large');
                try { localStorage.setItem('smartcbt_font_size', 'large'); } catch {}
              }}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'large'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Ukuran Sedang (Rekomendasi SD)"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => {
                setFontSizeMode('xlarge');
                try { localStorage.setItem('smartcbt_font_size', 'xlarge'); } catch {}
              }}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'xlarge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Ukuran Besar (Mudah Dibaca)"
            >
              A+
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* PWA / OFFLINE LAB RESILIENCE BANNER */}
      {!isOnline && (
        <div className="bg-amber-950/90 border border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>
              <strong>Mode Offline CBT Aktif:</strong> Koneksi WiFi lab terputus sementara. Ujian tetap berjalan normal, seluruh jawaban tersimpan aman di <strong>IndexedDB browser lokal</strong> dan akan otomatis disinkronkan saat jaringan pulih.
            </span>
          </div>
          <span className="self-start sm:self-auto px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase shrink-0">
            PWA Offline Cache
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/* E. KONTEN SOAL & DAFTAR NOMOR                                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        {/* KOLOM KIRI (3/4): LEMBAR SOAL AKTIF */}
        <div className="lg:col-span-3 bg-[#181c26] rounded-2xl border border-slate-700/80 p-6 flex flex-col justify-between shadow-md">
          <div>
            {/* Header Soal */}
            <div className="flex justify-between items-center border-b border-slate-700/80 pb-3 mb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center text-xs shadow-md ${
                  schoolJenjang === 'SD' ? 'bg-amber-500 text-slate-950 font-black' :
                  schoolJenjang === 'SMP' ? 'bg-teal-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {currentQuestion.number}
                </span>

                {/* Tombol Audio Text-to-Speech (Soal Bersuara) */}
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse shadow-md font-extrabold'
                      : 'bg-[#12151d] hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border-slate-700'
                  }`}
                  title={isSpeaking ? 'Hentikan Pembacaan Soal' : 'Dengarkan Soal Dibacakan (Text-to-Speech)'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Berhenti</span>
                      <span className="flex items-center gap-0.5 ml-1">
                        <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 Dengarkan Soal</span>
                    </>
                  )}
                </button>

                {/* Badge Tipe Soal Ramah Jenjang */}
                <span className="text-[11px] font-bold uppercase text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">
                  {currentQuestion.type === 'PG' && (schoolJenjang === 'SD' ? 'Pilihan Ganda (1 Jawaban)' : 'Pilihan Ganda (Single Choice)')}
                  {currentQuestion.type === 'PGK' && (schoolJenjang === 'SD' ? 'Pilihan Ganda Kompleks (Bisa > 1 Jawaban)' : 'Pilihan Ganda Kompleks (Multi-Select)')}
                  {currentQuestion.type === 'MATCHING' && (schoolJenjang === 'SD' ? 'Menjodohkan Pasangan' : 'Menjodohkan (Matching Pairs)')}
                  {(currentQuestion.type === 'SHORT' || (currentQuestion as any).type === 'SHORT_ANSWER' || (currentQuestion as any).type === 'ISIAN' || (currentQuestion as any).type === 'ISIAN_SINGKAT') && 'Isian Singkat'}
                  {(currentQuestion.type === 'ESSAY' || (currentQuestion as any).type === 'URAIAN') && (schoolJenjang === 'SD' ? 'Uraian / Esai' : 'Uraian / Esai (Auto-Grade AI)')}
                </span>

                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  {currentQuestion.points} Poin
                </span>
              </div>

              {/* Tombol Ragu-ragu */}
              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border ${
                  flagged[currentQuestion.id]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {flagged[currentQuestion.id] ? 'Ditandai Ragu-ragu' : 'Ragu-ragu'}
              </button>
            </div>

            {/* Narasi / Teks Pertanyaan Soal */}
            <div className={`text-white leading-relaxed font-normal mb-6 transition-all ${
              fontSizeMode === 'normal' ? 'text-sm md:text-base' :
              fontSizeMode === 'large' ? 'text-base md:text-lg font-medium' :
              'text-lg md:text-xl font-medium'
            }`}>
              {/<[a-z][\s\S]*>/i.test(currentQuestion.prompt) ? (
                <div
                  className="prose prose-invert max-w-none [&_img]:max-h-80 [&_img]:rounded-xl [&_img]:my-3 [&_img]:border [&_img]:border-slate-700 [&_img]:object-contain [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.prompt }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{currentQuestion.prompt}</div>
              )}
            </div>

            {/* Stimulus Gambar Soal Jika Tersedia */}
            {currentQuestion.imageUrl && (
              <div className="mb-6 p-4 rounded-2xl bg-[#0e121a] border border-slate-700/80 shadow-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                    Stimulus Gambar Soal
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomedImageUrl(currentQuestion.imageUrl || null);
                      setZoomedImageCaption(currentQuestion.imageCaption || null);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Perbesar Tampilan
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.imageCaption || 'Gambar Stimulus Soal'}
                    className="max-h-72 w-auto object-contain rounded-xl border border-slate-800 bg-black/40 cursor-zoom-in hover:opacity-95 transition-all shadow-inner"
                    onClick={() => {
                      setZoomedImageUrl(currentQuestion.imageUrl || null);
                      setZoomedImageCaption(currentQuestion.imageCaption || null);
                    }}
                  />
                  {currentQuestion.imageCaption && (
                    <p className="mt-2.5 text-center text-xs text-slate-400 italic font-medium">
                      {currentQuestion.imageCaption}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* INPUT JAWABAN SESUAI TIPE SOAL ANBK */}
            <div className="space-y-3">
              {/* 1. Tipe PG (Pilihan Ganda Biasa) */}
              {currentQuestion.type === 'PG' && (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    const charCode = String.fromCharCode(65 + i);

                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          fontSizeMode === 'normal' ? 'text-xs md:text-sm' :
                          fontSizeMode === 'large' ? 'text-sm md:text-base font-medium' :
                          'text-base md:text-lg font-medium'
                        } ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold shadow-sm'
                            : 'bg-[#12151d] border-slate-700/80 hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${currentQuestion.id}`}
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQuestion.id, opt.id)}
                          className="hidden"
                        />
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {charCode}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* 2. Tipe PGK (Pilihan Ganda Kompleks - Multi Select) */}
              {currentQuestion.type === 'PGK' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400 italic mb-2">
                    *Pilih semua pilihan pernyataan yang benar (dapat memilih lebih dari satu):
                  </p>
                  {currentQuestion.options.map((opt, i) => {
                    const currentSelected: string[] = Array.isArray(answers[currentQuestion.id])
                      ? answers[currentQuestion.id]
                      : [];
                    const isChecked = currentSelected.includes(opt.id);
                    const charCode = String.fromCharCode(65 + i);

                    const toggleCheck = () => {
                      if (isChecked) {
                        handleAnswerChange(
                          currentQuestion.id,
                          currentSelected.filter((id) => id !== opt.id)
                        );
                      } else {
                        handleAnswerChange(currentQuestion.id, [...currentSelected, opt.id]);
                      }
                    };

                    return (
                      <div
                        key={opt.id}
                        onClick={toggleCheck}
                        className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          fontSizeMode === 'normal' ? 'text-xs md:text-sm' :
                          fontSizeMode === 'large' ? 'text-sm md:text-base font-medium' :
                          'text-base md:text-lg font-medium'
                        } ${
                          isChecked
                            ? 'bg-blue-950/60 border-blue-500 text-white font-semibold shadow-sm'
                            : 'bg-[#12151d] border-slate-700/80 hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                            isChecked
                              ? 'bg-blue-500 text-white border-blue-400'
                              : 'border-slate-600 bg-slate-800 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="w-5 font-mono font-bold text-slate-400 text-xs">{charCode}.</span>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Tipe Menjodohkan (Matching Pairs) */}
              {currentQuestion.type === 'MATCHING' && (() => {
                const pairsList = ((currentQuestion as any).pairs || (currentQuestion as any).matchingPairs || []) as any[];
                if (pairsList.length === 0) {
                  return (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center">
                      Pasangan soal menjodohkan belum dikonfigurasi oleh guru.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-300 italic flex items-center gap-1.5">
                      <span>💡 <strong>Petunjuk:</strong> Pasangkan pernyataan di kotak kiri dengan jawaban yang tepat di kotak kanan.</span>
                    </p>
                    {pairsList.map((pair: any, idx: number) => {
                      const currentMatches: Record<string, string> = answers[currentQuestion.id] || {};
                      const selectedTarget = currentMatches[pair.id] || '';

                      return (
                        <div
                          key={pair.id || `pair_${idx}`}
                          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#12151d] border border-slate-700/80 hover:border-slate-600 rounded-xl transition-colors shadow-sm ${
                            fontSizeMode === 'normal' ? 'text-xs md:text-sm' :
                            fontSizeMode === 'large' ? 'text-sm md:text-base' :
                            'text-base md:text-lg'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/40">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-white leading-relaxed">{pair.premise}</span>
                          </div>
                          <select
                            value={selectedTarget}
                            onChange={(e) => {
                              const updated = { ...currentMatches, [pair.id]: e.target.value };
                              handleAnswerChange(currentQuestion.id, updated);
                            }}
                            className={`bg-[#181c26] border border-slate-700 rounded-lg py-2.5 px-3.5 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer min-w-[220px] ${
                              fontSizeMode === 'normal' ? 'text-xs md:text-sm' :
                              fontSizeMode === 'large' ? 'text-sm md:text-base' :
                              'text-base md:text-lg'
                            }`}
                          >
                            <option value="">-- Pilih Pasangan Jawaban --</option>
                            {pairsList.map((p: any, pIdx: number) => (
                              <option key={p.id || `target_${pIdx}`} value={p.target}>
                                {p.target}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* 4. Tipe Isian Singkat */}
              {(currentQuestion.type === 'SHORT' || (currentQuestion as any).type === 'SHORT_ANSWER' || (currentQuestion as any).type === 'ISIAN' || (currentQuestion as any).type === 'ISIAN_SINGKAT') && (
                <div className="space-y-2">
                  <label className={`block font-semibold text-slate-300 ${
                    fontSizeMode === 'normal' ? 'text-xs' :
                    fontSizeMode === 'large' ? 'text-sm' : 'text-base'
                  }`}>
                    Tuliskan Jawaban Singkat Anda:
                  </label>
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Ketik jawaban singkat di sini..."
                    className={`w-full py-3 px-4 bg-[#12151d] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono ${
                      fontSizeMode === 'normal' ? 'text-sm' :
                      fontSizeMode === 'large' ? 'text-base' :
                      'text-lg'
                    }`}
                  />
                  <span className="text-[11px] text-slate-500">
                    *Pemeriksaan jawaban mengabaikan huruf besar/kecil (case-insensitive).
                  </span>
                </div>
              )}

              {/* 5. Tipe Esai (Auto-Grading AI Rubrik) */}
              {(currentQuestion.type === 'ESSAY' || (currentQuestion as any).type === 'URAIAN') && (
                <div className="space-y-2">
                  <textarea
                    rows={6}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Tuliskan uraian jawaban Anda secara komprehensif di sini..."
                    className={`w-full p-4 bg-[#12151d] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans ${
                      fontSizeMode === 'normal' ? 'text-xs md:text-sm' :
                      fontSizeMode === 'large' ? 'text-sm md:text-base' :
                      'text-base md:text-lg'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>
                      Jumlah Kata:{' '}
                      <strong className="text-slate-200 font-mono">
                        {(answers[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" /> Dinilai otomatis berbasis rubrik kata kunci
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigasi Bawah: Sebelumnya & Selanjutnya */}
          <div className="flex justify-between items-center border-t border-slate-700/80 pt-5 mt-6">
            <button
              onClick={() => navigateToQuestion(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
            </button>

            {currentIdx === exam.questions.length - 1 ? (
              <button
                onClick={handleFinalSubmit}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" /> Selesaikan Ujian
              </button>
            ) : (
              <button
                onClick={() => navigateToQuestion(currentIdx + 1)}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                Soal Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (1/4): DAFTAR NOMOR SOAL & STATUS */}
        <div className="bg-[#181c26] rounded-2xl border border-slate-700/80 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Daftar Nomor Soal
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                {Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length}/{exam.questions.length}
              </span>
            </div>

            {/* Grid Tombol Nomor Soal */}
            <div className="grid grid-cols-4 gap-2">
              {exam.questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                const isFlag = flagged[q.id];
                const isCurrent = currentIdx === idx;

                let btnBg = 'bg-[#12151d] text-slate-400 border-slate-700 hover:border-slate-500';
                if (isCurrent) {
                  btnBg = 'ring-2 ring-emerald-400 bg-emerald-950/80 text-white border-emerald-400 font-extrabold';
                } else if (isFlag) {
                  btnBg = 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold';
                } else if (isAnswered) {
                  btnBg = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => navigateToQuestion(idx)}
                    className={`h-10 rounded-xl text-xs flex items-center justify-center border transition-all cursor-pointer ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legenda Warna */}
            <div className="mt-6 pt-4 border-t border-slate-700 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400" />
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-500" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#12151d] border border-slate-700" />
                <span>Belum Dijawab</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinalSubmit}
            className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" /> Selesai & Kumpulkan
          </button>
        </div>
      </div>

      {/* Floating Mascot Milestone Celebration Modal (Diposisikan di kiri bawah agar tidak menutupi tombol selesai) */}
      {mascotMilestone && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#182030] to-slate-900 border-2 border-emerald-500/80 p-4 shadow-2xl backdrop-blur-md">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              {/* Mascot / Badge Avatar based on schoolJenjang */}
              <div className="shrink-0 flex items-center justify-center">
                {schoolJenjang === 'SD' ? (
                  <div className="w-14 h-14 rounded-2xl bg-white/10 p-1 border border-white/20 shadow-md flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="28" cy="28" r="14" fill="#E2E8F0" />
                      <circle cx="28" cy="28" r="8" fill="#FBCFE8" />
                      <circle cx="72" cy="28" r="14" fill="#E2E8F0" />
                      <circle cx="72" cy="28" r="8" fill="#FBCFE8" />
                      <circle cx="50" cy="54" r="38" fill="#F8FAFC" />
                      <ellipse cx="40" cy="48" rx="4.5" ry="6" fill="#1E293B" />
                      <circle cx="41.5" cy="46" r="1.5" fill="#FFFFFF" />
                      <ellipse cx="60" cy="48" rx="4.5" ry="6" fill="#1E293B" />
                      <circle cx="61.5" cy="46" r="1.5" fill="#FFFFFF" />
                      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1E293B" />
                      <path d="M 46 61 Q 50 65 54 61" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <circle cx="34" cy="56" r="4.5" fill="#FDA4AF" opacity="0.6" />
                      <circle cx="66" cy="56" r="4.5" fill="#FDA4AF" opacity="0.6" />
                    </svg>
                  </div>
                ) : schoolJenjang === 'SMP' ? (
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shadow-md text-2xl">
                    🎯
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shadow-md text-2xl">
                    🎖️
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-bold text-emerald-400">{mascotMilestone.title}</span>
                  <span className="text-base">{mascotMilestone.sticker}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {mascotMilestone.message}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-emerald-300">
                    {mascotMilestone.count} / {exam.questions.length} Butir Soal Terjawab
                  </span>
                  <span className="italic">Otomatis tertutup dalam beberapa detik</span>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setMascotMilestone(null)}
                className="absolute top-0 right-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup pesan apresiasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Image Zoom Modal */}
      {zoomedImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => {
            setZoomedImageUrl(null);
            setZoomedImageCaption(null);
          }}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#121620] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-200 px-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-emerald-400" />
                Peninjauan Gambar Stimulus Soal
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoomedImageUrl(null);
                  setZoomedImageCaption(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={zoomedImageUrl}
                alt="Zoomed Question"
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>
            {zoomedImageCaption && (
              <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-300 italic">
                {zoomedImageCaption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
