import { YalcEventService } from '@nestjs-yalc/event-manager';
export declare class TasksLoggingController {
    private readonly events;
    constructor(events: YalcEventService);
    logTaskEvent(): Promise<{
        ok: boolean;
    }>;
}
