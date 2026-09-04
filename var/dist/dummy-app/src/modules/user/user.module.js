import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
let UserModule = class UserModule {
};
UserModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([UserEntity])],
        providers: [UserService, UserResolver],
        exports: [UserService],
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map