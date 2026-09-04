import { BaseEntity, Column } from 'typeorm';
import { entityFieldsEnumFactory } from '../ag-grid.enum';
import { AgGridField } from '../object.decorator';

const fixedProperty = 'columId';

class TestEntity extends BaseEntity {
  @Column()
  @AgGridField()
  [fixedProperty]: number;
}

describe('entityFieldsEnumFactory', () => {
  let fieldsEnum;

  beforeEach(() => {
    fieldsEnum = entityFieldsEnumFactory(TestEntity);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a defined enum fields not cached', () => {
    expect(fieldsEnum).toBeDefined();
    expect(fieldsEnum[fixedProperty]).toBeDefined();
  });

  it('should return a define enum from cache', () => {
    const cachedFildsEnum = entityFieldsEnumFactory(TestEntity);
    expect(cachedFildsEnum).toStrictEqual(fieldsEnum);
  });

  it('should work with entityModel as a function', () => {
    function objectFunction() {
      this.value = 'value';
    }
    const result = entityFieldsEnumFactory(objectFunction);
    expect(result).toBeDefined();
  });
});
