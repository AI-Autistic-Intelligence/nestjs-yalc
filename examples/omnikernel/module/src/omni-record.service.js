"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
class OmniRecordService extends omni_scoped_service_js_1.OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'tombstone', reservedRecordKinds = []) {
        super(repository, scopeOrRepositoryWrite, deletion);
        this.reservedKinds = new Set(reservedRecordKinds);
    }
    async createEntity(input, findOptions, returnEntity = true) {
        this.rejectReservedKind(input.kind);
        return super.createEntity(input, findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        this.rejectReservedKind(input.kind);
        await this.assertExistingRecordIsNotReserved(conditions);
        return super.updateEntity(this.nonReservedConditions(conditions), input, findOptions, returnEntity);
    }
    async deleteEntity(conditions) {
        await this.assertExistingRecordIsNotReserved(conditions);
        return super.deleteEntity(this.nonReservedConditions(conditions));
    }
    async assertExistingRecordIsNotReserved(conditions) {
        const record = await super.getEntity(conditions, undefined, undefined, undefined, { failOnNull: false });
        if (record)
            this.rejectReservedKind(record.kind);
    }
    nonReservedConditions(conditions) {
        if (this.reservedKinds.size === 0)
            return conditions;
        return {
            ...conditions,
            kind: (0, typeorm_1.Not)((0, typeorm_1.In)([...this.reservedKinds])),
        };
    }
    rejectReservedKind(kind) {
        if (typeof kind === 'string' && this.reservedKinds.has(kind)) {
            throw new common_1.BadRequestException('This record kind is owned by a registered extension projection.');
        }
    }
}
exports.OmniRecordService = OmniRecordService;
//# sourceMappingURL=omni-record.service.js.map