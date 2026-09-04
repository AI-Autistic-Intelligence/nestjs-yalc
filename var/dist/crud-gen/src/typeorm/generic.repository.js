import { QueryBuilderHelper, ReplicationMode, } from '@nestjs-yalc/database/query-builder.helper.js';
import { Repository } from 'typeorm';
import { applySelectOnFind, objectToFieldMapper, whereObjectToSqlString, } from '../crud-gen.helpers.js';
import '../query-builder.helpers.js';
export const AG_GRID_MAIN_ALIAS = 'CrudGenMainAlias';
export const PLAIN_CRUD_GEN_REPOSITORY_CAPABILITIES = {
    extendedQueries: false,
    structuredGraphqlFilters: false,
};
export class GenericTypeORMRepository extends Repository {
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
        if (findOptions.subQueryFilters) {
            return {
                skip: findOptions.skip ?? findOptions.subQueryFilters.skip,
                take: findOptions.take ?? findOptions.subQueryFilters.take,
            };
        }
        return { skip: findOptions.skip, take: findOptions.take };
    }
    getFormattedCrudGenQueryBuilder(findOptions, fieldMap, qb) {
        const { order, where, info, skip, take, extra, join, ...strippedFindOptions } = findOptions;
        if (!findOptions.select) {
            strippedFindOptions.select = [];
        }
        const queryBuilder = qb ?? this.createQueryBuilder(extra?._aliasType);
        const connection = queryBuilder.connection;
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
        queryBuilder.setFindOptions({ ...strippedFindOptions, join: joinCopy });
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
            const stringWhere = whereObjectToSqlString(queryBuilder, where, queryBuilder.alias, fieldMap);
            queryBuilder.where(stringWhere);
        }
        const sortingColumns = QueryBuilderHelper.applyOrderToJoinedQueryBuilder(findOptions, queryBuilder.alias, fieldMap);
        sortingColumns.forEach((v) => {
            queryBuilder.addOrderBy(v.key, v.operator);
        });
        return queryBuilder;
    }
    getCrudGenQueryBuilder(findOptions, fieldMap) {
        const queryBuilder = this.createQueryBuilder(findOptions.extra?._aliasType);
        if (findOptions.subQueryFilters) {
            const joinQueryBuilder = queryBuilder.connection.createQueryBuilder();
            const subQuery = this.getFormattedCrudGenQueryBuilder(findOptions.subQueryFilters, fieldMap).select('*');
            joinQueryBuilder.from(`(${subQuery.getQuery()})`, queryBuilder.alias);
            if (joinQueryBuilder.expressionMap.mainAlias &&
                queryBuilder.expressionMap.mainAlias?.metadata)
                joinQueryBuilder.expressionMap.mainAlias.metadata =
                    queryBuilder.expressionMap.mainAlias.metadata;
            return this.getFormattedCrudGenQueryBuilder(findOptions, fieldMap, joinQueryBuilder);
        }
        return this.getFormattedCrudGenQueryBuilder(findOptions, fieldMap, queryBuilder);
    }
    async processQueryBuilderWithCount(queryBuilder, findOptions) {
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
    async getOneExtended(findOptions, withFail, mode = ReplicationMode.SLAVE) {
        const queryBuilder = this.getFormattedCrudGenQueryBuilder(findOptions);
        const returnFunction = this.getOneOrFail(withFail);
        return QueryBuilderHelper.applyOperationToQueryBuilder(queryBuilder, mode, returnFunction);
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
        const fieldMapper = objectToFieldMapper(gqlType);
        fields.forEach((field) => applySelectOnFind(findOptions, field, fieldMapper.field));
        return findOptions;
    }
}
const repositoryMap = new WeakMap();
export function CGExtendedRepositoryFactory(entity) {
    let cached;
    if ((cached = repositoryMap.get(entity)))
        return cached;
    const dynamicClass = (name) => ({ [name]: class extends GenericTypeORMRepository {
        } })[name];
    const repo = dynamicClass(`${entity.name}Repository`);
    repositoryMap.set(entity, repo);
    return repo;
}
export { GenericTypeORMRepository as CGExtendedRepository };
//# sourceMappingURL=generic.repository.js.map