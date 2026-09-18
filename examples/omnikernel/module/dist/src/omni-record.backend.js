"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniRecordBackendProvidersFactory = void 0;
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omni_record_service_js_1 = require("./omni-record.service.js");
const omniRecordBackendProvidersFactory = (dbConnection, reservedRecordKinds = []) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_record_entity_js_1.OmniRecordEntity,
    dbConnection,
    createService: (repository, scope, options) => new omni_record_service_js_1.OmniRecordService(repository, scope, options.deletion.record, reservedRecordKinds),
});
exports.omniRecordBackendProvidersFactory = omniRecordBackendProvidersFactory;
//# sourceMappingURL=omni-record.backend.js.map