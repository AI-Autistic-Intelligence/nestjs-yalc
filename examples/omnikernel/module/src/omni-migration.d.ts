import type { DataSource, EntityTarget } from 'typeorm';
import { Table, type TableOptions } from 'typeorm';
import { type ProjectionResourceDefinition } from '@nestjs-yalc/crud-gen';
export interface OmniMigrationSnapshot {
    readonly version: string;
    readonly dialect: 'sqlite' | 'postgres';
    readonly tables: readonly TableOptions[];
    readonly indexStatements: readonly string[];
}
export interface OmniMigrationRunner {
    createTable(table: unknown, ifNotExist?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>;
    query(statement: string): Promise<unknown>;
}
export interface OmniMigrationPlan {
    readonly version: string;
    readonly tableNames: readonly string[];
    readonly indexStatements: readonly string[];
    createTables(): Table[];
    create(queryRunner: OmniMigrationRunner): Promise<void>;
    drop(queryRunner: OmniMigrationRunner): Promise<void>;
}
export interface OmniMigrationExtensionRegistration {
    readonly entities: readonly EntityTarget<any>[];
    readonly definition: ProjectionResourceDefinition;
}
export declare function captureOmniMigrationSnapshot(version: string, dataSource: DataSource, extensions?: readonly OmniMigrationExtensionRegistration[]): OmniMigrationSnapshot;
export declare function defineOmniMigrationSnapshot(snapshot: OmniMigrationSnapshot): OmniMigrationSnapshot;
export declare function createOmniMigrationPlan(snapshot: OmniMigrationSnapshot): OmniMigrationPlan;
