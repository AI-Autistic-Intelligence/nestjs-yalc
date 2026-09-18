"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniCollectionService = void 0;
const omni_collection_kind_enum_js_1 = require("./omni-collection-kind.enum.js");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
class OmniCollectionService extends omni_scoped_service_js_1.OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'tombstone') {
        super(repository, scopeOrRepositoryWrite, deletion);
    }
    normalizeCollectionInput(input) {
        return {
            ...input,
            kind: omni_collection_kind_enum_js_1.OmniCollectionKind.Collection,
        };
    }
    async createEntity(input, findOptions, returnEntity = true) {
        return super.createEntity(this.normalizeCollectionInput(input), findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        return super.updateEntity(conditions, this.normalizeCollectionInput(input), findOptions, returnEntity);
    }
}
exports.OmniCollectionService = OmniCollectionService;
//# sourceMappingURL=omni-collection.service.js.map