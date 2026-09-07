"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericService = void 0;
exports.GenericServiceFactory = GenericServiceFactory;
exports.getServiceToken = getServiceToken;
exports.validateSupportedError = validateSupportedError;
const conditions_error_js_1 = require("../conditions.error.js");
const entity_error_js_1 = require("../entity.error.js");
const conn_helper_js_1 = require("@nest-yalc-2/database/conn.helper.js");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_repository_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.repository.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const query_builder_helper_js_1 = require("@nest-yalc-2/database/query-builder.helper.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const object_decorator_js_1 = require("../object.decorator.js");
const crud_gen_args_helpers_js_1 = require("./crud-gen-args.helpers.js");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
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
    const operator = (where.operator ?? crud_gen_enum_js_1.Operators.AND).toUpperCase();
    if (operator === crud_gen_enum_js_1.Operators.OR) {
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
            throw new common_1.BadRequestException('Plain TypeORM repositories cannot represent nested OR filters inside an AND expression. Use an extended CrudGen repository for this query shape.');
        }
        if (hasObjectKeys(childWhere)) {
            mergedWhere = { ...mergedWhere, ...childWhere };
        }
    }
    return hasObjectKeys(mergedWhere) ? mergedWhere : undefined;
}
function GenericServiceFactory(entity, connectionName, providedClass, entityWrite, connectionNameWrite) {
    const serviceClass = providedClass ?? GenericService;
    return {
        provide: providedClass ??
            getServiceToken(typeof entity === 'function' ? entity.name : entity.toString()),
        useFactory: (repository, repositoryWrite) => {
            return new serviceClass(repository, repositoryWrite);
        },
        inject: [
            (0, typeorm_1.getRepositoryToken)(entity, connectionName),
            (0, typeorm_1.getRepositoryToken)(entityWrite ?? entity, connectionNameWrite ?? connectionName),
        ],
    };
}
function getServiceToken(entity) {
    return `${(0, crud_gen_helpers_js_1.getProviderToken)(entity)}GenericService`;
}
function validateSupportedError(errorClass) {
    return (error) => {
        if (error instanceof typeorm_2.QueryFailedError) {
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
        const connectionName = (0, conn_helper_js_1.getConnectionName)(dbName);
        const connection = (0, typeorm_2.getConnection)(connectionName);
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
        const { skip, take } = (0, crud_gen_args_helpers_js_1.mapPaginationParamsToTypeORM)(startRow, endRow);
        const mappedFindOptions = {
            ...rest,
            order: sorting ? (0, crud_gen_args_helpers_js_1.mapSortingParamsToTypeORM)(sorting) : undefined,
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
        if ((0, class_helper_js_1.isClass)(entity)) {
            const inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, inputValues);
        }
        const newEntity = this.repositoryWrite.create(entityHydrated);
        const { identifiers } = await this.repositoryWrite
            .insert(newEntity)
            .catch(validateSupportedError(entity_error_js_1.CreateEntityError));
        const ids = identifiers[0];
        const repoAny = this.repository;
        if (typeof repoAny.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoAny.getOneExtended === 'function') {
            const filters = repoAny.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoAny.getOneExtended({ ...findOptions, where: { filters } }, true, query_builder_helper_js_1.ReplicationMode.MASTER);
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
        if ((0, class_helper_js_1.isClass)(entity)) {
            const _inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, _inputValues);
        }
        const mappedConditions = this.mapEntityR2W(conditions);
        await this.repositoryWrite
            .update(mappedConditions, entityHydrated)
            .catch(validateSupportedError(entity_error_js_1.UpdateEntityError));
        const ids = this.repository.getId(Object.assign(result, entityHydrated));
        const repoAny = this.repository;
        if (typeof repoAny.generateFilterOnPrimaryColumn === 'function' &&
            typeof repoAny.getOneExtended === 'function') {
            const filters = repoAny.generateFilterOnPrimaryColumn(ids);
            return !returnEntity
                ? true
                : repoAny.getOneExtended({ ...findOptions, where: { filters } }, true, query_builder_helper_js_1.ReplicationMode.MASTER);
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
            .catch(validateSupportedError(entity_error_js_1.DeleteEntityError));
        return !!result.affected && result.affected > 0;
    }
    async validateConditions(conditions) {
        const results = await this.repository.find({
            where: conditions,
            take: 2,
        });
        if (results.length === 0) {
            throw new conditions_error_js_1.NoResultsFoundError(conditions);
        }
        if (results.length > 1) {
            throw new conditions_error_js_1.ConditionsTooBroadError(conditions);
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
                    ...generic_repository_js_1.PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES,
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
        if (!(0, class_helper_js_1.isClass)(entity) || !(0, class_helper_js_1.isClass)(this.entityRead))
            return entityRead;
        const newEntityWrite = new entity();
        const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(this.entityRead);
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
            if (!(0, object_decorator_js_1.isDstExtended)(fieldMetadata.dst)) {
                newEntityWrite[propertyName] = entityRead[propertyName];
                continue;
            }
            const dst = fieldMetadata.dst;
            newEntityWrite[dst.name] = dst.transformerDst?.(newEntityWrite, entityRead[propertyName]);
        }
        return newEntityWrite;
    }
};
exports.GenericService = GenericService;
exports.GenericService = GenericService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function])
], GenericService);
//# sourceMappingURL=generic.service.js.map