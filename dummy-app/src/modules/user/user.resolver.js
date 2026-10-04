"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../entities/user.entity");
const user_service_1 = require("./user.service");
const ag_grid_args_decorator_1 = require("@nest-yalc-2/ag-grid/ag-grid-args.decorator");
const gql_error_1 = require("@nest-yalc-2/graphql/plugins/gql.error");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    getUsers(agGridArgs) {
        return this.userService.getEntityListAgGrid(agGridArgs);
    }
    throwError() {
        throw new gql_error_1.GqlError('Intentional error for testing', 'TEST_ERROR');
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
exports.UserResolver = UserResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.UserEntity]),
    tslib_1.__param(0, (0, ag_grid_args_decorator_1.AgGridArgs)({ entityType: user_entity_1.UserEntity })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => String),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", String)
], UserResolver.prototype, "throwError", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity),
    tslib_1.__param(0, (0, graphql_1.Args)('firstName')),
    tslib_1.__param(1, (0, graphql_1.Args)('lastName')),
    tslib_1.__param(2, (0, graphql_1.Args)('balance')),
    tslib_1.__param(3, (0, graphql_1.Args)('age')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
exports.UserResolver = UserResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.UserEntity),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
//# sourceMappingURL=user.resolver.js.map