"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniDocumentService = void 0;
const omni_document_kind_enum_js_1 = require("./omni-document-kind.enum.js");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
class OmniDocumentService extends omni_scoped_service_js_1.OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'tombstone') {
        super(repository, scopeOrRepositoryWrite, deletion);
    }
    normalizeDocumentInput(input) {
        return {
            ...input,
            kind: omni_document_kind_enum_js_1.OmniDocumentKind.Document,
        };
    }
    async createEntity(input, findOptions, returnEntity = true) {
        return super.createEntity(this.normalizeDocumentInput(input), findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        return super.updateEntity(conditions, this.normalizeDocumentInput(input), findOptions, returnEntity);
    }
}
exports.OmniDocumentService = OmniDocumentService;
//# sourceMappingURL=omni-document.service.js.map