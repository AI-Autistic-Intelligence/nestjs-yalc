import { CreateUserDto } from './users.dto';
import { GenericService } from '@nest-yalc-2/crud-gen/typeorm/generic.service';
import { SkeletonUser } from '@nest-yalc-2/skeleton-module/src/skeleton-user.entity';
export declare class UsersValidationController {
    private readonly service;
    constructor(service: GenericService<SkeletonUser>);
    create(body: CreateUserDto): Promise<SkeletonUser>;
}
