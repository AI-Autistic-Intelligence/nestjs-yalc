import * as fs from 'fs';

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

const packages = [
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
  'utils',
  'types',
  'types-extends',
];

const paths: Record<string, string[]> = {};

for (const pkg of packages) {
  paths[`@nest-yalc-2/${pkg}`] = [`./${pkg}/src`];
  paths[`@nest-yalc-2/${pkg}/*`] = [`./${pkg}/src/*`];
  paths[`@node-yalc/${pkg}`] = [`./${pkg}/src`];
  paths[`@node-yalc/${pkg}/*`] = [`./${pkg}/src/*`];
}

paths['graphql'] = ['./node_modules/graphql'];
paths['ferrox-saas-backend'] = ['./apps/ferrox-saas-backend/src'];
paths['ferrox-saas-backend/*'] = ['./apps/ferrox-saas-backend/src/*'];
paths['@nest-yalc-2/omnikernel-module'] = ['./examples/omnikernel/module/src'];
paths['@nest-yalc-2/omnikernel-module/*'] = ['./examples/omnikernel/module/src/*'];
paths['nestjs-yalc'] = ['./types/src'];
paths['nestjs-yalc/*'] = ['./types/src/*'];

tsconfig.compilerOptions.paths = paths;

fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2), 'utf8');
console.log('Updated tsconfig.json paths cleanly!');
