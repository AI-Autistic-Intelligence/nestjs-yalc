"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderHelper = exports.ReplicationMode = void 0;
const typeorm_1 = require("typeorm");
const maps_interface_1 = require("@nest-yalc-2/interfaces/maps.interface");
const json_helpers_1 = require("./json.helpers");
var ReplicationMode;
(function (ReplicationMode) {
    ReplicationMode["MASTER"] = "master";
    ReplicationMode["SLAVE"] = "slave";
})(ReplicationMode || (exports.ReplicationMode = ReplicationMode = {}));
class QueryBuilderHelper {
    static async getGroupedManyAndCount(queryBuilder, groupColumns) {
        return Promise.all([
            new Promise((resolve, reject) => {
                const dataQb = queryBuilder.clone();
                dataQb.groupBy(groupColumns.join(', '));
                dataQb
                    .getMany()
                    .then((values) => resolve(values))
                    .catch((err) => reject(err));
            }),
            new Promise((resolve, reject) => {
                const countQb = queryBuilder.clone();
                const escapedGroupColumns = groupColumns.map((column) => countQb.escape(column));
                countQb.skip(0);
                countQb.select(`COUNT(DISTINCT (${escapedGroupColumns.join(', ')})) as count`);
                countQb.orderBy('NULL');
                countQb
                    .getRawOne()
                    .then((value) => resolve(value.count ? Number(value.count) : 0))
                    .catch((err) => reject(err));
            }),
        ]);
    }
    static async applyOperationToQueryBuilder(queryBuilder, mode, operationFn) {
        let queryRunner = undefined;
        const { connection } = queryBuilder;
        const { isReplicated } = connection.driver;
        if (isReplicated) {
            queryRunner = connection.createQueryRunner(mode);
            queryBuilder.setQueryRunner(queryRunner);
        }
        return operationFn(queryBuilder).finally(async () => {
            await queryRunner?.release();
        });
    }
    static computeFindOperatorExpression(queryBuilder, operator, aliasPath, parameters) {
        parameters = Array.isArray(parameters) ? parameters : [parameters];
        parameters = parameters.map((v) => {
            return typeof v === 'string'
                ? v[0] === v[v.length - 1] && (v[0] === "'" || v[0] === '"')
                    ? v
                    : `'${v}'`
                : v;
        });
        parameters = parameters.map((v) => {
            if (typeof v === 'string' ||
                typeof v === 'number' ||
                typeof v === 'boolean') {
                return v;
            }
            else {
                const date = Date.parse(v);
                return isNaN(date) ? v : date;
            }
        });
        switch (operator.type) {
            case 'not':
                if (operator.child) {
                    return `NOT(${this.computeFindOperatorExpression(queryBuilder, operator.child, aliasPath, parameters)})`;
                }
                else {
                    return `${aliasPath} != ${parameters[0]}`;
                }
            case 'lessThan':
                return `${aliasPath} < ${parameters[0]}`;
            case 'lessThanOrEqual':
                return `${aliasPath} <= ${parameters[0]}`;
            case 'moreThan':
                return `${aliasPath} > ${parameters[0]}`;
            case 'moreThanOrEqual':
                return `${aliasPath} >= ${parameters[0]}`;
            case 'equal':
                return `${aliasPath} = ${parameters[0]}`;
            case 'ilike':
                if (queryBuilder === undefined) {
                    throw new Error(`To use the 'ilike' filter the query builder should be defined`);
                }
                const { driver } = queryBuilder.connection;
                if (driver?.options?.type === 'postgres' ||
                    driver?.options?.type === 'cockroachdb') {
                    return `${aliasPath} ILIKE ${parameters[0]}`;
                }
                return `UPPER(${aliasPath}) LIKE UPPER(${parameters[0]})`;
            case 'like':
                return `${aliasPath} LIKE ${parameters[0]}`;
            case 'between':
                return `${aliasPath} BETWEEN ${parameters[0]} AND ${parameters[1]}`;
            case 'in':
                if (parameters.length === 0) {
                    return '0=1';
                }
                return `${aliasPath} IN (${parameters.join(', ')})`;
            case 'any':
                return `${aliasPath} = ANY(${parameters[0]})`;
            case 'isNull':
                return `${aliasPath} IS NULL`;
            case 'raw':
                if (operator.getSql) {
                    return operator.getSql(aliasPath);
                }
                else {
                    return `${aliasPath} = ${operator.value}`;
                }
        }
        throw new TypeError(`Unsupported FindOperator ${typeorm_1.FindOperator.constructor.name}`);
    }
    static getMapper(fieldMap, alias) {
        return (0, maps_interface_1.isFieldMapper)(fieldMap.joined)
            ? fieldMap.joined
            : fieldMap.joined[alias];
    }
    static convertFieldWithMap(field, map) {
        if (field in map) {
            return map[field].dst;
        }
        return field;
    }
    static applyOrderToJoinedQueryBuilder(findOptions, parentName, fieldMap) {
        const sortingColumns = [];
        let alias;
        let mapper;
        for (const key in findOptions.order) {
            if (key.includes('.') && fieldMap) {
                const splitted = key.split('.');
                alias = splitted[0];
                mapper = this.getMapper(fieldMap, alias);
                const newKey = `${splitted[0]}.${this.convertFieldWithMap(splitted[1], mapper)}`;
                sortingColumns.push({
                    key: newKey,
                    operator: findOptions.order[key],
                });
                delete findOptions.order[key];
            }
        }
        const findOptionsOrder = { order: findOptions.order };
        if (findOptionsOrder.order) {
            for (const i of Object.keys(findOptionsOrder.order)) {
                sortingColumns.push({
                    key: `${parentName}.${fieldMap ? this.convertFieldWithMap(i, fieldMap.parent) : i}`,
                    operator: findOptionsOrder.order[i],
                });
            }
        }
        return sortingColumns;
    }
    static addAlias(key, alias, fieldMap) {
        if ((0, json_helpers_1.isJsonSQLRaw)(key)) {
            return key;
        }
        if (key.includes('.')) {
            const splitted = key.split('.');
            alias = splitted[0];
            if (fieldMap) {
                const mapper = this.getMapper(fieldMap, alias);
                key = this.convertFieldWithMap(splitted[1], mapper);
            }
            else {
                key = splitted[1];
            }
        }
        return alias ? `\`${alias}\`.\`${key}\`` : key;
    }
}
exports.QueryBuilderHelper = QueryBuilderHelper;
//# sourceMappingURL=query-builder.helper.js.map