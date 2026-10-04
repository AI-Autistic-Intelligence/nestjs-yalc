import type { EntitySchemaColumnOptions, EntitySchemaIndexOptions } from 'typeorm';
import type { ProjectionDialect } from './projection-dialect.js';
import { type ProjectionResourceDefinition } from './projection-resource.js';
export interface ProjectionSchemaOptions {
    columns: Record<string, EntitySchemaColumnOptions>;
    indices: EntitySchemaIndexOptions[];
}
export declare function createProjectionSchemaOptions(definition: ProjectionResourceDefinition, dialect: ProjectionDialect): ProjectionSchemaOptions;
