import { ClassType } from '@node-yalc/types';
import { AgQueryParams } from './ag-grid.args';
import { SortDirection } from './ag-grid.enum';
export interface SortModel<T = any> {
    colId: keyof T | string;
    sort?: SortDirection;
}
export interface SortModelString<T = any> extends SortModel<T> {
    colId: string;
}
export interface SortModelStrict<T> extends SortModel<T> {
    colId: keyof T;
}
export declare class SortModel<T = any> implements SortModel<T> {
    colId: keyof T | string;
    sort?: SortDirection;
}
export declare function sortModelFactory<Entity>(entityModel: ClassType<Entity>): any;
export declare class RowGroup {
    colId: string;
    aggFunc: string;
}
export declare function filterExpressionInputFactory<Entity>(entityModel: ClassType<Entity>): any;
export declare enum JoinTypes {
    LEFT_JOIN = 0,
    INNER_JOIN = 1
}
export interface JoinArgOptions extends AgQueryParams {
    joinType?: JoinTypes;
}
export declare function agJoinArgFactory<Entity>(entityModel: ClassType<Entity>, defaultValues?: AgQueryParams): any;
