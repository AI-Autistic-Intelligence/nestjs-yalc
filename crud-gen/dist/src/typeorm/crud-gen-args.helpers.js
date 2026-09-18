"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.mapCrudGenParam = mapCrudGenParam;
exports.mapPaginationParamsToTypeORM = mapPaginationParamsToTypeORM;
exports.mapSortingParamsToTypeORM = mapSortingParamsToTypeORM;
const date_helper_js_1 = require("@nest-yalc-2/utils/date.helper.js");
const typeorm_1 = require("typeorm");
const crud_gen_type_checker_utils_js_1 = require("../crud-gen-type-checker.utils.js");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
const crud_gen_error_js_1 = require("../crud-gen.error.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const object_decorator_js_1 = require("../object.decorator.js");
function getTextFilter(filter, firstParameter) {
    switch (filter.toLowerCase()) {
        case crud_gen_enum_js_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.STARTSWITH.toLowerCase():
            return (0, typeorm_1.Like)(`${firstParameter}%`);
        case crud_gen_enum_js_1.GeneralFilters.ENDSWITH.toLowerCase():
            return (0, typeorm_1.Like)(`%${firstParameter}`);
        case crud_gen_enum_js_1.GeneralFilters.CONTAINS.toLowerCase():
        case crud_gen_enum_js_1.GeneralFilters.LIKE.toLowerCase():
            return (0, typeorm_1.Like)(`%${firstParameter}%`);
        default:
            throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`filter: ${filter} type: TEXT`);
    }
}
function getNumberFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case crud_gen_enum_js_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.LESSTHAN.toLowerCase():
            return (0, typeorm_1.LessThan)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.LESSTHANOREQUAL.toLowerCase():
            return (0, typeorm_1.LessThanOrEqual)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.GREATERTHAN.toLowerCase():
            return (0, typeorm_1.MoreThan)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.GREATERTHANOREQUAL.toLowerCase():
            return (0, typeorm_1.MoreThanOrEqual)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.INRANGE.toLowerCase():
            return (0, typeorm_1.Between)(firstParameter, secondParameter);
        default:
            throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`filter: ${filter} type: NUMBER`);
    }
}
function getDateFilter(filter, firstParameter, secondParameter) {
    switch (filter.toLowerCase()) {
        case crud_gen_enum_js_1.GeneralFilters.EQUALS.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.EQUAL.toLowerCase():
            return (0, typeorm_1.Equal)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.LESSTHAN.toLowerCase():
            return (0, typeorm_1.LessThan)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.GREATERTHAN.toLowerCase():
            return (0, typeorm_1.MoreThan)(firstParameter);
        case crud_gen_enum_js_1.GeneralFilters.INRANGE.toLowerCase():
            return (0, typeorm_1.Between)(firstParameter, secondParameter);
        case crud_gen_enum_js_1.GeneralFilters.INDATE.toLowerCase(): {
            const dateFrom = new Date(firstParameter).setHours(0, 0, 0, 0);
            const dateTo = new Date(secondParameter ?? firstParameter).setHours(23, 59, 59, 999);
            return (0, typeorm_1.Between)(date_helper_js_1.DateHelper.dateToSQLDateTime(new Date(dateFrom)), date_helper_js_1.DateHelper.dateToSQLDateTime(new Date(dateTo)));
        }
        default:
            throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`filter: ${filter} type: DATE`);
    }
}
function filterSwitch(filter, filterName) {
    let arg1 = undefined;
    let arg2 = undefined;
    if ((0, crud_gen_type_checker_utils_js_1.isSetFilterModel)(filter)) {
        return (0, typeorm_1.In)(filter.values);
    }
    if ((0, crud_gen_type_checker_utils_js_1.isDateFilterModel)(filter)) {
        arg1 = filter.dateFrom;
        arg2 = filter.dateTo;
    }
    else if ((0, crud_gen_type_checker_utils_js_1.isNumberFilterModel)(filter)) {
        arg1 = filter.filter;
        arg2 = filter.filterTo;
    }
    else {
        arg1 = filter.filter;
    }
    if (arg1 === undefined) {
        throw new crud_gen_error_js_1.CrudGenInvalidArgumentError();
    }
    filterName = filterName ?? filter.type;
    return getFindOperator(filter.filterType, filterName, arg1, arg2);
}
function getFindOperator(filterType, filterName, arg1, arg2) {
    if (filterName.toLowerCase() === crud_gen_enum_js_1.GeneralFilters.ISNULL.toLowerCase()) {
        return (0, typeorm_1.IsNull)();
    }
    switch (filterType) {
        case crud_gen_enum_js_1.FilterType.TEXT:
            return getTextFilter(filterName, arg1);
        case crud_gen_enum_js_1.FilterType.NUMBER:
            return getNumberFilter(filterName, arg1, arg2);
        case crud_gen_enum_js_1.FilterType.DATE:
            return getDateFilter(filterName, arg1, arg2);
        case crud_gen_enum_js_1.FilterType.SET:
            return (0, typeorm_1.In)(arg1);
        default:
            throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`filter: ${filterName} type: ${filterType}`);
    }
}
function convertFilter(filter) {
    if ((0, crud_gen_type_checker_utils_js_1.isCombinedFilterModel)(filter)) {
        if (filter.operator.toUpperCase() !== crud_gen_enum_js_1.Operators.OR &&
            filter.operator.toUpperCase() !== crud_gen_enum_js_1.Operators.AND) {
            throw new crud_gen_error_js_1.CrudGenInvalidOperatorError();
        }
        return {
            operator: filter.operator,
            filter_1: convertFilter(filter.condition1),
            filter_2: convertFilter(filter.condition2),
        };
    }
    if (!(0, crud_gen_type_checker_utils_js_1.isFilterModel)(filter))
        throw new crud_gen_error_js_1.CrudGenInvalidArgumentError();
    let filterToApply;
    if (!(0, crud_gen_type_checker_utils_js_1.isSetFilterModel)(filter) &&
        filter.type.startsWith('not') &&
        filter.type !== crud_gen_enum_js_1.GeneralFilters.NOT) {
        filterToApply = (0, typeorm_1.Not)(filterSwitch(filter, filter.type.substring(3)));
    }
    else {
        filterToApply = filterSwitch(filter);
    }
    return filterToApply;
}
function resolveFilter(filter) {
    let filterToApply;
    if ((0, crud_gen_type_checker_utils_js_1.isTextFilterModel)(filter) ||
        (0, crud_gen_type_checker_utils_js_1.isNumberFilterModel)(filter) ||
        (0, crud_gen_type_checker_utils_js_1.isDateFilterModel)(filter) ||
        (0, crud_gen_type_checker_utils_js_1.isSetFilterModel)(filter)) {
        filterToApply = convertFilter(filter);
    }
    else {
        throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`${JSON.stringify(filter)}`);
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
                throw new crud_gen_error_js_1.CrudGenError(`Field can't use more than one expression type on same expression: ${exprTypes}`);
            }
            const exprType = exprTypes[0];
            const expr = field[exprType];
            if (!expr || !expr.field)
                throw new Error('Expression not found! It should never happen');
            const dbFieldName = (0, crud_gen_helpers_js_1.columnConversion)(expr.field, fieldMapper);
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
        if ((0, crud_gen_type_checker_utils_js_1.isFilterModel)(expr) || (0, crud_gen_type_checker_utils_js_1.isCombinedFilterModel)(expr)) {
            childExpressions.push({
                filters: { [key]: resolveFilter(expr) },
            });
        }
        else {
            throw new crud_gen_error_js_1.CrudGenFilterNotSupportedError(`${JSON.stringify(expr)}`);
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
        if ((0, crud_gen_helpers_js_1.isSymbolic)(data, path + select[i])) {
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
            (filterOption.type === object_decorator_js_1.FilterOptionType.INCLUDE
                ? !filterOption.fields.includes(key)
                : filterOption.fields.includes(key))) {
            throw new crud_gen_error_js_1.CrudGenFilterProhibited();
        }
    }
    const { childExpressions } = where;
    if (Array.isArray(childExpressions)) {
        childExpressions.forEach((expr) => checkFilterScope(expr, filterOption));
    }
}
function mapCrudGenParam(params, select, args, options = {}) {
    let filterOption;
    let fieldMapper = {};
    const fieldType = params?.fieldType ?? params?.fieldMap ?? params?.entityType;
    if (fieldType) {
        const fieldMapperAndFilter = (0, crud_gen_helpers_js_1.objectToFieldMapper)(fieldType);
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
            colName = (0, crud_gen_helpers_js_1.formatRawSelectionWithoutAlias)((0, crud_gen_helpers_js_1.getDestinationFieldName)(fieldMapper[colName].dst));
        }
        else {
            colName = (0, crud_gen_helpers_js_1.columnConversion)(colName, fieldMapper);
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
        (0, crud_gen_helpers_js_1.applyJoinArguments)(findManyOptions, params.entityType.name, args.join, fieldMapper);
    }
    return findManyOptions;
}
function mapPaginationParamsToTypeORM(startRow, endRow, maxRow) {
    const max = maxRow ?? crud_gen_enum_js_1.RowDefaultValues.MAX_ROW;
    const skip = startRow ?? crud_gen_enum_js_1.RowDefaultValues.START_ROW;
    const checkMaxRow = (requestRow) => {
        if (max === 0 || requestRow < max) {
            return requestRow;
        }
        else {
            throw new crud_gen_error_js_1.CrudGenError(`Invalid max number of row selected: cannot exeed max ${max}`);
        }
    };
    const numericEndRow = typeof endRow === 'number' && !Number.isNaN(endRow) ? endRow : undefined;
    const requested = typeof numericEndRow === 'number' ? numericEndRow - skip : undefined;
    const take = requested !== undefined ? checkMaxRow(requested) : max;
    return { skip, take };
}
function mapSortingParamsToTypeORM(sorting, transform) {
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