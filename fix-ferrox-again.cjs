const fs = require('fs');
const path = require('path');
function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      content = content.replace(/['"]@ferrox-node\/core['"]/g, "'../../../ferrox-node/dist/index.js'");

      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed ferrox-node imports: ' + fullPath);
      }
    }
  }
}
replaceInFiles('apps/ferrox-saas-backend/src');
