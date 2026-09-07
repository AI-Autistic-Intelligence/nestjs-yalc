import { CrudGenFindManyOptions } from '@nest-yalc-2/crud-gen/api-graphql/crud-gen-gql.interface';
import { YalcEventService } from '@nest-yalc-2/event-manager';
import { OmniRecordEntity, OmniRelationEntity } from '@nest-yalc-2/omnikernel-module';
import { TaskItem } from '@nest-yalc-2/task-system-module/src/task-item.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TaskAppOmniMapper, type TaskItemOmniWriteInput, type TaskOmniPageQuery } from './task-app-omni.mapper';
import { TaskItemType } from '../tasks/task-item.dto';
import { TaskAppOmniProjectService } from './task-app-omni-project.service';
type TaskListQuery = TaskOmniPageQuery & {
    sorting?: Array<{
        colId: string;
        sort?: 'ASC' | 'DESC';
    }>;
};
export declare class TaskAppOmniTaskService {
    private readonly recordRepository;
    private readonly relationRepository;
    private readonly events;
    private readonly mapper;
    private readonly projectService;
    constructor(recordRepository: Repository<OmniRecordEntity>, relationRepository: Repository<OmniRelationEntity>, events: YalcEventService, mapper: TaskAppOmniMapper, projectService: TaskAppOmniProjectService);
    supportsStructuredGraphqlFilters(): boolean;
    list(query?: TaskListQuery): Promise<{
        list: TaskItemType[];
        nodes: TaskItemType[];
        pageData: {
            count: number;
            endRow: number;
            startRow: number;
        };
    }>;
    getById(guid: string): Promise<TaskItemType>;
    create(input: TaskItemOmniWriteInput): Promise<TaskItemType>;
    update(guid: string, input: TaskItemOmniWriteInput): Promise<TaskItemType>;
    delete(guid: string): Promise<{
        deleted: boolean;
    }>;
    getEntity(where: Partial<TaskItem> | Partial<TaskItem>[] | string, _fields?: (keyof TaskItem)[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<TaskItemType | null | undefined>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskItem>, withCount?: false): Promise<TaskItemType[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskItem>, withCount: true): Promise<[TaskItemType[], number]>;
    createEntity(input: DeepPartial<TaskItem>, _findOptions?: CrudGenFindManyOptions<TaskItem>, returnEntity?: boolean): Promise<TaskItemType | boolean>;
    updateEntity(conditions: Partial<TaskItem>, input: DeepPartial<TaskItem>, _findOptions?: CrudGenFindManyOptions<TaskItem>, returnEntity?: boolean): Promise<TaskItemType | boolean>;
    deleteEntity(conditions: Partial<TaskItem>): Promise<boolean>;
    ensureTaskExists(guid: string): Promise<void>;
    private getTaskRecordOrFail;
    private getTaskItemOrFail;
    private findTasks;
    private getCollectionMembersByKind;
    private buildRecordOrder;
    private requireGuid;
    private normalizeCrudGenWhere;
    private mapGuidFindOperator;
    private mapProjectIdFindOperator;
    private mapTitleFindOperator;
    private unwrapScalarCondition;
    private getProjectIds;
    private getProjectIdForTask;
    private syncContainsRelation;
    private syncTaskRelations;
}
export {};
