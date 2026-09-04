const fs = require('fs');
const files = fs.readdirSync('ag-grid/src').filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.endsWith('.spec.ts'));
const exportsStr = files.map(f => `export * from './${f.replace('.ts', '.js')}';`).join('\n');
fs.writeFileSync('ag-grid/src/index.ts', exportsStr);
console.log('Written to ag-grid/src/index.ts');
