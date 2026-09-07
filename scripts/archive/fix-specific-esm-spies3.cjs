const fs = require('fs');

const files = [
  { p: 'utils/src/faker-helper.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@faker-js\/faker';/, mod: '@faker-js/faker' },
  { p: 'event-manager/src/__tests__/event.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@nest-yalc-2\/logger';/, mod: '@nest-yalc-2/logger' },
  { p: 'event-manager/src/__tests__/event.module.spec.ts', find: /import \* as ([a-zA-Z0-9_]+) from '@nest-yalc-2\/logger';/, mod: '@nest-yalc-2/logger' }
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
