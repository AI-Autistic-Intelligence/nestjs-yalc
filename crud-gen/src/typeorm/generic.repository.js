"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGExtendedRepository = exports.GenericTypeORMRepository = exports.PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES = exports.AG_GRID_MAIN_ALIAS = void 0;
exports.CGExtendedRepositoryFactory = CGExtendedRepositoryFactory;
const query_builder_helper_js_1 = require("@nestjs-yalc/database/query-builder.helper.js");
const typeorm_1 = require("typeorm");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
require("../query-builder.helpers.js");
exports.AG_GRID_MAIN_ALIAS = 'CrudGenMainAlias';
exports.PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES = {
    extendedQueries: false,
    structuredGraphqlFilters: false,
};
class GenericTypeORMRepository extends typeorm_1.Repository {
    getCrudGenCapabilities() {
        return {
            extendedQueries: true,
            structuredGraphqlFilters: true,
        };
    }
    supportsExtendedRepository() {
        return this.getCrudGenCapabilities().extendedQueries;
    }
    getActualLimits(findOptions) {
        var _a, _b;
        if (findOptions.subQueryFilters) {
            return {
                skip: (_a = findOptions.skip) !== null && _a !== void 0 ? _a : findOptions.subQueryFilters.skip,
                take: (_b = findOptions.take) !== null && _b !== void 0 ? _b : findOptions.subQueryFilters.take,
            };
        }
        return { skip: findOptions.skip, take: findOptions.take };
    }
    getFormattedCrudGenQueryBuilder(findOptions, fieldMap, qb) {
        const { order, where, info, skip, take, extra, join } = findOptions, strippedFindOptions = __rest(findOptions, ["order", "where", "info", "skip", "take", "extra", "join"]);
        if (!findOptions.select) {
            strippedFindOptions.select = [];
        }
        const queryBuilder = qb !== null && qb !== void 0 ? qb : this.createQueryBuilder(extra === null || extra === void 0 ? void 0 : extra._aliasType);
        const connection = queryBuilder.connection;
        const rawSelection = [];
        const joinSelection = [];
        const customSel = extra === null || extra === void 0 ? void 0 : extra._keysMeta;
        if (customSel) {
            Object.values(customSel).forEach((v) => {
                const meta = v;
                const _mapper = meta === null || meta === void 0 ? void 0 : meta.fieldMapper;
                const isNested = meta === null || meta === void 0 ? void 0 : meta.isNested;
                const isDerived = (_mapper === null || _mapper === void 0 ? void 0 : _mapper.mode) === 'derived';
                if (meta && isDerived) {
                    const selPart = `${meta.rawSelect} AS ${connection.driver.escape(`${queryBuilder.alias}_${meta.fieldMapper._propertyName}`)}`;
                    if (isNested) {
                        joinSelection.push(selPart);
                    }
                    else {
                        rawSelection.push(selPart);
                    }
                }
            });
        }
        let joinCopy;
        const customJoinToApply = [];
        if (join) {
            joinCopy = Object.assign({}, join);
            const processRelationExtraConditions = (joinType, joinInfo) => {
                if (!joinInfo)
                    return;
                Object.keys(joinInfo).forEach((key) => {
                    var _a;
                    const fieldInfo = (_a = extra === null || extra === void 0 ? void 0 : extra._fieldMapper) === null || _a === void 0 ? void 0 : _a[key];
                    if (!(fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.relation))
                        return;
                    const relation = fieldInfo.relation;
                    const type = joinType === 'left' ? 'leftJoinAndSelect' : 'innerJoinAndSelect';
                    customJoinToApply.push((qb) => {
                        var _a;
                        const alias = (_a = extra === null || extra === void 0 ? void 0 : extra._aliasType) !== null && _a !== void 0 ? _a : '';
                        qb[type](`${alias}.${key}`, `${key}`, `${key}.${relation.targetKey.dst} = ${relation.sourceKey.dst}`);
                    });
                    delete joinInfo[key];
                });
            };
            processRelationExtraConditions('inner', joinCopy.innerJoinAndSelect);
            processRelationExtraConditions('left', joinCopy.leftJoinAndSelect);
        }
        queryBuilder.setFindOptions(Object.assign(Object.assign({}, strippedFindOptions), { join: joinCopy }));
        rawSelection.length > 0 && queryBuilder.addSelect(rawSelection);
        if (join) {
            joinSelection.length > 0 && queryBuilder.addSelect(joinSelection);
            customJoinToApply.forEach((fn) => fn(queryBuilder));
        }
        if (extra && extra.rawLimit === true) {
            queryBuilder.offset(skip).limit(take);
        }
        else {
            queryBuilder.skip(skip).take(take);
        }
        if (where) {
            const stringWhere = (0, crud_gen_helpers_js_1.whereObjectToSqlString)(queryBuilder, where, queryBuilder.alias, fieldMap);
            queryBuilder.where(stringWhere);
        }
        const sortingColumns = query_builder_helper_js_1.QueryBuilderHelper.applyOrderToJoinedQueryBuilder(findOptions, queryBuilder.alias, fieldMap);
        sortingColumns.forEach((v) => {
            queryBuilder.addOrderBy(v.key, v.operator);
        });
        return queryBuilder;
    }
    getCrudGenQueryBuilder(findOptions, fieldMap) {
        var _a, _b;
        const queryBuilder = this.createQueryBuilder((_a = findOptions.extra) === null || _a === void 0 ? void 0 : _a._aliasType);
        if (findOptions.subQueryFilters) {
            const joinQueryBuilder = queryBuilder.connection.createQueryBuilder();
            const subQuery = this.getFormattedCrudGenQueryBuilder(findOptions.subQueryFilters, fieldMap).select('*');
            joinQueryBuilder.from(`(${subQuery.getQuery()})`, queryBuilder.alias);
            if (joinQueryBuilder.expressionMap.mainAlias &&
                ((_b = queryBuilder.expressionMap.mainAlias) === null || _b === void 0 ? void 0 : _b.metadata))
                joinQueryBuilder.expressionMap.mainAlias.metadata =
                    queryBuilder.expressionMap.mainAlias.metadata;
            return this.getFormattedCrudGenQueryBuilder(findOptions, fieldMap, joinQueryBuilder);
        }
        return this.getFormattedCrudGenQueryBuilder(findOptions, fieldMap, queryBuilder);
    }
    async processQueryBuilderWithCount(queryBuilder, findOptions) {
        var _a;
        const { skip = 0, take } = this.getActualLimits(findOptions);
        const skipCount = ((_a = findOptions.extra) === null || _a === void 0 ? void 0 : _a.skipCount) === true || !findOptions.take;
        if (skipCount) {
            const result = await queryBuilder.getMany();
            const knownLimit = !take || result.length < take;
            return [result, knownLimit ? result.length + skip : -1];
        }
        else {
            return Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);
        }
    }
    async getManyAndCountExtended(findOptions, fieldMap) {
        const queryBuilder = this.getCrudGenQueryBuilder(findOptions, fieldMap);
        return this.processQueryBuilderWithCount(queryBuilder, findOptions);
    }
    async getManyExtended(findOptions, fieldMap) {
        const queryBuilder = this.getCrudGenQueryBuilder(findOptions, fieldMap);
        return queryBuilder.getMany();
    }
    async countExtended(findOptions, fieldMap) {
        const queryBuilder = this.getCrudGenQueryBuilder(findOptions, fieldMap);
        return queryBuilder.getCount();
    }
    async getOneExtended(findOptions, withFail, mode = query_builder_helper_js_1.ReplicationMode.SLAVE) {
        const queryBuilder = this.getFormattedCrudGenQueryBuilder(findOptions);
        const returnFunction = this.getOneOrFail(withFail);
        return query_builder_helper_js_1.QueryBuilderHelper.applyOperationToQueryBuilder(queryBuilder, mode, returnFunction);
    }
    getOneOrFail(withFail) {
        return (qb) => {
            return withFail ? qb.getOne() : qb.getOneOrFail();
        };
    }
    generateFilterOnPrimaryColumn(ids) {
        const filters = {};
        const entityPrimaryColumn = this.metadata.primaryColumns.map((x) => x.propertyName);
        entityPrimaryColumn.map((key) => {
            var _a;
            filters[key] = ` = '${(_a = ids[key]) !== null && _a !== void 0 ? _a : ids}'`;
        });
        return filters;
    }
    generateSelectOnFind(fields, gqlType) {
        const findOptions = {};
        const fieldMapper = (0, crud_gen_helpers_js_1.objectToFieldMapper)(gqlType);
        fields.forEach((field) => (0, crud_gen_helpers_js_1.applySelectOnFind)(findOptions, field, fieldMapper.field));
        return findOptions;
    }
}
exports.GenericTypeORMRepository = GenericTypeORMRepository;
exports.CGExtendedRepository = GenericTypeORMRepository;
const repositoryMap = new WeakMap();
function CGExtendedRepositoryFactory(entity) {
    let cached;
    if ((cached = repositoryMap.get(entity)))
        return cached;
    const dynamicClass = (name) => ({ [name]: class extends GenericTypeORMRepository {
        } })[name];
    const repo = dynamicClass(`${entity.name}Repository`);
    repositoryMap.set(entity, repo);
    return repo;
}
//# sourceMappingURL=generic.repository.js.map