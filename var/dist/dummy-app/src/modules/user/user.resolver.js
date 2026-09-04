var _a, _b;
import { __decorate, __metadata, __param } from "tslib";
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { AgGridArgs } from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { GqlError } from '@nestjs-yalc/graphql/plugins/gql.error';
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    getUsers(agGridArgs) {
        return this.userService.getEntityListAgGrid(agGridArgs);
    }
    throwError() {
        throw new GqlError('Intentional error for testing', 'TEST_ERROR');
    }
    async createUser(firstName, lastName, balance, age) {
        return this.userService.userRepository.save({
            firstName,
            lastName,
            balance,
            age,
        });
    }
};
__decorate([
    Query(() => [UserEntity]),
    __param(0, AgGridArgs({ entityType: UserEntity })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof AgGridFindManyOptions !== "undefined" && AgGridFindManyOptions) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], UserResolver.prototype, "throwError", null);
__decorate([
    Mutation(() => UserEntity),
    __param(0, Args('firstName')),
    __param(1, Args('lastName')),
    __param(2, Args('balance')),
    __param(3, Args('age')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
UserResolver = __decorate([
    Resolver(() => UserEntity),
    __metadata("design:paramtypes", [typeof (_a = typeof UserService !== "undefined" && UserService) === "function" ? _a : Object])
], UserResolver);
export { UserResolver };
//# sourceMappingURL=user.resolver.js.map