import { type CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen';
import { type DataSource, type DeepPartial, type FindOptionsWhere, type ObjectLiteral, type Repository } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { type OmniProjectionReaderCatalog } from './omni-projection.catalog.js';
import { type OmniRelationProjectionDefinition } from './omni-relation-projection.definition.js';
import type { OmniProjectionLifecycle } from './omni-projection.lifecycle.js';
import { OmniRelationService } from './omni-relation.service.js';
import type { OmniRelationKindContract } from './omni-relation-kind.contract.js';
import type { OmniDeletePolicy, OmniScope } from './omni-scope.js';
export declare class OmniRelationProjectionService extends OmniRelationService {
    private readonly relationDeletion;
    private readonly definition;
    private readonly dataSource?;
    private readonly lifecycle?;
    private readonly readerCatalog?;
    constructor(repository: Repository<OmniRelationEntity>, scope: OmniScope, relationDeletion: OmniDeletePolicy, recordRepository: Repository<OmniRecordEntity>, kinds: OmniRelationKindContract, definition: OmniRelationProjectionDefinition, dataSource?: DataSource | undefined, lifecycle?: OmniProjectionLifecycle<OmniRelationProjectionDefinition, OmniRelationEntity> | undefined, readerCatalog?: OmniProjectionReaderCatalog | undefined);
    createEntity(input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: true): Promise<OmniRelationEntity>;
    createEntity(input: DeepPartial<OmniRelationEntity>, findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: boolean): Promise<OmniRelationEntity | boolean>;
    getEntity(conditions: FindOptionsWhere<OmniRelationEntity>[] | FindOptionsWhere<OmniRelationEntity> | ObjectLiteral | string, fields?: (keyof OmniRelationEntity)[], relations?: string[], databaseName?: string, options?: {
        failOnNull: false;
    }): Promise<OmniRelationEntity | undefined>;
    getEntity(conditions: FindOptionsWhere<OmniRelationEntity>[] | FindOptionsWhere<OmniRelationEntity> | ObjectLiteral | string, fields?: (keyof OmniRelationEntity)[], relations?: string[], databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<OmniRelationEntity>;
    getEntityListExtended(findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, withCount?: false, relations?: string[], databaseName?: string): Promise<OmniRelationEntity[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<OmniRelationEntity>, withCount: true, relations?: string[], databaseName?: string): Promise<[OmniRelationEntity[], number]>;
    updateEntity(conditions: FindOptionsWhere<OmniRelationEntity>, input: DeepPartial<OmniRelationEntity>, _findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: true): Promise<OmniRelationEntity>;
    updateEntity(conditions: FindOptionsWhere<OmniRelationEntity>, input: DeepPartial<OmniRelationEntity>, _findOptions?: CrudGenFindManyOptions<OmniRelationEntity>, returnEntity?: boolean): Promise<OmniRelationEntity | boolean>;
    deleteEntity(conditions: FindOptionsWhere<OmniRelationEntity>): Promise<boolean>;
    protected assertEndpointKinds(source: OmniRecordEntity, target: OmniRecordEntity): void;
    private createValues;
    private publicEntity;
    private publicInput;
    private selectCreateKind;
    private normalizeInput;
    private normalizeConditions;
    private rejectFixedFields;
    private rejectImmutableEndpoints;
    private validatePayload;
    private withDefinitionConditions;
    private definitionFilters;
    private assertFixedConditions;
    private rejectFixedFilters;
    private readers;
    private mutate;
}
