import type { CrudGenFindManyOptions } from '../api-graphql/crud-gen-gql.interface.js';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { type ObjectLiteral, type Repository } from 'typeorm';
import { type ProjectionResourceDefinition } from './projection-resource.js';
import type { ProjectionDialect, ProjectionFilter, ProjectionSort } from './projection-dialect.js';
export interface ProjectionScope {
    readonly scopeId: string;
    cacheKey(key: string): string;
}
export declare class ProjectionResourceService<Entity extends ObjectLiteral> {
    protected readonly repository: Repository<Entity>;
    protected readonly scope: ProjectionScope;
    protected readonly dialect: ProjectionDialect;
    protected readonly events: YalcEventService;
    protected readonly definition: ProjectionResourceDefinition;
    constructor(repository: Repository<Entity>, scope: ProjectionScope, dialect: ProjectionDialect, events: YalcEventService, definition: ProjectionResourceDefinition);
    supportsStructuredGraphqlFilters(): boolean;
    supportsExtendedRepository(): boolean;
    getEntity(conditions: Record<string, unknown>, _fields?: string[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<Entity | null>;
    getEntityListExtended(findOptions?: CrudGenFindManyOptions<Entity>, withCount?: boolean): Promise<Entity[] | [Entity[], number]>;
    createEntity(input: Record<string, unknown>): Promise<Entity>;
    updateEntity(conditions: Record<string, unknown>, input: Record<string, unknown>): Promise<Entity>;
    deleteEntity(conditions: Record<string, unknown>): Promise<boolean>;
    protected createPayload(input: Record<string, unknown>): Record<string, unknown>;
    protected project(record: Entity): Entity;
    protected filtersFromFindOptions(findOptions: CrudGenFindManyOptions<Entity>): ProjectionFilter[];
    protected sortingFromFindOptions(findOptions: CrudGenFindManyOptions<Entity>): ProjectionSort[];
    protected pageFromFindOptions(findOptions: CrudGenFindManyOptions<Entity>): {
        skip?: number;
        take?: number;
    };
    protected projectionField(name: string, purpose: 'filter' | 'sort'): ProjectionResourceDefinition['fields'][number];
    protected assertFilterAllowed(field: ProjectionResourceDefinition['fields'][number], operator: 'eq' | 'range'): void;
    protected normalizeFilterValues(field: ProjectionResourceDefinition['fields'][number], values: readonly unknown[], expectedLength?: number | null): unknown[];
    protected normalizeValue(field: ProjectionResourceDefinition['fields'][number], value: unknown): unknown;
    protected guidFromConditions(conditions: Record<string, unknown>): string;
    protected rejectUnknownInput(input: Record<string, unknown>, creating: boolean): void;
    protected invalid(message: string): never;
    protected notFound(): never;
}
