import { TaskWorkflowsService } from './task-workflows.service';
import type { CreateProjectWithTaskPayload } from './task-workflows.service';
export declare class TaskWorkflowsController {
    private readonly service;
    constructor(service: TaskWorkflowsService);
    getBacklog(): Promise<any>;
    createProjectWithTask(payload: CreateProjectWithTaskPayload): Promise<{
        project: any;
        task: any;
    }>;
    completeTask(id: string): Promise<{
        task: any;
    }>;
    listProjectTasks(projectId: string): Promise<any>;
}
