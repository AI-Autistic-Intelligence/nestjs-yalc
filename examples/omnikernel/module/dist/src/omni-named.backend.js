"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniNamedBackendProvidersFactory = void 0;
const omni_named_entity_js_1 = require("./base/omni-named.entity.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
const omniNamedBackendProvidersFactory = (dbConnection) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_named_entity_js_1.OmniNamedEntity,
    dbConnection,
    createService: (repository, scope, options) => new omni_scoped_service_js_1.OmniScopedService(repository, scope, options.deletion.named),
});
exports.omniNamedBackendProvidersFactory = omniNamedBackendProvidersFactory;
//# sourceMappingURL=omni-named.backend.js.map