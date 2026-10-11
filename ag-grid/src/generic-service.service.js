"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericService = void 0;
exports.GenericServiceFactory = GenericServiceFactory;
exports.getServiceToken = getServiceToken;
exports.validateSupportedError = validateSupportedError;
const tslib_1 = require("tslib");
const conditions_error_1 = require("./conditions.error");
const entity_error_1 = require("./entity.error");
const conn_helper_1 = require("@node-yalc/database/conn.helper");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ag_grid_repository_1 = require("@nest-yalc-2/ag-grid/ag-grid.repository");
const query_builder_helper_1 = require("@node-yalc/database/query-builder.helper");
const class_helper_js_1 = require("@node-yalc/utils/class.helper.js");
const object_decorator_1 = require("./object.decorator");
const ag_grid_factory_helper_1 = require("./ag-grid-factory.helper");
/**
 *
 * @todo must be refactorized with better types
 *
 * Factory function, creates a Provider for the specified Service class, entity and connection
 * @param providedClass Service Class name or Type
 * @param entity TypeORM Entity
 * @param connectionName The Database connection name
 */
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
/**
 * Validates if the error generated is related to the TypeORM Create/Update/Delete operation and re-throw it as a custom error.
 * @param errorClass The custom error class to throw
 * @throws EntityError
 */
function validateSupportedError(errorClass) {
    return (error) => {
        if (error instanceof typeorm_2.QueryFailedError) {
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
        // Extracts the target Entity from the AgGridRepository
        this.entityRead = this.repository.target;
        this.entityWrite = this.repositoryWrite.target;
    }
    /**
     * Switches this Service database connection to a new specified database
     * @param dbName The database name
     */
    switchDatabaseConnection(dbName) {
        const connectionName = (0, conn_helper_1.getConnectionName)(dbName);
        const connection = (0, typeorm_2.getConnection)(connectionName);
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
    async getEntityList(findOptions, withCount = false, relations, databaseName) {
        // Allows to switch to a different database connection
        if (databaseName)
            this.switchDatabaseConnection(databaseName);
        if (relations)
            findOptions.relations = relations;
        return withCount
            ? this.repository.findAndCount(findOptions)
            : this.repository.find(findOptions);
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
            ? (await this.repository.findOne({
                where: where,
                select: fields,
                ...(relations !== undefined ? { relations } : {}),
            })) || undefined
            : this.repository.findOneOrFail({
                where: where,
                select: fields,
                ...(relations !== undefined ? { relations } : {}),
            });
    }
    async createEntity(input, findOptions, returnEntity = true) {
        /**
         * This is needed to keep the prototype of the
         * entity in order to allow the beforeInsert to be executed
         */
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
            .catch(validateSupportedError(entity_error_1.CreateEntityError));
        /**
         * Create where condition for the identifiers
         * @todo maybe conversion is needed here as well
         */
        const ids = identifiers[0];
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, query_builder_helper_1.ReplicationMode.MASTER);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        const result = await this.validateConditions(conditions);
        /**
         * This is needed to keep the prototype of the
         * entity in order to allow the beforeUpdate to be executed
         */
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
            .catch(validateSupportedError(entity_error_1.UpdateEntityError));
        /**
         * Create where condition for the the identifiers
         */
        const ids = this.repository.getId(Object.assign(result, entityHydrated));
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, query_builder_helper_1.ReplicationMode.MASTER);
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
            .catch(validateSupportedError(entity_error_1.DeleteEntityError));
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
            throw new conditions_error_1.NoResultsFoundError(conditions);
        }
        if (results.length > 1) {
            throw new conditions_error_1.ConditionsTooBroadError(conditions);
        }
        return results[0];
    }
    async getEntityListAgGrid(findOptions, withCount = false, relations, databaseName) {
        // Allows to switch to a different database connection
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
        if (!(0, class_helper_js_1.isClass)(entity) || !(0, class_helper_js_1.isClass)(this.entityRead))
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