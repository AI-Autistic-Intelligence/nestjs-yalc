import { TasksDomainEventsService } from './tasks.domain-events.service';
export declare class TasksEventsController {
    private readonly service;
    constructor(service: TasksDomainEventsService);
    emitDemoEvents(): Promise<{
        ok: boolean;
        taskId: `${string}-${string}-${string}-${string}-${string}`;
        projectId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
}
