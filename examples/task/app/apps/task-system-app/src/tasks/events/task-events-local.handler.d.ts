import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { TaskEventsAuditStore } from './task-events-audit.store';
export declare class TaskEventsLocalHandler implements OnModuleInit, OnModuleDestroy {
    private readonly events;
    private readonly audit;
    private readonly onTaskCreated;
    private readonly onTaskStatusChanged;
    constructor(events: YalcEventService, audit: TaskEventsAuditStore);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
