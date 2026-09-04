import { __decorate, __metadata, __param } from "tslib";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { UserEntity } from '../../entities/user.entity';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
let UserService = class UserService extends GenericService {
    constructor(userRepository) {
        super(new AgGridRepository(userRepository.target, userRepository.manager, userRepository.queryRunner));
        this.userRepository = userRepository;
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, InjectRepository(UserEntity)),
    __metadata("design:paramtypes", [Repository])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map