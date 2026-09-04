"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniExternalRefService = void 0;
const common_1 = require("@nestjs/common");
const omni_external_ref_internal_type_enum_js_1 = require("./omni-external-ref-internal-type.enum.js");
const omni_scoped_service_js_1 = require("./omni-scoped.service.js");
function hasOwn(input, key) {
    return Object.prototype.hasOwnProperty.call(input, key);
}
class OmniExternalRefService extends omni_scoped_service_js_1.OmniScopedService {
    constructor(repository, scopeOrRepositoryWrite, deletion, bindingValidator) {
        if (!bindingValidator) {
            throw new TypeError('OmniExternalRefService requires an OmniExternalRefBindingValidator.');
        }
        super(repository, scopeOrRepositoryWrite, deletion);
        this.bindingValidator = bindingValidator;
    }
    async findByExternalIdentity({ provider, externalId, account = null, container = null, }) {
        return this.getRepository().findOne({
            where: {
                scopeId: this.scopeId,
                provider,
                externalId,
                account: account !== null && account !== void 0 ? account : '',
                container: container !== null && container !== void 0 ? container : '',
            },
        });
    }
    async findForInternalRecord(internalType, internalId, provider) {
        return this.getRepository().find({
            where: Object.assign({ scopeId: this.scopeId, internalType,
                internalId }, (provider ? { provider } : {})),
            order: {
                createdAt: 'ASC',
            },
        });
    }
    async upsertExternalRef(input) {
        var _a, _b;
        if (input.provider.trim().length === 0) {
            throw new Error('OmniExternalRef.provider is required');
        }
        if (input.externalId.trim().length === 0) {
            throw new Error('OmniExternalRef.externalId is required');
        }
        const existing = await this.findByExternalIdentity({
            provider: input.provider,
            externalId: input.externalId,
            account: (_a = input.account) !== null && _a !== void 0 ? _a : null,
            container: (_b = input.container) !== null && _b !== void 0 ? _b : null,
        });
        if (existing) {
            if (existing.internalType !== input.internalType ||
                existing.internalId !== input.internalId) {
                throw new common_1.ConflictException('External reference binding is immutable after creation.');
            }
            const _c = this.normalizeExternalIdentity(input), { internalType: _internalType, internalId: _internalId } = _c, update = __rest(_c, ["internalType", "internalId"]);
            return this.updateEntity({ guid: existing.guid }, update);
        }
        return this.createEntity(this.normalizeExternalIdentity(input));
    }
    async syncDocumentReference(internalId, input) {
        return this.upsertExternalRef(Object.assign(Object.assign({}, input), { internalType: omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Document, internalId }));
    }
    async syncCollectionReference(internalId, input) {
        return this.upsertExternalRef(Object.assign(Object.assign({}, input), { internalType: omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Collection, internalId }));
    }
    async createEntity(input, findOptions, returnEntity = true) {
        var _a, _b;
        const normalized = this.normalizeExternalIdentity(input);
        this.rejectServerFields(normalized);
        await this.assertBinding(normalized);
        if (typeof normalized.provider === 'string' &&
            typeof normalized.externalId === 'string') {
            const existing = await this.findByExternalIdentity({
                provider: normalized.provider,
                externalId: normalized.externalId,
                account: (_a = normalized.account) !== null && _a !== void 0 ? _a : null,
                container: (_b = normalized.container) !== null && _b !== void 0 ? _b : null,
            });
            if (existing) {
                throw new common_1.ConflictException('External reference identity already exists in this scope.');
            }
        }
        return super.createEntity(normalized, findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        const normalized = this.normalizeExternalIdentity(input);
        this.rejectBindingMutation(normalized);
        return super.updateEntity(conditions, normalized, findOptions, returnEntity);
    }
    async assertBinding(input) {
        if (typeof input.internalId !== 'string' ||
            input.internalType === undefined) {
            throw new common_1.ConflictException('External reference binding requires internalType and internalId.');
        }
        if (input.internalType !== omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Record) {
            return;
        }
        await this.bindingValidator.assertTarget({
            internalId: input.internalId,
            internalType: input.internalType,
        });
    }
    rejectBindingMutation(input) {
        if (hasOwn(input, 'internalType') || hasOwn(input, 'internalId')) {
            throw new common_1.ConflictException('External reference binding is immutable after creation.');
        }
    }
    normalizeExternalIdentity(input) {
        var _a, _b;
        return Object.assign(Object.assign(Object.assign({}, input), (Object.prototype.hasOwnProperty.call(input, 'account')
            ? { account: (_a = input.account) !== null && _a !== void 0 ? _a : '' }
            : {})), (Object.prototype.hasOwnProperty.call(input, 'container')
            ? { container: (_b = input.container) !== null && _b !== void 0 ? _b : '' }
            : {}));
    }
}
exports.OmniExternalRefService = OmniExternalRefService;
//# sourceMappingURL=omni-external-ref.service.js.map