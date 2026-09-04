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
exports.SkeletonPhone = void 0;
const timestamp_entity_js_1 = require("@nestjs-yalc/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const skeleton_user_entity_js_1 = require("./skeleton-user.entity.js");
let SkeletonPhone = class SkeletonPhone extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
};
exports.SkeletonPhone = SkeletonPhone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], SkeletonPhone.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20 }),
    __metadata("design:type", String)
], SkeletonPhone.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 36 }),
    __metadata("design:type", String)
], SkeletonPhone.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => skeleton_user_entity_js_1.SkeletonUser, (meta) => meta.SkeletonPhone),
    (0, typeorm_1.JoinColumn)([{ name: 'userId', referencedColumnName: 'guid' }]),
    __metadata("design:type", Object)
], SkeletonPhone.prototype, "SkeletonUser", void 0);
exports.SkeletonPhone = SkeletonPhone = __decorate([
    (0, typeorm_1.Entity)('skeleton-phone'),
    (0, typeorm_1.Index)('unique_phone', ['phoneNumber', 'userId'], { unique: true }),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], SkeletonPhone);
//# sourceMappingURL=skeleton-phone.entity.js.map