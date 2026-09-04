import { TaskItem } from './task-item.entity.js';
import { TaskProjectType } from './task-project.dto.js';
export declare class TaskItemType extends TaskItem {
    constructor(data?: Partial<TaskItemType>);
    guid: string;
    title: string;
    description?: string | null;
    status: string;
    projectId?: string | null;
    project?: TaskProjectType | null;
    dueAt?: Date | null;
}
declare const TaskItemCreateInput_base: import("@nestjs/common").Type<Omit<TaskItemType, "createdAt" | "updatedAt" | "project">>;
export declare class TaskItemCreateInput extends TaskItemCreateInput_base {
}
declare const TaskItemCondition_base: import("@nestjs/common").Type<Partial<TaskItemCreateInput>>;
export declare class TaskItemCondition extends TaskItemCondition_base {
}
declare const TaskItemUpdateInput_base: import("@nestjs/common").Type<Partial<TaskItemCreateInput>>;
export declare class TaskItemUpdateInput extends TaskItemUpdateInput_base {
}
export {};
