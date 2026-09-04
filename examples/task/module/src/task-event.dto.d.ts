import { TaskEvent } from './task-event.entity.js';
import { TaskProjectType } from './task-project.dto.js';
export declare class TaskEventType extends TaskEvent {
    constructor(data?: Partial<TaskEventType>);
    guid: string;
    title: string;
    description?: string | null;
    status: string;
    startAt: Date;
    endAt?: Date | null;
    allDay: boolean;
    projectId?: string | null;
    project?: TaskProjectType | null;
    location?: string | null;
}
declare const TaskEventCreateInput_base: import("@nestjs/common").Type<Omit<TaskEventType, "createdAt" | "updatedAt" | "project">>;
export declare class TaskEventCreateInput extends TaskEventCreateInput_base {
}
declare const TaskEventCondition_base: import("@nestjs/common").Type<Partial<TaskEventCreateInput>>;
export declare class TaskEventCondition extends TaskEventCondition_base {
}
declare const TaskEventUpdateInput_base: import("@nestjs/common").Type<Partial<TaskEventCreateInput>>;
export declare class TaskEventUpdateInput extends TaskEventUpdateInput_base {
}
export {};
