import { BaseEntity } from 'typeorm';
import type { Relation } from 'typeorm';
import { TaskProject } from './task-project.entity.js';
declare const TaskEvent_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class TaskEvent extends TaskEvent_base {
    guid: string;
    title: string;
    description?: string | null;
    status: string;
    startAt: Date;
    endAt?: Date | null;
    allDay: boolean;
    projectId?: string | null;
    project?: Relation<TaskProject> | null;
    location?: string | null;
}
export {};
