import { OmniDocumentKind } from './omni-document-kind.enum.js';
import { OmniScopedService } from './omni-scoped.service.js';
export class OmniDocumentService extends OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'tombstone') {
        super(repository, scopeOrRepositoryWrite, deletion);
    }
    normalizeDocumentInput(input) {
        return {
            ...input,
            kind: OmniDocumentKind.Document,
        };
    }
    async createEntity(input, findOptions, returnEntity = true) {
        return super.createEntity(this.normalizeDocumentInput(input), findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        return super.updateEntity(conditions, this.normalizeDocumentInput(input), findOptions, returnEntity);
    }
}
//# sourceMappingURL=omni-document.service.js.map