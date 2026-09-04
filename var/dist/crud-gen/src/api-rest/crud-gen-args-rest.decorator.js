import { __decorate, __metadata } from "tslib";
import { returnValue } from '@nestjs-yalc/utils/index.js';
import { applyDecorators, BadRequestException, createParamDecorator, Query, } from '@nestjs/common';
import { mapCrudGenParam } from '../typeorm/crud-gen-args.helpers.js';
import { crudGenRestParamsFactory, crudGenRestParamsNoPaginationFactory, PageData, } from './crud-gen-rest.dto.js';
import { ApiProperty, ApiExtraModels, ApiOkResponse, getSchemaPath, } from '@nestjs/swagger';
import { columnConversion, forceFilterWorker } from '../crud-gen.helpers.js';
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
        throw new BadRequestException(`Query parameter "${name}" must be provided only once`);
    }
    if (typeof value !== 'string')
        return value;
    try {
        return JSON.parse(value);
    }
    catch (error) {
        throw new BadRequestException(`Invalid JSON query parameter "${name}"`);
    }
}
function parseRestNumberParam(value, name) {
    if (value === undefined || value === null || value === '')
        return undefined;
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
        throw new BadRequestException(`Invalid numeric query parameter "${name}"`);
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
export function mapCrudGenRestParams(params, ctx) {
    const rawArgs = getRestQueryFromContext(ctx);
    const args = normalizeRestCrudGenArgs(rawArgs);
    const findParams = mapCrudGenParam(params, { keys: [], keysMeta: {} }, args, { isCount: true });
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
        forceFilterWorker((findParams.where ??= { filters: {} }), columnConversion(key, fieldMapper), value);
    }
    return findParams;
}
export const CrudGenRestArgsFactory = (data, ctx) => {
    const params = mapCrudGenRestParams(data, ctx);
    return params;
};
export const CrudGenArgsMapper = createParamDecorator(CrudGenRestArgsFactory);
export const CrudGenCombineDecorators = (params) => {
    const argDecorators = [];
    if (params.extraArgs) {
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].hidden)
                continue;
            argDecorators.push(Query(argName));
        }
    }
    let joinArg;
    const args = Query();
    const mapper = CrudGenArgsMapper(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
export const CGQueryArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    gqlOptions.type = returnValue(crudGenRestParamsFactory(params.defaultValue, params.entityType));
    params.gql = gqlOptions;
    return CrudGenCombineDecorators(params);
};
export const CGQueryArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = returnValue(crudGenRestParamsNoPaginationFactory(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return CrudGenCombineDecorators(params);
};
export const ApiOkResponsePaginated = (dataDto, options) => {
    class ConnectionNode {
    }
    __decorate([
        ApiProperty(),
        __metadata("design:type", PageData)
    ], ConnectionNode.prototype, "pageData", void 0);
    return applyDecorators(ApiExtraModels(ConnectionNode, dataDto), ApiOkResponse({
        ...options,
        schema: {
            allOf: [
                { $ref: getSchemaPath(ConnectionNode) },
                {
                    properties: {
                        nodes: {
                            type: 'array',
                            items: { $ref: getSchemaPath(dataDto) },
                        },
                    },
                },
            ],
        },
    }));
};
//# sourceMappingURL=crud-gen-args-rest.decorator.js.map