import fs from 'fs';
import path from 'path';

const configPath = path.resolve('examples/omnikernel/module/tsconfig.build.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const nodeYalcPkgsInNodeModules = [
  'aws-helpers',
  'common',
  'errors',
  'event-manager',
  'interfaces',
  'logger',
  'types',
  'types-extends',
  'utils',
];

const allWorkspaces = [
  'ag-grid',
  'api-strategy',
  'app',
  'audit',
  'crud-gen',
  'data-loader',
  'database',
  'errors',
  'event-manager',
  'field-middleware',
  'graphql',
  'jest',
  'kafka',
  'logger',
  'observability',
  'sentinel',
  'types',
  'types-extends',
  'utils',
];

const paths = {};

for (const pkg of allWorkspaces) {
  // nest-yalc-2
  paths[`@nest-yalc-2/${pkg}`] = [`../../../var/dist/${pkg}/src/index.d.ts`, `../../../${pkg}/src`];
  paths[`@nest-yalc-2/${pkg}/*`] = [`../../../var/dist/${pkg}/src/*`, `../../../${pkg}/src/*`];

  // node-yalc
  if (nodeYalcPkgsInNodeModules.includes(pkg)) {
    paths[`@node-yalc/${pkg}`] = [`../../../node_modules/@node-yalc/${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`../../../node_modules/@node-yalc/${pkg}/src/*`];
  } else {
    paths[`@node-yalc/${pkg}`] = [`../../../var/dist/${pkg}/src/index.d.ts`, `../../../${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`../../../var/dist/${pkg}/src/*`, `../../../${pkg}/src/*`];
  }
}

// Special node-yalc packages
for (const pkg of nodeYalcPkgsInNodeModules) {
  if (!allWorkspaces.includes(pkg)) {
    paths[`@node-yalc/${pkg}`] = [`../../../node_modules/@node-yalc/${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`../../../node_modules/@node-yalc/${pkg}/src/*`];
  }
}

config.compilerOptions.paths = paths;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
console.log('Successfully updated examples/omnikernel/module/tsconfig.build.json paths');
