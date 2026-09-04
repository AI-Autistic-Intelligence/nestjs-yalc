"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectionCanonicalUuidPattern = exports.projectionPathSegmentPattern = exports.PROJECTION_INTEGER_MAX = exports.PROJECTION_INTEGER_MIN = void 0;
exports.assertProjectionPath = assertProjectionPath;
exports.assertProjectionResourceDefinition = assertProjectionResourceDefinition;
exports.getProjectionReferenceIndexName = getProjectionReferenceIndexName;
exports.getProjectionReferenceColumnNames = getProjectionReferenceColumnNames;
exports.getProjectionReferenceTargetColumnNames = getProjectionReferenceTargetColumnNames;
exports.getProjectionUniqueConstraintColumnNames = getProjectionUniqueConstraintColumnNames;
exports.compileProjectionUniqueConstraintPredicate = compileProjectionUniqueConstraintPredicate;
exports.assertProjectionCodecValue = assertProjectionCodecValue;
exports.normalizeProjectionCodecValue = normalizeProjectionCodecValue;
exports.assertProjectionPayloadValue = assertProjectionPayloadValue;
exports.defineProjectionResource = defineProjectionResource;
exports.getProjectionField = getProjectionField;
exports.getProjectionPathValue = getProjectionPathValue;
exports.setProjectionPathValue = setProjectionPathValue;
exports.PROJECTION_INTEGER_MIN = -(2 ** 31);
exports.PROJECTION_INTEGER_MAX = 2 ** 31 - 1;
exports.projectionPathSegmentPattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
exports.projectionCanonicalUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function freezeDeep(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        for (const child of Object.values(value)) {
            freezeDeep(child);
        }
        Object.freeze(value);
    }
    return value;
}
function assertProjectionPath(path, fieldName = 'Projection JSON field') {
    if (path.length === 0) {
        throw new TypeError(`${fieldName} requires a non-empty path.`);
    }
    for (const segment of path) {
        if (typeof segment !== 'string' ||
            !exports.projectionPathSegmentPattern.test(segment)) {
            throw new TypeError(`${fieldName} has an invalid path segment. Portable paths use /${exports.projectionPathSegmentPattern.source}/.`);
        }
    }
}
function assertIdentifier(value, label) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`${label} must be a non-empty identifier.`);
    }
}
const projectionSchemaIdentifierPattern = /^[A-Za-z_][A-Za-z0-9_-]*$/;
function assertSchemaIdentifier(value, label) {
    if (typeof value !== 'string' ||
        !projectionSchemaIdentifierPattern.test(value)) {
        throw new TypeError(`${label} must match /${projectionSchemaIdentifierPattern.source}/.`);
    }
}
function assertBoolean(value, label) {
    if (typeof value !== 'boolean') {
        throw new TypeError(`${label} must be a boolean.`);
    }
}
function pathsOverlap(left, right) {
    const length = Math.min(left.length, right.length);
    return left
        .slice(0, length)
        .every((segment, index) => segment === right[index]);
}
function assertFieldQueryCapabilities(field) {
    var _a, _b, _c, _d, _e;
    const filters = (_b = (_a = field.query) === null || _a === void 0 ? void 0 : _a.filter) !== null && _b !== void 0 ? _b : [];
    if (!Array.isArray(filters) ||
        filters.some((filter) => filter !== 'eq' && filter !== 'range')) {
        throw new TypeError(`Projection field ${field.name} has an unsupported filter.`);
    }
    if (field.codec === 'json') {
        if (((_d = (_c = field.query) === null || _c === void 0 ? void 0 : _c.filter) === null || _d === void 0 ? void 0 : _d.length) || ((_e = field.query) === null || _e === void 0 ? void 0 : _e.sort) || field.index) {
            throw new TypeError(`Projection JSON field ${field.name} cannot be filtered, sorted, or indexed.`);
        }
        return;
    }
    if ((field.codec === 'string' ||
        field.codec === 'uuid' ||
        field.codec === 'boolean') &&
        filters.includes('range')) {
        throw new TypeError(`Projection ${field.codec} field ${field.name} cannot declare range filtering.`);
    }
}
function promotedColumnField(definition, fieldName, label) {
    assertSchemaIdentifier(fieldName, label);
    if (fieldName === definition.identity.column) {
        throw new TypeError(`${label} cannot use the projection identity field.`);
    }
    if (fieldName === definition.scope.column) {
        throw new TypeError(`${label} cannot use the projection scope field.`);
    }
    const field = definition.fields.find((candidate) => candidate.name === fieldName);
    if (!field) {
        throw new TypeError(`${label} is not a declared projection field.`);
    }
    if (field.storage !== 'column' || field.codec === 'json') {
        throw new TypeError(`${label} must use a promoted column field.`);
    }
    assertSchemaIdentifier(field.column, `${label} column`);
    return field;
}
function assertDistinctFieldNames(fields, label) {
    if (!Array.isArray(fields) || fields.length === 0) {
        throw new TypeError(`${label} requires at least one promoted field.`);
    }
    if (new Set(fields).size !== fields.length) {
        throw new TypeError(`${label} cannot declare the same field twice.`);
    }
}
function assertProjectionReferences(definition, indexNames) {
    var _a, _b, _c, _d;
    const references = (_a = definition.references) !== null && _a !== void 0 ? _a : [];
    if (!Array.isArray(references)) {
        throw new TypeError('Projection references must be an array.');
    }
    const referenceNames = new Set();
    for (const reference of references) {
        assertSchemaIdentifier(reference === null || reference === void 0 ? void 0 : reference.name, 'Projection reference name');
        if (referenceNames.has(reference.name)) {
            throw new TypeError(`Projection reference ${reference.name} is declared twice.`);
        }
        referenceNames.add(reference.name);
        const childIndexName = getProjectionReferenceIndexName(reference);
        if (indexNames.has(childIndexName)) {
            throw new TypeError(`Projection reference ${reference.name} child index collides with another index.`);
        }
        indexNames.add(childIndexName);
        assertDistinctFieldNames(reference.fields, `Projection reference ${reference.name}`);
        const localFields = reference.fields.map((fieldName) => promotedColumnField(definition, fieldName, `Projection reference ${reference.name} field ${fieldName}`));
        assertSchemaIdentifier((_b = reference.target) === null || _b === void 0 ? void 0 : _b.tableName, `Projection reference ${reference.name} target table`);
        assertSchemaIdentifier((_c = reference.target) === null || _c === void 0 ? void 0 : _c.scopeColumn, `Projection reference ${reference.name} target scope column`);
        if (!Array.isArray((_d = reference.target) === null || _d === void 0 ? void 0 : _d.identityColumns) ||
            reference.target.identityColumns.length === 0) {
            throw new TypeError(`Projection reference ${reference.name} requires target identity columns.`);
        }
        if (reference.target.identityColumns.length !== localFields.length) {
            throw new TypeError(`Projection reference ${reference.name} local and target identity column counts must match.`);
        }
        if (new Set(reference.target.identityColumns).size !==
            reference.target.identityColumns.length) {
            throw new TypeError(`Projection reference ${reference.name} cannot repeat target identity columns.`);
        }
        for (const targetColumn of reference.target.identityColumns) {
            assertSchemaIdentifier(targetColumn, `Projection reference ${reference.name} target identity column`);
            if (targetColumn === reference.target.scopeColumn) {
                throw new TypeError(`Projection reference ${reference.name} target identity cannot use its scope column.`);
            }
        }
        if (reference.onDelete !== 'RESTRICT' &&
            reference.onDelete !== 'NO ACTION') {
            throw new TypeError(`Projection reference ${reference.name} only supports RESTRICT or NO ACTION on delete.`);
        }
    }
}
function assertProjectionUniqueConstraints(definition, indexNames) {
    var _a;
    const constraints = (_a = definition.uniqueConstraints) !== null && _a !== void 0 ? _a : [];
    if (!Array.isArray(constraints)) {
        throw new TypeError('Projection unique constraints must be an array.');
    }
    const constraintNames = new Set();
    for (const constraint of constraints) {
        assertSchemaIdentifier(constraint === null || constraint === void 0 ? void 0 : constraint.name, 'Projection unique constraint name');
        if (constraintNames.has(constraint.name) ||
            indexNames.has(constraint.name)) {
            throw new TypeError(`Projection unique constraint ${constraint.name} collides with another index or constraint.`);
        }
        constraintNames.add(constraint.name);
        indexNames.add(constraint.name);
        assertDistinctFieldNames(constraint.fields, `Projection unique constraint ${constraint.name}`);
        for (const fieldName of constraint.fields) {
            promotedColumnField(definition, fieldName, `Projection unique constraint ${constraint.name} field ${fieldName}`);
        }
        if (constraint.predicate === undefined)
            continue;
        if (typeof constraint.predicate !== 'object' ||
            Array.isArray(constraint.predicate)) {
            throw new TypeError(`Projection unique constraint ${constraint.name} requires a predicate map.`);
        }
        const predicateEntries = Object.entries(constraint.predicate);
        if (predicateEntries.length === 0) {
            throw new TypeError(`Projection unique constraint ${constraint.name} requires at least one predicate field.`);
        }
        for (const [fieldName, value] of predicateEntries) {
            const field = promotedColumnField(definition, fieldName, `Projection unique constraint ${constraint.name} predicate ${fieldName}`);
            if (value === null || value === undefined) {
                throw new TypeError(`Projection unique constraint ${constraint.name} predicate ${fieldName} must be a scalar literal.`);
            }
            assertProjectionCodecValue(field, value);
        }
    }
}
function assertProjectionResourceDefinition(definition) {
    var _a, _b, _c, _d, _e, _f;
    assertIdentifier(definition.id, 'Projection resource id');
    assertIdentifier(definition.tableName, 'Projection table name');
    assertIdentifier(definition.identity.column, 'Projection identity column');
    assertIdentifier(definition.scope.column, 'Projection scope column');
    assertIdentifier(definition.revision.column, 'Projection revision column');
    assertIdentifier(definition.payload.column, 'Projection payload column');
    if (definition.payload.column !== 'payload') {
        throw new TypeError('Projection payload column must be named payload to match the public payload field.');
    }
    const reservedColumns = [
        definition.scope.column,
        definition.identity.column,
        definition.revision.column,
        definition.payload.column,
    ];
    if (new Set(reservedColumns).size !== reservedColumns.length) {
        throw new TypeError('Projection scope, identity, revision, and payload columns must be distinct.');
    }
    if (definition.scope.serverOwned !== true) {
        throw new TypeError('Projection scope must be server-owned.');
    }
    if (definition.deletion !== 'hard') {
        throw new TypeError('Projection resource only supports hard deletion.');
    }
    assertBoolean(definition.payload.allowCreate, 'Projection payload allowCreate');
    if ('allowPatch' in definition.payload) {
        throw new TypeError('Projection raw payload updates are not supported.');
    }
    if (!definition.identity.uniqueWithinScope) {
        throw new TypeError('Projection identity must declare uniqueness within its server-owned scope.');
    }
    const names = new Set();
    const columns = new Set();
    const indexNames = new Set();
    const jsonFields = [];
    const reservedPublicNames = new Set([
        definition.scope.column,
        definition.revision.column,
        'payload',
        'expectedRevision',
    ]);
    const scopedIdentityIndexName = `${definition.tableName}_scope_${definition.identity.column}_unique`;
    for (const field of definition.fields) {
        assertIdentifier(field.name, 'Projection field name');
        if (names.has(field.name)) {
            throw new TypeError(`Projection field ${field.name} is declared twice.`);
        }
        if (reservedPublicNames.has(field.name)) {
            throw new TypeError(`Projection field ${field.name} collides with a reserved public field.`);
        }
        names.add(field.name);
        assertBoolean(field.nullable, `Projection field ${field.name} nullable`);
        if (field.requiredOnCreate !== undefined &&
            typeof field.requiredOnCreate !== 'boolean') {
            throw new TypeError(`Projection field ${field.name} requiredOnCreate must be a boolean.`);
        }
        if (field.requiredOnCreate && field.nullable) {
            throw new TypeError(`Projection field ${field.name} cannot be both required on create and nullable.`);
        }
        if (!field.nullable && field.requiredOnCreate !== true) {
            throw new TypeError(`Non-null projection field ${field.name} must be required on create.`);
        }
        if (field.storage === 'column') {
            assertIdentifier(field.column, `Projection field ${field.name} column`);
            if (field.path) {
                throw new TypeError(`Column projection field ${field.name} cannot declare a JSON path.`);
            }
            const column = field.column;
            const isIdentityField = field.name === definition.identity.column &&
                column === definition.identity.column;
            if (!isIdentityField && reservedColumns.includes(column)) {
                throw new TypeError(`Projection field ${field.name} collides with a reserved column.`);
            }
            if (columns.has(column)) {
                throw new TypeError(`Projection column ${column} is declared twice.`);
            }
            columns.add(column);
        }
        if (field.storage === 'json') {
            if (field.column) {
                throw new TypeError(`JSON projection field ${field.name} cannot declare a column.`);
            }
            assertProjectionPath((_a = field.path) !== null && _a !== void 0 ? _a : [], `Projection field ${field.name}`);
            for (const existing of jsonFields) {
                if (pathsOverlap((_b = existing.path) !== null && _b !== void 0 ? _b : [], (_c = field.path) !== null && _c !== void 0 ? _c : [])) {
                    throw new TypeError(`Projection JSON path for ${field.name} overlaps ${existing.name}.`);
                }
            }
            jsonFields.push(field);
        }
        if (field.storage !== 'column' && field.storage !== 'json') {
            throw new TypeError(`Projection field ${field.name} has an unsupported storage mode.`);
        }
        if (!['string', 'uuid', 'instant', 'integer', 'boolean', 'json'].includes(field.codec)) {
            throw new TypeError(`Projection field ${field.name} has an unsupported codec.`);
        }
        if (field.codec === 'json' && field.storage !== 'json') {
            throw new TypeError(`Projection JSON field ${field.name} must use JSON storage.`);
        }
        assertFieldQueryCapabilities(field);
        if (((_d = field.query) === null || _d === void 0 ? void 0 : _d.sort) !== undefined &&
            typeof field.query.sort !== 'boolean') {
            throw new TypeError(`Projection field ${field.name} sort capability must be a boolean.`);
        }
        if (field.index) {
            assertIdentifier(field.index.name, `Projection field ${field.name} index`);
            if (field.index.name === scopedIdentityIndexName) {
                throw new TypeError(`Projection field ${field.name} index collides with the scoped identity index.`);
            }
            if (indexNames.has(field.index.name)) {
                throw new TypeError(`Projection index ${field.index.name} is declared twice.`);
            }
            indexNames.add(field.index.name);
        }
    }
    const identityField = definition.fields.find((field) => field.name === definition.identity.column);
    if (!identityField ||
        identityField.storage !== 'column' ||
        identityField.column !== definition.identity.column ||
        (identityField.codec !== 'string' && identityField.codec !== 'uuid') ||
        identityField.nullable ||
        !identityField.requiredOnCreate) {
        throw new TypeError(`Projection identity ${definition.identity.column} must be a required non-null string or UUID column field.`);
    }
    assertProjectionReferences(definition, indexNames);
    assertProjectionUniqueConstraints(definition, indexNames);
    const declaredConstraintNames = [
        ...((_e = definition.references) !== null && _e !== void 0 ? _e : []).map((reference) => reference.name),
        ...((_f = definition.uniqueConstraints) !== null && _f !== void 0 ? _f : []).map((constraint) => constraint.name),
    ];
    if (new Set(declaredConstraintNames).size !== declaredConstraintNames.length) {
        throw new TypeError('Projection reference and unique constraint names must be distinct.');
    }
}
function getProjectionReferenceIndexName(reference) {
    return `${reference.name}_idx`;
}
function getProjectionReferenceColumnNames(definition, reference) {
    assertProjectionResourceDefinition(definition);
    return [
        definition.scope.column,
        ...reference.fields.map((fieldName) => promotedColumnField(definition, fieldName, `Projection reference ${reference.name} field ${fieldName}`).column),
    ];
}
function getProjectionReferenceTargetColumnNames(reference) {
    return [reference.target.scopeColumn, ...reference.target.identityColumns];
}
function getProjectionUniqueConstraintColumnNames(definition, constraint) {
    assertProjectionResourceDefinition(definition);
    return [
        definition.scope.column,
        ...constraint.fields.map((fieldName) => promotedColumnField(definition, fieldName, `Projection unique constraint ${constraint.name} field ${fieldName}`).column),
    ];
}
function quoteProjectionIdentifier(identifier) {
    assertSchemaIdentifier(identifier, 'Projection SQL identifier');
    return `"${identifier}"`;
}
function compileProjectionPredicateLiteral(field, value, dialect) {
    if (field.codec === 'boolean') {
        return value
            ? dialect === 'sqlite'
                ? '1'
                : 'TRUE'
            : dialect === 'sqlite'
                ? '0'
                : 'FALSE';
    }
    if (field.codec === 'integer')
        return String(value);
    if (field.codec === 'string' ||
        field.codec === 'uuid' ||
        field.codec === 'instant') {
        return `'${String(value).replaceAll("'", "''")}'`;
    }
    throw new TypeError(`Projection unique predicates cannot use ${field.codec} field ${field.name}.`);
}
function compileProjectionUniqueConstraintPredicate(definition, constraint, dialect) {
    var _a;
    assertProjectionResourceDefinition(definition);
    if (dialect !== 'sqlite' && dialect !== 'postgres') {
        throw new TypeError(`Unsupported projection predicate dialect ${dialect}.`);
    }
    const declared = (_a = definition.uniqueConstraints) === null || _a === void 0 ? void 0 : _a.find((candidate) => candidate.name === constraint.name);
    if (!declared) {
        throw new TypeError(`Projection unique constraint ${constraint.name} is not declared by the resource.`);
    }
    if (declared.predicate === undefined)
        return undefined;
    return Object.entries(declared.predicate)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([fieldName, value]) => {
        const field = promotedColumnField(definition, fieldName, `Projection unique constraint ${declared.name} predicate ${fieldName}`);
        assertProjectionCodecValue(field, value);
        return `${quoteProjectionIdentifier(field.column)} = ${compileProjectionPredicateLiteral(field, value, dialect)}`;
    })
        .join(' AND ');
}
function assertProjectionCodecValue(field, value) {
    if (value === null) {
        if (!field.nullable) {
            throw new TypeError(`Projection field ${field.name} cannot be null.`);
        }
        return;
    }
    if (field.codec === 'string') {
        if (typeof value !== 'string') {
            throw new TypeError(`Projection string field ${field.name} must be a string.`);
        }
        return;
    }
    if (field.codec === 'uuid') {
        if (typeof value !== 'string' ||
            !exports.projectionCanonicalUuidPattern.test(value)) {
            throw new TypeError(`Projection UUID field ${field.name} must be a canonical UUID.`);
        }
        return;
    }
    if (field.codec === 'instant') {
        if (typeof value !== 'string' ||
            Number.isNaN(Date.parse(value)) ||
            new Date(value).toISOString() !== value) {
            throw new TypeError(`Projection instant field ${field.name} must be a canonical UTC ISO timestamp.`);
        }
        return;
    }
    if (field.codec === 'integer') {
        if (!Number.isInteger(value) ||
            value < exports.PROJECTION_INTEGER_MIN ||
            value > exports.PROJECTION_INTEGER_MAX) {
            throw new TypeError(`Projection integer field ${field.name} must be a signed 32-bit integer.`);
        }
        return;
    }
    if (field.codec === 'boolean') {
        if (typeof value !== 'boolean') {
            throw new TypeError(`Projection boolean field ${field.name} must be a boolean.`);
        }
        return;
    }
    if (value === undefined || !isJsonCompatible(value, new Set())) {
        throw new TypeError(`Projection JSON field ${field.name} must contain a JSON-compatible value.`);
    }
}
function normalizeProjectionCodecValue(field, value) {
    if (field.codec === 'instant' && value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new TypeError(`Projection instant field ${field.name} must be a valid Date.`);
        }
        value = value.toISOString();
    }
    assertProjectionCodecValue(field, value);
    return value;
}
function isJsonCompatible(value, seen) {
    if (value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number')
        return Number.isFinite(value);
    if (Array.isArray(value)) {
        if (seen.has(value))
            return false;
        seen.add(value);
        return value.every((item) => isJsonCompatible(item, seen));
    }
    if (!value || typeof value !== 'object' || seen.has(value))
        return false;
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== null &&
        (typeof prototype.constructor !== 'function' ||
            prototype.constructor.name !== 'Object')) {
        return false;
    }
    seen.add(value);
    return Object.values(value).every((item) => isJsonCompatible(item, seen));
}
function assertProjectionPayloadValue(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError('Projection payload must be a JSON object.');
    }
    if (!isJsonCompatible(value, new Set())) {
        throw new TypeError('Projection payload must be JSON-compatible.');
    }
}
function defineProjectionResource(definition) {
    assertProjectionResourceDefinition(definition);
    return freezeDeep(definition);
}
function getProjectionField(definition, name) {
    const field = definition.fields.find((candidate) => candidate.name === name);
    if (!field) {
        throw new TypeError(`Unknown projection field ${name}.`);
    }
    return field;
}
function getProjectionPathValue(payload, path) {
    let current = payload;
    for (const part of path) {
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
            return undefined;
        }
        current = current[part];
    }
    return current;
}
function setProjectionPathValue(payload, path, value) {
    assertProjectionPath(path);
    const clone = structuredClone(payload);
    let current = clone;
    for (const part of path.slice(0, -1)) {
        const existing = current[part];
        if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
            current[part] = {};
        }
        current = current[part];
    }
    current[path[path.length - 1]] = value;
    return clone;
}
//# sourceMappingURL=projection-resource.js.map