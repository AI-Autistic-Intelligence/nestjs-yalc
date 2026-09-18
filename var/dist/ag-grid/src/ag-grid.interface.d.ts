import { FieldMapper } from '@node-yalc/interfaces/maps.interface';
import { ClassType } from '@node-yalc/types';
import { ArgsOptions, GqlExecutionContext, ReturnTypeFuncValue } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { FindManyOptions, FindOperator } from 'typeorm';
import { AgQueryParams } from './ag-grid.args';
import { ExtraArgsStrategy, FilterType, GeneralFilters, Operators } from './ag-grid.enum';
import { WhereCondition } from './ag-grid.type';
import type { KeyMeta } from './gqlfields.decorator';
import { FieldAndFilterMapper } from './object.decorator';
export interface BaseFilterModel {
    filterType: FilterType;
    field: string;
}
export interface SimpleFilterModel extends BaseFilterModel {
    type: GeneralFilters;
    filter?: string | number;
}
export interface TextFilterModel extends SimpleFilterModel {
    filterType: FilterType.TEXT;
    type: GeneralFilters;
    filter?: string;
}
export interface SetFilterModel extends BaseFilterModel {
    filterType: FilterType.SET;
    values: (string | number)[];
}
export interface NumberFilterModel extends SimpleFilterModel {
    filterType: FilterType.NUMBER;
    type: GeneralFilters;
    filter?: number;
    filterTo?: number;
}
export interface DateFilterModel extends SimpleFilterModel {
    filterType: FilterType.DATE;
    type: GeneralFilters;
    dateFrom?: string;
    dateTo?: string;
}
export type GenericFilterModel = SimpleFilterModel | TextFilterModel | NumberFilterModel;
export type FilterModel = GenericFilterModel | DateFilterModel | SetFilterModel;
export interface CombinedSimpleModel {
    filterType: FilterType;
    operator: Operators;
    condition1: FilterModel;
    condition2: FilterModel;
}
export type FilterInputStrict = (FilterModel | CombinedSimpleModel)[];
export interface MultiColumnProperty {
    multiColumnJoinOptions?: MultiColumnJoinOptions;
}
export interface MultiColumnObject extends MultiColumnProperty {
    multiColumnJoinOperator: Operators;
}
export type FilterInputOld = {
    [key: string]: FilterModel | CombinedSimpleModel | MultiColumnJoinOptions | undefined;
} & MultiColumnProperty;
export interface TextFilter {
    [FilterType.TEXT]: TextFilterModel;
}
export interface NumberFilter {
    [FilterType.NUMBER]: NumberFilterModel;
}
export interface DateFilter {
    [FilterType.DATE]: DateFilterModel;
}
export interface SetFilter {
    [FilterType.SET]: SetFilterModel;
}
export interface FilterExpressionsProperty {
    [FilterType.TEXT]?: TextFilterModel;
    [FilterType.NUMBER]?: NumberFilterModel;
    [FilterType.DATE]?: DateFilterModel;
    [FilterType.SET]?: SetFilterModel;
    [FilterType.MULTI]?: never;
}
export type FilterExpressionType = TextFilter | NumberFilter | DateFilter | SetFilter;
export interface FilterInput {
    operator?: Operators;
    expressions?: FilterExpressionsProperty[];
    childExpressions?: FilterInput[];
}
export interface AgGridFindExtraOptions {
    rawLimit?: boolean;
    skipCount?: boolean;
    args?: {
        [index: string]: unknown;
    };
    _fieldMapper?: FieldMapper;
    _keysMeta?: {
        [key: string]: KeyMeta;
    };
    _aliasType?: string;
}
export interface AgGridFindManyOptions<T = unknown> extends Omit<FindManyOptions<T>, 'where'> {
    where?: WhereCondition;
    info?: GraphQLResolveInfo;
    extra?: AgGridFindExtraOptions;
    subQueryFilters?: AgGridFindManyOptions<T>;
}
export type MultiColumnJoinOptions = {
    [key: string]: FilterModel | CombinedSimpleModel | MultiColumnJoinOptions | Operators | undefined;
} & MultiColumnObject;
export interface CombinedWhereModel {
    operator: Operators;
    filter_1: FindOperator<string | number | Date | null> | CombinedWhereModel;
    filter_2: FindOperator<string | number | Date | null> | CombinedWhereModel;
}
export interface BaseArg {
    filterMiddleware?: {
        (ctx: GqlExecutionContext, filterValue?: unknown): unknown;
    };
    hidden?: boolean;
}
export interface DArg extends BaseArg {
    name: string;
}
export interface ExtraArg extends BaseArg {
    options?: ArgsOptions;
    filterType: FilterType;
    filterCondition: GeneralFilters;
}
export interface AgGridArgsSingleOptions {
    gql?: ArgsOptions;
    fieldMap?: FieldMapper | FieldAndFilterMapper;
    fieldType?: ClassType | ReturnTypeFuncValue;
    entityType?: ClassType;
}
export interface AgGridArgsOptions extends AgGridArgsSingleOptions {
    defaultValue?: AgQueryParams;
    extraArgsStrategy?: ExtraArgsStrategy;
    extraArgs?: {
        [index: string]: ExtraArg;
    };
    options?: {
        maxRow: number;
    };
}
