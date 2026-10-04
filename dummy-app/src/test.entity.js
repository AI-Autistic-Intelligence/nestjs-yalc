"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEntity = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let TestEntity = class TestEntity {
};
exports.TestEntity = TestEntity;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], TestEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TestEntity.prototype, "name", void 0);
exports.TestEntity = TestEntity = tslib_1.__decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], TestEntity);
//# sourceMappingURL=test.entity.js.map