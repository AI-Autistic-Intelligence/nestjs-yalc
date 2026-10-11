/**
 * Immutable, transport-neutral contract for a JSON-backed projected resource.
 *
 * A consumer declares logical fields here. Services and dialects receive field
 * definitions rather than JSON paths or driver-specific SQL.
 */
export type ProjectionCodec = 'string' | 'uuid' | 'instant' | 'integer' | 'boolean' | 'json';
/** GraphQL Int and PostgreSQL integer share this portable signed range. */
export declare const PROJECTION_INTEGER_MIN: number;
export declare const PROJECTION_INTEGER_MAX: number;
export type ProjectionStorage = 'column' | 'json';
export type ProjectionFilterOperator = 'eq' | 'range';
/**
 * Portable JSON paths are object-property paths only. Keeping the grammar
 * deliberately small lets both SQLite JSON1 and PostgreSQL jsonb compile a
 * path as a SQL literal without dialect-specific escaping rules.
 */
export declare const projectionPathSegmentPattern: RegExp;
/**
 * UUIDs use their canonical lowercase, hyphenated text representation. The
 * projection contract stores the same portable text on SQLite and PostgreSQL.
 */
export declare const projectionCanonicalUuidPattern: RegExp;
export interface ProjectionIndexDefinition {
    name: string;
}
/** Portable scalar values accepted by a predicate unique constraint. */
export type ProjectionPredicateLiteral = string | number | boolean;
/**
 * A same-scope foreign key over promoted column fields. The resource scope is
 * always the first local column; the target scope is always the first remote
 * column, so applications cannot accidentally create cross-scope references.
 */
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
/**
 * A same-scope partial unique index over promoted column fields. Predicates
 * stay structural here and are compiled by the entity/table builder.
 */
export interface ProjectionPredicateUniqueConstraint {
    name: string;
    fields: readonly string[];
    /** Omit for a full unique index; provide a map for a portable partial one. */
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
/**
 * Verifies the one metadata contract before it reaches a dialect. This is
 * exported so callers that receive structural data rather than a value from
 * defineProjectionResource can fail before executing SQL as well.
 */
export declare function assertProjectionResourceDefinition(definition: ProjectionResourceDefinition): void;
/** The stable child-supporting index generated for a declarative reference. */
export declare function getProjectionReferenceIndexName(reference: ProjectionReferenceDefinition): string;
/** Returns the scope-prefixed local columns for a declarative reference. */
export declare function getProjectionReferenceColumnNames(definition: ProjectionResourceDefinition, reference: ProjectionReferenceDefinition): string[];
/** Returns the scope-prefixed target columns for a declarative reference. */
export declare function getProjectionReferenceTargetColumnNames(reference: ProjectionReferenceDefinition): string[];
/** Returns the scope-prefixed columns covered by a partial unique constraint. */
export declare function getProjectionUniqueConstraintColumnNames(definition: ProjectionResourceDefinition, constraint: ProjectionPredicateUniqueConstraint): string[];
/**
 * Compiles a structural partial-index predicate without accepting raw SQL.
 * Identifiers are validated and quoted; values are first checked against their
 * declared field codecs and then emitted as dialect-specific scalar literals.
 */
export declare function compileProjectionUniqueConstraintPredicate(definition: ProjectionResourceDefinition, constraint: ProjectionPredicateUniqueConstraint, dialect: 'sqlite' | 'postgres'): string | undefined;
/**
 * Projection codec values have deliberately portable semantics:
 * - string: a JavaScript string; equality and sorting are textual.
 * - uuid: a canonical lowercase hyphenated UUID string; equality, sorting,
 *   and indexes compare its validated text representation.
 * - instant: a canonical Date#toISOString UTC timestamp; equality, range,
 *   sorting and indexes compare the canonical text representation.
 * - integer: a signed 32-bit integer; equality, range, sorting and indexes
 *   use a signed SQL integer expression.
 * - json: a JSON-compatible value; it is transport-only and has no query or
 *   index capability.
 */
export declare function assertProjectionCodecValue(field: ProjectionFieldDefinition, value: unknown): void;
/** Normalizes the only non-JSON runtime representation accepted by a codec. */
export declare function normalizeProjectionCodecValue(field: ProjectionFieldDefinition, value: unknown): unknown;
/** Validates the opaque payload object before it reaches the JSON column. */
export declare function assertProjectionPayloadValue(value: unknown): asserts value is Record<string, unknown>;
export declare function defineProjectionResource<TDefinition extends ProjectionResourceDefinition>(definition: TDefinition): Readonly<TDefinition>;
export declare function getProjectionField(definition: ProjectionResourceDefinition, name: string): ProjectionFieldDefinition;
export declare function getProjectionPathValue(payload: Record<string, unknown> | null | undefined, path: readonly string[]): unknown;
export declare function setProjectionPathValue(payload: Record<string, unknown>, path: readonly string[], value: unknown): Record<string, unknown>;
