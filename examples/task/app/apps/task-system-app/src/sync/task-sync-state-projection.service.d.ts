import { OnApplicationBootstrap } from '@nestjs/common';
import { ProjectionResourceService, type ProjectionDialect, type ProjectionScope } from '@nestjs-yalc/crud-gen';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { type DataSource } from 'typeorm';
import { TaskAppOmniExternalRefService } from '../omni-task-app/task-app-omni-external-ref.service';
import { TaskSyncStateProjection } from './task-sync-state.projection';
export declare const TASK_SYNC_STATE_PROJECTION_SCOPE: unique symbol;
export declare const TASK_SYNC_STATE_PROJECTION_DIALECT: unique symbol;
export declare class TaskSyncStateProjectionIndexesBootstrap implements OnApplicationBootstrap {
    private readonly dataSource;
    private readonly dialect;
    constructor(dataSource: DataSource, dialect: ProjectionDialect);
    onApplicationBootstrap(): Promise<void>;
}
export declare class TaskSyncStateProjectionService extends ProjectionResourceService<TaskSyncStateProjection> {
    private readonly externalRefService;
    constructor(dataSource: DataSource, scope: ProjectionScope, dialect: ProjectionDialect, events: YalcEventService, externalRefService: TaskAppOmniExternalRefService);
    createEntity(input: Record<string, unknown>): Promise<TaskSyncStateProjection>;
    updateEntity(conditions: Record<string, unknown>, input: Record<string, unknown>): Promise<TaskSyncStateProjection>;
    private assertExternalRef;
}
