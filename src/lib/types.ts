export type Role = 'operator' | 'guru' | 'siswa' | 'superadmin';

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: string; // e.g. "VI" or "X"
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  username: string;
  passwordText: string;
  jabatan: string; // e.g. "Guru Mapel"
  waliKelas?: string;
  kajur?: string;
  geminiApiKey?: string;
  assignedSubjectIds: string[];
}

export interface Student {
  id: string;
  noPeserta: string;
  name: string;
  nisn: string;
  nis: string;
  level: string;
  className: string;
  jurusan: string;
  username: string;
  passwordText: string;
  room: string;
  session: string;
  server: string;
  photoUrl?: string;
  isActive?: boolean;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  jurusan: string;
  waliKelas: string;
  totalStudents: number;
}

export interface ExamRoom {
  id: string;
  code: string;
  name: string;
  capacity: number;
  proctorName: string;
  serverName: string;
}

export interface ExamSessionInfo {
  id: string;
  sessionNumber: number;
  name: string;
  timeRange: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface ExamTypeMaster {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface MajorMaster {
  id: string;
  code: string;
  name: string;
  field?: string;
  totalClasses?: number;
  isActive: boolean;
}

export interface LevelMaster {
  id: string;
  code: string;
  name: string;
  order: number;
  totalClasses?: number;
  description?: string;
}

export interface ServerMaster {
  id: string;
  code: string;
  name: string;
  ipAddress: string;
  status: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  assignedRooms?: string;
  lastPing?: string;
}

export type QuestionType = 'PG' | 'PGK' | 'MATCHING' | 'SHORT' | 'ESSAY';

export interface KeyPoint {
  concept: string;
  weight: number;
  mandatoryKeywords: string[];
  synonyms?: string[][];
}

export interface EssayRubric {
  idealAnswer: string;
  maxScore: number;
  keyPoints: KeyPoint[];
  strictness?: 'lenient' | 'standard' | 'strict';
}

export interface MatchingPair {
  id: string;
  premise: string;
  target: string;
}

export interface BaseQuestion {
  id: string;
  number: number;
  type: QuestionType;
  prompt: string;
  points: number;
  subjectId?: string;
  imageUrl?: string;      // URL atau Base64 Gambar Soal
  imageCaption?: string;  // Keterangan / Sumber Gambar
  audioUrl?: string;      // Audio listening (jika ada)
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'PG';
  options: { id: string; text: string; imageUrl?: string }[];
  correctOptionId: string;
}

export interface ComplexMultipleChoiceQuestion extends BaseQuestion {
  type: 'PGK';
  subtype: 'multi_select' | 'true_false';
  options: { id: string; text: string; imageUrl?: string }[];
  correctOptionIds?: string[];
  trueFalseRows?: { id: string; statement: string; isTrue: boolean }[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'MATCHING';
  pairs: MatchingPair[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'SHORT';
  acceptableAnswers: string[];
}

export interface EssayQuestion extends BaseQuestion {
  type: 'ESSAY';
  rubric: EssayRubric;
}

export type Question =
  | MultipleChoiceQuestion
  | ComplexMultipleChoiceQuestion
  | MatchingQuestion
  | ShortAnswerQuestion
  | EssayQuestion;

export interface ExamSchedule {
  id: string;
  code: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subject?: string;
  level: string;
  grade?: string;
  className: string;
  teacherId: string;
  teacherName: string;
  examDate: string; // e.g. "18 May 2026"
  startTime: string; // e.g. "17:00"
  endTime: string; // e.g. "19:00"
  dayOfWeek: 'MINGGU' | 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';
  durationMinutes: number;
  sessionNumber: number;
  isActive: boolean;
  totalQuestions: number;
  tokenRequired: boolean;
  activeToken: string;
  proctorPin: string;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  examType?: string;
  finishButtonTime?: string;
  autoActiveMinutes?: number;
  kkm?: number;
  remedialCount?: number;
  showResult?: boolean;
  resetLogin?: boolean;
  saveAnswerHistory?: boolean;
  questions: Question[];
}

export type Exam = ExamSchedule;

export interface QuestionBank {
  id: string;
  code: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  level: string;
  className: string;
  jurusan: string;
  teacherId: string;
  teacherName: string;
  format: 'CBT_STANDARD' | 'AKM_KOMPLEKS';
  specificStudents?: string;
  pgCount: number;
  pgDisplayCount: number;
  pgWeight: number;
  pgOptionCount: number;
  essayCount: number;
  essayDisplayCount: number;
  essayWeight: number;
  isActive: boolean;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EssayEvaluationResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  earnedPoints: {
    concept: string;
    score: number;
    maxScore: number;
    matchedKeywords: string[];
    isFulfilled: boolean;
    reason: string;
  }[];
  feedback: string;
}

export interface StudentSession {
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  subjectName: string;
  status: 'BELUM_MULAI' | 'SEDANG_MENGERJAKAN' | 'TERKUNCI' | 'SELESAI';
  violationsCount: number;
  durationFormatted: string; // e.g. "1m 31d"
  correctCount: number;
  wrongCount: number;
  ipAddress: string;
  answers: Record<string, any>;
  essayEvaluations: Record<string, EssayEvaluationResult>;
  totalScore?: number;
  maxPossibleScore?: number;
  lastActive: string;
}

export interface ViolationRecord {
  id: string;
  studentName: string;
  subjectCode: string;
  className: string;
  violationCount: number;
  maxAllowed: number;
  status: 'Batas Terlampaui' | 'Peringatan' | 'Aman';
  violationTypes: string[];
  lastTime: string;
  isBlocked: boolean;
}

export type ThemeColorKey =
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'slate'
  | 'rose'
  | 'amber'
  | 'clean_light'
  | 'stealth_onyx'
  | 'ocean_teal'
  | 'classic_espresso'
  | 'custom';

export interface SchoolBrandingSettings {
  schoolName: string;
  subName: string;
  npsn: string;
  jenjang: 'MI/SD' | 'MTs/SMP' | 'MA/SMA/SMK' | 'UNIVERSITAS / UMUM';
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  proktorName: string;
  nipProktor: string;
  logoType: 'madrasah' | 'kemdikbud' | 'custom' | 'pesantren' | 'techno';
  customLogoUrl?: string;
  studentLoginLogoUrl?: string; // Logo/Avatar kustom tampilan Login Siswa
  loginHeroImageUrl?: string;   // Gambar Banner / Ilustrasi Hero Login Guru & Operator
  loginBgImageUrl?: string;     // Wallpaper Latar Belakang Login (Opsional)
  operatorLogoUrl?: string;     // Logo/Badge form login Guru & Operator
  themeColor: ThemeColorKey;
  // 4-Color Combination Layer
  primaryColor?: string;     // Hex # - Warna Utama (Brand / Header / Tombol Aksi)
  secondaryColor?: string;   // Hex # - Warna Aksen (Sorotan / Badge / Bintang)
  bgColor?: string;          // Hex # - Warna Latar Belakang Layar
  surfaceColor?: string;     // Hex # - Warna Panel Kontainer / Sidebar / Card
  themeMode?: 'dark' | 'light' | 'navy' | 'forest' | 'custom';
  loginHeroText: string;
  loginSubText: string;
  enableWatermark: boolean;
  watermarkOpacity: number;
  maxViolationsAllowed: number;
  enableFullscreenLock: boolean;
  enableAutoSave: boolean;
  allowTokenBypass: boolean;
  hideDemoLogin?: boolean; // Menyembunyikan tombol demo/testing saat ujian resmi sekolah
}
