import { __decorate, __metadata } from "tslib";
import { ConditionsTooBroadError, NoResultsFoundError, } from '../conditions.error.js';
import { CreateEntityError, DeleteEntityError, UpdateEntityError, } from '../entity.error.js';
import { getConnectionName } from '@nestjs-yalc/database/conn.helper.js';
import { BadRequestException, Injectable, } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, QueryFailedError, } from 'typeorm';
import { PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES, } from '@nestjs-yalc/crud-gen/typeorm/generic.repository.js';
import { getProviderToken } from '../crud-gen.helpers.js';
import { ReplicationMode } from '@nestjs-yalc/database/query-builder.helper.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { getModelFieldMetadataList, isDstExtended, } from '../object.decorator.js';
import { mapPaginationParamsToTypeORM, mapSortingParamsToTypeORM, } from './crud-gen-args.helpers.js';
import { Operators } from '../crud-gen.enum.js';
function hasObjectKeys(value) {
    return !!value && typeof value === 'object' && Object.keys(value).length > 0;
}
function normalizeCrudGenWhereForPlainTypeorm(where) {
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
export function validateSupportedError(errorClass) {
    return (error) => {
        if (error instanceof QueryFailedError) {
            throw new errorClass(error);
        }
        throw error;
    };
}
let GenericService = class GenericService {
    constructor(repository, repositoryWrite) {
        this.repository = repository;
        this.repositoryWrite =
            repositoryWrite ??
                this.repository;
        this.entityRead = this.repository.target;
        this.entityWrite = this.repositoryWrite.target;
    }
    buildPrimaryKeyWhere(ids) {
        if (ids && typeof ids === 'object' && !Array.isArray(ids)) {
            return ids;
        }
        const repositoryAny = this.repository;
        const primaryColumns = repositoryAny.metadata?.primaryColumns ?? [];
        const primaryColumnName = primaryColumns[0]?.propertyName ?? 'id';
        return { [primaryColumnName]: ids };
    }
    switchDatabaseConnection(dbName) {
        const connectionName = getConnectionName(dbName);
        const connection = getConnection(connectionName);
        this.setRepositoryRead(connection.getRepository(this.entityRead));
        this.setRepositoryWrite(connection.getRepository(this.entityWrite));
    }
    setRepository(repository) {
        this.setRepositoryRead(repository);
        this.setRepositoryWrite(repository);
    }
    setRepositoryRead(repository) {
        this.repository = repository;
    }
    setRepositoryWrite(repository) {
        this.repositoryWrite = repository;
    }
    getRepository() {
        return this.repository;
    }
    getRepositoryWrite() {
        return this.repositoryWrite;
    }
    async getEntityList(findOptions, withCount = false, databaseName) {
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        const { sorting, startRow, endRow, select, ...rest } = findOptions;
        const { skip, take } = mapPaginationParamsToTypeORM(startRow, endRow);
        const mappedFindOptions = {
            ...rest,
            order: sorting ? mapSortingParamsToTypeORM(sorting) : undefined,
            skip,
            take,
        };
        return withCount
            ? this.repository.findAndCount(mappedFindOptions)
            : this.repository.find(mappedFindOptions);
    }
    async getEntityOrFail(where, fields, relations, databaseName) {
        return this.getEntity(where, fields, relations, databaseName, {
            failOnNull: true,
        });
    }
    async getEntity(where, fields, relations, databaseName, options) {
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        return options?.failOnNull !== true
            ? this.repository.findOne({
                where,
                select: fields,
                relations,
                comment: 'Generic service getEntity',
            })
            : this.repository.findOneOrFail({
                where,
                select: fields,
                relations,
                comment: 'Generic service getEntity failOnNull: true',
            });
    }
    async createEntity(input, findOptions, returnEntity = true) {
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
        const ids = identifiers[0];
        const repoAny = this.repository;
        if (typeof repoAny.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoAny.getOneExtended === 'function') {
            const filters = repoAny.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoAny.getOneExtended({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
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
        const ids = this.repository.getId(Object.assign(result, entityHydrated));
        const repoAny = this.repository;
        if (typeof repoAny.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoAny.getOneExtended === 'function') {
            const filters = repoAny.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoAny.getOneExtended({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
        }
        if (!returnEntity) {
            return true;
        }
        const where = this.buildPrimaryKeyWhere(ids);
        return this.repository.findOneOrFail({
            where,
        });
    }
    async deleteEntity(conditions) {
        await this.validateConditions(conditions);
        const mappedConditions = this.mapEntityR2W(conditions);
        const result = await this.repositoryWrite
            .delete(mappedConditions)
            .catch(validateSupportedError(DeleteEntityError));
        return !!result.affected && result.affected > 0;
    }
    async validateConditions(conditions) {
        const results = await this.repository.find({
            where: conditions,
            take: 2,
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