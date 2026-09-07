import { YalcEventService } from '@nest-yalc-2/event-manager';
export declare class UsersLoggingController {
    private readonly events;
    constructor(events: YalcEventService);
    logExample(): Promise<{
        ok: boolean;
    }>;
}
