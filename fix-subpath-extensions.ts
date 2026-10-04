import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === 'dist' || file === 'var' || file === '.git' || file === 'coverage') {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.ts')) {
      callback(fullPath);
    }
  }
}

let modifiedCount = 0;

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Match import ... from 'specifier' or export ... from 'specifier' or import('specifier')
  content = content.replace(
    /(from\s+['"]|import\s*\(\s*['"])([^'"]+)(['"]\s*\)?)/g,
    (match, prefix, specifier, suffix) => {
      // Ignore if already has extension
      if (/\.(js|json|node|css|scss|less|wasm)$/.test(specifier)) {
        return match;
      }

      // Check if relative import (starts with . or ..)
      if (specifier.startsWith('.')) {
        return `${prefix}${specifier}.js${suffix}`;
      }

      // Check if subpath import for scoped packages: @scope/pkg/subpath (>= 2 slashes)
      if (specifier.startsWith('@')) {
        const parts = specifier.split('/');
        if (parts.length > 2) {
          return `${prefix}${specifier}.js${suffix}`;
        }
      }

      // Check if subpath import for non-scoped packages: pkg/subpath (>= 1 slash)
      if (!specifier.startsWith('@')) {
        const parts = specifier.split('/');
        if (parts.length > 1) {
          // Check if it's a known built-in or package with subpaths
          return `${prefix}${specifier}.js${suffix}`;
        }
      }

      return match;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated subpath extensions in: ${filePath}`);
  }
});

console.log(`Total files updated: ${modifiedCount}`);
