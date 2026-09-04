import { TaskSyncState } from './task-sync-state.entity.js';
export declare class TaskSyncStateType extends TaskSyncState {
    constructor(data?: Partial<TaskSyncStateType>);
    guid: string;
    externalRefId: string;
    status: string;
    lastSyncedAt?: Date | null;
    lastDirection?: string | null;
    remoteVersion?: string | null;
    localVersionHash?: string | null;
    lastError?: string | null;
}
declare const TaskSyncStateCreateInput_base: import("@nestjs/common").Type<Omit<TaskSyncStateType, "createdAt" | "updatedAt">>;
export declare class TaskSyncStateCreateInput extends TaskSyncStateCreateInput_base {
}
declare const TaskSyncStateCondition_base: import("@nestjs/common").Type<Partial<TaskSyncStateCreateInput>>;
export declare class TaskSyncStateCondition extends TaskSyncStateCondition_base {
}
declare const TaskSyncStateUpdateInput_base: import("@nestjs/common").Type<Partial<TaskSyncStateCreateInput>>;
export declare class TaskSyncStateUpdateInput extends TaskSyncStateUpdateInput_base {
}
export {};
