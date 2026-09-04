import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(agGridArgs: AgGridFindManyOptions<UserEntity>): Promise<UserEntity[]>;
    throwError(): string;
    createUser(firstName: string, lastName: string, balance: string, age: number): Promise<UserEntity>;
}
