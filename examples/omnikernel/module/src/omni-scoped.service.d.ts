import type { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { GenericService } from '@nestjs-yalc/crud-gen/typeorm/generic.service.js';
import type { DeepPartial, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
type ScopedEntity = ObjectLiteral & {
    scopeId: string;
    deletedAt?: Date | null;
};
export declare class OmniScopedService<Entity extends ScopedEntity> extends GenericService<Entity> {
    private readonly deletion;
    constructor(repository: any, scopeOrRepositoryWrite?: OmniScope | any, deletion?: OmniDeletePolicy);
    protected readonly scope: OmniScope;
    protected get scopeId(): string;
    protected scopedConditions(conditions: FindOptionsWhere<Entity>): FindOptionsWhere<Entity>;
    getEntity(conditions: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity> | ObjectLiteral | string, fields?: (keyof Entity)[], relations?: string[], databaseName?: string, options?: {
        failOnNull: false;
    }): Promise<Entity | undefined>;
    getEntity(conditions: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity> | ObjectLiteral | string, fields?: (keyof Entity)[], relations?: string[], databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<Entity>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<Entity>, withCount?: false, relations?: string[], databaseName?: string): Promise<Entity[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<Entity>, withCount: true, relations?: string[], databaseName?: string): Promise<[Entity[], number]>;
    private scopeFindOptions;
    createEntity(input: DeepPartial<Entity>, findOptions?: CrudGenFindManyOptions<Entity>, returnEntity?: true): Promise<Entity>;
    createEntity(input: DeepPartial<Entity>, findOptions?: CrudGenFindManyOptions<Entity>, returnEntity?: boolean): Promise<Entity | boolean>;
    updateEntity(conditions: FindOptionsWhere<Entity>, input: DeepPartial<Entity>, findOptions?: CrudGenFindManyOptions<Entity>, returnEntity?: true): Promise<Entity>;
    updateEntity(conditions: FindOptionsWhere<Entity>, input: DeepPartial<Entity>, findOptions?: CrudGenFindManyOptions<Entity>, returnEntity?: boolean): Promise<Entity | boolean>;
    deleteEntity(conditions: FindOptionsWhere<Entity>): Promise<boolean>;
    protected rejectServerFields(input: object): void;
    protected rejectClientScope(input: object): void;
    private validatePayloadContract;
    protected notFound(): never;
    private scopedWhere;
    private rejectScopeInWhere;
}
export {};
