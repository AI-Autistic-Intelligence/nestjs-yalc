import { ProjectsDomainEventsService } from './projects.domain-events.service';
export declare class ProjectsLoggingController {
    private readonly service;
    constructor(service: ProjectsDomainEventsService);
    logProjectEvent(): Promise<{
        ok: boolean;
        projectId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
}
