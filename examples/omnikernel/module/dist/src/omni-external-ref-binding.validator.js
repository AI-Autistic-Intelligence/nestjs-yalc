"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniExternalRefBindingValidator = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const omni_external_ref_internal_type_enum_js_1 = require("./omni-external-ref-internal-type.enum.js");
class OmniExternalRefBindingValidator {
    constructor(recordRepository, scope) {
        this.recordRepository = recordRepository;
        this.scope = scope;
    }
    async assertTarget(binding) {
        if (binding.internalType !== omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Record) {
            throw new common_1.BadRequestException('Omni external record binding must declare internalType record.');
        }
        if (typeof binding.internalId !== 'string' ||
            binding.internalId.trim().length === 0) {
            throw new common_1.BadRequestException('Omni external reference internalId must be a non-empty record identity.');
        }
        const record = await this.recordRepository.findOne({
            where: {
                scopeId: this.scope.scopeId,
                guid: binding.internalId,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        if (!record) {
            throw new common_1.NotFoundException('Omni external reference target was not found in this scope.');
        }
        return record;
    }
}
exports.OmniExternalRefBindingValidator = OmniExternalRefBindingValidator;
//# sourceMappingURL=omni-external-ref-binding.validator.js.map