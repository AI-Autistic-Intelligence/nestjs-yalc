import { jest } from '@jest/globals';



import * as CrudGenGqlEnum from '../api-graphql/crud-gen-gql.enum.js';
const spiedEntityFieldsEnumGqlFactory = jest.spyOn(CrudGenGqlEnum as any, 'entityFieldsEnumGqlFactory');
spiedEntityFieldsEnumGqlFactory.mockReturnValue({
  test: 'test',
} as any);

import * as CrudGenHelpers from '../crud-gen.helpers.js';
import {
  agJoinArgFactory,
  filterExpressionInputFactory,
  RowGroup,
  SortModel,
  sortModelFactory,
} from '../api-graphql/crud-gen.input.js';
import * as CrudGenEnum from '../crud-gen.enum.js';
import { TestEntity, TestEntityRelation } from '../__mocks__/entity.mock.js';

describe('Dynamic user input dto test', () => {
  it('Check RowGroup Dto', async () => {
    const testData = new RowGroup();

    expect(testData).toBeDefined();
  });
  it('Check SortModel Dto', async () => {
    const testData = new SortModel();

    expect(testData).toBeDefined();
  });

  describe('Check SortModelFactory', () => {
    class DummySortEntity1 {}
    class DummySortEntity2 {}

    beforeEach(() => {
      spiedEntityFieldsEnumGqlFactory.mockReturnValue({
        ['test']: 'test',
      });
    });

    afterEach(() => {
      spiedEntityFieldsEnumGqlFactory.mockReset();
    });

    it('Should return a SortModel correctly not cached', () => {
      const result = sortModelFactory<DummySortEntity1>(DummySortEntity1 as any);
      expect(result).toBeDefined();
      expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(1);
      spiedEntityFieldsEnumGqlFactory.mockReset();
    });

    it('Should return a SortModel correctly cached', () => {
      sortModelFactory<DummySortEntity2>(DummySortEntity2 as any);
      spiedEntityFieldsEnumGqlFactory.mockReset();
      const result = sortModelFactory<DummySortEntity2>(DummySortEntity2 as any);
      expect(result).toBeDefined();
      expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(0);
    });
  });

  describe('Check FilterExpressionInputFactory', () => {
    class DummyFilterEntity1 {}
    class DummyFilterEntity2 {}

    beforeEach(() => {
      spiedEntityFieldsEnumGqlFactory.mockReturnValue({
        ['test']: 'test',
      });
    });

    afterEach(() => {
      spiedEntityFieldsEnumGqlFactory.mockReset();
    });

    it('Should return a FilterExpression correctly not cached', () => {
      const result = filterExpressionInputFactory<DummyFilterEntity1>(DummyFilterEntity1 as any);
      expect(result).toBeDefined();
      expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(1);
      spiedEntityFieldsEnumGqlFactory.mockReset();
    });

    it('Should return a FilterExpression correctly cached', () => {
      filterExpressionInputFactory<DummyFilterEntity2>(DummyFilterEntity2 as any);
      spiedEntityFieldsEnumGqlFactory.mockReset();
      const result = filterExpressionInputFactory<DummyFilterEntity2>(DummyFilterEntity2 as any);
      expect(result).toBeDefined();
      expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(0);
    });
  });

  it('Should return the JoinOptionInput already cached', () => {
    const result = agJoinArgFactory(TestEntityRelation);
    expect(result).toBeDefined();

    const cachedResult = agJoinArgFactory(TestEntityRelation);
    expect(cachedResult).toBe(result);
  });
});
