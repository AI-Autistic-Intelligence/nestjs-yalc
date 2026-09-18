import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ObjectLiteral } from 'typeorm';
import { CrudGenFindManyOptions, ICrudGenGqlArgsOptions, ICrudGenGqlArgsSingleOptions, ICrudGenBaseParams } from './crud-gen-gql.interface.js';
import { GraphQLResolveInfo } from 'graphql';
import { IKeyMeta } from './crud-gen-gql.type.js';
export declare function mapCrudGenGqlParams<Entity extends ObjectLiteral>(params: ICrudGenGqlArgsOptions | undefined, ctx: GqlExecutionContext, args: ICrudGenBaseParams, info: GraphQLResolveInfo): CrudGenFindManyOptions;
export declare const CrudGenArgsFactory: <T extends ObjectLiteral>(data: ICrudGenGqlArgsOptions | undefined, ctx: ExecutionContext) => CrudGenFindManyOptions<T>;
export declare const CrudGenArgsMapper: <T extends ObjectLiteral>(...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | ICrudGenGqlArgsOptions | undefined)[]) => ParameterDecorator;
export declare const CrudGenCombineDecorators: (params: ICrudGenGqlArgsOptions) => (target: any, key: string, index: number) => void;
export declare const CrudGenArgs: (params: ICrudGenGqlArgsOptions) => (target: any, key: string, index: number) => void;
export declare const CrudGenArgsNoPagination: (params: ICrudGenGqlArgsOptions) => (target: any, key: string, index: number) => void;
export declare function CrudGenArgsSingleDecoratorMapper<T extends ObjectLiteral>(params: ICrudGenGqlArgsOptions | undefined, args: ICrudGenBaseParams, info: GraphQLResolveInfo): CrudGenFindManyOptions<T>;
export declare const CrudGenArgsSingleDecoratorFactory: <T extends ObjectLiteral>(data: ICrudGenGqlArgsOptions | undefined, ctx: ExecutionContext) => CrudGenFindManyOptions<T>;
export declare const CrudGenArgsSingleDecorator: <T extends ObjectLiteral>(...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | ICrudGenGqlArgsOptions | undefined)[]) => ParameterDecorator;
export declare const CrudGenArgsSingle: (params: ICrudGenGqlArgsSingleOptions) => (target: any, key: string, index: number) => void;
export declare function mapCrudGenParamsGql<Entity extends ObjectLiteral>(params: ICrudGenGqlArgsOptions | undefined, ctx: ExecutionContext, select: {
    keys: string[];
    keysMeta?: {
        [key: string]: IKeyMeta;
    };
}, args: ICrudGenBaseParams, options?: {
    isCount?: boolean;
}): CrudGenFindManyOptions<any>;
export declare function mapCrudGenParams<Entity extends ObjectLiteral>(params: ICrudGenGqlArgsOptions | undefined, ctx: GqlExecutionContext | ExecutionContext, args: ICrudGenBaseParams, info: GraphQLResolveInfo): CrudGenFindManyOptions<any>;
export { getTextFilter, getNumberFilter, getDateFilter, filterSwitch, resolveFilter, convertFilter, createWhere, removeSymbolicSelection, checkFilterScope, getFindOperator, } from '../typeorm/crud-gen-args.helpers.js';
