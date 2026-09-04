import { BaseEntity } from 'typeorm';
import type { Relation } from 'typeorm';
import { SkeletonPhone } from './skeleton-phone.entity.js';
declare const SkeletonUser_base: {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & typeof BaseEntity;
export declare class SkeletonUser extends SkeletonUser_base {
    guid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    fullName: string;
    SkeletonPhone?: Relation<SkeletonPhone[]>;
    hydrateDerivedFields(): void;
}
export {};
