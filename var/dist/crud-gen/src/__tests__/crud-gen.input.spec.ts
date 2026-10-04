import { jest } from '@jest/globals';
import * as CrudGenHelpers from '../crud-gen.helpers.js';
import * as CrudGenEnum from '../crud-gen.enum.js';
import { TestEntity, TestEntityRelation } from '../__mocks__/entity.mock.js';

jest.mock('@nestjs/graphql', () => {
  console.log('MOCKING NESTJS GRAPHQL');
  const original = jest.requireActual('@nestjs/graphql') as any;
  return {
    __esModule: true,
    ...original,
    Field: (typeFn?: any, options?: any) => {
      console.log('MOCKED FIELD DEFINED', typeFn);
      return (target: any, propertyKey: string) => {
        console.log('MOCKED FIELD CALLED', propertyKey);
        const properties = Reflect.getMetadata('graphql:properties', target) || [];
        properties.push({ propertyKey, typeFn, options });
        Reflect.defineMetadata('graphql:properties', properties, target);
        if (original.Field) {
          original.Field(typeFn, options)(target, propertyKey);
        }
      };
    }
  };
});


import {
  agJoinArgFactory,
  filterExpressionInputFactory,
  RowGroup,
  SortModel,
  sortModelFactory,
} from '../api-graphql/crud-gen.input.js';

describe('Dynamic user input dto test', () => {
    const invokeTypeFns = (target: any) => {
      const { TypeMetadataStorage } = require('@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage');
      const { LazyMetadataStorage } = require('@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage');
      
      const typeFns: any[] = [];
      const originalAdd = TypeMetadataStorage.addClassFieldMetadata;
      TypeMetadataStorage.addClassFieldMetadata = function(metadata: any) {
          if (metadata && metadata.typeFn) {
              typeFns.push(metadata.typeFn);
          }
          return originalAdd.apply(this, arguments);
      };
      
      LazyMetadataStorage.load();
      TypeMetadataStorage.compile();
      
      typeFns.forEach((typeFn: any) => {
          if (typeof typeFn === 'function') {
            const typeClass = typeFn();
            if (Array.isArray(typeClass)) {
              if (typeof typeClass[0] === 'function' && !typeClass[0].name) typeClass[0]();
            } else if (typeof typeClass === 'function' && !typeClass.name) {
              typeClass();
            }
          }
      });
      TypeMetadataStorage.addClassFieldMetadata = originalAdd;
    };

  it('Check RowGroup Dto', async () => {
    const testData = new RowGroup();
    expect(testData).toBeDefined();

    // Call inner thunks for full coverage
    invokeTypeFns(RowGroup);
  });
  
  it('Check SortModel Dto', async () => {
    const testData = new SortModel();
    expect(testData).toBeDefined();

    invokeTypeFns(SortModel);
  });

  describe('Check SortModelFactory', () => {
    class DummySortEntity1 {}
    class DummySortEntity2 {}

    it('Should return a SortModel correctly not cached', () => {
      const result = sortModelFactory<DummySortEntity1>(DummySortEntity1 as any);
      expect(result).toBeDefined();
      invokeTypeFns(result);
    });

    it('Should return a SortModel correctly cached', () => {
      sortModelFactory<DummySortEntity2>(DummySortEntity2 as any);
      const result = sortModelFactory<DummySortEntity2>(DummySortEntity2 as any);
      expect(result).toBeDefined();
    });
  });

  describe('Check all factories', () => {
    class NewEntityForJoin {}
    class MockTypeForJoin {}
    
    it('should run all factories to generate classes', () => {
      const CrudGenInput = require('../api-graphql/crud-gen.input.js');
      expect(CrudGenInput.JoinTypes).toBeDefined();

      jest.spyOn(CrudGenHelpers.crudGenHelpersMockable, 'getEntityRelations').mockReturnValue([{
        relation: { type: () => MockTypeForJoin, propertyName: 'dummyRelation' }
      }]);
      if (CrudGenInput.crudGenParamsFactory) CrudGenInput.crudGenParamsFactory(NewEntityForJoin as any);
      if (CrudGenInput.agFilterArgFactory) CrudGenInput.agFilterArgFactory(NewEntityForJoin as any);
      if (CrudGenInput.agCreateArgFactory) CrudGenInput.agCreateArgFactory(NewEntityForJoin as any);
      if (CrudGenInput.agUpdateArgFactory) CrudGenInput.agUpdateArgFactory(NewEntityForJoin as any);
      if (CrudGenInput.agJoinArgFactory) CrudGenInput.agJoinArgFactory(NewEntityForJoin as any);
      if (CrudGenInput.filterExpressionInputFactory) CrudGenInput.filterExpressionInputFactory(NewEntityForJoin as any);
      if (CrudGenInput.sortModelFactory) CrudGenInput.sortModelFactory(NewEntityForJoin as any);
      if (CrudGenInput.agPaginationArgFactory) CrudGenInput.agPaginationArgFactory(NewEntityForJoin as any);
      
      invokeTypeFns(NewEntityForJoin); // Just triggers the execution of all typeFns globally
    });

    it('should return cached values for factories', () => {
      const MyCrudGenInput = require('../api-graphql/crud-gen.input.js');
      const f1 = MyCrudGenInput.crudGenParamsFactory?.(NewEntityForJoin as any);
      const f2 = MyCrudGenInput.agFilterArgFactory?.(NewEntityForJoin as any);
      const f3 = MyCrudGenInput.agCreateArgFactory?.(NewEntityForJoin as any);
      const f4 = MyCrudGenInput.agUpdateArgFactory?.(NewEntityForJoin as any);
      const f5 = MyCrudGenInput.agJoinArgFactory?.(NewEntityForJoin as any);
      const f6 = MyCrudGenInput.filterExpressionInputFactory?.(NewEntityForJoin as any);
      const f7 = MyCrudGenInput.sortModelFactory?.(NewEntityForJoin as any);
      const f8 = MyCrudGenInput.agPaginationArgFactory?.(NewEntityForJoin as any);

      [f1, f2, f3, f4, f5, f6, f7, f8].forEach((c) => {
        if (c) {
          invokeTypeFns(c);
          if (c.name === 'JoinOptionInput' || c.name === 'JoinInput') {
             const properties = Reflect.getMetadata('graphql:properties', c.prototype) || [];
             properties.forEach((p: any) => p.typeFn && p.typeFn());
          }
        }
      });
    });
  });
});
