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
      // ONLY replace if the variable is used in `jest.spyOn(X, ` or mutated `X.`
      // Actually, if we just replace it for ANY spy or assignment, it might be safer to just check if `jest.spyOn(${match[1]}` exists, OR `${match[1]}.` assignment exists.
      // But wait! Classes were broken because I replaced `import * as X` with `importMockedEsm`, AND the file had `new X.MyClass()`.
      // So if the file contains `new ${match[1]}.`, DO NOT replace!
      const name = match[1];
      if (content.includes(`new ${name}.`)) {
        continue;
      }
      if (content.includes(`jest.spyOn(${name}`) || content.includes(`${name}.`) && content.match(new RegExp(`${name}\\.\\w+\\s*=\\s*jest\\.fn`))) {
         toReplace.push({ full: match[0], name: match[1], path: match[2] });
      }
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
