import { BaseEntity } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { CGExtendedRepository } from '@nest-yalc-2/crud-gen/crud-gen.repository.js';
import { ModelField, ModelObject } from '../object.decorator.js';
import { JsonTransformer } from '../transformers.helpers.js';

@ModelObject({})
export class ReadEntity {
  @ModelField({
    dst: {
      name: 'data',
      transformerDst: JsonTransformer('data', 'sub.jsonProperty'),
    },
  })
  jsonProperty: string;

  @ModelField({})
  noTransform: string;

  @ModelField({ dst: 'renamed' })
  simpleRename: string;

  // should never happen
  @ModelField({ dst: undefined })
  noDest: string;
}

export class WriteEntity {
  data: Record<string, unknown>;
  renamed: string;
}

export class MockedEntity extends BaseEntity {}

export const baseEntityRepository =
  createMock<CGExtendedRepository<MockedEntity>>();
