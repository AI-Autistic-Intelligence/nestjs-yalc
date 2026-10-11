import { __decorate, __metadata } from "tslib";
import { ConditionsTooBroadError, NoResultsFoundError, } from '../conditions.error.js';
import { CreateEntityError, DeleteEntityError, UpdateEntityError, } from '../entity.error.js';
import { getConnectionName } from '@node-yalc/database/conn.helper.js';
import { BadRequestException, Injectable, } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, QueryFailedError, } from 'typeorm';
import { PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES, } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import { getProviderToken } from '../crud-gen.helpers.js';
import { ReplicationMode } from '@node-yalc/database/query-builder.helper.js';
import { isClass } from '@node-yalc/utils/class.helper.js';
import { getModelFieldMetadataList, isDstExtended, } from '../object.decorator.js';
import { mapPaginationParamsToTypeORM, mapSortingParamsToTypeORM, } from './crud-gen-args.helpers.js';
import { Operators } from '../crud-gen.enum.js';
function hasObjectKeys(value) {
    return !!value && typeof value === 'object' && Object.keys(value).length > 0;
}
export function normalizeCrudGenWhereForPlainTypeorm(where) {
    if (!where || typeof where !== 'object') {
        return where;
    }
    if (Array.isArray(where)) {
        const normalized = where
            .map((entry) => normalizeCrudGenWhereForPlainTypeorm(entry))
            .filter(Boolean);
        return normalized.length ? normalized : undefined;
    }
    const candidate = where;
    if ('filters' in candidate ||
        'childExpressions' in candidate ||
        'operator' in candidate) {
        return normalizeCrudGenWhereConditionForPlainTypeorm(candidate);
    }
    return where;
}
function normalizeCrudGenWhereConditionForPlainTypeorm(where) {
    const directFilters = Object.fromEntries(Object.entries(where).filter(([key, value]) => !['filters', 'operator', 'childExpressions'].includes(key) &&
        value !== undefined));
    const filters = {
        ...directFilters,
        ...(hasObjectKeys(where.filters) ? where.filters : {}),
    };
    const childWheres = (where.childExpressions ?? [])
        .map((entry) => normalizeCrudGenWhereForPlainTypeorm(entry))
        .filter(Boolean);
    const operator = (where.operator ?? Operators.AND).toUpperCase();
    if (operator === Operators.OR) {
        const orWheres = [];
        if (hasObjectKeys(filters))
            orWheres.push(filters);
        for (const childWhere of childWheres) {
            if (Array.isArray(childWhere)) {
                orWheres.push(...childWhere);
            }
            else {
                orWheres.push(childWhere);
            }
        }
        return orWheres.length ? orWheres : undefined;
    }
    let mergedWhere = filters;
    for (const childWhere of childWheres) {
        if (Array.isArray(childWhere)) {
            throw new BadRequestException('Plain TypeORM repositories cannot represent nested OR filters inside an AND expression. Use an extended CrudGen repository for this query shape.');
        }
        if (hasObjectKeys(childWhere)) {
            mergedWhere = { ...mergedWhere, ...childWhere };
        }
    }
    return hasObjectKeys(mergedWhere) ? mergedWhere : undefined;
}
/**
 *
 * @todo must be refactorized with better types
 *
 * Factory function, creates a Provider for the specified Service class, entity and connection
 * @param providedClass Service Class name or Type
 * @param entity TypeORM Entity
 * @param connectionName The Database connection name
 */
export function GenericServiceFactory(entity, connectionName, providedClass, entityWrite, connectionNameWrite) {
    const serviceClass = providedClass ?? GenericService;
    return {
        provide: providedClass ??
            getServiceToken(typeof entity === 'function' ? entity.name : entity.toString()),
        useFactory: (repository, repositoryWrite) => {
            return new serviceClass(repository, repositoryWrite);
        },
        inject: [
            getRepositoryToken(entity, connectionName),
            getRepositoryToken(entityWrite ?? entity, connectionNameWrite ?? connectionName),
        ],
    };
}
export function getServiceToken(entity) {
    return `${getProviderToken(entity)}GenericService`;
}
/**
 * Validates if the error generated is related to the TypeORM Create/Update/Delete operation and re-throw it as a custom error.
 * @param errorClass The custom error class to throw
 * @throws EntityError
 */
export function validateSupportedError(errorClass) {
    return (error) => {
        if (error instanceof QueryFailedError) {
            throw new errorClass(error);
        }
        throw error;
    };
}
/**
 * @todo must be refactorized with better types
 */
