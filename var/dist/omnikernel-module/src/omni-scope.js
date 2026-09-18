"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniScopeContext = exports.defaultOmniDeletionPolicies = exports.OMNI_KERNEL_OPTIONS = void 0;
exports.normalizeOmniKernelRegistrationOptions = normalizeOmniKernelRegistrationOptions;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.OMNI_KERNEL_OPTIONS = Symbol('OMNI_KERNEL_OPTIONS');
exports.defaultOmniDeletionPolicies = {
    named: 'hard',
    record: 'tombstone',
    document: 'tombstone',
    collection: 'tombstone',
    relation: 'hard',
    externalRef: 'hard',
};
function normalizeOmniDeletionPolicies(deletion) {
    const knownResources = new Set(Object.keys(exports.defaultOmniDeletionPolicies));
    for (const [resource, policy] of Object.entries(deletion ?? {})) {
        if (!knownResources.has(resource)) {
            throw new TypeError(`Unknown OmniKernel deletion policy resource: ${resource}.`);
        }
        if (policy !== 'hard' && policy !== 'tombstone') {
            throw new TypeError(`OmniKernel deletion policy for ${resource} must be hard or tombstone.`);
        }
    }
    return {
        ...exports.defaultOmniDeletionPolicies,
        ...deletion,
    };
}
function normalizeOmniKernelRegistrationOptions(options) {
    const candidate = typeof options === 'string' ? { dbConnection: options } : options;
    if (!candidate.dbConnection) {
        throw new TypeError('OmniKernelModule requires a database connection name.');
    }
    if (candidate.defaultScopeId !== undefined &&
        (candidate.defaultScopeId.trim().length === 0 ||
            candidate.defaultScopeId.length > 64)) {
        throw new TypeError('OmniKernel defaultScopeId must be 1-64 characters.');
    }
    const reservedRecordKinds = candidate.reservedRecordKinds ?? [];
    if (!Array.isArray(reservedRecordKinds) ||
        reservedRecordKinds.some((kind) => typeof kind !== 'string' ||
            kind.trim().length === 0 ||
            kind.length > 64) ||
        new Set(reservedRecordKinds).size !== reservedRecordKinds.length) {
        throw new TypeError('OmniKernel reservedRecordKinds must be unique 1-64 character strings.');
    }
    return {
        ...candidate,
        defaultScopeId: candidate.defaultScopeId ?? 'default',
        relationKinds: candidate.relationKinds ?? [],
        reservedRecordKinds: Object.freeze([...reservedRecordKinds]),
        deletion: normalizeOmniDeletionPolicies(candidate.deletion),
    };
}
let OmniScopeContext = class OmniScopeContext {
    constructor(request, options) {
        const requestForResolver = request?.req ?? request;
        const scopeId = options.resolveScope
            ? options.resolveScope(requestForResolver)
            : options.defaultScopeId;
        if (!scopeId || scopeId.trim().length === 0 || scopeId.length > 64) {
            throw new TypeError('Omni scope context is unavailable.');
        }
        this.scopeId = scopeId;
    }
    cacheKey(key) {
        return `${this.scopeId}:${key}`;
    }
};
exports.OmniScopeContext = OmniScopeContext;
exports.OmniScopeContext = OmniScopeContext = tslib_1.__decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    tslib_1.__param(0, (0, common_1.Inject)(core_1.REQUEST)),
    tslib_1.__param(1, (0, common_1.Inject)(exports.OMNI_KERNEL_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, void 0])
], OmniScopeContext);
//# sourceMappingURL=omni-scope.js.map