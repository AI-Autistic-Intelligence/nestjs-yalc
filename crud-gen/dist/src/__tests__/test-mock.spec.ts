import { getConnection } from 'typeorm';
jest.mock('typeorm', () => ({
  getConnection: jest.fn().mockReturnValue('MOCKED')
}));
describe('Test', () => {
  it('test', () => {
    console.log(getConnection());
  });
});
