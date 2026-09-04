import type { CrudGenFindManyOptions, ProjectionScope } from '@nestjs-yalc/crud-gen';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { type ObjectLiteral, type Repository } from 'typeorm';
type ProjectionRequest = {
    projectionScopeId?: string;
    req?: {
        projectionScopeId?: string;
    };
};
export declare class ProjectionScopeContext implements ProjectionScope {
    readonly scopeId: string;
    constructor(request: ProjectionRequest);
    cacheKey(key: string): string;
}
type ProjectionSpikeRelationDefinition = {
    identity: string;
    scope: string;
    source: string;
    target: string;
    fields: readonly string[];
    mutableFields: readonly string[];
};
export declare class ProjectionSpikeRelationService<Entity extends ObjectLiteral> {
    private readonly repository;
    private readonly endpoints;
    private readonly scope;
    private readonly events;
    private readonly definition;
    constructor(repository: Repository<Entity>, endpoints: Repository<ObjectLiteral>, scope: ProjectionScope, events: YalcEventService, definition: ProjectionSpikeRelationDefinition);
    supportsStructuredGraphqlFilters(): boolean;
    supportsExtendedRepository(): boolean;
    getEntity(conditions: Record<string, unknown>, _fields?: string[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<Entity | null>;
    getEntityListExtended(findOptions?: CrudGenFindManyOptions<Entity>, withCount?: boolean): Promise<Entity[] | [Entity[], number]>;
    createEntity(input: Record<string, unknown>): Promise<Entity>;
    updateEntity(conditions: Record<string, unknown>, input: Record<string, unknown>): Promise<Entity>;
    deleteEntity(conditions: Record<string, unknown>): Promise<boolean>;
    private identity;
    private requiredString;
    private rejectUnknown;
    private notFound;
}
export {};
