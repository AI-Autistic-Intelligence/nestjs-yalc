import { GenericService } from '@nest-yalc-2/crud-gen/typeorm/generic.service.js';
import { SkeletonUser } from './skeleton-user.entity.js';
import { ClassType } from '@nest-yalc-2/types/globals.d.js';
export interface SkeletonUserService extends GenericService<SkeletonUser> {
    resetPassword(guid: string): Promise<string>;
}
export declare const skeletonUserServiceFactory: (dbConnection: string) => ClassType<SkeletonUserService>;
