var _a;
import { __decorate, __metadata } from "tslib";
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
let PostEntity = class PostEntity {
};
__decorate([
    Field(() => ID),
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PostEntity.prototype, "id", void 0);
__decorate([
    Field(),
    Column(),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    Field(),
    Column(),
    __metadata("design:type", String)
], PostEntity.prototype, "content", void 0);
__decorate([
    Field(() => UserEntity),
    ManyToOne(() => UserEntity, (user) => user.posts),
    __metadata("design:type", typeof (_a = typeof UserEntity !== "undefined" && UserEntity) === "function" ? _a : Object)
], PostEntity.prototype, "user", void 0);
PostEntity = __decorate([
    ObjectType('Post'),
    Entity('posts')
], PostEntity);
export { PostEntity };
//# sourceMappingURL=post.entity.js.map