import { DstExtended, isDstExtended, YalcAgGridFieldMetadata, YALC_AGGRID_OBJECT_METADATA_KEY as AGGRID_OBJECT_METADATA_KEY, YALC_AGGRID_FIELD_METADATA_KEY as AGGRID_FIELD_METADATA_KEY, getPrototype, hasYalcAgGridFieldMetadataList as hasAgGridFieldMetadataList, hasYalcAgGridFieldMetadata as hasAgGridFieldMetadata, YalcAgGridObject as AgGridObject, getYalcAgGridObjectMetadata as getAgGridObjectMetadata, hasYalcAgGridObjectMetadata as hasAgGridObjectMetadata, FilterOptionType, FilterOption, YalcAgGridObjectOptions as AgGridObjectOptions, FieldAndFilterMapper } from '@node-yalc/datagrid/object.decorator.js';
import { ClassType } from '@node-yalc/types/globals.js';
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { AgQueryParams } from './ag-grid.args.js';
export { isDstExtended, AGGRID_OBJECT_METADATA_KEY, AGGRID_FIELD_METADATA_KEY, getPrototype, hasAgGridFieldMetadataList, hasAgGridFieldMetadata, AgGridObject, getAgGridObjectMetadata, hasAgGridObjectMetadata, FilterOptionType, };
export type { DstExtended, FilterOption, AgGridObjectOptions, FieldAndFilterMapper };
export type IAgGridFieldMetadata<T = any> = AgGridFieldMetadata<T>;
export interface AgGridFieldMetadata<T = any> extends YalcAgGridFieldMetadata {
    gqlType?: ReturnTypeFunc;
    gqlOptions?: FieldOptions;
    relation?: YalcAgGridFieldMetadata['relation'] & {
        defaultValue?: AgQueryParams<T>;
    };
}
export declare const getAgGridFieldMetadataList: (target: Record<string, unknown> | ClassType) => {
    [key: string]: AgGridFieldMetadata;
} | undefined;
export declare const getAgGridFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string | symbol) => AgGridFieldMetadata | undefined;
export declare const AgGridField: <T = any>({ gqlType, gqlOptions, ...options }?: AgGridFieldMetadata<T>) => PropertyDecorator;
