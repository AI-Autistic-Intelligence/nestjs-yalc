/**
 * @file fix-tsconfig-interfaces.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';

const tsconfigPath = 'C:\\Users\\nn\\Desktop\\code\\nestjs-yalc\\tsconfig.json';
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Fix paths
const paths = tsconfig.compilerOptions.paths;

delete paths["@nest-yalc-2/interfaces"];
delete paths["@nest-yalc-2/interfaces/*"];

paths["@nest-yalc-2/interfaces"] = ["./node-yalc/interfaces/src"];
paths["@nest-yalc-2/interfaces/*"] = ["./node-yalc/interfaces/src/*"];

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
console.log('Fixed tsconfig');
