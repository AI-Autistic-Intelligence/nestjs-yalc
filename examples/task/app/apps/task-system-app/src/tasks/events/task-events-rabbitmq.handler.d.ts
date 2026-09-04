import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TaskEventsAuditStore } from './task-events-audit.store';
export declare class TaskEventsRabbitMqHandler implements OnModuleInit, OnModuleDestroy {
    private readonly audit;
    private connection?;
    private channel?;
    private consumerTag?;
    constructor(audit: TaskEventsAuditStore);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private handleMessage;
}
