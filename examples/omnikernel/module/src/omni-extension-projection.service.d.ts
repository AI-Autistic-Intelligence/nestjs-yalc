import type { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen';
import { ProjectionResourceService, type ProjectionDialect } from '@nestjs-yalc/crud-gen';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { type DataSource, type ObjectLiteral, type Repository } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { type OmniProjectionReaderCatalog } from './omni-projection.catalog.js';
import type { OmniExtensionProjectionDefinition } from './omni-extension-projection.definition.js';
import type { OmniProjectionLifecycle } from './omni-projection.lifecycle.js';
import type { OmniScope } from './omni-scope.js';
export declare class OmniExtensionProjectionService<Extension extends ObjectLiteral> extends ProjectionResourceService<Extension> {
    private readonly ownerRepository;
    private readonly dataSource;
    private readonly omniDefinition;
    private readonly lifecycle?;
    private readonly readerCatalog?;
    constructor(extensionRepository: Repository<Extension>, ownerRepository: Repository<OmniRecordEntity>, dataSource: DataSource, scope: OmniScope, dialect: ProjectionDialect, events: YalcEventService, omniDefinition: OmniExtensionProjectionDefinition, lifecycle?: OmniProjectionLifecycle<OmniExtensionProjectionDefinition, Extension> | undefined, readerCatalog?: OmniProjectionReaderCatalog | undefined);
    getEntity(conditions: Record<string, unknown>, _fields?: string[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<Extension | null>;
    getEntityListExtended(findOptions?: CrudGenFindManyOptions<Extension>, withCount?: boolean): Promise<Extension[] | [Extension[], number]>;
    createEntity(input: Record<string, unknown>): Promise<Extension>;
    updateEntity(conditions: Record<string, unknown>, input: Record<string, unknown>): Promise<Extension>;
    deleteEntity(conditions: Record<string, unknown>): Promise<boolean>;
    private createExtension;
    private readers;
    private mutate;
    private createValuePatch;
    private readOne;
    private findOwner;
    private merge;
    private throwUpdateMiss;
    private identityConflict;
}
