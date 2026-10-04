import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { QueryFailedError } from 'typeorm';
import {
  validateSupportedError,
  GenericService,
  GenericServiceFactory,
} from '../typeorm/generic.service.js';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('validateSupportedError', () => {
  it('should wrap QueryFailedError and rethrow others', () => {
    const handler = validateSupportedError(Error);
    expect(() => handler(new QueryFailedError('q', [], new Error('boom')))).toThrow(
      Error,
    );
    expect(() => handler(new Error('generic'))).toThrow('generic');
  });
});

describe('GenericService', () => {
  const repositoryRead: any = { target: class Read {}, find: jest.fn() };
  const repositoryWrite: any = { target: class Write {}, find: jest.fn() };

  it('should set and retrieve repositories', () => {
    const service = new GenericService(repositoryRead, repositoryWrite);
    expect(service.getRepository()).toBe(repositoryRead);
    expect(service.getRepositoryWrite()).toBe(repositoryWrite);

    const newRepo: any = { target: class New {}, find: jest.fn() };
    service['setRepository'](newRepo);
    expect(service.getRepository()).toBe(newRepo);
    expect(service.getRepositoryWrite()).toBe(newRepo);
  });

  it('GenericServiceFactory should create provider with custom class', () => {
    class CustomService extends GenericService<any> {}
    const provider = GenericServiceFactory(class Entity {}, 'default', CustomService);
    const instance = (provider as any).useFactory(repositoryRead, repositoryWrite);

    expect((provider as any).provide).toBe(CustomService);
    expect(instance).toBeInstanceOf(CustomService);
  });

  it('should switchDatabaseConnection', () => {
    const service = new GenericService(repositoryRead, repositoryWrite) as any;
    const typeorm = require('typeorm');
    const mockRepo = {};
    const mockConnection = {
      getRepository: jest.fn().mockReturnValue(mockRepo)
    };
    jest.spyOn(typeorm.getConnectionManager(), 'get').mockReturnValue(mockConnection as any);

    service.switchDatabaseConnection('new_db');

    expect(typeorm.getConnectionManager().get).toHaveBeenCalledWith('new_dbConnection');
    expect(mockConnection.getRepository).toHaveBeenCalledTimes(2);
    expect(service.getRepository()).toBe(mockRepo);
    expect(service.getRepositoryWrite()).toBe(mockRepo);

    jest.restoreAllMocks();
  });

  it('normalizeCrudGenWhereForPlainTypeorm should handle plain, array, and nested arrays in OR', () => {
    const { normalizeCrudGenWhereForPlainTypeorm } = require('../typeorm/generic.service.js');
    
    // Line 55: not an object
    expect(normalizeCrudGenWhereForPlainTypeorm(null)).toBeNull();
    
    // Line 59-63: array
    expect(normalizeCrudGenWhereForPlainTypeorm([null, {}])).toEqual([{}]);

    // Line 111: array in OR childExpressions
    expect(normalizeCrudGenWhereForPlainTypeorm({
      operator: 'OR',
      childExpressions: [
        [ { filters: { a: 1 } } ]
      ]
    })).toEqual([{ a: 1 }]);

    // Line 63 false branch: array normalizes to empty
    expect(normalizeCrudGenWhereForPlainTypeorm([null])).toBeUndefined();

    // Line 107 true branch: has filters
    expect(normalizeCrudGenWhereForPlainTypeorm({
      operator: 'OR',
      filters: { b: 2 }
    })).toEqual([{ b: 2 }]);

    // Line 117 false branch: empty orWheres
    expect(normalizeCrudGenWhereForPlainTypeorm({
      operator: 'OR',
      childExpressions: []
    })).toBeUndefined();

    // Line 129 true branch & 134 true branch: AND with childExpressions
    expect(normalizeCrudGenWhereForPlainTypeorm({
      operator: 'AND',
      childExpressions: [ { c: 3 } ]
    })).toEqual({ c: 3 });

    // Line 134 false branch: AND with no keys
    expect(normalizeCrudGenWhereForPlainTypeorm({
      operator: 'AND',
      childExpressions: [ {} ]
    })).toBeUndefined();
  });

  it('createEntity/updateEntity should handle returnEntity = false without getOneExtended', async () => {
    const mockRepo = {
      getId: jest.fn().mockReturnValue(1),
      save: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      create: jest.fn().mockReturnValue({ a: 1 }),
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 1 }] }),
      metadata: { primaryColumns: [{ propertyName: 'id' }] }
    };
    const service = new GenericService(mockRepo as any, mockRepo as any) as any;
    service.validateConditions = jest.fn().mockResolvedValue({});
    service.mapEntityR2W = jest.fn((val) => val);
    
    // lines 493 (create)
    const createResult = await service.createEntity({ a: 1 }, {}, false);
    expect(createResult).toBe(true);

    // lines 571 (update)
    const updateResult = await service.updateEntity({ id: 1 }, { a: 2 }, {}, false);
    expect(updateResult).toBe(true);
  });

  it('mapEntityR2W should cover non-extended object fallback', () => {
    const service = new GenericService(repositoryRead, repositoryWrite) as any;
    const { CRUDGEN_FIELD_METADATA_KEY } = require('../object.decorator.js');
    class Entity {}
    Reflect.defineMetadata(CRUDGEN_FIELD_METADATA_KEY, {
      prop1: {
        dst: { weirdObject: true } as any
      }
    }, Entity);
    service.entityRead = Entity;
    
    // line 758-761
    const result = service.mapEntityR2W({ prop1: 'val' });
    expect(result.prop1).toBe('val');
  });

  it('buildPrimaryKeyWhere should fallback to default id if metadata is missing', () => {
    const mockRepo = {};
    const service = new GenericService(mockRepo as any, mockRepo as any) as any;
    expect(service.buildPrimaryKeyWhere(123)).toEqual({ id: 123 });
  });

  it('getEntityList should handle findOptions with and without sorting', async () => {
    const mockRepo = {
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      find: jest.fn().mockResolvedValue([])
    };
    const service = new GenericService(mockRepo as any, mockRepo as any) as any;
    
    await service.getEntityList({ sorting: [{ colId: 'id', sort: 'ASC' }] });
    expect(mockRepo.find).toHaveBeenCalled();
    
    await service.getEntityList({ });
  });
});

