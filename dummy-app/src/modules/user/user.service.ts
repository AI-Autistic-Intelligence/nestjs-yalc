import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from '@nest-yalc-2/ag-grid/generic-service.service';
import { UserEntity } from '../../entities/user.entity';

import { AgGridRepository } from '@nest-yalc-2/ag-grid/ag-grid.repository';

@Injectable()
export class UserService extends GenericService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,
  ) {
    super(
      new AgGridRepository(
        userRepository.target,
        userRepository.manager,
        userRepository.queryRunner,
      ),
    );
  }
}


