"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionResourceService = void 0;
const typeorm_1 = require("typeorm");
const projection_resource_js_1 = require("./projection-resource.js");
function hasOwn(input, field) {
    return Object.prototype.hasOwnProperty.call(input, field);
}
function isFindOperator(value) {
    return (value instanceof typeorm_1.FindOperator ||
        (!!value &&
            typeof value === 'object' &&
            'type' in value &&
            'value' in value));
}
class ProjectionResourceService {
    constructor(repository, scope, dialect, events, definition) {
        this.repository = repository;
        this.scope = scope;
        this.dialect = dialect;
        this.events = events;
        this.definition = definition;
        (0, projection_resource_js_1.assertProjectionResourceDefinition)(definition);
    }
    supportsStructuredGraphqlFilters() {
        return true;
    }
    supportsExtendedRepository() {
        return true;
    }
    async getEntity(conditions, _fields, _relations, _databaseName, options) {
        const guid = this.guidFromConditions(conditions);
        const record = await this.repository.findOne({
            where: {
                [this.definition.scope.column]: this.scope.scopeId,
                [this.definition.identity.column]: guid,
            },
        });
        if (!record && (options === null || options === void 0 ? void 0 : options.failOnNull))
            this.notFound();
        return record ? this.project(record) : null;
    }
    async getEntityListExtended(findOptions = {}, withCount = false) {
        const page = this.pageFromFindOptions(findOptions);
        const [records, count] = await this.dialect.findMany(this.repository, this.definition, this.scope.scopeId, this.filtersFromFindOptions(findOptions), this.sortingFromFindOptions(findOptions), page);
        const projected = records.map((record) => this.project(record));
        return withCount ? [projected, count] : projected;
    }
    async createEntity(input) {
        var _a;
        this.rejectUnknownInput(input, true);
        const entity = {
            [this.definition.scope.column]: this.scope.scopeId,
            [this.definition.revision.column]: 1,
            [this.definition.payload.column]: this.createPayload(input),
        };
        for (const field of this.definition.fields) {
            const value = input[field.name];
            if (field.requiredOnCreate && (value === undefined || value === null)) {
                this.invalid(`Projection field ${field.name} is required on create.`);
            }
            if (value === null && !field.nullable) {
                this.invalid(`Projection field ${field.name} cannot be null.`);
            }
            if (value !== undefined && field.storage === 'column') {
                entity[(_a = field.column) !== null && _a !== void 0 ? _a : field.name] = this.normalizeValue(field, value);
            }
        }
        let saved;
        try {
            saved = await this.repository.save(this.repository.create(entity));
        }
        catch (error) {
            if (this.dialect.isScopedIdentityConflict(error, this.definition)) {
                throw this.events.errorConflict('projection.identity.conflict', {
                    response: {
                        message: 'Projection identity already exists in this scope.',
                    },
                });
            }
            throw error;
        }
        return this.project(saved);
    }
    async updateEntity(conditions, input) {
        var _a;
        this.rejectUnknownInput(input, false);
        const guid = this.guidFromConditions(conditions);
        const expectedRevision = input.expectedRevision;
        if (typeof expectedRevision !== 'number' ||
            !Number.isInteger(expectedRevision) ||
            expectedRevision < 1 ||
            expectedRevision >= projection_resource_js_1.PROJECTION_INTEGER_MAX) {
            this.invalid(`expectedRevision must be an integer between 1 and ${projection_resource_js_1.PROJECTION_INTEGER_MAX - 1}.`);
        }
        const patch = {
            scopeId: this.scope.scopeId,
            guid,
            expectedRevision,
            columnValues: {},
            jsonValues: [],
        };
        for (const field of this.definition.fields) {
            if (field.name === this.definition.identity.column ||
                !hasOwn(input, field.name)) {
                continue;
            }
            const value = input[field.name];
            if (value === null && !field.nullable) {
                this.invalid(`Projection field ${field.name} cannot be null.`);
            }
            const normalized = this.normalizeValue(field, value);
            if (field.storage === 'column') {
                patch.columnValues[(_a = field.column) !== null && _a !== void 0 ? _a : field.name] = normalized;
            }
            else {
                patch.jsonValues.push({ field, value: normalized });
            }
        }
        if (Object.keys(patch.columnValues).length === 0 &&
            patch.jsonValues.length === 0) {
            this.invalid('Projection update requires at least one writable field.');
        }
        const affected = await this.dialect.patch(this.repository, this.definition, patch);
        if (affected === 0) {
            const current = await this.repository.findOne({
                where: {
                    [this.definition.scope.column]: this.scope.scopeId,
                    [this.definition.identity.column]: guid,
                },
            });
            if (!current)
                this.notFound();
            throw this.events.errorConflict('projection.revision.conflict', {
                response: { message: 'Projection resource revision is stale.' },
            });
        }
        const updated = await this.repository.findOneOrFail({
            where: {
                [this.definition.scope.column]: this.scope.scopeId,
                [this.definition.identity.column]: guid,
            },
        });
        return this.project(updated);
    }
    async deleteEntity(conditions) {
        const result = await this.repository.delete({
            [this.definition.scope.column]: this.scope.scopeId,
            [this.definition.identity.column]: this.guidFromConditions(conditions),
        });
        if (!result.affected)
            this.notFound();
        return true;
    }
    createPayload(input) {
        var _a, _b, _c, _d;
        const initial = input.payload;
        if (initial !== undefined) {
            try {
                (0, projection_resource_js_1.assertProjectionPayloadValue)(initial);
            }
            catch (error) {
                this.invalid(error instanceof Error
                    ? error.message
                    : 'Projection payload must be a JSON object.');
            }
        }
        let payload = (initial ? structuredClone(initial) : {});
        for (const field of this.definition.fields) {
            if (field.storage !== 'json' || input[field.name] === undefined)
                continue;
            if ((0, projection_resource_js_1.getProjectionPathValue)(payload, (_a = field.path) !== null && _a !== void 0 ? _a : []) !== undefined) {
                this.invalid(`Projection field ${field.name} cannot be supplied both in payload and as a projected input.`);
            }
            payload = (0, projection_resource_js_1.setProjectionPathValue)(payload, (_b = field.path) !== null && _b !== void 0 ? _b : [], this.normalizeValue(field, input[field.name]));
        }
        for (const field of this.definition.fields) {
            if (field.storage !== 'json')
                continue;
            const value = (0, projection_resource_js_1.getProjectionPathValue)(payload, (_c = field.path) !== null && _c !== void 0 ? _c : []);
            if (value === undefined)
                continue;
            payload = (0, projection_resource_js_1.setProjectionPathValue)(payload, (_d = field.path) !== null && _d !== void 0 ? _d : [], this.normalizeValue(field, value));
        }
        return payload;
    }
    project(record) {
        var _a, _b;
        const projected = Object.assign(Object.assign({}, record), { [this.definition.payload.column]: (_a = record[this.definition.payload.column]) !== null && _a !== void 0 ? _a : {} });
        const payload = projected[this.definition.payload.column];
        for (const field of this.definition.fields) {
            if (field.storage !== 'json')
                continue;
            const value = (0, projection_resource_js_1.getProjectionPathValue)(payload, (_b = field.path) !== null && _b !== void 0 ? _b : []);
            projected[field.name] =
                value === undefined && field.nullable ? null : value;
        }
        return projected;
    }
    filtersFromFindOptions(findOptions) {
        const where = findOptions.where;
        if (where === undefined)
            return [];
        const filters = [];
        const visit = (current) => {
            var _a;
            if (!current || typeof current !== 'object' || Array.isArray(current)) {
                this.invalid('Projection filters must use an AND-only expression.');
            }
            const candidate = current;
            const supportedKeys = new Set([
                'operator',
                'filters',
                'childExpressions',
            ]);
            if (Object.keys(candidate).some((key) => !supportedKeys.has(key))) {
                this.invalid('Projection filters must use an AND-only expression.');
            }
            if (candidate.operator !== undefined && candidate.operator !== 'AND') {
                this.invalid('Projection filters must use an AND-only expression.');
            }
            if (candidate.filters !== undefined &&
                (!candidate.filters ||
                    typeof candidate.filters !== 'object' ||
                    Array.isArray(candidate.filters))) {
                this.invalid('Projection filters must use an AND-only expression.');
            }
            for (const [name, condition] of Object.entries((_a = candidate.filters) !== null && _a !== void 0 ? _a : {})) {
                const field = this.projectionField(name, 'filter');
                if (isFindOperator(condition)) {
                    if (condition.type === 'equal') {
                        this.assertFilterAllowed(field, 'eq');
                        filters.push({
                            field,
                            operator: 'eq',
                            values: this.normalizeFilterValues(field, [condition.value]),
                        });
                    }
                    else if (condition.type === 'between') {
                        this.assertFilterAllowed(field, 'range');
                        filters.push({
                            field,
                            operator: 'range',
                            values: this.normalizeFilterValues(field, condition.value, 2),
                        });
                    }
                    else if (condition.type === 'in' &&
                        name === this.definition.identity.column) {
                        filters.push({
                            field,
                            operator: 'in',
                            values: this.normalizeFilterValues(field, condition.value, null),
                        });
                    }
                    else {
                        this.invalid(`Unsupported projection filter for ${name}.`);
                    }
                }
                else {
                    this.assertFilterAllowed(field, 'eq');
                    filters.push({
                        field,
                        operator: 'eq',
                        values: this.normalizeFilterValues(field, [condition]),
                    });
                }
            }
            if (candidate.childExpressions === undefined)
                return;
            if (!Array.isArray(candidate.childExpressions)) {
                this.invalid('Projection filters must use an AND-only expression.');
            }
            candidate.childExpressions.forEach((child) => visit(child));
        };
        visit(where);
        return filters;
    }
    sortingFromFindOptions(findOptions) {
        var _a;
        return Object.entries((_a = findOptions.order) !== null && _a !== void 0 ? _a : {}).map(([name, direction]) => {
            var _a;
            const field = this.projectionField(name, 'sort');
            if (!((_a = field.query) === null || _a === void 0 ? void 0 : _a.sort))
                this.invalid(`Projection field ${name} is not sortable.`);
            if (direction !== 'ASC' && direction !== 'DESC') {
                this.invalid(`Projection field ${name} has an invalid sort direction.`);
            }
            return { field, direction };
        });
    }
    pageFromFindOptions(findOptions) {
        const { skip, take } = findOptions;
        if (skip !== undefined &&
            (!Number.isSafeInteger(skip) || Number(skip) < 0)) {
            this.invalid('Projection skip must be a non-negative safe integer.');
        }
        if (take !== undefined &&
            (!Number.isSafeInteger(take) || Number(take) < 1)) {
            this.invalid('Projection take must be a positive safe integer.');
        }
        return { skip, take };
    }
    projectionField(name, purpose) {
        try {
            return (0, projection_resource_js_1.getProjectionField)(this.definition, name);
        }
        catch (_a) {
            this.invalid(`Projection ${purpose} field ${name} is not declared.`);
        }
    }
    assertFilterAllowed(field, operator) {
        var _a, _b;
        if (!((_b = (_a = field.query) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.includes(operator))) {
            this.invalid(`Projection field ${field.name} does not allow ${operator}.`);
        }
    }
    normalizeFilterValues(field, values, expectedLength = 1) {
        if (expectedLength !== null && values.length !== expectedLength) {
            this.invalid(`Projection field ${field.name} requires ${expectedLength} filter value${expectedLength === 1 ? '' : 's'}.`);
        }
        if (values.length === 0) {
            this.invalid(`Projection field ${field.name} requires filter values.`);
        }
        if (values.some((value) => value === null || value === undefined)) {
            this.invalid(`Projection field ${field.name} does not support null filters.`);
        }
        return values.map((value) => this.normalizeValue(field, value));
    }
    normalizeValue(field, value) {
        try {
            return (0, projection_resource_js_1.normalizeProjectionCodecValue)(field, value);
        }
        catch (error) {
            this.invalid(error instanceof Error
                ? error.message
                : `Projection field ${field.name} has an invalid value.`);
        }
    }
    guidFromConditions(conditions) {
        const identity = this.definition.identity.column;
        if (Reflect.ownKeys(conditions).length !== 1 ||
            !hasOwn(conditions, identity) ||
            typeof conditions[identity] !== 'string') {
            this.invalid(`Projection resource conditions require only a ${identity}.`);
        }
        return this.normalizeValue((0, projection_resource_js_1.getProjectionField)(this.definition, identity), conditions[identity]);
    }
    rejectUnknownInput(input, creating) {
        const identity = this.definition.identity.column;
        if (!creating && hasOwn(input, identity)) {
            this.invalid(`Projection identity ${identity} is immutable.`);
        }
        const allowed = new Set([
            ...this.definition.fields
                .filter((field) => creating || field.name !== identity)
                .map((field) => field.name),
            ...(creating && this.definition.payload.allowCreate ? ['payload'] : []),
            ...(!creating ? ['expectedRevision'] : []),
        ]);
        for (const key of Object.keys(input)) {
            if (!allowed.has(key))
                this.invalid(`Projection input field ${key} is not writable.`);
        }
    }
    invalid(message) {
        throw this.events.errorBadRequest('projection.invalid-request', {
            response: { message },
        });
    }
    notFound() {
        throw this.events.errorNotFound('projection.resource.not-found', {
            response: { message: 'Projection resource not found.' },
        });
    }
}
exports.ProjectionResourceService = ProjectionResourceService;
//# sourceMappingURL=projection.service.js.map