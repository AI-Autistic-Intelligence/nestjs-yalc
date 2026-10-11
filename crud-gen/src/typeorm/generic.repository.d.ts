import { ReplicationMode } from '@node-yalc/database/query-builder.helper.js';
import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals.js';
import { EntitySchema } from 'typeorm';
type EntityClassOrSchema = Function | EntitySchema;
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { CrudGenFindManyOptions } from '../api-graphql/crud-gen-gql.interface.js';
import '../query-builder.helpers.js';
export declare const AG_GRID_MAIN_ALIAS = "CrudGenMainAlias";
export interface CrudGenRepositoryCapabilities {
    extendedQueries: boolean;
    structuredGraphqlFilters: boolean;
}
export declare const PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES: CrudGenRepositoryCapabilities;
export declare class GenericTypeORMRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    protected entity: EntityClassOrSchema;
    getCrudGenCapabilities(): CrudGenRepositoryCapabilities;
    supportsExtendedRepository(): boolean;
    /**
     * @todo we should create a class helper/adapter for the findOptions and move this method there
     */
    getActualLimits(findOptions: CrudGenFindManyOptions<Entity>): {
        skip?: number;
        take?: number;
    };
    getFormattedCrudGenQueryBuilder(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }, qb?: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity>;
    getCrudGenQueryBuilder(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): SelectQueryBuilder<Entity>;
    processQueryBuilderWithCount(queryBuilder: SelectQueryBuilder<Entity>, findOptions: CrudGenFindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
    getManyAndCountExtended(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): Promise<[Entity[], number]>;
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
    getManyExtended(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): Promise<Entity[]>;
    countExtended(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): Promise<number>;
    /**
     * @param findOptions All we need to select, filter, order and join the data
     * @param withFail If true ignore the fail, if false when u don't find a entity it'll trhow an error
     * @param mode Set it to true to query data after a mutation
     */
    getOneExtended(findOptions: CrudGenFindManyOptions<Entity>, withFail?: boolean, mode?: ReplicationMode): Promise<Entity>;
    private getOneOrFail;
    /**
     *
     * @param ids Could be either a object map between entity primaryColumn name and value or a single value of the primaryColumn
     * @returns where filter with conditions on entity primaryColumn
     */
    generateFilterOnPrimaryColumn(ids: any): Partial<{ [key in keyof Entity]: import("../api-graphql/crud-gen-gql.type.js").IWhereConditionType; }>;
    generateSelectOnFind(fields: (keyof Entity)[], gqlType: ClassType<Entity>): CrudGenFindManyOptions<any>;
}
export declare function CGExtendedRepositoryFactory<Entity extends ObjectLiteral>(entity: ClassType<Entity>): ClassType<GenericTypeORMRepository<Entity>>;
export { GenericTypeORMRepository as CGExtendedRepository };
