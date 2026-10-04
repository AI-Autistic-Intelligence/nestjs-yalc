import { jest } from '@jest/globals';
import { AgGridDependencyFactory, isProviderOverride, getProviderToken } from '../ag-grid-factory.helper';
import { BaseEntity } from 'typeorm';

class TestEntity extends BaseEntity {}

describe('AgGridFactory Helper', () => {
  describe('isProviderOverride', () => {
    it('Should return true if resolver is ProviderOverride', () => {
      expect(isProviderOverride({ provider: {} })).toBe(true);
    });

    it('Should return false if resolver is not ProviderOverride', () => {
      expect(isProviderOverride({})).toBe(false);
    });
  });

  describe('getProviderToken', () => {
    it('Should return provide function name if entity is provider with function', () => {
      const func = function TestProvider() {};
      expect(getProviderToken({ provide: func })).toBe('TestProvider');
    });

    it('Should return provide property if entity is provider with string', () => {
      expect(getProviderToken({ provide: 'TestString' })).toBe('TestString');
    });

    it('Should return function name if entity is function', () => {
      const func = function TestFunc() {};
      expect(getProviderToken(func)).toBe('TestFunc');
    });

    it('Should return entity itself if it is a string', () => {
      expect(getProviderToken('TestEntity')).toBe('TestEntity');
    });
  });

  describe('AgGridDependencyFactory', () => {
    it('Should return providers with all options enabled as defaults', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        service: true,
        dataloader: true,
        resolver: true,
      });
      expect(result.providers.length).toBeGreaterThan(0);
      expect(result.repository).toBeDefined();
    });

    it('Should return providers with provider overrides', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        service: { provider: { provide: 'CustomService', useValue: {} } },
        dataloader: { provider: { provide: 'CustomLoader', useValue: {} } },
        resolver: { provider: { provide: 'CustomResolver', useValue: {} } },
      });
      expect(result.providers).toContainEqual({ provide: 'CustomService', useValue: {} });
      expect(result.providers).toContainEqual({ provide: 'CustomLoader', useValue: {} });
      expect(result.providers).toContainEqual({ provide: 'CustomResolver', useValue: {} });
    });

    it('Should handle omitted resolver', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
      });
      expect(result.providers.length).toBeGreaterThan(0);
    });

    it('Should handle disabled resolver and service without dataloader', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        resolver: false,
      });
      expect(result.providers).toHaveLength(0);
      expect(result.repository).toBeDefined();
    });

    it('Should use provided repository', () => {
      const mockRepo = {} as any;
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        repository: mockRepo,
        resolver: false,
      });
      expect(result.repository).toBe(mockRepo);
    });
    
    it('Should handle service configured as an object but not a provider override', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        service: { entityModel: TestEntity, providerClass: class {} as any },
        resolver: false,
      });
      expect(result.providers.length).toBeGreaterThan(0);
    });

    it('Should handle dataloader configured as an object but not a provider override', () => {
      const result = AgGridDependencyFactory({
        entityModel: TestEntity,
        dataloader: { entityModel: TestEntity, databaseKey: 'test' },
        resolver: false,
      });
      expect(result.providers.length).toBeGreaterThan(0);
    });
  });
});
