import { FactoryProvider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import { type OmniScope } from './omni-scope.js';
export declare class OmniKernelQueryService {
    protected relationRepository: Repository<OmniRelationEntity>;
    protected externalRefRepository: Repository<OmniExternalRefEntity>;
    protected readonly scope: OmniScope;
    constructor(relationRepository: Repository<OmniRelationEntity>, externalRefRepository: Repository<OmniExternalRefEntity>, scope?: OmniScope);
    getCollectionMembers(collectionId: string): Promise<OmniRecordEntity[]>;
    getDocumentCollections(documentId: string): Promise<OmniCollectionEntity[]>;
    getDocumentExternalRefs(documentId: string, provider?: string): Promise<OmniExternalRefEntity[]>;
}
export declare const omniKernelQueryServiceProviderFactory: (dbConnection: string) => FactoryProvider<OmniKernelQueryService>;
