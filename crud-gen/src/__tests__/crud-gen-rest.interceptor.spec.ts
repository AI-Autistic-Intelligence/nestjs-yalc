import { describe, expect, it, jest } from '@jest/globals';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import {
  crudGenRestPaginationInterceptorWorker,
  CrudGenRestPaginationInterceptor,
  buildCrudGenRestSimpleMapperInterceptor,
  buildCrudGenRestMapperInterceptor,
  buildPaginatedResultDto,
  buildPaginatedDTOInterceptor,
  buildDTOInterceptor,
} from '../api-rest/crud-gen-rest.interceptor.js';
import { crudRestControllerFactory } from '../api-rest/crud-gen-rest.controller.factory.js';
import { GenericService } from '../typeorm/generic.service.js';
import { PrimaryColumn } from 'typeorm';

class TestEntity {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

class TestDto {
  id!: string;
  name!: string;

  constructor(data: { id: string; name: string }) {
    Object.assign(this, data);
  }
}

class GuidEntity {
  @PrimaryColumn()
  guid!: string;

  name!: string;
}

const buildHttpContext = (query: any = {}, body: any = {}) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        query,
        body,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('crud-gen REST interceptors', () => {
  it('crudGenRestPaginationInterceptorWorker should wrap page data', () => {
    const result = crudGenRestPaginationInterceptorWorker<number>(2, 4)([
      [1, 2],
      10,
    ] as any);

    expect(result).toEqual({
      list: [1, 2],
      pageData: { count: 10, startRow: 2, endRow: 4 },
    });
  });

  it('crudGenRestPaginationInterceptorWorker should handle non-paginated arrays', () => {
    const worker = crudGenRestPaginationInterceptorWorker<number>(undefined, undefined, false);
    const result = worker([1, 2, 3] as any);

    expect(result).toEqual({
      list: [1, 2, 3],
      pageData: { count: 3, startRow: 0, endRow: 3 },
    });
  });

  it('crudGenRestPaginationInterceptorWorker should handle non-paginated non-array data', () => {
    const worker = crudGenRestPaginationInterceptorWorker<number>(undefined, undefined, false);
    const result = worker('single_item' as any);

    expect(result).toEqual({
      list: 'single_item',
      pageData: { count: 0, startRow: 0, endRow: 0 },
    });
  });

  it('CrudGenRestPaginationInterceptor should read pagination params from request', async () => {
    const interceptor = new CrudGenRestPaginationInterceptor();
    const ctx = buildHttpContext({ startRow: 5, endRow: 8 });
    const next: CallHandler = {
      handle: () => of([['a'], 3]),
    };

    const result = await firstValueFrom(interceptor.intercept(ctx, next));
    expect(result).toEqual({
      list: ['a'],
      pageData: { count: 3, startRow: 5, endRow: 8 },
    });
  });

  it('CrudGenRestPaginationInterceptor should default to count when no pagination params', async () => {
    const interceptor = new CrudGenRestPaginationInterceptor();
    const ctx = buildHttpContext({});
    const next: CallHandler = {
      handle: () => of([['b'], 1]),
    };

    const result = await firstValueFrom(interceptor.intercept(ctx, next));
    expect(result.pageData).toEqual({ count: 1, startRow: 0, endRow: 1 });
  });

  it('buildCrudGenRestMapperInterceptor should map paginated and non-paginated payloads', async () => {
    const PaginatedInterceptor = buildCrudGenRestMapperInterceptor(
      { id: 'id', name: 'name' } as any,
      true,
    );
    const paginatedInterceptor = new PaginatedInterceptor();
    const ctx = buildHttpContext();
    const paginatedNext: CallHandler = {
      handle: () =>
        of([
          [
            { id: '1', name: 'first' },
            { id: '2', name: 'second' },
          ],
          2,
        ] as any),
    };

    const [mapped, count] = await firstValueFrom(
      paginatedInterceptor.intercept(ctx, paginatedNext),
    );
    expect(mapped[0]).toEqual({ id: '1', name: 'first' });
    expect(count).toBe(2);

    const PlainInterceptor = buildCrudGenRestMapperInterceptor(
      { id: 'id', name: 'name' } as any,
    );
    const plainInterceptor = new PlainInterceptor();
    const plainNext: CallHandler = {
      handle: () => of({ id: '3', name: 'third' }),
    };

    const mappedPlain = await firstValueFrom(
      plainInterceptor.intercept(ctx, plainNext),
    );
    expect(mappedPlain).toEqual({ id: '3', name: 'third' });
  });

  it('buildCrudGenRestSimpleMapperInterceptor should map paginated data to DTOs', async () => {
    const Interceptor = buildCrudGenRestSimpleMapperInterceptor(TestDto, true);
    const interceptor = new Interceptor();
    const ctx = buildHttpContext();
    const next: CallHandler = {
      handle: () =>
        of([
          [
            { id: '1', name: 'first' },
            { id: '2', name: 'second' },
          ],
          2,
        ] as any),
    };

    const [items, count] = await firstValueFrom(
      interceptor.intercept(ctx, next),
    );

    expect(items).toHaveLength(2);
    expect(items[0]).toBeInstanceOf(TestDto);
    expect(count).toBe(2);
  });

  it('buildPaginatedResultDto should map list to DTO instances', () => {
    const PaginatedDto = buildPaginatedResultDto(TestDto);
    const page = new PaginatedDto(
      [
        { id: '1', name: 'name' },
        { id: '2', name: 'other' },
      ] as any[],
      { count: 2, startRow: 0, endRow: 2 },
    );

    expect(page.list[0]).toBeInstanceOf(TestDto);
    expect(page.pageData.count).toBe(2);
  });

  it('buildPaginatedDTOInterceptor should wrap DTOs with pagination info', async () => {
    const Interceptor = buildPaginatedDTOInterceptor(TestDto);
    const interceptor = new Interceptor();
    const ctx = buildHttpContext({ startRow: 1, endRow: 3 });
    const next: CallHandler = {
      handle: () =>
        of([
          [
            { id: '1', name: 'one' },
            { id: '2', name: 'two' },
          ],
          5,
        ] as any),
    };

    const result = await firstValueFrom(interceptor.intercept(ctx, next));
    expect(result.list[1]).toBeInstanceOf(TestDto);
    expect(result.pageData).toEqual({ count: 5, startRow: 1, endRow: 3 });
  });

  it('buildDTOInterceptor should convert payload to DTO', async () => {
    const Interceptor = buildDTOInterceptor(TestDto);
    const interceptor = new Interceptor();
    const ctx = buildHttpContext();
    const next: CallHandler = {
      handle: () => of({ id: 'id', name: 'value' }),
    };

    const result = await firstValueFrom(interceptor.intercept(ctx, next));
    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('value');
  });
  it('buildCrudGenRestSimpleMapperInterceptor should handle default withPagination', async () => {
    const interceptorClass = buildCrudGenRestSimpleMapperInterceptor(TestDto);
    const interceptor = new interceptorClass();

    const mockExecutionContext = {
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([{ id: 1, name: 'value' }]), // just data
    } as CallHandler;

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler);
    const result = await firstValueFrom(result$ as any);
    
    expect(result).toBeDefined();
    expect(result[0]).toBeInstanceOf(TestDto);
  });

  it('buildCrudGenRestSimpleMapperInterceptor should handle withPagination = true', async () => {
    const interceptorClass = buildCrudGenRestSimpleMapperInterceptor(TestDto, true);
    const interceptor = new interceptorClass();

    const mockExecutionContext = {
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([[{ id: 1, name: 'value' }], 1]), // [data, count]
    } as CallHandler;

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler);
    const result = await firstValueFrom(result$ as any);
    
    // The interceptor returns [data, count], so we assert that
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0][0]).toBeInstanceOf(TestDto);
    expect(result[1]).toBe(1);
  });

  it('buildPaginatedDTOInterceptor should handle missing query', async () => {
    const InterceptorClass = buildPaginatedDTOInterceptor(TestDto);
    const interceptor = new InterceptorClass();

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}), // no query
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([[{ id: 1 }], 1]), // list, count
    } as CallHandler;

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler);
    const result = await firstValueFrom(result$);
    expect(result.pageData.startRow).toBe(0);
    expect(result.pageData.endRow).toBe(1);
  });

  it('CrudGenRestPaginationInterceptor should handle missing query', async () => {
    const interceptor = new CrudGenRestPaginationInterceptor();

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}), // no query
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([[{ id: 1 }], 1]),
    } as CallHandler;

    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler);
    const result = await firstValueFrom(result$ as any);
    expect(result).toBeDefined();
  });
});

