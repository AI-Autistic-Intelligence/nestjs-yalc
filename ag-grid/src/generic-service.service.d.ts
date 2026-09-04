import { EntityError } from './entity.error';
import { FactoryProvider } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { FindOptionsWhere } from 'typeorm';
import { FindManyOptions } from 'typeorm';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { ClassType } from '@nestjs-yalc/types/globals';
export declare function GenericServiceFactory<Entity extends ObjectLiteral>(entity: EntityClassOrSchema, connectionName: string, providedClass?: ClassType<GenericService<Entity>>, entityWrite?: EntityClassOrSchema, connectionNameWrite?: string): FactoryProvider;
export declare function getServiceToken(entity: ClassType | string): string;
export declare function validateSupportedError(errorClass: new (error: Error) => EntityError): (error: Error) => never;
export declare class GenericService<EntityRead extends ObjectLiteral, EntityWrite extends ObjectLiteral = EntityRead> {
    protected repository: AgGridRepository<EntityRead>;
    protected entityRead: EntityClassOrSchema;
    protected entityWrite: EntityClassOrSchema;
    protected repositoryWrite: AgGridRepository<EntityWrite>;
    constructor(repository: AgGridRepository<EntityRead>, repositoryWrite?: AgGridRepository<EntityWrite>);
    switchDatabaseConnection(dbName: string): void;
    protected setRepository(repository: AgGridRepository<EntityRead | EntityWrite>): void;
    protected setRepositoryRead(repository: AgGridRepository<EntityRead>): void;
    protected setRepositoryWrite(repository: AgGridRepository<EntityWrite>): void;
    getRepository(): AgGridRepository<EntityRead>;
    getRepositoryWrite(): AgGridRepository<EntityWrite>;
    getEntityList(findOptions: FindManyOptions<EntityRead> | ObjectLiteral, withCount?: false, relations?: string[], databaseName?: string): Promise<EntityRead[]>;
    getEntityList(findOptions: FindManyOptions<EntityRead> | ObjectLiteral, withCount: true, relations?: string[], databaseName?: string): Promise<[EntityRead[], number]>;
    getEntityOrFail(where: FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead> | ObjectLiteral, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string): Promise<EntityRead>;
    getEntity(where: FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead> | ObjectLiteral, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull: false;
    }): Promise<EntityRead | undefined>;
    getEntity(where: FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead>[] | FindOptionsWhere<EntityRead> | ObjectLiteral, fields?: (keyof EntityRead)[], relations?: string[], databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<EntityRead>;
    createEntity(input: DeepPartial<EntityRead>, findOptions?: AgGridFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    createEntity(input: DeepPartial<EntityRead>, findOptions?: AgGridFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    updateEntity(conditions: FindOptionsWhere<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: AgGridFindManyOptions<EntityRead>, returnEntity?: true): Promise<EntityRead>;
    updateEntity(conditions: FindOptionsWhere<EntityRead>, input: DeepPartial<EntityRead>, findOptions?: AgGridFindManyOptions<EntityRead>, returnEntity?: boolean): Promise<EntityRead | boolean>;
    deleteEntity(conditions: FindOptionsWhere<EntityRead>): Promise<boolean>;
    validateConditions(conditions: FindOptionsWhere<EntityRead>): Promise<EntityRead>;
    getEntityListAgGrid(findOptions: AgGridFindManyOptions<EntityRead>, withCount?: false, relations?: string[], databaseName?: string): Promise<EntityRead[]>;
    getEntityListAgGrid(findOptions: AgGridFindManyOptions<EntityRead>, withCount: true, relations?: string[], databaseName?: string): Promise<[EntityRead[], number]>;
    protected mapEntityR2W(entityRead: FindOptionsWhere<EntityRead>): FindOptionsWhere<EntityWrite>;
    protected mapEntityR2W(entityRead: EntityRead | DeepPartial<EntityRead>): EntityWrite;
}
