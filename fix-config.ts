/**
 * @file fix-config.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import fs  from 'fs';

const published = ['utils', 'logger', 'errors', 'interfaces', 'types', 'aws-helpers', 'types-extends', 'event-manager', 'common'];

// Fix package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newDeps = {};
for (const [k, v] of Object.entries(pkg.dependencies)) {
    if (k.startsWith('@nest-yalc-2/')) {
        const name = k.split('/')[1];
        if (published.includes(name)) {
            newDeps[k] = v;
        }
    } else {
        newDeps[k] = v;
    }
}
pkg.dependencies = newDeps;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 4) + '\n');

// Fix tsconfig.json
let tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
for (const p of published) {
    delete tsconfig.compilerOptions.paths[`@nest-yalc-2/${p}`];
    delete tsconfig.compilerOptions.paths[`@nest-yalc-2/${p}/*`];
}

// Add back node-yalc to exclude if it's not there
if (tsconfig.exclude && !tsconfig.exclude.includes("node-yalc")) {
    tsconfig.exclude.push("node-yalc");
}

fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2) + '\n');
console.log('Fixed package.json and tsconfig.json');
