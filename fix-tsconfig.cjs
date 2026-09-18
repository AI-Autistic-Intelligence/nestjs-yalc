const fs = require('fs');

const tsconfigPath = 'C:\\Users\\nn\\Desktop\\code\\nestjs-yalc\\tsconfig.json';
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const newPaths = {
  "@node-yalc/database": ["./node-yalc/database/src"],
  "@node-yalc/database/*": ["./node-yalc/database/src/*"],
  "@node-yalc/ag-grid": ["./node-yalc/ag-grid/src"],
  "@node-yalc/ag-grid/*": ["./node-yalc/ag-grid/src/*"],
  "@node-yalc/event-manager": ["./node-yalc/event-manager/src"],
  "@node-yalc/event-manager/*": ["./node-yalc/event-manager/src/*"]
};

tsconfig.compilerOptions.paths = { ...tsconfig.compilerOptions.paths, ...newPaths };
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
console.log('Updated tsconfig.json');
