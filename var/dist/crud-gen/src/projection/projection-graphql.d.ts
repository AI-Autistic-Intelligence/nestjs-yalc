import { type ProjectionResourceDefinition } from './projection-resource.js';
type ProjectionGraphqlClass = new () => Record<string, unknown>;
export interface ProjectionGraphqlTypes {
    object: ProjectionGraphqlClass;
    create: ProjectionGraphqlClass;
    patch: ProjectionGraphqlClass;
    conditions: ProjectionGraphqlClass;
}
export declare function createProjectionGraphqlTypes(definition: ProjectionResourceDefinition, names: {
    object: string;
    create: string;
    patch: string;
    conditions: string;
}): ProjectionGraphqlTypes;
export {};
