import { BaseEntity } from 'typeorm';
declare const TaskSyncState_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class TaskSyncState extends TaskSyncState_base {
    guid: string;
    externalRefId: string;
    status: string;
    lastSyncedAt?: Date | null;
    lastDirection?: string | null;
    remoteVersion?: string | null;
    localVersionHash?: string | null;
    lastError?: string | null;
}
export {};
