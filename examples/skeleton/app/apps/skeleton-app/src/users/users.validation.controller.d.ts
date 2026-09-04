import { CreateUserDto } from './users.dto';
import { GenericService } from '@nestjs-yalc/crud-gen/typeorm/generic.service';
import { SkeletonUser } from '@nestjs-yalc/skeleton-module/src/skeleton-user.entity';
export declare class UsersValidationController {
    private readonly service;
    constructor(service: GenericService<SkeletonUser>);
    create(body: CreateUserDto): Promise<SkeletonUser>;
}
