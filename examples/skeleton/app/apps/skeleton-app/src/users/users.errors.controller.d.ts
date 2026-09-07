import { YalcEventService } from '@nest-yalc-2/event-manager';
export declare class UsersErrorsController {
    private readonly events;
    constructor(events: YalcEventService);
    badRequest(): void;
    notFound(): void;
}
