import { YalcEventService } from '@nestjs-yalc/event-manager';
import { TasksEventsClient } from '@nestjs-yalc/task-system-module/src/events/tasks-events.client';
export declare class TasksDomainEventsService {
    private readonly events;
    private readonly taskEvents?;
    private readonly logger;
    constructor(events: YalcEventService, taskEvents?: TasksEventsClient);
    emitTaskCreated(taskId: string, projectId?: string | null): Promise<void>;
    emitTaskStatusChanged(taskId: string, status: string): Promise<void>;
}
