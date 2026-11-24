import fs from 'fs';
import path from 'path';

const files = [
  'gotaprincipal.jpeg',
  'gotacuriosa.jpeg',
  'gotaviajera.jpeg',
  'gotavaliente.jpeg',
  'gotagenerosa.jpeg',
];

for (const file of files) {
  const filePath = path.join('src/assets/images', file);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    console.log(`${file}: exists (${stat.size} bytes)`);
  } else {
    console.log(`${file}: NOT FOUND`);
  }
}
