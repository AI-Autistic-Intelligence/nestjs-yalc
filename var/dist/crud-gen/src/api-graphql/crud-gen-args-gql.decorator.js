"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFindOperator = exports.checkFilterScope = exports.removeSymbolicSelection = exports.createWhere = exports.convertFilter = exports.resolveFilter = exports.filterSwitch = exports.getDateFilter = exports.getNumberFilter = exports.getTextFilter = exports.CrudGenArgsSingle = exports.CrudGenArgsSingleDecorator = exports.CrudGenArgsSingleDecoratorFactory = exports.CrudGenArgsNoPagination = exports.CrudGenArgs = exports.CrudGenCombineDecorators = exports.CrudGenArgsMapper = exports.CrudGenArgsFactory = void 0;
exports.mapCrudGenGqlParams = mapCrudGenGqlParams;
exports.CrudGenArgsSingleDecoratorMapper = CrudGenArgsSingleDecoratorMapper;
exports.mapCrudGenParamsGql = mapCrudGenParamsGql;
exports.mapCrudGenParams = mapCrudGenParams;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const gqlfields_decorator_js_1 = require("./gqlfields.decorator.js");
const crud_gen_args_js_1 = require("../crud-gen.args.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const crud_gen_input_js_1 = require("./crud-gen.input.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const crud_gen_args_helpers_js_1 = require("../typeorm/crud-gen-args.helpers.js");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
const missing_arguments_error_js_1 = require("../missing-arguments.error.js");
const crud_gen_gql_helpers_js_1 = require("./crud-gen-gql.helpers.js");
function mapCrudGenGqlParams(params, ctx, args, info) {
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    const { keys, keysMeta } = (0, gqlfields_decorator_js_1.GqlModelFieldsMapper)(fieldType ?? {}, ctx.getInfo());
    const findParams = mapCrudGenParamsGql(params, ctx.getContext(), { keys, keysMeta }, args, { isCount: (0, crud_gen_gql_helpers_js_1.isAskingForCount)(info) });
    findParams.info = info;
    return findParams;
}
const CrudGenArgsFactory = (data, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const params = mapCrudGenGqlParams(data, gqlCtx, gqlCtx.getArgs(), gqlCtx.getInfo());
    return params;
};
exports.CrudGenArgsFactory = CrudGenArgsFactory;
exports.CrudGenArgsMapper = (0, common_1.createParamDecorator)(exports.CrudGenArgsFactory);
const CrudGenCombineDecorators = (params) => {
    const argDecorators = [];
    if (params.extraArgs) {
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].hidden)
                continue;
            argDecorators.push((0, graphql_1.Args)(argName, params.extraArgs[argName].options ?? {}));
        }
    }
    let joinArg;
    if (params.entityType) {
        const JoinOptionInput = (0, crud_gen_input_js_1.agJoinArgFactory)(params.entityType, params.defaultValue);
        if (JoinOptionInput) {
            joinArg = (0, graphql_1.Args)('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const args = (0, graphql_1.Args)(params.gql ?? {});
    const mapper = (0, exports.CrudGenArgsMapper)(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
exports.CrudGenCombineDecorators = CrudGenCombineDecorators;
const CrudGenArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = (0, returnValue_js_1.default)((0, crud_gen_args_js_1.crudGenParamsFactory)(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return (0, exports.CrudGenCombineDecorators)(params);
};
exports.CrudGenArgs = CrudGenArgs;
const CrudGenArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = (0, returnValue_js_1.default)((0, crud_gen_args_js_1.crudGenParamsNoPaginationFactory)(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return (0, exports.CrudGenCombineDecorators)(params);
};
exports.CrudGenArgsNoPagination = CrudGenArgsNoPagination;
function CrudGenArgsSingleDecoratorMapper(params, args, info) {
    const findManyOptions = {};
    if (params) {
        const fieldType = params.fieldType ?? params.entityType;
        if (fieldType) {
            const fieldMapper = (0, crud_gen_helpers_js_1.objectToFieldMapper)(fieldType);
            const { keys, keysMeta } = (0, gqlfields_decorator_js_1.GqlModelFieldsMapper)(fieldType, info);
            findManyOptions.select = keys;
            findManyOptions.extra = {
                _keysMeta: keysMeta,
                _fieldMapper: fieldMapper.field,
            };
            if (params.entityType && args.join) {
                (0, crud_gen_helpers_js_1.applyJoinArguments)(findManyOptions, params.entityType.name, args.join, fieldMapper.field);
            }
        }
    }
    return findManyOptions;
}
const CrudGenArgsSingleDecoratorFactory = (data, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    return CrudGenArgsSingleDecoratorMapper(data, gqlCtx.getArgs(), gqlCtx.getInfo());
};
exports.CrudGenArgsSingleDecoratorFactory = CrudGenArgsSingleDecoratorFactory;
exports.CrudGenArgsSingleDecorator = (0, common_1.createParamDecorator)(exports.CrudGenArgsSingleDecoratorFactory);
const CrudGenArgsSingle = (params) => {
    let joinArg;
    if (params.entityType) {
        const JoinOptionInput = (0, crud_gen_input_js_1.agJoinArgFactory)(params.entityType);
        if (JoinOptionInput) {
            joinArg = (0, graphql_1.Args)('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const mapper = (0, exports.CrudGenArgsSingleDecorator)(params);
    return function (target, key, index) {
        joinArg && joinArg(target, key, index);
        mapper(target, key, index);
    };
};
exports.CrudGenArgsSingle = CrudGenArgsSingle;
function mapCrudGenParamsGql(params, ctx, select, args, options = {}) {
    let findOptions = (0, crud_gen_args_helpers_js_1.mapCrudGenParam)(params, select, args, options);
    const extraParameter = {};
    if (params?.extraArgs) {
        const extraArgsKeys = Object.keys(params.extraArgs);
        switch (params.extraArgsStrategy) {
            case crud_gen_enum_js_1.ExtraArgsStrategy.AT_LEAST_ONE:
                if (args.length <= 0 ||
                    extraArgsKeys.every((argName) => typeof args[argName] === 'undefined'))
                    throw new missing_arguments_error_js_1.MissingArgumentsError();
                break;
            case crud_gen_enum_js_1.ExtraArgsStrategy.ONLY_ONE:
                if (extraArgsKeys.filter((argName) => typeof args[argName] !== 'undefined').length > 1)
                    throw new missing_arguments_error_js_1.ArgumentsError('You must define only one extra arguments');
                break;
            case crud_gen_enum_js_1.ExtraArgsStrategy.DEFAULT:
            default:
        }
        const forcedFilters = [];
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].filterCondition === crud_gen_enum_js_1.GeneralFilters.VIRTUAL) {
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
        findOptions.where = (0, crud_gen_helpers_js_1.forceFilters)(findOptions.where, forcedFilters, findOptions.extra?._fieldMapper);
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
function mapCrudGenParams(params, ctx, args, info) {
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType ?? {};
    let mappedFields;
    try {
        mappedFields = (0, gqlfields_decorator_js_1.GqlModelFieldsMapper)(fieldType, info);
    }
    catch {
        mappedFields = { keys: [], keysMeta: {} };
    }
    return mapCrudGenParamsGql(params, ctx, mappedFields, args, { isCount: (0, crud_gen_gql_helpers_js_1.isAskingForCount)(info) });
}
var crud_gen_args_helpers_js_2 = require("../typeorm/crud-gen-args.helpers.js");
Object.defineProperty(exports, "getTextFilter", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.getTextFilter; } });
Object.defineProperty(exports, "getNumberFilter", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.getNumberFilter; } });
Object.defineProperty(exports, "getDateFilter", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.getDateFilter; } });
Object.defineProperty(exports, "filterSwitch", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.filterSwitch; } });
Object.defineProperty(exports, "resolveFilter", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.resolveFilter; } });
Object.defineProperty(exports, "convertFilter", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.convertFilter; } });
Object.defineProperty(exports, "createWhere", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.createWhere; } });
Object.defineProperty(exports, "removeSymbolicSelection", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.removeSymbolicSelection; } });
Object.defineProperty(exports, "checkFilterScope", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.checkFilterScope; } });
Object.defineProperty(exports, "getFindOperator", { enumerable: true, get: function () { return crud_gen_args_helpers_js_2.getFindOperator; } });
//# sourceMappingURL=crud-gen-args-gql.decorator.js.map