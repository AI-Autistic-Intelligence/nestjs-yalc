"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], PostEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PostEntity.prototype, "content", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => user_entity_1.UserEntity),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.posts),
    tslib_1.__metadata("design:type", user_entity_1.UserEntity)
], PostEntity.prototype, "user", void 0);
exports.PostEntity = PostEntity = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Post'),
    (0, typeorm_1.Entity)('posts')
], PostEntity);
//# sourceMappingURL=post.entity.js.map