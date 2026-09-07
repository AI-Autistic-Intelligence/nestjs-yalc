import { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface';
import { YalcEventService } from '@nest-yalc-2/event-manager';
import { OmniRecordEntity, OmniRelationEntity } from '@nest-yalc-2/omnikernel-module';
import { TaskEvent } from '@nest-yalc-2/task-system-module/src/task-event.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TaskAppOmniMapper, type TaskOmniPageQuery } from './task-app-omni.mapper';
import { TaskEventCreateInput, TaskEventType } from '../events/task-event.dto';
import { TaskAppOmniProjectService } from './task-app-omni-project.service';
export declare class TaskAppOmniEventService {
    private readonly recordRepository;
    private readonly relationRepository;
    private readonly events;
    private readonly mapper;
    private readonly projectService;
    constructor(recordRepository: Repository<OmniRecordEntity>, relationRepository: Repository<OmniRelationEntity>, events: YalcEventService, mapper: TaskAppOmniMapper, projectService: TaskAppOmniProjectService);
    supportsStructuredGraphqlFilters(): boolean;
    list(query?: TaskOmniPageQuery): Promise<{
        list: TaskEventType[];
        nodes: TaskEventType[];
        pageData: {
            count: number;
            endRow: number;
            startRow: number;
        };
    }>;
    getById(guid: string): Promise<TaskEventType>;
    create(input: Partial<TaskEventCreateInput>): Promise<TaskEventType>;
    update(guid: string, input: Partial<TaskEventCreateInput>): Promise<TaskEventType>;
    delete(guid: string): Promise<{
        deleted: boolean;
    }>;
    getEntity(where: Partial<TaskEvent> | Partial<TaskEvent>[] | string, _fields?: (keyof TaskEvent)[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<TaskEventType | null | undefined>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskEvent>, withCount?: false): Promise<TaskEventType[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskEvent>, withCount: true): Promise<[TaskEventType[], number]>;
    createEntity(input: DeepPartial<TaskEvent>, _findOptions?: CrudGenFindManyOptions<TaskEvent>, returnEntity?: boolean): Promise<TaskEventType | boolean>;
    updateEntity(conditions: Partial<TaskEvent>, input: DeepPartial<TaskEvent>, _findOptions?: CrudGenFindManyOptions<TaskEvent>, returnEntity?: boolean): Promise<TaskEventType | boolean>;
    deleteEntity(conditions: Partial<TaskEvent>): Promise<boolean>;
    private getTaskEventOrFail;
    private getEventRecordOrFail;
    private getCollectionMembersByKind;
    private getProjectIds;
    private getProjectIdForEvent;
    private syncContainsRelation;
    private requireGuid;
    private mapCrudGenWhereToOmniWhere;
    private mapGuidFindOperator;
}
