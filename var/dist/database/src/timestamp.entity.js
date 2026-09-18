"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityWithTimestamps = void 0;
const tslib_1 = require("tslib");
const returnValue_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue"));
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const EntityWithTimestamps = (base) => {
    let EntityWithTimestamps = class EntityWithTimestamps extends base {
    };
    tslib_1.__decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: 'timestamp',
            default: (0, returnValue_1.default)('CURRENT_TIMESTAMP(6)'),
        }),
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", Date)
    ], EntityWithTimestamps.prototype, "createdAt", void 0);
    tslib_1.__decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'timestamp',
            default: (0, returnValue_1.default)('CURRENT_TIMESTAMP(6)'),
            onUpdate: 'CURRENT_TIMESTAMP(6)',
        }),
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", Date)
    ], EntityWithTimestamps.prototype, "updatedAt", void 0);
    EntityWithTimestamps = tslib_1.__decorate([
        (0, graphql_1.ObjectType)()
    ], EntityWithTimestamps);
    return EntityWithTimestamps;
};
exports.EntityWithTimestamps = EntityWithTimestamps;
//# sourceMappingURL=timestamp.entity.js.map