const fs = require('fs');

function replaceIn(file, map) {
  let c = fs.readFileSync(file, 'utf8');
  for (const [k, v] of Object.entries(map)) {
    c = c.split(k).join(v);
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed: ' + file);
}

replaceIn('src/components/cetak/CetakLegerNilaiView.tsx', {
  'MIS INTEGRAL HIDAYATULLAH KOTA TERNATE': 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE',
  '<th className="border border-slate-900 py-2 px-2 text-center">FIKIH</th>': '<th className="border border-slate-900 py-2 px-2 text-center">SOSIOLOGI</th>',
  'fikih:': 'sos:',
  'st.fikih': 'st.sos'
});

replaceIn('src/components/cetak/DaftarHadirView.tsx', {
  'MIS INTEGRAL HIDAYATULLAH KOTA TERNATE': 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE',
  'Lab Komputer 1 (R_1)': 'Lab Komputer 1 (LAB-01)',
  'Lab Komputer 2 (R_2)': 'Lab Komputer 2 (LAB-02)',
  'value="R_1"': 'value="LAB-01"',
  'value="R_2"': 'value="LAB-02"'
});

replaceIn('src/components/cetak/DenahLokasiView.tsx', {
  'MIS INTEGRAL HIDAYATULLAH KOTA TERNATE': 'SMA INTEGRAL HIDAYATULLAH KOTA TERNATE'
});

replaceIn('src/components/nilai/DataNilaiUjianView.tsx', {
  'SOSIOLOGI KELAS VI 26': 'SOSIOLOGI KELAS X IPS'
});

replaceIn('src/components/nilai/HasilNilaiPerMapelView.tsx', {
  'SOSIOLOGI KELAS VI 26': 'SOSIOLOGI KELAS X IPS'
});

replaceIn('src/components/nilai/SemuaNilaiView.tsx', {
  'SOSIOLOGI KELAS VI 26': 'SOSIOLOGI KELAS X IPS'
});

console.log('All remaining items successfully replaced.');
