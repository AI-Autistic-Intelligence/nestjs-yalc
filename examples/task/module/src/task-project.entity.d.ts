import { BaseEntity } from 'typeorm';
import type { Relation } from 'typeorm';
import { TaskEvent } from './task-event.entity.js';
import { TaskItem } from './task-item.entity.js';
declare const TaskProject_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class TaskProject extends TaskProject_base {
    guid: string;
    name: string;
    description?: string | null;
    status: string;
    tasks?: Relation<TaskItem[]>;
    events?: Relation<TaskEvent[]>;
}
export {};
