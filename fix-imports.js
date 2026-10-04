import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    if (['node_modules', 'var', 'dist', '.git'].includes(file)) continue;
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.ts') && !name.endsWith('.d.ts')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('.');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Pattern 1: Bare package imports ending with .js
  // e.g. import { ... } from '@nest-yalc-2/event-manager.js' -> '@nest-yalc-2/event-manager'
  // e.g. import { ... } from '@node-yalc/types.js' -> '@node-yalc/types'
  newContent = newContent.replace(/(from|import)\s+(['"])(@nest-yalc-2\/[^/'"]+|@node-yalc\/[^/'"]+)\.js\2/g, '$1 $2$3$2');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated bare pkg imports in ${file}`);
    count++;
  }
}

console.log(`Total files updated: ${count}`);
