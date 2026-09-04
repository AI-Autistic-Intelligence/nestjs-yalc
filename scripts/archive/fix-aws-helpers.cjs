const fs = require('fs');
let c = fs.readFileSync('aws-helpers/src/encryption.helper.spec.ts', 'utf8');
c = c.replace(/import\s+\*\s+as\s+\$\s+from\s+['"].\/encryption.helper['"];/, "const $ = await importMockedEsm('./encryption.helper.js', import.meta);");
fs.writeFileSync('aws-helpers/src/encryption.helper.spec.ts', c);
