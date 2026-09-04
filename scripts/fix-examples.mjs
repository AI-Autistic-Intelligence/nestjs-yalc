import fs from 'fs';
import glob from 'glob';

const files = glob.sync('examples/**/*.spec.ts', { cwd: 'c:/Users/nn/Desktop/code/nestjs-yalc', absolute: true });

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace `const { X, Y } = await import('...');` with `import { X, Y } from '...';`
  const regex = /const\s+(\{[\s\S]*?\})\s*=\s*await\s+import\s*\(\s*['"](.*?)['"]\s*\)\s*;/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'import $1 from \'$2\';');
    changed = true;
  }

  // Replace `const X = await import('...');` with `import * as X from '...';`
  const regex2 = /const\s+([A-Za-z0-9_]+)\s*=\s*await\s+import\s*\(\s*['"](.*?)['"]\s*\)\s*;/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, 'import * as $1 from \'$2\';');
    changed = true;
  }
  
  // Replace `const X = await Promise.resolve().then(() => __importStar(require("...")));` with `import * as X from '...';`
  // Actually, TypeScript transpiles this automatically. The problem is in the SOURCE file which has `await import`.
  
  // Replace `await jest.unstable_mockModule('...', () => ...)` with `jest.mock('...', () => ...)`
  if (content.includes('jest.unstable_mockModule')) {
    content = content.replace(/await\s+jest\.unstable_mockModule/g, 'jest.mock');
    content = content.replace(/jest\.unstable_mockModule/g, 'jest.mock');
    changed = true;
  }

  // Remove importMockedEsm usage
  if (content.includes('importMockedEsm')) {
    content = content.replace(/import\s*\{\s*importMockedEsm\s*\}\s*from\s*['"].*esm\.helper\.js['"];?\r?\n?/g, '');
    content = content.replace(/const\s+([A-Za-z0-9_]+)\s*=\s*\(?await\s+importMockedEsm\(\s*['"](.*?)['"]\s*,\s*import\.meta\s*\)\)?\s*(as\s+.*?)?;/g, 'jest.mock(\'$2\');\nimport * as $1Mock from \'$2\';\nconst $1 = $1Mock $3;');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}
