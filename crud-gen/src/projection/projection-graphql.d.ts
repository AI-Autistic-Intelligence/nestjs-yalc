import { type ProjectionResourceDefinition } from './projection-resource.js';
type ProjectionGraphqlClass = new () => Record<string, unknown>;
export interface ProjectionGraphqlTypes {
    object: ProjectionGraphqlClass;
    create: ProjectionGraphqlClass;
    patch: ProjectionGraphqlClass;
    conditions: ProjectionGraphqlClass;
}
/**
 * Derives GraphQL output and input shapes from a projection definition.
 * `scopeId` is intentionally absent from every public type.
 */
export declare function createProjectionGraphqlTypes(definition: ProjectionResourceDefinition, names: {
    object: string;
    create: string;
    patch: string;
    conditions: string;
}): ProjectionGraphqlTypes;
export {};
