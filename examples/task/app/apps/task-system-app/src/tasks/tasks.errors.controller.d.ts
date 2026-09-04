import { YalcEventService } from '@nestjs-yalc/event-manager';
export declare class TasksErrorsController {
    private readonly events;
    constructor(events: YalcEventService);
    badRequest(): void;
    notFound(): void;
}
