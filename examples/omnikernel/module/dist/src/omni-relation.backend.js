"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniRelationBackendProvidersFactory = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_kind_contract_js_1 = require("./omni-relation-kind.contract.js");
const omni_relation_service_js_1 = require("./omni-relation.service.js");
const omni_scoped_backend_js_1 = require("./omni-scoped.backend.js");
const omniRelationBackendProvidersFactory = (dbConnection) => (0, omni_scoped_backend_js_1.omniScopedBackendProvidersFactory)({
    entityModel: omni_relation_entity_js_1.OmniRelationEntity,
    dbConnection,
    additionalInject: [(0, typeorm_1.getRepositoryToken)(omni_record_entity_js_1.OmniRecordEntity, dbConnection)],
    createService: (repository, scope, options, recordRepository) => new omni_relation_service_js_1.OmniRelationService(repository, scope, options.deletion.relation, recordRepository, (0, omni_relation_kind_contract_js_1.createOmniRelationKindContract)(options.relationKinds)),
});
exports.omniRelationBackendProvidersFactory = omniRelationBackendProvidersFactory;
//# sourceMappingURL=omni-relation.backend.js.map