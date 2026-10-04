import { jest } from '@jest/globals';
import * as index from './index.js';

describe('index', () => {
  it('should export buildSofaMiddleware', () => {
    expect(index.buildSofaMiddleware).toBeDefined();
  });
});
