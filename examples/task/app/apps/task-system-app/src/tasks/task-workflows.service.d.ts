import { TelemetryService } from '@nest-yalc-2/observability';
import { TasksApiClient } from '@nest-yalc-2/task-system-module/src/client/tasks-api.client';
import type { TaskProjectCreateInput } from '../projects/task-project.dto';
import type { TaskItemCreateInput } from './task-item.dto';
import { TasksDomainEventsService } from './tasks.domain-events.service';
export interface CreateProjectWithTaskPayload {
    project: TaskProjectCreateInput;
    task: Omit<TaskItemCreateInput, 'projectId'> & {
        projectId?: string | null;
    };
}
export declare class TaskWorkflowsService {
    private readonly client;
    private readonly events;
    private readonly telemetry;
    constructor(client: TasksApiClient, events: TasksDomainEventsService, telemetry: TelemetryService);
    getBacklog(): Promise<any>;
    createProjectWithTask(payload: CreateProjectWithTaskPayload): Promise<{
        project: any;
        task: any;
    }>;
    completeTask(taskId: string): Promise<{
        task: any;
    }>;
    listProjectTasks(projectId: string): Promise<any>;
}
