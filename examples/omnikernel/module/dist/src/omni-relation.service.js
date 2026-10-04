import { BadRequestException } from '@nestjs/common';
import { IsNull, } from 'typeorm';
import { canonicalOmniRelationKinds, } from './omni-relation-kind.contract.js';
import { isAllowedOmniRelation } from './omni-relation-semantics.js';
import { OmniScopedService } from './omni-scoped.service.js';
export class OmniRelationService extends OmniScopedService {
    constructor(repository, scope, deletion, recordRepository, kinds) {
        super(repository, scope, deletion);
        this.recordRepository = recordRepository;
        this.kinds = kinds;
    }
    async createEntity(input, findOptions, returnEntity = true) {
        this.rejectServerFields(input);
        await this.assertRelation(input);
        return super.createEntity(input, findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        for (const field of ['guid', 'sourceRecordId', 'targetRecordId']) {
            if (Object.prototype.hasOwnProperty.call(input, field)) {
                throw new BadRequestException(`Omni relation ${field} is immutable.`);
            }
        }
        const current = await super.getEntity(conditions, undefined, undefined, undefined, {
            failOnNull: true,
        });
        if (!current)
            this.notFound();
        await this.assertRelation({ ...current, ...input });
        return super.updateEntity(conditions, input, findOptions, returnEntity);
    }
    async assertRelation(input, recordRepository = this.recordRepository) {
        const sourceRecordId = this.requiredIdentifier(input.sourceRecordId, 'sourceRecordId');
        const targetRecordId = this.requiredIdentifier(input.targetRecordId, 'targetRecordId');
        const kind = this.requiredIdentifier(input.kind, 'kind');
        try {
            this.kinds.assert(kind);
        }
        catch (error) {
            throw new BadRequestException(error instanceof Error
                ? error.message
                : 'Omni relation kind is invalid.');
        }
        const records = await recordRepository.find({
            where: [
                { scopeId: this.scopeId, guid: sourceRecordId, deletedAt: IsNull() },
                { scopeId: this.scopeId, guid: targetRecordId, deletedAt: IsNull() },
            ],
        });
        const source = records.find((record) => record.guid === sourceRecordId);
        const target = records.find((record) => record.guid === targetRecordId);
        if (!source || !target)
            this.notFound();
        this.assertEndpointKinds(source, target);
        const isCanonical = canonicalOmniRelationKinds.includes(kind);
        if (isCanonical &&
            !isAllowedOmniRelation({
                sourceKind: source.kind,
                targetKind: target.kind,
                relationKind: kind,
            })) {
            throw new BadRequestException('Omni relation kind is not valid for these endpoint kinds.');
        }
    }
    assertEndpointKinds(_source, _target) { }
    requiredIdentifier(value, field) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new BadRequestException(`Omni relation ${field} must be a non-empty string.`);
        }
        return value;
    }
}
//# sourceMappingURL=omni-relation.service.js.map