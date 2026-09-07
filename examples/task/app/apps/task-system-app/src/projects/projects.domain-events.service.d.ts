import { YalcEventService } from '@nest-yalc-2/event-manager';
export declare class ProjectsDomainEventsService {
    private readonly events;
    private readonly logger;
    constructor(events: YalcEventService);
    emitProjectCreated(projectId: string, name: string): Promise<void>;
}
