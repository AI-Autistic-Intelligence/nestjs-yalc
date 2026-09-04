"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniScopeContext = exports.defaultOmniDeletionPolicies = exports.OMNI_KERNEL_OPTIONS = void 0;
exports.normalizeOmniKernelRegistrationOptions = normalizeOmniKernelRegistrationOptions;
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
    for (const [resource, policy] of Object.entries(deletion !== null && deletion !== void 0 ? deletion : {})) {
        if (!knownResources.has(resource)) {
            throw new TypeError(`Unknown OmniKernel deletion policy resource: ${resource}.`);
        }
        if (policy !== 'hard' && policy !== 'tombstone') {
            throw new TypeError(`OmniKernel deletion policy for ${resource} must be hard or tombstone.`);
        }
    }
    return Object.assign(Object.assign({}, exports.defaultOmniDeletionPolicies), deletion);
}
function normalizeOmniKernelRegistrationOptions(options) {
    var _a, _b, _c;
    const candidate = typeof options === 'string' ? { dbConnection: options } : options;
    if (!candidate.dbConnection) {
        throw new TypeError('OmniKernelModule requires a database connection name.');
    }
    if (candidate.defaultScopeId !== undefined &&
        (candidate.defaultScopeId.trim().length === 0 ||
            candidate.defaultScopeId.length > 64)) {
        throw new TypeError('OmniKernel defaultScopeId must be 1-64 characters.');
    }
    const reservedRecordKinds = (_a = candidate.reservedRecordKinds) !== null && _a !== void 0 ? _a : [];
    if (!Array.isArray(reservedRecordKinds) ||
        reservedRecordKinds.some((kind) => typeof kind !== 'string' ||
            kind.trim().length === 0 ||
            kind.length > 64) ||
        new Set(reservedRecordKinds).size !== reservedRecordKinds.length) {
        throw new TypeError('OmniKernel reservedRecordKinds must be unique 1-64 character strings.');
    }
    return Object.assign(Object.assign({}, candidate), { defaultScopeId: (_b = candidate.defaultScopeId) !== null && _b !== void 0 ? _b : 'default', relationKinds: (_c = candidate.relationKinds) !== null && _c !== void 0 ? _c : [], reservedRecordKinds: Object.freeze([...reservedRecordKinds]), deletion: normalizeOmniDeletionPolicies(candidate.deletion) });
}
let OmniScopeContext = class OmniScopeContext {
    constructor(request, options) {
        var _a;
        const requestForResolver = (_a = request === null || request === void 0 ? void 0 : request.req) !== null && _a !== void 0 ? _a : request;
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
exports.OmniScopeContext = OmniScopeContext = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, common_1.Inject)(exports.OMNI_KERNEL_OPTIONS)),
    __metadata("design:paramtypes", [Object, void 0])
], OmniScopeContext);
//# sourceMappingURL=omni-scope.js.map