import { __decorate, __metadata } from "tslib";
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';
import { decimalMiddleware } from '@nestjs-yalc/field-middleware/decimal-middleware.helper';
let UserEntity = class UserEntity {
};
__decorate([
    Field(() => ID),
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    Field(),
    Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
__decorate([
    Field(),
    Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
__decorate([
    Field(() => String, { middleware: [decimalMiddleware] }),
    Column('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", String)
], UserEntity.prototype, "balance", void 0);
__decorate([
    Field(() => Int),
    Column('int'),
    __metadata("design:type", Number)
], UserEntity.prototype, "age", void 0);
__decorate([
    Field(() => [PostEntity], { nullable: 'itemsAndList' }),
    OneToMany(() => PostEntity, (post) => post.user, { cascade: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "posts", void 0);
UserEntity = __decorate([
    ObjectType('User'),
    Entity('users')
], UserEntity);
export { UserEntity };
//# sourceMappingURL=user.entity.js.map