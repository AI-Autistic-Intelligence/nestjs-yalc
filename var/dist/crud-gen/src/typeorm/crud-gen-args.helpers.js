import { DateHelper } from '@nestjs-yalc/utils/date.helper.js';
import { Equal, Like, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Between, In, IsNull, Not, } from 'typeorm';
import { isSetFilterModel, isDateFilterModel, isNumberFilterModel, isCombinedFilterModel, isFilterModel, isTextFilterModel, } from '../crud-gen-type-checker.utils.js';
import { GeneralFilters, FilterType, Operators, RowDefaultValues, } from '../crud-gen.enum.js';
import { CrudGenFilterNotSupportedError, CrudGenInvalidArgumentError, CrudGenInvalidOperatorError, CrudGenError, CrudGenFilterProhibited, } from '../crud-gen.error.js';
import { applyJoinArguments, columnConversion, formatRawSelectionWithoutAlias, getDestinationFieldName, isSymbolic, objectToFieldMapper, } from '../crud-gen.helpers.js';
import { FilterOptionType } from '../object.decorator.js';
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
            throw new CrudGenFilterNotSupportedError(`filter: ${filter} type: TEXT`);
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
            throw new CrudGenFilterNotSupportedError(`filter: ${filter} type: NUMBER`);
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
        case GeneralFilters.INDATE.toLowerCase(): {
            const dateFrom = new Date(firstParameter).setHours(0, 0, 0, 0);
            const dateTo = new Date(secondParameter ?? firstParameter).setHours(23, 59, 59, 999);
            return Between(DateHelper.dateToSQLDateTime(new Date(dateFrom)), DateHelper.dateToSQLDateTime(new Date(dateTo)));
        }
        default:
            throw new CrudGenFilterNotSupportedError(`filter: ${filter} type: DATE`);
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
        throw new CrudGenInvalidArgumentError();
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
            throw new CrudGenFilterNotSupportedError(`filter: ${filterName} type: ${filterType}`);
    }
}
export function convertFilter(filter) {
    if (isCombinedFilterModel(filter)) {
        if (filter.operator.toUpperCase() !== Operators.OR &&
            filter.operator.toUpperCase() !== Operators.AND) {
            throw new CrudGenInvalidOperatorError();
        }
        return {
            operator: filter.operator,
            filter_1: convertFilter(filter.condition1),
            filter_2: convertFilter(filter.condition2),
        };
    }
    if (!isFilterModel(filter))
        throw new CrudGenInvalidArgumentError();
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
        throw new CrudGenFilterNotSupportedError(`${JSON.stringify(filter)}`);
    }
    return filterToApply;
}
export function createWhere(filtersObject, fieldMapper, alias, where = { filters: {} }) {
    if (!filtersObject) {
        return where;
    }
    const prefix = alias ? `${alias}.` : '';
    const filtersObjectCleared = [];
    if (filtersObject.expressions) {
        Object.values(filtersObject.expressions).map((field) => {
            const exprTypes = Object.keys(field);
            if (exprTypes.length > 1) {
                throw new CrudGenError(`Field can't use more than one expression type on same expression: ${exprTypes}`);
            }
            const exprType = exprTypes[0];
            const expr = field[exprType];
            if (!expr || !expr.field)
                throw new Error('Expression not found! It should never happen');
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
            throw new CrudGenFilterNotSupportedError(`${JSON.stringify(expr)}`);
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
            throw new CrudGenFilterProhibited();
        }
    }
    const { childExpressions } = where;
    if (Array.isArray(childExpressions)) {
        childExpressions.forEach((expr) => checkFilterScope(expr, filterOption));
    }
}
export function mapCrudGenParam(params, select, args, options = {}) {
    let filterOption;
    let fieldMapper = {};
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    if (fieldType) {
        const fieldMapperAndFilter = objectToFieldMapper(fieldType);
        filterOption = fieldMapperAndFilter.filterOption;
        fieldMapper = fieldMapperAndFilter.field;
    }
    const defaultSorting = params?.defaultValue?.sorting;
    const where = args.filters
        ? createWhere(args.filters, fieldMapper)
        : { filters: {} };
    if (filterOption) {
        checkFilterScope(where, filterOption);
    }
    const order = mapSortingParamsToTypeORM(args.sorting ?? defaultSorting ?? [], (col) => {
        let colName = col.toString();
        if (fieldMapper[colName]?.mode === 'derived') {
            colName = formatRawSelectionWithoutAlias(getDestinationFieldName(fieldMapper[colName].dst));
        }
        else {
            colName = columnConversion(colName, fieldMapper);
        }
        return colName;
    });
    const { take, skip } = mapPaginationParamsToTypeORM(args.startRow, args.endRow, params?.options?.maxRow);
    const skipCount = !options.isCount;
    const findManyOptions = {
        skip,
        take,
        order,
        select: select.keys,
        where,
        extra: {
            skipCount,
            _fieldMapper: fieldMapper,
            _keysMeta: select.keysMeta,
        },
    };
    if (params?.entityType && args.join) {
        applyJoinArguments(findManyOptions, params.entityType.name, args.join, fieldMapper);
    }
    return findManyOptions;
}
export function mapPaginationParamsToTypeORM(startRow, endRow, maxRow) {
    const max = maxRow ?? RowDefaultValues.MAX_ROW;
    const skip = startRow ?? RowDefaultValues.START_ROW;
    const checkMaxRow = (requestRow) => {
        if (max === 0 || requestRow < max) {
            return requestRow;
        }
        else {
            throw new CrudGenError(`Invalid max number of row selected: cannot exeed max ${max}`);
        }
    };
    const numericEndRow = typeof endRow === 'number' && !Number.isNaN(endRow) ? endRow : undefined;
    const requested = typeof numericEndRow === 'number' ? numericEndRow - skip : undefined;
    const take = requested !== undefined ? checkMaxRow(requested) : max;
    return { skip, take };
}
export function mapSortingParamsToTypeORM(sorting, transform) {
    const order = {};
    if (Array.isArray(sorting)) {
        sorting.forEach((sortParams) => {
            const col = sortParams.colId;
            const colName = transform?.(col) ?? col;
            const val = sortParams.sort?.toUpperCase();
            const sortDir = val ?? 'ASC';
            order[colName] = sortDir;
        });
    }
    return order;
}
//# sourceMappingURL=crud-gen-args.helpers.js.map