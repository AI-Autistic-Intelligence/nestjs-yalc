import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { FilterType } from './ag-grid.enum';
import { JoinArgOptions } from './ag-grid.input';
import { AgGridFindManyOptions, ExtraArg, FilterInput } from './ag-grid.interface';
import { FilterArg, findOperatorTypes, WhereCondition, WhereFilters } from './ag-grid.type';
import { AgGridFieldMetadata } from './object.decorator';
export declare const forceFilters: (where: WhereCondition | string | undefined, properties: FilterArg[], fieldMap: FieldMapper | undefined) => WhereCondition;
export declare const forceFilterWorker: (where: WhereCondition | undefined, target: string, value: findOperatorTypes, descriptors?: ExtraArg) => WhereCondition;
export declare function whereObjectToSqlString<Entity extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<Entity> | undefined, where: WhereCondition, alias?: string, fieldMap?: {
    parent: FieldMapper;
    joined: FieldMapper | {
        [key: string]: FieldMapper;
    };
}): string;
export declare const isAskingForCount: (info: GraphQLResolveInfo) => boolean;
export declare function filterTypeToNativeType(type: FilterType): DateConstructor | ArrayConstructor | StringConstructor | NumberConstructor;
export declare function applyJoinArguments(findManyOptions: AgGridFindManyOptions, alias: string, join: {
    [index: string]: JoinArgOptions;
}, fieldMapper: {
    [key: string]: AgGridFieldMetadata;
}): void;
export declare function isFilterExpressionInput(filterInput: any): filterInput is FilterInput;
export declare function traverseFiltersAndApplyFunction(where: WhereCondition, callback: {
    (value: WhereFilters, key: string): void;
}): void;
export declare function formatRawSelection(selection: string, fieldName: string, prefix?: string, onlyAlias?: boolean): string;
export declare function applySelectOnFind<T = any>(findOptions: AgGridFindManyOptions, field: keyof T, fieldMapper: {
    [key: string]: AgGridFieldMetadata;
}, alias?: string, path?: string): void;
