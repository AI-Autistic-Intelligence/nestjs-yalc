import { BadRequestException } from '@nestjs/common';
import { In, Not } from 'typeorm';
import { OmniScopedService } from './omni-scoped.service.js';
/**
 * Raw Omni record CRUD with a mechanical boundary around extension-owned
 * kinds. A registered extension is the only writer for its owner lifecycle;
 * mounting a generic record transport cannot turn another record into that
 * kind or mutate/delete an existing owner.
 */
export class OmniRecordService extends OmniScopedService {
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
            kind: Not(In([...this.reservedKinds])),
        };
    }
    rejectReservedKind(kind) {
        if (typeof kind === 'string' && this.reservedKinds.has(kind)) {
            throw new BadRequestException('This record kind is owned by a registered extension projection.');
        }
    }
}
//# sourceMappingURL=omni-record.service.js.map