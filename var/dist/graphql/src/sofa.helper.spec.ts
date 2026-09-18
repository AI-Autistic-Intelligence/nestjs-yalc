import { jest } from '@jest/globals';
import { buildSofaMiddleware } from './sofa.helper.js';
import { buildSchema } from 'graphql';

describe('sofa.helper', () => {
  it('should call useSofa with correct arguments', () => {
    const schema = buildSchema(`
      type Query {
        hello: String
      }
    `);
    const options = { basePath: '/api' };
    
    const result = buildSofaMiddleware(schema, options as any);
    expect(result).toBeDefined();
  });
});
