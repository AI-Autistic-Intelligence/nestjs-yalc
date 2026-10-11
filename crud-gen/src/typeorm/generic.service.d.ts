import { EntityError } from '../entity.error.js';
import { FactoryProvider } from '@nestjs/common';
import { EntitySchema } from 'typeorm';
type EntityClassOrSchema = Function | EntitySchema;
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { FindOptionsWhere as FindConditions } from 'typeorm';
import { type CrudGenRepositoryCapabilities, type GenericTypeORMRepository } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import { CrudGenFindManyOptions, ICrudGenSimpleParams } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { ClassType } from '@node-yalc/types/globals.js';
export declare function normalizeCrudGenWhereForPlainTypeorm(where: unknown): unknown;
/**
 *
 * @todo must be refactorized with better types
 *
 * Factory function, creates a Provider for the specified Service class, entity and connection
 * @param providedClass Service Class name or Type
 * @param entity TypeORM Entity
 * @param connectionName The Database connection name
 */
export declare function GenericServiceFactory<Entity extends ObjectLiteral>(entity: EntityClassOrSchema, connectionName: string, providedClass?: ClassType<GenericService<Entity>>, entityWrite?: EntityClassOrSchema, connectionNameWrite?: string): FactoryProvider;
export declare function getServiceToken(entity: ClassType | string): string;
/**
 * Validates if the error generated is related to the TypeORM Create/Update/Delete operation and re-throw it as a custom error.
 * @param errorClass The custom error class to throw
 * @throws EntityError
 */
export declare function validateSupportedError(errorClass: new (error: Error) => EntityError): (error: Error) => never;
/**
 * @todo must be refactorized with better types
 */
export declare class GenericService<EntityRead extends ObjectLiteral, EntityWrite extends ObjectLiteral = EntityRead> {
    protected repository: GenericTypeORMRepository<EntityRead>;
    protected entityRead: EntityClassOrSchema;
    protected entityWrite: EntityClassOrSchema;
    protected repositoryWrite: GenericTypeORMRepository<EntityWrite>;
    /**
     *
     * @param repositoryRead the main repository, if you do not specify the repositoryWrite it is used as write repository too
     * @param repositoryWrite specify this repository when you have to write on another entity, this is useful when you read from a view but you
     * need to write on another source
     */
    constructor(repository: GenericTypeORMRepository<EntityRead>, repositoryWrite?: GenericTypeORMRepository<EntityWrite>);
    /**
     * Build a simple TypeORM where condition from primary key identifiers.
     * Used as a fallback when extended repository helpers are not available.
     */
    protected buildPrimaryKeyWhere(ids: any): FindConditions<EntityRead>;
    /**
     * Switches this Service database connection to a new specified database
     * @param dbName The database name
     */
    switchDatabaseConnection(dbName: string): void;
    /**
     * Changes the Service repository (both write and read)
     * @param repository
     */
    protected setRepository(repository: GenericTypeORMRepository<EntityRead | EntityWrite>): void;
    /**
     * Changes the Service repository for read operations
     * @param repository
     */
    protected setRepositoryRead(repository: GenericTypeORMRepository<EntityRead>): void;
    /**
     * Changes the Service repository for read operations
     * @param repository
     */
    protected setRepositoryWrite(repository: GenericTypeORMRepository<EntityWrite>): void;
    /**
     * Returns the Service repository (read)
     */
    getRepository(): GenericTypeORMRepository<EntityRead>;
    /**
     * Returns the Service repository (write)
     */
    getRepositoryWrite(): GenericTypeORMRepository<EntityWrite>;
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options - partially implemented
     * @param withCount whether or not the number results should be returned
     * @param relations Related entities to load as part of the results
     * @param databaseName The database name, to open a new database connection
     */
    getEntityList(findOptions: ICrudGenSimpleParams, withCount?: false, databaseName?: string): Promise<EntityRead[]>;
    getEntityList(findOptions: ICrudGenSimpleParams, withCount: true, databaseName?: string): Promise<[EntityRead[], number]>;
    /**
     * Shortcut of getEntity with  failOnNull = true
     * @see {@link getEntity} for further information
     */
    getEntityOrFail(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string): Promise<EntityRead>;
    /**
     * Returns an entity, or entity fields, based in the filters provided
     * @param where Filter options
     * @param fields Specific Entity fields to retrieve
     * @param relations Related entities to load as part of the Entity
     * @param databaseName The database name, to open a new database connection
     */
    getEntity(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull: false;
    }): Promise<EntityRead | undefined>;
    getEntity(where: FindConditions<EntityRead>[] | FindConditions<EntityRead> | ObjectLiteral | string, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<EntityRead>;
    /**
     * Creates an entity based in the provided data and returns it
     * @param entity
     * @throws CreateEntityError
     */
    createEntity(input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    createEntity(input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    /**
     * Updates an entity based in the provided conditions and return the updated entity
     * @param conditions The conditions to update
     * @param input The data to update
     * @throws UpdateEntityError
     * @throws NoResultsForConditions
     * @throws ConditionsTooBroadError
     */
    updateEntity(conditions: FindConditions<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    updateEntity(conditions: FindConditions<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: CrudGenFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    /**
     * Deletes an entity based in the provided conditions and returns wether or not the resource was deleted
     * @param conditions The conditions to delete
     * @throws DeleteEntityError
     * @throws NoResultsForConditions
     * @throws ConditionsTooBroadError
     */
    deleteEntity(conditions: FindConditions<EntityRead>): Promise<boolean>;
    /**
     * Makes sure that the conditions will affect a single record
     * @param conditions
     * @throws NoResultsForConditions
     * @throws ConditionsTooBroadError
     */
    validateConditions(conditions: FindConditions<EntityRead>): Promise<EntityRead>;
    /**   * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     * @param withCount whether or not the number results should be returned
     * @param relations Related entities to load as part of the results
     * @param databaseName The database name, to open a new database connection
     */
    getEntityListExtended(findOptions: CrudGenFindManyOptions<EntityRead>, withCount?: false, relations?: string[], databaseName?: string): Promise<EntityRead[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<EntityRead>, withCount: true, relations?: string[], databaseName?: string): Promise<[EntityRead[], number]>;
    getCrudGenRepositoryCapabilities(): CrudGenRepositoryCapabilities;
    supportsExtendedRepository(): boolean;
    supportsStructuredGraphqlFilters(): boolean;
    protected mapEntityR2W(entityRead: FindConditions<EntityRead>): FindConditions<EntityWrite>;
    protected mapEntityR2W(entityRead: EntityRead | DeepPartial<EntityRead>): EntityWrite;
}
export {};
