const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\nn\\Desktop\\code\\nestjs-yalc\\ag-grid\\src';
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts') && f !== 'index.ts');

let replacedFiles = [];

for (const file of files) {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('@nestjs/') && !content.includes('graphql') && !content.includes('GenericServiceFactory')) {
    const baseName = file.replace('.ts', '');
    const newContent = `export * from '@node-yalc/ag-grid/${baseName}';\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    replacedFiles.push(file);
  }
}

console.log('Replaced files:', replacedFiles);
