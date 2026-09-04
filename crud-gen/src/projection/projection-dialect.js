"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectionDialect = createProjectionDialect;
exports.applyProjectionIndexesForBootstrap = applyProjectionIndexesForBootstrap;
const projection_resource_js_1 = require("./projection-resource.js");
class BaseProjectionDialect {
    quote(identifier) {
        return `"${identifier.replaceAll('"', '""')}"`;
    }
    reference(alias, column) {
        return `${this.quote(alias)}.${this.quote(column)}`;
    }
    driverError(error) {
        if (!error || typeof error !== 'object')
            return {};
        const candidate = error;
        return candidate.driverError && typeof candidate.driverError === 'object'
            ? candidate.driverError
            : error;
    }
    projectionValueExpression(field, references) {
        var _a;
        const value = field.storage === 'column'
            ? references.column
            : this.jsonValueExpression(references.payload, (_a = field.path) !== null && _a !== void 0 ? _a : []);
        return this.codecExpression(value, field.codec);
    }
    columnExpression(alias, definition, field) {
        var _a;
        return this.projectionValueExpression(field, {
            payload: this.reference(alias, definition.payload.column),
            column: this.reference(alias, (_a = field.column) !== null && _a !== void 0 ? _a : field.name),
        });
    }
    definitionExpression(definition, field) {
        var _a;
        return this.projectionValueExpression(field, {
            payload: this.quote(definition.payload.column),
            column: this.quote((_a = field.column) !== null && _a !== void 0 ? _a : field.name),
        });
    }
    codecExpression(expression, codec) {
        if (codec === 'integer')
            return `CAST(${expression} AS BIGINT)`;
        if (codec === 'boolean')
            return this.booleanExpression(expression);
        if (codec === 'string' || codec === 'uuid' || codec === 'instant')
            return `CAST(${expression} AS TEXT)`;
        throw new TypeError('Projection JSON values cannot be used in SQL queries.');
    }
    compileIndexStatements(definition) {
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        return definition.fields.flatMap((field) => {
            if (!field.index)
                return [];
            const expression = this.definitionExpression(definition, field);
            return [
                `CREATE INDEX ${this.quote(field.index.name)} ON ${this.quote(definition.tableName)} (${this.quote(definition.scope.column)}, ${expression}, ${this.quote(definition.identity.column)})`,
            ];
        });
    }
    async findMany(repository, definition, scopeId, filters, sorting, page) {
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const alias = 'projection';
        const query = repository.createQueryBuilder(alias);
        query.where(`${this.reference(alias, definition.scope.column)} = :projection_scope_id`, { projection_scope_id: scopeId });
        filters.forEach((filter, index) => {
            const field = (0, projection_resource_js_1.getProjectionField)(definition, filter.field.name);
            const expression = this.columnExpression(alias, definition, field);
            const parameter = `projection_filter_${index}`;
            const values = filter.values.map((value) => (0, projection_resource_js_1.normalizeProjectionCodecValue)(field, value));
            if (filter.operator === 'eq') {
                query.andWhere(`${expression} = :${parameter}`, {
                    [parameter]: values[0],
                });
            }
            else if (filter.operator === 'range') {
                query.andWhere(`${expression} BETWEEN :${parameter}_from AND :${parameter}_to`, {
                    [`${parameter}_from`]: values[0],
                    [`${parameter}_to`]: values[1],
                });
            }
            else {
                query.andWhere(`${expression} IN (:...${parameter})`, {
                    [parameter]: values,
                });
            }
        });
        const sorted = new Set();
        for (const sort of sorting) {
            const field = (0, projection_resource_js_1.getProjectionField)(definition, sort.field.name);
            query.addOrderBy(this.columnExpression(alias, definition, field), sort.direction);
            sorted.add(field.name);
        }
        if (!sorted.has(definition.identity.column)) {
            query.addOrderBy(this.reference(alias, definition.identity.column), 'ASC');
        }
        if (page.skip !== undefined)
            query.skip(page.skip);
        if (page.take !== undefined)
            query.take(page.take);
        const records = await query.getMany();
        const count = await query.clone().getCount();
        return [records, count];
    }
    async patch(repository, definition, patch) {
        var _a;
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const setValues = this.patchSetValues(definition, patch);
        const parameters = {
            projection_scope_id: patch.scopeId,
            projection_guid: patch.guid,
            projection_expected_revision: patch.expectedRevision,
        };
        Object.assign(parameters, this.patchParameters(definition, patch));
        setValues[definition.revision.column] = () => `${this.quote(definition.revision.column)} + 1`;
        const result = await repository
            .createQueryBuilder()
            .update()
            .set(setValues)
            .where(`${this.quote(definition.scope.column)} = :projection_scope_id AND ${this.quote(definition.identity.column)} = :projection_guid AND ${this.quote(definition.revision.column)} = :projection_expected_revision`)
            .setParameters(parameters)
            .execute();
        return (_a = result.affected) !== null && _a !== void 0 ? _a : 0;
    }
    async patchValues(repository, definition, patch) {
        var _a;
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const result = await repository
            .createQueryBuilder()
            .update()
            .set(this.patchSetValues(definition, patch))
            .where(`${this.quote(definition.scope.column)} = :projection_scope_id AND ${this.quote(definition.identity.column)} = :projection_guid`)
            .setParameters(Object.assign({ projection_scope_id: patch.scopeId, projection_guid: patch.guid }, this.patchParameters(definition, patch)))
            .execute();
        return (_a = result.affected) !== null && _a !== void 0 ? _a : 0;
    }
    patchSetValues(definition, patch) {
        const setValues = Object.assign({}, patch.columnValues);
        const jsonValues = this.normalizedJsonValues(definition, patch);
        if (jsonValues.length > 0) {
            const jsonPatch = this.jsonPatchExpression(this.quote(definition.payload.column), jsonValues);
            setValues[definition.payload.column] = () => jsonPatch.expression;
        }
        return setValues;
    }
    patchParameters(definition, patch) {
        const jsonValues = this.normalizedJsonValues(definition, patch);
        return jsonValues.length > 0
            ? this.jsonPatchExpression(this.quote(definition.payload.column), jsonValues).parameters
            : {};
    }
    normalizedJsonValues(definition, patch) {
        return patch.jsonValues.map((change) => {
            const field = (0, projection_resource_js_1.getProjectionField)(definition, change.field.name);
            if (field.storage !== 'json') {
                throw new TypeError(`Projection field ${field.name} cannot be patched as JSON.`);
            }
            return Object.assign(Object.assign({}, change), { field, value: (0, projection_resource_js_1.normalizeProjectionCodecValue)(field, change.value) });
        });
    }
    async explainIndexedEquality(dataSource, definition, field, scopeId, value) {
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const declaredField = (0, projection_resource_js_1.getProjectionField)(definition, field.name);
        if (!declaredField.index) {
            throw new TypeError(`Projection field ${declaredField.name} has no declared index.`);
        }
        await this.analyze(dataSource, definition);
        const expression = this.definitionExpression(definition, declaredField);
        const rows = await this.explain(dataSource, `SELECT ${this.quote(definition.identity.column)} FROM ${this.quote(definition.tableName)} WHERE ${this.quote(definition.scope.column)} = :projection_scope_id AND ${expression} = :projection_value ORDER BY ${this.quote(definition.identity.column)} ASC`, {
            projection_scope_id: scopeId,
            projection_value: (0, projection_resource_js_1.normalizeProjectionCodecValue)(declaredField, value),
        });
        const lines = rows.map((row) => Object.values(row).join(' '));
        return {
            lines,
            usesDeclaredIndex: lines.some((line) => line.includes(declaredField.index.name)),
        };
    }
}
class SqliteProjectionDialect extends BaseProjectionDialect {
    constructor() {
        super(...arguments);
        this.name = 'sqlite';
        this.payloadColumnType = 'simple-json';
    }
    jsonValueExpression(payloadReference, path) {
        return `json_extract(${payloadReference}, '${this.jsonPath(path)}')`;
    }
    booleanExpression(expression) {
        return `CAST(${expression} AS INTEGER)`;
    }
    jsonPatchExpression(payloadColumn, changes) {
        let expression = `COALESCE(${payloadColumn}, '{}')`;
        const parameters = {};
        changes.forEach((change, index) => {
            var _a;
            const parameter = `projection_json_${index}`;
            parameters[parameter] = JSON.stringify(change.value);
            expression = `json_set(${expression}, '${this.jsonPath((_a = change.field.path) !== null && _a !== void 0 ? _a : [])}', json(:${parameter}))`;
        });
        return { expression, parameters };
    }
    jsonPath(path) {
        return `$.${path.join('.')}`;
    }
    isScopedIdentityConflict(error, definition) {
        var _a;
        const driverError = this.driverError(error);
        const message = String((_a = driverError.message) !== null && _a !== void 0 ? _a : '');
        return (driverError.code === 'SQLITE_CONSTRAINT' &&
            message.includes(`${definition.tableName}.${definition.scope.column}`) &&
            message.includes(`${definition.tableName}.${definition.identity.column}`));
    }
    async inspect(dataSource, definition) {
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const indexes = await dataSource.query("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = ?", [definition.tableName]);
        const validJson = await dataSource.query(`SELECT json_valid(${this.quote(definition.payload.column)}) AS valid_json FROM ${this.quote(definition.tableName)}`);
        return {
            payloadStorage: 'sqlite-json1',
            indexes: indexes.map((row) => row.name),
            validJson: validJson.every((row) => row.valid_json === 1),
        };
    }
    async analyze(dataSource, definition) {
        await dataSource.query(`ANALYZE ${this.quote(definition.tableName)}`);
    }
    explain(dataSource, select, parameters) {
        return dataSource.query(`EXPLAIN QUERY PLAN ${select
            .replace(':projection_scope_id', '?')
            .replace(':projection_value', '?')}`, [parameters.projection_scope_id, parameters.projection_value]);
    }
}
class PostgresProjectionDialect extends BaseProjectionDialect {
    constructor() {
        super(...arguments);
        this.name = 'postgres';
        this.payloadColumnType = 'jsonb';
    }
    jsonValueExpression(payloadReference, path) {
        return `(${payloadReference} #>> '${this.postgresPath(path)}')`;
    }
    booleanExpression(expression) {
        return `CAST(${expression} AS BOOLEAN)`;
    }
    jsonPatchExpression(payloadColumn, changes) {
        let expression = `COALESCE(${payloadColumn}, '{}'::jsonb)`;
        expression = `CASE WHEN jsonb_typeof(${expression}) = 'object' THEN ${expression} ELSE '{}'::jsonb END`;
        const parameters = {};
        changes.forEach((change, index) => {
            var _a;
            const parameter = `projection_json_${index}`;
            parameters[parameter] = JSON.stringify(change.value);
            const path = (_a = change.field.path) !== null && _a !== void 0 ? _a : [];
            for (let depth = 1; depth < path.length; depth += 1) {
                expression = this.jsonObjectAtPath(expression, path.slice(0, depth));
            }
            expression = `jsonb_set(${expression}, '${this.postgresPath(path)}', CAST(:${parameter} AS jsonb), true)`;
        });
        return { expression, parameters };
    }
    postgresPath(path) {
        return `{${path.join(',')}}`;
    }
    jsonObjectAtPath(expression, path) {
        const postgresPath = this.postgresPath(path);
        const existing = `(${expression} #> '${postgresPath}')`;
        return `jsonb_set(${expression}, '${postgresPath}', CASE WHEN jsonb_typeof(${existing}) = 'object' THEN ${existing} ELSE '{}'::jsonb END, true)`;
    }
    isScopedIdentityConflict(error, definition) {
        const driverError = this.driverError(error);
        return (driverError.code === '23505' &&
            driverError.constraint ===
                `${definition.tableName}_scope_${definition.identity.column}_unique`);
    }
    async inspect(dataSource, definition) {
        var _a, _b, _c;
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
        const columns = await dataSource.query('SELECT data_type FROM information_schema.columns WHERE table_name = $1 AND column_name = $2', [definition.tableName, definition.payload.column]);
        const indexes = await dataSource.query('SELECT indexname FROM pg_indexes WHERE tablename = $1', [definition.tableName]);
        return {
            payloadStorage: (_b = (_a = columns[0]) === null || _a === void 0 ? void 0 : _a.data_type) !== null && _b !== void 0 ? _b : 'missing',
            indexes: indexes.map((row) => row.indexname),
            validJson: ((_c = columns[0]) === null || _c === void 0 ? void 0 : _c.data_type) === 'jsonb',
        };
    }
    async analyze(dataSource, definition) {
        await dataSource.query(`ANALYZE ${this.quote(definition.tableName)}`);
    }
    explain(dataSource, select, parameters) {
        return dataSource.query(`EXPLAIN ${select
            .replace(':projection_scope_id', '$1')
            .replace(':projection_value', '$2')}`, [parameters.projection_scope_id, parameters.projection_value]);
    }
}
function createProjectionDialect(driver) {
    if (driver === 'sqlite')
        return new SqliteProjectionDialect();
    if (driver === 'postgres')
        return new PostgresProjectionDialect();
    throw new TypeError(`Unsupported projection dialect ${driver}.`);
}
async function applyProjectionIndexesForBootstrap(dataSource, dialect, definition) {
    for (const statement of dialect.compileIndexStatements(definition)) {
        await dataSource.query(statement);
    }
}
//# sourceMappingURL=projection-dialect.js.map