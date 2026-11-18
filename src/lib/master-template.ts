import * as XLSX from 'xlsx';
import {
  ExamTypeMaster,
  MajorMaster,
  LevelMaster,
  ServerMaster,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
  Student,
} from './types';

export const MASTER_TEMPLATE_HEADERS = [
  'ID',
  'NIS',
  'No Peserta',
  'Nama',
  'Level',
  'Kelas',
  'Jurusan',
  'Sesi',
  'Ruang',
  'Username',
  'Password',
  'Foto',
  'Server',
  'Agama',
  'Nama Depan',
];

export const SAMPLE_MASTER_TEMPLATE_ROWS: (string | number | null)[][] = [
  [1, 1010, '10 - 10 - 1991', 'Azan Fadli Mulyadi', 'VII', 'VII_1', '', 1, 'LAB-01', 'azanfadli', 1010, 'azan.png', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [2, 1010, '11 - 10 - 1991', 'Azan Fadli Mulyadi', 'VIII', 'VIII_2', '', 2, 'LAB-02', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [3, 1010, '12 - 10 - 1991', 'Azan Fadli Mulyadi', 'IX', 'IX_3', '', 3, 'R_3', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [4, 1010, '13 - 10 - 1991', 'Azan Fadli Mulyadi', 'IPS_X', 'IPS_XI_1', 'IPS', 1, 'LAB-01', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [5, 1010, '14 - 10 - 1991', 'Azan Fadli Mulyadi', 'IPA_XII', 'IPA_XII_2', 'IPA', 2, 'LAB-02', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [6, 1010, '15 - 10 - 1991', 'Azan Fadli Mulyadi', 'IPB_XIII', 'IPB_XIII_3', 'IPB', 3, 'R_3', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [7, 1010, '16 - 10 - 1991', 'Azan Fadli Mulyadi', 'RPL_X', 'RPL_XI_1', 'RPL', 1, 'LAB-01', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [8, 1010, '17 - 10 - 1991', 'Azan Fadli Mulyadi', 'TKJ_XII', 'TKJ_XII_2', 'TKJ', 2, 'LAB-02', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
  [9, 1010, '18 - 10 - 1991', 'Azan Fadli Mulyadi', 'INF_XIII', 'INF_XIII_3', 'INF', 3, 'R_3', 'azanfadli', 1010, '', 'SR01', 'ISLAM', 'Azan Fadli Mulyadi'],
];

// DATA DEFAULT MASTER
export const DEFAULT_EXAM_TYPES: ExamTypeMaster[] = [
  { id: 'et_1', code: 'ASAS', name: 'Asesmen Sumatif Akhir Semester', description: 'Ujian Penilaian Hasil Belajar Akhir Semester Ganjil/Genap', isActive: true },
  { id: 'et_2', code: 'ANBK', name: 'Asesmen Nasional Berbasis Komputer', description: 'Asesmen Nasional Kemendikbudristek (AKM, Survei Karakter, Lingkungan)', isActive: true },
  { id: 'et_3', code: 'PTS', name: 'Penilaian Tengah Semester', description: 'Evaluasi Pembelajaran Pertengahan Semester', isActive: true },
  { id: 'et_4', code: 'PAS', name: 'Penilaian Akhir Semester', description: 'Penilaian Akhir Semester Reguler', isActive: true },
  { id: 'et_5', code: 'PAT', name: 'Penilaian Akhir Tahun', description: 'Ujian Kenaikan Kelas Akhir Tahun Ajaran', isActive: true },
  { id: 'et_6', code: 'USBK', name: 'Ujian Sekolah Berbasis Komputer', description: 'Ujian Penentu Kelulusan Peserta Didik Tingkat Akhir', isActive: true },
  { id: 'et_7', code: 'TO', name: 'Try Out Ujian & Simulasi CBT', description: 'Uji Coba Persiapan Menghadapi Ujian Nasional / Sekolah', isActive: true },
];

export const DEFAULT_MAJORS: MajorMaster[] = [
  { id: 'mj_1', code: 'IPA', name: 'Ilmu Pengetahuan Alam', field: 'MIPA / Sains', totalClasses: 3, isActive: true },
  { id: 'mj_2', code: 'IPS', name: 'Ilmu Pengetahuan Sosial', field: 'Sosial Humaniora', totalClasses: 3, isActive: true },
  { id: 'mj_3', code: 'IPB', name: 'Ilmu Pengetahuan Bahasa & Budaya', field: 'Bahasa & Sastra', totalClasses: 2, isActive: true },
  { id: 'mj_4', code: 'RPL', name: 'Rekayasa Perangkat Lunak', field: 'Teknologi Informasi', totalClasses: 3, isActive: true },
  { id: 'mj_5', code: 'TKJ', name: 'Teknik Komputer dan Jaringan', field: 'Teknologi Informasi & Jaringan', totalClasses: 3, isActive: true },
  { id: 'mj_6', code: 'INF', name: 'Informatika', field: 'Sains Komputer Modern', totalClasses: 2, isActive: true },
  { id: 'mj_7', code: 'UMUM', name: 'Pendidikan Dasar & Umum', field: 'Reguler', totalClasses: 5, isActive: true },
];

export const DEFAULT_LEVELS: LevelMaster[] = [
  // Jenjang Sekolah Dasar (SD / MI)
  { id: 'lvl_1', code: 'I', name: 'Kelas I (Tingkat 1 SD/MI)', order: 1, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Tahun Pertama' },
  { id: 'lvl_2', code: 'II', name: 'Kelas II (Tingkat 2 SD/MI)', order: 2, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Tahun Kedua' },
  { id: 'lvl_3', code: 'III', name: 'Kelas III (Tingkat 3 SD/MI)', order: 3, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Tahun Ketiga' },
  { id: 'lvl_4', code: 'IV', name: 'Kelas IV (Tingkat 4 SD/MI)', order: 4, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Fase B' },
  { id: 'lvl_5', code: 'V', name: 'Kelas V (Tingkat 5 SD/MI)', order: 5, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Fase C' },
  { id: 'lvl_6', code: 'VI', name: 'Kelas VI (Tingkat 6 SD/MI)', order: 6, totalClasses: 2, description: 'Jenjang Pendidikan Dasar Tingkat Akhir' },

  // Jenjang Sekolah Menengah Pertama (SMP / MTs)
  { id: 'lvl_7', code: 'VII', name: 'Kelas VII (Tingkat 7 SMP/MTs)', order: 7, totalClasses: 3, description: 'Jenjang Menengah Pertama Kelas 1' },
  { id: 'lvl_8', code: 'VIII', name: 'Kelas VIII (Tingkat 8 SMP/MTs)', order: 8, totalClasses: 3, description: 'Jenjang Menengah Pertama Kelas 2' },
  { id: 'lvl_9', code: 'IX', name: 'Kelas IX (Tingkat 9 SMP/MTs)', order: 9, totalClasses: 3, description: 'Jenjang Menengah Pertama Kelas 3' },

  // Jenjang Sekolah Menengah Atas / Kejuruan (SMA / SMK / MA)
  { id: 'lvl_10', code: 'X', name: 'Kelas X (Tingkat 10 SMA/SMK/MA)', order: 10, totalClasses: 4, description: 'Jenjang Menengah Atas Tahun Pertama' },
  { id: 'lvl_11', code: 'XI', name: 'Kelas XI (Tingkat 11 SMA/SMK/MA)', order: 11, totalClasses: 4, description: 'Jenjang Menengah Atas Tahun Kedua' },
  { id: 'lvl_12', code: 'XII', name: 'Kelas XII (Tingkat 12 SMA/SMK/MA)', order: 12, totalClasses: 4, description: 'Jenjang Menengah Atas Tahun Ketiga' },
  { id: 'lvl_ips_x', code: 'IPS_X', name: 'Tingkat X Peminatan IPS', order: 7, totalClasses: 2, description: 'Peminatan Sosial Humaniora Kelas 10' },
  { id: 'lvl_ipa_xii', code: 'IPA_XII', name: 'Tingkat XII Peminatan IPA', order: 8, totalClasses: 2, description: 'Peminatan MIPA Sains Kelas 12' },
  { id: 'lvl_ipb_xiii', code: 'IPB_XIII', name: 'Tingkat XIII Bahasa Budaya', order: 9, totalClasses: 1, description: 'Peminatan Bahasa Lanjutan' },
  { id: 'lvl_rpl_x', code: 'RPL_X', name: 'Tingkat X Rekayasa Perangkat Lunak', order: 10, totalClasses: 2, description: 'Program Keahlian IT Software' },
  { id: 'lvl_tkj_xii', code: 'TKJ_XII', name: 'Tingkat XII Komputer & Jaringan', order: 11, totalClasses: 2, description: 'Program Keahlian IT Hardware & Network' },
  { id: 'lvl_inf_xiii', code: 'INF_XIII', name: 'Tingkat XIII Informatika Terapan', order: 12, totalClasses: 1, description: 'Program Keahlian Sains Komputer Lanjutan' },
];

export const DEFAULT_SERVERS: ServerMaster[] = [
  { id: 'srv_1', code: 'SR01', name: 'Server UBK Utama 01', ipAddress: '192.168.0.200', status: 'ONLINE', assignedRooms: 'LAB-01, LAB-02, R_3', lastPing: 'Baru saja' },
  { id: 'srv_2', code: 'SERVER-PUSAT-01', name: 'Server CBT Cloud Cluster A', ipAddress: '192.168.1.100', status: 'ONLINE', assignedRooms: 'LAB-01, LAB-02', lastPing: 'Baru saja' },
  { id: 'srv_3', code: 'SERVER-01', name: 'Server Lokal Lab Multimedia', ipAddress: '192.168.1.10', status: 'ONLINE', assignedRooms: 'RUANG-01', lastPing: '1 menit lalu' },
  { id: 'srv_4', code: 'SR-CADANGAN', name: 'Server Disaster Recovery (Standby)', ipAddress: '192.168.0.250', status: 'STANDBY', assignedRooms: '-', lastPing: '5 menit lalu' },
];

/**
 * Download Template Master (.xlsx)
 */
export function downloadMasterTemplateExcel() {
  const wsData = [
    MASTER_TEMPLATE_HEADERS,
    ...SAMPLE_MASTER_TEMPLATE_ROWS,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // ID
    { wch: 12 }, // NIS
    { wch: 18 }, // No Peserta
    { wch: 25 }, // Nama
    { wch: 12 }, // Level
    { wch: 14 }, // Kelas
    { wch: 12 }, // Jurusan
    { wch: 8 },  // Sesi
    { wch: 10 }, // Ruang
    { wch: 15 }, // Username
    { wch: 12 }, // Password
    { wch: 14 }, // Foto
    { wch: 12 }, // Server
    { wch: 12 }, // Agama
    { wch: 25 }, // Nama Depan
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Trigger browser download
  XLSX.writeFile(wb, 'importdatamaster.xlsx');
}

/**
 * Download Template Master (.csv)
 */
export function downloadMasterTemplateCsv() {
  const wsData = [
    MASTER_TEMPLATE_HEADERS,
    ...SAMPLE_MASTER_TEMPLATE_ROWS,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const csvContent = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'importdatamaster.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ExtractedMasterData {
  students: Student[];
  levels: LevelMaster[];
  majors: MajorMaster[];
  classes: SchoolClass[];
  rooms: ExamRoom[];
  sessions: ExamSessionInfo[];
  servers: ServerMaster[];
  summary: {
    totalRows: number;
    totalStudents: number;
    totalLevels: number;
    totalMajors: number;
    totalClasses: number;
    totalRooms: number;
    totalSessions: number;
    totalServers: number;
  };
}

/**
 * Parse an Excel/CSV file buffer or array buffer, and dynamically extract
 * all master entities (Levels, Majors, Classes, Rooms, Sessions, Servers, Students)
 */
export function parseMasterDataBuffer(buffer: ArrayBuffer | Uint8Array): ExtractedMasterData {
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  if (!rawRows || rawRows.length < 2) {
    throw new Error('Berkas kosong atau tidak memiliki data baris.');
  }

  // Header verification (Case-insensitive mapping)
  const headerRow = rawRows[0].map((h: any) => String(h || '').trim().toLowerCase());
  
  const findCol = (names: string[]): number => {
    return headerRow.findIndex((h) => names.some((n) => h === n.toLowerCase() || h.includes(n.toLowerCase())));
  };

  const idCol = findCol(['id']);
  const nisCol = findCol(['nis']);
  const noPesertaCol = findCol(['no peserta', 'nopeserta', 'no_peserta']);
  const namaCol = findCol(['nama', 'name']);
  const levelCol = findCol(['level', 'tingkat']);
  const kelasCol = findCol(['kelas', 'class']);
  const jurusanCol = findCol(['jurusan', 'major']);
  const sesiCol = findCol(['sesi', 'session']);
  const ruangCol = findCol(['ruang', 'room']);
  const usernameCol = findCol(['username', 'user']);
  const passwordCol = findCol(['password', 'pass']);
  const fotoCol = findCol(['foto', 'photo']);
  const serverCol = findCol(['server']);
  const agamaCol = findCol(['agama', 'religion']);
  const namaDepanCol = findCol(['nama depan', 'first name']);

  const dataRows = rawRows.slice(1).filter((r) => r && r.length > 0 && r.some((cell) => cell !== null && cell !== ''));

  const levelSet = new Set<string>();
  const majorSet = new Set<string>();
  const classMap = new Map<string, { level: string; major: string }>();
  const roomSet = new Set<string>();
  const sessionSet = new Set<number>();
  const serverSet = new Set<string>();

  const students: Student[] = [];

  dataRows.forEach((row, idx) => {
    const rawId = idCol >= 0 ? String(row[idCol] || idx + 1) : String(idx + 1);
    const nis = nisCol >= 0 ? String(row[nisCol] || `10${idx + 10}`) : `10${idx + 10}`;
    const noPeserta = noPesertaCol >= 0 ? String(row[noPesertaCol] || `U-2026-${String(idx + 1).padStart(3, '0')}`) : `U-2026-${String(idx + 1).padStart(3, '0')}`;
    const nama = namaCol >= 0 ? String(row[namaCol] || `Siswa ${idx + 1}`) : `Siswa ${idx + 1}`;
    const level = levelCol >= 0 && row[levelCol] ? String(row[levelCol]).trim() : 'X';
    const className = kelasCol >= 0 && row[kelasCol] ? String(row[kelasCol]).trim() : 'X-1';
    const rawJurusan = jurusanCol >= 0 && row[jurusanCol] ? String(row[jurusanCol]).trim() : '';
    const jurusan = rawJurusan || 'UMUM';
    const rawSesi = sesiCol >= 0 ? Number(row[sesiCol]) || 1 : 1;
    const room = ruangCol >= 0 && row[ruangCol] ? String(row[ruangCol]).trim() : 'LAB-01';
    const username = usernameCol >= 0 && row[usernameCol] ? String(row[usernameCol]).trim() : `user${idx + 1}`;
    const passwordText = passwordCol >= 0 && row[passwordCol] ? String(row[passwordCol]).trim() : '123456';
    const foto = fotoCol >= 0 && row[fotoCol] ? String(row[fotoCol]).trim() : undefined;
    const server = serverCol >= 0 && row[serverCol] ? String(row[serverCol]).trim() : 'SR01';

    levelSet.add(level);
    if (jurusan && jurusan !== 'null' && jurusan !== 'undefined') {
      majorSet.add(jurusan);
    }
    classMap.set(className, { level, major: jurusan });
    roomSet.add(room);
    sessionSet.add(rawSesi);
    serverSet.add(server);

    students.push({
      id: `std_imp_${idx + 1}_${Date.now()}`,
      noPeserta,
      name: nama,
      nisn: `00${nis}${idx + 10}`,
      nis,
      level,
      className,
      jurusan,
      username,
      passwordText,
      room,
      session: `Sesi ${rawSesi}`,
      server,
      photoUrl: foto,
    });
  });

  // Build LevelMaster[]
  const levels: LevelMaster[] = Array.from(levelSet).map((code, i) => {
    const existing = DEFAULT_LEVELS.find((l) => l.code.toLowerCase() === code.toLowerCase());
    return existing || {
      id: `lvl_imp_${i + 1}`,
      code,
      name: `Tingkat / Level ${code}`,
      order: i + 1,
      totalClasses: 1,
      description: `Auto-extracted level ${code} dari import data master`,
    };
  });

  // Build MajorMaster[]
  const majors: MajorMaster[] = Array.from(majorSet).map((code, i) => {
    const existing = DEFAULT_MAJORS.find((m) => m.code.toLowerCase() === code.toLowerCase());
    return existing || {
      id: `mj_imp_${i + 1}`,
      code,
      name: `Jurusan ${code}`,
      field: 'Peminatan Kejuruan',
      totalClasses: 1,
      isActive: true,
    };
  });

  // Build SchoolClass[]
  const classes: SchoolClass[] = Array.from(classMap.entries()).map(([name, meta], i) => ({
    id: `cls_imp_${i + 1}`,
    name,
    level: meta.level,
    jurusan: meta.major || 'UMUM',
    waliKelas: 'Guru Pengampu Rombel',
    totalStudents: students.filter((s) => s.className === name).length || 1,
  }));

  // Build ExamRoom[]
  const rooms: ExamRoom[] = Array.from(roomSet).map((code, i) => {
    const existing = DEFAULT_SERVERS[0];
    return {
      id: `rm_imp_${i + 1}`,
      code,
      name: `Ruang Ujian ${code}`,
      capacity: 36,
      proctorName: 'Proktor Ruang UBK',
      serverName: existing?.code || 'SR01',
    };
  });

  // Build ExamSessionInfo[]
  const sessions: ExamSessionInfo[] = Array.from(sessionSet).sort().map((num) => {
    const timeRanges: Record<number, string> = {
      1: '07:30 - 09:30 WIT',
      2: '10:00 - 12:00 WIT',
      3: '13:00 - 15:00 WIT',
      4: '15:30 - 17:30 WIT',
    };
    return {
      id: `ses_imp_${num}`,
      sessionNumber: num,
      name: `Sesi ${num}`,
      timeRange: timeRanges[num] || `Sesi ${num}`,
      startTime: num === 1 ? '07:30' : num === 2 ? '10:00' : '13:00',
      endTime: num === 1 ? '09:30' : num === 2 ? '12:00' : '15:00',
      description: `Sesi Ujian ${num}`,
    };
  });

  // Build ServerMaster[]
  const servers: ServerMaster[] = Array.from(serverSet).map((code, i) => {
    const existing = DEFAULT_SERVERS.find((s) => s.code.toLowerCase() === code.toLowerCase());
    return existing || {
      id: `srv_imp_${i + 1}`,
      code,
      name: `Server CBT ${code}`,
      ipAddress: `192.168.0.${200 + i}`,
      status: 'ONLINE',
      assignedRooms: Array.from(roomSet).join(', '),
      lastPing: 'Baru saja',
    };
  });

  return {
    students,
    levels,
    majors,
    classes,
    rooms,
    sessions,
    servers,
    summary: {
      totalRows: dataRows.length,
      totalStudents: students.length,
      totalLevels: levels.length,
      totalMajors: majors.length,
      totalClasses: classes.length,
      totalRooms: rooms.length,
      totalSessions: sessions.length,
      totalServers: servers.length,
    },
  };
}
