const fs = require('fs');
const files = [
  { p: 'ag-grid/src/__tests__/ag-grid.helpers.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/object\.decorator\.js';/, mod: '../object.decorator.js' },
  { p: 'ag-grid/src/__tests__/query-builder.helpers.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/object\.decorator\.js';/, mod: '../object.decorator.js' },
  { p: 'ag-grid/src/__tests__/gqlfields.decorator.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@nest-yalc-2\/crud-gen\/crud-gen\.helpers\.js';/, mod: '@nest-yalc-2/crud-gen/crud-gen.helpers.js' },
  { p: 'ag-grid/src/__tests__/ag-grid.repository.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from 'typeorm\/decorator\/EntityRepository\.js';/, mod: 'typeorm/decorator/EntityRepository.js' },
  { p: 'utils/src/__tests__/encryption.helper.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from 'crypto';/, mod: 'crypto' },
  { p: 'aws-helpers/src/__tests__/encryption.helper.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from 'crypto';/, mod: 'crypto' }
];

for (const {p, find, mod} of files) {
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');
  let m = c.match(find);
  if (m) {
    c = c.replace(m[0], `const ${m[1]} = await importMockedEsm('${mod}', import.meta);`);
    if (!c.includes('importMockedEsm')) {
       c = "import { importMockedEsm } from '@nest-yalc-2/jest/esm.helper.js';\n" + c;
    }
    fs.writeFileSync(p, c);
    console.log('Fixed ' + p);
  }
}
