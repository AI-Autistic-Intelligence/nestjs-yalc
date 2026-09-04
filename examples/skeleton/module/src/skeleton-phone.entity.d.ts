import { BaseEntity } from 'typeorm';
import type { Relation } from 'typeorm';
import { SkeletonUser } from './skeleton-user.entity.js';
declare const SkeletonPhone_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class SkeletonPhone extends SkeletonPhone_base {
    ID: number;
    phoneNumber: string;
    userId: string;
    SkeletonUser?: Relation<SkeletonUser>;
}
export {};
