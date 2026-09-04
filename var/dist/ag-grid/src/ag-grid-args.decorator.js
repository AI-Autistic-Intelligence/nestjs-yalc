import { createParamDecorator } from '@nestjs/common';
import { Args, GqlExecutionContext } from '@nestjs/graphql';
import { Not, Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Like, Between, In, IsNull, } from 'typeorm';
import { GqlAgGridFieldsMapper } from '@nestjs-yalc/ag-grid/gqlfields.decorator';
import { agQueryParamsFactory, agQueryParamsNoPaginationFactory, } from './ag-grid.args';
import { GeneralFilters, FilterType, Operators, ExtraArgsStrategy, RowDefaultValues, } from './ag-grid.enum';
import { AgGridError, AgGridFilterNotSupportedError, AgGridFilterProhibited, AgGridInvalidArgumentError, AgGridInvalidOperatorError, } from './ag-grid.error';
import { DateHelper } from '@nestjs-yalc/utils/date.helper';
import { agJoinArgFactory } from './ag-grid.input';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { FilterOptionType } from './object.decorator';
import { ArgumentsError, MissingArgumentsError, } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { isCombinedFilterModel, isDateFilterModel, isFilterModel, isNumberFilterModel, isSetFilterModel, isTextFilterModel, } from './ag-grid-type-checker.utils';
import { applyJoinArguments, forceFilters, isAskingForCount } from "./ag-grid-query.helper";
import { columnConversion, isSymbolic, objectToFieldMapper } from "./ag-grid-metadata.helper";
export function getTextFilter(filter, firstParameter) {
    switch (filter.toLowerCase()) {
        case GeneralFilters.EQUALS.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.EQUAL.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.STARTSWITH.toLowerCase():
            return Like(`${firstParameter}%`);
        case GeneralFilters.ENDSWITH.toLowerCase():
            return Like(`%${firstParameter}`);
        case GeneralFilters.CONTAINS.toLowerCase():
        case GeneralFilters.LIKE.toLowerCase():
            return Like(`%${firstParameter}%`);
        default:
            throw new AgGridFilterNotSupportedError(`filter: ${filter} type: TEXT`);
    }
}
export function getNumberFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case GeneralFilters.EQUALS.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.EQUAL.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.LESSTHAN.toLowerCase():
            return LessThan(firstParameter);
        case GeneralFilters.LESSTHANOREQUAL.toLowerCase():
            return LessThanOrEqual(firstParameter);
        case GeneralFilters.GREATERTHAN.toLowerCase():
            return MoreThan(firstParameter);
        case GeneralFilters.GREATERTHANOREQUAL.toLowerCase():
            return MoreThanOrEqual(firstParameter);
        case GeneralFilters.INRANGE.toLowerCase():
            return Between(firstParameter, secondParameter);
        default:
            throw new AgGridFilterNotSupportedError(`filter: ${filter} type: NUMBER`);
    }
}
export function getDateFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case GeneralFilters.EQUALS.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.EQUAL.toLowerCase():
            return Equal(firstParameter);
        case GeneralFilters.LESSTHAN.toLowerCase():
            return LessThan(firstParameter);
        case GeneralFilters.GREATERTHAN.toLowerCase():
            return MoreThan(firstParameter);
        case GeneralFilters.INRANGE.toLowerCase():
            return Between(firstParameter, secondParameter);
        case GeneralFilters.INDATE.toLowerCase():
            const dateFrom = new Date(firstParameter).setHours(0, 0, 0, 0);
            const dateTo = new Date(secondParameter ?? firstParameter).setHours(23, 59, 59, 999);
            return Between(DateHelper.dateToSQLDateTime(new Date(dateFrom)), DateHelper.dateToSQLDateTime(new Date(dateTo)));
        default:
            throw new AgGridFilterNotSupportedError(`filter: ${filter} type: DATE`);
    }
}
export function filterSwitch(filter, filterName) {
    let arg1 = undefined;
    let arg2 = undefined;
    if (isSetFilterModel(filter)) {
        return In(filter.values);
    }
    if (isDateFilterModel(filter)) {
        arg1 = filter.dateFrom;
        arg2 = filter.dateTo;
    }
    else if (isNumberFilterModel(filter)) {
        arg1 = filter.filter;
        arg2 = filter.filterTo;
    }
    else {
        arg1 = filter.filter;
    }
    if (arg1 === undefined) {
        throw new AgGridInvalidArgumentError();
    }
    filterName = filterName ?? filter.type;
    return getFindOperator(filter.filterType, filterName, arg1, arg2);
}
export function getFindOperator(filterType, filterName, arg1, arg2) {
    if (filterName.toLowerCase() === GeneralFilters.ISNULL.toLowerCase()) {
        return IsNull();
    }
    switch (filterType) {
        case FilterType.TEXT:
            return getTextFilter(filterName, arg1);
        case FilterType.NUMBER:
            return getNumberFilter(filterName, arg1, arg2);
        case FilterType.DATE:
            return getDateFilter(filterName, arg1, arg2);
        case FilterType.SET:
            return In(arg1);
        default:
            throw new AgGridFilterNotSupportedError(`filter: ${filterName} type: ${filterType}`);
    }
}
export function convertFilter(filter) {
    if (isCombinedFilterModel(filter)) {
        if (filter.operator.toUpperCase() !== Operators.OR &&
            filter.operator.toUpperCase() !== Operators.AND) {
            throw new AgGridInvalidOperatorError();
        }
        return {
            operator: filter.operator,
            filter_1: convertFilter(filter.condition1),
            filter_2: convertFilter(filter.condition2),
        };
    }
    if (!isFilterModel(filter))
        throw new AgGridInvalidArgumentError();
    let filterToApply;
    if (!isSetFilterModel(filter) &&
        filter.type.startsWith('not') &&
        filter.type !== GeneralFilters.NOT) {
        filterToApply = Not(filterSwitch(filter, filter.type.substring(3)));
    }
    else {
        filterToApply = filterSwitch(filter);
    }
    return filterToApply;
}
export function resolveFilter(filter) {
    let filterToApply;
    if (isTextFilterModel(filter) ||
        isNumberFilterModel(filter) ||
        isDateFilterModel(filter) ||
        isSetFilterModel(filter)) {
        filterToApply = convertFilter(filter);
    }
    else {
        throw new AgGridFilterNotSupportedError(`${JSON.stringify(filter)}`);
    }
    return filterToApply;
}
export function createWhere(filtersObject, fieldMapper, alias, where = { filters: {} }) {
    if (!filtersObject) {
        return where;
    }
    console.log('createWhere called with filtersObject:', JSON.stringify(filtersObject));
    const prefix = alias ? `${alias}.` : '';
    const filtersObjectCleared = [];
    if (filtersObject.expressions) {
        Object.values(filtersObject.expressions).map((field) => {
            if (!field) {
                throw new Error('Expression not found!');
            }
            const exprTypes = Object.keys(field);
            if (exprTypes.length > 1) {
                throw new AgGridError(`Field can't use more than one expression type on same expression: ${exprTypes}`);
            }
            const exprType = exprTypes[0];
            const expr = field[exprType];
            if (!expr || !expr.field) {
                console.log('Expression not found:', expr, JSON.stringify(field), exprType);
                throw new Error('Expression not found! It should never happen');
            }
            const dbFieldName = columnConversion(expr.field, fieldMapper);
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
        if (isFilterModel(expr) || isCombinedFilterModel(expr)) {
            childExpressions.push({
                filters: { [key]: resolveFilter(expr) },
            });
        }
        else {
            throw new AgGridFilterNotSupportedError(`${JSON.stringify(expr)}`);
        }
    }
    if (filtersObject.childExpressions) {
        filtersObject.childExpressions.forEach((expr) => childExpressions.push(createWhere(expr, fieldMapper)));
    }
    where.childExpressions = childExpressions;
    return where;
}
export function removeSymbolicSelection(select, data, path) {
    for (let i = 0; i < select.length; i++) {
        if (isSymbolic(data, path + select[i])) {
            select.splice(i, 1);
            i--;
        }
    }
    return select;
}
export function checkFilterScope(where, filterOption) {
    for (const key of Object.keys(where.filters)) {
        if (!key.includes('.') &&
            filterOption.fields &&
            (filterOption.type === FilterOptionType.INCLUDE
                ? !filterOption.fields.includes(key)
                : filterOption.fields.includes(key))) {
            throw new AgGridFilterProhibited();
        }
    }
    const { childExpressions } = where;
    if (Array.isArray(childExpressions)) {
        childExpressions.forEach((expr) => checkFilterScope(expr, filterOption));
    }
}
export function mapAgGridParams(params, ctx, args, info) {
    let filterOption;
    let fieldMapper = {};
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    if (fieldType) {
        const fieldMapperAndFilter = objectToFieldMapper(fieldType);
        filterOption = fieldMapperAndFilter.filterOption;
        fieldMapper = fieldMapperAndFilter.field;
    }
    const defaultSorting = params?.defaultValue?.sorting;
    const { keys, keysMeta } = GqlAgGridFieldsMapper(fieldType ?? {}, ctx.getInfo());
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
            const colName = columnConversion(String(sortParams.colId), fieldMapper);
            const val = sortParams.sort?.toUpperCase();
            const sortDir = val ?? 'ASC';
            order[colName] = sortDir;
        });
    }
    const maxRow = params?.options?.maxRow ?? RowDefaultValues.MAX_ROW;
    const skip = args.startRow ?? RowDefaultValues.START_ROW;
    const checkMaxRow = (requestRow) => {
        if (maxRow === 0 || requestRow < maxRow) {
            return requestRow;
        }
        else {
            throw new AgGridError(`Invalid max number of row selected: cannot exeed max ${maxRow}`);
        }
    };
    const take = args.endRow && checkMaxRow(args.endRow - skip);
    const skipCount = !isAskingForCount(ctx.getInfo());
    const extraParameter = {};
    if (params?.extraArgs) {
        const extraArgsKeys = Object.keys(params.extraArgs);
        switch (params.extraArgsStrategy) {
            case ExtraArgsStrategy.AT_LEAST_ONE:
                if (Object.keys(args).length <= 0 ||
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
                value: value,
                descriptors: params.extraArgs[argName],
            });
        }
        where = forceFilters(where, forcedFilters, fieldMapper);
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
        applyJoinArguments(findManyOptions, params.entityType.name, args.join, fieldMapper);
    }
    return findManyOptions;
}
export const AgGridArgsFactory = (data, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const params = mapAgGridParams(data, gqlCtx, gqlCtx.getArgs(), gqlCtx.getInfo());
    return params;
};
export const AgGridArgsMapper = createParamDecorator(AgGridArgsFactory);
export const AgGridCombineDecorators = (params) => {
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
    const mapper = AgGridArgsMapper(params);
    return function (target, key, index) {
        args(target, key, index);
        joinArg && joinArg(target, key, index);
        argDecorators.map((d) => d(target, key, index));
        mapper(target, key, index);
    };
};
export const AgGridArgs = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = returnValue(agQueryParamsFactory(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return AgGridCombineDecorators(params);
};
export const AgGridArgsNoPagination = (params) => {
    const gqlOptions = params.gql ?? {};
    if (!gqlOptions.type) {
        gqlOptions.type = returnValue(agQueryParamsNoPaginationFactory(params.defaultValue, params.entityType));
    }
    params.gql = gqlOptions;
    return AgGridCombineDecorators(params);
};
export function AgGridArgsSingleDecoratorMapper(params, args, info) {
    const findManyOptions = {};
    if (params) {
        const fieldType = params.fieldType ?? params.entityType;
        if (fieldType) {
            const fieldMapper = objectToFieldMapper(fieldType);
            const { keys, keysMeta } = GqlAgGridFieldsMapper(fieldType, info);
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
export const AgGridArgsSingleDecoratorFactory = (data, ctx) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    return AgGridArgsSingleDecoratorMapper(data, gqlCtx.getArgs(), gqlCtx.getInfo());
};
export const AgGridArgsSingleDecorator = createParamDecorator(AgGridArgsSingleDecoratorFactory);
export const AgGridArgsSingle = (params) => {
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
    const mapper = AgGridArgsSingleDecorator(params);
    return function (target, key, index) {
        joinArg && joinArg(target, key, index);
        mapper(target, key, index);
    };
};
//# sourceMappingURL=ag-grid-args.decorator.js.map