const fs = require('fs');
const glob = require('glob');

const files = glob.sync('**/package.json', { ignore: ['node_modules/**'] });
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let pkg = JSON.parse(content);
  
  let changed = false;
  const fixDeps = (deps) => {
    if (!deps) return;
    for (const k in deps) {
      if (k.startsWith('@nestjs/')) {
        if (k === '@nestjs/graphql' || k === '@nestjs/apollo' || k === '@nestjs/mercurius') {
          deps[k] = '^14.0.0';
          changed = true;
        } else {
          deps[k] = '^12.0.0';
          changed = true;
        }
      }
    }
  };
  
  // We only really need to relax peerDependencies to ^12.0.0, 
  // but it's fine for devDependencies too, since ^12.0.0 resolves to latest 12.x anyway
  fixDeps(pkg.dependencies);
  fixDeps(pkg.devDependencies);
  fixDeps(pkg.peerDependencies);
  fixDeps(pkg.optionalDependencies);
  
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated ' + file);
  }
}
