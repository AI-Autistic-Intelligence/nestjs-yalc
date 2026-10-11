import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.yalc', 'dist', 'var', '__tests__', '__mocks__'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else if (dirPath.endsWith('.ts') && !dirPath.endsWith('.spec.ts') && !dirPath.includes('mock')) {
      callback(dirPath);
    }
  });
}

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Safe common replacements
  content = content.replace(/Record<string,\s*any>/g, 'Record<string, unknown>');
  content = content.replace(/\[key:\s*string\]:\s*any/g, '[key: string]: unknown');
  content = content.replace(/\.\.\.([a-zA-Z0-9_]+):\s*any\[\]/g, '...$1: unknown[]');
  content = content.replace(/Observable<any>/g, 'Observable<unknown>');
  content = content.replace(/target:\s*any,\s*key:\s*string/g, 'target: object, key: string | symbol');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
