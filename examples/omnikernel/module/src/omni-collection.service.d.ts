import type { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface.js';
import type { GenericTypeORMRepository } from '@nestjs-yalc/crud-gen/typeorm/generic.repository.js';
import type { DeepPartial, FindOptionsWhere } from 'typeorm';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
import { OmniScopedService } from './omni-scoped.service.js';
export declare class OmniCollectionService extends OmniScopedService<OmniCollectionEntity> {
    constructor(repository: GenericTypeORMRepository<OmniCollectionEntity>, scopeOrRepositoryWrite?: OmniScope | GenericTypeORMRepository<OmniCollectionEntity>, deletion?: OmniDeletePolicy);
    protected normalizeCollectionInput(input: DeepPartial<OmniCollectionEntity>): DeepPartial<OmniCollectionEntity>;
    createEntity(input: DeepPartial<OmniCollectionEntity>, findOptions?: CrudGenFindManyOptions<OmniCollectionEntity>, returnEntity?: true): Promise<OmniCollectionEntity>;
    createEntity(input: DeepPartial<OmniCollectionEntity>, findOptions?: CrudGenFindManyOptions<OmniCollectionEntity>, returnEntity?: boolean): Promise<OmniCollectionEntity | boolean>;
    updateEntity(conditions: FindOptionsWhere<OmniCollectionEntity>, input: DeepPartial<OmniCollectionEntity>, findOptions?: CrudGenFindManyOptions<OmniCollectionEntity>, returnEntity?: true): Promise<OmniCollectionEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniCollectionEntity>, input: DeepPartial<OmniCollectionEntity>, findOptions?: CrudGenFindManyOptions<OmniCollectionEntity>, returnEntity?: boolean): Promise<OmniCollectionEntity | boolean>;
}
