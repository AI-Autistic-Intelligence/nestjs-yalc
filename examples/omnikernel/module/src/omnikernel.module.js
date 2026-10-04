var OmniKernelModule_1;
import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmniExternalRefEntity } from './base/omni-external-ref.entity.js';
import { OmniNamedEntity } from './base/omni-named.entity.js';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniRelationEntity } from './base/omni-relation.entity.js';
import { OmniCollectionEntity } from './omni-collection.entity.js';
import { omniCollectionBackendProvidersFactory } from './omni-collection.backend.js';
import { OmniDocumentEntity } from './omni-document.entity.js';
import { omniDocumentBackendProvidersFactory } from './omni-document.backend.js';
import { omniExternalRefBackendProvidersFactory } from './omni-external-ref.backend.js';
import { omniNamedBackendProvidersFactory } from './omni-named.backend.js';
import { omniRecordBackendProvidersFactory } from './omni-record.backend.js';
import { omniRelationBackendProvidersFactory } from './omni-relation.backend.js';
import { OmniKernelQueryService, omniKernelQueryServiceProviderFactory, } from './omnikernel.query.service.js';
import { OMNI_KERNEL_OPTIONS, OmniScopeContext, normalizeOmniKernelRegistrationOptions, } from './omni-scope.js';
let OmniKernelModule = OmniKernelModule_1 = class OmniKernelModule {
    static register(registration) {
        const options = normalizeOmniKernelRegistrationOptions(registration);
        const { dbConnection } = options;
        const omniNamedProviders = omniNamedBackendProvidersFactory(dbConnection).providers;
        const omniRecordProviders = omniRecordBackendProvidersFactory(dbConnection, options.reservedRecordKinds).providers;
        const omniRelationProviders = omniRelationBackendProvidersFactory(dbConnection).providers;
        const omniCollectionProviders = omniCollectionBackendProvidersFactory(dbConnection).providers;
        const omniDocumentProviders = omniDocumentBackendProvidersFactory(dbConnection).providers;
        const omniExternalRefProviders = omniExternalRefBackendProvidersFactory(dbConnection).providers;
        const omniKernelQueryServiceProvider = omniKernelQueryServiceProviderFactory(dbConnection);
        const eventEmitter = new EventEmitter2();
        return {
            module: OmniKernelModule_1,
            imports: [
                TypeOrmModule.forFeature([
                    OmniNamedEntity,
                    OmniRecordEntity,
                    OmniRelationEntity,
                    OmniCollectionEntity,
                    OmniDocumentEntity,
                    OmniExternalRefEntity,
                ], dbConnection),
            ],
            providers: [
                { provide: OMNI_KERNEL_OPTIONS, useValue: options },
                OmniScopeContext,
                {
                    provide: EventEmitter2,
                    useValue: eventEmitter,
                },
                ...omniNamedProviders,
                ...omniRecordProviders,
                ...omniRelationProviders,
                ...omniCollectionProviders,
                ...omniDocumentProviders,
                ...omniExternalRefProviders,
                omniKernelQueryServiceProvider,
            ],
            exports: [
                OMNI_KERNEL_OPTIONS,
                OmniScopeContext,
                EventEmitter2,
                ...omniNamedProviders,
                ...omniRecordProviders,
                ...omniRelationProviders,
                ...omniCollectionProviders,
                ...omniDocumentProviders,
                ...omniExternalRefProviders,
                omniKernelQueryServiceProvider,
                OmniKernelQueryService,
            ],
        };
    }
};
OmniKernelModule = OmniKernelModule_1 = __decorate([
    Module({})
], OmniKernelModule);
export { OmniKernelModule };
//# sourceMappingURL=omnikernel.module.js.map