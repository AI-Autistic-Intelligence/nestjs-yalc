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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersErrorsController = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nest-yalc-2/event-manager");
let UsersErrorsController = class UsersErrorsController {
    constructor(events) {
        this.events = events;
    }
    badRequest() {
        throw this.events.errorBadRequest('users.bad-request', {
            response: {
                message: 'Bad request demo',
            },
            data: {
                reason: 'DEMO_BAD_REQUEST',
            },
        });
    }
    notFound() {
        throw this.events.errorNotFound('users.not-found', {
            response: {
                message: 'User not found demo',
            },
            data: {
                reason: 'DEMO_NOT_FOUND',
            },
        });
    }
};
exports.UsersErrorsController = UsersErrorsController;
__decorate([
    (0, common_1.Get)('bad-request'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersErrorsController.prototype, "badRequest", null);
__decorate([
    (0, common_1.Get)('not-found'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersErrorsController.prototype, "notFound", null);
exports.UsersErrorsController = UsersErrorsController = __decorate([
    (0, common_1.Controller)('users/errors'),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService])
], UsersErrorsController);
//# sourceMappingURL=users.errors.controller.js.map