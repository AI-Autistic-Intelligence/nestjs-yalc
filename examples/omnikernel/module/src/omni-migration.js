"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureOmniMigrationSnapshot = captureOmniMigrationSnapshot;
exports.defineOmniMigrationSnapshot = defineOmniMigrationSnapshot;
exports.createOmniMigrationPlan = createOmniMigrationPlan;
const typeorm_1 = require("typeorm");
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const omni_external_ref_entity_js_1 = require("./base/omni-external-ref.entity.js");
const omni_named_entity_js_1 = require("./base/omni-named.entity.js");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_collection_entity_js_1 = require("./omni-collection.entity.js");
const omni_document_entity_js_1 = require("./omni-document.entity.js");
const omniBaseEntities = [
    omni_named_entity_js_1.OmniNamedEntity,
    omni_record_entity_js_1.OmniRecordEntity,
    omni_document_entity_js_1.OmniDocumentEntity,
    omni_collection_entity_js_1.OmniCollectionEntity,
    omni_relation_entity_js_1.OmniRelationEntity,
    omni_external_ref_entity_js_1.OmniExternalRefEntity,
];
function freezeDeep(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        for (const child of Object.values(value)) {
            freezeDeep(child);
        }
        Object.freeze(value);
    }
    return value;
}
function dialectFor(dataSource) {
    if (dataSource.options.type === 'sqlite')
        return 'sqlite';
    if (dataSource.options.type === 'postgres')
        return 'postgres';
    throw new TypeError('Omni migration snapshots support SQLite or PostgreSQL.');
}
function tableOptions(table) {
    return {
        database: table.database,
        schema: table.schema,
        name: table.name,
        withoutRowid: table.withoutRowid,
        engine: table.engine,
        comment: table.comment,
        columns: table.columns.map((column) => ({
            name: column.name,
            type: column.type,
            default: column.default,
            onUpdate: column.onUpdate,
            isNullable: column.isNullable,
            isGenerated: column.isGenerated,
            generationStrategy: column.generationStrategy,
            isPrimary: column.isPrimary,
            isUnique: column.isUnique,
            isArray: column.isArray,
            comment: column.comment,
            length: column.length,
            width: column.width,
            charset: column.charset,
            collation: column.collation,
            precision: column.precision,
            scale: column.scale,
            zerofill: column.zerofill,
            unsigned: column.unsigned,
            enum: column.enum ? [...column.enum] : undefined,
            enumName: column.enumName,
            primaryKeyConstraintName: column.primaryKeyConstraintName,
            asExpression: column.asExpression,
            generatedType: column.generatedType,
            generatedIdentity: column.generatedIdentity,
            spatialFeatureType: column.spatialFeatureType,
            srid: column.srid,
        })),
        indices: table.indices.map((index) => ({
            name: index.name,
            columnNames: [...index.columnNames],
            isUnique: index.isUnique,
            isSpatial: index.isSpatial,
            isConcurrent: index.isConcurrent,
            isFulltext: index.isFulltext,
            isNullFiltered: index.isNullFiltered,
            parser: index.parser,
            where: index.where,
        })),
        foreignKeys: table.foreignKeys.map((foreignKey) => ({
            name: foreignKey.name,
            columnNames: [...foreignKey.columnNames],
            referencedDatabase: foreignKey.referencedDatabase,
            referencedSchema: foreignKey.referencedSchema,
            referencedTableName: foreignKey.referencedTableName,
            referencedColumnNames: [...foreignKey.referencedColumnNames],
            onDelete: foreignKey.onDelete,
            onUpdate: foreignKey.onUpdate,
            deferrable: foreignKey.deferrable,
        })),
        uniques: table.uniques.map((unique) => ({
            name: unique.name,
            columnNames: [...unique.columnNames],
            deferrable: unique.deferrable,
        })),
        checks: table.checks.map((check) => ({
            name: check.name,
            columnNames: check.columnNames ? [...check.columnNames] : undefined,
            expression: check.expression,
        })),
        exclusions: table.exclusions.map((exclusion) => ({
            name: exclusion.name,
            expression: exclusion.expression,
        })),
    };
}
function tableSnapshots(dataSource, entities) {
    const byTableName = new Map();
    for (const entity of entities) {
        const metadata = dataSource.getMetadata(entity);
        const table = typeorm_1.Table.create(metadata, dataSource.driver);
        table.foreignKeys = metadata.foreignKeys.map((foreignKey) => typeorm_1.TableForeignKey.create(foreignKey, dataSource.driver));
        const current = byTableName.get(table.name);
        if (!current || current.columns.length < table.columns.length) {
            byTableName.set(table.name, table);
        }
    }
    return orderTablesTopologically([...byTableName.values()].map(tableOptions));
}
function orderTablesTopologically(tables) {
    const byName = new Map();
    for (const table of tables) {
        if (!table.name)
            throw new TypeError('Omni migration table name is required.');
        byName.set(table.name, table);
    }
    const dependencies = new Map();
    for (const table of tables) {
        const tableName = table.name;
        const parents = new Set();
        for (const foreignKey of table.foreignKeys ?? []) {
            const parent = foreignKey.referencedTableName;
            if (!parent || parent === tableName)
                continue;
            if (!byName.has(parent)) {
                throw new TypeError(`Omni migration table ${tableName} references ${parent}, which is absent from this snapshot.`);
            }
            parents.add(parent);
        }
        dependencies.set(tableName, parents);
    }
    const remaining = new Map([...dependencies.entries()].map(([name, parents]) => [
        name,
        new Set(parents),
    ]));
    const ordered = [];
    while (remaining.size > 0) {
        const ready = tables.filter((table) => table.name !== undefined && remaining.get(table.name)?.size === 0);
        if (ready.length === 0) {
            throw new TypeError(`Omni migration snapshot has a cross-table foreign-key cycle: ${[
                ...remaining.keys(),
            ].join(', ')}.`);
        }
        for (const table of ready) {
            const name = table.name;
            remaining.delete(name);
            ordered.push(table);
            for (const parents of remaining.values())
                parents.delete(name);
        }
    }
    return ordered;
}
function quotedIdentifier(identifier) {
    return `"${identifier.replaceAll('"', '""')}"`;
}
function quotedTableName(table) {
    if (!table.name)
        throw new TypeError('Omni migration table name is required.');
    return [table.schema, table.name]
        .filter((part) => typeof part === 'string' && part.length > 0)
        .map(quotedIdentifier)
        .join('.');
}
function captureOmniMigrationSnapshot(version, dataSource, extensions = []) {
    const dialect = dialectFor(dataSource);
    return defineOmniMigrationSnapshot({
        version,
        dialect,
        tables: tableSnapshots(dataSource, [
            ...omniBaseEntities,
            ...extensions.flatMap((extension) => extension.entities),
        ]),
        indexStatements: extensions.flatMap((extension) => (0, crud_gen_1.createProjectionDialect)(dialect).compileIndexStatements(extension.definition)),
    });
}
function defineOmniMigrationSnapshot(snapshot) {
    if (typeof snapshot.version !== 'string' ||
        snapshot.version.trim().length === 0) {
        throw new TypeError('Omni migration snapshot version is required.');
    }
    if (snapshot.dialect !== 'sqlite' && snapshot.dialect !== 'postgres') {
        throw new TypeError('Omni migration snapshot dialect is unsupported.');
    }
    if (!Array.isArray(snapshot.tables) || snapshot.tables.length === 0) {
        throw new TypeError('Omni migration snapshot requires at least one table.');
    }
    const names = snapshot.tables.map((table) => table.name);
    if (names.some((name) => typeof name !== 'string' || name.length === 0) ||
        new Set(names).size !== names.length) {
        throw new TypeError('Omni migration snapshot table names must be unique.');
    }
    if (!Array.isArray(snapshot.indexStatements) ||
        snapshot.indexStatements.some((statement) => typeof statement !== 'string' || statement.trim().length === 0) ||
        new Set(snapshot.indexStatements).size !== snapshot.indexStatements.length) {
        throw new TypeError('Omni migration snapshot index statements must be unique non-empty strings.');
    }
    return freezeDeep(structuredClone(snapshot));
}
function createOmniMigrationPlan(snapshot) {
    const source = defineOmniMigrationSnapshot(snapshot);
    const tables = orderTablesTopologically(source.tables);
    return Object.freeze({
        version: source.version,
        tableNames: Object.freeze(tables.map((table) => table.name)),
        indexStatements: Object.freeze([...source.indexStatements]),
        createTables: () => tables.map((table) => new typeorm_1.Table(structuredClone(table))),
        create: async (queryRunner) => {
            for (const table of tables) {
                await queryRunner.createTable(new typeorm_1.Table(structuredClone(table)));
            }
            for (const statement of source.indexStatements) {
                await queryRunner.query(statement);
            }
        },
        drop: async (queryRunner) => {
            for (const table of [...tables].reverse()) {
                await queryRunner.query(`DROP TABLE IF EXISTS ${quotedTableName(table)}`);
            }
        },
    });
}
//# sourceMappingURL=omni-migration.js.map