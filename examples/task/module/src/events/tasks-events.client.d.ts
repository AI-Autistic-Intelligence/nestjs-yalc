import type { IEventStrategy } from '@nestjs-yalc/api-strategy';
export declare const TASK_EVENTS_STRATEGY = "TASK_EVENTS_STRATEGY";
export declare const TASK_EVENTS_LOCAL_STRATEGY = "TASK_EVENTS_LOCAL_STRATEGY";
export declare const TASK_EVENTS_RABBITMQ_STRATEGY = "TASK_EVENTS_RABBITMQ_STRATEGY";
export declare const TASK_CREATED_EVENT = "task-system.tasks.created";
export declare const TASK_STATUS_CHANGED_EVENT = "task-system.tasks.status-changed";
export interface TaskCreatedEventPayload {
    eventName: typeof TASK_CREATED_EVENT;
    taskId: string;
    projectId: string | null;
    occurredAt: string;
}
export interface TaskStatusChangedEventPayload {
    eventName: typeof TASK_STATUS_CHANGED_EVENT;
    taskId: string;
    status: string;
    occurredAt: string;
}
export type TaskDomainEventPayload = TaskCreatedEventPayload | TaskStatusChangedEventPayload;
export declare class TasksEventsClient {
    private readonly events;
    constructor(events: IEventStrategy<TaskDomainEventPayload>);
    emitTaskCreated(taskId: string, projectId?: string | null): Promise<void>;
    emitTaskStatusChanged(taskId: string, status: string): Promise<void>;
}
