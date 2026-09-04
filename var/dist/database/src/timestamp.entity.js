import { __decorate, __metadata } from "tslib";
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
export const EntityWithTimestamps = (base) => {
    let EntityWithTimestamps = class EntityWithTimestamps extends base {
    };
    __decorate([
        CreateDateColumn({
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
        }),
        Field(),
        __metadata("design:type", Date)
    ], EntityWithTimestamps.prototype, "createdAt", void 0);
    __decorate([
        UpdateDateColumn({
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
            onUpdate: 'CURRENT_TIMESTAMP(6)',
        }),
        Field(),
        __metadata("design:type", Date)
    ], EntityWithTimestamps.prototype, "updatedAt", void 0);
    EntityWithTimestamps = __decorate([
        ObjectType()
    ], EntityWithTimestamps);
    return EntityWithTimestamps;
};
//# sourceMappingURL=timestamp.entity.js.map