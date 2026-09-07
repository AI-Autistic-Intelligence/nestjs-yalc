"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
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
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.UserEntity]),
    __param(0, (0, ag_grid_args_decorator_1.AgGridArgs)({ entityType: user_entity_1.UserEntity })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], UserResolver.prototype, "throwError", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity),
    __param(0, (0, graphql_1.Args)('firstName')),
    __param(1, (0, graphql_1.Args)('lastName')),
    __param(2, (0, graphql_1.Args)('balance')),
    __param(3, (0, graphql_1.Args)('age')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
exports.UserResolver = UserResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.UserEntity),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
//# sourceMappingURL=user.resolver.js.map