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
exports.AgGridRepository = exports.AG_GRID_MAIN_ALIAS = void 0;
exports.AgGridRepositoryFactory = AgGridRepositoryFactory;
const query_builder_helper_1 = require("@nestjs-yalc/database/query-builder.helper");
const typeorm_1 = require("typeorm");
require("./query-builder.helpers");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
exports.AG_GRID_MAIN_ALIAS = 'AgGridMainAlias';
class AgGridRepository extends typeorm_1.Repository {
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
    getFormattedAgGridQueryBuilder(findOptions, fieldMap, qb) {
        const { order, where, info, skip, take, extra, join } = findOptions, strippedFindOptions = __rest(findOptions, ["order", "where", "info", "skip", "take", "extra", "join"]);
        if (!findOptions.select) {
            strippedFindOptions.select = [];
        }
        const queryBuilder = qb !== null && qb !== void 0 ? qb : this.createQueryBuilder(extra === null || extra === void 0 ? void 0 : extra._aliasType);
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
                    if (isNested) {
                        joinSelection.push(meta.rawSelect);
                    }
                    else {
                        rawSelection.push(meta.rawSelect);
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
            const stringWhere = (0, ag_grid_query_helper_1.whereObjectToSqlString)(queryBuilder, where, queryBuilder.alias, fieldMap);
            queryBuilder.where(stringWhere);
        }
        const sortingColumns = query_builder_helper_1.QueryBuilderHelper.applyOrderToJoinedQueryBuilder(findOptions, queryBuilder.alias, fieldMap);
        sortingColumns.forEach((v) => {
            queryBuilder.addOrderBy(v.key, v.operator);
        });
        return queryBuilder;
    }
    getAgGridQueryBuilder(findOptions, fieldMap) {
        var _a, _b;
        const queryBuilder = this.createQueryBuilder((_a = findOptions.extra) === null || _a === void 0 ? void 0 : _a._aliasType);
        if (findOptions.subQueryFilters) {
            const joinQueryBuilder = queryBuilder.connection.createQueryBuilder();
            const subQuery = this.getFormattedAgGridQueryBuilder(findOptions.subQueryFilters, fieldMap).select('*');
            joinQueryBuilder.from(`(${subQuery.getQuery()})`, queryBuilder.alias);
            if (joinQueryBuilder.expressionMap.mainAlias &&
                ((_b = queryBuilder.expressionMap.mainAlias) === null || _b === void 0 ? void 0 : _b.metadata))
                joinQueryBuilder.expressionMap.mainAlias.metadata =
                    queryBuilder.expressionMap.mainAlias.metadata;
            return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, joinQueryBuilder);
        }
        return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, queryBuilder);
    }
    async getManyAndCountAgGrid(findOptions, fieldMap) {
        var _a;
        const queryBuilder = this.getAgGridQueryBuilder(findOptions, fieldMap);
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
    async getManyAgGrid(findOptions, fieldMap) {
        const queryBuilder = this.getAgGridQueryBuilder(findOptions, fieldMap);
        return queryBuilder.getMany();
    }
    async getOneAgGrid(findOptions, withFail, mode = query_builder_helper_1.ReplicationMode.SLAVE) {
        const queryBuilder = this.getFormattedAgGridQueryBuilder(findOptions);
        const returnFunction = this.getOneOrFail(withFail);
        return query_builder_helper_1.QueryBuilderHelper.applyOperationToQueryBuilder(queryBuilder, mode, returnFunction);
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
        const fieldMapper = (0, ag_grid_metadata_helper_1.objectToFieldMapper)(gqlType);
        fields.forEach((field) => (0, ag_grid_query_helper_1.applySelectOnFind)(findOptions, field, fieldMapper.field));
        return findOptions;
    }
}
exports.AgGridRepository = AgGridRepository;
const repositoryMap = new WeakMap();
function AgGridRepositoryFactory(entity) {
    let cached;
    if ((cached = repositoryMap.get(entity)))
        return cached;
    const dynamicClass = (name) => ({ [name]: class extends AgGridRepository {
        } })[name];
    const repo = dynamicClass(`${entity.name}Repository`);
    (0, typeorm_1.EntityRepository)(entity)(repo);
    repositoryMap.set(entity, repo);
    return repo;
}
//# sourceMappingURL=ag-grid.repository.js.map