import { TaskProject } from '@nest-yalc-2/task-system-module/src/task-project.entity';
export declare class TaskProjectType extends TaskProject {
    constructor(data?: Partial<TaskProjectType>);
    guid: string;
    name: string;
    description?: string | null;
    status: string;
}
declare const TaskProjectCreateInput_base: import("@nestjs/common").Type<Omit<TaskProjectType, keyof TaskProjectType>>;
export declare class TaskProjectCreateInput extends TaskProjectCreateInput_base {
}
declare const TaskProjectCondition_base: import("@nestjs/common").Type<Partial<TaskProjectCreateInput>>;
export declare class TaskProjectCondition extends TaskProjectCondition_base {
}
declare const TaskProjectUpdateInput_base: import("@nestjs/common").Type<Partial<TaskProjectCreateInput>>;
export declare class TaskProjectUpdateInput extends TaskProjectUpdateInput_base {
}
export {};
