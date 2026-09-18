"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniDocumentBackendProvidersFactory = void 0;
const omni_document_entity_js_1 = require("./omni-document.entity.js");
const omni_document_service_js_1 = require("./omni-document.service.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omniDocumentBackendProvidersFactory = (dbConnection) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_document_entity_js_1.OmniDocumentEntity,
    dbConnection,
    serviceToken: (0, omni_scoped_backend_js_1.omniBackendServiceToken)(omni_document_service_js_1.OmniDocumentService),
    serviceProvider: omni_document_service_js_1.OmniDocumentService,
    createService: (repository, scope, options) => new omni_document_service_js_1.OmniDocumentService(repository, scope, options.deletion.document),
});
exports.omniDocumentBackendProvidersFactory = omniDocumentBackendProvidersFactory;
//# sourceMappingURL=omni-document.backend.js.map