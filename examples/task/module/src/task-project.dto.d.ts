import { TaskEventType } from './task-event.dto.js';
import { TaskItemType } from './task-item.dto.js';
import { TaskProject } from './task-project.entity.js';
export declare class TaskProjectType extends TaskProject {
    constructor(data?: Partial<TaskProjectType>);
    guid: string;
    name: string;
    description?: string | null;
    status: string;
    tasks?: TaskItemType[];
    events?: TaskEventType[];
}
declare const TaskProjectCreateInput_base: import("@nestjs/common").Type<Omit<TaskProjectType, "createdAt" | "updatedAt" | "events" | "tasks">>;
export declare class TaskProjectCreateInput extends TaskProjectCreateInput_base {
}
declare const TaskProjectCondition_base: import("@nestjs/common").Type<Partial<TaskProjectCreateInput>>;
export declare class TaskProjectCondition extends TaskProjectCondition_base {
}
declare const TaskProjectUpdateInput_base: import("@nestjs/common").Type<Partial<TaskProjectCreateInput>>;
export declare class TaskProjectUpdateInput extends TaskProjectUpdateInput_base {
}
export {};
