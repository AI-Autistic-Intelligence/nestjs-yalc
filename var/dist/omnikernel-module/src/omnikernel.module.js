"use strict";
var OmniKernelModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniKernelModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const omni_external_ref_entity_js_1 = require("./base/omni-external-ref.entity.js");
const omni_named_entity_js_1 = require("./base/omni-named.entity.js");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_collection_entity_js_1 = require("./omni-collection.entity.js");
const omni_collection_backend_js_1 = require("./omni-collection.backend.js");
const omni_document_entity_js_1 = require("./omni-document.entity.js");
const omni_document_backend_js_1 = require("./omni-document.backend.js");
const omni_external_ref_backend_js_1 = require("./omni-external-ref.backend.js");
const omni_named_backend_js_1 = require("./omni-named.backend.js");
const omni_record_backend_js_1 = require("./omni-record.backend.js");
const omni_relation_backend_js_1 = require("./omni-relation.backend.js");
const omnikernel_query_service_js_1 = require("./omnikernel.query.service.js");
const omni_scope_js_1 = require("./omni-scope.js");
let OmniKernelModule = OmniKernelModule_1 = class OmniKernelModule {
    static register(registration) {
        const options = (0, omni_scope_js_1.normalizeOmniKernelRegistrationOptions)(registration);
        const { dbConnection } = options;
        const omniNamedProviders = (0, omni_named_backend_js_1.omniNamedBackendProvidersFactory)(dbConnection).providers;
        const omniRecordProviders = (0, omni_record_backend_js_1.omniRecordBackendProvidersFactory)(dbConnection, options.reservedRecordKinds).providers;
        const omniRelationProviders = (0, omni_relation_backend_js_1.omniRelationBackendProvidersFactory)(dbConnection).providers;
        const omniCollectionProviders = (0, omni_collection_backend_js_1.omniCollectionBackendProvidersFactory)(dbConnection).providers;
        const omniDocumentProviders = (0, omni_document_backend_js_1.omniDocumentBackendProvidersFactory)(dbConnection).providers;
        const omniExternalRefProviders = (0, omni_external_ref_backend_js_1.omniExternalRefBackendProvidersFactory)(dbConnection).providers;
        const omniKernelQueryServiceProvider = (0, omnikernel_query_service_js_1.omniKernelQueryServiceProviderFactory)(dbConnection);
        const eventEmitter = new event_emitter_1.EventEmitter2();
        return {
            module: OmniKernelModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    omni_named_entity_js_1.OmniNamedEntity,
                    omni_record_entity_js_1.OmniRecordEntity,
                    omni_relation_entity_js_1.OmniRelationEntity,
                    omni_collection_entity_js_1.OmniCollectionEntity,
                    omni_document_entity_js_1.OmniDocumentEntity,
                    omni_external_ref_entity_js_1.OmniExternalRefEntity,
                ], dbConnection),
            ],
            providers: [
                { provide: omni_scope_js_1.OMNI_KERNEL_OPTIONS, useValue: options },
                omni_scope_js_1.OmniScopeContext,
                {
                    provide: event_emitter_1.EventEmitter2,
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
                omni_scope_js_1.OMNI_KERNEL_OPTIONS,
                omni_scope_js_1.OmniScopeContext,
                event_emitter_1.EventEmitter2,
                ...omniNamedProviders,
                ...omniRecordProviders,
                ...omniRelationProviders,
                ...omniCollectionProviders,
                ...omniDocumentProviders,
                ...omniExternalRefProviders,
                omniKernelQueryServiceProvider,
                omnikernel_query_service_js_1.OmniKernelQueryService,
            ],
        };
    }
};
exports.OmniKernelModule = OmniKernelModule;
exports.OmniKernelModule = OmniKernelModule = OmniKernelModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], OmniKernelModule);
//# sourceMappingURL=omnikernel.module.js.map