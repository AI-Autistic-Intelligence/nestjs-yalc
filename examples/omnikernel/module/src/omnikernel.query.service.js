"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniKernelQueryServiceProviderFactory = exports.OmniKernelQueryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const omni_external_ref_entity_js_1 = require("./base/omni-external-ref.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_external_ref_internal_type_enum_js_1 = require("./omni-external-ref-internal-type.enum.js");
const omni_relation_kind_enum_js_1 = require("./omni-relation-kind.enum.js");
const omni_relation_status_enum_js_1 = require("./omni-relation-status.enum.js");
const omni_relation_semantics_js_1 = require("./omni-relation-semantics.js");
const omni_scope_js_1 = require("./omni-scope.js");
const defaultQueryScope = {
    scopeId: 'default',
    cacheKey: (key) => `default:${key}`,
};
class OmniKernelQueryService {
    constructor(relationRepository, externalRefRepository, scope = defaultQueryScope) {
        this.relationRepository = relationRepository;
        this.externalRefRepository = externalRefRepository;
        this.scope = scope;
    }
    async getCollectionMembers(collectionId) {
        const relations = await this.relationRepository.find({
            where: {
                scopeId: this.scope.scopeId,
                sourceRecordId: collectionId,
                kind: omni_relation_kind_enum_js_1.OmniRelationKind.Contains,
                status: omni_relation_status_enum_js_1.OmniRelationStatus.Active,
            },
            relations: {
                targetRecord: true,
            },
            order: {
                createdAt: 'ASC',
            },
        });
        return relations.map((relation) => relation.targetRecord);
    }
    async getDocumentCollections(documentId) {
        const relations = await this.relationRepository.find({
            where: {
                scopeId: this.scope.scopeId,
                targetRecordId: documentId,
                kind: omni_relation_kind_enum_js_1.OmniRelationKind.Contains,
                status: omni_relation_status_enum_js_1.OmniRelationStatus.Active,
            },
            relations: {
                sourceRecord: true,
            },
            order: {
                createdAt: 'ASC',
            },
        });
        return relations
            .map((relation) => relation.sourceRecord)
            .filter((record) => !!record && (0, omni_relation_semantics_js_1.isOmniCollectionRecordKind)(record.kind));
    }
    async getDocumentExternalRefs(documentId, provider) {
        return this.externalRefRepository.find({
            where: Object.assign({ scopeId: this.scope.scopeId, internalType: omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Document, internalId: documentId }, (provider ? { provider } : {})),
            order: {
                createdAt: 'ASC',
            },
        });
    }
}
exports.OmniKernelQueryService = OmniKernelQueryService;
const omniKernelQueryServiceProviderFactory = (dbConnection) => ({
    provide: OmniKernelQueryService,
    scope: common_1.Scope.REQUEST,
    useFactory: (relationRepository, externalRefRepository, scope) => new OmniKernelQueryService(relationRepository, externalRefRepository, scope),
    inject: [
        (0, typeorm_1.getRepositoryToken)(omni_relation_entity_js_1.OmniRelationEntity, dbConnection),
        (0, typeorm_1.getRepositoryToken)(omni_external_ref_entity_js_1.OmniExternalRefEntity, dbConnection),
        omni_scope_js_1.OmniScopeContext,
    ],
});
exports.omniKernelQueryServiceProviderFactory = omniKernelQueryServiceProviderFactory;
//# sourceMappingURL=omnikernel.query.service.js.map