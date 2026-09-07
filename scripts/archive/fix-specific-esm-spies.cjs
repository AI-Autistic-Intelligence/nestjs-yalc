const fs = require('fs');

const files = [
  { p: 'ag-grid/src/__tests__/gqlfields.decorator.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid-metadata\.helper';/, mod: '../ag-grid-metadata.helper.js' },
  { p: 'ag-grid/src/__tests__/ag-grid.repository.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from 'typeorm';/, mod: 'typeorm' },
  { p: 'utils/src/__tests__/faker-helper.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@faker-js\/faker';/, mod: '@faker-js/faker' }
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
