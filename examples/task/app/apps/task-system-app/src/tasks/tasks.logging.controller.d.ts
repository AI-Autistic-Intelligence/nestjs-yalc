import { YalcEventService } from '@nest-yalc-2/event-manager';
export declare class TasksLoggingController {
    private readonly events;
    constructor(events: YalcEventService);
    logTaskEvent(): Promise<{
        ok: boolean;
    }>;
}
