const fs = require('fs');
const ts = require('typescript');
const file = 'crud-gen/src/__tests__/crud-gen.input.spec.ts';
const content = fs.readFileSync(file, 'utf8');
const options = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
const res = ts.transpileModule(content, { compilerOptions: { ...options.compilerOptions, module: ts.ModuleKind.CommonJS } });
fs.writeFileSync('crud-gen-transpiled.js', res.outputText);
