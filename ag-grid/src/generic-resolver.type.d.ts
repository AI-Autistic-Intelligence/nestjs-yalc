import { DecoratorType, FieldMapper } from '@nestjs-yalc/interfaces';
import { ClassType } from '@nestjs-yalc/types';
import { Query } from '@nestjs/common';
import { ArgsOptions, GqlExecutionContext, Mutation, MutationOptions, QueryOptions, ReturnTypeFunc } from '@nestjs/graphql';
import { AgQueryParams } from './ag-grid.args';
import { ExtraArgsStrategy } from './ag-grid.enum';
import { AgGridFindManyOptions, DArg, ExtraArg } from './ag-grid.interface';
export interface GenericResolver {
    [index: string]: unknown;
}
export interface GenericResolverMethodOptions {
    disabled?: boolean;
    queryParams?: QueryOptions | MutationOptions;
    returnType?: ReturnTypeFunc;
    fieldMap?: FieldMapper;
    decorators?: DecoratorType[];
    defaultValue?: AgQueryParams | unknown;
    extraArgsStrategy?: ExtraArgsStrategy;
    extraArgs?: {
        [index: string]: ExtraArg;
    };
}
export interface ExtraInput<Type> {
    middleware?: {
        (ctx: GqlExecutionContext, input: Type, filterValue?: unknown): unknown;
    };
    gqlOptions?: ArgsOptions;
}
export interface ExtraInputStrict<Type> {
    middleware: {
        (ctx: GqlExecutionContext, input: Type, filterValue?: unknown): unknown;
    };
    gqlOptions?: ArgsOptions;
}
export interface GenericResolverMutationCreateOptions<Type> extends GenericResolverMethodOptions {
    extraInputs?: {
        [key: string]: ExtraInput<Type>;
    };
}
export interface GenericResolverQueryOptions extends GenericResolverMethodOptions {
    idName?: string | DArg;
    throwOnNotFound?: boolean;
}
export interface CustomSingleQueryOptions extends GenericResolverMethodOptions {
    isSingleResource: true;
    throwOnNotFound?: boolean;
    idName?: string;
}
export interface GenericResolverOptions<Entity> {
    entityModel: ClassType<Entity>;
    dto?: ClassType;
    input?: {
        create?: ClassType;
        update?: ClassType;
        conditions?: ClassType;
    };
    prefix?: string;
    queries?: {
        getResource?: GenericResolverQueryOptions;
        getResourceGrid?: GenericResolverMethodOptions;
    };
    customQueries?: {
        [index: string]: GenericResolverQueryOptions | CustomSingleQueryOptions;
    };
    mutations?: {
        createResource: GenericResolverMutationCreateOptions<Entity>;
        deleteResource: GenericResolverMethodOptions;
        updateResource: GenericResolverMethodOptions;
    };
    readonly?: boolean;
    service?: {
        dataLoaderToken?: string;
        serviceToken?: string;
    };
}
export declare function isIDArg(arg: string | DArg): arg is DArg;
export declare function isExtraInputStrict<Entity>(input: undefined | ExtraInput<Entity>): input is ExtraInputStrict<Entity>;
export declare function checkFinalId(finalId: string | undefined): void;
export declare function isCustomSingleQueryOptions(option: GenericResolverQueryOptions | CustomSingleQueryOptions): option is CustomSingleQueryOptions;
export declare function hasExtraArgs(option: GenericResolverQueryOptions): boolean;
export declare function hasFilters(findOptions: AgGridFindManyOptions): boolean | undefined;
export declare function generateDecorators(methodFn: typeof Query | typeof Mutation, defaultName: string, typeFunc: ReturnTypeFunc, options?: GenericResolverMethodOptions): any[];
