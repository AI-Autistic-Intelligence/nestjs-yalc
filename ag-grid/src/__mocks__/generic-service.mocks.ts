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
  // @ts-ignore
  jsonProperty: string;

  @AgGridField({})
  // @ts-ignore
  noTransform: string;

  // should never happen
  // @ts-ignore
  @AgGridField({ dst: undefined })
  // @ts-ignore
  noDest: string;
}

export class WriteEntity {
  // @ts-ignore
  data: string;
}

export class MockedEntity extends BaseEntity {}

export const baseEntityRepository: any =
  createMock<AgGridRepository<MockedEntity>>();