describe('crudRestControllerFactory', () => {
  it('should map list and getById using provided service', async () => {
    const service = {
      getEntityListExtended: jest.fn().mockResolvedValue(['ok']),
      getEntity: jest.fn().mockResolvedValue({ id: '1', name: 'entity' }),
      createEntity: jest.fn(),
      updateEntity: jest.fn(),
      deleteEntity: jest.fn(),
    } as unknown as GenericService<TestEntity>;

    const decorators = [
      ((target: any) => {
        target.decorated = true;
      }) as ClassDecorator,
    ];

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
      decorators,
    });

    expect((Controller as any).decorated).toBe(true);

    const controller = new Controller(service);

    const listResult = await controller.list({} as any, {} as any);
    expect(service.getEntityListExtended).toHaveBeenCalledWith({}, true);
    expect(listResult).toEqual(['ok']);

    const item = await controller.getById('1');
    expect(service.getEntity).toHaveBeenCalledWith(
      { id: '1' } as any,
      undefined,
      undefined,
      undefined,
      { failOnNull: true },
    );
    expect(item).toEqual({ id: '1', name: 'entity' });
  });

  it('should map create, update and delete to GenericService write methods', async () => {
    const service = {
      getEntityListExtended: jest.fn(),
      getEntity: jest.fn(),
      createEntity: jest.fn().mockResolvedValue({ id: '1', name: 'created' }),
      updateEntity: jest.fn().mockResolvedValue({
        id: '1',
        name: 'updated',
      }),
      deleteEntity: jest.fn().mockResolvedValue(true),
    } as unknown as GenericService<TestEntity>;

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
    });

    const controller = new Controller(service);

    const created = await controller.create({ name: 'created' } as any);
    expect(service.createEntity).toHaveBeenCalledWith({ name: 'created' });
    expect(created).toBeDefined();

    const updated = await controller.update('1', { name: 'updated' } as any);
    expect(service.updateEntity).toHaveBeenCalledWith(
      { id: '1' } as any,
      { name: 'updated' } as any,
    );
    expect(updated).toBeDefined();

    const removed = await controller.remove('1');
    expect(service.deleteEntity).toHaveBeenCalledWith({ id: '1' } as any);
    expect(removed).toEqual({ deleted: true });
  });

  it('should infer the REST id field from a single primary column', async () => {
    const service = {
      getEntityListExtended: jest.fn(),
      getEntity: jest.fn().mockResolvedValue({ guid: 'user-1', name: 'user' }),
      createEntity: jest.fn(),
      updateEntity: jest.fn().mockResolvedValue({
        guid: 'user-1',
        name: 'updated',
      }),
      deleteEntity: jest.fn().mockResolvedValue(true),
    } as unknown as GenericService<GuidEntity>;

    const Controller = crudRestControllerFactory<GuidEntity>({
      entityModel: GuidEntity,
    });

    const controller = new Controller(service);

    await controller.getById('user-1');
    expect(service.getEntity).toHaveBeenCalledWith(
      { guid: 'user-1' } as any,
      undefined,
      undefined,
      undefined,
      { failOnNull: true },
    );

    await controller.update('user-1', { name: 'updated' });
    expect(service.updateEntity).toHaveBeenCalledWith(
      { guid: 'user-1' } as any,
      { name: 'updated' },
    );

    await controller.remove('user-1');
    expect(service.deleteEntity).toHaveBeenCalledWith({
      guid: 'user-1',
    } as any);
  });

  it('maps OData query params and validates expand allowlist', async () => {
    const service = {
      getEntityListExtended: jest.fn().mockResolvedValue(['ok']),
      getEntity: jest.fn(),
      createEntity: jest.fn(),
      updateEntity: jest.fn(),
      deleteEntity: jest.fn(),
    } as unknown as GenericService<TestEntity>;

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
      odata: { allowedExpands: ['relations'] },
    });

    const controller = new Controller(service);

    const odataQuery = {
      $select: 'id,name',
      $orderby: 'name desc',
      $top: '5',
      $skip: '10',
      $count: 'false',
      $expand: 'relations',
      $filter: 'name eq "John"',
    } as any;

    await controller.list(odataQuery, {} as any);

    expect(service.getEntityListExtended).toHaveBeenCalledWith(
      expect.objectContaining({
        select: ['id', 'name'],
        order: { name: 'DESC' },
        take: 5,
        skip: 10,
        relations: ['relations'],
        extra: expect.objectContaining({
          odata: expect.objectContaining({
            filter: 'name eq "John"',
          }),
        }),
      }),
      false,
    );

    await expect(
      controller.list({ $expand: 'invalid' } as any, {} as any),
    ).rejects.toThrow('Unsupported $expand');
  });

  it('maps OData query params with count undefined, expand without allowed, no filter', async () => {
    const service = {
      getEntityListExtended: jest.fn().mockResolvedValue(['ok']),
    } as unknown as GenericService<TestEntity>;

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
    });

    const controller = new Controller(service);

    const odataQuery = {
      $select: 'id',
      $expand: 'relations',
    } as any;

    await controller.list(odataQuery, {} as any);

    expect(service.getEntityListExtended).toHaveBeenCalledWith(
      expect.objectContaining({
        select: ['id'],
        relations: ['relations'],
      }),
      true, // count defaults to true
    );
  });

  it('maps OData query params without expand parameter', async () => {
    const service = {
      getEntityListExtended: jest.fn().mockResolvedValue(['ok']),
    } as unknown as GenericService<TestEntity>;

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
    });

    const controller = new Controller(service);

    const odataQuery = {
      $select: 'id',
    } as any;

    await controller.list(odataQuery, {} as any);

    expect(service.getEntityListExtended).toHaveBeenCalledWith(
      expect.objectContaining({
        select: ['id'],
      }),
      true,
    );
  });

  it('should throw if create descriptor is missing', () => {
    const orig = Object.getOwnPropertyDescriptor;
    jest.spyOn(Object, 'getOwnPropertyDescriptor').mockImplementation((obj, prop) => {
      if (prop === 'create') return undefined;
      return orig(obj, prop);
    });
    
    expect(() => {
      crudRestControllerFactory<TestEntity>({ entityModel: TestEntity });
    }).toThrow(ReferenceError);
    
    jest.restoreAllMocks();
  });

  it('should throw if update descriptor is missing', () => {
    const orig = Object.getOwnPropertyDescriptor;
    jest.spyOn(Object, 'getOwnPropertyDescriptor').mockImplementation((obj, prop) => {
      if (prop === 'update') return undefined;
      return orig(obj, prop);
    });
    
    expect(() => {
      crudRestControllerFactory<TestEntity>({ entityModel: TestEntity });
    }).toThrow(ReferenceError);
    
    jest.restoreAllMocks();
  });

  it('should throw if remove descriptor is missing', () => {
    const orig = Object.getOwnPropertyDescriptor;
    jest.spyOn(Object, 'getOwnPropertyDescriptor').mockImplementation((obj, prop) => {
      if (prop === 'remove') return undefined;
      return orig(obj, prop);
    });
    
    expect(() => {
      crudRestControllerFactory<TestEntity>({ entityModel: TestEntity });
    }).toThrow(ReferenceError);
    
    jest.restoreAllMocks();
  });

  it('should test factory with readonly', () => {
    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      readonly: true,
    });
    expect(Controller).toBeDefined();
  });

  it('should test factory with serialize', () => {
    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      serialize: true,
    });
    expect(Controller).toBeDefined();
  });

  it('should test factory with mutation decorators', () => {
    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      mutations: {
        create: { decorators: [] },
        update: { decorators: [] },
        delete: { decorators: [] },
      },
    });
    expect(Controller).toBeDefined();
  });

  it('should test factory with mutations disabled', () => {
    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      mutations: {
        create: { disabled: true },
        update: { disabled: true },
        delete: { disabled: true },
      },
    });
    expect(Controller).toBeDefined();
  });

  it('should throw on invalid OData params', async () => {
    const service = {
      getEntityListExtended: jest.fn().mockResolvedValue(['ok']),
    } as unknown as GenericService<TestEntity>;

    const Controller = crudRestControllerFactory<TestEntity>({
      entityModel: TestEntity,
      dto: TestDto,
    });

    const controller = new Controller(service);

    await expect(controller.list({ $top: 'invalid' } as any, {} as any)).rejects.toThrow('Invalid $top value');
    await expect(controller.list({ $skip: '-1' } as any, {} as any)).rejects.toThrow('Invalid $skip value');

    // Test empty string for non-array value (line 47) and asc order (line 79)
    await controller.list({ $skip: '   ', $orderby: 'name asc, id' } as any, {} as any);

    // Test empty orderby segments to skip parsed.length branch
    await controller.list({ $orderby: ' , ' } as any, {} as any);

    // Test Array with undefined for value[0] (line 44)
    await controller.list({ $select: [] } as any, {} as any);
    expect(service.getEntityListExtended).toHaveBeenCalled();
  });
});
