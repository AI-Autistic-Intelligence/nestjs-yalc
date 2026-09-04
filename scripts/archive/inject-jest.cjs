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
  if ((file.includes('.spec.ts') || file.includes('.mock.ts'))) {
    const imports = [];
    
    // Check what is missing (not already imported from @jest/globals)
    const hasImport = (name) => {
      const match = content.match(new RegExp(`import\\s+{[^}]*\\b${name}\\b[^}]*}\\s+from\\s+['"]@jest/globals['"]`));
      return match !== null;
    };

    if (content.match(/\bjest\b/) && !hasImport('jest')) imports.push('jest');
    if (content.match(/\bdescribe\b/) && !hasImport('describe')) imports.push('describe');
    if (content.match(/\bit\b/) && !hasImport('it')) imports.push('it');
    if (content.match(/\bexpect\b/) && !hasImport('expect')) imports.push('expect');
    if (content.match(/\bbeforeAll\b/) && !hasImport('beforeAll')) imports.push('beforeAll');
    if (content.match(/\bafterAll\b/) && !hasImport('afterAll')) imports.push('afterAll');
    if (content.match(/\bbeforeEach\b/) && !hasImport('beforeEach')) imports.push('beforeEach');
    if (content.match(/\bafterEach\b/) && !hasImport('afterEach')) imports.push('afterEach');

    if (imports.length > 0) {
      // If there's an existing import from @jest/globals, just append to it?
      // For simplicity, we just add another import statement at the top.
      const importStmt = `import { ${imports.join(', ')} } from '@jest/globals';\n`;
      const lines = content.split('\n');
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '' && !lines[i].trim().startsWith('//') && !lines[i].trim().startsWith('/*')) {
          insertIndex = i;
          break;
        }
      }
      lines.splice(insertIndex, 0, importStmt);
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      changedCount++;
    }
  }
}
console.log(`Changed ${changedCount} files.`);
