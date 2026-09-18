// removed jest.mock('@nestjs/graphql')
import {
  agJoinArgFactory,
  filterExpressionInputFactory,
  RowGroup,
  SortModel,
  sortModelFactory,
} from '../ag-grid.input';
import * as AgGridEnum from '../ag-grid.enum';
import * as AgGridHelpers from '../ag-grid-metadata.helper';
import { TestEntity, TestEntityRelation } from '../__mocks__/entity.mock';
import * as AgGridQueryHelpers from "../ag-grid-query.helper";
import * as AgGridFactoryHelpers from "../ag-grid-factory.helper";

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
    it('Should return a SortModel correctly not cached and then cached', () => {
      const result1 = sortModelFactory<TestEntity>(TestEntity);
      expect(result1).toBeDefined();

      const result2 = sortModelFactory<TestEntity>(TestEntity);
      expect(result2).toBe(result1); // Exact same reference due to cache
    });
  });

  describe('Check FilterExpressionInputFactory', () => {
    it('Should return a FilterExpression correctly not cached and then cached', () => {
      const result1 = filterExpressionInputFactory<TestEntity>(TestEntity);
      expect(result1).toBeDefined();

      const result2 = filterExpressionInputFactory<TestEntity>(TestEntity);
      expect(result2).toBe(result1); // Exact same reference due to cache
    });
  });

  it('Should return the JoinOptionInput already cached', () => {
    const result = agJoinArgFactory(TestEntityRelation);
    expect(result).toBeDefined();

    const cachedResult = agJoinArgFactory(TestEntityRelation);
    expect(cachedResult).toBe(result);
  });
});
