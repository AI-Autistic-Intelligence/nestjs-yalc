import { describe, expect, it } from '@jest/globals';
import {
  CGQueryDto,
  crudGenRestParamsFactory,
  crudGenRestParamsNoPaginationFactory,
  PaginationDTOMixin,
  PaginatedResultDto,
  sortModelRestFactory,
} from '../api-rest/crud-gen-rest.dto.js';
import { RowDefaultValues, SortDirection } from '../crud-gen.enum.js';

class SampleEntity {
  id!: string;
  name!: string;
}

describe('crud-gen REST DTO helpers', () => {
  it('crudGenRestParamsFactory should provide classes with defaults', () => {
    const Params = crudGenRestParamsFactory(undefined, SampleEntity);
    const instance = new Params();

    expect(instance.startRow).toBe(RowDefaultValues.START_ROW);
    expect(instance.endRow).toBe(RowDefaultValues.END_ROW);
  });

  it('crudGenRestParamsNoPaginationFactory should keep provided defaults', () => {
    const Params = crudGenRestParamsNoPaginationFactory(
      { sorting: [{ colId: 'id', sort: SortDirection.DESC } as any] },
      SampleEntity,
    );
    const instance = new Params();

    expect(instance.sorting?.[0]?.sort).toBe(SortDirection.DESC);
  });

  it('PaginationDTOMixin should apply defaults on derived classes', () => {
    const Pagination = PaginationDTOMixin();
    const pagination = new Pagination();

    expect(pagination.startRow).toBe(RowDefaultValues.START_ROW);
    expect(pagination.endRow).toBe(RowDefaultValues.END_ROW);
  });

  it('sortModelRestFactory should cache per-entity models', () => {
    const SortModel = sortModelRestFactory(SampleEntity);
    const anotherCall = sortModelRestFactory(SampleEntity);

    expect(SortModel).toBe(anotherCall);
    const sortModel = new SortModel();
    expect(sortModel.sort).toBe(SortDirection.ASC);
  });

  it('CGQueryDto should inherit pagination defaults', () => {
    const dto = new CGQueryDto();
    expect(dto.startRow).toBe(RowDefaultValues.START_ROW);
    expect(dto.endRow).toBe(RowDefaultValues.END_ROW);
  });

  it('PaginatedResultDto should expose list and pageData', () => {
    const dto = new PaginatedResultDto(
      [{ id: '1' }],
      { count: 1, startRow: 0, endRow: 1 },
    );

    expect(dto.list).toHaveLength(1);
    expect(dto.pageData.count).toBe(1);
  });

  it('crudGenRestParamsFactory without entityModel should use SortModelRest', () => {
    const Params = crudGenRestParamsFactory();
    const instance = new Params();
    expect(instance.startRow).toBe(RowDefaultValues.START_ROW);
  });

  it('crudGenRestParamsNoPaginationFactory without entityModel should use SortModelRest', () => {
    const Params = crudGenRestParamsNoPaginationFactory();
    const instance = new Params();
    expect(instance).toBeDefined();
  });
  it('crudGenRestParamsFactory should use provided defaults', () => {
    const Params = crudGenRestParamsFactory({ startRow: 10, endRow: 20 });
    const instance = new Params();
    expect(instance.startRow).toBe(10);
    expect(instance.endRow).toBe(20);
  });

  it('crudGenRestParamsNoPaginationFactory should handle missing sorting and filters', () => {
    const Params = crudGenRestParamsNoPaginationFactory({ sorting: undefined, filters: undefined });
    const instance = new Params();
    expect(instance.sorting).toBeUndefined();
    expect(instance.filters).toBeUndefined();
  });

  it('PaginationDTOMixin should handle undefined base', () => {
    const Pagination = PaginationDTOMixin(undefined);
    const pagination = new Pagination();
    expect(pagination.startRow).toBe(RowDefaultValues.START_ROW);
  });

  it('PaginationDTOMixin should allow providing values in derived class', () => {
    const Pagination = PaginationDTOMixin();
    const pagination = new Pagination();
    pagination.startRow = 5;
    pagination.endRow = 15;
    expect(pagination.startRow).toBe(5);
    expect(pagination.endRow).toBe(15);
  });
});
