import { BaseEntity } from 'typeorm';
declare const TaskExternalRef_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class TaskExternalRef extends TaskExternalRef_base {
    guid: string;
    internalType: string;
    internalId: string;
    provider: string;
    account?: string | null;
    container?: string | null;
    externalId: string;
}
export {};
