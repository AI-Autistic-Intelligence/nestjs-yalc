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
    /**
     * Check function for filtering target with specific value on a key
     * @param target Entity
     * @param key Key of the Entity fields
     * @param value Value to filter
     * @returns true if match - false otherwise
     */
    checkTargetValue(target, key, value) {
        return value.includes(target[key]);
    }
    /**
     * Save entity on Database
     * @param entity
     * @returns
     */
    async saveEntity(entity) {
        return this.repository.insert(entity);
    }
    /**
     * Save the entity or Update in case of confitColumn
     * @param entity
     * @param overWrite
     * @param conflitTarget
     * @returns
     */
    async saveEntityOrUpdate(entity, overWrite, conflitTarget) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .values(entity)
            .orUpdate(overWrite, conflitTarget)
            .execute();
    }
    /**
     * Delete the entity
     * @param conditions
     * @returns
     */
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