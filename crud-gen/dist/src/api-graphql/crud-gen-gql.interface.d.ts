import { IFieldMapper } from '@nest-yalc-2/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals';
import { ExecutionContext } from '@nestjs/common';
import { ArgsOptions, ReturnTypeFuncValue } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { FindManyOptions, FindOneOptions, FindOperator, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { ExtraArgsStrategy, FilterType, GeneralFilters, Operators, SortDirection } from '../crud-gen.enum.js';
import { IKeyMeta, IWhereCondition } from './crud-gen-gql.type.js';
import { IModelFieldAndFilterMapper } from '../object.decorator.js';
export interface IBaseFilterModel {
    filterType: FilterType;
    field: string;
}
export interface ISimpleFilterModel extends IBaseFilterModel {
    type: GeneralFilters;
    filter?: string | number;
}
export interface ITextFilterModel extends ISimpleFilterModel {
    filterType: FilterType.TEXT;
    type: GeneralFilters;
    filter?: string;
}
export interface ISetFilterModel extends IBaseFilterModel {
    filterType: FilterType.SET;
    values: (string | number)[];
}
export interface INumberFilterModel extends ISimpleFilterModel {
    filterType: FilterType.NUMBER;
    type: GeneralFilters;
    filter?: number;
    filterTo?: number;
}
export interface DateFilterModel extends ISimpleFilterModel {
    filterType: FilterType.DATE;
    type: GeneralFilters;
    dateFrom?: string;
    dateTo?: string;
}
export type GenericFilterModel = ISimpleFilterModel | ITextFilterModel | INumberFilterModel;
export type FilterModel = GenericFilterModel | DateFilterModel | ISetFilterModel;
export interface ICombinedSimpleModel {
    filterType: FilterType;
    operator: Operators;
    condition1: FilterModel;
    condition2: FilterModel;
}
export type FilterInputStrict = (FilterModel | ICombinedSimpleModel)[];
export interface IMultiColumnProperty {
    multiColumnJoinOptions?: IMultiColumnJoinOptions;
}
export interface IMultiColumnObject extends IMultiColumnProperty {
    multiColumnJoinOperator: Operators;
}
export type IFilterInputOld = {
    [key: string]: FilterModel | ICombinedSimpleModel | IMultiColumnJoinOptions | undefined;
} & IMultiColumnProperty;
export interface ITextFilter {
    [FilterType.TEXT]: ITextFilterModel;
}
export interface INumberFilter {
    [FilterType.NUMBER]: INumberFilterModel;
}
export interface IDateFilter {
    [FilterType.DATE]: DateFilterModel;
}
export interface ISetFilter {
    [FilterType.SET]: ISetFilterModel;
}
export interface IFilterExpressionsProperty {
    [FilterType.TEXT]?: ITextFilterModel;
    [FilterType.NUMBER]?: INumberFilterModel;
    [FilterType.DATE]?: DateFilterModel;
    [FilterType.SET]?: ISetFilterModel;
    [FilterType.MULTI]?: never;
}
export type FilterExpressionType = ITextFilter | INumberFilter | IDateFilter | ISetFilter;
export interface FilterInput {
    operator?: Operators;
    expressions?: IFilterExpressionsProperty[];
    childExpressions?: FilterInput[];
}
export interface ICrudGenFindExtraOptions {
    rawLimit?: boolean;
    skipCount?: boolean;
    args?: {
        [index: string]: any;
    };
    _fieldMapper?: IFieldMapper;
    _keysMeta?: {
        [key: string]: IKeyMeta;
    };
    _aliasType?: string;
}
export interface CrudGenFindManyOptions<T extends ObjectLiteral = any> extends Omit<FindManyOptions<T>, 'where'> {
    where?: IWhereCondition<T>;
    info?: GraphQLResolveInfo;
    extra?: ICrudGenFindExtraOptions;
    subQueryFilters?: CrudGenFindManyOptions<T>;
}
export type IMultiColumnJoinOptions = {
    [key: string]: FilterModel | ICombinedSimpleModel | IMultiColumnJoinOptions | Operators | undefined;
} & IMultiColumnObject;
export interface ICombinedWhereModel {
    operator: Operators;
    filter_1: FindOperator<string | number | Date | null> | ICombinedWhereModel;
    filter_2: FindOperator<string | number | Date | null> | ICombinedWhereModel;
}
export interface IBaseArg {
    filterMiddleware?: {
        (ctx: ExecutionContext, filterValue?: any): any;
    };
    hidden?: boolean;
}
export interface IIDArg extends IBaseArg {
    name: string;
}
export interface IExtraArg extends IBaseArg {
    options?: ArgsOptions;
    filterType: FilterType;
    filterCondition: GeneralFilters;
}
export interface ICrudGenArgsSingleOptions {
    fieldMap?: IFieldMapper | IModelFieldAndFilterMapper;
    fieldType?: ClassType | ReturnTypeFuncValue;
    entityType?: ClassType;
}
export interface IGqlArgsOptions {
    gql?: ArgsOptions;
}
export interface ICrudGenArgsOptions extends ICrudGenArgsSingleOptions {
    defaultValue?: ICrudGenBaseParams;
    options?: {
        maxRow: number;
    };
}
export interface ICrudGenGqlArgsSingleOptions extends ICrudGenArgsSingleOptions, IGqlArgsOptions {
}
export interface ICrudGenGqlArgsOptions extends ICrudGenArgsOptions, IGqlArgsOptions {
    extraArgsStrategy?: ExtraArgsStrategy;
    extraArgs?: {
        [index: string]: IExtraArg;
    };
}
export interface ICrudGenPaginationParams {
    startRow?: number;
    endRow?: number;
}
export interface ICrudGenBaseParams<T = any> extends ICrudGenPaginationParams {
    [index: string]: any;
    sorting?: ISortModelStrict<T>[];
    join?: {
        [index: string]: JoinArgOptions;
    };
    filters?: FilterInput;
}
export interface ICrudGenSimpleParams<T = any> extends ICrudGenPaginationParams, Omit<FindOneOptions<T>, 'where' | 'join' | 'order' | 'skip' | 'take'> {
    where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
    sorting?: ISortModelStrict<T>[];
}
export interface ISortModel<T = any> {
    colId: keyof T | string;
    sort?: SortDirection;
}
export interface ISortModelString<T = any> extends ISortModel<T> {
    colId: string;
}
export interface ISortModelStrict<T> extends ISortModel<T> {
    colId: keyof T;
}
export declare enum JoinTypes {
    LEFT_JOIN = 0,
    INNER_JOIN = 1
}
export interface JoinArgOptions extends ICrudGenBaseParams {
    joinType?: JoinTypes;
}
