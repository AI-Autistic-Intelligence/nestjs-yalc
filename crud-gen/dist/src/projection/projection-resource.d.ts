export type ProjectionCodec = 'string' | 'uuid' | 'instant' | 'integer' | 'boolean' | 'json';
export declare const PROJECTION_INTEGER_MIN: number;
export declare const PROJECTION_INTEGER_MAX: number;
export type ProjectionStorage = 'column' | 'json';
export type ProjectionFilterOperator = 'eq' | 'range';
export declare const projectionPathSegmentPattern: RegExp;
export declare const projectionCanonicalUuidPattern: RegExp;
export interface ProjectionIndexDefinition {
    name: string;
}
export type ProjectionPredicateLiteral = string | number | boolean;
export interface ProjectionReferenceDefinition {
    name: string;
    fields: readonly string[];
    target: {
        tableName: string;
        scopeColumn: string;
        identityColumns: readonly string[];
    };
    onDelete: 'RESTRICT' | 'NO ACTION';
}
export interface ProjectionPredicateUniqueConstraint {
    name: string;
    fields: readonly string[];
    predicate?: Readonly<Record<string, ProjectionPredicateLiteral>>;
}
export interface ProjectionFieldDefinition {
    name: string;
    storage: ProjectionStorage;
    codec: ProjectionCodec;
    nullable: boolean;
    requiredOnCreate?: boolean;
    column?: string;
    path?: readonly string[];
    query?: {
        filter?: readonly ProjectionFilterOperator[];
        sort?: boolean;
    };
    index?: ProjectionIndexDefinition;
}
export interface ProjectionResourceDefinition {
    id: string;
    tableName: string;
    identity: {
        column: string;
        uniqueWithinScope: true;
    };
    scope: {
        column: string;
        serverOwned: true;
    };
    revision: {
        column: string;
    };
    payload: {
        column: string;
        allowCreate: boolean;
    };
    deletion: 'hard';
    fields: readonly ProjectionFieldDefinition[];
    references?: readonly ProjectionReferenceDefinition[];
    uniqueConstraints?: readonly ProjectionPredicateUniqueConstraint[];
}
export declare function assertProjectionPath(path: readonly string[], fieldName?: string): void;
export declare function assertProjectionResourceDefinition(definition: ProjectionResourceDefinition): void;
export declare function getProjectionReferenceIndexName(reference: ProjectionReferenceDefinition): string;
export declare function getProjectionReferenceColumnNames(definition: ProjectionResourceDefinition, reference: ProjectionReferenceDefinition): string[];
export declare function getProjectionReferenceTargetColumnNames(reference: ProjectionReferenceDefinition): string[];
export declare function getProjectionUniqueConstraintColumnNames(definition: ProjectionResourceDefinition, constraint: ProjectionPredicateUniqueConstraint): string[];
export declare function compileProjectionUniqueConstraintPredicate(definition: ProjectionResourceDefinition, constraint: ProjectionPredicateUniqueConstraint, dialect: 'sqlite' | 'postgres'): string | undefined;
export declare function assertProjectionCodecValue(field: ProjectionFieldDefinition, value: unknown): void;
export declare function normalizeProjectionCodecValue(field: ProjectionFieldDefinition, value: unknown): unknown;
export declare function assertProjectionPayloadValue(value: unknown): asserts value is Record<string, unknown>;
export declare function defineProjectionResource<TDefinition extends ProjectionResourceDefinition>(definition: TDefinition): Readonly<TDefinition>;
export declare function getProjectionField(definition: ProjectionResourceDefinition, name: string): ProjectionFieldDefinition;
export declare function getProjectionPathValue(payload: Record<string, unknown> | null | undefined, path: readonly string[]): unknown;
export declare function setProjectionPathValue(payload: Record<string, unknown>, path: readonly string[], value: unknown): Record<string, unknown>;
