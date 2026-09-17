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
exports.FounderController = void 0;
const index_1 = require("../../../../ferrox-node/dist/index");
let FounderController = class FounderController {
    getSaaSMetrics() {
        return {
            mrr: 250000,
            arr: 3000000,
            activeTenants: 145,
            securityPosture: 'PASSING_100_PERCENT',
            sentinelThreatsBlocked: 42,
        };
    }
};
exports.FounderController = FounderController;
__decorate([
    (0, index_1.Get)('/metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FounderController.prototype, "getSaaSMetrics", null);
exports.FounderController = FounderController = __decorate([
    (0, index_1.Controller)('/api/v1/founder'),
    (0, index_1.Roles)('founder')
], FounderController);
