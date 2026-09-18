"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericService = void 0;
exports.GenericServiceFactory = GenericServiceFactory;
exports.getServiceToken = getServiceToken;
exports.validateSupportedError = validateSupportedError;
const tslib_1 = require("tslib");
const conditions_error_1 = require("./conditions.error");
const entity_error_1 = require("./entity.error");
const conn_helper_1 = require("@nest-yalc-2/database/conn.helper");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ag_grid_repository_1 = require("@nest-yalc-2/ag-grid/ag-grid.repository");
const query_builder_helper_1 = require("@nest-yalc-2/database/query-builder.helper");
const class_helper_1 = require("@nest-yalc-2/utils/class.helper");
const object_decorator_1 = require("./object.decorator");
const ag_grid_factory_helper_1 = require("./ag-grid-factory.helper");
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
    return `${(0, ag_grid_factory_helper_1.getProviderToken)(entity)}GenericService`;
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
    switchDatabaseConnection(dbName) {
        const connectionName = (0, conn_helper_1.getConnectionName)(dbName);
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
    async getEntityList(findOptions, withCount = false, relations, databaseName) {
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        if (relations)
            findOptions.relations = relations;
        return withCount
            ? this.repository.findAndCount(findOptions)
            : this.repository.find(findOptions);
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
            ? (await this.repository.findOne({
                where: where,
                select: fields,
                relations,
            })) || undefined
            : this.repository.findOneOrFail({
                where: where,
                select: fields,
                relations,
            });
    }
    async createEntity(input, findOptions, returnEntity = true) {
        let entityHydrated = this.mapEntityR2W(input);
        const entity = this.entityWrite;
        if ((0, class_helper_1.isClass)(entity)) {
            const inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, inputValues);
        }
        const newEntity = this.repositoryWrite.create(entityHydrated);
        const { identifiers } = await this.repositoryWrite
            .insert(newEntity)
            .catch(validateSupportedError(entity_error_1.CreateEntityError));
        const ids = identifiers[0];
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, query_builder_helper_1.ReplicationMode.MASTER);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        const result = await this.validateConditions(conditions);
        let entityHydrated = this.mapEntityR2W(input);
        const entity = this.entityWrite;
        if ((0, class_helper_1.isClass)(entity)) {
            const _inputValues = entityHydrated;
            entityHydrated = new entity();
            Object.assign(entityHydrated, _inputValues);
        }
        const mappedConditions = this.mapEntityR2W(conditions);
        await this.repositoryWrite
            .update(mappedConditions, entityHydrated)
            .catch(validateSupportedError(entity_error_1.UpdateEntityError));
        const ids = this.repository.getId(Object.assign(result, entityHydrated));
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, query_builder_helper_1.ReplicationMode.MASTER);
    }
    async deleteEntity(conditions) {
        await this.validateConditions(conditions);
        const mappedConditions = this.mapEntityR2W(conditions);
        const result = await this.repositoryWrite
            .delete(mappedConditions)
            .catch(validateSupportedError(entity_error_1.DeleteEntityError));
        return !!result.affected && result.affected > 0;
    }
    async validateConditions(conditions) {
        const results = await this.repository.find({
            where: conditions,
            take: 2,
        });
        if (results.length === 0) {
            throw new conditions_error_1.NoResultsFoundError(conditions);
        }
        if (results.length > 1) {
            throw new conditions_error_1.ConditionsTooBroadError(conditions);
        }
        return results[0];
    }
    async getEntityListAgGrid(findOptions, withCount = false, relations, databaseName) {
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        if (relations)
            findOptions.relations = relations;
        return withCount
            ? this.repository.getManyAndCountAgGrid(findOptions)
            : this.repository.getManyAgGrid(findOptions);
    }
    mapEntityR2W(entityRead) {
        const entity = this.entityWrite;
        if (!(0, class_helper_1.isClass)(entity) || !(0, class_helper_1.isClass)(this.entityRead))
            return entityRead;
        const newEntityWrite = new entity();
        const fieldMetadataList = (0, object_decorator_1.getAgGridFieldMetadataList)(this.entityRead);
        for (const propertyName of Object.keys(entityRead)) {
            const fieldMetadata = fieldMetadataList?.[propertyName];
            if (!fieldMetadata?.dst || !(0, object_decorator_1.isDstExtended)(fieldMetadata.dst)) {
                newEntityWrite[propertyName] = entityRead[propertyName];
                continue;
            }
            const dst = fieldMetadata.dst;
            dst.transformer(newEntityWrite, entityRead[propertyName]);
        }
        return newEntityWrite;
    }
};
exports.GenericService = GenericService;
exports.GenericService = GenericService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [ag_grid_repository_1.AgGridRepository,
        ag_grid_repository_1.AgGridRepository])
], GenericService);
//# sourceMappingURL=generic-service.service.js.map