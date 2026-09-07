import { GQLDataLoader } from '@nest-yalc-2/data-loader/dataloader.helper.js';
import { ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SkeletonUserType } from './skeleton-user.dto.js';
import { SkeletonUser } from './skeleton-user.entity.js';
import * as skeletonUserServiceJs from './skeleton-user.service.js';
export declare const lowerCaseEmailMiddleware: (_ctx: GqlExecutionContext, input: SkeletonUserType, value: boolean) => void;
declare const SkeletonUserResolver_base: new (service: import("@nest-yalc-2/crud-gen").GenericService<SkeletonUser, SkeletonUser>, dataloader: GQLDataLoader<SkeletonUser>, moduleRef: ModuleRef) => import("@nest-yalc-2/crud-gen").IGenericResolver;
export declare class SkeletonUserResolver extends SkeletonUserResolver_base {
    protected service: skeletonUserServiceJs.SkeletonUserService;
    protected dataloader: GQLDataLoader;
    protected moduleRef: ModuleRef;
    constructor(service: skeletonUserServiceJs.SkeletonUserService, dataloader: GQLDataLoader, moduleRef: ModuleRef);
    SkeletonModule_generateRandomPassword(ID: string): Promise<string>;
    fullName(parent: SkeletonUserType): string;
}
export declare const skeletonUserProvidersFactory: (dbConnection: string) => import("@nest-yalc-2/crud-gen").IDependencyObject<SkeletonUser>;
export {};
