import { jest } from '@jest/globals';
import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('@nestjs/graphql', () => {
  const actual = jest.requireActual('@nestjs/graphql') as any;
  return {
    __esModule: true,
    ...actual,
    addFieldMetadata: actual.addFieldMetadata, // Ensure it's passed
    GqlExecutionContext: {
      ...actual.GqlExecutionContext,
      create: jest.fn(),
    }
  };
});
import * as graphql from '@nestjs/graphql';

import * as CrudGenHelper from '../crud-gen.helpers.js';
import * as $ from '../api-graphql/gqlfields.decorator.js';

const mockedExecutionContext = {} as any;

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
  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('Check GqlInfoGenerator', async () => {
    // @ts-ignore
    const mockCreate = (graphql.GqlExecutionContext.create = jest.fn());
    const mockGetInfo = mockCreate.mockImplementation(() => ({
      getInfo: jest.fn().mockReturnValue(infoObj),
    }));
    const TestGqlInfoGenerator = $.GqlInfoGenerator({}, mockedExecutionContext);

    expect(TestGqlInfoGenerator).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockGetInfo).toHaveBeenCalled();
  });

  it('Check GqlFieldsMapper Functionality with specified field to retain', async () => {
    const arr = { ['first']: { dst: 'specified' } };
    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, infoObj);

    // console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified']),
    );
  });

  it('Check GqlFieldsMapper Functionality with nested selection (nodes)', async () => {
    const arr = { ['otherField']: { dst: 'specified' } };
    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, nodesObj);

    // console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified']),
    );
  });

  it('Check GqlFieldsMapper Functionality with specified field mapped with the same name', async () => {
    const arr = { ['first']: { dst: 'first' } };
    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, infoObj);

    // console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual(expect.arrayContaining(['first']));
  });

  it('Check GqlModelFieldsMapper Functionality with specified field name to add', async () => {
    const arr: IFieldMapper = { ['first']: { dst: 'specified' } };

    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, infoObj);

    // console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual(
      expect.arrayContaining(['specified']),
    );
  });

  it('Check with nested', async () => {
    const arr: IFieldMapper = { ['first']: { dst: 'specified' } };
    
    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(fieldAndFilterMapper, edgesObj);

    // console.log(GqlFieldsMapperTest.keys);
    expect(GqlFieldsMapperTest.keys).toEqual([]);
  });

  it('Auto-adds relation source key for top-level nested relation selections', () => {
    const relationInfo: GraphQLResolveInfo = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                kind: 'Field',
                name: { kind: 'Name', value: 'project' },
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'guid' },
                    },
                  ],
                },
              },
            ],
          },
        } as any,
      ],
    } as any;

    const arr: IFieldMapper = {
      project: {
        dst: 'project',
        // @ts-ignore
        relation: {
          relationType: 'many-to-one',
          sourceKey: { dst: 'projectId', alias: 'projectId' },
          targetKey: { dst: 'guid', alias: 'guid' },
          type: () => Object,
        },
      },
      projectId: { dst: 'projectId' },
    };

    const result = $.GqlModelFieldsMapper({ field: arr, extraInfo: {} } as any, relationInfo);

    expect(result.keys).toEqual(expect.arrayContaining(['projectId']));
  });

  it('Check GqlModelFieldsMapper with undefined values', () => {
    const arr: IFieldMapper = { ['first']: { dst: 'specified' } };
    const custominfo = {
      fieldNodes: [
        {
          selectionSet: undefined,
        },
      ],
    };
    let GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, custominfo as any);

    expect(GqlFieldsMapperTest.keys).toEqual([]);

    // @ts-ignore
    custominfo.fieldNodes = undefined;
    GqlFieldsMapperTest = $.GqlModelFieldsMapper(arr, custominfo as any);

    expect(GqlFieldsMapperTest.keys).toEqual([]);
  });

  it('Check GqlModelFieldsMapper with derived fields', () => {
    const arr: IFieldMapper = {
      ['node']: { dst: 'data -> $.id', mode: 'derived' },
    };

    const GqlFieldsMapperTest = $.GqlModelFieldsMapper(fieldAndFilterMapper, infoObj);

    expect(GqlFieldsMapperTest).toBeDefined();
  });

  it('Check GqlModelFieldsMapper with extraInfo not setted', () => {
    const arr: IFieldMapper = {
      ['node']: { dst: 'data -> $.id', mode: 'derived' },
    };

    const GqlFieldsMapperTest = $.GqlModelFieldsMapper({
      ...fieldAndFilterMapper,
      extraInfo: undefined,
    } as any, infoObj);

    expect(GqlFieldsMapperTest).toBeDefined();
  });

  it('Auto-adds nested relation source key and required fields', () => {
    const relationInfo: GraphQLResolveInfo = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                kind: 'Field',
                name: { kind: 'Name', value: 'project' },
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'user' },
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'name' },
                          }
                        ]
                      }
                    },
                  ],
                },
              },
            ],
          },
        } as any,
      ],
    } as any;

    const arr: IFieldMapper = {
      project: {
        dst: 'project',
        // @ts-ignore
        relation: {
          relationType: 'many-to-one',
          sourceKey: { dst: 'projectId', alias: 'projectId' },
          targetKey: { dst: 'guid', alias: 'guid' },
          type: () => Object,
        },
      },
      projectId: { dst: 'projectId' },
    };

    const extraInfo = {
      user: {
        field: {
          name: { dst: 'name' },
          requiredField: { dst: 'reqField', isRequired: true }
        }
      }
    };

    const result = $.GqlModelFieldsMapper({ field: arr, extraInfo: extraInfo } as any, relationInfo);

    expect(result.keys).toEqual(expect.arrayContaining(['projectId']));
  });
});
