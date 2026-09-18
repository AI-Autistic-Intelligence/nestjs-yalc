"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniExternalRefBackendProvidersFactory = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_external_ref_entity_js_1 = require("./base/omni-external-ref.entity.js");
const omni_external_ref_binding_validator_js_1 = require("./omni-external-ref-binding.validator.js");
const omni_external_ref_service_js_1 = require("./omni-external-ref.service.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omniExternalRefBackendProvidersFactory = (dbConnection) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_external_ref_entity_js_1.OmniExternalRefEntity,
    dbConnection,
    serviceToken: (0, omni_scoped_backend_js_1.omniBackendServiceToken)(omni_external_ref_service_js_1.OmniExternalRefService),
    serviceProvider: omni_external_ref_service_js_1.OmniExternalRefService,
    additionalInject: [(0, typeorm_1.getRepositoryToken)(omni_record_entity_js_1.OmniRecordEntity, dbConnection)],
    createService: (repository, scope, options, recordRepository) => new omni_external_ref_service_js_1.OmniExternalRefService(repository, scope, options.deletion.externalRef, new omni_external_ref_binding_validator_js_1.OmniExternalRefBindingValidator(recordRepository, scope)),
});
exports.omniExternalRefBackendProvidersFactory = omniExternalRefBackendProvidersFactory;
//# sourceMappingURL=omni-external-ref.backend.js.map