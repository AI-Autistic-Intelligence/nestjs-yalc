"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedBaseEntity = void 0;
const typeorm_1 = require("typeorm");
class ExtendedBaseEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.first = 1;
        this.second = 'second';
        this.third = "{test: 'testtest'}";
    }
}
exports.ExtendedBaseEntity = ExtendedBaseEntity;
//# sourceMappingURL=extended-base-entity.entity.js.map