"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineOmniExtensionProjection = defineOmniExtensionProjection;
exports.createOmniExtensionProjectionEntity = createOmniExtensionProjectionEntity;
exports.createOmniExtensionProjectionTable = createOmniExtensionProjectionTable;
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_record_status_enum_js_1 = require("./omni-record-status.enum.js");
function assertNonEmptyString(value, label, max) {
    if (typeof value !== 'string' ||
        value.trim().length === 0 ||
        value.length > max) {
        throw new TypeError(`${label} must be a non-empty string up to ${max} characters.`);
    }
}
function defineOmniExtensionProjection(definition) {
    assertNonEmptyString(definition.owner?.kind, 'Omni extension owner kind', 64);
    assertNonEmptyString(definition.owner?.title, 'Omni extension owner title', 255);
    assertNonEmptyString(definition.owner?.schema?.id, 'Omni extension owner schema id', 128);
    if (!Number.isInteger(definition.owner?.schema?.version) ||
        definition.owner.schema.version < 1 ||
        definition.owner.schema.version > 2_147_483_647) {
        throw new TypeError('Omni extension owner schema version must be a positive signed 32-bit integer.');
    }
    if (!Object.values(omni_record_status_enum_js_1.OmniRecordStatus).includes(definition.owner.status)) {
        throw new TypeError('Omni extension owner status must be an Omni record status.');
    }
    return (0, crud_gen_1.defineProjectionResource)(definition);
}
function extensionSchema(definition, dialect) {
    const projectionSchema = (0, crud_gen_1.createProjectionSchemaOptions)(definition, dialect);
    const { [definition.revision.column]: _ownerRevision, ...columns } = projectionSchema.columns;
    const scopeColumn = definition.scope.column;
    const identityColumn = definition.identity.column;
    columns[scopeColumn] = {
        ...columns[scopeColumn],
        primary: true,
        nullable: false,
    };
    columns[identityColumn] = {
        ...columns[identityColumn],
        primary: true,
        nullable: false,
        length: 36,
    };
    const references = definition.references ?? [];
    const uniqueConstraints = definition.uniqueConstraints ?? [];
    return {
        columns,
        indices: [
            ...projectionSchema.indices,
            ...references.map((reference) => ({
                name: (0, crud_gen_1.getProjectionReferenceIndexName)(reference),
                columns: (0, crud_gen_1.getProjectionReferenceColumnNames)(definition, reference),
                unique: false,
            })),
            ...uniqueConstraints.map((constraint) => ({
                name: constraint.name,
                columns: (0, crud_gen_1.getProjectionUniqueConstraintColumnNames)(definition, constraint),
                unique: true,
                where: (0, crud_gen_1.compileProjectionUniqueConstraintPredicate)(definition, constraint, dialect.name),
            })),
        ],
        foreignKeys: references.map((reference) => ({
            name: reference.name,
            columnNames: (0, crud_gen_1.getProjectionReferenceColumnNames)(definition, reference),
            referencedTableName: reference.target.tableName,
            referencedColumnNames: (0, crud_gen_1.getProjectionReferenceTargetColumnNames)(reference),
            onDelete: reference.onDelete,
        })),
    };
}
function migrationColumnType(type) {
    if (type === String)
        return 'varchar';
    if (type === Number)
        return 'integer';
    if (type === Boolean)
        return 'boolean';
    if (type === 'simple-json')
        return 'text';
    if (typeof type === 'string')
        return type;
    throw new TypeError('Omni extension projection column type is unsupported.');
}
function createOmniExtensionProjectionEntity(definition, dialect) {
    const { columns, indices, foreignKeys } = extensionSchema(definition, dialect);
    const scopeColumn = definition.scope.column;
    const identityColumn = definition.identity.column;
    class OmniExtensionProjectionEntity {
    }
    (0, typeorm_1.Entity)(definition.tableName)(OmniExtensionProjectionEntity);
    for (const [columnName, declared] of Object.entries(columns)) {
        const options = { ...declared };
        const primary = options.primary === true;
        delete options.primary;
        if (primary) {
            (0, typeorm_1.PrimaryColumn)(options.type, options)(OmniExtensionProjectionEntity.prototype, columnName);
        }
        else if (typeof options.type === 'function') {
            (0, typeorm_1.Column)(options)(OmniExtensionProjectionEntity.prototype, columnName);
        }
        else {
            (0, typeorm_1.Column)(options.type, options)(OmniExtensionProjectionEntity.prototype, columnName);
        }
    }
    for (const index of indices) {
        if (!index.name || !Array.isArray(index.columns)) {
            throw new TypeError('Omni extension projection indexes require a name and column list.');
        }
        (0, typeorm_1.Index)(index.name, index.columns, {
            unique: index.unique,
            ...(index.where ? { where: index.where } : {}),
        })(OmniExtensionProjectionEntity);
    }
    for (const foreignKey of foreignKeys) {
        (0, typeorm_1.ForeignKey)(foreignKey.referencedTableName, foreignKey.columnNames, foreignKey.referencedColumnNames, { name: foreignKey.name, onDelete: foreignKey.onDelete })(OmniExtensionProjectionEntity);
    }
    (0, typeorm_1.ForeignKey)(() => omni_record_entity_js_1.OmniRecordEntity, [scopeColumn, identityColumn], ['scopeId', 'guid'], { onDelete: 'CASCADE' })(OmniExtensionProjectionEntity);
    return OmniExtensionProjectionEntity;
}
function createOmniExtensionProjectionTable(definition, dialect) {
    const { columns, indices, foreignKeys } = extensionSchema(definition, dialect);
    const scopeColumn = definition.scope.column;
    const identityColumn = definition.identity.column;
    return new typeorm_1.Table({
        name: definition.tableName,
        columns: Object.entries(columns).map(([name, options]) => ({
            name,
            type: migrationColumnType(options.type),
            isPrimary: options.primary === true,
            isNullable: options.nullable === true,
            ...(options.length !== undefined
                ? { length: String(options.length) }
                : {}),
        })),
        indices: indices.map((index) => {
            if (!index.name || !Array.isArray(index.columns)) {
                throw new TypeError('Omni extension projection indexes require a name and column list.');
            }
            return {
                name: index.name,
                columnNames: index.columns,
                isUnique: index.unique === true,
                ...(index.where ? { where: index.where } : {}),
            };
        }),
        foreignKeys: [
            {
                columnNames: [scopeColumn, identityColumn],
                referencedTableName: 'omni-record',
                referencedColumnNames: ['scopeId', 'guid'],
                onDelete: 'CASCADE',
            },
            ...foreignKeys,
        ],
    });
}
//# sourceMappingURL=omni-extension-projection.definition.js.map