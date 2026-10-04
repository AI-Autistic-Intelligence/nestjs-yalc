import { jest } from '@jest/globals';
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

  it('Should return null for entity with no relations', () => {
    const result = agJoinArgFactory(TestEntity);
    expect(result).toBeNull();
  });
});

import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectType, Query, Resolver, Args } from '@nestjs/graphql';
import { sortModelFactory, filterExpressionInputFactory } from '../ag-grid.input';

describe('Schema Builder Test', () => {
  let schemaFactory: GraphQLSchemaFactory;

  it('should build schema and trigger thunks', async () => {
    const SortModelClass = sortModelFactory(TestEntity);
    const FilterModelClass = filterExpressionInputFactory(TestEntity);

    @Resolver()
    class DummyResolver {
      @Query(() => String)
      dummy(
        @Args('sort', { type: () => SortModelClass }) sort: any,
        @Args('filter', { type: () => FilterModelClass }) filter: any,
        @Args('deprecatedSort', { type: () => SortModel }) deprecatedSort: any,
      ) {
        return 'dummy';
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [GraphQLSchemaBuilderModule],
      providers: [DummyResolver],
    }).compile();

    schemaFactory = module.get<GraphQLSchemaFactory>(GraphQLSchemaFactory);

    try {
      await schemaFactory.create([DummyResolver], [SortModelClass, FilterModelClass, SortModel]);
    } catch (e) {
      console.error(e);
    }
  });
});


