import type { Provider } from '@nestjs/common';
import { type ObjectLiteral } from 'typeorm';
import type { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { type ICrudGenBackendFactoryOptions, type ICrudGenGraphqlFactoryOptions } from './crud-gen.helpers.js';
import { type CrudRestControllerOptions } from './api-rest/crud-gen-rest.controller.factory.js';
import type { GenericTypeORMRepository } from './typeorm/generic.repository.js';
type CrudGenResourceGraphqlOptions<Entity extends ObjectLiteral> = Omit<ICrudGenGraphqlFactoryOptions<Entity>, 'entityModel'>;
type CrudGenResourceBackendOptions<Entity extends ObjectLiteral> = Omit<ICrudGenBackendFactoryOptions<Entity>, 'entityModel'>;
type CrudGenResourceCompactBackendOptions<Entity extends ObjectLiteral> = CrudGenResourceBackendOptions<Entity> & {
    dbConnection?: string;
    databaseKey?: keyof Entity;
};
type CrudGenResourceRestOptions<Entity extends ObjectLiteral> = Omit<CrudRestControllerOptions<Entity>, 'entityModel'>;
export interface ICrudGenResourceFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    backend?: boolean | CrudGenResourceCompactBackendOptions<Entity>;
    graphql?: boolean | CrudGenResourceGraphqlOptions<Entity>;
    rest?: boolean | CrudGenResourceRestOptions<Entity>;
}
export interface ICrudGenResourceFactoryResult<Entity extends ObjectLiteral> {
    providers: Provider[];
    controllers: ClassType<any>[];
    repository?: ClassType<GenericTypeORMRepository<Entity>>;
    serviceToken?: string;
    dataLoaderToken?: string;
}
export declare function CrudGenResourceFactory<Entity extends Record<string, any>>({ entityModel, backend, graphql, rest, }: ICrudGenResourceFactoryOptions<Entity>): ICrudGenResourceFactoryResult<Entity>;
export {};
