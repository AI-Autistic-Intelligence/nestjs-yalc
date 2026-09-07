import { YalcEventService } from '@nest-yalc-2/event-manager';
export declare class TasksErrorsController {
    private readonly events;
    constructor(events: YalcEventService);
    badRequest(): void;
    notFound(): void;
}
