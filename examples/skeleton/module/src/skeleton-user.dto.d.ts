import { SkeletonUser } from './skeleton-user.entity.js';
import { SkeletonPhoneType } from './skeleton-phone.dto.js';
export declare class SkeletonUserType extends SkeletonUser {
    constructor(data?: Partial<SkeletonUserType>);
    firstName: string;
    lastName: string;
    email: string;
    SkeletonPhone?: SkeletonPhoneType[];
    password: string;
    guid: string;
    fullName: string;
}
declare const SkeletonUserCreateInput_base: import("@nestjs/common").Type<Omit<SkeletonUserType, "createdAt" | "updatedAt" | "fullName" | "SkeletonPhone">>;
export declare class SkeletonUserCreateInput extends SkeletonUserCreateInput_base {
    password: string;
}
declare const SkeletonUserCondition_base: import("@nestjs/common").Type<Partial<SkeletonUserCreateInput>>;
export declare class SkeletonUserCondition extends SkeletonUserCondition_base {
}
declare const SkeletonUserUpdateInput_base: import("@nestjs/common").Type<Partial<SkeletonUserCreateInput>>;
export declare class SkeletonUserUpdateInput extends SkeletonUserUpdateInput_base {
}
export {};
