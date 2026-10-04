const fs = require('fs');
const glob = require('glob');

const files = glob.sync('**/package.json', { ignore: ['node_modules/**'] });
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let pkg = JSON.parse(content);
  
  let changed = false;
  const fixDeps = (deps) => {
    if (!deps) return;
    if (deps['typeorm'] && deps['typeorm'].startsWith('^1.')) {
      deps['typeorm'] = '^0.3.28';
      changed = true;
    }
  };
  
  fixDeps(pkg.dependencies);
  fixDeps(pkg.devDependencies);
  fixDeps(pkg.peerDependencies);
  fixDeps(pkg.optionalDependencies);
  
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated ' + file);
  }
}
