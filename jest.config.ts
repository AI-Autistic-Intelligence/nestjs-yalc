import {
  IAppProjSetting,
  IOptions,
  IProjectInfo,
  jestConfGenerator,
} from './jest/src/config/index.ts';
import path from 'node:path';

console.log('=================== LOADING JEST OPTIONS ================');

import fs from 'node:fs';

const tsProjects = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'));

const appProjectsSettings: { [key: string]: IAppProjSetting } = {
  '@nest-yalc-2/crud-gen': {
    deps: [],
    confOverride: {
      coverageThreshold: {
        branches: 93,
        functions: 98,
        lines: 98,
        statements: 97,
      },
    },
  },
  '@nest-yalc-2/event-manager': {
    deps: [],
    confOverride: {
      coverageThreshold: {
        statements: 97,
      },
    },
  },
  '@nest-yalc-2/logger': {
    deps: [],
    confOverride: {
      coverageThreshold: {
        branches: 92,
        statements: 98,
      },
    },
  },
  '@nest-yalc-2/omnikernel-module': {
    deps: [],
    confOverride: {
      coverageThreshold: {
        branches: 72,
        functions: 85,
        lines: 90,
        statements: 90,
      },
    },
  },
  '@nest-yalc-2/ag-grid': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 2, functions: 4, lines: 8, statements: 8 },
    },
  },
  '@nest-yalc-2/api-strategy': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 95 },
    },
  },
  '@nest-yalc-2/app': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 58, functions: 71, lines: 76, statements: 77 },
    },
  },
  '@nest-yalc-2/audit': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 98 },
    },
  },
  '@nest-yalc-2/database': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 0, functions: 0, lines: 0, statements: 0 },
    },
  },
  '@nest-yalc-2/errors': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 80 },
    },
  },
  '@nest-yalc-2/field-middleware': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 90, functions: 83, lines: 88, statements: 88 },
    },
  },
  '@nest-yalc-2/kafka': {
    deps: [],
    confOverride: {
      coverageThreshold: { lines: 94, statements: 94 },
    },
  },
  '@nest-yalc-2/observability': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 17, functions: 2, lines: 13, statements: 13 },
    },
  },
  '@nest-yalc-2/sentinel': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 33, functions: 33, lines: 37, statements: 37 },
    },
  },
  '@nest-yalc-2/utils': {
    deps: [],
    confOverride: {
      coverageThreshold: { branches: 94 },
    },
  },
};

const projectList: { [key: string]: IProjectInfo } = {};

const paths: Record<string, string[]> = tsProjects.compilerOptions.paths;
Object.keys(paths).map((k: string) => {
  const pathValue: string = paths[k][0];
  const cleaned = pathValue.replace(/^\.\//, '');
  const dir = path.dirname(cleaned);
  const basePath = dir.endsWith('/src') ? dir.replace('/src', '') : dir;
  const sourcePath = cleaned
    .replace(/\/index\.ts$/, '')
    .replace(/\/index\.d\.ts$/, '');

  if (!k.endsWith('*') && !pathValue.includes('node_modules/') && !k.startsWith('@node-yalc')) {
    projectList[k] = {
      path: basePath,
      sourcePath,
      type: 'library',
    };
  }
});

const options: IOptions = {
  defaultConfOptions: {
    transformEsModules: ['@faker-js', 'p-map', '@node-yalc', '@nest-yalc-2', '@nestjs'],
    jestConf: {
      // injectGlobals: false, -> we can't set it to false because of this issue: https://github.com/golevelup/nestjs/issues/557
    },
  },
  // TODO: re-enable everything except types
  skipProjects: ['types', 'types-extends', 'jest', 'node_modules', 'ferrox-saas-backend'],
  defaultCoverageThreshold: {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
};

const conf = jestConfGenerator(
  __dirname,
  projectList,
  appProjectsSettings,
  options,
);

conf.injectGlobals = true;

export default conf;
