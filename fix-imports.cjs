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
      content = content.replace(/@node-yalc\/types\/maps\.interface\.js/g, '@node-yalc/interfaces/maps.interface.js');
      content = content.replace(/@node-yalc\/types\/maps\.interface/g, '@node-yalc/interfaces/maps.interface');
      content = content.replace(/@node-yalc\/types\/common\.type\.js/g, '@node-yalc/interfaces/common.type.js');
      content = content.replace(/import\s+{([^}]*IDecoratorType[^}]*)}\s+from\s+'@node-yalc\/types';?/g, "import { $1 } from '@node-yalc/interfaces';");
      content = content.replace(/import\s+{([^}]*FieldMapperProperty[^}]*)}\s+from\s+'@node-yalc\/types';?/g, "import { $1 } from '@node-yalc/interfaces';");
      content = content.replace(/import\s+{([^}]*IFieldMapper[^}]*)}\s+from\s+'@node-yalc\/types';?/g, "import { $1 } from '@node-yalc/interfaces';");
      
      // Separate multiple imports from types into interfaces if mixed. For now, this replace is fine since I just extract them.
      // Actually it's safer to just replace `@node-yalc/types` with `@node-yalc/interfaces` for these files:
      // Object.decorator.ts, crud-gen-args.helpers.ts, crud-gen-rest.controller.factory.ts
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed interfaces imports: ' + fullPath);
      }
    }
  }
}
replaceInFiles('.');
