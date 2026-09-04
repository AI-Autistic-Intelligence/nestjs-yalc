import { YalcEventService } from '@nestjs-yalc/event-manager';
export declare class ProjectsDomainEventsService {
    private readonly events;
    private readonly logger;
    constructor(events: YalcEventService);
    emitProjectCreated(projectId: string, name: string): Promise<void>;
}
