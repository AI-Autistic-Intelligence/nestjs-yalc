import { BaseEntity } from 'typeorm';
import type { Relation } from 'typeorm';
import { TaskProject } from './task-project.entity.js';
declare const TaskItem_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class TaskItem extends TaskItem_base {
    guid: string;
    title: string;
    description?: string | null;
    status: string;
    projectId?: string | null;
    project?: Relation<TaskProject> | null;
    dueAt?: Date | null;
}
export {};
