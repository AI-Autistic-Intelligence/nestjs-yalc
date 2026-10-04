import { jest } from '@jest/globals';
jest.mock('@nestjs/graphql');
import {
  mockedExecutionContext,
  mockedGqlCtxCreate,
} from '@nest-yalc-2/jest/common-mocks.helper.js';
import { GqlGetRequest, paramDecoratorToCreate } from './gqlrequest.decorator.js';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('Gql user decorator test', () => {
  beforeEach(() => {
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: jest.fn().mockReturnValue({ req: 'valid_req' }),
    } as any);
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
