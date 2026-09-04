import { YalcEventService } from '@nestjs-yalc/event-manager';
export declare class UsersLoggingController {
    private readonly events;
    constructor(events: YalcEventService);
    logExample(): Promise<{
        ok: boolean;
    }>;
}
