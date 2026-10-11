"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridRepository = exports.AG_GRID_MAIN_ALIAS = void 0;
exports.AgGridRepositoryFactory = AgGridRepositoryFactory;
const query_builder_helper_1 = require("@node-yalc/database/query-builder.helper");
const typeorm_1 = require("typeorm");
require("./query-builder.helpers");
const ag_grid_query_helper_1 = require("./ag-grid-query.helper");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
exports.AG_GRID_MAIN_ALIAS = 'AgGridMainAlias';
class AgGridRepository extends typeorm_1.Repository {
    /**
     * @todo we should create a class helper/adapter for the findOptions and move this method there
     */
    getActualLimits(findOptions) {
        if (findOptions.subQueryFilters) {
            // findOptions limits take precedence over subQuery limits
            return {
                skip: (findOptions.skip ?? findOptions.subQueryFilters.skip),
                take: (findOptions.take ?? findOptions.subQueryFilters.take),
            };
        }
        return {
            ...(findOptions.skip !== undefined ? { skip: findOptions.skip } : {}),
            ...(findOptions.take !== undefined ? { take: findOptions.take } : {}),
        };
    }
    getFormattedAgGridQueryBuilder(findOptions, fieldMap, qb) {
        //We will use functions to apply sorting and filters
        const { 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        order, where, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        info, skip, take, extra, join, ...strippedFindOptions } = findOptions;
        /**
         * We need at least one property in this object
         */
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
        /**
         * Add join where conditions from AgGrid decorator relation property
         */
        let joinCopy;
        const customJoinToApply = [];
        if (join) {
            joinCopy = { ...join };
            const processRelationExtraConditions = (joinType, joinInfo) => {
                if (!joinInfo)
                    return;
                /**
                 * when fieldInfo?.relation we need to execute
                 * join by using the queryBuilder functions directly
                 * in order to apply the extra conditions
                 */
                Object.keys(joinInfo).forEach((key) => {
                    const fieldInfo = extra?._fieldMapper?.[key];
                    if (!fieldInfo?.relation)
                        return;
                    const relation = fieldInfo.relation;
                    const type = joinType === 'left' ? 'leftJoinAndSelect' : 'innerJoinAndSelect';
                    // store joins to apply later
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
            // apply custom joins
            customJoinToApply.forEach((fn) => fn(queryBuilder));
        }
        if (extra && extra.rawLimit === true) {
            // .take() and .skip() methods create
            // a not limited subquery on joined tables
            // which reduces the performance, while offset() and limit()
            // do not create any subquery, however, the amount of data retrieved could
            // not be consistent (less than the one expected) because of duplicated rows
            // therefore, use rawLimit option especially with 1:1 relations
            queryBuilder.offset(skip).limit(take);
        }
        else {
            queryBuilder.skip(skip).take(take);
        }
        if (where) {
            const stringWhere = (0, ag_grid_query_helper_1.whereObjectToSqlString)(queryBuilder, where, queryBuilder.alias, fieldMap);
            //Let's convert the filterObject into an sql string
            queryBuilder.where(stringWhere);
        }
        //We do the same with sorting
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
            // bug: https://github.com/typeorm/typeorm/issues/4015
            // hack: https://github.com/typeorm/typeorm/issues/4015#issuecomment-691030543
            if (joinQueryBuilder.expressionMap.mainAlias &&
                queryBuilder.expressionMap.mainAlias?.metadata)
                joinQueryBuilder.expressionMap.mainAlias.metadata =
                    queryBuilder.expressionMap.mainAlias.metadata;
            return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, joinQueryBuilder);
        }
        return this.getFormattedAgGridQueryBuilder(findOptions, fieldMap, queryBuilder);
    }
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
    async getManyAndCountAgGrid(findOptions, fieldMap) {
        // console.log('==========START QUERY==============');
        const queryBuilder = this.getAgGridQueryBuilder(findOptions, fieldMap);
        const { skip = 0, take } = this.getActualLimits(findOptions);
        // skip count select with no limit is specified or when skipCount is true
        const skipCount = findOptions.extra?.skipCount === true || !findOptions.take;
        if (skipCount) {
            const result = await queryBuilder.getMany();
            // when no limit specified we are asking for all available resources, hence we already know the total amount
            // therefore, no SELECT COUNT is needed
            const knownLimit = !take || result.length < take;
            // we still try to return a counter when we know that the requested limit
            // is higher than the resources available. Otherwise we return -1 (unkown limit)
            return [result, knownLimit ? result.length + skip : -1];
        }
        else {
            //getManyAndCount in unefficient because is sequential, instead we can run the 2 queries in parallel
            return Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);
        }
    }
    /**
     * Returns a List of entities based in the provided options.
     * @param findOptions Filter options
     */
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
    /**
     *
     * @param ids Could be either a object map between entity primaryColumn name and value or a single value of the primaryColumn
     * @returns where filter with conditions on entity primaryColumn
     */
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