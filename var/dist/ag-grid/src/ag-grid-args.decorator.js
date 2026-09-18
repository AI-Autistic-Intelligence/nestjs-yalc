"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridArgsSingle = exports.AgGridArgsSingleDecorator = exports.AgGridArgsSingleDecoratorFactory = exports.AgGridArgsNoPagination = exports.AgGridArgs = exports.AgGridCombineDecorators = exports.AgGridArgsMapper = exports.AgGridArgsFactory = void 0;
exports.getTextFilter = getTextFilter;
exports.getNumberFilter = getNumberFilter;
exports.getDateFilter = getDateFilter;
exports.filterSwitch = filterSwitch;
exports.getFindOperator = getFindOperator;
exports.convertFilter = convertFilter;
exports.resolveFilter = resolveFilter;
exports.createWhere = createWhere;
exports.removeSymbolicSelection = removeSymbolicSelection;
exports.checkFilterScope = checkFilterScope;
exports.mapAgGridParams = mapAgGridParams;
exports.AgGridArgsSingleDecoratorMapper = AgGridArgsSingleDecoratorMapper;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const gqlfields_decorator_js_1 = require("./gqlfields.decorator.js");
const ag_grid_args_1 = require("./ag-grid.args");
const ag_grid_enum_1 = require("./ag-grid.enum");
const ag_grid_error_1 = require("./ag-grid.error");
const date_helper_1 = require("@nest-yalc-2/utils/date.helper");
const ag_grid_input_1 = require("./ag-grid.input");
const returnValue_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue"));
const object_decorator_1 = require("./object.decorator");
const missing_arguments_error_1 = require("@nest-yalc-2/ag-grid/missing-arguments.error");
const ag_grid_type_checker_utils_1 = require("./ag-grid-type-checker.utils");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
function getTextFilter(filter, firstParameter) {
    switch (filter.toLowerCase()) {
        case ag_grid_enum_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.STARTSWITH.toLowerCase():
            return (0, typeorm_1.Like)(`${firstParameter}%`);
        case ag_grid_enum_1.GeneralFilters.ENDSWITH.toLowerCase():
            return (0, typeorm_1.Like)(`%${firstParameter}`);
        case ag_grid_enum_1.GeneralFilters.CONTAINS.toLowerCase():
        case ag_grid_enum_1.GeneralFilters.LIKE.toLowerCase():
            return (0, typeorm_1.Like)(`%${firstParameter}%`);
        default:
            throw new ag_grid_error_1.AgGridFilterNotSupportedError(`filter: ${filter} type: TEXT`);
    }
}
function getNumberFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case ag_grid_enum_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.LESSTHAN.toLowerCase():
            return (0, typeorm_1.LessThan)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.LESSTHANOREQUAL.toLowerCase():
            return (0, typeorm_1.LessThanOrEqual)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.GREATERTHAN.toLowerCase():
            return (0, typeorm_1.MoreThan)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.GREATERTHANOREQUAL.toLowerCase():
            return (0, typeorm_1.MoreThanOrEqual)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.INRANGE.toLowerCase():
            return (0, typeorm_1.Between)(firstParameter, secondParameter);
        default:
            throw new ag_grid_error_1.AgGridFilterNotSupportedError(`filter: ${filter} type: NUMBER`);
    }
}
function getDateFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case ag_grid_enum_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.LESSTHAN.toLowerCase():
            return (0, typeorm_1.LessThan)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.GREATERTHAN.toLowerCase():
            return (0, typeorm_1.MoreThan)(firstParameter);
        case ag_grid_enum_1.GeneralFilters.INRANGE.toLowerCase():
            return (0, typeorm_1.Between)(firstParameter, secondParameter);
        case ag_grid_enum_1.GeneralFilters.INDATE.toLowerCase():
            const dateFrom = new Date(firstParameter).setHours(0, 0, 0, 0);
            const dateTo = new Date(secondParameter ?? firstParameter).setHours(23, 59, 59, 999);
            return (0, typeorm_1.Between)(date_helper_1.DateHelper.dateToSQLDateTime(new Date(dateFrom)), date_helper_1.DateHelper.dateToSQLDateTime(new Date(dateTo)));
        default:
            throw new ag_grid_error_1.AgGridFilterNotSupportedError(`filter: ${filter} type: DATE`);
    }
}
function filterSwitch(filter, filterName) {
    let arg1 = undefined;
    let arg2 = undefined;
    if ((0, ag_grid_type_checker_utils_1.isSetFilterModel)(filter)) {
        return (0, typeorm_1.In)(filter.values);
    }
    if ((0, ag_grid_type_checker_utils_1.isDateFilterModel)(filter)) {
        arg1 = filter.dateFrom;
        arg2 = filter.dateTo;
    }
    else if ((0, ag_grid_type_checker_utils_1.isNumberFilterModel)(filter)) {
        arg1 = filter.filter;
        arg2 = filter.filterTo;
    }
    else {
        arg1 = filter.filter;
    }
    if (arg1 === undefined) {
        throw new ag_grid_error_1.AgGridInvalidArgumentError();
    }
    filterName = filterName ?? filter.type;
    return getFindOperator(filter.filterType, filterName, arg1, arg2);
}
function getFindOperator(filterType, filterName, arg1, arg2) {
    if (filterName.toLowerCase() === ag_grid_enum_1.GeneralFilters.ISNULL.toLowerCase()) {
        return (0, typeorm_1.IsNull)();
    }
    switch (filterType) {
        case ag_grid_enum_1.FilterType.TEXT:
            return getTextFilter(filterName, arg1);
        case ag_grid_enum_1.FilterType.NUMBER:
            return getNumberFilter(filterName, arg1, arg2);
        case ag_grid_enum_1.FilterType.DATE:
            return getDateFilter(filterName, arg1, arg2);
        case ag_grid_enum_1.FilterType.SET:
            return (0, typeorm_1.In)(arg1);
        default:
            throw new ag_grid_error_1.AgGridFilterNotSupportedError(`filter: ${filterName} type: ${filterType}`);
    }
}
function convertFilter(filter) {
    if ((0, ag_grid_type_checker_utils_1.isCombinedFilterModel)(filter)) {
        if (filter.operator.toUpperCase() !== ag_grid_enum_1.Operators.OR &&
            filter.operator.toUpperCase() !== ag_grid_enum_1.Operators.AND) {
            throw new ag_grid_error_1.AgGridInvalidOperatorError();
        }
        return {
            operator: filter.operator,
            filter_1: convertFilter(filter.condition1),
            filter_2: convertFilter(filter.condition2),
        };
    }
    if (!(0, ag_grid_type_checker_utils_1.isFilterModel)(filter))
        throw new ag_grid_error_1.AgGridInvalidArgumentError();
    let filterToApply;
    if (!(0, ag_grid_type_checker_utils_1.isSetFilterModel)(filter) &&
        filter.type.startsWith('not') &&
        filter.type !== ag_grid_enum_1.GeneralFilters.NOT) {
        filterToApply = (0, typeorm_1.Not)(filterSwitch(filter, filter.type.substring(3)));
    }
    else {
        filterToApply = filterSwitch(filter);
    }
    return filterToApply;
}
function resolveFilter(filter) {
    let filterToApply;
    if ((0, ag_grid_type_checker_utils_1.isTextFilterModel)(filter) ||
        (0, ag_grid_type_checker_utils_1.isNumberFilterModel)(filter) ||
        (0, ag_grid_type_checker_utils_1.isDateFilterModel)(filter) ||
        (0, ag_grid_type_checker_utils_1.isSetFilterModel)(filter)) {
        filterToApply = convertFilter(filter);
    }
    else {
        throw new ag_grid_error_1.AgGridFilterNotSupportedError(`${JSON.stringify(filter)}`);
    }
    return filterToApply;
}
function createWhere(filtersObject, fieldMapper, alias, where = { filters: {} }) {
    if (!filtersObject) {
        return where;
    }
    const prefix = alias ? `${alias}.` : '';
    const filtersObjectCleared = [];
    if (filtersObject.expressions) {
        Object.values(filtersObject.expressions).map((field) => {
            const exprTypes = Object.keys(field);
            if (exprTypes.length > 1) {
                throw new ag_grid_error_1.AgGridError(`Field can't use more than one expression type on same expression: ${exprTypes}`);
            }
            const exprType = exprTypes[0];
            const expr = field[exprType];
            if (!expr || !expr.field)
                throw new Error('Expression not found! It should never happen');
            const dbFieldName = (0, ag_grid_metadata_helper_1.columnConversion)(expr.field, fieldMapper);
            const filterName = `${prefix}${dbFieldName}`;
            filtersObjectCleared.push({
                ...expr,
                field: filterName,
                filterType: exprType,
            });
        });
    }
    where.operator = filtersObject.operator;
    const childExpressions = where.childExpressions ?? [];
    for (const expr of filtersObjectCleared) {
        const key = expr.field;
        if ((0, ag_grid_type_checker_utils_1.isFilterModel)(expr) || (0, ag_grid_type_checker_utils_1.isCombinedFilterModel)(expr)) {
            childExpressions.push({
                filters: { [key]: resolveFilter(expr) },
            });
        }
        else {
            throw new ag_grid_error_1.AgGridFilterNotSupportedError(`${JSON.stringify(expr)}`);
        }
    }
    if (filtersObject.childExpressions) {
        filtersObject.childExpressions.forEach((expr) => childExpressions.push(createWhere(expr, fieldMapper)));
    }
    where.childExpressions = childExpressions;
    return where;
}
function removeSymbolicSelection(select, data, path) {
    for (let i = 0; i < select.length; i++) {
        if ((0, ag_grid_metadata_helper_1.isSymbolic)(data, path + select[i])) {
            select.splice(i, 1);
            i--;
        }
    }
    return select;
}
function checkFilterScope(where, filterOption) {
    for (const key of Object.keys(where.filters)) {
        if (!key.includes('.') &&
            filterOption.fields &&
            (filterOption.type === object_decorator_1.FilterOptionType.INCLUDE
                ? !filterOption.fields.includes(key)
                : filterOption.fields.includes(key))) {
            throw new ag_grid_error_1.AgGridFilterProhibited();
        }
    }
    const { childExpressions } = where;
    if (Array.isArray(childExpressions)) {
        childExpressions.forEach((expr) => checkFilterScope(expr, filterOption));
    }
}
function mapAgGridParams(params, ctx, args, info) {
    let filterOption;
    let fieldMapper = {};
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    if (fieldType) {
        const fieldMapperAndFilter = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(fieldType);
        filterOption = fieldMapperAndFilter.filterOption;
        fieldMapper = fieldMapperAndFilter.field;
    }
    const defaultSorting = params?.defaultValue?.sorting;
    const { keys, keysMeta } = (0, gqlfields_decorator_js_1.GqlAgGridFieldsMapper)(fieldType ?? {}, ctx.getInfo());
    let where = args.filters
        ? createWhere(args.filters, fieldMapper)
        : { filters: {} };
    if (filterOption) {
        checkFilterScope(where, filterOption);
    }
    const order = {};
    const sorting = args.sorting ?? defaultSorting;
    if (sorting) {
        sorting.forEach((sortParams) => {
            const colName = (0, ag_grid_metadata_helper_1.columnConversion)(String(sortParams.colId), fieldMapper);
            const val = sortParams.sort?.toUpperCase();
            const sortDir = val ?? 'ASC';
            order[colName] = sortDir;
        });
    }
    const maxRow = params?.options?.maxRow ?? ag_grid_enum_1.RowDefaultValues.MAX_ROW;
    const skip = args.startRow ?? ag_grid_enum_1.RowDefaultValues.START_ROW;
    const checkMaxRow = (requestRow) => {
        if (maxRow === 0 || requestRow < maxRow) {
            return requestRow;
        }
        else {
            throw new ag_grid_error_1.AgGridError(`Invalid max number of row selected: cannot exeed max ${maxRow}`);
        }
    };
    const take = args.endRow && checkMaxRow(args.endRow - skip);
    const skipCount = !(0, ag_grid_query_helper_1.isAskingForCount)(ctx.getInfo());
    const extraParameter = {};
    if (params?.extraArgs) {
        const extraArgsKeys = Object.keys(params.extraArgs);
        switch (params.extraArgsStrategy) {
            case ag_grid_enum_1.ExtraArgsStrategy.AT_LEAST_ONE:
                if (Object.keys(args).length <= 0 ||
                    extraArgsKeys.every((argName) => typeof args[argName] === 'undefined'))
                    throw new missing_arguments_error_1.MissingArgumentsError();
                break;
            case ag_grid_enum_1.ExtraArgsStrategy.ONLY_ONE:
                if (extraArgsKeys.filter((argName) => typeof args[argName] !== 'undefined').length > 1)
                    throw new missing_arguments_error_1.ArgumentsError('You must define only one extra arguments');
                break;
            case ag_grid_enum_1.ExtraArgsStrategy.DEFAULT:
            default:
        }
        const forcedFilters = [];
        for (const argName of Object.keys(params.extraArgs)) {
            if (params.extraArgs[argName].filterCondition === ag_grid_enum_1.GeneralFilters.VIRTUAL) {
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
                value: value,
                descriptors: params.extraArgs[argName],
            });
        }
        where = (0, ag_grid_query_helper_1.forceFilters)(where, forcedFilters, fieldMapper);
    }
    const findManyOptions = {
        skip,
        take,
        order,
        select: keys,
        where,
        info,
        extra: {
            skipCount,
            args: extraParameter,
            _fieldMapper: fieldMapper,
            _keysMeta: keysMeta,
        },
    };
    if (params?.entityType && args.join) {
        (0, ag_grid_query_helper_1.applyJoinArguments)(findManyOptions, params.entityType.name, args.join, fieldMapper);
    }
    return findManyOptions;
}
const AgGridArgsFactory = (data, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    const params = mapAgGridParams(data, gqlCtx, gqlCtx.getArgs(), gqlCtx.getInfo());
    return params;
};
exports.AgGridArgsFactory = AgGridArgsFactory;
exports.AgGridArgsMapper = (0, common_1.createParamDecorator)(exports.AgGridArgsFactory);
const AgGridCombineDecorators = (params) => {
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
        const JoinOptionInput = (0, ag_grid_input_1.agJoinArgFactory)(params.entityType, params.defaultValue);
        if (JoinOptionInput) {
            joinArg = (0, graphql_1.Args)('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const args = (0, graphql_1.Args)(params.gql ?? {});
    const mapper = (0, exports.AgGridArgsMapper)(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
exports.AgGridCombineDecorators = AgGridCombineDecorators;
const AgGridArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = (0, returnValue_1.default)((0, ag_grid_args_1.agQueryParamsFactory)(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return (0, exports.AgGridCombineDecorators)(params);
};
exports.AgGridArgs = AgGridArgs;
const AgGridArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = (0, returnValue_1.default)((0, ag_grid_args_1.agQueryParamsNoPaginationFactory)(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return (0, exports.AgGridCombineDecorators)(params);
};
exports.AgGridArgsNoPagination = AgGridArgsNoPagination;
function AgGridArgsSingleDecoratorMapper(params, args, info) {
    const findManyOptions = {};
    if (params) {
        const fieldType = params.fieldType ?? params.entityType;
        if (fieldType) {
            const fieldMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(fieldType);
            const { keys, keysMeta } = (0, gqlfields_decorator_js_1.GqlAgGridFieldsMapper)(fieldType, info);
            findManyOptions.select = keys;
            findManyOptions.extra = {
                _keysMeta: keysMeta,
                _fieldMapper: fieldMapper.field,
            };
            if (params.entityType && args.join) {
                (0, ag_grid_query_helper_1.applyJoinArguments)(findManyOptions, params.entityType.name, args.join, fieldMapper.field);
            }
        }
    }
    return findManyOptions;
}
const AgGridArgsSingleDecoratorFactory = (data, ctx) => {
    const gqlCtx = graphql_1.GqlExecutionContext.create(ctx);
    return AgGridArgsSingleDecoratorMapper(data, gqlCtx.getArgs(), gqlCtx.getInfo());
};
exports.AgGridArgsSingleDecoratorFactory = AgGridArgsSingleDecoratorFactory;
exports.AgGridArgsSingleDecorator = (0, common_1.createParamDecorator)(exports.AgGridArgsSingleDecoratorFactory);
const AgGridArgsSingle = (params) => {
    let joinArg;
    if (params.entityType) {
        const JoinOptionInput = (0, ag_grid_input_1.agJoinArgFactory)(params.entityType);
        if (JoinOptionInput) {
            joinArg = (0, graphql_1.Args)('join', {
                type: () => JoinOptionInput,
                nullable: true,
            });
        }
    }
    const mapper = (0, exports.AgGridArgsSingleDecorator)(params);
    return function (target, key, index) {
        joinArg && joinArg(target, key, index);
        mapper(target, key, index);
    };
};
exports.AgGridArgsSingle = AgGridArgsSingle;
//# sourceMappingURL=ag-grid-args.decorator.js.map