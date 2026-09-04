import { __decorate, __metadata } from "tslib";
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let TestEntity = class TestEntity {
};
__decorate([
    Field(() => ID),
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TestEntity.prototype, "id", void 0);
__decorate([
    Field(),
    Column(),
    __metadata("design:type", String)
], TestEntity.prototype, "name", void 0);
TestEntity = __decorate([
    ObjectType(),
    Entity()
], TestEntity);
export { TestEntity };
//# sourceMappingURL=test.entity.js.map