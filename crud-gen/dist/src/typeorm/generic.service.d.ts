import { EntityError } from '../entity.error.js';
import { FactoryProvider } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { FindOptionsWhere as FindConditions } from 'typeorm';
import { type CrudGenRepositoryCapabilities, type GenericTypeORMRepository } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import { CrudGenFindManyOptions, ICrudGenSimpleParams } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { ClassType } from '@node-yalc/types/globals';
export declare function GenericServiceFactory<Entity extends ObjectLiteral>(entity: EntityClassOrSchema, connectionName: string, providedClass?: ClassType<GenericService<Entity>>, entityWrite?: EntityClassOrSchema, connectionNameWrite?: string): FactoryProvider;
export declare function getServiceToken(entity: ClassType | string): string;
export declare function validateSupportedError(errorClass: new (error: Error) => EntityError): (error: Error) => never;
export declare class GenericService<EntityRead extends ObjectLiteral, EntityWrite extends ObjectLiteral = EntityRead> {
    protected repository: GenericTypeORMRepository<EntityRead>;
    protected entityRead: EntityClassOrSchema;
    protected entityWrite: EntityClassOrSchema;
    protected repositoryWrite: GenericTypeORMRepository<EntityWrite>;
    constructor(repository: GenericTypeORMRepository<EntityRead>, repositoryWrite?: GenericTypeORMRepository<EntityWrite>);
    protected buildPrimaryKeyWhere(ids: any): FindConditions<EntityRead>;
    switchDatabaseConnection(dbName: string): void;
    protected setRepository(repository: GenericTypeORMRepository<EntityRead | EntityWrite>): void;
    protected setRepositoryRead(repository: GenericTypeORMRepository<EntityRead>): void;
    protected setRepositoryWrite(repository: GenericTypeORMRepository<EntityWrite>): void;
    getRepository(): GenericTypeORMRepository<EntityRead>;
    getRepositoryWrite(): GenericTypeORMRepository<EntityWrite>;
    getEntityList(findOptions: ICrudGenSimpleParams, withCount?: false, databaseName?: string): Promise<EntityRead[]>;
    getEntityList(findOptions: ICrudGenSimpleParams, withCount: true, databaseName?: string): Promise<[EntityRead[], number]>;
    getEntityOrFail(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string): Promise<EntityRead>;
    getEntity(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull: false;
    }): Promise<EntityRead | undefined>;
    getEntity(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<EntityRead>;
    createEntity(input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    createEntity(input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    updateEntity(conditions: FindConditions<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    updateEntity(conditions: FindConditions<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    deleteEntity(conditions: FindConditions<EntityRead>): Promise<boolean>;
    validateConditions(conditions: FindConditions<EntityRead>): Promise<EntityRead>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<EntityRead>, withCount?: false, relations?: string[], databaseName?: string): Promise<EntityRead[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<EntityRead>, withCount: true, relations?: string[], databaseName?: string): Promise<[EntityRead[], number]>;
    getCrudGenRepositoryCapabilities(): CrudGenRepositoryCapabilities;
    supportsExtendedRepository(): boolean;
    supportsStructuredGraphqlFilters(): boolean;
    protected mapEntityR2W(entityRead: FindConditions<EntityRead>): FindConditions<EntityWrite>;
    protected mapEntityR2W(entityRead: EntityRead | DeepPartial<EntityRead>): EntityWrite;
}
