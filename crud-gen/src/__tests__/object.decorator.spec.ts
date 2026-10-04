import { jest } from '@jest/globals';
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { BaseEntity } from 'typeorm';

jest.mock('@nestjs/graphql', () => {
  const actual = jest.requireActual('@nestjs/graphql') as any;
  return {
    __esModule: true,
    ...actual,
    addFieldMetadata: actual.addFieldMetadata, // Ensure it's passed
    GqlExecutionContext: {
      ...actual.GqlExecutionContext,
      create: jest.fn(),
    }
  };
});
import * as graphql from '@nestjs/graphql';
import {
  ModelField,
  CrudGenObject,
  getModelFieldMetadata,
  getCrudGenObjectMetadata,
  hasModelFieldMetadata,
  hasModelFieldMetadataList,
  hasCrudGenObjectMetadata,
  IModelFieldMetadata,
} from '../object.decorator.js';
import { TestEntityDto } from '../__mocks__/entity.mock.js';
import { fixedIncludefilterOption } from '../__mocks__/filter.mocks.js';

const fixedModelFieldMetadata: IModelFieldMetadata = {
  gqlOptions: {},
  gqlType: () => String,
};

describe('ObjectDecorator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should decorate properly a property with ModelField', () => {
    class TestObject {
      @ModelField(fixedModelFieldMetadata)
      decoratedProperty = {};

      property = 'notDecorated';
    }

    expect(hasModelFieldMetadataList(TestObject)).toBeTruthy();

    let metadata = getModelFieldMetadata(TestObject, 'decoratedProperty');
    expect([metadata.dst, metadata.src]).toEqual(
      expect.arrayContaining(['decoratedProperty', 'decoratedProperty']),
    );

    metadata = getModelFieldMetadata(TestObject, 'property');
    expect(hasModelFieldMetadata(TestObject, 'property')).toBeFalsy();
    expect(metadata).toBeUndefined();
  });

  it('Should decorate properly an object with CrudGenObject', () => {
    @CrudGenObject()
    class TestObject {
      decoratedProperty = {};
    }

    expect(hasCrudGenObjectMetadata(TestObject)).toBeTruthy();
  });

  it('Should copy the metadata from an object to another', () => {
    @CrudGenObject({ filters: fixedIncludefilterOption })
    class BaseDecoratedClass {
      @ModelField({})
      baseDecoratedProperty: 'string';
    }

    @CrudGenObject({
      copyFrom: BaseDecoratedClass,
    })
    class TestObject2 {}

    expect(hasCrudGenObjectMetadata(TestObject2)).toBeTruthy();

    const metadata = getCrudGenObjectMetadata(TestObject2);

    expect(metadata).toEqual({
      copyFrom: BaseDecoratedClass,
      filters: fixedIncludefilterOption,
    });
  });

  it('Should decorate properly a property with a custom gqlOptions', () => {
    const metadata = getModelFieldMetadata(TestEntityDto, 'id');
    expect([metadata.dst, metadata.src]).toEqual(
      expect.arrayContaining(['id']),
    );
    expect(hasModelFieldMetadata(TestEntityDto, 'id')).toBeTruthy();
  });

  it('Should ModelField work properly with default values', () => {
    let gqlOptions: FieldOptions | undefined = undefined;
    let gqlType: ReturnTypeFunc | undefined = () => BaseEntity;

    let modelFieldDecorator = ModelField({
      gqlType,
      gqlOptions,
    });

    modelFieldDecorator({}, 'propertyKey');
    gqlOptions = { name: 'name' };
    gqlType = undefined;

    modelFieldDecorator = ModelField({
      gqlType,
      gqlOptions,
    });

    modelFieldDecorator({}, 'propertyKey');
  });

  it('getPrototype and metadata getters should handle primitives and null', () => {
    const { 
      getPrototype, 
      getCrudGenObjectMetadata, 
      getModelFieldMetadataList,
      hasModelObjectMetadata
    } = require('../object.decorator.js');
    
    // line 86
    expect(getPrototype(null as any)).toBe(null);
    const noPrototype = { prototype: undefined };
    expect(getPrototype(noPrototype)).toBe(noPrototype);
    
    const withPrototype = { prototype: { myProp: true } };
    expect(getPrototype(withPrototype as any)).toBe(withPrototype.prototype);

    // lines 139-140
    expect(getModelFieldMetadataList(null as any)).toBeUndefined();
    expect(getModelFieldMetadataList('primitive' as any)).toBeUndefined();

    // line 195
    expect(getCrudGenObjectMetadata(null as any)).toBeUndefined();
    expect(getCrudGenObjectMetadata('primitive' as any)).toBeUndefined();

    // lines 206-207
    expect(hasModelObjectMetadata(null as any)).toBeFalsy();
    expect(hasModelObjectMetadata('primitive' as any)).toBeFalsy();
  });

  it('isDstExtended should correctly identify extended dst', () => {
    const { isDstExtended } = require('../object.decorator.js');
    expect(isDstExtended('string')).toBeFalsy();
    expect(isDstExtended({ name: 'test' })).toBeFalsy();
    expect(isDstExtended({ name: 'test', transformerDst: () => {} })).toBeTruthy();
    expect(isDstExtended({ name: 'test', transformerSrc: () => {} })).toBeTruthy();
  });
});
