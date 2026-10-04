import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === 'dist' || file === 'var' || file === '.git' || file === 'coverage') {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.ts')) {
      callback(fullPath);
    }
  }
}

let modifiedCount = 0;
walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('@nest-yalc-2/')) {
    content = content.replace(/@node-yalc\//g, '@nest-yalc-2/');
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${filePath}`);
  }
});

console.log(`Total files modified: ${modifiedCount}`);
