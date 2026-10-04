import { getConnection } from 'typeorm';
jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getConnection: jest.fn().mockReturnValue('MOCKED')
  };
});
import * as GenericServiceModule from '../typeorm/generic.service.js';
import { baseEntityRepository } from '../__mocks__/generic-service.mocks.js';
describe('Test', () => {
  it('test', () => {
    console.log("getConnection output:", getConnection());
  });
});
