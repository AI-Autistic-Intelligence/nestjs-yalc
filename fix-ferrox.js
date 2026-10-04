const fs = require('fs');
const glob = require('glob');
glob.sync('apps/ferrox-saas-backend/src/**/*.ts').forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes("'ferrox-node'")) {
    fs.writeFileSync(f, content.replace(/'ferrox-node'/g, "'@ferrox/node'"));
    console.log('Fixed', f);
  }
});
