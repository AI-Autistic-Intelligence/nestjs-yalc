import {
  describe,
  expect,
  it,
  jest,
  beforeAll,
  beforeEach,
  test,
} from '@jest/globals';

import { ___dirname, __filename } from '../files.helper.js';

describe('Test files.helper.ts', () => {
  it('should run __filename', () => {
    expect(__filename('file:///C:/Users/nn/Desktop/code/nestjs-yalc/utils/src/__tests__/files.helper.spec.ts')).toBeDefined();
  });

  it('should run ___dirname', () => {
    const dir = ___dirname('file:///C:/Users/nn/Desktop/code/nestjs-yalc/utils/src/__tests__/files.helper.spec.ts');
    expect(dir).toContain('utils');
  });
});
