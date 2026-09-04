import { __decorate, __metadata } from "tslib";
import { Controller } from '@nestjs/common';
import { Repository } from 'typeorm';
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
KafkaController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [Repository])
], KafkaController);
export { KafkaController };
//# sourceMappingURL=kafka.controller.js.map