import { expect, jest, describe, it } from '@jest/globals';

import 'reflect-metadata';
import { mockNestJSGraphql } from '@nest-yalc-2/jest';

await mockNestJSGraphql(import.meta);

const helpers = await importMockedEsm(
  '@nest-yalc-2/crud-gen/crud-gen.helpers.js',
  import.meta,
);

import { SkeletonModule } from '../index.js';

describe('Test skeleton module', () => {
  it('should register the module', () => {
    const spiedCrudGenDependencyFactory = jest.spyOn(
      helpers,
      'CrudGenDependencyFactory',
    );

    const module = SkeletonModule.register('test');
    expect(module).toBeDefined();
    expect(spiedCrudGenDependencyFactory).toHaveBeenCalledTimes(2); // user and phone
  });
});
