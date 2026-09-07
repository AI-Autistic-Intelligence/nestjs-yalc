import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { SortDirection } from '../crud-gen.enum.js';
import { ICrudGenBaseParams, ISortModel } from './crud-gen-gql.interface.js';
export { JoinTypes } from './crud-gen-gql.interface.js';
export declare class SortModel<T = any> implements ISortModel<T> {
    colId: string;
    sort: SortDirection;
}
export declare function sortModelFactory<Entity>(entityModel: ClassType<Entity>): any;
export declare class RowGroup {
    colId: string;
    aggFunc: string;
}
export declare function filterExpressionInputFactory<Entity>(entityModel: ClassType<Entity>): any;
export declare function agJoinArgFactory<Entity>(entityModel: ClassType<Entity>, defaultValues?: ICrudGenBaseParams): any;
