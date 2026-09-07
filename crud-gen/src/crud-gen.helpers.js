"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToFieldMapper = exports.forceFilterWorker = exports.forceFilters = exports.isSymbolic = exports.getFieldMapperSrcByDst = exports.columnConversion = void 0;
exports.whereObjectToSqlString = whereObjectToSqlString;
exports.getDestinationFieldName = getDestinationFieldName;
exports.isIFieldAndFilterMapper = isIFieldAndFilterMapper;
exports.isProviderOverride = isProviderOverride;
exports.CrudGenDependencyFactory = CrudGenDependencyFactory;
exports.CrudGenBackendFactory = CrudGenBackendFactory;
exports.CrudGenGraphqlFactory = CrudGenGraphqlFactory;
exports.getProviderToken = getProviderToken;
exports.filterTypeToNativeType = filterTypeToNativeType;
exports.getEntityRelations = getEntityRelations;
exports.getTypeProperties = getTypeProperties;
exports.getMappedTypeProperties = getMappedTypeProperties;
exports.applyJoinArguments = applyJoinArguments;
exports.isFilterExpressionInput = isFilterExpressionInput;
exports.traverseFiltersAndApplyFunction = traverseFiltersAndApplyFunction;
exports.formatRawSelectionWithoutAlias = formatRawSelectionWithoutAlias;
exports.formatRawSelection = formatRawSelection;
exports.applySelectOnFind = applySelectOnFind;
const index_js_1 = require("@nest-yalc-2/data-loader/index.js");
const query_builder_helper_js_1 = require("@nest-yalc-2/database/query-builder.helper.js");
const maps_interface_js_1 = require("@nest-yalc-2/interfaces/maps.interface.js");
const typeorm_1 = require("typeorm");
const crud_gen_args_helpers_js_1 = require("./typeorm/crud-gen-args.helpers.js");
const crud_gen_type_checker_utils_js_1 = require("./crud-gen-type-checker.utils.js");
const crud_gen_enum_js_1 = require("./crud-gen.enum.js");
const crud_gen_error_js_1 = require("./crud-gen.error.js");
const crud_gen_gql_interface_js_1 = require("./api-graphql/crud-gen-gql.interface.js");
const generic_repository_js_1 = require("./typeorm/generic.repository.js");
const generic_resolver_js_1 = require("./api-graphql/generic.resolver.js");
const generic_service_js_1 = require("./typeorm/generic.service.js");
const object_decorator_js_1 = require("./object.decorator.js");
const columnConversion = (key, data) => {
    if (data) {
        const dst = data[key]?.dst ?? key;
        return getDestinationFieldName(dst);
    }
    return key;
};
exports.columnConversion = columnConversion;
const getFieldMapperSrcByDst = (data, dst) => {
    if (data) {
        for (const src of Object.keys(data)) {
            if (data[src].dst === dst)
                return src;
        }
    }
    return dst;
};
exports.getFieldMapperSrcByDst = getFieldMapperSrcByDst;
const isSymbolic = (data, key) => {
    if (data && data[key]) {
        return data[key].isSymbolic ? true : false;
    }
    else {
        return false;
    }
};
exports.isSymbolic = isSymbolic;
const forceFilters = (where, properties, fieldMap) => {
    if (typeof where === 'string') {
        throw new crud_gen_error_js_1.CrudGenStringWhereError();
    }
    for (const property of properties) {
        if (property.value) {
            where = (0, exports.forceFilterWorker)(where, (0, exports.columnConversion)(property.key, fieldMap), property.value, property.descriptors);
        }
    }
    if (where) {
        return where;
    }
    else {
        throw new crud_gen_error_js_1.CrudGenNotPossibleError();
    }
};
exports.forceFilters = forceFilters;
const forceFilterWorker = (where, target, value, descriptors) => {
    const filter = descriptors
        ? (0, crud_gen_args_helpers_js_1.getFindOperator)(descriptors.filterType, descriptors.filterCondition, value)
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
    const operator = (where.operator ?? crud_gen_enum_js_1.Operators.AND).toUpperCase();
    if (!where.filters)
        return sql;
    const connection = queryBuilder.connection;
    const escapeFn = connection.driver.escape;
    const fixParam = (param) => {
        const metadata = queryBuilder.expressionMap.mainAlias.metadata;
        const databaseColumn = metadata.columns.find((column) => column.propertyName === param);
        return escapeFn(databaseColumn?.databaseName ?? param);
    };
    for (const key of Object.keys(where.filters)) {
        const operation = where.filters[key] ?? {};
        if (operation.operator !== undefined) {
            if ((0, crud_gen_type_checker_utils_js_1.isCombinedWhereModel)(operation) &&
                !(0, crud_gen_type_checker_utils_js_1.isCombinedWhereModel)(operation.filter_1) &&
                !(0, crud_gen_type_checker_utils_js_1.isCombinedWhereModel)(operation.filter_2)) {
                sql += `(${query_builder_helper_js_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_1, query_builder_helper_js_1.QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.filter_1.value)} ${operation.operator.toUpperCase()} ${query_builder_helper_js_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_2, query_builder_helper_js_1.QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.filter_2.value)}) ${operator} `;
            }
            else {
                throw new crud_gen_error_js_1.CrudGenConditionNotSupportedError();
            }
        }
        else if ((0, crud_gen_type_checker_utils_js_1.isFindOperator)(operation)) {
            sql += `${query_builder_helper_js_1.QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation, query_builder_helper_js_1.QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.value)} ${operator} `;
        }
        else if (typeof operation === 'string') {
            sql += `${query_builder_helper_js_1.QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap)} ${operation} ${operator} `;
        }
        else {
            throw new crud_gen_error_js_1.CrudGenConditionNotSupportedError(JSON.stringify(operation));
        }
    }
    if (Array.isArray(where.childExpressions)) {
        where.childExpressions.forEach((childExpression) => {
            const generatedSql = whereObjectToSqlString(queryBuilder, childExpression, alias);
            if (!generatedSql)
                return;
            sql += `(${generatedSql}) ${operator} `;
        });
    }
    sql = sql.substring(0, sql.lastIndexOf(operator));
    sql = sql.substring(0, sql.lastIndexOf(' '));
    return sql;
}
function getDestinationFieldName(dst) {
    if ((0, object_decorator_js_1.isDstExtended)(dst)) {
        return dst.name;
    }
    return dst;
}
const objectToFieldMapperCache = new WeakMap();
const objectToFieldMapper = (object) => {
    if ((typeof object === 'object' && object !== null) || typeof object === 'function') {
        const cached = objectToFieldMapperCache.get(object);
        if (cached) {
            return cached;
        }
    }
    let fieldMapper = { field: {} };
    fieldMapper.extraInfo = {};
    const objectMetadata = (0, object_decorator_js_1.getModelObjectMetadata)(object);
    if (objectMetadata) {
        fieldMapper.filterOption = objectMetadata;
        const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(object);
        if (fieldMetadataList) {
            for (const propertyName of Object.keys(fieldMetadataList)) {
                const fieldMetadata = fieldMetadataList[propertyName];
                const { src, dst, ...fieldMapperProperties } = fieldMetadata;
                if (src) {
                    const newDst = dst ? getDestinationFieldName(dst) : src;
                    fieldMapper.field[src] = {
                        dst: newDst,
                        ...fieldMapperProperties,
                        _propertyName: propertyName,
                    };
                    const gqlType = fieldMetadata.gqlType?.();
                    if (gqlType) {
                        fieldMapper.extraInfo[src] = (0, exports.objectToFieldMapper)(gqlType);
                    }
                }
            }
        }
    }
    else if ((0, maps_interface_js_1.isFieldMapper)(object)) {
        fieldMapper.field = object;
    }
    else if (isIFieldAndFilterMapper(object)) {
        fieldMapper = object;
    }
    if ((typeof object === 'object' && object !== null) || typeof object === 'function')
        objectToFieldMapperCache.set(object, fieldMapper);
    return fieldMapper;
};
exports.objectToFieldMapper = objectToFieldMapper;
function isIFieldAndFilterMapper(val) {
    return val?.field !== undefined;
}
function isProviderOverride(resolver) {
    const casted = resolver;
    return !!casted.provider;
}
function CrudGenDependencyFactory({ entityModel, dataloader, resolver, service, repository, }) {
    const backend = CrudGenBackendFactory({
        entityModel,
        service,
        dataloader,
        repository,
    });
    const graphql = resolver !== false
        ? CrudGenGraphqlFactory({
            entityModel,
            resolver: resolver ?? {},
            serviceToken: backend.serviceToken,
            dataLoaderToken: backend.dataLoaderToken,
        })
        : { providers: [] };
    return {
        providers: [...backend.providers, ...graphql.providers],
        repository: backend.repository,
    };
}
function CrudGenBackendFactory({ entityModel, dataloader, service, repository, }) {
    const providers = [];
    let dataLoaderToken;
    let serviceToken;
    if (service) {
        if (isProviderOverride(service)) {
            serviceToken = getProviderToken(service.provider.provide);
            providers.push(service.provider);
        }
        else {
            const provider = (0, generic_service_js_1.GenericServiceFactory)(service.entityModel ?? entityModel, service.dbConnection, service.providerClass);
            serviceToken = getProviderToken(provider.provide);
            providers.push(provider);
            if (typeof provider.provide !== 'string') {
                providers.push({
                    provide: serviceToken,
                    useExisting: provider.provide,
                });
            }
        }
    }
    if (dataloader) {
        if (isProviderOverride(dataloader)) {
            dataLoaderToken = getProviderToken(dataloader.provider.provide);
            providers.push(dataloader.provider);
        }
        else {
            dataLoaderToken = (0, index_js_1.getDataloaderToken)(dataloader.entityModel ?? entityModel);
            providers.push((0, index_js_1.DataLoaderFactory)(dataloader.databaseKey, dataloader.entityModel ?? entityModel, serviceToken));
        }
    }
    return {
        providers,
        repository: repository ?? (0, generic_repository_js_1.CGExtendedRepositoryFactory)(entityModel),
        serviceToken,
        dataLoaderToken,
    };
}
function CrudGenGraphqlFactory({ entityModel, resolver, serviceToken, dataLoaderToken, }) {
    if (isProviderOverride(resolver)) {
        return { providers: [resolver.provider] };
    }
    const resolverConfig = resolver;
    const resolverOptions = {
        ...resolverConfig,
        entityModel,
        service: {
            ...resolverConfig.service,
            serviceToken: resolverConfig.service?.serviceToken ?? serviceToken,
            dataLoaderToken: resolverConfig.service?.dataLoaderToken ?? dataLoaderToken,
        },
    };
    return { providers: [(0, generic_resolver_js_1.resolverFactory)(resolverOptions)] };
}
function getProviderToken(entity) {
    if (entity && typeof entity === 'object' && entity.provide) {
        return typeof entity.provide === 'function'
            ? entity.provide.name
            : entity.provide.toString();
    }
    return typeof entity === 'function' ? entity.name : entity.toString();
}
function filterTypeToNativeType(type) {
    switch (type) {
        case crud_gen_enum_js_1.FilterType.TEXT:
            return String;
        case crud_gen_enum_js_1.FilterType.DATE:
            return Date;
        case crud_gen_enum_js_1.FilterType.NUMBER:
            return Number;
        case crud_gen_enum_js_1.FilterType.SET:
            return Array;
    }
    throw new TypeError(`Filter type not supported for native conversion: ${type}`);
}
function getEntityRelations(entityModel, dto) {
    const relations = (0, typeorm_1.getMetadataArgsStorage)().relations.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const joinColumns = (0, typeorm_1.getMetadataArgsStorage)().joinColumns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const crudGenMetadata = (0, object_decorator_js_1.getModelFieldMetadataList)(dto ?? entityModel);
    return relations.map((r) => ({
        relation: r,
        join: joinColumns.find((j) => j.propertyName === r.propertyName),
        agField: crudGenMetadata
            ? Object.values(crudGenMetadata).find((v) => v.dst === r.propertyName)
            : { _propertyName: r.propertyName },
    }));
}
function getTypeProperties(entityModel) {
    const columns = (0, typeorm_1.getMetadataArgsStorage)().columns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(entityModel);
    if (fieldMetadataList) {
        for (const propertyName of Object.keys(fieldMetadataList)) {
            const fieldMetadata = fieldMetadataList[propertyName];
            if (fieldMetadata.mode !== 'derived') {
                continue;
            }
            columns.push({
                propertyName,
                target: entityModel,
                mode: 'regular',
                options: {},
            });
        }
    }
    return columns;
}
function getMappedTypeProperties(entityModel) {
    const fieldMapper = (0, exports.objectToFieldMapper)(entityModel);
    const fieldMetadata = (0, object_decorator_js_1.getModelFieldMetadataList)(entityModel) ?? {};
    const propertyNames = new Set([
        ...getTypeProperties(entityModel).map((column) => column.propertyName),
        ...Object.keys(fieldMetadata),
    ]);
    return [...propertyNames].reduce((r, propertyName) => {
        const src = (0, exports.getFieldMapperSrcByDst)(fieldMapper.field, propertyName);
        if (!fieldMapper.field[src]?.denyFilter)
            r.push(src);
        return r;
    }, new Array());
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
            case crud_gen_gql_interface_js_1.JoinTypes.INNER_JOIN:
                _joinObject.innerJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
            case crud_gen_gql_interface_js_1.JoinTypes.LEFT_JOIN:
            default:
                _joinObject.leftJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
        }
        const type = fieldMapper[table].gqlType?.();
        const _fieldMapper = type
            ? (0, exports.objectToFieldMapper)(type)
            : { field: {} };
        if (j.filters) {
            findManyOptions.where = (0, crud_gen_args_helpers_js_1.createWhere)(j.filters, _fieldMapper.field, table, findManyOptions.where);
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
function formatRawSelectionWithoutAlias(selection, prefix = '') {
    let _prefix = '';
    if (prefix) {
        _prefix = prefix + `.`;
    }
    selection = `${_prefix}${selection}`;
    return selection;
}
function formatRawSelection(selection, fieldName, options = {}) {
    const { prefix, onlyAlias, escapeCharacter } = {
        prefix: '',
        onlyAlias: false,
        escapeCharacter: '',
        ...options,
    };
    let aliasPrefix = '';
    let _prefix = '';
    if (prefix) {
        aliasPrefix = prefix + '_';
        _prefix = prefix + `.`;
    }
    const alias = `${aliasPrefix}${fieldName}`;
    if (onlyAlias)
        return alias;
    selection = `${_prefix}${selection} AS ${escapeCharacter}${alias}${escapeCharacter}`;
    return selection;
}
function applySelectOnFind(findOptions, field, fieldMapper, path = '') {
    if (path && !path.endsWith('.'))
        path = path + '.';
    const fieldName = field.toString();
    const dst = (0, exports.columnConversion)(fieldName, fieldMapper).toString();
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
            rawSelect: formatRawSelectionWithoutAlias(dst),
        };
        findOptions.extra._keysMeta = keysMeta;
    }
    else {
        const selection = findOptions.select ?? [];
        if (Array.isArray(selection))
            selection.push(key);
        findOptions.select = selection;
    }
}
//# sourceMappingURL=crud-gen.helpers.js.map