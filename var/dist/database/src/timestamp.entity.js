"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityWithTimestamps = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const timestamp_entity_js_1 = require("@node-yalc/database/timestamp.entity.js");
const EntityWithTimestamps = (base) => {
    let EntityWithTimestamps = class EntityWithTimestamps extends (0, timestamp_entity_js_1.YalcEntityWithTimestamps)(base) {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", Date)
    ], EntityWithTimestamps.prototype, "createdAt", void 0);
    tslib_1.__decorate([
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