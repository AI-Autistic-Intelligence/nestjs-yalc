import fs from 'fs';
import path from 'path';

const result = {};

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.yalc', 'dist', 'var', '__tests__', '__mocks__'].includes(f)) {
        walkDir(dirPath);
      }
    } else if (dirPath.endsWith('.ts') && !dirPath.endsWith('.spec.ts') && !dirPath.includes('mock')) {
      const content = fs.readFileSync(dirPath, 'utf8');
      if (content.match(/\bany\b/)) {
        const lines = content.split('\n');
        const anyLines = [];
        lines.forEach((line, idx) => {
          if (line.match(/\bany\b/)) {
            anyLines.push({ line: idx + 1, content: line.trim() });
          }
        });
        if (anyLines.length > 0) {
          result[dirPath] = anyLines;
        }
      }
    }
  });
}

walkDir('.');
fs.writeFileSync('any-report.json', JSON.stringify(result, null, 2));
console.log(`Found ${Object.keys(result).length} files with 'any'.`);
