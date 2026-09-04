import { Type } from '@nestjs/common';
import { FindManyOptions, FindOperator } from 'typeorm';
import { ExtraArg, CombinedWhereModel } from './ag-grid.interface';
import { Operators } from './ag-grid.enum';
export declare class PageDataAgGrid {
    count: number;
    startRow: number;
    endRow: number;
}
export interface Connection {
    name: string;
    nodes: unknown[];
    pageData: PageDataAgGrid;
}
export declare const typeMap: {
    [key: string]: {
        new (name: string): Connection;
    };
};
export default function AgGridGqlType<T>(type: Type<T>): unknown;
export type findOperatorTypes = string | number | Date | undefined | null;
export interface GqlSelectedFields<T> {
    fields: (keyof T)[];
}
export interface AgGridArgs<T> extends FindManyOptions, GqlSelectedFields<T> {
}
export interface RecursiveFindOperator<T> {
    [index: number]: RecursiveFindOperator<T> | FindOperator<T>;
    length: number;
}
export interface RecursiveAndFindOperator<T> {
    condition_1?: RecursiveAndFindOperator<T> | FindOperator<T>;
    condition_2?: RecursiveAndFindOperator<T> | FindOperator<T>;
}
export type WhereConditionType = FindOperator<findOperatorTypes> | FindOperator<findOperatorTypes>[] | RecursiveFindOperator<findOperatorTypes> | RecursiveFindOperator<findOperatorTypes>[] | RecursiveAndFindOperator<findOperatorTypes> | RecursiveAndFindOperator<findOperatorTypes>[] | CombinedWhereModel;
export type WhereFilters = {
    [key: string]: WhereConditionType;
};
export interface WhereCondition {
    operator?: Operators;
    filters: WhereFilters;
    childExpressions?: WhereCondition[];
}
export interface FilterArg {
    key: string;
    value: findOperatorTypes;
    descriptors?: ExtraArg;
}
export interface Select {
    field: string;
    isRaw?: boolean;
    isNested?: boolean;
}
