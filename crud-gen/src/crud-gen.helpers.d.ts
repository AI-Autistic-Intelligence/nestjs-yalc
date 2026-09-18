import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { ClassType } from '@node-yalc/types/globals';
import { ClassProvider, ExistingProvider, FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { JoinColumnMetadataArgs } from 'typeorm/metadata-args/JoinColumnMetadataArgs.js';
import { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs.js';
import { FilterType } from './crud-gen.enum.js';
import { JoinArgOptions } from './api-graphql/crud-gen-gql.interface.js';
import { IExtraArg, CrudGenFindManyOptions, FilterInput } from './api-graphql/crud-gen-gql.interface.js';
import { type GenericTypeORMRepository } from './typeorm/generic.repository.js';
import { findOperatorTypes, IFilterArg, IWhereCondition, IWhereFilters } from './api-graphql/crud-gen-gql.type.js';
import { IGenericResolverOptions } from './api-graphql/generic.resolver.js';
import { GenericService } from './typeorm/generic.service.js';
import { DstExtended, IModelFieldMetadata, IModelFieldAndFilterMapper } from './object.decorator.js';
export declare const columnConversion: (key: string, data: IFieldMapper | {
    [key: string]: IModelFieldMetadata;
} | undefined) => string;
export declare const getFieldMapperSrcByDst: (data: IFieldMapper | undefined, dst: string) => string;
export declare const isSymbolic: (data: IFieldMapper | undefined, key: string) => boolean;
export declare const forceFilters: (where: IWhereCondition | string | undefined, properties: IFilterArg[], fieldMap: IFieldMapper | undefined) => IWhereCondition;
export declare const forceFilterWorker: (where: IWhereCondition | undefined, target: string, value: findOperatorTypes, descriptors?: IExtraArg) => IWhereCondition;
export declare function whereObjectToSqlString<Entity extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<Entity>, where: IWhereCondition, alias?: string, fieldMap?: {
    parent: IFieldMapper;
    joined: IFieldMapper | {
        [key: string]: IFieldMapper;
    };
}): string;
export declare function getDestinationFieldName(dst: string | DstExtended): string;
export declare const objectToFieldMapper: (object: IFieldMapper | IModelFieldAndFilterMapper | ReturnTypeFuncValue | ClassType) => IModelFieldAndFilterMapper;
export declare function isIFieldAndFilterMapper(val: IFieldMapper | IModelFieldAndFilterMapper): val is IModelFieldAndFilterMapper;
export interface IDependencyObject<Entity extends ObjectLiteral> {
    providers: Array<FactoryProvider | Provider>;
    repository: ClassType<GenericTypeORMRepository<Entity>>;
}
export interface ICrudGenBackendFactoryResult<Entity extends ObjectLiteral> extends IDependencyObject<Entity> {
    serviceToken?: string;
    dataLoaderToken?: string;
}
export interface IProviderOverride<T = any> {
    provider: ClassProvider<T> | ValueProvider<T> | FactoryProvider<T> | ExistingProvider<T>;
}
export interface IResolverOverride<T = any> {
    provider: ClassType<T>;
}
interface IGenericServiceOptions<Entity extends ObjectLiteral> {
    dbConnection: string;
    entityModel?: ClassType<Entity>;
    providerClass?: ClassType<GenericService<Entity>>;
}
interface IDataLoaderOptions<Entity> {
    databaseKey: keyof Entity;
    entityModel?: ClassType<Entity>;
}
export interface ICrudGenDependencyFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    resolver?: Omit<IGenericResolverOptions<Entity>, 'entityModel'> | IResolverOverride | false;
    service?: IGenericServiceOptions<Entity> | IProviderOverride;
    dataloader?: IDataLoaderOptions<Entity> | IProviderOverride;
    repository?: ClassType<GenericTypeORMRepository<Entity>>;
}
export interface ICrudGenBackendFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    service?: IGenericServiceOptions<Entity> | IProviderOverride;
    dataloader?: IDataLoaderOptions<Entity> | IProviderOverride;
    repository?: ClassType<GenericTypeORMRepository<Entity>>;
}
export interface ICrudGenGraphqlFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    resolver: Omit<IGenericResolverOptions<Entity>, 'entityModel'> | IResolverOverride;
    serviceToken?: string;
    dataLoaderToken?: string;
}
export declare function isProviderOverride(resolver: any): resolver is IProviderOverride;
export declare function CrudGenDependencyFactory<Entity extends Record<string, any>>({ entityModel, dataloader, resolver, service, repository, }: ICrudGenDependencyFactoryOptions<Entity>): IDependencyObject<Entity>;
export declare function CrudGenBackendFactory<Entity extends Record<string, any>>({ entityModel, dataloader, service, repository, }: ICrudGenBackendFactoryOptions<Entity>): ICrudGenBackendFactoryResult<Entity>;
export declare function CrudGenGraphqlFactory<Entity extends Record<string, any>>({ entityModel, resolver, serviceToken, dataLoaderToken, }: ICrudGenGraphqlFactoryOptions<Entity>): {
    providers: Provider[];
};
export declare function getProviderToken(entity: ClassType | Provider | string | symbol | Function): string;
export declare function filterTypeToNativeType(type: FilterType): DateConstructor | ArrayConstructor | NumberConstructor | StringConstructor;
export interface IRelationInfo {
    relation: RelationMetadataArgs;
    join: JoinColumnMetadataArgs | undefined;
    agField?: IModelFieldMetadata;
}
export declare function getEntityRelations<Entity, DTO = Entity>(entityModel: ClassType<Entity>, dto?: ClassType<DTO>): IRelationInfo[];
export declare function getTypeProperties<Entity>(entityModel: ClassType<Entity>): import("typeorm/metadata-args/ColumnMetadataArgs.js").ColumnMetadataArgs[];
export declare function getMappedTypeProperties<Entity>(entityModel: ClassType<Entity>): string[];
export declare function applyJoinArguments(findManyOptions: CrudGenFindManyOptions, alias: string, join: {
    [index: string]: JoinArgOptions;
}, fieldMapper: {
    [key: string]: IModelFieldMetadata;
}): void;
export declare function isFilterExpressionInput(filterInput: any): filterInput is FilterInput;
export declare function traverseFiltersAndApplyFunction<TEntity extends ObjectLiteral = any>(where: IWhereCondition<TEntity>, callback: {
    (value: IWhereFilters<TEntity>, key: string): void;
}): void;
export declare function formatRawSelectionWithoutAlias(selection: string, prefix?: string): string;
export declare function formatRawSelection(selection: string, fieldName: string, options?: {
    prefix?: string;
    onlyAlias?: boolean;
    escapeCharacter?: string;
}): string;
export declare function applySelectOnFind<T = any>(findOptions: CrudGenFindManyOptions, field: keyof T, fieldMapper: {
    [key: string]: IModelFieldMetadata;
}, path?: string): void;
export {};
