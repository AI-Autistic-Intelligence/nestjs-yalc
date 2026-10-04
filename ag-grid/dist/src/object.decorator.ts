import {
  DstExtended,
  isDstExtended,
  YalcAgGridFieldMetadata,
  YALC_AGGRID_OBJECT_METADATA_KEY as AGGRID_OBJECT_METADATA_KEY,
  YALC_AGGRID_FIELD_METADATA_KEY as AGGRID_FIELD_METADATA_KEY,
  getPrototype,
  YalcAgGridField,
  getYalcAgGridFieldMetadataList as _getAgGridFieldMetadataList,
  hasYalcAgGridFieldMetadataList as hasAgGridFieldMetadataList,
  getYalcAgGridFieldMetadata as _getAgGridFieldMetadata,
  hasYalcAgGridFieldMetadata as hasAgGridFieldMetadata,
  YalcAgGridObject as AgGridObject,
  getYalcAgGridObjectMetadata as getAgGridObjectMetadata,
  hasYalcAgGridObjectMetadata as hasAgGridObjectMetadata,
  FilterOptionType,
  FilterOption,
  YalcAgGridObjectOptions as AgGridObjectOptions,
  FieldAndFilterMapper
} from '@node-yalc/datagrid/object.decorator.js';
import { ClassType } from '@node-yalc/types/globals.js';
import { Field, FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { AgQueryParams } from './ag-grid.args.js';

export {
  isDstExtended,
  AGGRID_OBJECT_METADATA_KEY,
  AGGRID_FIELD_METADATA_KEY,
  getPrototype,
  hasAgGridFieldMetadataList,
  hasAgGridFieldMetadata,
  AgGridObject,
  getAgGridObjectMetadata,
  hasAgGridObjectMetadata,
  FilterOptionType,
};

export type {
  DstExtended,
  FilterOption,
  AgGridObjectOptions,
  FieldAndFilterMapper
};

export type IAgGridFieldMetadata<T = any> = AgGridFieldMetadata<T>;

export interface AgGridFieldMetadata<T = any> extends YalcAgGridFieldMetadata {
  gqlType?: ReturnTypeFunc;
  gqlOptions?: FieldOptions;
  relation?: YalcAgGridFieldMetadata['relation'] & {
    defaultValue?: AgQueryParams<T>;
  };
}

export const getAgGridFieldMetadataList = (
  target: Record<string, unknown> | ClassType,
): { [key: string]: AgGridFieldMetadata } | undefined => {
  return _getAgGridFieldMetadataList<AgGridFieldMetadata>(target);
};

export const getAgGridFieldMetadata = (
  target: Record<string, unknown> | ClassType,
  propertyName: string | symbol,
): AgGridFieldMetadata | undefined => {
  return _getAgGridFieldMetadata<AgGridFieldMetadata>(target, propertyName);
};

export const AgGridField = <T = any>({
  gqlType,
  gqlOptions,
  ...options
}: AgGridFieldMetadata<T> = {} as any): PropertyDecorator => {
  return (target: any, property: string | symbol) => {
    // Call the base YalcAgGridField to set metadata
    YalcAgGridField({
      ...options,
      src: gqlOptions?.name ?? options.src ?? property.toString(),
    })(target, property);

    // graphql field metadata
    if (gqlOptions || gqlType) {
      if (gqlType) {
        Field(gqlType, gqlOptions)(target, property);
      } else {
        Field(gqlOptions!)(target, property);
      }
    }
  };
};
