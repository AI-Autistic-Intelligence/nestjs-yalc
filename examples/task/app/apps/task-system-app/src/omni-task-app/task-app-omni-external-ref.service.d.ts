import { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { OmniCollectionEntity, OmniExternalRefEntity, OmniRecordEntity } from '@nestjs-yalc/omnikernel-module';
import { TaskExternalRef } from '@nestjs-yalc/task-system-module/src/task-external-ref.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TaskAppOmniMapper, type TaskOmniPageQuery } from './task-app-omni.mapper';
import { TaskExternalRefCreateInput, TaskExternalRefType } from '../sync/task-external-ref.dto';
export declare class TaskAppOmniExternalRefService {
    private readonly recordRepository;
    private readonly collectionRepository;
    private readonly externalRefRepository;
    private readonly events;
    private readonly mapper;
    constructor(recordRepository: Repository<OmniRecordEntity>, collectionRepository: Repository<OmniCollectionEntity>, externalRefRepository: Repository<OmniExternalRefEntity>, events: YalcEventService, mapper: TaskAppOmniMapper);
    supportsStructuredGraphqlFilters(): boolean;
    list(query: TaskOmniPageQuery & {
        internalId?: string;
        internalType?: string;
    }): Promise<{
        list: TaskExternalRefType[];
        nodes: TaskExternalRefType[];
        pageData: {
            count: number;
            endRow: number;
            startRow: number;
        };
    }>;
    getById(guid: string): Promise<TaskExternalRefType>;
    create(input: Partial<TaskExternalRefCreateInput>): Promise<boolean | TaskExternalRefType>;
    update(guid: string, input: Partial<TaskExternalRefCreateInput>): Promise<boolean | TaskExternalRefType>;
    delete(guid: string): Promise<{
        deleted: boolean;
    }>;
    getEntity(where: Partial<TaskExternalRef> | Partial<TaskExternalRef>[] | string, _fields?: (keyof TaskExternalRef)[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<TaskExternalRefType | null | undefined>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskExternalRef>, withCount?: false): Promise<TaskExternalRefType[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskExternalRef>, withCount: true): Promise<[TaskExternalRefType[], number]>;
    createEntity(input: DeepPartial<TaskExternalRef>, _findOptions?: CrudGenFindManyOptions<TaskExternalRef>, returnEntity?: boolean): Promise<TaskExternalRefType | boolean>;
    updateEntity(conditions: Partial<TaskExternalRef>, input: DeepPartial<TaskExternalRef>, _findOptions?: CrudGenFindManyOptions<TaskExternalRef>, returnEntity?: boolean): Promise<TaskExternalRefType | boolean>;
    deleteEntity(conditions: Partial<TaskExternalRef>): Promise<boolean>;
    private validateExternalRefInput;
    private getExternalRefOrFail;
    private getTaskExternalRefOrFail;
    private mapCrudGenWhereToOmniWhere;
    private mapInternalTypeFilter;
    private requireGuid;
    private ensureInternalTargetExists;
}
