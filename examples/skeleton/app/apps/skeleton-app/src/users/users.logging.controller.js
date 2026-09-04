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
exports.UsersLoggingController = void 0;
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nestjs-yalc/event-manager");
let UsersLoggingController = class UsersLoggingController {
    constructor(events) {
        this.events = events;
    }
    async logExample() {
        await this.events.log(['skeleton', 'users', 'logging-demo'], {
            message: 'Users logging endpoint called',
            data: { feature: 'skeleton-app', endpoint: 'users-logging' },
            event: { await: true },
        });
        return { ok: true };
    }
};
exports.UsersLoggingController = UsersLoggingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersLoggingController.prototype, "logExample", null);
exports.UsersLoggingController = UsersLoggingController = __decorate([
    (0, common_1.Controller)('users-logging'),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService])
], UsersLoggingController);
//# sourceMappingURL=users.logging.controller.js.map