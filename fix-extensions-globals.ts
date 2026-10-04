/**
 * @file fix-extensions-globals.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';
import path  from 'path';
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
const files = walk('C:\\Users\\nn\\Desktop\\code\\nestjs-yalc');
for (const file of files) {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('@nest-yalc-2/types/globals.d')) {
      content = content.replace(/@node-yalc\/types\/globals\.d/g, '@nest-yalc-2/types/globals');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed ' + file);
    }
  }
}
