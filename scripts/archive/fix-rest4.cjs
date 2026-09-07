const fs = require('fs');

const files = [
  { p: 'ag-grid/src/__tests__/ag-grid-enum.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from ['"]\.\.\/ag-grid-enum\.helper(\.js)?['"];/, mod: '../ag-grid-enum.helper.js' },
  { p: 'ag-grid/src/__tests__/ag-grid.input.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from ['"]\.\.\/ag-grid\.input\.helper(\.js)?['"];/, mod: '../ag-grid.input.helper.js' }
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
  } else {
    console.log('Not found in ' + p);
  }
}
