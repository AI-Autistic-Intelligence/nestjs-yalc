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

const appProjectsSettings: { [key: string]: IAppProjSetting } = {};

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

  if (!k.endsWith('*')) {
    projectList[k] = {
      path: basePath,
      sourcePath,
      type: 'library',
    };
  }
});

const options: IOptions = {
  defaultConfOptions: {
    transformEsModules: ['@faker-js', 'p-map'],
    jestConf: {
      // injectGlobals: false, -> we can't set it to false because of this issue: https://github.com/golevelup/nestjs/issues/557
    },
  },
  // TODO: re-enable everything except types
  skipProjects: ['types', 'types-extends', 'jest', 'node_modules'],
  defaultCoverageThreshold: {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
  confOverrides: {
    '@nest-yalc-2/app': {
      coverageThreshold: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
    '@nest-yalc-2/logger': {
      coverageThreshold: {
        statements: 99,
        branches: 95,
        functions: 98,
        lines: 99,
      },
    },
    '@nest-yalc-2/observability': {
      coverageThreshold: {
        statements: 75,
        branches: 70,
        functions: 75,
        lines: 75,
      },
    },
    '@nest-yalc-2/utils': {
      coverageThreshold: {
        statements: 99,
        branches: 98,
        functions: 99,
        lines: 99,
      },
    },
    '@nest-yalc-2/database': {
      coverageThreshold: {
        statements: 98,
        branches: 95,
        functions: 98,
        lines: 98,
      },
    },
    '@nest-yalc-2/data-loader': {
      coverageThreshold: {
        statements: 98,
        branches: 95,
        functions: 98,
        lines: 98,
      },
    },
    '@nest-yalc-2/errors': {
      coverageThreshold: {
        statements: 98,
        branches: 95,
        functions: 98,
        lines: 98,
      },
    },
    '@nest-yalc-2/event-manager': {
      coverageThreshold: {
        statements: 95,
        branches: 80,
        functions: 95,
        lines: 95,
      },
    },
    '@nest-yalc-2/crud-gen': {
      coverageThreshold: {
        statements: 84,
        branches: 80,
        functions: 88,
        lines: 84,
      },
    },
    '@nest-yalc-2/skeleton-module': {
      coverageThreshold: {
        statements: 80,
        branches: 70,
        functions: 40,
        lines: 75,
      },
    },
    '@nest-yalc-2/omnikernel-module': {
      coverageThreshold: {
        statements: 80,
        branches: 70,
        functions: 40,
        lines: 75,
      },
    },
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
