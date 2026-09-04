import { CrudGenFindManyOptions } from '@nestjs-yalc/crud-gen/api-graphql/crud-gen-gql.interface';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { OmniCollectionEntity, OmniRelationEntity } from '@nestjs-yalc/omnikernel-module';
import { TaskProject } from '@nestjs-yalc/task-system-module/src/task-project.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TaskAppOmniMapper, type TaskOmniPageQuery } from './task-app-omni.mapper';
import { TaskProjectCreateInput, TaskProjectType } from '../projects/task-project.dto';
export declare class TaskAppOmniProjectService {
    private readonly collectionRepository;
    private readonly relationRepository;
    private readonly events;
    private readonly mapper;
    constructor(collectionRepository: Repository<OmniCollectionEntity>, relationRepository: Repository<OmniRelationEntity>, events: YalcEventService, mapper: TaskAppOmniMapper);
    supportsStructuredGraphqlFilters(): boolean;
    list(query?: TaskOmniPageQuery): Promise<{
        list: TaskProjectType[];
        nodes: TaskProjectType[];
        pageData: {
            count: number;
            endRow: number;
            startRow: number;
        };
    }>;
    getById(guid: string): Promise<TaskProjectType>;
    create(input: Partial<TaskProjectCreateInput>): Promise<TaskProjectType>;
    update(guid: string, input: Partial<TaskProjectCreateInput>): Promise<TaskProjectType>;
    delete(guid: string): Promise<{
        deleted: boolean;
    }>;
    getEntity(where: Partial<TaskProject> | Partial<TaskProject>[] | string, _fields?: (keyof TaskProject)[], _relations?: string[], _databaseName?: string, options?: {
        failOnNull?: boolean;
    }): Promise<TaskProjectType | null | undefined>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskProject>, withCount?: false): Promise<TaskProjectType[]>;
    getEntityListExtended(findOptions: CrudGenFindManyOptions<TaskProject>, withCount: true): Promise<[TaskProjectType[], number]>;
    createEntity(input: DeepPartial<TaskProject>, _findOptions?: CrudGenFindManyOptions<TaskProject>, returnEntity?: boolean): Promise<TaskProjectType | boolean>;
    updateEntity(conditions: Partial<TaskProject>, input: DeepPartial<TaskProject>, _findOptions?: CrudGenFindManyOptions<TaskProject>, returnEntity?: boolean): Promise<TaskProjectType | boolean>;
    deleteEntity(conditions: Partial<TaskProject>): Promise<boolean>;
    ensureProjectExists(guid: string): Promise<void>;
    private getTaskProjectOrFail;
    private getCollectionOrFail;
    private requireGuid;
    private mapCrudGenWhereToOmniWhere;
    private mapGuidFindOperator;
}
