import { ClassType } from '@nest-yalc-2/types';
import { ClassProvider, ExistingProvider, FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { JoinColumnMetadataArgs } from 'typeorm/metadata-args/JoinColumnMetadataArgs';
import { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs';
import { AgGridRepository } from './ag-grid.repository';
import { GenericResolverOptions } from './generic-resolver.resolver';
import { GenericService } from './generic-service.service';
import { AgGridFieldMetadata } from './object.decorator';
export interface DependencyObject<Entity extends ObjectLiteral> {
    providers: Array<FactoryProvider | Provider>;
    repository: ClassType<AgGridRepository<Entity>>;
}
export interface ProviderOverride<T = unknown> {
    provider: ClassProvider<T> | ValueProvider<T> | FactoryProvider<T> | ExistingProvider<T>;
}
export interface ResolverOverride<T = unknown> {
    provider: ClassType<T>;
}
interface GenericServiceOptions<Entity extends ObjectLiteral> {
    dbConnection: string;
    entityModel?: ClassType<Entity>;
    providerClass?: ClassType<GenericService<Entity>>;
}
interface DataLoaderOptions<Entity> {
    databaseKey: keyof Entity;
    entityModel?: ClassType<Entity>;
}
export interface AgGridDependencyFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    resolver?: Omit<GenericResolverOptions<Entity>, 'entityModel'> | ResolverOverride | false;
    service?: GenericServiceOptions<Entity> | ProviderOverride;
    dataloader?: DataLoaderOptions<Entity> | ProviderOverride;
    repository?: ClassType<AgGridRepository<Entity>>;
}
export declare function isProviderOverride(resolver: unknown): resolver is ProviderOverride;
export declare function AgGridDependencyFactory<Entity extends ObjectLiteral>({ entityModel, dataloader, resolver, service, repository, }: AgGridDependencyFactoryOptions<Entity>): DependencyObject<Entity>;
export declare function getProviderToken(entity: ClassType | Provider | string | symbol | Function): string;
export interface RelationInfo {
    relation: RelationMetadataArgs;
    join: JoinColumnMetadataArgs | undefined;
    agField?: AgGridFieldMetadata;
}
export {};
