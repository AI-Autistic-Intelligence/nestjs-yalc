"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAskingForCount = exports.forceFilterWorker = exports.forceFilters = void 0;
exports.whereObjectToSqlString = whereObjectToSqlString;
exports.filterTypeToNativeType = filterTypeToNativeType;
exports.applyJoinArguments = applyJoinArguments;
exports.isFilterExpressionInput = isFilterExpressionInput;
exports.traverseFiltersAndApplyFunction = traverseFiltersAndApplyFunction;
exports.formatRawSelection = formatRawSelection;
exports.applySelectOnFind = applySelectOnFind;
const query_builder_helper_1 = require("@nest-yalc-2/database/query-builder.helper");
const typeorm_1 = require("typeorm");
const ag_grid_args_decorator_1 = require("./ag-grid-args.decorator");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
const ag_grid_type_checker_utils_1 = require("./ag-grid-type-checker.utils");
const ag_grid_enum_1 = require("./ag-grid.enum");
const ag_grid_error_1 = require("./ag-grid.error");
const ag_grid_input_1 = require("./ag-grid.input");
const forceFilters = (where, properties, fieldMap) => {
    if (typeof where === 'string') {
        throw new ag_grid_error_1.AgGridStringWhereError();
    }
    for (const property of properties) {
        if (property.value) {
            where = (0, exports.forceFilterWorker)(where, (0, ag_grid_metadata_helper_1.columnConversion)(property.key, fieldMap), property.value, property.descriptors);
        }
    }
    if (where) {
        return where;
    }
    else {
        throw new ag_grid_error_1.AgGridNotPossibleError();
    }
};
exports.forceFilters = forceFilters;
const forceFilterWorker = (where, target, value, descriptors) => {
    const filter = descriptors
        ? (0, ag_grid_args_decorator_1.getFindOperator)(descriptors.filterType, descriptors.filterCondition, value)
        : (0, typeorm_1.Equal)(value);
    if (where && where.filters) {
        where.filters[target] = filter;
    }
    else {
        where = { filters: {} };
        where.filters[target] = filter;
    }
    return where;
};
exports.forceFilterWorker = forceFilterWorker;
function whereObjectToSqlString(queryBuilder, where, alias, fieldMap) {
    let sql = '';
    const operator = (where.operator ?? ag_grid_enum_1.Operators.AND).toUpperCase();
    if (Array.isArray(where.childExpressions)) {
        where.childExpressions.forEach((childExpression) => {
            const generatedSql = whereObjectToSqlString(queryBuilder, childExpression, alias);
            if (!generatedSql)
                return;
            sql += `(${generatedSql}) ${operator} `;
        });
    }
    if (!where.filters)
        return sql;
    for (const key of Object.keys(where.filters)) {
        const operation = where.filters[key];
        if (operation.operator !== undefined) {
            if ((0, ag_grid_type_checker_utils_1.isCombinedWhereModel)(operation) &&
                !(0, ag_grid_type_checker_utils_1.isCombinedWhereModel)(operation.filter_1) &&
                !(0, ag_grid_type_checker_utils_1.isCombinedWhereModel)(operation.filter_2)) {
                sql += `(${query_builder_helper_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_1, query_builder_helper_1.QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.filter_1.value)} ${operation.operator.toUpperCase()} ${query_builder_helper_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_2, query_builder_helper_1.QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.filter_2.value)}) ${operator} `;
            }
            else {
                throw new ag_grid_error_1.AgGridConditionNotSupportedError();
            }
        }
        else if ((0, ag_grid_type_checker_utils_1.isFindOperator)(operation)) {
            sql += `${query_builder_helper_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation, query_builder_helper_1.QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.value)} ${operator} `;
        }
        else if (typeof operation === 'string') {
            sql += `${query_builder_helper_1.QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap)} ${operation} ${operator}`;
        }
        else {
            throw new ag_grid_error_1.AgGridConditionNotSupportedError(JSON.stringify(operation));
        }
    }
    sql = sql.substring(0, sql.lastIndexOf(operator));
    sql = sql.substring(0, sql.lastIndexOf(' '));
    return sql;
}
const isAskingForCount = (info) => {
    try {
        return (info.fieldNodes?.[0].selectionSet?.selections.some((item) => {
            return (item.name.value === 'pageData' &&
                item.selectionSet &&
                item.selectionSet.selections.some((subItem) => subItem.name.value === 'count'));
        }) ?? false);
    }
    catch (e) {
        return false;
    }
};
exports.isAskingForCount = isAskingForCount;
function filterTypeToNativeType(type) {
    switch (type) {
        case ag_grid_enum_1.FilterType.TEXT:
            return String;
        case ag_grid_enum_1.FilterType.DATE:
            return Date;
        case ag_grid_enum_1.FilterType.NUMBER:
            return Number;
        case ag_grid_enum_1.FilterType.SET:
            return Array;
    }
    throw new TypeError(`Filter type not supported for native conversion: ${type}`);
}
function applyJoinArguments(findManyOptions, alias, join, fieldMapper) {
    const _joinObject = {
        alias,
        innerJoinAndSelect: {},
        leftJoinAndSelect: {},
    };
    Object.keys(join).forEach((table) => {
        const j = join[table];
        switch (j.joinType) {
            case ag_grid_input_1.JoinTypes.INNER_JOIN:
                _joinObject.innerJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
            case ag_grid_input_1.JoinTypes.LEFT_JOIN:
            default:
                _joinObject.leftJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
        }
        const type = fieldMapper[table].gqlType?.();
        const _fieldMapper = type
            ? (0, ag_grid_metadata_helper_1.objectToFieldMapper)(type)
            : { field: {} };
        if (j.filters) {
            findManyOptions.where = (0, ag_grid_args_decorator_1.createWhere)(j.filters, _fieldMapper.field, table, findManyOptions.where);
        }
    });
    findManyOptions.join = _joinObject;
    findManyOptions.extra = {
        ...findManyOptions.extra,
        _aliasType: _joinObject.alias,
    };
}
function isFilterExpressionInput(filterInput) {
    const casted = filterInput;
    return !!casted.expressions;
}
function traverseFiltersAndApplyFunction(where, callback) {
    const filters = where.filters;
    for (const filter in filters) {
        callback(filters, filter);
    }
    if (Array.isArray(where.childExpressions)) {
        where.childExpressions.map((expr) => traverseFiltersAndApplyFunction(expr, callback));
    }
}
function formatRawSelection(selection, fieldName, prefix = '', onlyAlias = false) {
    let aliasPrefix = '';
    let _prefix = '';
    if (prefix) {
        aliasPrefix = prefix + '_';
        _prefix = prefix + `.`;
    }
    const alias = `${aliasPrefix}${fieldName}`;
    if (onlyAlias)
        return alias;
    selection = `${_prefix}${selection} AS \`${alias}\``;
    return selection;
}
function applySelectOnFind(findOptions, field, fieldMapper, alias = '', path = '') {
    if (path && !path.endsWith('.'))
        path = path + '.';
    const fieldName = field.toString();
    const dst = (0, ag_grid_metadata_helper_1.columnConversion)(fieldName, fieldMapper).toString();
    const key = path + dst;
    if (!findOptions.extra) {
        findOptions.extra = { _keysMeta: {} };
    }
    if (fieldMapper[fieldName]?.mode === 'derived' || path) {
        const keysMeta = findOptions.extra._keysMeta ?? {};
        if (keysMeta[key])
            return;
        keysMeta[key] = {
            fieldMapper: fieldMapper[fieldName],
            isNested: !!path,
            rawSelect: formatRawSelection(dst, fieldName, alias),
        };
        findOptions.extra._keysMeta = keysMeta;
    }
    else {
        const selection = findOptions.select ?? [];
        selection.push(key);
        findOptions.select = selection;
    }
}
//# sourceMappingURL=ag-grid-query.helper.js.map