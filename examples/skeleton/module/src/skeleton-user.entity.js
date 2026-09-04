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
exports.SkeletonUser = void 0;
const object_decorator_js_1 = require("@nestjs-yalc/crud-gen/object.decorator.js");
const timestamp_entity_js_1 = require("@nestjs-yalc/database/timestamp.entity.js");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const skeleton_phone_entity_js_1 = require("./skeleton-phone.entity.js");
let SkeletonUser = class SkeletonUser extends (0, timestamp_entity_js_1.EntityWithTimestamps)(typeorm_1.BaseEntity) {
    hydrateDerivedFields() {
        if (!this.fullName && (this.firstName || this.lastName)) {
            this.fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
        }
    }
};
exports.SkeletonUser = SkeletonUser;
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar', { name: 'guid', length: 36 }),
    __metadata("design:type", String)
], SkeletonUser.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], SkeletonUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], SkeletonUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { unique: true }),
    __metadata("design:type", String)
], SkeletonUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], SkeletonUser.prototype, "password", void 0);
__decorate([
    (0, object_decorator_js_1.ModelField)({
        dst: "firstName || ' ' || lastName",
        mode: 'derived',
        isSymbolic: true,
    }),
    (0, typeorm_1.Column)({
        select: false,
        insert: false,
        update: false,
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], SkeletonUser.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => skeleton_phone_entity_js_1.SkeletonPhone, (meta) => meta.SkeletonUser),
    (0, typeorm_1.JoinColumn)([{ name: 'guid', referencedColumnName: 'userId' }]),
    __metadata("design:type", Object)
], SkeletonUser.prototype, "SkeletonPhone", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SkeletonUser.prototype, "hydrateDerivedFields", null);
exports.SkeletonUser = SkeletonUser = __decorate([
    (0, typeorm_1.Entity)('skeleton-user'),
    (0, graphql_1.ObjectType)({ isAbstract: true })
], SkeletonUser);
//# sourceMappingURL=skeleton-user.entity.js.map