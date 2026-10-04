/**
 * @file materialize-local-package-dist.ts
 * @description Converted to TypeScript to support NodeNext module resolution.
 */
import { materializeLocalPackageDists } from './local-package-dist.js';

const packages = materializeLocalPackageDists();
console.log(`Materialized local package boundaries: ${packages.join(', ')}`);
