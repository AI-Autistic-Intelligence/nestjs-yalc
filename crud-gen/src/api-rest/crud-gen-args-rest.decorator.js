"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiOkResponsePaginated = exports.CGQueryArgsNoPagination = exports.CGQueryArgs = exports.CrudGenCombineDecorators = exports.CrudGenArgsMapper = exports.CrudGenRestArgsFactory = void 0;
exports.mapCrudGenRestParams = mapCrudGenRestParams;
const index_js_1 = require("@nest-yalc-2/utils/index.js");
const common_1 = require("@nestjs/common");
const crud_gen_args_helpers_js_1 = require("../typeorm/crud-gen-args.helpers.js");
const crud_gen_rest_dto_js_1 = require("./crud-gen-rest.dto.js");
const swagger_1 = require("@nestjs/swagger");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
function getRestQueryFromContext(ctx) {
    const requestQuery = ctx.switchToHttp?.().getRequest?.()?.query;
    if (requestQuery && typeof requestQuery === 'object') {
        return requestQuery;
    }
    const args = ctx.getArgs?.();
    if (args && typeof args === 'object' && !Array.isArray(args)) {
        return args;
    }
    return {};
}
function parseStructuredRestParam(value, name) {
    if (value === undefined || value === null || value === '')
        return undefined;
    if (Array.isArray(value)) {
        throw new common_1.BadRequestException(`Query parameter "${name}" must be provided only once`);
    }
    if (typeof value !== 'string')
        return value;
    try {
        return JSON.parse(value);
    }
    catch (error) {
        throw new common_1.BadRequestException(`Invalid JSON query parameter "${name}"`);
    }
}
function parseRestNumberParam(value, name) {
    if (value === undefined || value === null || value === '')
        return undefined;
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
        throw new common_1.BadRequestException(`Invalid numeric query parameter "${name}"`);
    }
    return parsed;
}
function normalizeRestCrudGenArgs(rawQuery) {
    const args = { ...rawQuery };
    const startRow = parseRestNumberParam(rawQuery.startRow, 'startRow');
    const endRow = parseRestNumberParam(rawQuery.endRow, 'endRow');
    if (startRow !== undefined)
        args.startRow = startRow;
    if (endRow !== undefined)
        args.endRow = endRow;
    const sorting = parseStructuredRestParam(rawQuery.sorting, 'sorting');
    const filters = parseStructuredRestParam(rawQuery.filters, 'filters');
    if (sorting !== undefined)
        args.sorting = sorting;
    if (filters !== undefined)
        args.filters = filters;
    return args;
}
function mapCrudGenRestParams(params, ctx) {
    const rawArgs = getRestQueryFromContext(ctx);
    const args = normalizeRestCrudGenArgs(rawArgs);
    const findParams = (0, crud_gen_args_helpers_js_1.mapCrudGenParam)(params, { keys: [], keysMeta: {} }, args, { isCount: true });
    const fieldMapper = findParams.extra?._fieldMapper;
    const reservedKeys = new Set(['startRow', 'endRow', 'sorting', 'filters']);
    for (const [key, value] of Object.entries(rawArgs)) {
        if (reservedKeys.has(key) ||
            key.startsWith('$') ||
            value === undefined ||
            value === null ||
            Array.isArray(value) ||
            typeof value === 'object') {
            continue;
        }
        (0, crud_gen_helpers_js_1.forceFilterWorker)((findParams.where ??= { filters: {} }), (0, crud_gen_helpers_js_1.columnConversion)(key, fieldMapper), value);
    }
    return findParams;
}
const CrudGenRestArgsFactory = (data, ctx) => {
    const params = mapCrudGenRestParams(data, ctx);
    return params;
};
exports.CrudGenRestArgsFactory = CrudGenRestArgsFactory;
exports.CrudGenArgsMapper = (0, common_1.createParamDecorator)(exports.CrudGenRestArgsFactory);
const CrudGenCombineDecorators = (params) => {
    const argDecorators = [];
    if (params.extraArgs) {
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].hidden)
                continue;
            argDecorators.push((0, common_1.Query)(argName));
        }
    }
    let joinArg;
    const args = (0, common_1.Query)();
    const mapper = (0, exports.CrudGenArgsMapper)(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
exports.CrudGenCombineDecorators = CrudGenCombineDecorators;
const CGQueryArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    gqlOptions.type = (0, index_js_1.returnValue)((0, crud_gen_rest_dto_js_1.crudGenRestParamsFactory)(params.defaultValue, params.entityType));
    params.gql = gqlOptions;
    return (0, exports.CrudGenCombineDecorators)(params);
};
exports.CGQueryArgs = CGQueryArgs;
const CGQueryArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = (0, index_js_1.returnValue)((0, crud_gen_rest_dto_js_1.crudGenRestParamsNoPaginationFactory)(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return (0, exports.CrudGenCombineDecorators)(params);
};
exports.CGQueryArgsNoPagination = CGQueryArgsNoPagination;
const ApiOkResponsePaginated = (dataDto, options) => {
    class ConnectionNode {
    }
    __decorate([
        (0, swagger_1.ApiProperty)(),
        __metadata("design:type", crud_gen_rest_dto_js_1.PageData)
    ], ConnectionNode.prototype, "pageData", void 0);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(ConnectionNode, dataDto), (0, swagger_1.ApiOkResponse)({
        ...options,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(ConnectionNode) },
                {
                    properties: {
                        nodes: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(dataDto) },
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiOkResponsePaginated = ApiOkResponsePaginated;
//# sourceMappingURL=crud-gen-args-rest.decorator.js.map