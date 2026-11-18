'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Eye,
  Edit3,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  FileText,
  Sparkles,
  Printer,
  Upload,
  Download,
  AlertTriangle,
  HelpCircle,
  Check,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  ListOrdered,
  Tag,
  GraduationCap,
  Users,
  Image as ImageIcon,
  ZoomIn,
  FileSpreadsheet,
} from 'lucide-react';
import {
  downloadExcelTemplate,
  parseExcelToQuestions,
  exportBankSoalToExcel,
  exportBankSoalToWord,
} from '@/lib/bank-soal-excel';
import {
  QuestionBank,
  Question,
  QuestionType,
  Teacher,
  Subject,
  SchoolClass,
  LevelMaster,
  MajorMaster,
  MultipleChoiceQuestion,
  ComplexMultipleChoiceQuestion,
  MatchingQuestion,
  ShortAnswerQuestion,
  EssayQuestion,
} from '@/lib/types';

interface BankSoalManagementViewProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes?: SchoolClass[];
  levels?: LevelMaster[];
  majors?: MajorMaster[];
  initialQuestionBanks?: QuestionBank[];
  onQuestionBanksChange?: (banks: QuestionBank[]) => void;
  onOpenPrint?: (examCode: string) => void;
}

// SMA Question Banks
export const DEFAULT_QUESTION_BANKS: QuestionBank[] = [
  {
    id: 'bank_sos_x',
    code: 'SOS-KLS-X-1',
    subjectId: 'sub_sos',
    subjectCode: 'SOS',
    subjectName: 'SOSIOLOGI',
    level: 'X',
    className: 'X IPS 1, X IPS 2',
    jurusan: 'IPS',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 70,
    pgOptionCount: 5,
    essayCount: 5,
    essayDisplayCount: 5,
    essayWeight: 30,
    isActive: true,
    questions: [
      {
        id: 'q_sos_1',
        number: 1,
        type: 'PG',
        prompt: 'Sosiologi lahir sebagai ilmu pengetahuan yang mempelajari masyarakat pada abad ke-19. Tokoh yang pertama kali memperkenalkan istilah sosiologi dalam bukunya "Cours de Philosophie Positive" adalah ....',
        points: 20,
        options: [
          { id: 'opt_s1_a', text: 'Auguste Comte' },
          { id: 'opt_s1_b', text: 'Karl Marx' },
          { id: 'opt_s1_c', text: 'Emile Durkheim' },
          { id: 'opt_s1_d', text: 'Max Weber' },
          { id: 'opt_s1_e', text: 'Herbert Spencer' },
        ],
        correctOptionId: 'opt_s1_a',
      },
      {
        id: 'q_sos_2',
        number: 2,
        type: 'PG',
        prompt: 'Interaksi sosial dapat terjadi jika memenuhi dua syarat utama, yaitu ....',
        points: 20,
        options: [
          { id: 'opt_s2_a', text: 'Kontak sosial dan komunikasi' },
          { id: 'opt_s2_b', text: 'Imitasi dan sugesti' },
          { id: 'opt_s2_c', text: 'Status dan peranan' },
          { id: 'opt_s2_d', text: 'Asimilasi dan akulturasi' },
          { id: 'opt_s2_e', text: 'Norma dan nilai sosial' },
        ],
        correctOptionId: 'opt_s2_a',
      },
      {
        id: 'q_sos_3',
        number: 3,
        type: 'ESSAY',
        prompt: 'Jelaskan perbedaan mendasar antara diferensiasi sosial dan stratifikasi sosial dalam struktur masyarakat, serta berikan masing-masing dua contoh konkretnya di Indonesia!',
        points: 30,
        rubric: {
          idealAnswer: 'Diferensiasi sosial adalah pembedaan masyarakat secara horizontal (sejajar) tanpa tingkatan kelas, seperti suku bangsa, agama, dan ras. Sedangkan stratifikasi sosial adalah pembedaan masyarakat secara vertikal bertingkat (hierarkis), seperti tingkat kekayaan, pendidikan, dan kekuasaan.',
          maxScore: 30,
          strictness: 'standard',
          keyPoints: [
            {
              concept: 'Diferensiasi sosial bersifat horizontal/sejajar tanpa kelas (suku, agama, gender)',
              weight: 15,
              mandatoryKeywords: ['horizontal', 'sejajar', 'diferensiasi'],
            },
            {
              concept: 'Stratifikasi sosial bersifat vertikal/bertingkat/hierarkis (ekonomi, jabatan, pendidikan)',
              weight: 15,
              mandatoryKeywords: ['vertikal', 'bertingkat', 'hierarki', 'stratifikasi'],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'bank_ppkn_x',
    code: 'PPKN-KLS-X-1',
    subjectId: 'sub_ppkn',
    subjectCode: 'PPKN',
    subjectName: 'PPKN',
    level: 'X',
    className: 'Semua Kelas X',
    jurusan: 'Semua Jurusan',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 100,
    pgOptionCount: 5,
    essayCount: 0,
    essayDisplayCount: 0,
    essayWeight: 0,
    isActive: true,
    questions: [
      {
        id: 'q_pkn_1',
        number: 1,
        type: 'PG',
        prompt: 'Sila kedua Pancasila "Kemanusiaan yang adil dan beradab" memiliki nilai instrumental dan praksis yang menjunjung tinggi ....',
        points: 25,
        options: [
          { id: 'opt_pk1_a', text: 'Hak asasi manusia dan kesetaraan derajat' },
          { id: 'opt_pk1_b', text: 'Kedaulatan rakyat melalui musyawarah' },
          { id: 'opt_pk1_c', text: 'Keadilan sosial dalam distribusi ekonomi' },
          { id: 'opt_pk1_d', text: 'Persatuan seluruh suku bangsa Indonesia' },
          { id: 'opt_pk1_e', text: 'Ketaatan terhadap ritual peribadatan' },
        ],
        correctOptionId: 'opt_pk1_a',
      },
      {
        id: 'q_pkn_2',
        number: 2,
        type: 'PG',
        prompt: 'Menurut UUD Negara Republik Indonesia Tahun 1945, pembagian kekuasaan negara secara horizontal menempatkan Mahkamah Konstitusi sebagai pemegang kekuasaan ....',
        points: 25,
        options: [
          { id: 'opt_pk2_a', text: 'Yudikatif' },
          { id: 'opt_pk2_b', text: 'Eksekutif' },
          { id: 'opt_pk2_c', text: 'Legislatif' },
          { id: 'opt_pk2_d', text: 'Eksaminatif' },
          { id: 'opt_pk2_e', text: 'Inspektif' },
        ],
        correctOptionId: 'opt_pk2_a',
      },
    ],
  },
  {
    id: 'bank_mat_x',
    code: 'MAT-KLS-X-1',
    subjectId: 'sub_mat',
    subjectCode: 'MAT',
    subjectName: 'MATEMATIKA WAJIB',
    level: 'X',
    className: 'Semua Kelas X',
    jurusan: 'Semua Jurusan',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 70,
    pgOptionCount: 5,
    essayCount: 5,
    essayDisplayCount: 5,
    essayWeight: 30,
    isActive: true,
    questions: [
      {
        id: 'q_mat_1',
        number: 1,
        type: 'PG',
        prompt: 'Nilai x yang memenuhi persamaan nilai mutlak |2x - 4| = 6 adalah ....',
        points: 15,
        options: [
          { id: 'opt_mat_a', text: 'x = 5 atau x = -1' },
          { id: 'opt_mat_b', text: 'x = 5 atau x = 1' },
          { id: 'opt_mat_c', text: 'x = -5 atau x = -1' },
          { id: 'opt_mat_d', text: 'x = 3 atau x = -2' },
          { id: 'opt_mat_e', text: 'x = 4 atau x = -2' },
        ],
        correctOptionId: 'opt_mat_a',
      },
    ],
  },
  {
    id: 'bank_fis_x',
    code: 'FIS-KLS-X-1',
    subjectId: 'sub_fis',
    subjectCode: 'FIS',
    subjectName: 'FISIKA',
    level: 'X',
    className: 'X MIPA 1, X MIPA 2',
    jurusan: 'IPA',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 100,
    pgOptionCount: 5,
    essayCount: 0,
    essayDisplayCount: 0,
    essayWeight: 0,
    isActive: true,
    questions: [
      {
        id: 'q_fis_1',
        number: 1,
        type: 'PG',
        prompt: 'Perhatikan gambar rangkaian listrik tertutup di bawah ini! Jika nilai R1 = 4 Ω, R2 = 6 Ω, R3 = 3 Ω, dan sumber tegangan baterai V = 12 Volt, hitunglah besar kuat arus total yang mengalir pada rangkaian tersebut!',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMjYwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI2MCIgcng9IjE2IiBmaWxsPSIjMGQxMzFmIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjI1MCIgeT0iMzIiIGZpbGw9IiMzOGJkZjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0tFTUEgUkFOR0tBSUFOIExJU1RSSUsgU0VSSS1QQVJBTEVMPC90ZXh0PgogIDxsaW5lIHgxPSI3MCIgeTE9IjE0MCIgeDI9IjE1MCIgeTI9IjE0MCIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cmVjdCB4PSIxNTAiIHk9IjEyNSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzFlMjkzYiIgc3Ryb2tlPSIjMzhiZGY4IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxODAiIHk9IjE0NSIgZmlsbD0iI2UyZThmMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlIxPTTOqTwvdGV4dD4KICA8bGluZSB4MT0iMjEwIiB5MT0iMTQwIiB4Mj0iMjYwIiB5Mj0iMTQwIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMyIvPgogIDxwYXRoIGQ9Ik0yNjAsMTQwIEwyNjAsOTUgTDI5MCw5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cmVjdCB4PSIyOTAiIHk9IjgwIiB3aWR0aD0iNjAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMWUyOTNiIiBzdHJva2U9IiNmNTllMGIiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjMyMCIgeT0iMTAwIiBmaWxsPSIjZTJlOGYwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UjI9Ns6pPC90ZXh0PgogIDxwYXRoIGQ9Ik0zNTAsOTUgTDM4MCw5NSBMMzgwLDE0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cGF0aCBkPSJNMjYwLDE0MCBMMjYwLDE4NSBMMjkwLDE4NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cmVjdCB4PSIyOTAiIHk9IjE3MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzFlMjkzYiIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIzMjAiIHk9IjE5MCIgZmlsbD0iI2UyZThmMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlIzPTPOqTwvdGV4dD4KICA8cGF0aCBkPSJNMzUwLDE4NSBMMzgwLDE4NSBMMzgwLDE0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8bGluZSB4MT0iMzgwIiB5MT0iMTQwIiB4Mj0iNDMwIiB5Mj0iMTQwIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMyIvPgogIDxwYXRoIGQ9Ik00MzAsMTQwIEw0MzAsMjMwIEw3MCwyMzAgTDcwLDE0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMzAiIHI9IjE2IiBmaWxsPSIjMWUyOTNiIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjI1MCIgeT0iMjM0IiBmaWxsPSIjMzRkMzk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyVjwvdGV4dD4KPC9zdmc+',
        imageCaption: 'Gambar 2.1 Skema Rangkaian Resistor Campuran Seri dan Paralel',
        points: 50,
        options: [
          { id: 'opt_fis_a', text: '2,0 Ampere' },
          { id: 'opt_fis_b', text: '1,5 Ampere' },
          { id: 'opt_fis_c', text: '3,0 Ampere' },
          { id: 'opt_fis_d', text: '4,0 Ampere' },
          { id: 'opt_fis_e', text: '0,5 Ampere' },
        ],
        correctOptionId: 'opt_fis_a',
      },
    ],
  },
  {
    id: 'bank_bio_x',
    code: 'BIO-KLS-X-1',
    subjectId: 'sub_bio',
    subjectCode: 'BIO',
    subjectName: 'BIOLOGI',
    level: 'X',
    className: 'X MIPA 1, X MIPA 2',
    jurusan: 'IPA',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 100,
    pgOptionCount: 5,
    essayCount: 0,
    essayDisplayCount: 0,
    essayWeight: 0,
    isActive: true,
    questions: [
      {
        id: 'q_bio_1',
        number: 1,
        type: 'PG',
        prompt: 'Berdasarkan diagram struktur organel sel di bawah ini, lipatan membran dalam berlekuk-lekuk bernomor 2 (krista / cristae) berfungsi krusial dalam memperluas permukaan membran untuk berlangsungnya proses ....',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMjYwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI2MCIgcng9IjE2IiBmaWxsPSIjMGQxMzFmIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjI1MCIgeT0iMzIiIGZpbGw9IiMzOGJkZjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RElBR1JBTSBTVFJVS1RVUiBNSVRPS09ORFJJQTwvdGV4dD4KICA8ZWxsaXBzZSBjeD0iMjUwIiBjeT0iMTQ1IiByeD0iMjAwIiByeT0iODAiIGZpbGw9IiMwNjRlM2IiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPHBhdGggZD0iTTgwLDE0NSBRMTIwLDk1IDE1MCwxNDUgVDIyMCwxNDUgVDI5MCwxNDUgVDM2MCwxNDUgVDQyMCwxNDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8ZWxsaXBzZSBjeD0iMTgwIiBjeT0iMTMwIiByeD0iNiIgcnk9IjYiIGZpbGw9IiNmYmJmMjQiLz4KICA8ZWxsaXBzZSBjeD0iMzIwIiBjeT0iMTYwIiByeD0iNiIgcnk9IjYiIGZpbGw9IiNmYmJmMjQiLz4KICA8dGV4dCB4PSIxMDAiIHk9Ijc1IiBmaWxsPSIjYTdmM2QwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSI+MS4gTWVtYnJhbiBMdWFyPC90ZXh0PgogIDxsaW5lIHgxPSIxNTAiIHkxPSI4MCIgeDI9IjE3MCIgeTI9IjEwMCIgc3Ryb2tlPSIjYTdmM2QwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDx0ZXh0IHg9IjM0MCIgeT0iODUiIGZpbGw9IiNmZGJhNzQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIj4yLiBLcmlzdGEgKExpcGF0YW4gRGFsYW0pPC90ZXh0PgogIDxsaW5lIHgxPSIzNDAiIHkxPSI5MCIgeDI9IjMyMCIgeTI9IjEyNSIgc3Ryb2tlPSIjZmRiYTc0IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDx0ZXh0IHg9IjE2MCIgeT0iMjE1IiBmaWxsPSIjNmVlN2I3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSI+My4gTWF0cmlrcyBNaXRva29uZHJpYTwvdGV4dD4KICA8dGV4dCB4PSIzMzAiIHk9IjIxNSIgZmlsbD0iI2ZkZTY4YSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiPjQuIEROQSAmYW1wOyBSaWJvc29tPC90ZXh0Pgo8L3N2Zz4=',
        imageCaption: 'Gambar 1.1 Diagram Struktur Mitokondria Sel Eukariotik',
        points: 50,
        options: [
          { id: 'opt_bio_a', text: 'Rantai Transpor Elektron dan Fosforilasi Oksidatif pembentukan ATP' },
          { id: 'opt_bio_b', text: 'Glikolisis pemecahan glukosa secara anaerob' },
          { id: 'opt_bio_c', text: 'Translasi dan sintesis protein oleh ribosom bebas' },
          { id: 'opt_bio_d', text: 'Pembentukan enzim hidrolitik vesikel lisosom' },
          { id: 'opt_bio_e', text: 'Reaksi terang penangkapan foton cahaya fotosintesis' },
        ],
        correctOptionId: 'opt_bio_a',
      },
    ],
  },
  {
    id: 'bank_eko_x',
    code: 'EKO-KLS-X-1',
    subjectId: 'sub_eko',
    subjectCode: 'EKO',
    subjectName: 'EKONOMI',
    level: 'X',
    className: 'X IPS 1, X IPS 2',
    jurusan: 'IPS',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 100,
    pgOptionCount: 5,
    essayCount: 0,
    essayDisplayCount: 0,
    essayWeight: 0,
    isActive: true,
    questions: [
      {
        id: 'q_eko_1',
        number: 1,
        type: 'PG',
        prompt: 'Masalah ekonomi mendasar yang dihadapi oleh setiap masyarakat timbul karena adanya kesenjangan antara ....',
        points: 50,
        options: [
          { id: 'opt_eko_a', text: 'Kebutuhan manusia yang tidak terbatas dengan alat pemuas kebutuhan yang terbatas' },
          { id: 'opt_eko_b', text: 'Pendapatan masyarakat dengan tingginya harga barang di pasar' },
          { id: 'opt_eko_c', text: 'Jumlah lapangan kerja dengan jumlah angkatan kerja baru' },
          { id: 'opt_eko_d', text: 'Pengeluaran pemerintah dengan pendapatan dari sektor pajak' },
          { id: 'opt_eko_e', text: 'Tingkat inflasi dengan tingkat suku bunga perbankan' },
        ],
        correctOptionId: 'opt_eko_a',
      },
    ],
  },
  {
    id: 'bank_bindo_x',
    code: 'BINDO-KLS-X-1',
    subjectId: 'sub_bindo',
    subjectCode: 'BINDO',
    subjectName: 'BAHASA INDONESIA',
    level: 'X',
    className: 'Semua Kelas X',
    jurusan: 'Semua Jurusan',
    teacherId: 'tch_dermawan',
    teacherName: 'Dermawan Surya Kencana, S. Sos',
    format: 'CBT_STANDARD',
    pgCount: 40,
    pgDisplayCount: 40,
    pgWeight: 70,
    pgOptionCount: 5,
    essayCount: 5,
    essayDisplayCount: 5,
    essayWeight: 30,
    isActive: true,
    questions: [
      {
        id: 'q_bin_1',
        number: 1,
        type: 'PG',
        prompt: 'Ide pokok atau gagasan utama dalam sebuah paragraf biasanya terdapat pada ....',
        points: 10,
        options: [
          { id: 'opt_bi_a', text: 'Kalimat utama' },
          { id: 'opt_bi_b', text: 'Kalimat penjelas' },
          { id: 'opt_bi_c', text: 'Seluruh kalimat' },
          { id: 'opt_bi_d', text: 'Judul teks saja' },
          { id: 'opt_bi_e', text: 'Kalimat pengantar' },
        ],
        correctOptionId: 'opt_bi_a',
      },
      {
        id: 'q_bin_essay_1',
        number: 2,
        type: 'ESSAY',
        prompt: 'Jelaskan perbedaan antara teks laporan hasil observasi (LHO) dan teks eksposisi, serta sebutkan struktur umum dari teks laporan hasil observasi!',
        points: 30,
        rubric: {
          idealAnswer: 'Teks LHO menyajikan fakta hasil pengamatan objektif secara sistematis tanpa opini subjektif, sedangkan teks eksposisi bertujuan meyakinkan pembaca melalui argumentasi dan sudut pandang. Struktur LHO meliputi: pernyataan umum (definisi), deskripsi bagian, dan deskripsi manfaat.',
          maxScore: 30,
          strictness: 'standard',
          keyPoints: [
            {
              concept: 'LHO berbasis pengamatan objektif faktual; Eksposisi berbasis tesis dan argumentasi meyakinkan',
              weight: 15,
              mandatoryKeywords: ['observasi', 'pengamatan', 'fakta', 'eksposisi', 'argumentasi'],
            },
            {
              concept: 'Struktur LHO: Pernyataan umum/definisi, Deskripsi bagian, Deskripsi manfaat',
              weight: 15,
              mandatoryKeywords: ['pernyataan umum', 'deskripsi bagian', 'manfaat'],
            },
          ],
        },
      },
    ],
  },
];

export default function BankSoalManagementView({
  teachers,
  subjects,
  classes = [],
  levels = [],
  majors = [],
  initialQuestionBanks = DEFAULT_QUESTION_BANKS,
  onQuestionBanksChange,
  onOpenPrint,
}: BankSoalManagementViewProps) {
  // State: Question Banks List
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>(initialQuestionBanks);

  useEffect(() => {
    onQuestionBanksChange?.(questionBanks);
  }, [questionBanks, onQuestionBanksChange]);

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // State: Modal Tambah / Edit Bank Soal
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  // Form State Bank Soal (matching Image 2 & 3)
  const [formJurusan, setFormJurusan] = useState('Semua Jurusan');
  const [formLevel, setFormLevel] = useState('X');
  const [formKelas, setFormKelas] = useState('X MIPA 1');
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || 'sub_sos');
  const [formSubjectCode, setFormSubjectCode] = useState(subjects[0]?.code || 'SOS');
  const [formSubjectName, setFormSubjectName] = useState(subjects[0]?.name || 'SOSIOLOGI');
  const [formCode, setFormCode] = useState('');
  const [formFormat, setFormFormat] = useState<'CBT_STANDARD' | 'AKM_KOMPLEKS'>('CBT_STANDARD');
  const [formSpecificStudents, setFormSpecificStudents] = useState('');
  const [formTeacherId, setFormTeacherId] = useState(teachers[0]?.id || 'tch_dermawan');
  const [formTeacherName, setFormTeacherName] = useState(teachers[0]?.name || 'Dermawan Surya Kencana, S. Sos');

  // PG Settings
  const [formPgCount, setFormPgCount] = useState(40);
  const [formPgDisplayCount, setFormPgDisplayCount] = useState(40);
  const [formPgWeight, setFormPgWeight] = useState(100);
  const [formPgOptionCount, setFormPgOptionCount] = useState(4);

  // Essay Settings
  const [formEssayCount, setFormEssayCount] = useState(0);
  const [formEssayDisplayCount, setFormEssayDisplayCount] = useState(0);
  const [formEssayWeight, setFormEssayWeight] = useState(0);

  // Keaktifan
  const [formIsActive, setFormIsActive] = useState(true);

  // State: LIHAT SOAL View Mode
  const [viewingBankSoal, setViewingBankSoal] = useState<QuestionBank | null>(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [filterQuestionType, setFilterQuestionType] = useState<string>('ALL');

  // State: Modal Import Excel
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTargetBankId, setImportTargetBankId] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importParsedQuestions, setImportParsedQuestions] = useState<Question[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'APPEND' | 'REPLACE'>('APPEND');
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setIsParsing(true);
    const result = await parseExcelToQuestions(file);
    setIsParsing(false);
    if (result.success) {
      setImportParsedQuestions(result.questions);
      setImportErrors(result.errors);
      showToast(`Berhasil membaca ${result.questions.length} butir soal dari Excel.`, 'success');
    } else {
      setImportParsedQuestions([]);
      setImportErrors(result.errors);
      showToast(`Gagal membaca file: ${result.errors[0] || 'Format salah'}`, 'error');
    }
  };

  const handleConfirmImport = () => {
    if (importParsedQuestions.length === 0) {
      showToast('Belum ada butir soal yang berhasil diparsing.', 'error');
      return;
    }

    const targetBank = questionBanks.find((b) => b.id === (importTargetBankId || (viewingBankSoal as any)?.id));
    if (!targetBank) {
      showToast('Harap pilih Bank Soal tujuan terlebih dahulu.', 'error');
      return;
    }

    const mergedQuestions = importMode === 'REPLACE'
      ? importParsedQuestions.map((q, i) => ({ ...q, number: i + 1 }))
      : [
          ...targetBank.questions,
          ...importParsedQuestions.map((q, i) => ({
            ...q,
            number: targetBank.questions.length + i + 1,
          })),
        ];

    const updatedBank: QuestionBank = {
      ...targetBank,
      questions: mergedQuestions,
      pgCount: mergedQuestions.filter((q) => q.type === 'PG' || q.type === 'PGK').length,
      essayCount: mergedQuestions.filter((q) => q.type === 'ESSAY').length,
    };

    const nextBanks = questionBanks.map((b) => (b.id === updatedBank.id ? updatedBank : b));
    setQuestionBanks(nextBanks);

    if (viewingBankSoal && viewingBankSoal.id === updatedBank.id) {
      setViewingBankSoal(updatedBank);
    }

    setIsImportModalOpen(false);
    setImportFile(null);
    setImportParsedQuestions([]);
    setImportErrors([]);
    showToast(`Berhasil mengimpor ${importParsedQuestions.length} butir soal ke Bank Soal "${targetBank.code}"!`, 'success');
  };

  // State: Modal Tambah / Edit Butir Soal inside "Lihat Soal"
  const [isQuestionItemModalOpen, setIsQuestionItemModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qType, setQType] = useState<QuestionType>('PG');
  const [qPrompt, setQPrompt] = useState('');
  const [qImageUrl, setQImageUrl] = useState('');
  const [qImageCaption, setQImageCaption] = useState('');
  const [previewZoomImage, setPreviewZoomImage] = useState<{ url: string; caption?: string } | null>(null);
  const [qPoints, setQPoints] = useState(25);

  // PG Form
  const [qOptions, setQOptions] = useState([
    { id: 'opt_a', text: '' },
    { id: 'opt_b', text: '' },
    { id: 'opt_c', text: '' },
    { id: 'opt_d', text: '' },
  ]);
  const [qCorrectOptId, setQCorrectOptId] = useState('opt_a');

  // PGK Form
  const [qPgkOptions, setQPgkOptions] = useState([
    { id: 'pgk_1', text: '', isCorrect: true },
    { id: 'pgk_2', text: '', isCorrect: false },
    { id: 'pgk_3', text: '', isCorrect: true },
    { id: 'pgk_4', text: '', isCorrect: false },
  ]);

  // Matching Form
  const [qMatchingPairs, setQMatchingPairs] = useState([
    { id: 'm_1', premise: '', target: '' },
    { id: 'm_2', premise: '', target: '' },
    { id: 'm_3', premise: '', target: '' },
  ]);

  // Short Answer Form
  const [qShortAnswers, setQShortAnswers] = useState('');

  // Essay Form
  const [qIdealAnswer, setQIdealAnswer] = useState('');
  const [qKeyConcepts, setQKeyConcepts] = useState([
    { concept: '', weight: 15, keywords: '' },
    { concept: '', weight: 15, keywords: '' },
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync Subject selection in modal form
  const handleSelectSubject = (subId: string) => {
    const sub = subjects.find((s) => s.id === subId);
    if (sub) {
      setFormSubjectId(sub.id);
      setFormSubjectCode(sub.code);
      setFormSubjectName(sub.name);
      if (!editingBankId) {
        setFormCode(`${sub.name.toUpperCase().replace(/\s+/g, '_')}_KLS_${formLevel}_1`);
      }
    }
  };

  // Sync Teacher selection
  const handleSelectTeacher = (tchId: string) => {
    const tch = teachers.find((t) => t.id === tchId);
    if (tch) {
      setFormTeacherId(tch.id);
      setFormTeacherName(tch.name);
    }
  };

  // Open Modal Tambah
  const handleOpenAddBank = () => {
    setEditingBankId(null);
    const defSub = subjects[0];
    const defTch = teachers[0];
    setFormJurusan('Semua Jurusan');
    setFormLevel('VI');
    setFormKelas('VI');
    setFormSubjectId(defSub?.id || 'sub_fkh');
    setFormSubjectCode(defSub?.code || 'FKH');
    setFormSubjectName(defSub?.name || 'Sosiologi');
    setFormCode(defSub ? `${defSub.name.toUpperCase().replace(/\s+/g, '_')}_KLS_VI_1` : 'INFO_KELAS_VI-1');
    setFormFormat('CBT_STANDARD');
    setFormSpecificStudents('');
    setFormTeacherId(defTch?.id || '');
    setFormTeacherName(defTch?.name || '');
    setFormPgCount(40);
    setFormPgDisplayCount(40);
    setFormPgWeight(100);
    setFormPgOptionCount(4);
    setFormEssayCount(0);
    setFormEssayDisplayCount(0);
    setFormEssayWeight(0);
    setFormIsActive(true);
    setIsBankModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEditBank = (bank: QuestionBank) => {
    setEditingBankId(bank.id);
    setFormJurusan(bank.jurusan || 'Semua Jurusan');
    setFormLevel(bank.level || 'VI');
    setFormKelas(bank.className || 'VI');
    setFormSubjectId(bank.subjectId);
    setFormSubjectCode(bank.subjectCode);
    setFormSubjectName(bank.subjectName);
    setFormCode(bank.code);
    setFormFormat(bank.format);
    setFormSpecificStudents(bank.specificStudents || '');
    setFormTeacherId(bank.teacherId);
    setFormTeacherName(bank.teacherName);
    setFormPgCount(bank.pgCount);
    setFormPgDisplayCount(bank.pgDisplayCount);
    setFormPgWeight(bank.pgWeight);
    setFormPgOptionCount(bank.pgOptionCount);
    setFormEssayCount(bank.essayCount);
    setFormEssayDisplayCount(bank.essayDisplayCount);
    setFormEssayWeight(bank.essayWeight);
    setFormIsActive(bank.isActive);
    setIsBankModalOpen(true);
  };

  // Save Bank Soal (Create or Update)
  const handleSaveBankSoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      showToast('Harap masukkan Kode Bank Soal.', 'error');
      return;
    }

    if (editingBankId) {
      // Update
      setQuestionBanks((prev) =>
        prev.map((b) =>
          b.id === editingBankId
            ? {
                ...b,
                code: formCode.trim(),
                subjectId: formSubjectId,
                subjectCode: formSubjectCode,
                subjectName: formSubjectName,
                level: formLevel,
                className: formKelas,
                jurusan: formJurusan,
                teacherId: formTeacherId,
                teacherName: formTeacherName,
                format: formFormat,
                specificStudents: formSpecificStudents,
                pgCount: formPgCount,
                pgDisplayCount: formPgDisplayCount,
                pgWeight: formPgWeight,
                pgOptionCount: formPgOptionCount,
                essayCount: formEssayCount,
                essayDisplayCount: formEssayDisplayCount,
                essayWeight: formEssayWeight,
                isActive: formIsActive,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );
      showToast(`Bank Soal "${formCode}" berhasil diperbarui!`, 'success');
    } else {
      // Create New
      const newBank: QuestionBank = {
        id: `bank_${Date.now()}`,
        code: formCode.trim(),
        subjectId: formSubjectId,
        subjectCode: formSubjectCode,
        subjectName: formSubjectName,
        level: formLevel,
        className: formKelas,
        jurusan: formJurusan,
        teacherId: formTeacherId,
        teacherName: formTeacherName,
        format: formFormat,
        specificStudents: formSpecificStudents,
        pgCount: formPgCount,
        pgDisplayCount: formPgDisplayCount,
        pgWeight: formPgWeight,
        pgOptionCount: formPgOptionCount,
        essayCount: formEssayCount,
        essayDisplayCount: formEssayDisplayCount,
        essayWeight: formEssayWeight,
        isActive: formIsActive,
        questions: [],
        createdAt: new Date().toISOString(),
      };
      setQuestionBanks((prev) => [newBank, ...prev]);
      showToast(`Bank Soal "${formCode}" berhasil ditambahkan!`, 'success');
    }

    setIsBankModalOpen(false);
  };

  // Duplikasi Bank Soal
  const handleDuplicateBankSoal = (bank: QuestionBank) => {
    const newId = `bank_copy_${Date.now()}`;
    const duplicatedQuestions: Question[] = bank.questions.map((q, i) => ({
      ...q,
      id: `q_copy_${Date.now()}_${i + 1}`,
    }));

    const newBank: QuestionBank = {
      ...bank,
      id: newId,
      code: `${bank.code} (Salinan)`,
      questions: duplicatedQuestions,
      createdAt: new Date().toISOString(),
    };

    setQuestionBanks((prev) => [newBank, ...prev]);
    showToast(`Bank Soal "${bank.code}" berhasil diduplikasi menjadi "${newBank.code}"!`, 'info');
  };

  // Hapus Bank Soal
  const handleDeleteBankSoal = (id: string, code: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Bank Soal "${code}"? Tindakan ini tidak dapat dibatalkan.`)) {
      setQuestionBanks((prev) => prev.filter((b) => b.id !== id));
      showToast(`Bank Soal "${code}" telah dihapus.`, 'info');
    }
  };

  // Filtered Question Banks
  const filteredBanks = useMemo(() => {
    if (!searchTerm.trim()) return questionBanks;
    const q = searchTerm.toLowerCase();
    return questionBanks.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.subjectName.toLowerCase().includes(q) ||
        b.teacherName.toLowerCase().includes(q) ||
        b.level.toLowerCase().includes(q) ||
        b.className.toLowerCase().includes(q)
    );
  }, [questionBanks, searchTerm]);

  // Paginated Banks
  const totalPages = Math.ceil(filteredBanks.length / entriesPerPage) || 1;
  const paginatedBanks = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredBanks.slice(start, start + entriesPerPage);
  }, [filteredBanks, currentPage, entriesPerPage]);

  // ==========================================================
  // BUTIR SOAL MANAGEMENT (LIHAT SOAL VIEW)
  // ==========================================================
  const handleOpenAddQuestion = () => {
    if (!viewingBankSoal) return;
    setEditingQuestionId(null);
    setQType('PG');
    setQPrompt('');
    setQImageUrl('');
    setQImageCaption('');
    setQPoints(25);
    setQOptions([
      { id: 'opt_1', text: '' },
      { id: 'opt_2', text: '' },
      { id: 'opt_3', text: '' },
      { id: 'opt_4', text: '' },
    ]);
    setQCorrectOptId('opt_1');
    setQPgkOptions([
      { id: 'pgk_1', text: '', isCorrect: true },
      { id: 'pgk_2', text: '', isCorrect: false },
      { id: 'pgk_3', text: '', isCorrect: true },
      { id: 'pgk_4', text: '', isCorrect: false },
    ]);
    setQMatchingPairs([
      { id: 'm_1', premise: '', target: '' },
      { id: 'm_2', premise: '', target: '' },
      { id: 'm_3', premise: '', target: '' },
    ]);
    setQShortAnswers('');
    setQIdealAnswer('');
    setQKeyConcepts([
      { concept: '', weight: 15, keywords: '' },
      { concept: '', weight: 15, keywords: '' },
    ]);
    setIsQuestionItemModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQType(q.type);
    setQPrompt(q.prompt);
    setQImageUrl(q.imageUrl || '');
    setQImageCaption(q.imageCaption || '');
    setQPoints(q.points);

    if (q.type === 'PG') {
      const mc = q as MultipleChoiceQuestion;
      setQOptions(mc.options);
      setQCorrectOptId(mc.correctOptionId);
    } else if (q.type === 'PGK') {
      const pgk = q as ComplexMultipleChoiceQuestion;
      setQPgkOptions(
        pgk.options.map((o) => ({
          ...o,
          isCorrect: (pgk.correctOptionIds || []).includes(o.id),
        }))
      );
    } else if (q.type === 'MATCHING') {
      const mt = q as MatchingQuestion;
      setQMatchingPairs(mt.pairs);
    } else if (q.type === 'SHORT') {
      const sh = q as ShortAnswerQuestion;
      setQShortAnswers(sh.acceptableAnswers.join(', '));
    } else if (q.type === 'ESSAY') {
      const es = q as EssayQuestion;
      setQIdealAnswer(es.rubric?.idealAnswer || '');
      setQKeyConcepts(
        (es.rubric?.keyPoints || []).map((kp) => ({
          concept: kp.concept,
          weight: kp.weight,
          keywords: kp.mandatoryKeywords.join(', '),
        }))
      );
    }

    setIsQuestionItemModalOpen(true);
  };

  const handleSaveQuestionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingBankSoal) return;
    if (!qPrompt.trim()) {
      showToast('Harap masukkan teks pertanyaan butir soal.', 'error');
      return;
    }

    let constructedQuestion: Question;
    const nextNumber = editingQuestionId
      ? viewingBankSoal.questions.find((q) => q.id === editingQuestionId)?.number || 1
      : viewingBankSoal.questions.length + 1;

    const imgUrlVal = qImageUrl.trim() ? qImageUrl.trim() : undefined;
    const imgCaptionVal = qImageCaption.trim() ? qImageCaption.trim() : undefined;

    if (qType === 'PG') {
      constructedQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: nextNumber,
        type: 'PG',
        prompt: qPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: qPoints,
        options: qOptions,
        correctOptionId: qCorrectOptId,
      } as MultipleChoiceQuestion;
    } else if (qType === 'PGK') {
      constructedQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: nextNumber,
        type: 'PGK',
        prompt: qPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: qPoints,
        options: qPgkOptions.map((o) => ({ id: o.id, text: o.text })),
        correctOptionIds: qPgkOptions.filter((o) => o.isCorrect).map((o) => o.id),
      } as ComplexMultipleChoiceQuestion;
    } else if (qType === 'MATCHING') {
      constructedQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: nextNumber,
        type: 'MATCHING',
        prompt: qPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: qPoints,
        pairs: qMatchingPairs,
      } as MatchingQuestion;
    } else if (qType === 'SHORT') {
      constructedQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: nextNumber,
        type: 'SHORT',
        prompt: qPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: qPoints,
        acceptableAnswers: qShortAnswers.split(',').map((s) => s.trim()).filter(Boolean),
      } as ShortAnswerQuestion;
    } else {
      constructedQuestion = {
        id: editingQuestionId || `q_${Date.now()}`,
        number: nextNumber,
        type: 'ESSAY',
        prompt: qPrompt,
        imageUrl: imgUrlVal,
        imageCaption: imgCaptionVal,
        points: qPoints,
        rubric: {
          idealAnswer: qIdealAnswer,
          maxScore: qPoints,
          strictness: 'standard',
          keyPoints: qKeyConcepts.map((kc) => ({
            concept: kc.concept,
            weight: kc.weight,
            mandatoryKeywords: kc.keywords.split(',').map((k) => k.trim()).filter(Boolean),
          })),
        },
      } as EssayQuestion;
    }

    const updatedQuestions = editingQuestionId
      ? viewingBankSoal.questions.map((q) => (q.id === editingQuestionId ? constructedQuestion : q))
      : [...viewingBankSoal.questions, constructedQuestion];

    const updatedBank = {
      ...viewingBankSoal,
      questions: updatedQuestions,
    };

    setViewingBankSoal(updatedBank);
    setQuestionBanks((prev) => prev.map((b) => (b.id === updatedBank.id ? updatedBank : b)));
    setIsQuestionItemModalOpen(false);
    showToast(`Butir soal nomor ${nextNumber} berhasil disimpan!`, 'success');
  };

  const handleDeleteQuestionItem = (qId: string, qNum: number) => {
    if (!viewingBankSoal) return;
    if (confirm(`Hapus butir soal nomor ${qNum}?`)) {
      const remaining = viewingBankSoal.questions
        .filter((q) => q.id !== qId)
        .map((q, idx) => ({ ...q, number: idx + 1 }));

      const updatedBank = { ...viewingBankSoal, questions: remaining };
      setViewingBankSoal(updatedBank);
      setQuestionBanks((prev) => prev.map((b) => (b.id === updatedBank.id ? updatedBank : b)));
      showToast(`Butir soal nomor ${qNum} berhasil dihapus.`, 'info');
    }
  };

  // Filtered Questions in "Lihat Soal"
  const filteredQuestions = useMemo(() => {
    if (!viewingBankSoal) return [];
    return viewingBankSoal.questions.filter((q) => {
      if (filterQuestionType !== 'ALL' && q.type !== filterQuestionType) return false;
      if (questionSearch.trim()) {
        const query = questionSearch.toLowerCase();
        return q.prompt.toLowerCase().includes(query);
      }
      return true;
    });
  }, [viewingBankSoal, filterQuestionType, questionSearch]);

  // =========================================================================
  // RENDER: VIEW "LIHAT SOAL" (QUESTION ITEMS VIEWER & MANAGER)
  // =========================================================================
  if (viewingBankSoal) {
    return (
      <div className="space-y-6">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                : notification.type === 'error'
                ? 'bg-rose-950 border-rose-500/50 text-rose-300'
                : 'bg-blue-950 border-blue-500/50 text-blue-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Back Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewingBankSoal(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-xs"
              title="Kembali ke Daftar Bank Soal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Bank Soal Terpilih
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400 font-mono">{viewingBankSoal.code}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {viewingBankSoal.code}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAddQuestion}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal</span>
            </button>

            <button
              onClick={() => {
                setImportTargetBankId(viewingBankSoal.id);
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Import butir soal dari file Excel (.xlsx / .csv)"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => exportBankSoalToExcel(viewingBankSoal)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Unduh naskah soal format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => exportBankSoalToWord(viewingBankSoal)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Unduh naskah soal format Word (.doc) lengkap dengan kunci & kop"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Word (.doc)</span>
            </button>

            <button
              onClick={downloadExcelTemplate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium shadow-xs transition-colors cursor-pointer"
              title="Unduh format template kosong Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Template</span>
            </button>

            {onOpenPrint && (
              <button
                onClick={() => onOpenPrint(viewingBankSoal.code)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-purple-400" />
                <span>Cetak Naskah</span>
              </button>
            )}

            <button
              onClick={() => setViewingBankSoal(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* Bank Soal Overview Header Card */}
        <div className="p-5 bg-[#121620] border border-slate-800 rounded-2xl shadow-xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Mata Pelajaran</span>
            <div className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>{viewingBankSoal.subjectName}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Guru Pengampu</span>
            <span className="font-bold text-slate-200">{viewingBankSoal.teacherName}</span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Target Kelas / Level</span>
            <span className="font-bold text-cyan-400">
              Kelas {viewingBankSoal.className} (Level {viewingBankSoal.level})
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Format Ujian</span>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-900/40 border border-blue-500/30 text-blue-300 font-bold">
              {viewingBankSoal.format === 'CBT_STANDARD' ? 'CBT Standard' : 'AKM / Kompleks'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Total Butir Soal</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 text-sm">
                {viewingBankSoal.questions.length} Butir
              </span>
              <span className="text-slate-500 text-[10px]">
                ({viewingBankSoal.pgCount} Target PG)
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-0.5">Status Bank Soal</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Aktif Siap Uji</span>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar for Questions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0d1017] border border-slate-800 rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter Tipe Soal:</span>
            {['ALL', 'PG', 'PGK', 'MATCHING', 'SHORT', 'ESSAY'].map((tp) => (
              <button
                key={tp}
                onClick={() => setFilterQuestionType(tp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterQuestionType === tp
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tp === 'ALL'
                  ? 'Semua'
                  : tp === 'PG'
                  ? 'Pilihan Ganda'
                  : tp === 'PGK'
                  ? 'PG Kompleks'
                  : tp === 'MATCHING'
                  ? 'Menjodohkan'
                  : tp === 'SHORT'
                  ? 'Isian Singkat'
                  : 'Esai AI'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              placeholder="Cari teks pertanyaan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="py-16 text-center bg-[#121620] border border-slate-800 rounded-2xl">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Belum Ada Butir Soal</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                Bank soal ini belum memiliki butir soal yang diinput. Tambahkan soal secara manual
                menggunakan tombol di bawah.
              </p>
              <button
                onClick={handleOpenAddQuestion}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
              >
                + Tambah Soal Pertama
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-[#121620] border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all shadow-md group"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-900/60 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs">
                      Nomor {q.number}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Tipe: {q.type}
                    </span>
                    <span className="text-slate-500 text-xs">&bull;</span>
                    <span className="text-xs text-amber-400 font-bold">{q.points} Poin</span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Butir Soal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestionItem(q.id, q.number)}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer"
                      title="Hapus Butir Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="text-sm text-slate-100 font-medium leading-relaxed pl-1">
                  {q.prompt}
                </div>

                {/* Gambar Stimulus Butir Soal (Jika Ada) */}
                {q.imageUrl && (
                  <div className="my-2.5 pl-1">
                    <div className="inline-block relative group rounded-xl overflow-hidden border border-slate-700/80 bg-black/40 p-1.5 shadow-sm">
                      <img
                        src={q.imageUrl}
                        alt={q.imageCaption || 'Gambar Butir Soal'}
                        className="max-h-56 max-w-full rounded-lg object-contain cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.01]"
                        onClick={() => setPreviewZoomImage({ url: q.imageUrl!, caption: q.imageCaption })}
                      />
                      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ZoomIn className="w-3 h-3 text-emerald-400" />
                        <span>Klik untuk perbesar</span>
                      </div>
                    </div>
                    {q.imageCaption && (
                      <p className="text-xs text-slate-400 italic mt-1.5 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-300">Sumber / Ket:</span> {q.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Options / Answer Content per Type */}
                {q.type === 'PG' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(q as MultipleChoiceQuestion).options.map((opt, i) => {
                      const isCorrect = (q as MultipleChoiceQuestion).correctOptionId === opt.id;
                      const optLetters = ['A', 'B', 'C', 'D', 'E'];
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {optLetters[i] || opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === 'PGK' && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                      Opsi Jawaban (Multi-Kunci):
                    </span>
                    {(q as ComplexMultipleChoiceQuestion).options.map((opt) => {
                      const isKey = (
                        (q as ComplexMultipleChoiceQuestion).correctOptionIds || []
                      ).includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                            isKey
                              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-900/40 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                              isKey
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'border border-slate-700'
                            }`}
                          >
                            {isKey && '✓'}
                          </div>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === 'MATCHING' && (
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                      Pasangan Menjodohkan (Premis ➔ Target):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q as MatchingQuestion).pairs.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                        >
                          <span className="font-semibold text-white">{p.premise}</span>
                          <span className="text-slate-500 text-xs mx-2">➔</span>
                          <span className="text-cyan-400 font-mono">{p.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {q.type === 'SHORT' && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">
                      Kunci Jawaban yang Diterima (Exact & Typo Tolerant):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(q as ShortAnswerQuestion).acceptableAnswers.map((ans, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-blue-900/40 border border-blue-500/30 text-blue-300 font-mono text-[11px]"
                        >
                          "{ans}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {q.type === 'ESSAY' && (
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Rubrik Penilaian AI Local NLP Engine:</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Jawaban Ideal:</span>
                      <p className="text-slate-200 italic mt-0.5">
                        "{(q as EssayQuestion).rubric?.idealAnswer}"
                      </p>
                    </div>
                    <div className="pt-1 border-t border-slate-800">
                      <span className="text-slate-400 text-[11px] block mb-1">
                        Konsep Utama & Kata Kunci Mandatori:
                      </span>
                      <div className="space-y-1">
                        {(q as EssayQuestion).rubric?.keyPoints.map((kp, kidx) => (
                          <div
                            key={kidx}
                            className="flex items-center justify-between text-[11px] bg-black/20 p-1.5 rounded"
                          >
                            <span className="text-slate-300 font-medium">&bull; {kp.concept}</span>
                            <span className="text-emerald-400 font-mono">
                              +{kp.weight} poin (kata kunci: {kp.mandatoryKeywords.join(', ')})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Tambah / Edit Butir Soal */}
        {isQuestionItemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#151922] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>{editingQuestionId ? 'Edit Butir Soal' : 'Tambah Butir Soal Baru'}</span>
                </h3>
                <button
                  onClick={() => setIsQuestionItemModalOpen(false)}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestionItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Tipe Soal:</label>
                    <select
                      value={qType}
                      onChange={(e) => setQType(e.target.value as QuestionType)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                    >
                      <option value="PG">Pilihan Ganda (1 Kunci)</option>
                      <option value="PGK">Pilihan Ganda Kompleks (Multi Kunci)</option>
                      <option value="MATCHING">Menjodohkan</option>
                      <option value="SHORT">Isian Singkat</option>
                      <option value="ESSAY">Esai (Rubrik AI NLP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Poin / Bobot Soal:</label>
                    <input
                      type="number"
                      value={qPoints}
                      onChange={(e) => setQPoints(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pertanyaan / Teks Soal:</label>
                  <textarea
                    rows={3}
                    value={qPrompt}
                    onChange={(e) => setQPrompt(e.target.value)}
                    placeholder="Tuliskan teks pertanyaan soal di sini..."
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3"
                    required
                  />
                </div>

                {/* Upload & Preview Gambar Soal */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>Gambar / Stimulus Visual (Opsional):</span>
                    </label>
                    {qImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setQImageUrl('');
                          setQImageCaption('');
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Gambar
                      </button>
                    )}
                  </div>

                  {qImageUrl ? (
                    <div className="space-y-2.5">
                      <div className="relative group max-w-sm mx-auto rounded-xl overflow-hidden border border-slate-700 bg-black/40 p-1 flex justify-center">
                        <img
                          src={qImageUrl}
                          alt="Preview Gambar Soal"
                          className="max-h-44 object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Keterangan / Sumber Gambar (Caption):
                        </label>
                        <input
                          type="text"
                          value={qImageCaption}
                          onChange={(e) => setQImageCaption(e.target.value)}
                          placeholder="Contoh: Gambar 1.1 Diagram Rangkaian Listrik Seri-Paralel"
                          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-750 border border-dashed border-slate-600 hover:border-emerald-500/80 rounded-xl text-xs text-slate-300 hover:text-white transition-colors group">
                          <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Pilih & Upload Gambar (PNG, JPG, WebP, SVG)</span>
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
                                if (res) setQImageUrl(res);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 shrink-0">Atau URL:</span>
                        <input
                          type="text"
                          placeholder="https://... atau tempel URL gambar"
                          value={qImageUrl}
                          onChange={(e) => setQImageUrl(e.target.value)}
                          className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-Form PG */}
                {qType === 'PG' && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Opsi Pilihan Ganda (Tandai Kunci Jawaban Benar):
                    </label>
                    {qOptions.map((opt, idx) => {
                      const letters = ['A', 'B', 'C', 'D', 'E'];
                      return (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct_pg_opt"
                            checked={qCorrectOptId === opt.id}
                            onChange={() => setQCorrectOptId(opt.id)}
                            className="cursor-pointer"
                          />
                          <span className="w-5 text-center font-bold text-xs text-slate-400">
                            {letters[idx]}:
                          </span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...qOptions];
                              updated[idx].text = e.target.value;
                              setQOptions(updated);
                            }}
                            placeholder={`Teks pilihan ${letters[idx]}`}
                            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Sub-Form PGK */}
                {qType === 'PGK' && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Opsi Pilihan Ganda Kompleks (Centang yang Benar):
                    </label>
                    {qPgkOptions.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            const updated = [...qPgkOptions];
                            updated[idx].isCorrect = e.target.checked;
                            setQPgkOptions(updated);
                          }}
                          className="cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...qPgkOptions];
                            updated[idx].text = e.target.value;
                            setQPgkOptions(updated);
                          }}
                          placeholder={`Pilihan pernyataan ${idx + 1}`}
                          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-Form Matching */}
                {qType === 'MATCHING' && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Pasangan Menjodohkan (Premis ➔ Target):
                    </label>
                    {qMatchingPairs.map((pair, idx) => (
                      <div key={pair.id} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pair.premise}
                          onChange={(e) => {
                            const up = [...qMatchingPairs];
                            up[idx].premise = e.target.value;
                            setQMatchingPairs(up);
                          }}
                          placeholder={`Premis ${idx + 1}`}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                        />
                        <input
                          type="text"
                          value={pair.target}
                          onChange={(e) => {
                            const up = [...qMatchingPairs];
                            up[idx].target = e.target.value;
                            setQMatchingPairs(up);
                          }}
                          placeholder={`Target ${idx + 1}`}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-Form Short Answer */}
                {qType === 'SHORT' && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Kunci Jawaban Singkat (Pisahkan dengan koma jika ada beberapa variasi):
                    </label>
                    <input
                      type="text"
                      value={qShortAnswers}
                      onChange={(e) => setQShortAnswers(e.target.value)}
                      placeholder="Contoh: Mad thabi'i, mad ashli"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                {/* Sub-Form Essay */}
                {qType === 'ESSAY' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Jawaban Ideal Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={qIdealAnswer}
                        onChange={(e) => setQIdealAnswer(e.target.value)}
                        placeholder="Tuliskan kunci jawaban ideal sebagai rujukan AI..."
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Konsep Utama & Kata Kunci NLP:
                      </label>
                      {qKeyConcepts.map((kc, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-black/20 border border-slate-800 space-y-1.5">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={kc.concept}
                              onChange={(e) => {
                                const up = [...qKeyConcepts];
                                up[i].concept = e.target.value;
                                setQKeyConcepts(up);
                              }}
                              placeholder="Nama konsep (misal: Rukun Wudhu)"
                              className="col-span-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1"
                            />
                            <input
                              type="number"
                              value={kc.weight}
                              onChange={(e) => {
                                const up = [...qKeyConcepts];
                                up[i].weight = Number(e.target.value);
                                setQKeyConcepts(up);
                              }}
                              placeholder="Bobot poin"
                              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1"
                            />
                          </div>
                          <input
                            type="text"
                            value={kc.keywords}
                            onChange={(e) => {
                              const up = [...qKeyConcepts];
                              up[i].keywords = e.target.value;
                              setQKeyConcepts(up);
                            }}
                            placeholder="Kata kunci mandatori (pisahkan koma): niat, basuh muka"
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2.5 py-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuestionItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    Simpan Butir Soal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Lightbox / Zoom Gambar Butir Soal Modal */}
        {previewZoomImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setPreviewZoomImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] bg-[#121620] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-200 px-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                  Pratinjau Gambar Soal
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoomImage(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-300 italic">
                  {previewZoomImage.caption}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER: VIEW UTAMA (TABEL DAFTAR BANK SOAL - GAMBAR 1)
  // =========================================================================
  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-950 border-rose-500/50 text-rose-300'
              : 'bg-blue-950 border-blue-500/50 text-blue-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Data Bank Soal
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Katalog master naskah soal asesmen, manajemen butir pertanyaan, dan parameter bobot ujian.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl">
        {/* Card Header with Tambah Bank Soal Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
              Daftar Bank Soal
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setImportTargetBankId(questionBanks[0]?.id || null);
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              title="Import butir soal dari file Excel (.xlsx / .csv)"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Soal (Excel)</span>
            </button>

            <button
              onClick={downloadExcelTemplate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-slate-700"
              title="Unduh format template kosong Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Template Excel</span>
            </button>

            <button
              onClick={handleOpenAddBank}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Bank Soal</span>
            </button>
          </div>
        </div>

        {/* Table Controls (Show Entries & Search) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari kode / mapel / guru..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Bank Soal Table (Matching Image 1) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e15] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3 w-12 text-center text-slate-500">#</th>
                <th className="py-3 px-3">MATA PELAJARAN</th>
                <th className="py-3 px-3">INFORMASI SOAL</th>
                <th className="py-3 px-3">TARGET KELAS</th>
                <th className="py-3 px-3">GURU PENGAMPU</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedBanks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Tidak ada data Bank Soal yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                paginatedBanks.map((bank, idx) => {
                  const globalIdx = (currentPage - 1) * entriesPerPage + idx + 1;
                  const totalQuestions = bank.questions.length;
                  const completionPercent = bank.pgCount > 0 ? Math.min(100, Math.round((totalQuestions / bank.pgCount) * 100)) : 100;
                  const isReady = completionPercent >= 100 || totalQuestions > 0;

                  return (
                    <tr
                      key={bank.id}
                      className="hover:bg-slate-800/40 transition-colors odd:bg-slate-900/20"
                    >
                      {/* # */}
                      <td className="py-3.5 px-3 text-center text-slate-400 font-mono">
                        {globalIdx}
                      </td>

                      {/* MATA PELAJARAN */}
                      <td className="py-3.5 px-3 space-y-1">
                        <div
                          onClick={() => setViewingBankSoal(bank)}
                          className="font-extrabold text-blue-400 hover:text-blue-300 text-xs tracking-wide cursor-pointer transition-colors"
                          title="Klik untuk melihat butir soal"
                        >
                          {bank.code}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>{bank.subjectName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                            {bank.level}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                            CBT
                          </span>
                        </div>
                      </td>

                      {/* INFORMASI SOAL */}
                      <td className="py-3.5 px-3 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            PG
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                            {totalQuestions}/{bank.pgCount} ({Math.max(0, bank.pgCount - totalQuestions)} Kosong)
                          </span>
                        </div>

                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-600/90 text-white font-extrabold text-[10px] tracking-wide shadow-xs">
                            ✓ BANK SOAL SIAP ({completionPercent}%)
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pr-2">
                          <span className="flex items-center gap-1">
                            <ListOrdered className="w-3 h-3 text-slate-500" />
                            {bank.pgOptionCount} Opsi
                          </span>
                          <span className="text-slate-300 font-bold">{completionPercent}%</span>
                        </div>
                      </td>

                      {/* TARGET KELAS */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-sky-400 text-xs">
                          {bank.className}
                        </span>
                      </td>

                      {/* GURU PENGAMPU */}
                      <td className="py-3.5 px-3 font-medium text-slate-200">
                        {bank.teacherName}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-3 text-center">
                        {bank.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* AKSI (4 BUTTONS: LIHAT SOAL, EDIT, DUPLIKASI, HAPUS) */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. LIHAT SOAL (Search/Eye icon - Blue) */}
                          <button
                            onClick={() => setViewingBankSoal(bank)}
                            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Lihat Soal & Kelola Butir Pertanyaan"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. EDIT BANK SOAL (Pencil icon - Amber) */}
                          <button
                            onClick={() => handleOpenEditBank(bank)}
                            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Edit Data Bank Soal"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. DUPLIKASI BANK SOAL (Copy icon - Teal) */}
                          <button
                            onClick={() => handleDuplicateBankSoal(bank)}
                            className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Duplikasi Bank Soal"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. HAPUS BANK SOAL (Trash icon - Red) */}
                          <button
                            onClick={() => handleDeleteBankSoal(bank.id, bank.code)}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors cursor-pointer"
                            title="Hapus Bank Soal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
          <div>
            Showing {filteredBanks.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredBanks.length)} of {filteredBanks.length}{' '}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === pg
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT BANK SOAL (MATCHING GAMBAR 2 & 3)                    */}
      {/* ========================================================================= */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-4 overflow-y-auto">
          <div className="bg-[#151922] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6">
            {/* Modal Header */}
            <div className="bg-[#0070f3] px-5 py-3.5 flex items-center justify-between text-white shadow-md">
              <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  +
                </span>
                <span>{editingBankId ? 'Edit Bank Soal' : 'Tambah Bank Soal Baru'}</span>
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBankSoal} className="p-5 md:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {/* Row 1: Jurusan / PK, PILIH LEVEL, PILIH KELAS / ROMBEL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Jurusan / PK
                  </label>
                  <select
                    value={formJurusan}
                    onChange={(e) => setFormJurusan(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Semua Jurusan">Semua Jurusan</option>
                    <option value="Madrasah Ibtidaiyah">Madrasah Ibtidaiyah (MI)</option>
                    <option value="IPA">Ilmu Pengetahuan Alam (IPA)</option>
                    <option value="IPS">Ilmu Pengetahuan Sosial (IPS)</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="RPL">Rekayasa Perangkat Lunak</option>
                    <option value="TKJ">Teknik Komputer Jaringan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 uppercase">
                    Pilih Level
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="VI">VI</option>
                    <option value="V">V</option>
                    <option value="IV">IV</option>
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 uppercase">
                    Pilih Kelas / Rombel
                  </label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="VI">VI (Semua Rombel)</option>
                    <option value="VI-A">VI-A</option>
                    <option value="VI-B">VI-B</option>
                    <option value="VII_1">VII_1</option>
                    <option value="X MIPA 1">X MIPA 1</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Mata Pelajaran, Kode Mapel, Kode Bank Soal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => handleSelectSubject(e.target.value)}
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Kode Mapel
                  </label>
                  <input
                    type="text"
                    value={formSubjectCode}
                    readOnly
                    className="w-full bg-[#141822] border border-slate-800 text-slate-400 text-xs rounded-lg px-3 py-2 font-mono cursor-not-allowed"
                    placeholder="Otomatis terisi"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Kode Bank Soal
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Contoh: INFO_KELAS_IX-1"
                    className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Gunakan kode yang unik.</span>
                </div>
              </div>

              {/* Row 3: Format Soal (Two Radio Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Radio 1: CBT Standard */}
                <div
                  onClick={() => setFormFormat('CBT_STANDARD')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    formFormat === 'CBT_STANDARD'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-[#1b212f] border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="exam_format"
                    checked={formFormat === 'CBT_STANDARD'}
                    onChange={() => setFormFormat('CBT_STANDARD')}
                    className="text-blue-600 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-200">CBT Standard</div>
                    <div className="text-[11px] text-slate-400">PG & Esai Konvensional</div>
                  </div>
                </div>

                {/* Radio 2: AKM / Kompleks */}
                <div
                  onClick={() => setFormFormat('AKM_KOMPLEKS')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    formFormat === 'AKM_KOMPLEKS'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-[#1b212f] border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="exam_format"
                    checked={formFormat === 'AKM_KOMPLEKS'}
                    onChange={() => setFormFormat('AKM_KOMPLEKS')}
                    className="text-blue-600 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-200">AKM / Kompleks</div>
                    <div className="text-[11px] text-slate-400">Multi-Tipe Soal</div>
                  </div>
                </div>
              </div>

              {/* Row 4: PILIH SISWA (KHUSUS) */}
              <div>
                <label className="text-xs font-bold text-rose-400 block mb-1 uppercase tracking-wider">
                  PILIH SISWA (KHUSUS)
                </label>
                <input
                  type="text"
                  value={formSpecificStudents}
                  onChange={(e) => setFormSpecificStudents(e.target.value)}
                  placeholder="Kosongkan jika untuk semua"
                  className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Row 5: Guru Pengampu */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Guru Pengampu
                </label>
                <select
                  value={formTeacherId}
                  onChange={(e) => handleSelectTeacher(e.target.value)}
                  className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.jabatan})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 6: Pengaturan Pilihan Ganda (Matching Image 3) */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                  <ListOrdered className="w-4 h-4 text-sky-400" />
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                    Pengaturan Pilihan Ganda
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Jumlah Soal
                    </label>
                    <input
                      type="number"
                      value={formPgCount}
                      onChange={(e) => setFormPgCount(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Soal Tampil
                    </label>
                    <input
                      type="number"
                      value={formPgDisplayCount}
                      onChange={(e) => setFormPgDisplayCount(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      value={formPgWeight}
                      onChange={(e) => setFormPgWeight(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Pilihan Opsi
                    </label>
                    <select
                      value={formPgOptionCount}
                      onChange={(e) => setFormPgOptionCount(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    >
                      <option value={4}>4 Opsi</option>
                      <option value={5}>5 Opsi</option>
                      <option value={3}>3 Opsi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 7: Pengaturan Esai (Matching Image 3) */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                    Pengaturan Esai
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Jumlah Soal
                    </label>
                    <input
                      type="number"
                      value={formEssayCount}
                      onChange={(e) => setFormEssayCount(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Soal Tampil
                    </label>
                    <input
                      type="number"
                      value={formEssayDisplayCount}
                      onChange={(e) => setFormEssayDisplayCount(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      value={formEssayWeight}
                      onChange={(e) => setFormEssayWeight(Number(e.target.value))}
                      className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Row 8: Status Keaktifan (Switch Toggle) */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Status Keaktifan</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className="cursor-pointer text-emerald-400 transition-colors"
                  >
                    {formIsActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                  <span className="text-xs font-medium text-slate-300">
                    Terbitkan Bank Soal (Langsung Aktif)
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Bank Soal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL IMPORT EXCEL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121620] border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-4 md:p-5 bg-gradient-to-r from-teal-700 to-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white">
                <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm md:text-base">Import Butir Soal via Excel (.xlsx / .csv)</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                  setImportParsedQuestions([]);
                }}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs text-slate-300">
              {/* Target Bank Soal Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                  Pilih Bank Soal Tujuan
                </label>
                <select
                  value={importTargetBankId || (viewingBankSoal as any)?.id || ''}
                  onChange={(e) => setImportTargetBankId(e.target.value)}
                  className="w-full bg-[#1b212f] border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-teal-500 cursor-pointer"
                >
                  {questionBanks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} ({b.subjectName}) - Saat ini: {b.questions.length} butir
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Unggah File Excel (.xlsx / .xls / .csv)
                </label>
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-teal-500 bg-slate-900/60 text-center transition-colors">
                  <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    {importFile ? importFile.name : 'Klik untuk memilih file Excel naskah soal'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Mendukung format kolom standar: Nomor, Tipe, Naskah Soal, Opsi A-E, Kunci, Poin
                  </p>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <label
                      htmlFor="excel-file-input"
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      Pilih File Komputer
                    </label>
                    <button
                      type="button"
                      onClick={downloadExcelTemplate}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Format Template</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Parse Status / Preview */}
              {isParsing && (
                <div className="p-3 bg-blue-950/60 border border-blue-500/50 rounded-xl text-blue-300 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Sedang membaca dan memvalidasi struktur naskah soal...</span>
                </div>
              )}

              {importParsedQuestions.length > 0 && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{importParsedQuestions.length} Butir Soal Terdeteksi Valid</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Total Bobot: {importParsedQuestions.reduce((acc, q) => acc + (q.points || 0), 0)} Poin
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      PG: {importParsedQuestions.filter((q) => q.type === 'PG').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      PGK: {importParsedQuestions.filter((q) => q.type === 'PGK').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      Menjodohkan: {importParsedQuestions.filter((q) => q.type === 'MATCHING').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      Isian: {importParsedQuestions.filter((q) => q.type === 'SHORT').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      Esai: {importParsedQuestions.filter((q) => q.type === 'ESSAY').length}
                    </span>
                  </div>

                  {/* Mode Import */}
                  <div className="pt-2 border-t border-emerald-900/80 space-y-1.5">
                    <span className="font-semibold text-slate-200 block text-[11px]">
                      Metode Penggabungan Soal:
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'APPEND'}
                          onChange={() => setImportMode('APPEND')}
                          className="accent-teal-500"
                        />
                        <span>Tambahkan ke butir soal yang ada (Append)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'REPLACE'}
                          onChange={() => setImportMode('REPLACE')}
                          className="accent-teal-500"
                        />
                        <span>Gantikan seluruh butir soal lama (Replace)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {importErrors.length > 0 && (
                <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl space-y-1 text-amber-300 text-[11px]">
                  <span className="font-bold block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Catatan / Peringatan Baris:</span>
                  </span>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {importErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {importErrors.length > 5 && (
                      <li className="italic">...dan {importErrors.length - 5} baris lainnya</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                  setImportParsedQuestions([]);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importParsedQuestions.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi & Simpan ke Bank Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
