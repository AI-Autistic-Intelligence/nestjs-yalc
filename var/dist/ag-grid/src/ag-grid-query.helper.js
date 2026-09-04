import { QueryBuilderHelper } from '@nestjs-yalc/database/query-builder.helper';
import { Equal } from 'typeorm';
import { createWhere, getFindOperator } from './ag-grid-args.decorator';
import { columnConversion, objectToFieldMapper } from "./ag-grid-metadata.helper";
import { isCombinedWhereModel, isFindOperator, } from './ag-grid-type-checker.utils';
import { FilterType, Operators } from './ag-grid.enum';
import { AgGridConditionNotSupportedError, AgGridNotPossibleError, AgGridStringWhereError, } from './ag-grid.error';
import { JoinTypes } from './ag-grid.input';
export const forceFilters = (where, properties, fieldMap) => {
    if (typeof where === 'string') {
        throw new AgGridStringWhereError();
    }
    for (const property of properties) {
        if (property.value) {
            where = forceFilterWorker(where, columnConversion(property.key, fieldMap), property.value, property.descriptors);
        }
    }
    if (where) {
        return where;
    }
    else {
        throw new AgGridNotPossibleError();
    }
};
export const forceFilterWorker = (where, target, value, descriptors) => {
    const filter = descriptors
        ? getFindOperator(descriptors.filterType, descriptors.filterCondition, value)
        : Equal(value);
    if (where && where.filters) {
        where.filters[target] = filter;
    }
    else {
        where = { filters: {} };
        where.filters[target] = filter;
    }
    return where;
};
export function whereObjectToSqlString(queryBuilder, where, alias, fieldMap) {
    let sql = '';
    const operator = (where.operator ?? Operators.AND).toUpperCase();
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
            if (isCombinedWhereModel(operation) &&
                !isCombinedWhereModel(operation.filter_1) &&
                !isCombinedWhereModel(operation.filter_2)) {
                sql += `(${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_1, QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.filter_1.value)} ${operation.operator.toUpperCase()} ${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_2, QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.filter_2.value)}) ${operator} `;
            }
            else {
                throw new AgGridConditionNotSupportedError();
            }
        }
        else if (isFindOperator(operation)) {
            sql += `${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation, QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap), operation.value)} ${operator} `;
        }
        else if (typeof operation === 'string') {
            sql += `${QueryBuilderHelper.addAlias(key.toString(), alias, fieldMap)} ${operation} ${operator}`;
        }
        else {
            throw new AgGridConditionNotSupportedError(JSON.stringify(operation));
        }
    }
    sql = sql.substring(0, sql.lastIndexOf(operator));
    sql = sql.substring(0, sql.lastIndexOf(' '));
    return sql;
}
export const isAskingForCount = (info) => {
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
export function filterTypeToNativeType(type) {
    switch (type) {
        case FilterType.TEXT:
            return String;
        case FilterType.DATE:
            return Date;
        case FilterType.NUMBER:
            return Number;
        case FilterType.SET:
            return Array;
    }
    throw new TypeError(`Filter type not supported for native conversion: ${type}`);
}
export function applyJoinArguments(findManyOptions, alias, join, fieldMapper) {
    const _joinObject = {
        alias,
        innerJoinAndSelect: {},
        leftJoinAndSelect: {},
    };
    Object.keys(join).forEach((table) => {
        const j = join[table];
        switch (j.joinType) {
            case JoinTypes.INNER_JOIN:
                _joinObject.innerJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
            case JoinTypes.LEFT_JOIN:
            default:
                _joinObject.leftJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
        }
        const type = fieldMapper[table].gqlType?.();
        const _fieldMapper = type
            ? objectToFieldMapper(type)
            : { field: {} };
        if (j.filters) {
            findManyOptions.where = createWhere(j.filters, _fieldMapper.field, table, findManyOptions.where);
        }
    });
    findManyOptions.join = _joinObject;
    findManyOptions.extra = {
        ...findManyOptions.extra,
        _aliasType: _joinObject.alias,
    };
}
export function isFilterExpressionInput(filterInput) {
    const casted = filterInput;
    return !!casted.expressions;
}
export function traverseFiltersAndApplyFunction(where, callback) {
    const filters = where.filters;
    for (const filter in filters) {
        callback(filters, filter);
    }
    if (Array.isArray(where.childExpressions)) {
        where.childExpressions.map((expr) => traverseFiltersAndApplyFunction(expr, callback));
    }
}
export function formatRawSelection(selection, fieldName, prefix = '', onlyAlias = false) {
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
export function applySelectOnFind(findOptions, field, fieldMapper, alias = '', path = '') {
    if (path && !path.endsWith('.'))
        path = path + '.';
    const fieldName = field.toString();
    const dst = columnConversion(fieldName, fieldMapper).toString();
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