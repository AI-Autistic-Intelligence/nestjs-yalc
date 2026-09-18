const fs = require('fs');
const path = require('path');
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
    if (content.includes('@node-yalc/types/globals.d')) {
      content = content.replace(/@node-yalc\/types\/globals\.d/g, '@node-yalc/types/globals');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed ' + file);
    }
  }
}
