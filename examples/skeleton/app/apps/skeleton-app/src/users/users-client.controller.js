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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersClientController = void 0;
const common_1 = require("@nestjs/common");
const skeleton_module_1 = require("@nest-yalc-2/skeleton-module");
let UsersClientController = class UsersClientController {
    constructor(client) {
        this.client = client;
    }
    async listUsers() {
        return this.client.listUsers();
    }
    async listPhones() {
        return this.client.listPhones();
    }
};
exports.UsersClientController = UsersClientController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersClientController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('phones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersClientController.prototype, "listPhones", null);
exports.UsersClientController = UsersClientController = __decorate([
    (0, common_1.Controller)('users-client'),
    __metadata("design:paramtypes", [typeof (_a = typeof skeleton_module_1.UsersApiClient !== "undefined" && skeleton_module_1.UsersApiClient) === "function" ? _a : Object])
], UsersClientController);
//# sourceMappingURL=users-client.controller.js.map