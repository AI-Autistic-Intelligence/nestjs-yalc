import { TaskExternalRef } from '@nest-yalc-2/task-system-module/src/task-external-ref.entity';
export declare class TaskExternalRefType extends TaskExternalRef {
    constructor(data?: Partial<TaskExternalRefType>);
    guid: string;
    internalType: string;
    internalId: string;
    provider: string;
    account?: string | null;
    container?: string | null;
    externalId: string;
}
declare const TaskExternalRefCreateInput_base: import("@nestjs/common").Type<Omit<TaskExternalRefType, keyof TaskExternalRefType>>;
export declare class TaskExternalRefCreateInput extends TaskExternalRefCreateInput_base {
}
declare const TaskExternalRefCondition_base: import("@nestjs/common").Type<Partial<TaskExternalRefCreateInput>>;
export declare class TaskExternalRefCondition extends TaskExternalRefCondition_base {
}
declare const TaskExternalRefUpdateInput_base: import("@nestjs/common").Type<Partial<TaskExternalRefCreateInput>>;
export declare class TaskExternalRefUpdateInput extends TaskExternalRefUpdateInput_base {
}
export {};
