import { jest } from '@jest/globals';
import { createMock } from '@golevelup/ts-jest';
import { BaseEntity, Equal } from 'typeorm';
import { GeneralFilters, ExtraArgsStrategy, FilterType } from '../crud-gen.enum.js';


import * as graphql from '@nestjs/graphql';
import { ModelField } from '../object.decorator.js';

class DummyEntity extends BaseEntity {
  @ModelField({})
  field: string;
}

import * as CrudGenHelpers from '../crud-gen.helpers.js';
jest.mock('../api-graphql/crud-gen.input.js');
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

const mockedInfo = createMock<any>();
const mockCreate = (graphql.GqlExecutionContext.create = jest.fn());
mockCreate.mockImplementation(() => ({
  getArgs: jest.fn().mockReturnValue(fixedArgsQueryParams),
  getInfo: jest.fn().mockReturnValue(infoObj),
}));

describe('Crud-gen args decorator (esm-safe)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(CrudGenHelpers, 'objectToFieldMapper')
      .mockReturnValue({ field: {}, filterOption: {} } as any);
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
    const argsFn = graphql.Args as jest.Mock;
    argsFn.mockReturnValue(jest.fn());
    jest.spyOn(CrudGenInput as any, 'agJoinArgFactory').mockReturnValue({});
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
});
