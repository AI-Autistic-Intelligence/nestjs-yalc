import { jest } from '@jest/globals';
import { createMock } from '@golevelup/ts-jest';
import { BaseEntity, Equal, OneToOne, JoinColumn } from 'typeorm';
import { GeneralFilters, ExtraArgsStrategy, FilterType } from '../crud-gen.enum.js';


jest.mock('@nestjs/graphql', () => ({
  Args: jest.fn(),
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));
import { ModelField } from '../object.decorator.js';

class DummyJoinEntity extends BaseEntity {
  @ModelField({})
  id: string;
}

class DummyEntity extends BaseEntity {
  @ModelField({})
  field: string;

  @OneToOne(() => DummyJoinEntity)
  @JoinColumn()
  joinField: DummyJoinEntity;
}

jest.mock('../crud-gen.helpers.js', () => ({
  ...jest.requireActual('../crud-gen.helpers.js') as any,
  objectToFieldMapper: jest.fn(),
}));
import * as CrudGenHelpers from '../crud-gen.helpers.js';

import * as CrudGenInput from '../api-graphql/crud-gen.input.js';

import * as crudGenArgsDecorator from '../api-graphql/crud-gen-args-gql.decorator.js';

const infoObj = {
  fieldNodes: [
    {
      selectionSet: {
        selections: [{ name: { value: 'field' } }],
      },
    },
  ],
} as any;

const fixedArgsOptions = {
  entityType: DummyEntity,
  options: { maxRow: 200 },
} as any;

const fixedArgsQueryParams = { filters: {}, startRow: 0, endRow: 5 };

const graphql = require('@nestjs/graphql');
const mockedInfo = createMock<any>();
const mockCreate = (require('@nestjs/graphql').GqlExecutionContext.create = jest.fn());
mockCreate.mockImplementation(() => ({
  getArgs: jest.fn().mockReturnValue([{}, fixedArgsQueryParams, {}, infoObj]),
  getInfo: jest.fn().mockReturnValue(infoObj),
  getContext: jest.fn().mockReturnValue({}),
  getType: jest.fn().mockReturnValue('graphql'),
  getHandler: jest.fn(),
  getClass: jest.fn(),
  getArgByIndex: jest.fn((index) => {
    if (index === 1) return fixedArgsQueryParams;
    if (index === 2) return {};
    if (index === 3) return infoObj;
    return undefined;
  }),
}));

describe('Crud-gen args decorator (esm-safe)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
  });

  it('mapCrudGenParams handles basic filters', () => {
    const result = crudGenArgsDecorator.mapCrudGenParams(
      fixedArgsOptions,
      createMock(),
      fixedArgsQueryParams,
      mockedInfo,
    );
    expect(result).toBeDefined();
  });

  it('convertFilter returns operator for simple set', () => {
    const filter = {
      filterType: FilterType.SET,
      values: ['a'],
      conditionType: 'OR',
    } as any;
    expect(() => crudGenArgsDecorator.convertFilter(filter)).not.toThrow();
  });

  it('convertFilter throws on invalid nested child expressions shape', () => {
    const filter = {
      operator: 'AND',
      childExpressions: [
        {
          operator: 'OR',
          expressions: [
            {
              text: {
                field: 'field',
                filterType: FilterType.TEXT,
                type: GeneralFilters.EQUALS,
                filter: 'abc',
              },
            },
          ],
        },
      ],
    } as any;
    expect(() => crudGenArgsDecorator.convertFilter(filter)).toThrow();
  });

  it('createWhere handles null input', () => {
    const result = crudGenArgsDecorator.createWhere(null as any, {}, '');
    expect(result).toEqual({ filters: {} });
  });

  it('getFindOperator works for text', () => {
    const op = crudGenArgsDecorator.getFindOperator(
      FilterType.TEXT,
      GeneralFilters.EQUALS,
      'a',
    );
    expect(op).toEqual(Equal('a'));
  });

  it('CrudGenCombineDecorators creates decorator', () => {
    const argsFn = require('@nestjs/graphql').Args as jest.Mock;
    argsFn.mockReturnValue(jest.fn());
    
    const decorator = crudGenArgsDecorator.CrudGenCombineDecorators(
      fixedArgsOptions,
    );
    expect(decorator).toEqual(expect.any(Function));
  });

  it('checkFilterScope throws on prohibited filter', () => {
    expect(() =>
      crudGenArgsDecorator.checkFilterScope(
        { filters: { forbidden: {} } } as any,
        { type: 'EXCLUDE', fields: ['forbidden'] } as any,
      ),
    ).toThrow();
  });

  it('checkFilterScope allows empty include scope without filters', () => {
    expect(() =>
      crudGenArgsDecorator.checkFilterScope(
        { filters: {} } as any,
        { type: 'INCLUDE', fields: ['allowed'] } as any,
      ),
    ).not.toThrow();
  });

  it('mapCrudGenParams respects extra args strategy', () => {
    const params = {
      ...fixedArgsOptions,
      extraArgsStrategy: ExtraArgsStrategy.AT_LEAST_ONE,
      extraArgs: {
        foo: {
          filterType: FilterType.TEXT,
          filterCondition: GeneralFilters.EQUALS,
          options: { defaultValue: 'bar' },
        },
      },
    } as any;
    expect(() =>
      crudGenArgsDecorator.mapCrudGenParams(
        params,
        createMock(),
        fixedArgsQueryParams,
        mockedInfo,
      ),
    ).toThrow();
  });

  it('mapCrudGenParams rejects multiple extra args in ONLY_ONE mode', () => {
    const params = {
      ...fixedArgsOptions,
      extraArgsStrategy: ExtraArgsStrategy.ONLY_ONE,
      extraArgs: {
        foo: {
          filterType: FilterType.TEXT,
          filterCondition: GeneralFilters.EQUALS,
          options: {},
        },
        bar: {
          filterType: FilterType.TEXT,
          filterCondition: GeneralFilters.EQUALS,
          options: {},
        },
      },
    } as any;

    expect(() =>
      crudGenArgsDecorator.mapCrudGenParams(
        params,
        createMock(),
        { ...fixedArgsQueryParams, foo: 'x', bar: 'y' } as any,
        mockedInfo,
      ),
    ).toThrow('You must define only one extra arguments');
  });

  it('mapCrudGenParams stores virtual extra args in extra.args', () => {
    const params = {
      ...fixedArgsOptions,
      extraArgs: {
        virtualFoo: {
          filterCondition: GeneralFilters.VIRTUAL,
          options: {},
        },
      },
    } as any;

    const result = crudGenArgsDecorator.mapCrudGenParams(
      params,
      createMock(),
      { ...fixedArgsQueryParams, virtualFoo: 'abc' } as any,
      mockedInfo,
    );

    expect(result.extra.args.virtualFoo).toBe('abc');
  });

  it('tests mapCrudGenGqlParams', () => { 
    expect(crudGenArgsDecorator.mapCrudGenGqlParams(fixedArgsOptions, mockCreate(), fixedArgsQueryParams, mockedInfo)).toBeDefined(); 
  }); 
  it('tests CrudGenArgsFactory', () => { 
    expect(crudGenArgsDecorator.CrudGenArgsFactory(fixedArgsOptions, mockCreate())).toBeDefined(); 
  }); 
  it('tests CrudGenArgsNoPagination', () => { 
    const dec = crudGenArgsDecorator.CrudGenArgsNoPagination(fixedArgsOptions);
    expect(dec).toBeDefined(); 
    dec({}, 'key', 1);
  }); 
  it('tests CrudGenArgsSingleDecoratorMapper', () => { 
    expect(crudGenArgsDecorator.CrudGenArgsSingleDecoratorMapper(fixedArgsOptions, fixedArgsQueryParams, mockedInfo)).toBeDefined(); 
    expect(crudGenArgsDecorator.CrudGenArgsSingleDecoratorMapper({entityType: DummyEntity}, {join: {}}, mockedInfo)).toBeDefined(); 
  }); 
  it('tests CrudGenArgsSingleDecoratorFactory', () => { 
    expect(crudGenArgsDecorator.CrudGenArgsSingleDecoratorFactory(fixedArgsOptions, mockCreate())).toBeDefined(); 
  }); 
  it('tests CrudGenArgsSingle', () => { 
    const dec = crudGenArgsDecorator.CrudGenArgsSingle({
      entityType: DummyEntity,
      gql: {}
    });
    expect(dec).toBeDefined(); 
    dec({}, 'key', 1);
  }); 
  it('tests CrudGenArgs', () => { 
    const params = {
      ...fixedArgsOptions,
      gql: {},
      extraArgs: {
        hiddenFoo: { hidden: true },
        visibleFoo: { options: {} }
      }
    };
    const dec = crudGenArgsDecorator.CrudGenArgs(params);
    expect(dec).toBeDefined(); 
    dec({}, 'key', 1);
  }); 

  it('tests mapCrudGenGqlParams with ExtraArgsStrategy.ONLY_ONE valid', () => {
    const params = {
      ...fixedArgsOptions,
      extraArgsStrategy: ExtraArgsStrategy.ONLY_ONE,
      extraArgs: { 
        foo: { filterType: FilterType.TEXT, filterCondition: GeneralFilters.EQUALS }, 
        bar: { filterType: FilterType.TEXT, filterCondition: GeneralFilters.EQUALS } 
      },
    } as any;
    const validArgs = { foo: 'a' } as any; // only one defined
    expect(() => crudGenArgsDecorator.mapCrudGenGqlParams(params, mockCreate(), validArgs, mockedInfo)).not.toThrow();
  });

  it('tests mapCrudGenParams throws error in mapper', () => {
    // This will cause GqlModelFieldsMapper to throw because fieldType is a dummy object and info is null
    const result = crudGenArgsDecorator.mapCrudGenParams({ fieldType: {} } as any, mockCreate(), {}, null as any);
    expect(result).toBeDefined();
  });

  it('tests mapCrudGenGqlParams with ExtraArgsStrategy.AT_LEAST_ONE', () => {
    const params = {
      ...fixedArgsOptions,
      extraArgsStrategy: ExtraArgsStrategy.AT_LEAST_ONE,
      extraArgs: {
        foo: {
          filterType: FilterType.TEXT,
          filterCondition: GeneralFilters.EQUALS,
        },
      },
    } as any;
    expect(() => crudGenArgsDecorator.mapCrudGenGqlParams(params, mockCreate(), fixedArgsQueryParams, mockedInfo)).toThrow();
    
    // Now with valid args
    const validArgs = { ...fixedArgsQueryParams, foo: 'bar' } as any;
    expect(() => crudGenArgsDecorator.mapCrudGenGqlParams(params, mockCreate(), validArgs, mockedInfo)).not.toThrow();
  });

  it('tests mapCrudGenGqlParams with filterMiddleware', () => {
    const middleware = jest.fn().mockReturnValue('modified_bar');
    const params = {
      ...fixedArgsOptions,
      extraArgs: {
        foo: {
          filterType: FilterType.TEXT,
          filterCondition: GeneralFilters.EQUALS,
          filterMiddleware: middleware,
        },
      },
    } as any;
    const validArgs = { ...fixedArgsQueryParams, foo: 'bar' } as any;
    const res = crudGenArgsDecorator.mapCrudGenGqlParams(params, mockCreate(), validArgs, mockedInfo);
    expect(middleware).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  it('tests exports', () => {
    expect(crudGenArgsDecorator.getTextFilter).toBeDefined();
    expect(crudGenArgsDecorator.getNumberFilter).toBeDefined();
    expect(crudGenArgsDecorator.getDateFilter).toBeDefined();
    expect(crudGenArgsDecorator.filterSwitch).toBeDefined();
    expect(crudGenArgsDecorator.resolveFilter).toBeDefined();
    expect(crudGenArgsDecorator.convertFilter).toBeDefined();
    expect(crudGenArgsDecorator.createWhere).toBeDefined();
    expect(crudGenArgsDecorator.removeSymbolicSelection).toBeDefined();
    expect(crudGenArgsDecorator.checkFilterScope).toBeDefined();
    expect(crudGenArgsDecorator.getFindOperator).toBeDefined();
  });

  it('tests mapCrudGenParamsGql without options', () => {
    expect(crudGenArgsDecorator.mapCrudGenParamsGql(fixedArgsOptions, mockCreate(), { keys: [] }, fixedArgsQueryParams)).toBeDefined();
  });

  it('tests mapCrudGenGqlParams with missing entity/field map', () => {
    expect(crudGenArgsDecorator.mapCrudGenGqlParams(undefined, mockCreate(), fixedArgsQueryParams, infoObj as any)).toBeDefined();
  });

  it('tests CrudGenCombineDecorators without entityType', () => {
    const decorator = crudGenArgsDecorator.CrudGenCombineDecorators({ gql: {} });
    expect(decorator).toBeDefined();
    decorator({}, 'key', 1);
  });

  it('tests CrudGenArgs with provided gql type', () => {
    const decorator = crudGenArgsDecorator.CrudGenArgs({ gql: { type: () => String } });
    expect(decorator).toBeDefined();
  });

  it('tests CrudGenArgsNoPagination with provided gql type', () => {
    const decorator = crudGenArgsDecorator.CrudGenArgsNoPagination({ gql: { type: () => String } });
    expect(decorator).toBeDefined();
  });

  it('tests CrudGenArgsSingleDecoratorMapper without fieldType', () => {
    const mapper = crudGenArgsDecorator.CrudGenArgsSingleDecoratorMapper(undefined, fixedArgsQueryParams, infoObj as any);
    expect(mapper).toBeDefined();
  });

  it('tests CrudGenArgsSingle with provided gql type', () => {
    const decorator = crudGenArgsDecorator.CrudGenArgsSingle({ gql: { type: () => String } });
    expect(decorator).toBeDefined();
  });

  it('tests mapCrudGenParamsGql with options isCount true', () => {
    const result = crudGenArgsDecorator.mapCrudGenParamsGql(fixedArgsOptions, mockCreate(), { keys: [] }, fixedArgsQueryParams, { isCount: true });
    expect(result).toBeDefined();
  });

  it('tests CrudGenArgsSingleDecoratorMapper with params but no fieldType or entityType', () => {
    const mapper = crudGenArgsDecorator.CrudGenArgsSingleDecoratorMapper({}, fixedArgsQueryParams, infoObj as any);
    expect(mapper).toBeDefined();
  });

  it('tests mapCrudGenParamsGql with extraArgs but no extraArgsStrategy', () => {
    const params = { extraArgs: { myArg: 'string' }, extraArgsStrategy: 'INVALID_STRATEGY' };
    const result = crudGenArgsDecorator.mapCrudGenParamsGql(params as any, mockCreate(), { keys: [] }, fixedArgsQueryParams);
    expect(result).toBeDefined();
  });

  it('tests mapCrudGenParamsGql with ExtraArgsStrategy.DEFAULT', () => {
    const params = { extraArgs: { myArg: 'string' }, extraArgsStrategy: ExtraArgsStrategy.DEFAULT };
    const result = crudGenArgsDecorator.mapCrudGenParamsGql(params as any, mockCreate(), { keys: [] }, fixedArgsQueryParams);
    expect(result).toBeDefined();
  });

  it('tests mapCrudGenParams without params fieldType, fieldMap, entityType', () => {
    const result = crudGenArgsDecorator.mapCrudGenParams({}, mockCreate(), fixedArgsQueryParams, infoObj as any);
    expect(result).toBeDefined();
  });

  it('tests CrudGenArgs without gql options, without JoinOptionInput and missing options in extraArgs', () => {
    class EmptyEntity {}
    const params = {
      entityType: EmptyEntity,
      extraArgs: {
        myArg: {}
      }
    };
    
    const decorator = crudGenArgsDecorator.CrudGenArgs(params);
    expect(decorator).toBeDefined();
  });

  it('tests CrudGenArgsSingle without JoinOptionInput', () => {
    class EmptyEntity2 {}
    const params = {
      entityType: EmptyEntity2
    };
    const decorator = crudGenArgsDecorator.CrudGenArgsSingle(params);
    expect(decorator).toBeDefined();
  });
});
