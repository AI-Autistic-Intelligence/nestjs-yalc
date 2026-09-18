"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniScopedRepository = void 0;
class OmniScopedRepository {
    constructor(repository, scope) {
        this.repository = repository;
        this.scope = scope;
    }
    where(where = {}) {
        if ('scopeId' in where) {
            throw new TypeError('Omni scopeId is derived from server context.');
        }
        return {
            ...where,
            scopeId: this.scope.scopeId,
        };
    }
    findOneByGuid(guid) {
        return this.repository.findOne({ where: this.where({ guid }) });
    }
    find(where = {}) {
        return this.repository.find({ where: this.where(where) });
    }
}
exports.OmniScopedRepository = OmniScopedRepository;
//# sourceMappingURL=omni-scoped.repository.js.map