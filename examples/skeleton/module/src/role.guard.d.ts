import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { CanActivate } from '@nestjs/common';
export declare enum RoleEnum {
    PUBLIC = 0,
    USER = 1,
    ADMIN = 2
}
export declare function RoleAuth(requiredRoles: RoleEnum[]): ClassType<CanActivate>;
