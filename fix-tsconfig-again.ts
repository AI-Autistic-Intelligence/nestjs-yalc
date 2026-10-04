/**
 * @file fix-tsconfig-again.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';

const tsconfigPath = 'C:\\Users\\nn\\Desktop\\code\\nestjs-yalc\\tsconfig.json';
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Fix paths that shouldn't be @node-yalc since they are still @nest-yalc-2
const paths = tsconfig.compilerOptions.paths;

paths["@nest-yalc-2/interfaces"] = ["./interfaces/src"];
paths["@nest-yalc-2/interfaces/*"] = ["./interfaces/src/*"];

paths["@nest-yalc-2/types"] = ["./types/src"];
paths["@nest-yalc-2/types/*"] = ["./types/src/*"];

paths["@nest-yalc-2/types-extends"] = ["./types-extends/src"];
paths["@nest-yalc-2/types-extends/*"] = ["./types-extends/src/*"];

paths["@nest-yalc-2/aws-helpers"] = ["./aws-helpers/src"];
paths["@nest-yalc-2/aws-helpers/*"] = ["./aws-helpers/src/*"];

paths["@nest-yalc-2/utils"] = ["./utils/src"];
paths["@nest-yalc-2/utils/*"] = ["./utils/src/*"];

// ensure node-yalc paths exist
paths["@nest-yalc-2/utils"] = ["./node-yalc/utils/src"];
paths["@nest-yalc-2/utils/*"] = ["./node-yalc/utils/src/*"];

// ensure types for node-yalc exist too because they are moved
paths["@nest-yalc-2/types"] = ["./node-yalc/types/src"];
paths["@nest-yalc-2/types/*"] = ["./node-yalc/types/src/*"];

// cleanup incorrect node-yalc paths that do not exist
delete paths["@nest-yalc-2/interfaces"];
delete paths["@nest-yalc-2/interfaces/*"];
delete paths["@nest-yalc-2/aws-helpers"];
delete paths["@nest-yalc-2/aws-helpers/*"];
delete paths["@nest-yalc-2/types-extends"];
delete paths["@nest-yalc-2/types-extends/*"];

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
console.log('Fixed tsconfig');
