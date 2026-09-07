import type { TaskDomainEventPayload } from '@nest-yalc-2/task-system-module/src/events/tasks-events.client';
export interface RecordedTaskDomainEvent {
    eventName: string;
    source: 'local' | 'rabbitmq';
    payload: TaskDomainEventPayload;
}
export declare class TaskEventsAuditStore {
    private readonly events;
    private readonly waiters;
    record(event: RecordedTaskDomainEvent): void;
    list(): RecordedTaskDomainEvent[];
    clear(): void;
    waitFor(predicate: (event: RecordedTaskDomainEvent) => boolean, timeoutMs?: number): Promise<RecordedTaskDomainEvent>;
}
