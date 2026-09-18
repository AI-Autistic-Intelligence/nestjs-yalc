"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const omni_relation_kind_contract_js_1 = require("./omni-relation-kind.contract.js");
const omni_relation_semantics_js_1 = require("./omni-relation-semantics.js");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
class OmniRelationService extends omni_scoped_service_js_1.OmniScopedService {
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
                throw new common_1.BadRequestException(`Omni relation ${field} is immutable.`);
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
            throw new common_1.BadRequestException(error instanceof Error
                ? error.message
                : 'Omni relation kind is invalid.');
        }
        const records = await recordRepository.find({
            where: [
                { scopeId: this.scopeId, guid: sourceRecordId, deletedAt: (0, typeorm_1.IsNull)() },
                { scopeId: this.scopeId, guid: targetRecordId, deletedAt: (0, typeorm_1.IsNull)() },
            ],
        });
        const source = records.find((record) => record.guid === sourceRecordId);
        const target = records.find((record) => record.guid === targetRecordId);
        if (!source || !target)
            this.notFound();
        this.assertEndpointKinds(source, target);
        const isCanonical = omni_relation_kind_contract_js_1.canonicalOmniRelationKinds.includes(kind);
        if (isCanonical &&
            !(0, omni_relation_semantics_js_1.isAllowedOmniRelation)({
                sourceKind: source.kind,
                targetKind: target.kind,
                relationKind: kind,
            })) {
            throw new common_1.BadRequestException('Omni relation kind is not valid for these endpoint kinds.');
        }
    }
    assertEndpointKinds(_source, _target) { }
    requiredIdentifier(value, field) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new common_1.BadRequestException(`Omni relation ${field} must be a non-empty string.`);
        }
        return value;
    }
}
exports.OmniRelationService = OmniRelationService;
//# sourceMappingURL=omni-relation.service.js.map