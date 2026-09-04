import { SkeletonPhone } from './skeleton-phone.entity.js';
import { SkeletonUserType } from './skeleton-user.dto.js';
export declare class SkeletonPhoneType extends SkeletonPhone {
    constructor(data?: Partial<SkeletonPhoneType>);
    ID: number;
    phoneNumber: string;
    SkeletonUser?: SkeletonUserType;
    userId: string;
}
declare const SkeletonPhoneCreateInput_base: import("@nestjs/common").Type<Omit<SkeletonPhoneType, "SkeletonUser">>;
export declare class SkeletonPhoneCreateInput extends SkeletonPhoneCreateInput_base {
}
declare const SkeletonPhoneCondition_base: import("@nestjs/common").Type<Partial<SkeletonPhoneCreateInput>>;
export declare class SkeletonPhoneCondition extends SkeletonPhoneCondition_base {
}
declare const SkeletonPhoneUpdateInput_base: import("@nestjs/common").Type<Omit<SkeletonPhoneType, "userId" | "SkeletonUser">>;
export declare class SkeletonPhoneUpdateInput extends SkeletonPhoneUpdateInput_base {
}
export {};
