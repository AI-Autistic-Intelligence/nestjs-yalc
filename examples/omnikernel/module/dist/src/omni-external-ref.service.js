"use strict";
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
                account: account ?? '',
                container: container ?? '',
            },
        });
    }
    async findForInternalRecord(internalType, internalId, provider) {
        return this.getRepository().find({
            where: {
                scopeId: this.scopeId,
                internalType,
                internalId,
                ...(provider ? { provider } : {}),
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }
    async upsertExternalRef(input) {
        if (input.provider.trim().length === 0) {
            throw new Error('OmniExternalRef.provider is required');
        }
        if (input.externalId.trim().length === 0) {
            throw new Error('OmniExternalRef.externalId is required');
        }
        const existing = await this.findByExternalIdentity({
            provider: input.provider,
            externalId: input.externalId,
            account: input.account ?? null,
            container: input.container ?? null,
        });
        if (existing) {
            if (existing.internalType !== input.internalType ||
                existing.internalId !== input.internalId) {
                throw new common_1.ConflictException('External reference binding is immutable after creation.');
            }
            const { internalType: _internalType, internalId: _internalId, ...update } = this.normalizeExternalIdentity(input);
            return this.updateEntity({ guid: existing.guid }, update);
        }
        return this.createEntity(this.normalizeExternalIdentity(input));
    }
    async syncDocumentReference(internalId, input) {
        return this.upsertExternalRef({
            ...input,
            internalType: omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Document,
            internalId,
        });
    }
    async syncCollectionReference(internalId, input) {
        return this.upsertExternalRef({
            ...input,
            internalType: omni_external_ref_internal_type_enum_js_1.OmniExternalRefInternalType.Collection,
            internalId,
        });
    }
    async createEntity(input, findOptions, returnEntity = true) {
        const normalized = this.normalizeExternalIdentity(input);
        this.rejectServerFields(normalized);
        await this.assertBinding(normalized);
        if (typeof normalized.provider === 'string' &&
            typeof normalized.externalId === 'string') {
            const existing = await this.findByExternalIdentity({
                provider: normalized.provider,
                externalId: normalized.externalId,
                account: normalized.account ?? null,
                container: normalized.container ?? null,
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
        return {
            ...input,
            ...(Object.prototype.hasOwnProperty.call(input, 'account')
                ? { account: input.account ?? '' }
                : {}),
            ...(Object.prototype.hasOwnProperty.call(input, 'container')
                ? { container: input.container ?? '' }
                : {}),
        };
    }
}
exports.OmniExternalRefService = OmniExternalRefService;
//# sourceMappingURL=omni-external-ref.service.js.map