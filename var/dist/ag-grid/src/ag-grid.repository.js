"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridRepository = exports.AG_GRID_MAIN_ALIAS = void 0;
exports.AgGridRepositoryFactory = AgGridRepositoryFactory;
const query_builder_helper_1 = require("@nest-yalc-2/database/query-builder.helper");
const typeorm_1 = require("typeorm");
require("./query-builder.helpers");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
exports.AG_GRID_MAIN_ALIAS = 'AgGridMainAlias';
class AgGridRepository extends typeorm_1.Repository {
    getActualLimits(findOptions) {
        if (findOptions.subQueryFilters) {
            return {
                skip: findOptions.skip ?? findOptions.subQueryFilters.skip,
                take: findOptions.take ?? findOptions.subQueryFilters.take,
            };
        }
        return { skip: findOptions.skip, take: findOptions.take };
    }
    getFormattedAgGridQueryBuilder(findOptions, fieldMap, qb) {
        const { order, where, info, skip, take, extra, join, ...strippedFindOptions } = findOptions;
        if (!findOptions.select) {
            strippedFindOptions.select = [];
        }
        const queryBuilder = qb ?? this.createQueryBuilder(extra?._aliasType);
        const rawSelection = [];
        const joinSelection = [];
        const customSel = extra?._keysMeta;
        if (customSel) {
            Object.values(customSel).forEach((v) => {
                const meta = v;
                const _mapper = meta?.fieldMapper;
                const isNested = meta?.isNested;
                const isDerived = _mapper?.mode === 'derived';
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
            joinCopy = { ...join };
            const processRelationExtraConditions = (joinType, joinInfo) => {
                if (!joinInfo)
                    return;
                Object.keys(joinInfo).forEach((key) => {
                    const fieldInfo = extra?._fieldMapper?.[key];
                    if (!fieldInfo?.relation)
                        return;
                    const relation = fieldInfo.relation;
                    const type = joinType === 'left' ? 'leftJoinAndSelect' : 'innerJoinAndSelect';
                    customJoinToApply.push((qb) => {
                        const alias = extra?._aliasType ?? '';
                        qb[type](`${alias}.${key}`, `${key}`, `${key}.${relation.targetKey.dst} = ${relation.sourceKey.dst}`);
                    });
                    delete joinInfo[key];
                });
            };
            processRelationExtraConditions('inner', joinCopy.innerJoinAndSelect);
            processRelationExtraConditions('left', joinCopy.leftJoinAndSelect);
        }
        queryBuilder.setFindOptions({
            ...strippedFindOptions,
            join: joinCopy,
        });
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
        const queryBuilder = this.createQueryBuilder(findOptions.extra?._aliasType);
        if (findOptions.subQueryFilters) {
            const joinQueryBuilder = queryBuilder.connection.createQueryBuilder();
            const subQuery = this.getFormattedAgGridQueryBuilder(findOptions.subQueryFilters, fieldMap).select('*');
            joinQueryBuilder.from(`(${subQuery.getQuery()})`, queryBuilder.alias);
            if (joinQueryBuilder.expressionMap.mainAlias &&
                queryBuilder.expressionMap.mainAlias?.metadata)
                joinQueryBuilder.expressionMap.mainAlias.metadata =
                    queryBuilder.expressionMap.mainAlias.metadata;
            return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, joinQueryBuilder);
        }
        return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, queryBuilder);
    }
    async getManyAndCountAgGrid(findOptions, fieldMap) {
        const queryBuilder = this.getAgGridQueryBuilder(findOptions, fieldMap);
        const { skip = 0, take } = this.getActualLimits(findOptions);
        const skipCount = findOptions.extra?.skipCount === true || !findOptions.take;
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
            filters[key] = ` = '${ids[key] ?? ids}'`;
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