import { FieldMapperProperty, FieldMapper } from '@nestjs-yalc/interfaces';
import { ClassType } from '@nestjs-yalc/types/globals';
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import 'reflect-metadata';
import { RelationType } from 'typeorm/metadata/types/RelationTypes';
import { AgQueryParams } from './ag-grid.args';
export interface DstExtended {
    name: string;
    transformer: {
        (dstObj: Record<any, any>, srcValue: any): void;
    };
}
export declare function isDstExtended(dst: string | DstExtended): dst is DstExtended;
export interface AgGridFieldMetadata<T = any> extends Omit<FieldMapperProperty, 'dst'> {
    dst?: string | DstExtended;
    src?: string;
    mode?: 'derived' | 'regular' | 'virtual';
    gqlType?: ReturnTypeFunc;
    gqlOptions?: FieldOptions;
    relation?: {
        defaultValue?: AgQueryParams<T>;
        sourceKey: {
            dst: string;
            alias: string;
        };
        targetKey: {
            dst: string;
            alias: string;
        };
        relationType: RelationType;
        type: {
            (): ClassType;
        };
    };
    _propertyName?: string;
}
export declare const AGGRID_OBJECT_METADATA_KEY: unique symbol;
export declare const AGGRID_FIELD_METADATA_KEY: unique symbol;
export declare function getPrototype(target: Record<string, unknown> | ClassType): any;
export declare const AgGridField: <T = any>({ gqlType, gqlOptions, ...options }: AgGridFieldMetadata<T>) => PropertyDecorator;
export declare const getAgGridFieldMetadataList: (target: Record<string, unknown> | ClassType) => {
    [key: string]: AgGridFieldMetadata;
} | undefined;
export declare const hasAgGridFieldMetadataList: (target: Record<string, unknown> | ClassType) => boolean;
export declare const getAgGridFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string | symbol) => AgGridFieldMetadata | undefined;
export declare const hasAgGridFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string) => boolean;
export declare const AgGridObject: (options?: AgGridObjectOptions) => ClassDecorator;
export declare const getAgGridObjectMetadata: (target: Record<string, unknown> | ClassType) => FilterOption;
export declare const hasAgGridObjectMetadata: (target: Record<string, unknown> | ClassType) => boolean;
export declare enum FilterOptionType {
    INCLUDE = "include",
    EXCLUDE = "exclude"
}
export type FilterOption = {
    type: FilterOptionType;
    fields: string[];
};
export type AgGridObjectOptions = {
    copyFrom?: ClassType;
    filters?: FilterOption;
};
export interface FieldAndFilterMapper {
    field: FieldMapper;
    filterOption?: FilterOption;
    extraInfo?: {
        [key: string]: any;
    };
}
