import { TaskEventType } from './events/task-event.dto';
import { TaskAppOmniEventService } from './omni-task-app/task-app-omni-event.service';
import { TaskAppOmniProjectService } from './omni-task-app/task-app-omni-project.service';
import { TaskAppOmniTaskService } from './omni-task-app/task-app-omni-task.service';
import { TaskProjectType } from './projects/task-project.dto';
import { TaskItemType } from './tasks/task-item.dto';
export declare class TaskItemRelationsResolver {
    private readonly projectService;
    constructor(projectService: TaskAppOmniProjectService);
    project(task: TaskItemType): Promise<TaskProjectType | null>;
}
export declare class TaskEventRelationsResolver {
    private readonly projectService;
    constructor(projectService: TaskAppOmniProjectService);
    project(event: TaskEventType): Promise<TaskProjectType | null>;
}
export declare class TaskProjectRelationsResolver {
    private readonly taskService;
    private readonly eventService;
    constructor(taskService: TaskAppOmniTaskService, eventService: TaskAppOmniEventService);
    tasks(project: TaskProjectType): Promise<TaskItemType[]>;
    events(project: TaskProjectType): Promise<TaskEventType[]>;
}
