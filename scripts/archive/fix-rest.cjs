const fs = require('fs');

const files = [
  { p: 'ag-grid/src/__tests__/object.decorator.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid-metadata\.helper';/, mod: '../ag-grid-metadata.helper.js' },
  { p: 'crud-gen/src/__tests__/generic-resolver.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@nestjs-yalc\/ag-grid\/ag-grid-metadata\.helper';/, mod: '@nestjs-yalc/ag-grid/ag-grid-metadata.helper.js' },
  { p: 'ag-grid/src/__tests__/gqlmapper.decorator.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid-factory\.helper';/, mod: '../ag-grid-factory.helper.js' },
  { p: 'ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid-metadata\.helper';/, mod: '../ag-grid-metadata.helper.js' },
  { p: 'ag-grid/src/__tests__/generic-service.service.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/generic-service\.service';/, mod: '../generic-service.service.js' },
  { p: 'ag-grid/src/__tests__/ag-grid-enum.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid-enum\.helper';/, mod: '../ag-grid-enum.helper.js' },
  { p: 'ag-grid/src/__tests__/ag-grid.input.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '\.\.\/ag-grid\.input\.helper';/, mod: '../ag-grid.input.helper.js' }
];

for (const {p, find, mod} of files) {
  if (!fs.existsSync(p)) {
      console.log('Skipping ' + p);
      continue;
  }
  let c = fs.readFileSync(p, 'utf8');
  let m = c.match(find);
  if (m) {
    c = c.replace(m[0], `const ${m[1]} = await importMockedEsm('${mod}', import.meta);`);
    if (!c.includes('importMockedEsm')) {
       c = "import { importMockedEsm } from '@nestjs-yalc/jest/esm.helper.js';\n" + c;
    }
    fs.writeFileSync(p, c);
    console.log('Fixed ' + p);
  }
}
