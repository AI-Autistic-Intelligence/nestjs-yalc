import { Scope } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniExternalRefInternalType } from './omni-external-ref-internal-type.enum.js';
import { OmniRelationKind } from './omni-relation-kind.enum.js';
import { OmniRelationStatus } from './omni-relation-status.enum.js';
import { isOmniCollectionRecordKind } from './omni-relation-semantics.js';
import { OmniScopeContext } from './omni-scope.js';
const defaultQueryScope = {
    scopeId: 'default',
    cacheKey: (key) => `default:${key}`,
};
export class OmniKernelQueryService {
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
                kind: OmniRelationKind.Contains,
                status: OmniRelationStatus.Active,
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
                kind: OmniRelationKind.Contains,
                status: OmniRelationStatus.Active,
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
            .filter((record) => !!record && isOmniCollectionRecordKind(record.kind));
    }
    async getDocumentExternalRefs(documentId, provider) {
        return this.externalRefRepository.find({
            where: {
                scopeId: this.scope.scopeId,
                internalType: OmniExternalRefInternalType.Document,
                internalId: documentId,
                ...(provider ? { provider } : {}),
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }
}
export const omniKernelQueryServiceProviderFactory = (dbConnection) => ({
    provide: OmniKernelQueryService,
    scope: Scope.REQUEST,
    useFactory: (relationRepository, externalRefRepository, scope) => new OmniKernelQueryService(relationRepository, externalRefRepository, scope),
    inject: [
        getRepositoryToken(OmniRelationEntity, dbConnection),
        getRepositoryToken(OmniExternalRefEntity, dbConnection),
        OmniScopeContext,
    ],
});
//# sourceMappingURL=omnikernel.query.service.js.map