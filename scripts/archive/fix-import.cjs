const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('importMockedEsm')) {
        content = content.replace(/import\s*\{\s*importMockedEsm\s*\}\s*from\s*['"]@nestjs-yalc\/jest\/esm\.helper\.js['"];\r?\n?/g, '');
        // Replace `await importMockedEsm(\n  'module',\n  import.meta\n)` with `await import('module')`
        content = content.replace(/await\s+importMockedEsm\s*\([\s\S]*?(['"][^'"]+['"])[\s\S]*?(?:,\s*import\.meta\s*)?\)/g, 'await import($1)');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir('crud-gen/src/__tests__');
