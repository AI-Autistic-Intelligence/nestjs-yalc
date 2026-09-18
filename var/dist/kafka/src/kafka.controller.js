"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let KafkaController = class KafkaController {
    constructor(repository) {
        this.repository = repository;
    }
    checkTargetValue(target, key, value) {
        return value.includes(target[key]);
    }
    async saveEntity(entity) {
        return this.repository.insert(entity);
    }
    async saveEntityOrUpdate(entity, overWrite, conflitTarget) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .values(entity)
            .orUpdate(overWrite, conflitTarget)
            .execute();
    }
    async deleteEntity(conditions) {
        return this.repository.delete(conditions);
    }
};
exports.KafkaController = KafkaController;
exports.KafkaController = KafkaController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository])
], KafkaController);
//# sourceMappingURL=kafka.controller.js.map