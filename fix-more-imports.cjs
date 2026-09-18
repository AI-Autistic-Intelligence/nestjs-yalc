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
      
      // Fix types -> interfaces
      content = content.replace(/@node-yalc\/types\/nestjs\.type\.js/g, '@node-yalc/interfaces/nestjs.type.js');
      content = content.replace(/@node-yalc\/types\/common\.type/g, '@node-yalc/interfaces/common.type');
      content = content.replace(/import\s+{([^}]*DecoratorType[^}]*)}\s+from\s+'@node-yalc\/types';?/g, "import { $1 } from '@node-yalc/interfaces';");
      content = content.replace(/import\s+{([^}]*FieldMapper[^}]*)}\s+from\s+'@node-yalc\/types';?/g, "import { $1 } from '@node-yalc/interfaces';");
      
      // Fix missed utils
      content = content.replace(/@nest-yalc-2\/utils\/object\.helper/g, '@node-yalc/utils/object.helper');
      content = content.replace(/@nest-yalc-2\/utils\/promise\.helper\.js/g, '@node-yalc/utils/promise.helper.js');
      
      // Fix missed logger
      content = content.replace(/@nest-yalc-2\/logger\/logger\.enum\.js/g, '@node-yalc/logger/logger.enum.js');
      
      // Fix mistakenly replaced event.module
      content = content.replace(/@node-yalc\/event-manager\/event\.module\.js/g, '@nest-yalc-2/event-manager/event.module.js');

      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed more imports: ' + fullPath);
      }
    }
  }
}
replaceInFiles('.');
