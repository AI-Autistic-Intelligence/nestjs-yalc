/**
 * @file fix-tsconfig.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';

const tsconfigPath = 'C:\\Users\\nn\\Desktop\\code\\nestjs-yalc\\tsconfig.json';
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const newPaths = {
  "@nest-yalc-2/database": ["./node-yalc/database/src"],
  "@nest-yalc-2/database/*": ["./node-yalc/database/src/*"],
  "@nest-yalc-2/ag-grid": ["./node-yalc/ag-grid/src"],
  "@nest-yalc-2/ag-grid/*": ["./node-yalc/ag-grid/src/*"],
  "@nest-yalc-2/event-manager": ["./node-yalc/event-manager/src"],
  "@nest-yalc-2/event-manager/*": ["./node-yalc/event-manager/src/*"]
};

tsconfig.compilerOptions.paths = { ...tsconfig.compilerOptions.paths, ...newPaths };
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
console.log('Updated tsconfig.json');
