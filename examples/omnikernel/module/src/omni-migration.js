import { Table, TableForeignKey } from 'typeorm';
import { createProjectionDialect, } from '@nest-yalc-2/crud-gen';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniNamedEntity } from './base/omni-named.entity.js';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import { OmniDocumentEntity } from './omni-document.entity.js';
const omniBaseEntities = [
    OmniNamedEntity,
    OmniRecordEntity,
    OmniDocumentEntity,
    OmniCollectionEntity,
    OmniRelationEntity,
    OmniExternalRefEntity,
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
        ...(table.database !== undefined ? { database: table.database } : {}),
        ...(table.schema !== undefined ? { schema: table.schema } : {}),
        name: table.name,
        ...(table.withoutRowid !== undefined ? { withoutRowid: table.withoutRowid } : {}),
        ...(table.engine !== undefined ? { engine: table.engine } : {}),
        ...(table.comment !== undefined ? { comment: table.comment } : {}),
        columns: table.columns.map((column) => ({
            name: column.name,
            type: column.type,
            default: column.default,
            ...(column.onUpdate !== undefined ? { onUpdate: column.onUpdate } : {}),
            isNullable: column.isNullable,
            isGenerated: column.isGenerated,
            ...(column.generationStrategy !== undefined ? { generationStrategy: column.generationStrategy } : {}),
            isPrimary: column.isPrimary,
            isUnique: column.isUnique,
            isArray: column.isArray,
            ...(column.comment !== undefined ? { comment: column.comment } : {}),
            ...(column.length !== undefined ? { length: column.length } : {}),
            ...(column.width !== undefined ? { width: column.width } : {}),
            ...(column.charset !== undefined ? { charset: column.charset } : {}),
            ...(column.collation !== undefined ? { collation: column.collation } : {}),
            ...(column.precision !== undefined ? { precision: column.precision } : {}),
            ...(column.scale !== undefined ? { scale: column.scale } : {}),
            ...(column.zerofill !== undefined ? { zerofill: column.zerofill } : {}),
            ...(column.unsigned !== undefined ? { unsigned: column.unsigned } : {}),
            ...(column.enum !== undefined ? { enum: [...column.enum] } : {}),
            ...(column.enumName !== undefined ? { enumName: column.enumName } : {}),
            ...(column.primaryKeyConstraintName !== undefined ? { primaryKeyConstraintName: column.primaryKeyConstraintName } : {}),
            ...(column.asExpression !== undefined ? { asExpression: column.asExpression } : {}),
            ...(column.generatedType !== undefined ? { generatedType: column.generatedType } : {}),
            ...(column.generatedIdentity !== undefined ? { generatedIdentity: column.generatedIdentity } : {}),
            ...(column.spatialFeatureType !== undefined ? { spatialFeatureType: column.spatialFeatureType } : {}),
            ...(column.srid !== undefined ? { srid: column.srid } : {}),
        })),
        indices: table.indices.map((index) => ({
            ...(index.name !== undefined ? { name: index.name } : {}),
            columnNames: [...index.columnNames],
            isUnique: index.isUnique,
            isSpatial: index.isSpatial,
            isConcurrent: index.isConcurrent,
            isFulltext: index.isFulltext,
            isNullFiltered: index.isNullFiltered,
            ...(index.parser !== undefined ? { parser: index.parser } : {}),
            ...(index.where !== undefined ? { where: index.where } : {}),
        })),
        foreignKeys: table.foreignKeys.map((foreignKey) => ({
            ...(foreignKey.name !== undefined ? { name: foreignKey.name } : {}),
            columnNames: [...foreignKey.columnNames],
            ...(foreignKey.referencedDatabase !== undefined ? { referencedDatabase: foreignKey.referencedDatabase } : {}),
            ...(foreignKey.referencedSchema !== undefined ? { referencedSchema: foreignKey.referencedSchema } : {}),
            referencedTableName: foreignKey.referencedTableName,
            referencedColumnNames: [...foreignKey.referencedColumnNames],
            ...(foreignKey.onDelete !== undefined ? { onDelete: foreignKey.onDelete } : {}),
            ...(foreignKey.onUpdate !== undefined ? { onUpdate: foreignKey.onUpdate } : {}),
            ...(foreignKey.deferrable !== undefined ? { deferrable: foreignKey.deferrable } : {}),
        })),
        uniques: table.uniques.map((unique) => ({
            ...(unique.name !== undefined ? { name: unique.name } : {}),
            columnNames: [...unique.columnNames],
            ...(unique.deferrable !== undefined ? { deferrable: unique.deferrable } : {}),
        })),
        checks: table.checks.map((check) => ({
            ...(check.name !== undefined ? { name: check.name } : {}),
            ...(check.columnNames !== undefined ? { columnNames: [...check.columnNames] } : {}),
            ...(check.expression !== undefined ? { expression: check.expression } : {}),
        })),
        exclusions: table.exclusions.map((exclusion) => ({
            ...(exclusion.name !== undefined ? { name: exclusion.name } : {}),
            ...(exclusion.expression !== undefined ? { expression: exclusion.expression } : {}),
        })),
    };
}
function tableSnapshots(dataSource, entities) {
    const byTableName = new Map();
    for (const entity of entities) {
        const metadata = dataSource.getMetadata(entity);
        const table = Table.create(metadata, dataSource.driver);
        table.foreignKeys = metadata.foreignKeys.map((foreignKey) => TableForeignKey.create(foreignKey, dataSource.driver));
        const current = byTableName.get(table.name);
        if (!current || current.columns.length < table.columns.length) {
            byTableName.set(table.name, table);
        }
    }
    return orderTablesTopologically([...byTableName.values()].map(tableOptions));
}
/**
 * Orders a complete migration snapshot from FK parents to children. A
 * migration may not defer this to registration order: PostgreSQL requires the
 * referenced table to exist at FK creation time. Self references are valid;
 * cross-table cycles are rejected during migration authoring.
 */
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
/**
 * Authoring-only helper. Run this against a metadata-only DataSource and copy
 * the returned value into a versioned migration source using
 * defineOmniMigrationSnapshot. Never invoke it from a migration at runtime.
 */
export function captureOmniMigrationSnapshot(version, dataSource, extensions = []) {
    const dialect = dialectFor(dataSource);
    return defineOmniMigrationSnapshot({
        version,
        dialect,
        tables: tableSnapshots(dataSource, [
            ...omniBaseEntities,
            ...extensions.flatMap((extension) => extension.entities),
        ]),
        indexStatements: extensions.flatMap((extension) => createProjectionDialect(dialect).compileIndexStatements(extension.definition)),
    });
}
/**
 * Freezes a migration-owned table snapshot. Old migration source calls this
 * with a literal captured at authoring time, so future entity changes cannot
 * alter its DDL.
 */
export function defineOmniMigrationSnapshot(snapshot) {
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
/**
 * Creates a migration executor from an already-versioned snapshot. This API
 * deliberately accepts no DataSource or entity classes: runtime metadata is
 * never a migration authority.
 */
export function createOmniMigrationPlan(snapshot) {
    const source = defineOmniMigrationSnapshot(snapshot);
    const tables = orderTablesTopologically(source.tables);
    return Object.freeze({
        version: source.version,
        tableNames: Object.freeze(tables.map((table) => table.name)),
        indexStatements: Object.freeze([...source.indexStatements]),
        createTables: () => tables.map((table) => new Table(structuredClone(table))),
        create: async (queryRunner) => {
            for (const table of tables) {
                await queryRunner.createTable(new Table(structuredClone(table)));
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