import { jest } from '@jest/globals';
jest.mock('@nestjs/graphql');
jest.mock('@nest-yalc-2/ag-grid/ag-grid.args', () => ({
  agQueryParamsFactory: jest.fn(),
}));

import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import * as $ from '../gqlfields.decorator';
import * as AgGridHelpers from '../ag-grid-metadata.helper';
import {
  mockedExecutionContext,
  mockedNestGraphql,
} from '@nest-yalc-2/jest/common-mocks.helper';
import { GraphQLResolveInfo } from 'graphql';
import * as AgGridQueryHelpers from "../ag-grid-query.helper";
import * as AgGridFactoryHelpers from "../ag-grid-factory.helper";

const infoObj: GraphQLResolveInfo = {
  fieldNodes: [
    {
      selectionSet: {
        selections: [
          {
            // @ts-ignore
            kind: 'Field',
            name: {
              // @ts-ignore
              kind: 'Name',
              value: 'first',
            },
          },
          {
            // @ts-ignore
            kind: 'Field',
            name: {
              // @ts-ignore
              kind: 'Name',
              value: 'second',
            },
          },
          {
            // @ts-ignore
            kind: 'Field',
            name: {
              // @ts-ignore
              kind: 'Name',
              value: 'pageData',
            },
            // @ts-ignore
            selectionSet: {},
          },
          {
            name: {
              value: 'nodes',
              // @ts-ignore
              kind: 'Name',
            },
            // @ts-ignore
            kind: 'Field',
            selectionSet: {
              // @ts-ignore
              kind: 'SelectionSet',
              selections: [
                {
                  name: {
                    value: 'sub',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  // @ts-ignore
                  kind: 'Field',
                  selectionSet: {
                    // @ts-ignore
                    kind: 'SelectionSet',
                    selections: [
                      {
                        // @ts-ignore
                        kind: 'Field',
                        name: {
                          value: 'nodes',
                          // @ts-ignore
                          kind: 'Name',
                        },
                        selectionSet: {
                          // @ts-ignore
                          kind: 'SelectionSet',
                          selections: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: {
                    value: 'subToChange',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  // @ts-ignore
                  kind: 'Field',
                },
                {
                  name: {
                    value: 'node',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  // @ts-ignore
                  kind: 'Field',
                  selectionSet: {
                    // @ts-ignore
                    kind: 'SelectionSet',
                    selections: [
                      {
                        name: {
                          value: 'sub2',
                          // @ts-ignore
                          kind: 'Name',
                        },
                        // @ts-ignore
                        kind: 'Field',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: {
              value: 'subQuery',
              // @ts-ignore
              kind: 'Name',
            },
            // @ts-ignore
            kind: 'Field',
            selectionSet: {
              // @ts-ignore
              kind: 'SelectionSet',
              selections: [],
            },
          },
        ],
      },
    },
  ],
};

const edgesObj: GraphQLResolveInfo = {
  fieldNodes: [
    {
      selectionSet: {
        selections: [
          {
            name: {
              value: 'edges',
              // @ts-ignore
              kind: 'Name',
            },
            selectionSet: {
              selections: [
                {
                  name: {
                    value: 'node',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  selectionSet: {
                    selections: [
                      {
                        name: {
                          value: 'fieldAlias',
                          // @ts-ignore
                          kind: 'Name',
                        },
                        // @ts-ignore
                        kind: 'Field',
                      },
                    ],
                  },
                },
                {
                  name: {
                    value: 'otherField',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  // @ts-ignore
                  kind: 'Field',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const nodesObj: GraphQLResolveInfo = {
  fieldNodes: [
    {
      selectionSet: {
        selections: [
          {
            name: {
              value: 'nodes',
              // @ts-ignore
              kind: 'Name',
            },
            selectionSet: {
              selections: [
                {
                  name: {
                    value: 'node',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  selectionSet: {
                    selections: [
                      {
                        name: {
                          value: 'fieldAlias',
                          // @ts-ignore
                          kind: 'Name',
                        },
                        // @ts-ignore
                        kind: 'Field',
                      },
                    ],
                  },
                },
                {
                  name: {
                    value: 'otherField',
                    // @ts-ignore
                    kind: 'Name',
                  },
                  // @ts-ignore
                  kind: 'Field',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const fieldAndFilterMapper = {
  field: {
    node: {
      dst: 'id',
      gqlType: undefined,
      gqlOptions: undefined,
      mode: 'derived',
      isRequired: true,
      _propertyName: 'id',
    },
    first: {
      dst: 'first',
      gqlType: undefined,
      gqlOptions: undefined,
      mode: 'derived',
      isRequired: true,
      _propertyName: 'first',
    },
  },
  extraInfo: {
    node: { field: {}, extraInfo: {}, filterOption: {} },
  },
};

describe('Graphql decorator test', () => {
  // beforeEach(() => {
  //   jest.resetAllMocks();
  // });

  it('Check GqlInfoGenerator', async () => {
    const mockCreate = (mockedNestGraphql.GqlExecutionContext.create =
      jest.fn());
    const mockGetInfo = mockCreate.mockImplementation(() => ({
      // @ts-ignore
      getInfo: jest.fn().mockReturnValue(infoObj),
    }));
    const TestGqlInfoGenerator = $.GqlInfoGenerator({}, mockedExecutionContext);

    expect(TestGqlInfoGenerator).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockGetInfo).toHaveBeenCalled();
  });

  it('Check GqlInfoGenerator with default value', async () => {
    const mockCreate = (mockedNestGraphql.GqlExecutionContext.create =
      jest.fn());
    const mockGetInfo = mockCreate.mockImplementation(() => ({
      // @ts-ignore
      getInfo: jest.fn().mockReturnValue(infoObj),
    }));
    const TestGqlInfoGenerator = $.GqlInfoGenerator(
      undefined,
      mockedExecutionContext,
    );

    expect(TestGqlInfoGenerator).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockGetInfo).toHaveBeenCalled();
  });

  it('Check GqlFieldsMapper Functionality with specified field name', async () => {
    const arr: IFieldMapper = {
      ['first']: { dst: 'specified', isRequired: true },
    };
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, infoObj);

    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified']),
    );
    expect(GqlFieldsMapperTest.keys).not.toEqual(
      expect.arrayContaining(['first']),
    );
  });

  it('Check GqlFieldsMapper Functionality with nodes', async () => {
    const arr: IFieldMapper = { ['otherField']: { dst: 'specified' } };

    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, nodesObj);

    console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual(['specified']);
  });

  it('Check GqlFieldsMapper Functionality with specified field name to add', async () => {
    const arr: IFieldMapper = {
      ['toAdd']: { dst: 'specified', isRequired: true },
    };
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, infoObj);

    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified']),
    );
    expect(GqlFieldsMapperTest.keys).not.toEqual(
      expect.arrayContaining(['toAdd']),
    );
  });

  it('Check GqlAgGridFieldsMapper Functionality with specified field name to add', async () => {
    const arr: IFieldMapper = {
      ['toAdd']: { dst: 'specified', isRequired: true },
      ['subToChange']: { dst: 'toAddSub', isRequired: true },
    };
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, infoObj);

    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified', 'toAddSub']),
    );
    expect(GqlFieldsMapperTest.keys).not.toEqual(
      expect.arrayContaining(['toAdd', 'subToChange']),
    );
  });

  it('Check with nested', async () => {
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(fieldAndFilterMapper, edgesObj);

    console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual([]);
  });

  it('Check GqlAgGridFieldsMapper with undefined values', () => {
    const arr: IFieldMapper = { ['first']: { dst: 'specified' } };
    const custominfo = {
      fieldNodes: [
        {
          selectionSet: undefined,
        },
      ],
    };
    let GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, custominfo as any);

    expect(GqlFieldsMapperTest.keys).toEqual([]);

    // @ts-ignore
    custominfo.fieldNodes = undefined;
    GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(arr, custominfo as any);

    expect(GqlFieldsMapperTest.keys).toEqual([]);
  });

  it('Check GqlAgGridFieldsMapper with derived fields', () => {
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper(fieldAndFilterMapper, infoObj);

    expect(GqlFieldsMapperTest).toBeDefined();
  });

  it('Check GqlAgGridFieldsMapper with extraInfo not setted', () => {
    const GqlFieldsMapperTest = $.GqlAgGridFieldsMapper({ ...fieldAndFilterMapper, extraInfo: undefined } as any, infoObj);

    expect(GqlFieldsMapperTest).toBeDefined();
  });

  it('Check GqlInfoGenerator', () => {
    const mockedInfo = {
      fieldNodes: [],
    };
    const ctx = {
      getArgByIndex: () => ({ info: mockedInfo }),
      getArgs: () => [],
      getClass: () => class {},
      getHandler: () => () => {},
      getType: () => 'graphql',
      switchToHttp: () => ({}),
      switchToRpc: () => ({}),
      switchToWs: () => ({}),
    } as any;
    
    expect($.GqlInfoGenerator({}, ctx)).toBeDefined();
  });

  it('Check GqlFieldsMap decorator creation', () => {
    expect($.GqlFieldsMap).toBeDefined();
    // Test the execution of the param decorator
    const decorator = $.GqlFieldsMap();
    expect(decorator).toBeDefined();
  });
});
