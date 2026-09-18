"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniCollectionBackendProvidersFactory = void 0;
const omni_collection_entity_js_1 = require("./omni-collection.entity.js");
const omni_collection_service_js_1 = require("./omni-collection.service.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omniCollectionBackendProvidersFactory = (dbConnection) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_collection_entity_js_1.OmniCollectionEntity,
    dbConnection,
    serviceToken: (0, omni_scoped_backend_js_1.omniBackendServiceToken)(omni_collection_service_js_1.OmniCollectionService),
    serviceProvider: omni_collection_service_js_1.OmniCollectionService,
    createService: (repository, scope, options) => new omni_collection_service_js_1.OmniCollectionService(repository, scope, options.deletion.collection),
});
exports.omniCollectionBackendProvidersFactory = omniCollectionBackendProvidersFactory;
//# sourceMappingURL=omni-collection.backend.js.map