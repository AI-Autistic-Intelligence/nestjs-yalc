"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./post.entity");
const decimal_middleware_helper_1 = require("@nest-yalc-2/field-middleware/decimal-middleware.helper");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { middleware: [decimal_middleware_helper_1.decimalMiddleware] }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)('int'),
    tslib_1.__metadata("design:type", Number)
], UserEntity.prototype, "age", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [post_entity_1.PostEntity], { nullable: 'itemsAndList' }),
    (0, typeorm_1.OneToMany)(() => post_entity_1.PostEntity, (post) => post.user, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], UserEntity.prototype, "posts", void 0);
exports.UserEntity = UserEntity = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('User'),
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map