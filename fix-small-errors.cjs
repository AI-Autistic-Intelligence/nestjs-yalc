const fs = require('fs');

let content;

content = fs.readFileSync('ag-grid/src/generic-resolver.type.ts', 'utf8');
content = content.replace('DecoratorType', 'IDecoratorType');
fs.writeFileSync('ag-grid/src/generic-resolver.type.ts', content);

content = fs.readFileSync('crud-gen/src/api-rest/crud-gen-rest.controller.factory.ts', 'utf8');
content = content.replace(/import { IDecoratorType } from '@node-yalc\/types';/g, "import { IDecoratorType } from '@node-yalc/interfaces';");
fs.writeFileSync('crud-gen/src/api-rest/crud-gen-rest.controller.factory.ts', content);

content = fs.readFileSync('data-loader/src/dataloader.helper.ts', 'utf8');
content = content.replace(/, Optional/g, '');
fs.writeFileSync('data-loader/src/dataloader.helper.ts', content);

content = fs.readFileSync('event-manager/src/event.ts', 'utf8');
content = content.replace(/, InstanceType/g, '');
fs.writeFileSync('event-manager/src/event.ts', content);

content = fs.readFileSync('apps/ferrox-saas-backend/src/modules/admin-dashboard.controller.ts', 'utf8');
content = content.replace(/\(r\)/g, '(r: any)');
fs.writeFileSync('apps/ferrox-saas-backend/src/modules/admin-dashboard.controller.ts', content);

function replaceInFiles(dir) {
  const path = require('path');
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let c = fs.readFileSync(fullPath, 'utf8');
      const original = c;
      
      c = c.replace(/['"](\.\.\/)+ferrox-node\/dist\/index['"]/g, "'ferrox-node'");

      if (original !== c) {
        fs.writeFileSync(fullPath, c);
        console.log('Fixed ferrox-node imports: ' + fullPath);
      }
    }
  }
}
replaceInFiles('apps/ferrox-saas-backend/src');
