"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniScopedService = void 0;
const common_1 = require("@nestjs/common");
const crud_gen_enum_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.enum.js");
const generic_service_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service.js");
const typeorm_1 = require("typeorm");
function hasOwn(input, key) {
    return Object.prototype.hasOwnProperty.call(input, key);
}
class OmniScopedService extends generic_service_js_1.GenericService {
    constructor(repository, scopeOrRepositoryWrite, deletion = 'hard') {
        const scope = isOmniScope(scopeOrRepositoryWrite)
            ? scopeOrRepositoryWrite
            : defaultOmniScope;
        super(repository, isOmniScope(scopeOrRepositoryWrite) ? undefined : scopeOrRepositoryWrite);
        this.deletion = deletion;
        this.scope = scope;
    }
    get scopeId() {
        return this.scope.scopeId;
    }
    scopedConditions(conditions) {
        this.rejectClientScope(conditions);
        return {
            ...conditions,
            scopeId: this.scopeId,
            ...(this.deletion === 'tombstone' ? { deletedAt: (0, typeorm_1.IsNull)() } : {}),
        };
    }
    async getEntity(conditions, fields, relations, databaseName, options) {
        const entity = await super.getEntity(this.scopedWhere(conditions), fields, relations, databaseName, { failOnNull: false });
        if (!entity && options?.failOnNull)
            this.notFound();
        return entity;
    }
    async getEntityListExtended(findOptions = {}, withCount = false, relations, databaseName) {
        const scopedOptions = this.scopeFindOptions(findOptions);
        if (withCount) {
            return super.getEntityListExtended(scopedOptions, true, relations, databaseName);
        }
        return super.getEntityListExtended(scopedOptions, false, relations, databaseName);
    }
    scopeFindOptions(findOptions) {
        this.rejectScopeInWhere(findOptions.where);
        const userWhere = findOptions.where;
        const filters = {};
        filters.scopeId = this.scopeId;
        if (this.deletion === 'tombstone')
            filters.deletedAt = (0, typeorm_1.IsNull)();
        const where = {
            operator: crud_gen_enum_js_1.Operators.AND,
            filters,
            ...(userWhere ? { childExpressions: [userWhere] } : {}),
        };
        return {
            ...findOptions,
            where,
            ...(findOptions.subQueryFilters
                ? {
                    subQueryFilters: this.scopeFindOptions(findOptions.subQueryFilters),
                }
                : {}),
        };
    }
    async createEntity(input, findOptions, returnEntity = true) {
        this.rejectServerFields(input);
        this.validatePayloadContract(input);
        return super.createEntity({ ...input, scopeId: this.scopeId }, findOptions, returnEntity);
    }
    async updateEntity(conditions, input, findOptions, returnEntity = true) {
        this.rejectServerFields(input);
        this.validatePayloadContract(input);
        if (hasOwn(input, 'guid')) {
            throw new common_1.BadRequestException('guid is immutable.');
        }
        return super.updateEntity(this.scopedConditions(conditions), { ...input, scopeId: this.scopeId }, findOptions, returnEntity);
    }
    async deleteEntity(conditions) {
        const scoped = this.scopedConditions(conditions);
        if (this.deletion === 'hard') {
            return super.deleteEntity(scoped);
        }
        const result = await this.getRepository().update(scoped, {
            deletedAt: new Date(),
        });
        if (!result.affected)
            this.notFound();
        return true;
    }
    rejectServerFields(input) {
        for (const field of ['scopeId', 'revision', 'deletedAt']) {
            if (hasOwn(input, field)) {
                throw new common_1.BadRequestException(`${field} is server-owned.`);
            }
        }
    }
    rejectClientScope(input) {
        if (hasOwn(input, 'scopeId')) {
            throw new common_1.BadRequestException('scopeId is derived from server context.');
        }
    }
    validatePayloadContract(input) {
        const candidate = input;
        if (hasOwn(candidate, 'payload') &&
            candidate.payload !== null &&
            (typeof candidate.payload !== 'object' ||
                Array.isArray(candidate.payload))) {
            throw new common_1.BadRequestException('payload must be a JSON object or null.');
        }
        const hasSchemaId = hasOwn(candidate, 'payloadSchemaId');
        const hasSchemaVersion = hasOwn(candidate, 'payloadSchemaVersion');
        if (hasSchemaId !== hasSchemaVersion) {
            throw new common_1.BadRequestException('payloadSchemaId and payloadSchemaVersion must be supplied together.');
        }
        if (!hasSchemaId)
            return;
        if (typeof candidate.payloadSchemaId !== 'string' ||
            candidate.payloadSchemaId.trim().length === 0 ||
            candidate.payloadSchemaId.length > 128) {
            throw new common_1.BadRequestException('payloadSchemaId must be a non-empty string.');
        }
        if (typeof candidate.payloadSchemaVersion !== 'number' ||
            !Number.isInteger(candidate.payloadSchemaVersion) ||
            candidate.payloadSchemaVersion < 1 ||
            candidate.payloadSchemaVersion > 2_147_483_647) {
            throw new common_1.BadRequestException('payloadSchemaVersion must be a positive signed 32-bit integer.');
        }
    }
    notFound() {
        throw new common_1.NotFoundException('Omni resource was not found in this scope.');
    }
    scopedWhere(where) {
        if (typeof where === 'string') {
            throw new common_1.BadRequestException('String where clauses are not supported for scoped Omni resources.');
        }
        if (Array.isArray(where)) {
            return where.map((condition) => this.scopedConditions(condition));
        }
        return this.scopedConditions(where);
    }
    rejectScopeInWhere(where) {
        if (!where || typeof where !== 'object')
            return;
        if (Array.isArray(where)) {
            where.forEach((item) => this.rejectScopeInWhere(item));
            return;
        }
        const candidate = where;
        if (hasOwn(candidate, 'scopeId'))
            this.rejectClientScope(candidate);
        if (candidate.filters && typeof candidate.filters === 'object') {
            this.rejectScopeInWhere(candidate.filters);
        }
        if (Array.isArray(candidate.childExpressions)) {
            candidate.childExpressions.forEach((item) => this.rejectScopeInWhere(item));
        }
    }
}
exports.OmniScopedService = OmniScopedService;
function isOmniScope(value) {
    return (!!value &&
        typeof value === 'object' &&
        typeof value.scopeId === 'string' &&
        typeof value.cacheKey === 'function');
}
const defaultOmniScope = {
    scopeId: 'default',
    cacheKey: (key) => `default:${key}`,
};
//# sourceMappingURL=omni-scoped.service.js.map