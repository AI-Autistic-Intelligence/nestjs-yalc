import { jest } from '@jest/globals';
import { BaseEntity } from 'typeorm';

import * as CrudGenHelper from '../crud-gen.helpers.js';

import { entityFieldsEnumGqlFactory } from '../api-graphql/crud-gen-gql.enum.js';
import { ModelField } from '../object.decorator.js';

const fixedProperty = 'columId';

describe('entityFieldsEnumFactory', () => {
  let fieldsEnum;
  let EntityModel: any;

  beforeAll(() => {
    EntityModel = class extends BaseEntity {
      @ModelField({})
      [fixedProperty]: number;
    };

    fieldsEnum = entityFieldsEnumGqlFactory(EntityModel);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a defined enum fields not cached', () => {
    expect(fieldsEnum).toBeDefined();
  });

  it('should return a define enum from cache', () => {
    const cachedFildsEnum = entityFieldsEnumGqlFactory(EntityModel);
    expect(cachedFildsEnum).toStrictEqual(fieldsEnum);
  });

  it('should work with entityModel as a function', () => {
    function objectFunction() {
      this.value = 'value';
    }
    const result = entityFieldsEnumGqlFactory(objectFunction);
    expect(result).toBeDefined();
  });
});
