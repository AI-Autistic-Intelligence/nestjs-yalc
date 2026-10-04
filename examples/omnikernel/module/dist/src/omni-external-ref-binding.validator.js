import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
export class OmniExternalRefBindingValidator {
    constructor(recordRepository, scope) {
        this.recordRepository = recordRepository;
        this.scope = scope;
    }
    async assertTarget(binding) {
        if (binding.internalType !== OmniExternalRefInternalType.Record) {
            throw new BadRequestException('Omni external record binding must declare internalType record.');
        }
        if (typeof binding.internalId !== 'string' ||
            binding.internalId.trim().length === 0) {
            throw new BadRequestException('Omni external reference internalId must be a non-empty record identity.');
        }
        const record = await this.recordRepository.findOne({
            where: {
                scopeId: this.scope.scopeId,
                guid: binding.internalId,
                deletedAt: IsNull(),
            },
        });
        if (!record) {
            throw new NotFoundException('Omni external reference target was not found in this scope.');
        }
        return record;
    }
}
//# sourceMappingURL=omni-external-ref-binding.validator.js.map