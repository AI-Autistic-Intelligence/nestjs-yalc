const fs = require('fs');

// 1. Fix the import in the source file
const srcFile = 'ag-grid/src/ag-grid-args.decorator.ts';
let srcCode = fs.readFileSync(srcFile, 'utf8');
srcCode = srcCode.replace(
  /import \{ GqlAgGridFieldsMapper \} from '@nestjs-yalc\/ag-grid\/gqlfields\.decorator';/,
  'import { GqlAgGridFieldsMapper } from \\'./gqlfields.decorator\\';'
);
fs.writeFileSync(srcFile, srcCode);

// 2. Fix the spec file
const specFile = 'ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts';
let specCode = fs.readFileSync(specFile, 'utf8');

// Put back jest.mock('@nestjs/graphql') at the top
if (!specCode.includes('jest.mock(\\'@nestjs/graphql\\');')) {
  specCode = specCode.replace(/import \{ importMockedEsm \} from '@nestjs-yalc\/jest\/esm\.helper\.js';\r?\n/, 'import { importMockedEsm } from \\'@nestjs-yalc/jest/esm.helper.js\\';\njest.mock(\\'@nestjs/graphql\\');\n');
}

// Add static import of graphql
if (!specCode.includes('import * as graphql from \\'@nestjs/graphql\\';')) {
  specCode = specCode.replace(/import \{ GqlExecutionContext \} from '@nestjs\/graphql';\r?\n/, 'import { GqlExecutionContext } from \\'@nestjs/graphql\\';\nimport * as graphql from \\'@nestjs/graphql\\';\n');
}

// Change importMockedEsm back to relative path for GqlAgGridDecorator
specCode = specCode.replace(
  /const GqlAgGridDecorator = await importMockedEsm\('@nestjs-yalc\/ag-grid\/gqlfields\.decorator', import\.meta\);/,
  'const GqlAgGridDecorator = await importMockedEsm(\\'../gqlfields.decorator.js\\', import.meta);'
);

// Remove importMockedEsm for graphql
specCode = specCode.replace(
  /const graphql = await importMockedEsm\('@nestjs\/graphql', import\.meta\);\r?\n/,
  ''
);

fs.writeFileSync(specFile, specCode);
