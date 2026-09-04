jest.mock('@nestjs/graphql', () => {
  const actual = jest.requireActual('@nestjs/graphql');
  return {
    ...actual,
    Field: jest.fn().mockReturnValue(jest.fn()),
  };
});

import {
  AgGridField,
  AgGridObject,
  getAgGridFieldMetadata,
  getAgGridObjectMetadata,
  hasAgGridFieldMetadata,
  hasAgGridFieldMetadataList,
  hasAgGridObjectMetadata,
  IAgGridFieldMetadata,
} from '../object.decorator';
import { TestEntityDto } from '../__mocks__/entity.mock';
import { fixedIncludefilterOption } from '../__mocks__/filter.mocks';
import * as ObjectDecorator from '../object.decorator';

import * as NestGraphql from '@nestjs/graphql';
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { BaseEntity } from 'typeorm';

const fixedAgGridFieldMetadata: IAgGridFieldMetadata = {
  gqlOptions: {},
  gqlType: () => String,
};

describe('ObjectDecorator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should decorate properly a property with AgGridField', () => {
    class TestObject {
      @AgGridField(fixedAgGridFieldMetadata)
      decoratedProperty = {};

      property = 'notDecorated';
    }

    expect(hasAgGridFieldMetadataList(TestObject)).toBeTruthy();

    let metadata = getAgGridFieldMetadata(TestObject, 'decoratedProperty');
    expect([metadata.dst, metadata.src]).toEqual(
      expect.arrayContaining(['decoratedProperty', 'decoratedProperty']),
    );

    metadata = getAgGridFieldMetadata(TestObject, 'property');
    expect(hasAgGridFieldMetadata(TestObject, 'property')).toBeFalsy();
    expect(metadata).toBeUndefined();
  });

  it('Should decorate properly an object with AgGridObject', () => {
    @AgGridObject()
    class TestObject {
      decoratedProperty = {};
    }

    expect(hasAgGridObjectMetadata(TestObject)).toBeTruthy();
  });

  it('Should copy the metadata from an object to another', () => {
    @AgGridObject({ filters: fixedIncludefilterOption })
    class BaseDecoratedClass {
      @AgGridField({})
      baseDecoratedProperty: 'string';
    }

    @AgGridObject({
      copyFrom: BaseDecoratedClass,
    })
    class TestObject2 {}

    expect(hasAgGridObjectMetadata(TestObject2)).toBeTruthy();

    const metadata = getAgGridObjectMetadata(TestObject2);

    expect(metadata).toEqual({
      copyFrom: BaseDecoratedClass,
      filters: fixedIncludefilterOption,
    });
  });

  it('Should decorate properly a property with a custom gqlOptions', () => {
    const metadata = getAgGridFieldMetadata(TestEntityDto, 'id');
    expect([metadata.dst, metadata.src]).toEqual(
      expect.arrayContaining(['id']),
    );
    expect(hasAgGridFieldMetadata(TestEntityDto, 'id')).toBeTruthy();
  });

  it('Should AgGridField work properly with default values', () => {

    const mockedNestGraphql = NestGraphql as jest.Mocked<typeof NestGraphql>;
    const mockFieldDecorator = jest.fn();
    (mockedNestGraphql.Field as jest.Mock).mockReturnValue(mockFieldDecorator);

    let gqlOptions: FieldOptions | undefined = undefined;
    let gqlType: ReturnTypeFunc | undefined = () => BaseEntity;

    let agGridFieldDecorator = AgGridField({
      gqlType,
      gqlOptions,
    });

    agGridFieldDecorator({}, 'propertyKey');

    expect(mockedNestGraphql.Field).toHaveBeenCalledWith(gqlType, gqlOptions);
    expect(mockFieldDecorator).toHaveBeenCalledWith({}, 'propertyKey');

    gqlOptions = { name: 'name' };
    gqlType = undefined;
    mockFieldDecorator.mockClear();
    (mockedNestGraphql.Field as jest.Mock).mockClear();

    agGridFieldDecorator = AgGridField({
      gqlType,
      gqlOptions,
    });

    agGridFieldDecorator({}, 'propertyKey');
    expect(mockedNestGraphql.Field).toHaveBeenCalledWith(gqlOptions);
    expect(mockFieldDecorator).toHaveBeenCalledWith({}, 'propertyKey');
  });
});
