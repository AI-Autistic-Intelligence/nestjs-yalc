import { OmniCollectionKind } from './omni-collection-kind.enum.js';
import { OmniScopedService } from './omni-scoped.service.js';
export class OmniCollectionService extends OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'tombstone') {
        super(repository, scopeOrRepositoryWrite, deletion);
    }
    normalizeCollectionInput(input) {
        return {
            ...input,
            kind: OmniCollectionKind.Collection,
        };
    }
    async createEntity(input, findOptions, returnEntity = true) {
        return super.createEntity(this.normalizeCollectionInput(input), findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        return super.updateEntity(conditions, this.normalizeCollectionInput(input), findOptions, returnEntity);
    }
}
//# sourceMappingURL=omni-collection.service.js.map