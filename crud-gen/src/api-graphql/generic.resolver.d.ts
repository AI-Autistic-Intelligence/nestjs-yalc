import { ArgsOptions, GqlExecutionContext, MutationOptions, Query, QueryOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { type InjectionToken } from '@nestjs/common';
import { IExtraArg, CrudGenFindManyOptions, IIDArg } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { GenericService } from '@nestjs-yalc/crud-gen/typeorm/generic.service.js';
import { IDecoratorType, IFieldMapper } from '@nestjs-yalc/interfaces';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper.js';
import { ModuleRef } from '@nestjs/core';
import { Mutation } from '@nestjs/graphql';
import { ClassType } from '@nestjs-yalc/types/globals.d.js';
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
    fieldMap?: IFieldMapper;
    decorators?: IDecoratorType[];
    defaultValue?: ICrudGenParams;
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
export interface IGenericResolverMutationCreateOptions<Type> extends IGenericResolverMethodOptions {
    extraInputs?: {
        [key: string]: IExtraInput<Type>;
    };
}
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
    readonly?: boolean;
    service?: {
        dataLoaderToken?: string;
        serviceToken?: string;
    };
}
export declare function generateDecorators(methodFn: typeof Query | typeof Mutation, defaultName: string, typeFunc: ReturnTypeFunc, options?: IGenericResolverMethodOptions): IDecoratorType[];
export declare function defineFieldResolver<Entity extends Record<string, any> = any>(resolverInfoList: IRelationInfo[], resolver: ClassType<IGenericResolver>): void;
export declare function defineGetSingleResource<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineGetGridResource<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineCreateMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverMutationCreateOptions<Entity>): void;
export declare function defineUpdateMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverQueryOptions): void;
export declare function defineDeleteMutation<Entity>(queryName: string, returnType: ClassType, resolver: ClassType<IGenericResolver>, options: IGenericResolverOptions<Entity>, methodOptions: IGenericResolverQueryOptions): void;
export declare function resolverFactory<Entity extends Record<string, any> = any, EntityWrite = Entity>(options: IGenericResolverOptions<Entity>): {
    new (service: GenericService<Entity, EntityWrite>, dataloader: GQLDataLoader<Entity>, moduleRef: ModuleRef): IGenericResolver;
};
