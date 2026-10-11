import { ReplicationMode } from '@node-yalc/database/query-builder.helper';
import { FieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types';
import { EntitySchema } from 'typeorm';
type EntityClassOrSchema = Function | EntitySchema;
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { AgGridFindManyOptions } from './ag-grid.interface';
import { WhereFilters } from './ag-grid.type';
import './query-builder.helpers';
export declare const AG_GRID_MAIN_ALIAS = "AgGridMainAlias";
export declare class AgGridRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    protected entity: EntityClassOrSchema;
    /**
     * @todo we should create a class helper/adapter for the findOptions and move this method there
     */
    getActualLimits(findOptions: AgGridFindManyOptions<Entity>): {
        skip?: number;
        take?: number;
    };
    getFormattedAgGridQueryBuilder(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }, qb?: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity>;
    getAgGridQueryBuilder(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): SelectQueryBuilder<Entity>;
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
    getManyAndCountAgGrid(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): Promise<[Entity[], number]>;
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
    getManyAgGrid(findOptions: AgGridFindManyOptions<Entity>, fieldMap?: {
        parent: FieldMapper;
        joined: FieldMapper | {
            [key: string]: FieldMapper;
        };
    }): Promise<Entity[]>;
    /**
     * @param findOptions All we need to select, filter, order and join the data
     * @param withFail If true ignore the fail, if false when u don't find a entity it'll trhow an error
     * @param mode Set it to true to query data after a mutation
     */
    getOneAgGrid(findOptions: AgGridFindManyOptions<Entity>, withFail?: boolean, mode?: ReplicationMode): Promise<Entity>;
    private getOneOrFail;
    /**
     *
     * @param ids Could be either a object map between entity primaryColumn name and value or a single value of the primaryColumn
     * @returns where filter with conditions on entity primaryColumn
     */
    generateFilterOnPrimaryColumn(ids: any): WhereFilters;
    generateSelectOnFind(fields: (keyof Entity)[], gqlType: ClassType<Entity>): AgGridFindManyOptions<unknown>;
}
export declare function AgGridRepositoryFactory<Entity extends ObjectLiteral>(entity: ClassType<Entity>): ClassType<AgGridRepository<Entity>>;
export {};
