const fs = require('fs');
const path = require('path');

const terms = [
  'MIS Integral',
  'misintegral',
  'Dra. Sri Wahyuni',
  'KELAS VI',
  'Kelas VI',
  'Fikih',
  'Akidah Akhlak',
  'Jurusan MI',
  'R_1',
  'R_2',
  'guru_matematika'
];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['node_modules', '.next', '.git', 'scripts'].includes(item)) continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(tsx?|jsx?|json)$/.test(item)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const t of terms) {
        if (content.toLowerCase().includes(t.toLowerCase())) {
          console.log(`[MATCH] "${t}" in ${path.relative('.', full)}`);
        }
      }
    }
  }
}

walk('.');
