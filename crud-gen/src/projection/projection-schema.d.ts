import type { EntitySchemaColumnOptions, EntitySchemaIndexOptions } from 'typeorm';
import type { ProjectionDialect } from './projection-dialect.js';
import { type ProjectionResourceDefinition } from './projection-resource.js';
export interface ProjectionSchemaOptions {
    columns: Record<string, EntitySchemaColumnOptions>;
    indices: EntitySchemaIndexOptions[];
}
/**
 * Derives the projection-owned TypeORM schema from its immutable definition.
 * A surrogate primary key remains an application storage choice; all public
 * scope, identity, revision, payload and projected column declarations live
 * in the projection contract.
 */
export declare function createProjectionSchemaOptions(definition: ProjectionResourceDefinition, dialect: ProjectionDialect): ProjectionSchemaOptions;
