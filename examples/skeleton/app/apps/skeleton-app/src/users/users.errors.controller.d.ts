import { YalcEventService } from '@nestjs-yalc/event-manager';
export declare class UsersErrorsController {
    private readonly events;
    constructor(events: YalcEventService);
    badRequest(): void;
    notFound(): void;
}
