import type { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface.js';
import { type DeepPartial, type FindOptionsWhere, type Repository } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { type OmniRelationKindContract } from './omni-relation-kind.contract.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
import { OmniScopedService } from './omni-scoped.service.js';
/**
 * Scoped graph CRUD with immutable endpoints. The database composite foreign
 * keys prevent cross-scope edges; this service additionally turns missing or
 * invalid endpoints into normal API failures before persistence.
 */
export declare class OmniRelationService extends OmniScopedService<OmniRelationEntity> {
    protected readonly recordRepository: Repository<OmniRecordEntity>;
    protected readonly kinds: OmniRelationKindContract;
    constructor(repository: any, scope: OmniScope, deletion: OmniDeletePolicy, recordRepository: Repository<OmniRecordEntity>, kinds: OmniRelationKindContract);
    createEntity(input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: true): Promise<OmniRelationEntity>;
    createEntity(input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: boolean): Promise<OmniRelationEntity | boolean>;
    updateEntity(conditions: FindOptionsWhere<OmniRelationEntity>, input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: true): Promise<OmniRelationEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniRelationEntity>, input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: boolean): Promise<OmniRelationEntity | boolean>;
    protected assertRelation(input: DeepPartial<OmniRelationEntity>, recordRepository?: Repository<OmniRecordEntity>): Promise<void>;
    /** Resource-specific relation projections may narrow endpoint kinds. */
    protected assertEndpointKinds(_source: OmniRecordEntity, _target: OmniRecordEntity): void;
    protected requiredIdentifier(value: unknown, field: string): string;
}
