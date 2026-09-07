import { Repository } from 'typeorm';
import { GenericService } from '@nest-yalc-2/ag-grid/generic-service.service';
import { UserEntity } from '../../entities/user.entity';
export declare class UserService extends GenericService<UserEntity> {
    userRepository: Repository<UserEntity>;
    constructor(userRepository: Repository<UserEntity>);
}
