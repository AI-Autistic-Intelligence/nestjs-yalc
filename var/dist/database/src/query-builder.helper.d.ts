import { FindManyOptions, FindOperator, ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { SortDirection } from '@nest-yalc-2/ag-grid/ag-grid.enum';
import { IFieldMapper } from '@nest-yalc-2/interfaces/maps.interface';
export type FindAndCountResult<Entity> = [Entity[], number];
type GetOneResult<Entity> = Entity | undefined;
type GetOneOrFailResult<Entity> = Entity;
type GetManyResult<Entity> = Entity[];
type GetCountResult = number;
type AnyResult = any;
export type QueryBuilderOperationResult<Entity> = GetOneResult<Entity> | GetOneOrFailResult<Entity> | GetManyResult<Entity> | FindAndCountResult<Entity> | AnyResult | GetCountResult;
export declare enum ReplicationMode {
    MASTER = "master",
    SLAVE = "slave"
}
export declare class QueryBuilderHelper {
    static getGroupedManyAndCount<Entity>(queryBuilder: SelectQueryBuilder<any>, groupColumns: string[]): Promise<FindAndCountResult<Entity>>;
    static applyOperationToQueryBuilder<Entity extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<Entity>, mode: ReplicationMode, operationFn: (queryBuilder: SelectQueryBuilder<Entity>) => Promise<QueryBuilderOperationResult<Entity>>): Promise<QueryBuilderOperationResult<Entity>>;
    static computeFindOperatorExpression<Entity extends ObjectLiteral>(queryBuilder: QueryBuilder<Entity> | undefined, operator: FindOperator<any>, aliasPath: string, parameters: any): string;
    static getMapper(fieldMap: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }, alias: string): IFieldMapper;
    static convertFieldWithMap(field: string, map: IFieldMapper): string;
    static applyOrderToJoinedQueryBuilder(findOptions: FindManyOptions, parentName: string, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): {
        key: string;
        operator: SortDirection;
    }[];
    static addAlias(key: string, alias?: string, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): string;
}
export {};
