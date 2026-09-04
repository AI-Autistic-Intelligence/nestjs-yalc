import { createParamDecorator } from '@nestjs/common';
import { Args, GqlExecutionContext } from '@nestjs/graphql';
import { GqlModelFieldsMapper } from '@nestjs-yalc/crud-gen/api-graphql/gqlfields.decorator.js';
import { crudGenParamsFactory, crudGenParamsNoPaginationFactory, } from '../crud-gen.args.js';
import { applyJoinArguments, forceFilters, objectToFieldMapper, } from '../crud-gen.helpers.js';
import { agJoinArgFactory } from './crud-gen.input.js';
import returnValue from '@nestjs-yalc/utils/returnValue.js';
import { mapCrudGenParam } from '../typeorm/crud-gen-args.helpers.js';
import { ExtraArgsStrategy, GeneralFilters } from '../crud-gen.enum.js';
import { MissingArgumentsError, ArgumentsError, } from '../missing-arguments.error.js';
import { isAskingForCount } from './crud-gen-gql.helpers.js';
export function mapCrudGenGqlParams(params, ctx, args, info) {
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    const { keys, keysMeta } = GqlModelFieldsMapper(fieldType ?? {}, ctx.getInfo());
    const findParams = mapCrudGenParamsGql(params, ctx.getContext(), { keys, keysMeta }, args, { isCount: isAskingForCount(info) });
    findParams.info = info;
    return findParams;
}
export const CrudGenArgsFactory = (data, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const params = mapCrudGenGqlParams(data, gqlCtx, gqlCtx.getArgs(), gqlCtx.getInfo());
    return params;
};
export const CrudGenArgsMapper = createParamDecorator(CrudGenArgsFactory);
export const CrudGenCombineDecorators = (params) => {
    const argDecorators = [];
    if (params.extraArgs) {
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].hidden)
                continue;
            argDecorators.push(Args(argName, params.extraArgs[argName].options ?? {}));
        }
    }
    let joinArg;
    if (params.entityType) {
        const JoinOptionInput = agJoinArgFactory(params.entityType, params.defaultValue);
        if (JoinOptionInput) {
            joinArg = Args('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const args = Args(params.gql ?? {});
    const mapper = CrudGenArgsMapper(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
export const CrudGenArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = returnValue(crudGenParamsFactory(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return CrudGenCombineDecorators(params);
};
export const CrudGenArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = returnValue(crudGenParamsNoPaginationFactory(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return CrudGenCombineDecorators(params);
};
export function CrudGenArgsSingleDecoratorMapper(params, args, info) {
    const findManyOptions = {};
    if (params) {
        const fieldType = params.fieldType ?? params.entityType;
        if (fieldType) {
            const fieldMapper = objectToFieldMapper(fieldType);
            const { keys, keysMeta } = GqlModelFieldsMapper(fieldType, info);
            findManyOptions.select = keys;
            findManyOptions.extra = {
                _keysMeta: keysMeta,
                _fieldMapper: fieldMapper.field,
            };
            if (params.entityType && args.join) {
                applyJoinArguments(findManyOptions, params.entityType.name, args.join, fieldMapper.field);
            }
        }
    }
    return findManyOptions;
}
export const CrudGenArgsSingleDecoratorFactory = (data, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    return CrudGenArgsSingleDecoratorMapper(data, gqlCtx.getArgs(), gqlCtx.getInfo());
};
export const CrudGenArgsSingleDecorator = createParamDecorator(CrudGenArgsSingleDecoratorFactory);
export const CrudGenArgsSingle = (params) => {
    let joinArg;
    if (params.entityType) {
        const JoinOptionInput = agJoinArgFactory(params.entityType);
        if (JoinOptionInput) {
            joinArg = Args('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const mapper = CrudGenArgsSingleDecorator(params);
    return function (target, key, index) {
        joinArg && joinArg(target, key, index);
        mapper(target, key, index);
    };
};
export function mapCrudGenParamsGql(params, ctx, select, args, options = {}) {
    let findOptions = mapCrudGenParam(params, select, args, options);
    const extraParameter = {};
    if (params?.extraArgs) {
        const extraArgsKeys = Object.keys(params.extraArgs);
        switch (params.extraArgsStrategy) {
            case ExtraArgsStrategy.AT_LEAST_ONE:
                if (args.length <= 0 ||
                    extraArgsKeys.every((argName) => typeof args[argName] === 'undefined'))
                    throw new MissingArgumentsError();
                break;
            case ExtraArgsStrategy.ONLY_ONE:
                if (extraArgsKeys.filter((argName) => typeof args[argName] !== 'undefined').length > 1)
                    throw new ArgumentsError('You must define only one extra arguments');
                break;
            case ExtraArgsStrategy.DEFAULT:
            default:
        }
        const forcedFilters = [];
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].filterCondition === GeneralFilters.VIRTUAL) {
                extraParameter[argName] = args[argName];
                continue;
            }
            let value = args[argName];
            const filterMiddleware = params.extraArgs[argName].filterMiddleware;
            if (filterMiddleware) {
                value = filterMiddleware(ctx, value);
            }
            forcedFilters.push({
                key: argName,
                value,
                descriptors: params.extraArgs[argName],
            });
        }
        findOptions.where = forceFilters(findOptions.where, forcedFilters, findOptions.extra?._fieldMapper);
    }
    findOptions = {
        ...findOptions,
        extra: {
            ...findOptions.extra,
            args: extraParameter,
        },
    };
    return findOptions;
}
export function mapCrudGenParams(params, ctx, args, info) {
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType ?? {};
    let mappedFields;
    try {
        mappedFields = GqlModelFieldsMapper(fieldType, info);
    }
    catch {
        mappedFields = { keys: [], keysMeta: {} };
    }
    return mapCrudGenParamsGql(params, ctx, mappedFields, args, { isCount: isAskingForCount(info) });
}
export { getTextFilter, getNumberFilter, getDateFilter, filterSwitch, resolveFilter, convertFilter, createWhere, removeSymbolicSelection, checkFilterScope, getFindOperator, } from '../typeorm/crud-gen-args.helpers.js';
//# sourceMappingURL=crud-gen-args-gql.decorator.js.map