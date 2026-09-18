import { BaseEntity } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { AgGridRepository } from '@nest-yalc-2/ag-grid/ag-grid.repository';
import { AgGridField, AgGridObject } from '../object.decorator';
import { JsonTransformer } from '../transformer.helper';

@AgGridObject({})
export class ReadEntity {
  @AgGridField({
    dst: {
      name: 'jsonProperty',
      transformer: JsonTransformer('data', 'sub.jsonProperty'),
    },
  })
  jsonProperty: string;

  @AgGridField({})
  noTransform: string;

  // should never happen
  @AgGridField({ dst: undefined })
  noDest: string;
}

export class WriteEntity {
  data: string;
}

export class MockedEntity extends BaseEntity {}

export const baseEntityRepository =
  createMock<AgGridRepository<MockedEntity>>();
