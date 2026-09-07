const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('dist')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('.');
let changedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (file.includes('.spec.ts') || file.includes('.mock.ts')) {
    let changed = false;

    // Find all `import * as X from 'Y'`
    const importRegex = /import\s+\*\s+as\s+(\w+)\s+from\s+(['"][^'"]+['"])\s*;/g;
    let match;
    const toReplace = [];
    while ((match = importRegex.exec(content)) !== null) {
      toReplace.push({ full: match[0], name: match[1], path: match[2] });
    }

    if (toReplace.length > 0) {
      if (!content.includes('importMockedEsm')) {
        content = `import { importMockedEsm } from '@nest-yalc-2/jest/esm.helper.js';\n` + content;
      }
      for (const rep of toReplace) {
        content = content.replace(rep.full, `const ${rep.name} = await importMockedEsm(${rep.path}, import.meta);`);
      }
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      changedCount++;
    }
  }
}
console.log(`Changed ${changedCount} files.`);
