import type { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { type ProjectionFieldDefinition, type ProjectionFilterOperator, type ProjectionResourceDefinition } from './projection-resource.js';
export interface ProjectionFilter {
    field: ProjectionFieldDefinition;
    operator: ProjectionFilterOperator | 'in';
    values: readonly unknown[];
}
export interface ProjectionSort {
    field: ProjectionFieldDefinition;
    direction: 'ASC' | 'DESC';
}
export interface ProjectionPage {
    skip?: number;
    take?: number;
}
export interface ProjectionPatch {
    scopeId: string;
    guid: string;
    expectedRevision: number;
    columnValues: Record<string, unknown>;
    jsonValues: Array<{
        field: ProjectionFieldDefinition;
        value: unknown;
    }>;
}
export interface ProjectionValuePatch {
    scopeId: string;
    guid: string;
    columnValues: Record<string, unknown>;
    jsonValues: Array<{
        field: ProjectionFieldDefinition;
        value: unknown;
    }>;
}
export interface ProjectionDialectEvidence {
    payloadStorage: string;
    indexes: string[];
    validJson: boolean;
}
export interface ProjectionQueryPlan {
    lines: string[];
    usesDeclaredIndex: boolean;
}
export interface ProjectionDialect {
    readonly name: 'sqlite' | 'postgres';
    readonly payloadColumnType: 'simple-json' | 'jsonb';
    compileIndexStatements(definition: ProjectionResourceDefinition): readonly string[];
    isScopedIdentityConflict(error: unknown, definition: ProjectionResourceDefinition): boolean;
    findMany<Entity extends ObjectLiteral>(repository: Repository<Entity>, definition: ProjectionResourceDefinition, scopeId: string, filters: readonly ProjectionFilter[], sorting: readonly ProjectionSort[], page: ProjectionPage): Promise<[Entity[], number]>;
    patch<Entity extends ObjectLiteral>(repository: Repository<Entity>, definition: ProjectionResourceDefinition, patch: ProjectionPatch): Promise<number>;
    patchValues<Entity extends ObjectLiteral>(repository: Repository<Entity>, definition: ProjectionResourceDefinition, patch: ProjectionValuePatch): Promise<number>;
    inspect(dataSource: DataSource, definition: ProjectionResourceDefinition): Promise<ProjectionDialectEvidence>;
    explainIndexedEquality(dataSource: DataSource, definition: ProjectionResourceDefinition, field: ProjectionFieldDefinition, scopeId: string, value: unknown): Promise<ProjectionQueryPlan>;
}
export declare function createProjectionDialect(driver: string): ProjectionDialect;
export declare function applyProjectionIndexesForBootstrap(dataSource: DataSource, dialect: ProjectionDialect, definition: ProjectionResourceDefinition): Promise<void>;
