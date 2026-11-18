const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const { from, to } of replacements) {
    if (typeof from === 'string') {
      content = content.split(from).join(to);
    } else if (from instanceof RegExp) {
      content = content.replace(from, to);
    }
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[NO CHANGE] ${filePath}`);
  }
}

// 1. BrandingSettingsModal.tsx
replaceInFile('src/components/BrandingSettingsModal.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: 'MIS INTEGRAL HIDAYATULLAH', to: 'SMA INTEGRAL HIDAYATULLAH' },
]);

// 2. BankSoalManagementView.tsx
replaceInFile('src/components/banksoal/BankSoalManagementView.tsx', [
  { from: "setFormSubjectName(defSub?.name || 'FIKIH');", to: "setFormSubjectName(defSub?.name || 'Sosiologi');" },
]);

// 3. AnalisaNilaiMapelView.tsx
replaceInFile('src/components/analisa/AnalisaNilaiMapelView.tsx', [
  { from: "{ id: 'jadwal-6', name: 'FIKIH-KLS-VI-1 (Fikih Ibadah)', level: 'VI' },", to: "{ id: 'jadwal-6', name: 'SOS-KLS-X-1 (Sosiologi)', level: 'X' }," },
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="VI-A">Kelas VI-A</option>', to: '<option value="X MIPA 1">X MIPA 1</option>' },
  { from: '<option value="VI-B">Kelas VI-B</option>', to: '<option value="X IPS 1">X IPS 1</option>' },
]);

// 4. AnalisaNilaiRankingView.tsx
replaceInFile('src/components/analisa/AnalisaNilaiRankingView.tsx', [
  { from: "{ id: 'jadwal-6', name: 'FIKIH-KLS-VI-1 (Fikih Ibadah)', level: 'VI' },", to: "{ id: 'jadwal-6', name: 'SOS-KLS-X-1 (Sosiologi)', level: 'X' }," },
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="VI-A">Kelas VI-A</option>', to: '<option value="X MIPA 1">X MIPA 1</option>' },
  { from: '<option value="VI-B">Kelas VI-B</option>', to: '<option value="X IPS 1">X IPS 1</option>' },
]);

// 5. PerbaikanNilaiView.tsx
replaceInFile('src/components/analisa/PerbaikanNilaiView.tsx', [
  { from: "subjectTitle: 'FIKIH',", to: "subjectTitle: 'SOSIOLOGI'," },
  { from: "subjectCode: 'FIKIH KELAS VI 26',", to: "subjectCode: 'SOSIOLOGI KELAS X IPS'," },
  { from: "subjectTitle: 'AKIDAH AKHLAK',", to: "subjectTitle: 'PPKN'," },
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="VI-A">Kelas VI-A</option>', to: '<option value="X MIPA 1">X MIPA 1</option>' },
  { from: '<option value="VI-B">Kelas VI-B</option>', to: '<option value="X IPS 1">X IPS 1</option>' },
  { from: '<option value="FIKIH">Fikih</option>', to: '<option value="SOSIOLOGI">Sosiologi</option>' },
  { from: '<option value="AKIDAH AKHLAK">Akidah Akhlak</option>', to: '<option value="PPKN">PPKn</option>' },
]);

// 6. BeritaAcaraView.tsx
replaceInFile('src/components/cetak/BeritaAcaraView.tsx', [
  { from: "jadwalUjian: 'FIKIH KELAS VI 26',", to: "jadwalUjian: 'SOSIOLOGI KELAS X IPS'," },
  { from: "mataPelajaran: 'FIKIH',", to: "mataPelajaran: 'SOSIOLOGI'," },
  { from: '<option value="FIKIH KELAS VI 26">FIKIH KELAS VI 26 (FIKIH)</option>', to: '<option value="SOSIOLOGI KELAS X IPS">SOSIOLOGI KELAS X IPS (SOSIOLOGI)</option>' },
  { from: "'MIS INTEGRAL HIDAYATULLAH KOTA TERNATE'", to: "'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'" },
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: 'Nama Madrasah :', to: 'Nama Sekolah :' },
]);

// 7. CetakFormatNilaiView.tsx
replaceInFile('src/components/cetak/CetakFormatNilaiView.tsx', [
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="FIKIH KELAS VI 26">FIKIH KELAS VI 26</option>', to: '<option value="SOSIOLOGI KELAS X IPS">SOSIOLOGI KELAS X IPS</option>' },
]);

// 8. CetakKartuView.tsx
replaceInFile('src/components/cetak/CetakKartuView.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: "kelas: 'VI'", to: "kelas: 'X MIPA 1'" },
  { from: "ruang: 'R_1'", to: "ruang: 'LAB-01'" },
  { from: "ruang: 'R_2'", to: "ruang: 'LAB-02'" },
]);

// 9. CetakLegerNilaiView.tsx
replaceInFile('src/components/cetak/CetakLegerNilaiView.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="VI-A">Kelas VI-A</option>', to: '<option value="X MIPA 1">X MIPA 1</option>' },
  { from: '<option value="VI-B">Kelas VI-B</option>', to: '<option value="X IPS 1">X IPS 1</option>' },
  { from: "code: 'FKH', name: 'Fikih'", to: "code: 'SOS', name: 'Sosiologi'" },
  { from: "name: 'Fikih'", to: "name: 'Sosiologi'" },
]);

// 10. DaftarHadirView.tsx
replaceInFile('src/components/cetak/DaftarHadirView.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="VI-A">Kelas VI-A</option>', to: '<option value="X MIPA 1">X MIPA 1</option>' },
  { from: '<option value="VI-B">Kelas VI-B</option>', to: '<option value="X IPS 1">X IPS 1</option>' },
  { from: '<option value="R_1">R_1</option>', to: '<option value="LAB-01">LAB-01</option>' },
  { from: '<option value="R_2">R_2</option>', to: '<option value="LAB-02">LAB-02</option>' },
  { from: "'R_1'", to: "'LAB-01'" },
  { from: "'R_2'", to: "'LAB-02'" },
]);

// 11. DenahLokasiView.tsx
replaceInFile('src/components/cetak/DenahLokasiView.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: "'R_1'", to: "'LAB-01'" },
  { from: "'R_2'", to: "'LAB-02'" },
  { from: 'R_1', to: 'LAB-01' },
  { from: 'R_2', to: 'LAB-02' },
]);

// 12. RekapitulasiDataInfoViews.tsx & SiswaTidakIkutView.tsx
replaceInFile('src/components/datainfo/RekapitulasiDataInfoViews.tsx', [
  { from: "'R_1'", to: "'LAB-01'" },
  { from: "'R_2'", to: "'LAB-02'" },
]);
replaceInFile('src/components/datainfo/SiswaTidakIkutView.tsx', [
  { from: "'R_1'", to: "'LAB-01'" },
  { from: "'R_2'", to: "'LAB-02'" },
]);

// 13. JadwalUjianManagementView.tsx
replaceInFile('src/components/jadwal/JadwalUjianManagementView.tsx', [
  { from: 'FIKIH KELAS VI 26', to: 'SOSIOLOGI KELAS X IPS' },
  { from: 'Fikih', to: 'Sosiologi' },
  { from: 'Akidah Akhlak', to: 'PPKn' },
  { from: "'Kelas VI'", to: "'X MIPA 1'" },
  { from: "'VI'", to: "'X'" },
  { from: "'R_1'", to: "'LAB-01'" },
  { from: 'R_1', to: 'LAB-01' },
]);

// 14. MasterLevelView.tsx
replaceInFile('src/components/master/MasterLevelView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
]);

// 15. MasterRuanganView.tsx & MasterServerView.tsx
replaceInFile('src/components/master/MasterRuanganView.tsx', [
  { from: 'R_1', to: 'LAB-01' },
  { from: 'R_2', to: 'LAB-02' },
]);
replaceInFile('src/components/master/MasterServerView.tsx', [
  { from: 'R_1', to: 'LAB-01' },
  { from: 'R_2', to: 'LAB-02' },
]);

// 16. DataNilaiUjianView.tsx, HasilNilaiPerMapelView.tsx, HasilNilaiView.tsx, HistoryNilaiView.tsx, SemuaNilaiView.tsx
replaceInFile('src/components/nilai/DataNilaiUjianView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
  { from: 'FIKIH', to: 'SOSIOLOGI' },
  { from: 'Fikih', to: 'Sosiologi' },
]);
replaceInFile('src/components/nilai/HasilNilaiPerMapelView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
  { from: 'FIKIH', to: 'SOSIOLOGI' },
  { from: 'Fikih', to: 'Sosiologi' },
  { from: 'AKIDAH AKHLAK', to: 'PPKN' },
  { from: 'Akidah Akhlak', to: 'PPKn' },
]);
replaceInFile('src/components/nilai/HasilNilaiView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
]);
replaceInFile('src/components/nilai/HistoryNilaiView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
]);
replaceInFile('src/components/nilai/SemuaNilaiView.tsx', [
  { from: 'Kelas VI', to: 'Kelas X' },
  { from: "'VI'", to: "'X'" },
  { from: 'FIKIH', to: 'SOSIOLOGI' },
  { from: 'Fikih', to: 'Sosiologi' },
  { from: 'AKIDAH AKHLAK', to: 'PPKN' },
  { from: 'Akidah Akhlak', to: 'PPKn' },
]);

// 17. PrintCenter.tsx
replaceInFile('src/components/PrintCenter.tsx', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: 'MIS INTEGRAL HIDAYATULLAH', to: 'SMA INTEGRAL HIDAYATULLAH' },
  { from: 'MIS Integral Hidayatullah', to: 'SMA Integral Hidayatullah' },
]);

// 18. DaftarPesertaUjianView.tsx
replaceInFile('src/components/students/DaftarPesertaUjianView.tsx', [
  { from: "const [ruang, setRuang] = useState('R_1');", to: "const [ruang, setRuang] = useState('LAB-01');" },
  { from: "setRuang(rooms[0]?.code || 'R_1');", to: "setRuang(rooms[0]?.code || 'LAB-01');" },
  { from: '<option value="R_1">R_1</option>', to: '<option value="LAB-01">LAB-01</option>' },
  { from: '<option value="R_2">R_2</option>', to: '<option value="LAB-02">LAB-02</option>' },
]);

// 19. LokasiUjianView.tsx, PindahNilaiView.tsx, StatusPesertaView.tsx
replaceInFile('src/components/ubk/LokasiUjianView.tsx', [
  { from: 'MIS INTEGRAL HIDAYATULLAH', to: 'SMA INTEGRAL HIDAYATULLAH' },
]);
replaceInFile('src/components/ubk/PindahNilaiView.tsx', [
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
  { from: '<option value="FKH">Fikih</option>', to: '<option value="SOS">Sosiologi</option>' },
  { from: '<option value="AKAH">Akidah Akhlak</option>', to: '<option value="PPKN">PPKn</option>' },
]);
replaceInFile('src/components/ubk/StatusPesertaView.tsx', [
  { from: '<option value="VI">Kelas VI</option>', to: '<option value="X">Kelas X</option>' },
]);

// 20. DataAdministratorView.tsx & DataGuruView.tsx
replaceInFile('src/components/users/DataAdministratorView.tsx', [
  { from: "'MIS Integral Hidayatullah'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
  { from: 'MIS Integral Hidayatullah', to: 'SMA INTEGRAL HIDAYATULLAH' },
  { from: 'misintegralhidayatullahkotaternate@gmail.com', to: 'smaintegralhidayatullah@gmail.com' },
]);
replaceInFile('src/components/users/DataGuruView.tsx', [
  { from: "subject: 'FIKIH',", to: "subject: 'SOSIOLOGI'," },
  { from: "subject: 'AKIDAH AKHLAK',", to: "subject: 'PPKN'," },
  { from: 'placeholder="Contoh: Kelas VI"', to: 'placeholder="Contoh: Kelas X"' },
]);

// 21. excel-export.ts
replaceInFile('src/lib/excel-export.ts', [
  { from: "'MIS INTEGRAL HIDAYATULLAH'", to: "'SMA INTEGRAL HIDAYATULLAH'" },
]);

// 22. master-template.ts
replaceInFile('src/lib/master-template.ts', [
  { from: "'R_1'", to: "'LAB-01'" },
  { from: "'R_2'", to: "'LAB-02'" },
  { from: 'R_1', to: 'LAB-01' },
  { from: 'R_2', to: 'LAB-02' },
  { from: 'Kelas VII (Tingkat 7 SMP/MTs)', to: 'Kelas X (Tingkat 10 SMA)' },
  { from: 'Kelas VIII (Tingkat 8 SMP/MTs)', to: 'Kelas XI (Tingkat 11 SMA)' },
]);

console.log('Cleanup script finished successfully.');
