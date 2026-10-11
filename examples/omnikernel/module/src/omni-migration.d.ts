import type { DataSource, EntityTarget } from 'typeorm';
import { Table, type TableOptions } from 'typeorm';
import { type ProjectionResourceDefinition } from '@nest-yalc-2/crud-gen';
export interface OmniMigrationSnapshot {
    /** A migration-owned identifier, for example `omni-v1`. */
    readonly version: string;
    /** The driver whose physical column types were captured. */
    readonly dialect: 'sqlite' | 'postgres';
    /** Immutable, serializable TypeORM TableOptions captured during authoring. */
    readonly tables: readonly TableOptions[];
    /** Immutable ProjectionDialect DDL for JSON/expression indexes. */
    readonly indexStatements: readonly string[];
}
/**
 * The portable subset of a migration runner used by an Omni migration plan.
 *
 * It deliberately does not reference TypeORM's `QueryRunner` type. A package
 * manager may give the module and a consuming migration distinct physical
 * TypeORM installations, even at the same version; exposing that branded
 * framework type would then reject the application's runner. TypeORM runners
 * satisfy this structural capability contract without a consumer cast.
 */
export interface OmniMigrationRunner {
    createTable(table: unknown, ifNotExist?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>;
    query(statement: string): Promise<unknown>;
}
export interface OmniMigrationPlan {
    readonly version: string;
    readonly tableNames: readonly string[];
    /** Dialect-compiled index DDL that the plan executes after all tables exist. */
    readonly indexStatements: readonly string[];
    /** Returns fresh mutable Table instances from the versioned source snapshot. */
    createTables(): Table[];
    /** Intended only from a TypeORM migration up() method. */
    create(queryRunner: OmniMigrationRunner): Promise<void>;
    /** Intended only from a TypeORM migration down() method. */
    drop(queryRunner: OmniMigrationRunner): Promise<void>;
}
/**
 * The migration-relevant subset of a registered extension composition. It
 * keeps schema authoring tied to the same immutable projection definition as
 * the generated transport and service, without making runtime metadata a
 * migration dependency.
 */
export interface OmniMigrationExtensionRegistration {
    readonly entities: readonly EntityTarget<any>[];
    readonly definition: ProjectionResourceDefinition;
}
/**
 * Authoring-only helper. Run this against a metadata-only DataSource and copy
 * the returned value into a versioned migration source using
 * defineOmniMigrationSnapshot. Never invoke it from a migration at runtime.
 */
export declare function captureOmniMigrationSnapshot(version: string, dataSource: DataSource, extensions?: readonly OmniMigrationExtensionRegistration[]): OmniMigrationSnapshot;
/**
 * Freezes a migration-owned table snapshot. Old migration source calls this
 * with a literal captured at authoring time, so future entity changes cannot
 * alter its DDL.
 */
export declare function defineOmniMigrationSnapshot(snapshot: OmniMigrationSnapshot): OmniMigrationSnapshot;
/**
 * Creates a migration executor from an already-versioned snapshot. This API
 * deliberately accepts no DataSource or entity classes: runtime metadata is
 * never a migration authority.
 */
export declare function createOmniMigrationPlan(snapshot: OmniMigrationSnapshot): OmniMigrationPlan;
