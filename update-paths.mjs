import fs from 'fs';
import path from 'path';

const tsconfigPath = path.resolve('tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

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

// 1. @nest-yalc-2/*
for (const pkg of allWorkspaces) {
  if (nodeYalcPkgsInNodeModules.includes(pkg)) {
    paths[`@nest-yalc-2/${pkg}`] = [`./${pkg}/src`, `./node_modules/@node-yalc/${pkg}/src`];
    paths[`@nest-yalc-2/${pkg}/*`] = [`./${pkg}/src/*`, `./node_modules/@node-yalc/${pkg}/src/*`];
  } else {
    paths[`@nest-yalc-2/${pkg}`] = [`./${pkg}/src`];
    paths[`@nest-yalc-2/${pkg}/*`] = [`./${pkg}/src/*`];
  }
}
paths['@nest-yalc-2/omnikernel-module'] = ['./examples/omnikernel/module/src'];
paths['@nest-yalc-2/omnikernel-module/*'] = ['./examples/omnikernel/module/src/*'];

// 2. @node-yalc/*
for (const pkg of allWorkspaces) {
  if (nodeYalcPkgsInNodeModules.includes(pkg)) {
    paths[`@node-yalc/${pkg}`] = [`./node_modules/@node-yalc/${pkg}/src`, `./${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`./node_modules/@node-yalc/${pkg}/src/*`, `./${pkg}/src/*`];
  } else {
    paths[`@node-yalc/${pkg}`] = [`./${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`./${pkg}/src/*`];
  }
}

// Special node-yalc packages only in node_modules
for (const pkg of nodeYalcPkgsInNodeModules) {
  if (!allWorkspaces.includes(pkg)) {
    paths[`@node-yalc/${pkg}`] = [`./node_modules/@node-yalc/${pkg}/src`];
    paths[`@node-yalc/${pkg}/*`] = [`./node_modules/@node-yalc/${pkg}/src/*`];
  }
}

// 3. Other aliases
paths['graphql'] = ['./node_modules/graphql'];
paths['ferrox-saas-backend'] = ['./apps/ferrox-saas-backend/src'];
paths['ferrox-saas-backend/*'] = ['./apps/ferrox-saas-backend/src/*'];
paths['nestjs-yalc'] = ['./types/src'];
paths['nestjs-yalc/*'] = ['./types/src/*'];

tsconfig.compilerOptions.paths = paths;

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
console.log('Successfully updated tsconfig.json paths with fallbacks');
