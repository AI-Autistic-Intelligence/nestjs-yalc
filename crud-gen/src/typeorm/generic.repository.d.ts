import { ReplicationMode } from '@nestjs-yalc/database/query-builder.helper.js';
import { IFieldMapper } from '@nestjs-yalc/interfaces/maps.interface.js';
import { ClassType } from '@nestjs-yalc/types/globals.d.js';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js';
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
    getManyAndCountExtended(findOptions: CrudGenFindManyOptions<Entity>, fieldMap?: {
        parent: IFieldMapper;
        joined: IFieldMapper | {
            [key: string]: IFieldMapper;
        };
    }): Promise<[Entity[], number]>;
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
    getOneExtended(findOptions: CrudGenFindManyOptions<Entity>, withFail?: boolean, mode?: ReplicationMode): Promise<Entity>;
    private getOneOrFail;
    generateFilterOnPrimaryColumn(ids: any): Partial<{ [key in keyof Entity]: import("../index.js").IWhereConditionType; }>;
    generateSelectOnFind(fields: (keyof Entity)[], gqlType: ClassType<Entity>): CrudGenFindManyOptions<any>;
}
export declare function CGExtendedRepositoryFactory<Entity extends ObjectLiteral>(entity: ClassType<Entity>): ClassType<GenericTypeORMRepository<Entity>>;
export { GenericTypeORMRepository as CGExtendedRepository };
