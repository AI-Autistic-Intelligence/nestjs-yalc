import { FieldMapperProperty, IFieldMapper } from '@nest-yalc-2/interfaces';
import { ClassType } from '@node-yalc/types/globals';
import { FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import 'reflect-metadata';
import { RelationType } from 'typeorm/metadata/types/RelationTypes.js';
import { ICrudGenBaseParams } from './api-graphql/crud-gen-gql.interface.js';
export interface DstExtended<TSrc = Record<any, any>, TDst = Record<any, any>> {
    name: string;
    transformerSrc?: {
        (dstObj: TDst, srcValue: any): any;
    };
    transformerDst?: {
        (srcObj: TSrc, dstValue: any): any;
    };
}
export declare function isDstExtended(dst: string | DstExtended): dst is DstExtended;
export interface IModelFieldMetadata<T = any> extends Omit<FieldMapperProperty, 'dst'> {
    dst?: string | DstExtended;
    src?: string;
    mode?: 'derived' | 'regular' | 'virtual';
    gqlType?: ReturnTypeFunc;
    gqlOptions?: FieldOptions;
    relation?: {
        defaultValue?: ICrudGenBaseParams<T>;
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
export declare const CRUDGEN_OBJECT_METADATA_KEY: unique symbol;
export declare const CRUDGEN_FIELD_METADATA_KEY: unique symbol;
export declare function getPrototype(target: Record<string, unknown> | ClassType): any;
export declare const ModelField: <T = any>({ gqlType, gqlOptions, ...options }: IModelFieldMetadata<T>) => PropertyDecorator;
export type IModelFieldMetadataList<T = any> = {
    [key: string]: IModelFieldMetadata<T>;
};
export declare const getModelFieldMetadataList: <T = any>(target: Record<string, unknown> | ClassType) => IModelFieldMetadataList<T> | undefined;
export declare const hasModelFieldMetadataList: (target: Record<string, unknown> | ClassType) => boolean;
export declare const getModelFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string | symbol) => IModelFieldMetadata | undefined;
export declare const hasModelFieldMetadata: (target: Record<string, unknown> | ClassType, propertyName: string) => boolean;
export declare const ModelObject: (options?: ModelObjectOptions) => ClassDecorator;
export declare const getModelObjectMetadata: (target: Record<string, unknown> | ClassType) => FilterOption | undefined;
export declare const hasModelObjectMetadata: (target: Record<string, unknown> | ClassType) => boolean;
export declare const CrudGenObject: (options?: ModelObjectOptions) => ClassDecorator;
export declare const getCrudGenObjectMetadata: (target: Record<string, unknown> | ClassType) => FilterOption | undefined;
export declare const hasCrudGenObjectMetadata: (target: Record<string, unknown> | ClassType) => boolean;
export declare enum FilterOptionType {
    INCLUDE = "include",
    EXCLUDE = "exclude"
}
export type FilterOption = {
    type: FilterOptionType;
    fields: string[];
};
export type ModelObjectOptions = {
    copyFrom?: ClassType;
    filters?: FilterOption;
};
export interface IModelFieldAndFilterMapper {
    field: IFieldMapper;
    filterOption?: FilterOption;
    extraInfo?: {
        [key: string]: any;
    };
}
