import { getConnection } from 'typeorm';
jest.mock('typeorm', () => ({
  getConnection: jest.fn().mockReturnValue('MOCKED')
}));
import * as GenericServiceModule from '../typeorm/generic.service.js';
describe('Test', () => {
  it('test', () => {
    console.log(getConnection());
  });
});
