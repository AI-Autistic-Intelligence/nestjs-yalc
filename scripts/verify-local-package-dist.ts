/**
 * @file verify-local-package-dist.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertLocalPackageDist } from './local-package-dist.js';

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'crud-gen',
);

assertLocalPackageDist(packageDir);
