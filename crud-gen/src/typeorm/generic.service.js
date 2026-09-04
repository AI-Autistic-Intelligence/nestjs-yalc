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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericService = void 0;
exports.GenericServiceFactory = GenericServiceFactory;
exports.getServiceToken = getServiceToken;
exports.validateSupportedError = validateSupportedError;
const conditions_error_js_1 = require("../conditions.error.js");
const entity_error_js_1 = require("../entity.error.js");
const conn_helper_js_1 = require("@nestjs-yalc/database/conn.helper.js");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_repository_js_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.repository.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const query_builder_helper_js_1 = require("@nestjs-yalc/database/query-builder.helper.js");
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
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
    var _a, _b;
    const directFilters = Object.fromEntries(Object.entries(where).filter(([key, value]) => !['filters', 'operator', 'childExpressions'].includes(key) &&
        value !== undefined));
    const filters = Object.assign(Object.assign({}, directFilters), (hasObjectKeys(where.filters) ? where.filters : {}));
    const childWheres = ((_a = where.childExpressions) !== null && _a !== void 0 ? _a : [])
        .map((entry) => normalizeCrudGenWhereForPlainTypeorm(entry))
        .filter(Boolean);
    const operator = ((_b = where.operator) !== null && _b !== void 0 ? _b : crud_gen_enum_js_1.Operators.AND).toUpperCase();
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
            mergedWhere = Object.assign(Object.assign({}, mergedWhere), childWhere);
        }
    }
    return hasObjectKeys(mergedWhere) ? mergedWhere : undefined;
}
function GenericServiceFactory(entity, connectionName, providedClass, entityWrite, connectionNameWrite) {
    const serviceClass = providedClass !== null && providedClass !== void 0 ? providedClass : GenericService;
    return {
        provide: providedClass !== null && providedClass !== void 0 ? providedClass : getServiceToken(typeof entity === 'function' ? entity.name : entity.toString()),
        useFactory: (repository, repositoryWrite) => {
            return new serviceClass(repository, repositoryWrite);
        },
        inject: [
            (0, typeorm_1.getRepositoryToken)(entity, connectionName),
            (0, typeorm_1.getRepositoryToken)(entityWrite !== null && entityWrite !== void 0 ? entityWrite : entity, connectionNameWrite !== null && connectionNameWrite !== void 0 ? connectionNameWrite : connectionName),
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
            repositoryWrite !== null && repositoryWrite !== void 0 ? repositoryWrite : this.repository;
        this.entityRead = this.repository.target;
        this.entityWrite = this.repositoryWrite.target;
    }
    buildPrimaryKeyWhere(ids) {
        var _a, _b, _c, _d;
        if (ids && typeof ids === 'object' && !Array.isArray(ids)) {
            return ids;
        }
        const repositoryAny = this.repository;
        const primaryColumns = (_b = (_a = repositoryAny.metadata) === null || _a === void 0 ? void 0 : _a.primaryColumns) !== null && _b !== void 0 ? _b : [];
        const primaryColumnName = (_d = (_c = primaryColumns[0]) === null || _c === void 0 ? void 0 : _c.propertyName) !== null && _d !== void 0 ? _d : 'id';
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
        const { sorting, startRow, endRow, select } = findOptions, rest = __rest(findOptions, ["sorting", "startRow", "endRow", "select"]);
        const { skip, take } = (0, crud_gen_args_helpers_js_1.mapPaginationParamsToTypeORM)(startRow, endRow);
        const mappedFindOptions = Object.assign(Object.assign({}, rest), { order: sorting ? (0, crud_gen_args_helpers_js_1.mapSortingParamsToTypeORM)(sorting) : undefined, skip,
            take });
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
        return (options === null || options === void 0 ? void 0 : options.failOnNull) !== true
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
                : repoAny.getOneExtended(Object.assign(Object.assign({}, findOptions), { where: { filters } }), true, query_builder_helper_js_1.ReplicationMode.MASTER);
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
                : repoAny.getOneExtended(Object.assign(Object.assign({}, findOptions), { where: { filters } }), true, query_builder_helper_js_1.ReplicationMode.MASTER);
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
        const { where, info, extra, subQueryFilters } = findOptions, typeormOptions = __rest(findOptions, ["where", "info", "extra", "subQueryFilters"]);
        const sanitizedWhere = normalizeCrudGenWhereForPlainTypeorm(where);
        const mappedFindOptions = Object.assign(Object.assign({}, typeormOptions), { where: sanitizedWhere });
        return withCount
            ? this.repository.findAndCount(mappedFindOptions)
            : this.repository.find(mappedFindOptions);
    }
    getCrudGenRepositoryCapabilities() {
        const repo = this.repository;
        if (typeof repo.getCrudGenCapabilities === 'function') {
            const explicitCapabilities = repo.getCrudGenCapabilities();
            if (explicitCapabilities && typeof explicitCapabilities === 'object') {
                return Object.assign(Object.assign({}, generic_repository_js_1.PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES), explicitCapabilities);
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
        var _a;
        const entity = this.entityWrite;
        if (!(0, class_helper_js_1.isClass)(entity) || !(0, class_helper_js_1.isClass)(this.entityRead))
            return entityRead;
        const newEntityWrite = new entity();
        const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(this.entityRead);
        for (const propertyName of Object.keys(entityRead)) {
            const fieldMetadata = fieldMetadataList === null || fieldMetadataList === void 0 ? void 0 : fieldMetadataList[propertyName];
            if (!(fieldMetadata === null || fieldMetadata === void 0 ? void 0 : fieldMetadata.dst)) {
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
            newEntityWrite[dst.name] = (_a = dst.transformerDst) === null || _a === void 0 ? void 0 : _a.call(dst, newEntityWrite, entityRead[propertyName]);
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