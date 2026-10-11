import { ArgsOptions, GqlExecutionContext, MutationOptions, Query, QueryOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { type InjectionToken } from '@nestjs/common';
import { IExtraArg, CrudGenFindManyOptions, IIDArg } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { GenericService } from '@nest-yalc-2/crud-gen/typeorm/generic.service.js';
import { IDecoratorType, IFieldMapper } from '@node-yalc/interfaces';
import { GQLDataLoader } from '@nest-yalc-2/data-loader/dataloader.helper.js';
import { ModuleRef } from '@nestjs/core';
import { Mutation } from '@nestjs/graphql';
import { ClassType } from '@node-yalc/types/globals.js';
import { IRelationInfo } from '../crud-gen.helpers.js';
import { ExtraArgsStrategy } from '../crud-gen.enum.js';
import { ICrudGenParams } from '../crud-gen.args.js';
export interface IGenericResolver {
    [index: string]: any;
}
export interface IGenericResolverMethodOptions {
    disabled?: boolean;
    queryParams?: QueryOptions | MutationOptions;
    returnType?: ReturnTypeFunc;
    /**
     * @deprecated please use the property decorator alternative instead
     */
    fieldMap?: IFieldMapper;
    decorators?: IDecoratorType[];
    defaultValue?: ICrudGenParams;
    /**
     * Filters with direct arguments
     */
    extraArgsStrategy?: ExtraArgsStrategy;
    extraArgs?: {
        [index: string]: IExtraArg;
    };
}
export interface IExtraInput<Type> {
    middleware?: {
        (ctx: GqlExecutionContext, input: Type, filterValue?: any): any;
    };
    gqlOptions?: ArgsOptions;
}
export interface IExtraInputStrict<Type> {
    middleware: {
        (ctx: GqlExecutionContext, input: Type, filterValue?: any): any;
    };
    gqlOptions?: ArgsOptions;
}
/**
 * @property idName - if `not undefined` will be used as a key,
 * and the guid as value in the input object
 */
export interface IGenericResolverMutationCreateOptions<Type> extends IGenericResolverMethodOptions {
    extraInputs?: {
        [key: string]: IExtraInput<Type>;
    };
}
/**
 * @property idName - if `undefined` will be used ID as value,
 *  if the type is IIDArg the guid will be used as id
 */
export interface IGenericResolverQueryOptions extends IGenericResolverMethodOptions {
    idName?: string | IIDArg;
    throwOnNotFound?: boolean;
}
export declare function isIDArg(arg: string | IIDArg): arg is IIDArg;
export declare function isExtraInputStrict<Entity>(input: undefined | IExtraInput<Entity>): input is IExtraInputStrict<Entity>;
export declare function checkFinalId(finalId: string | undefined): void;
export interface ICustomSingleQueryOptions extends IGenericResolverMethodOptions {
    isSingleResource: true;
    throwOnNotFound?: boolean;
    idName?: string;
}
export declare function isCustomSingleQueryOptions(option: IGenericResolverQueryOptions | ICustomSingleQueryOptions): option is ICustomSingleQueryOptions;
export declare function hasExtraArgs(option: IGenericResolverQueryOptions): boolean;
export declare function hasFilters(findOptions: CrudGenFindManyOptions): boolean | undefined;
export interface IGenericResolverOptions<Entity> {
    entityModel: ClassType<Entity>;
    /**
     * Optional app-owned ModuleRef injection token. This keeps generated
     * resolvers usable when a file package and its Nest app resolve distinct
     * physical copies of @nestjs/core.
     */
    moduleRefToken?: InjectionToken;
    dto?: ClassType;
    input?: {
        create?: ClassType;
        update?: ClassType;
        conditions?: ClassType;
    };
    prefix?: string;
    queries?: {
        getResource?: IGenericResolverQueryOptions;
        getResourceGrid?: IGenericResolverMethodOptions;
    };
    customQueries?: {
        [index: string]: IGenericResolverQueryOptions | ICustomSingleQueryOptions;
    };
    mutations?: {
        createResource: IGenericResolverMutationCreateOptions<Entity>;
        deleteResource: IGenericResolverMethodOptions;
        updateResource: IGenericResolverMethodOptions;
    };
    /** exclude create/delete/update mutations automatically */
    readonly?: boolean;
    /**
     * Override default service. It requires both service and the related dataloader
     */
    service?: {
        /**
         * Override default dataloader (must be based on class GQLDataLoader)
         */
        dataLoaderToken?: string;
        /**
         * Override default service (must be based on class GenericService)
         */
        serviceToken?: string;
    };
}
export declare function generateDecorators(methodFn: typeof Query | typeof Mutation, defaultName: string, typeFunc: ReturnTypeFunc, options?: IGenericResolverMethodOptions): import("@node-yalc/interfaces").DecoratorType[];
export declare function defineFieldResolver<Entity extends Record<string, unknown> = any>(resolverInfoList: IRelationInfo[], resolver: ClassType<IGenericResolver>): void;
export declare function defineGetSingleResource<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineGetGridResource<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineCreateMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverMutationCreateOptions<Entity>): void;
export declare function defineUpdateMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineDeleteMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverQueryOptions): void;
export declare function resolverFactory<Entity extends Record<string, unknown> = any, EntityWrite = Entity>(options: IGenericResolverOptions<Entity>): {
    new (service: GenericService<Entity, EntityWrite>, dataloader: GQLDataLoader<Entity>, moduleRef: ModuleRef): IGenericResolver;
};