let GenericService = class GenericService {
    /**
     *
     * @param repositoryRead the main repository, if you do not specify the repositoryWrite it is used as write repository too
     * @param repositoryWrite specify this repository when you have to write on another entity, this is useful when you read from a view but you
     * need to write on another source
     */
    constructor(repository, repositoryWrite) {
        this.repository = repository;
        this.repositoryWrite =
            repositoryWrite ??
                this.repository;
        // Extracts the target Entity from the CrudGenRepository
        this.entityRead = this.repository.target;
        this.entityWrite = this.repositoryWrite.target;
    }
    /**
     * Build a simple TypeORM where condition from primary key identifiers.
     * Used as a fallback when extended repository helpers are not available.
     */
    buildPrimaryKeyWhere(ids) {
        if (ids && typeof ids === 'object' && !Array.isArray(ids)) {
            return ids;
        }
        const repositoryExtended = this.repository;
        const primaryColumns = repositoryExtended.metadata?.primaryColumns ?? [];
        const primaryColumnName = primaryColumns[0]?.propertyName ?? 'id';
        return { [primaryColumnName]: ids };
    }
    /**
     * Switches this Service database connection to a new specified database
     * @param dbName The database name
     */
    switchDatabaseConnection(dbName) {
        const connectionName = getConnectionName(dbName);
        const connection = getConnection(connectionName);
        this.setRepositoryRead(connection.getRepository(this.entityRead));
        this.setRepositoryWrite(connection.getRepository(this.entityWrite));
    }
    /**
     * Changes the Service repository (both write and read)
     * @param repository
     */
    setRepository(repository) {
        this.setRepositoryRead(repository);
        this.setRepositoryWrite(repository);
    }
    /**
     * Changes the Service repository for read operations
     * @param repository
     */
    setRepositoryRead(repository) {
        this.repository = repository;
    }
    /**
     * Changes the Service repository for read operations
     * @param repository
     */
    setRepositoryWrite(repository) {
        this.repositoryWrite = repository;
    }
    /**
     * Returns the Service repository (read)
     */
    getRepository() {
        return this.repository;
    }
    /**
     * Returns the Service repository (write)
     */
    getRepositoryWrite() {
        return this.repositoryWrite;
    }
    async getEntityList(findOptions, withCount = false, databaseName) {
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        const { sorting, startRow, endRow, select, ...rest } = findOptions;
        const { skip, take } = mapPaginationParamsToTypeORM(startRow, endRow);
        /**
         * @todo mapping the find options to the TypeORM FindManyOptions
         */
        const mappedFindOptions = {
            ...rest,
            ...(sorting ? { order: mapSortingParamsToTypeORM(sorting) } : {}),
            skip,
            take,
        };
        return withCount
            ? this.repository.findAndCount(mappedFindOptions)
            : this.repository.find(mappedFindOptions);
    }
    /**
     * Shortcut of getEntity with  failOnNull = true
     * @see {@link getEntity} for further information
     */
    async getEntityOrFail(where, fields, relations, databaseName) {
        return this.getEntity(where, fields, relations, databaseName, {
            failOnNull: true,
        });
    }
    async getEntity(where, fields, relations, databaseName, options) {
        // Allows to switch to a different database connection
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        return options?.failOnNull !== true
            ? this.repository.findOne({
                where,
                ...(fields !== undefined ? { select: fields } : {}),
                ...(relations !== undefined ? { relations } : {}),
                comment: 'Generic service getEntity',
            })
            : this.repository.findOneOrFail({
                where,
                ...(fields !== undefined ? { select: fields } : {}),
                ...(relations !== undefined ? { relations } : {}),
                comment: 'Generic service getEntity failOnNull: true',
            });
    }
    async createEntity(input, findOptions, returnEntity = true) {
        /**
         * This is needed to keep the prototype of the
         * entity in order to allow the beforeInsert to be executed
         */
        let entityHydrated = this.mapEntityR2W(input);
        const entity = this.entityWrite;
        if (isClass(entity)) {
            const inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, inputValues);
        }
        const newEntity = this.repositoryWrite.create(entityHydrated);
        const { identifiers } = await this.repositoryWrite
            .insert(newEntity)
            .catch(validateSupportedError(CreateEntityError));
        /**
         * Create where condition for the identifiers
         * @todo maybe conversion is needed here as well
         */
        const ids = identifiers[0];
        const repoExtended = this.repository;
        if (typeof repoExtended.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoExtended.getOneExtended === 'function') {
            const filters = repoExtended.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoExtended.getOneExtended({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
        }
        if (!returnEntity) {
            return true;
        }
        const where = this.buildPrimaryKeyWhere(ids);
        return this.repository.findOneOrFail({
            where,
        });
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        const result = await this.validateConditions(conditions);
        /**
         * This is needed to keep the prototype of the
         * entity in order to allow the beforeUpdate to be executed
         */
        let entityHydrated = this.mapEntityR2W(input);
        const entity = this.entityWrite;
        if (isClass(entity)) {
            const _inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, _inputValues);
        }
        const mappedConditions = this.mapEntityR2W(conditions);
        await this.repositoryWrite
            .update(mappedConditions, entityHydrated)
            .catch(validateSupportedError(UpdateEntityError));
        /**
         * Create where condition for the the identifiers
         */
        const ids = this.repository.getId(Object.assign(result, entityHydrated));
        const repoExtended = this.repository;
        if (typeof repoExtended.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoExtended.getOneExtended === 'function') {
            const filters = repoExtended.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoExtended.getOneExtended({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
        }
        if (!returnEntity) {
            return true;
        }
        const where = this.buildPrimaryKeyWhere(ids);
        return this.repository.findOneOrFail({
            where,
        });
    }
    /**
     * Deletes an entity based in the provided conditions and returns wether or not the resource was deleted
     * @param conditions The conditions to delete
     * @throws DeleteEntityError
     * @throws NoResultsForConditions
     * @throws ConditionsTooBroadError
     */
    async deleteEntity(conditions) {
        await this.validateConditions(conditions);
        const mappedConditions = this.mapEntityR2W(conditions);
        const result = await this.repositoryWrite
            .delete(mappedConditions)
            .catch(validateSupportedError(DeleteEntityError));
        return !!result.affected && result.affected > 0;
    }
    /**
     * Makes sure that the conditions will affect a single record
     * @param conditions
     * @throws NoResultsForConditions
     * @throws ConditionsTooBroadError
     */
    async validateConditions(conditions) {
        const results = await this.repository.find({
            where: conditions,
            take: 2, // Prevent finding more records than we need for the validation
        });
        if (results.length === 0) {
            throw new NoResultsFoundError(conditions);
        }
        if (results.length > 1) {
            throw new ConditionsTooBroadError(conditions);
        }
        return results[0];
    }
    async getEntityListExtended(findOptions, withCount = false, relations, databaseName) {
        // Allows to switch to a different database connection
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        if (relations)
            findOptions.relations = relations;
        const repo = this.repository;
        const capabilities = this.getCrudGenRepositoryCapabilities();
        if (capabilities.extendedQueries) {
            if (typeof repo.getManyAndCountExtended !== 'function' ||
                typeof repo.getManyExtended !== 'function') {
                throw new ReferenceError('Repository declares extended query support but does not implement the required extended query methods.');
            }
            return withCount
                ? repo.getManyAndCountExtended(findOptions)
                : repo.getManyExtended(findOptions);
        }
        // Fallback for plain TypeORM repositories (no extended helpers):
        // keep support minimal, but sanitize internal helper artifacts such as
        // empty `where.filters` before delegating to TypeORM.
        const { where, info, extra, subQueryFilters, ...typeormOptions } = findOptions;
        const sanitizedWhere = normalizeCrudGenWhereForPlainTypeorm(where);
        const mappedFindOptions = {
            ...typeormOptions,
            where: sanitizedWhere,
        };
        return withCount
            ? this.repository.findAndCount(mappedFindOptions)
            : this.repository.find(mappedFindOptions);
    }
    getCrudGenRepositoryCapabilities() {
        const repo = this.repository;
        if (typeof repo.getCrudGenCapabilities === 'function') {
            const explicitCapabilities = repo.getCrudGenCapabilities();
            if (explicitCapabilities && typeof explicitCapabilities === 'object') {
                return {
                    ...PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES,
                    ...explicitCapabilities,
                };
            }
        }
        const legacyExtendedSupport = typeof repo.supportsExtendedRepository === 'function'
            ? !!repo.supportsExtendedRepository()
            : typeof repo.getManyAndCountExtended === 'function' &&
                typeof repo.getManyExtended === 'function';
        return {
            extendedQueries: legacyExtendedSupport,
            structuredGraphqlFilters: legacyExtendedSupport,
        };
    }
    supportsExtendedRepository() {
        return this.getCrudGenRepositoryCapabilities().extendedQueries;
    }
    supportsStructuredGraphqlFilters() {
        return this.getCrudGenRepositoryCapabilities().structuredGraphqlFilters;
    }
    mapEntityR2W(entityRead) {
        const entity = this.entityWrite;
        if (!isClass(entity) || !isClass(this.entityRead))
            return entityRead;
        const newEntityWrite = new entity();
        const fieldMetadataList = getModelFieldMetadataList(this.entityRead);
        for (const propertyName of Object.keys(entityRead)) {
            const fieldMetadata = fieldMetadataList?.[propertyName];
            if (!fieldMetadata?.dst) {
                newEntityWrite[propertyName] = entityRead[propertyName];
                continue;
            }
            if (typeof fieldMetadata.dst === 'string') {
                newEntityWrite[fieldMetadata.dst] = entityRead[propertyName];
                continue;
            }
            if (!isDstExtended(fieldMetadata.dst)) {
                newEntityWrite[propertyName] = entityRead[propertyName];
                continue;
            }
            const dst = fieldMetadata.dst;
            newEntityWrite[dst.name] = dst.transformerDst?.(newEntityWrite, entityRead[propertyName]);
        }
        return newEntityWrite;
    }
};
GenericService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Function, Function])
], GenericService);
export { GenericService };
//# sourceMappingURL=generic.service.js.map