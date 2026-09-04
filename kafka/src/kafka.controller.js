"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaController = void 0;
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
exports.KafkaController = KafkaController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], KafkaController);
//# sourceMappingURL=kafka.controller.js.map