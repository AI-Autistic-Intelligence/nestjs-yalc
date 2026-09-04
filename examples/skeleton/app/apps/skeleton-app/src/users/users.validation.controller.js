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
exports.UsersValidationController = void 0;
const common_1 = require("@nestjs/common");
const users_dto_1 = require("./users.dto");
const generic_service_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.service");
const common_2 = require("@nestjs/common");
const crud_gen_helpers_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers");
const common_3 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let UsersValidationController = class UsersValidationController {
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        const guid = (0, node_crypto_1.randomUUID)();
        return this.service.createEntity(Object.assign(Object.assign({}, body), { guid }));
    }
};
exports.UsersValidationController = UsersValidationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: false },
        validateCustomDecorators: true,
        exceptionFactory: (errors) => {
            const errorMessages = {};
            errors.forEach((error) => {
                errorMessages[error.property] = error;
            });
            return new common_3.BadRequestException(errorMessages);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersValidationController.prototype, "create", null);
exports.UsersValidationController = UsersValidationController = __decorate([
    (0, common_1.Controller)('users-validation'),
    __param(0, (0, common_2.Inject)((0, crud_gen_helpers_1.getProviderToken)('SkeletonUserGenericService'))),
    __metadata("design:paramtypes", [generic_service_1.GenericService])
], UsersValidationController);
//# sourceMappingURL=users.validation.controller.js.map