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
      
      // Utils
      content = content.replace(/@nest-yalc-2\/utils\/(env\.helper|returnValue|date\.helper|enum\.helper|plugin\.helper|http\.helper|object-mapper\.helper|class\.helper)(.*?)/g, '@node-yalc/utils/$1$2');
      content = content.replace(/\.\/object-mapper\.helper\.js/g, '@node-yalc/utils/object-mapper.helper.js');
      
      // Errors
      content = content.replace(/@nest-yalc-2\/errors\/(default\.error|error\.helper|error\.class|http-status-code-to-errors|error\.enum|result\.error)(.*?)/g, '@node-yalc/errors/$1$2');
      content = content.replace(/\.\.\/error\.enum\.js/g, '@node-yalc/errors/error.enum.js');
      
      // Logger
      content = content.replace(/@nest-yalc-2\/logger\/(logger-abstract\.service|logger\.helper|logger\.event|logger\.factory)(.*?)/g, '@node-yalc/logger/$1$2');
      content = content.replace(/\.\/logger-abstract\.service\.js/g, '@node-yalc/logger/logger-abstract.service.js');
      content = content.replace(/\.\/logger\.helper\.js/g, '@node-yalc/logger/logger.helper.js');
      content = content.replace(/\.\/logger\.event\.js/g, '@node-yalc/logger/logger.event.js');
      
      // Event Manager
      content = content.replace(/@nest-yalc-2\/event-manager\/(event-result\.types|event\.helper|event\.class|event|global-emitter|emitter)(.*?)/g, '@node-yalc/event-manager/$1$2');

      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed extracted module imports: ' + fullPath);
      }
    }
  }
}
replaceInFiles('.');
