import { jest } from '@jest/globals';
import { GqlComplexityPlugin } from './gql-complexity.plugin.js';
import { GqlComplexityHelper } from './gql-complexity.helper.js';


jest.mock('./gql-complexity.helper');

describe('GqlComplexityPlugin', () => {
  it('should be defined', () => {
    const plugin = new GqlComplexityPlugin();
    expect(plugin).toBeDefined();
  });

  it('should handle didResolveOperation lifecycle', async () => {
    const clonedQueryBuilder: any = {
      document: jest.fn().mockReturnValue({}),
    };

    const plugin = new GqlComplexityPlugin();
    const result = await plugin.requestDidStart();

    const spiedFunc = jest
      .spyOn(GqlComplexityHelper, 'processDocumentAST')
      .mockImplementation(() => undefined as any);
    expect(result.didResolveOperation).toBeDefined();

    await result.didResolveOperation!(clonedQueryBuilder as any);
    expect(spiedFunc).toHaveBeenCalled();
    expect(spiedFunc).toHaveBeenCalledWith(clonedQueryBuilder.document, undefined);
  });
});
