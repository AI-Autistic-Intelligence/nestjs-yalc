import type { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface.js';
import type { GenericTypeORMRepository } from '@nestjs-yalc/crud-gen/typeorm/generic.repository.js';
import { type DeepPartial, type FindOptionsWhere } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
import { OmniScopedService } from './omni-scoped.service.js';
export declare class OmniRecordService extends OmniScopedService<OmniRecordEntity> {
    private readonly reservedKinds;
    constructor(repository: GenericTypeORMRepository<OmniRecordEntity>, scopeOrRepositoryWrite?: OmniScope | GenericTypeORMRepository<OmniRecordEntity>, deletion?: OmniDeletePolicy, reservedRecordKinds?: readonly string[]);
    createEntity(input: DeepPartial<OmniRecordEntity>, findOptions?: CrudGenFindManyOptions<OmniRecordEntity>, returnEntity?: true): Promise<OmniRecordEntity>;
    createEntity(input: DeepPartial<OmniRecordEntity>, findOptions?: CrudGenFindManyOptions<OmniRecordEntity>, returnEntity?: boolean): Promise<OmniRecordEntity | boolean>;
    updateEntity(conditions: FindOptionsWhere<OmniRecordEntity>, input: DeepPartial<OmniRecordEntity>, findOptions?: CrudGenFindManyOptions<OmniRecordEntity>, returnEntity?: true): Promise<OmniRecordEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniRecordEntity>, input: DeepPartial<OmniRecordEntity>, findOptions?: CrudGenFindManyOptions<OmniRecordEntity>, returnEntity?: boolean): Promise<OmniRecordEntity | boolean>;
    deleteEntity(conditions: FindOptionsWhere<OmniRecordEntity>): Promise<boolean>;
    private assertExistingRecordIsNotReserved;
    private nonReservedConditions;
    private rejectReservedKind;
}
