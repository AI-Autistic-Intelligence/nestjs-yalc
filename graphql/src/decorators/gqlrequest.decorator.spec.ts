import { jest } from '@jest/globals';
import {
  mockedExecutionContext,
  mockedGqlCtxCreate,
} from '@nestjs-yalc/jest/common-mocks.helper.js';
import { GqlGetRequest, paramDecoratorToCreate } from './gqlrequest.decorator.js';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('Gql user decorator test', () => {
  beforeEach(() => {
    mockedGqlCtxCreate.mockReturnValue({
      getContext: jest.fn().mockReturnValue({ req: 'valid_req' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Check Module', async () => {
    const testData = GqlGetRequest(null, mockedExecutionContext);
    expect(testData).toBeDefined();
  });

  it('Check the callback function', async () => {
    const testData = paramDecoratorToCreate(null, mockedExecutionContext);
    expect(testData).toBeDefined();
  });
});
