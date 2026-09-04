var _a, _b;
import { __decorate, __metadata } from "tslib";
import { ConditionsTooBroadError, NoResultsFoundError, } from './conditions.error';
import { CreateEntityError, DeleteEntityError, UpdateEntityError, } from './entity.error';
import { getConnectionName } from '@nestjs-yalc/database/conn.helper';
import { Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, QueryFailedError, } from 'typeorm';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { ReplicationMode } from '@nestjs-yalc/database/query-builder.helper';
import { isClass } from '@nestjs-yalc/utils/class.helper';
import { getAgGridFieldMetadataList, isDstExtended } from './object.decorator';
import { getProviderToken } from "./ag-grid-factory.helper";
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
            ? (await this.repository.findOne({ where: where, select: fields, relations })) || undefined
            : this.repository.findOneOrFail({ where: where, select: fields, relations });
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
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
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
        const filters = this.repository.generateFilterOnPrimaryColumn(ids);
        return !returnEntity
            ? true
            : this.repository.getOneAgGrid({ ...findOptions, where: { filters } }, true, ReplicationMode.MASTER);
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
        if (!isClass(entity) || !isClass(this.entityRead))
            return entityRead;
        const newEntityWrite = new entity();
        const fieldMetadataList = getAgGridFieldMetadataList(this.entityRead);
        for (const propertyName of Object.keys(entityRead)) {
            const fieldMetadata = fieldMetadataList?.[propertyName];
            if (!fieldMetadata?.dst || !isDstExtended(fieldMetadata.dst)) {
                newEntityWrite[propertyName] =
                    entityRead[propertyName];
                continue;
            }
            const dst = fieldMetadata.dst;
            dst.transformer(newEntityWrite, entityRead[propertyName]);
        }
        return newEntityWrite;
    }
};
GenericService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof AgGridRepository !== "undefined" && AgGridRepository) === "function" ? _a : Object, typeof (_b = typeof AgGridRepository !== "undefined" && AgGridRepository) === "function" ? _b : Object])
], GenericService);
export { GenericService };
//# sourceMappingURL=generic-service.service.js.map