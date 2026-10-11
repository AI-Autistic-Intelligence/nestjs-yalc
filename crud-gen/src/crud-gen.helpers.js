import { DataLoaderFactory, getDataloaderToken, } from '@nest-yalc-2/data-loader/index.js';
import { QueryBuilderHelper } from '@node-yalc/database/query-builder.helper.js';
import { isFieldMapper, } from '@node-yalc/interfaces/maps.interface.js';
import { Equal, getMetadataArgsStorage, } from 'typeorm';
import { createWhere, getFindOperator, } from './typeorm/crud-gen-args.helpers.js';
import { isCombinedWhereModel, isFindOperator, } from './crud-gen-type-checker.utils.js';
import { FilterType, Operators } from './crud-gen.enum.js';
import { CrudGenConditionNotSupportedError, CrudGenNotPossibleError, CrudGenStringWhereError, } from './crud-gen.error.js';
import { JoinTypes, } from './api-graphql/crud-gen-gql.interface.js';
import { CGExtendedRepositoryFactory, } from './typeorm/generic.repository.js';
import { resolverFactory, } from './api-graphql/generic.resolver.js';
import { GenericServiceFactory, } from './typeorm/generic.service.js';
import { getModelFieldMetadataList, getModelObjectMetadata, isDstExtended, } from './object.decorator.js';
export const columnConversion = (key, data) => {
    if (data) {
        const dst = data[key]?.dst ?? key;
        return getDestinationFieldName(dst);
    }
    return key;
};
export const getFieldMapperSrcByDst = (data, dst) => {
    if (data) {
        for (const src of Object.keys(data)) {
            if (data[src]?.dst === dst)
                return src;
        }
    }
    return dst;
};
export const isSymbolic = (data, key) => {
    if (data && data[key]) {
        return data[key].isSymbolic ? true : false;
    }
    else {
        return false;
    }
};
export const forceFilters = (where, properties, fieldMap) => {
    // typeORM where property can be a string as type but we do not allow to use
    // string with this filter. Should never happen though
    if (typeof where === 'string') {
        throw new CrudGenStringWhereError();
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
        throw new CrudGenNotPossibleError();
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
    const operator = (where.operator ?? Operators.AND).toUpperCase(); // first level is always AND
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
        //If we have an operator it means that the filter is combined, or it is a multicolumn
        if (operation.operator !== undefined) {
            //If it is a multicolumn then we convert all internal filters to the multicolumn and enclose the result in round brackets
            if (isCombinedWhereModel(operation) &&
                !isCombinedWhereModel(operation.filter_1) &&
                !isCombinedWhereModel(operation.filter_2)) {
                //If instead it is a combined filter then we will convert the first and second filters, enclosing them in brackets and using the operator
                sql += `(${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_1, QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.filter_1.value)} ${operation.operator.toUpperCase()} ${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation.filter_2, QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.filter_2.value)}) ${operator} `;
            }
            else {
                /**
                 * @todo handle the else (?) but it should not happen
                 */
                throw new CrudGenConditionNotSupportedError();
            }
        }
        else if (isFindOperator(operation)) {
            //If it is a normal filter then we simply convert it and add the operator
            sql += `${QueryBuilderHelper.computeFindOperatorExpression(queryBuilder, operation, QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap), operation.value)} ${operator} `;
        }
        else if (typeof operation === 'string') {
            sql += `${QueryBuilderHelper.addAlias(fixParam(key.toString()), alias && escapeFn(alias), fieldMap)} ${operation} ${operator} `;
        }
        else {
            throw new CrudGenConditionNotSupportedError(JSON.stringify(operation));
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
    //At the end of the cycle we will have an operator and an excess space, and we remove them
    sql = sql.substring(0, sql.lastIndexOf(operator));
    sql = sql.substring(0, sql.lastIndexOf(' '));
    return sql;
}
export function getDestinationFieldName(dst) {
    if (isDstExtended(dst)) {
        return dst.name;
    }
    return dst;
}
const objectToFieldMapperCache = new WeakMap();
export const objectToFieldMapper = (object) => {
    if ((typeof object === 'object' && object !== null) || typeof object === 'function') {
        const cached = objectToFieldMapperCache.get(object);
        if (cached) {
            return cached;
        }
    }
    let fieldMapper = { field: {} };
    fieldMapper.extraInfo = {};
    const objectMetadata = getModelObjectMetadata(object);
    if (objectMetadata) {
        fieldMapper.filterOption = objectMetadata;
        const fieldMetadataList = getModelFieldMetadataList(object);
        if (fieldMetadataList) {
            for (const propertyName of Object.keys(fieldMetadataList)) {
                const fieldMetadata = fieldMetadataList[propertyName];
                if (!fieldMetadata)
                    continue;
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
                        fieldMapper.extraInfo[src] = objectToFieldMapper(gqlType);
                    }
                }
            }
        }
    }
    else if (isFieldMapper(object)) {
        fieldMapper.field = object;
    }
    else if (isIFieldAndFilterMapper(object)) {
        fieldMapper = object;
    } /**
    @todo rework or delete, it throws an error with enum as gqlType
    
    else if (Object.keys(object).length !== 0) {
      console.trace(object);
      throw new TypeError(
        `This object is not compatible with IFieldMapper ${JSON.stringify(
          object,
        )}`,
      );
    } */
    if ((typeof object === 'object' && object !== null) || typeof object === 'function')
        objectToFieldMapperCache.set(object, fieldMapper);
    return fieldMapper;
};
export function isIFieldAndFilterMapper(val) {
    return val?.field !== undefined;
}
export function isProviderOverride(resolver) {
    const casted = resolver;
    return !!casted.provider;
}
export function CrudGenDependencyFactory({ entityModel, dataloader, resolver, service, repository, }) {
    const backend = CrudGenBackendFactory({
        entityModel,
        ...(service !== undefined ? { service } : {}),
        ...(dataloader !== undefined ? { dataloader } : {}),
        ...(repository !== undefined ? { repository } : {}),
    });
    const graphql = resolver !== false
        ? CrudGenGraphqlFactory({
            entityModel,
            resolver: resolver ?? {},
        })
        : { providers: [] };
    return {
        providers: [...backend.providers, ...graphql.providers],
        repository: backend.repository,
    };
}
export function CrudGenBackendFactory({ entityModel, dataloader, service, repository, }) {
    const providers = [];
    let dataLoaderToken;
    let serviceToken;
    if (service) {
        if (isProviderOverride(service)) {
            serviceToken = getProviderToken(service.provider.provide);
            providers.push(service.provider);
        }
        else {
            const provider = GenericServiceFactory(service.entityModel ?? entityModel, service.dbConnection, service.providerClass);
            serviceToken = getProviderToken(provider.provide);
            providers.push(provider);
            // We always want a string alias for this provider
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
            dataLoaderToken = getDataloaderToken(dataloader.entityModel ?? entityModel);
            providers.push(DataLoaderFactory(dataloader.databaseKey, dataloader.entityModel ?? entityModel, serviceToken));
        }
    }
    const result = {
        providers,
        repository: repository ?? CGExtendedRepositoryFactory(entityModel),
    };
    if (serviceToken !== undefined)
        result.serviceToken = serviceToken;
    if (dataLoaderToken !== undefined)
        result.dataLoaderToken = dataLoaderToken;
    return result;
}
export function CrudGenGraphqlFactory({ entityModel, resolver, serviceToken, dataLoaderToken, }) {
    if (isProviderOverride(resolver)) {
        return { providers: [resolver.provider] };
    }
    const resolverConfig = resolver;
    const resolverOptions = {
        ...resolverConfig,
        entityModel,
        service: {
            ...resolverConfig.service,
            ...((resolverConfig.service?.serviceToken ?? serviceToken) !== undefined ? { serviceToken: resolverConfig.service?.serviceToken ?? serviceToken } : {}),
            ...((resolverConfig.service?.dataLoaderToken ?? dataLoaderToken) !== undefined ? { dataLoaderToken: resolverConfig.service?.dataLoaderToken ?? dataLoaderToken } : {}),
        },
    };
    return { providers: [resolverFactory(resolverOptions)] };
}
export function getProviderToken(
// eslint-disable-next-line @typescript-eslint/ban-types
entity) {
    if (entity && typeof entity === 'object' && entity.provide) {
        return typeof entity.provide === 'function'
            ? entity.provide.name
            : entity.provide.toString();
    }
    return typeof entity === 'function' ? entity.name : entity.toString();
}
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
export const crudGenHelpersMockable = {
    getEntityRelations(entityModel, dto) {
        const relations = getMetadataArgsStorage().relations.filter((v) => typeof v.target !== 'string' &&
            (entityModel.prototype instanceof v.target || entityModel === v.target));
        const joinColumns = getMetadataArgsStorage().joinColumns.filter((v) => typeof v.target !== 'string' &&
            (entityModel.prototype instanceof v.target || entityModel === v.target));
        const crudGenMetadata = getModelFieldMetadataList(dto ?? entityModel);
        return relations.map((r) => {
            const agField = crudGenMetadata
                ? Object.values(crudGenMetadata).find((v) => v?.dst === r.propertyName)
                : { _propertyName: r.propertyName };
            const result = { relation: r };
            const join = joinColumns.find((j) => j.propertyName === r.propertyName);
            if (join !== undefined)
                result.join = join;
            if (agField !== undefined)
                result.agField = agField;
            return result;
        });
    }
};
export function getEntityRelations(entityModel, dto) {
    return crudGenHelpersMockable.getEntityRelations(entityModel, dto);
}
export function getTypeProperties(entityModel) {
    const columns = getMetadataArgsStorage().columns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    // to get crud-gen fields
    const fieldMetadataList = getModelFieldMetadataList(entityModel);
    if (fieldMetadataList) {
        for (const propertyName of Object.keys(fieldMetadataList)) {
            const fieldMetadata = fieldMetadataList[propertyName];
            if (!fieldMetadata)
                continue;
            if (fieldMetadata.mode !== 'derived') {
                // skip non virtual columns
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
export function getMappedTypeProperties(entityModel) {
    const fieldMapper = objectToFieldMapper(entityModel);
    const fieldMetadata = getModelFieldMetadataList(entityModel) ?? {};
    const propertyNames = new Set([
        ...getTypeProperties(entityModel).map((column) => column.propertyName),
        ...Object.keys(fieldMetadata),
    ]);
    return [...propertyNames].reduce((r, propertyName) => {
        const src = getFieldMapperSrcByDst(fieldMapper.field, propertyName);
        if (!fieldMapper.field[src]?.denyFilter)
            r.push(src);
        return r;
    }, new Array());
}
export function applyJoinArguments(findManyOptions, alias, join, fieldMapper) {
    const _joinObject = {
        alias,
        innerJoinAndSelect: {},
        leftJoinAndSelect: {},
    };
    Object.keys(join).forEach((table) => {
        const j = join[table];
        if (!j)
            return;
        switch (j.joinType) {
            case JoinTypes.INNER_JOIN:
                _joinObject.innerJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
            case JoinTypes.LEFT_JOIN:
            default:
                _joinObject.leftJoinAndSelect[table] = `${_joinObject.alias}.${table}`;
                break;
        }
        const type = fieldMapper[table]?.gqlType?.();
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
// TODO: refactoring formatRawSelection*
export function formatRawSelectionWithoutAlias(selection, prefix = '') {
    let _prefix = '';
    if (prefix) {
        _prefix = prefix + `.`;
    }
    selection = `${_prefix}${selection}`;
    return selection;
}
export function formatRawSelection(selection, fieldName, options = {}) {
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
/**
 * Derived fields need metadata attached in order to be processed by
 * the CrudGen Repository. Use this method to apply the proper
 * selection with metadata to a find option object
 */
export function applySelectOnFind(findOptions, field, fieldMapper, 
/**
 * If it's a nested field, you need to specify a path
 */
path = '') {
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
        // do not apply twice
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