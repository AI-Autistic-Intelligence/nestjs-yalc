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
exports.ProjectionSpikeRelationService = exports.ProjectionScopeContext = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
let ProjectionScopeContext = class ProjectionScopeContext {
    constructor(request) {
        var _a, _b;
        const scopeId = (_a = request.projectionScopeId) !== null && _a !== void 0 ? _a : (_b = request.req) === null || _b === void 0 ? void 0 : _b.projectionScopeId;
        if (!scopeId) {
            throw new Error('Projection scope context is unavailable.');
        }
        this.scopeId = scopeId;
    }
    cacheKey(key) {
        return `${this.scopeId}:${key}`;
    }
};
exports.ProjectionScopeContext = ProjectionScopeContext;
exports.ProjectionScopeContext = ProjectionScopeContext = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], ProjectionScopeContext);
function isFindOperator(value) {
    return (value instanceof typeorm_1.FindOperator ||
        (!!value &&
            typeof value === 'object' &&
            'type' in value &&
            'value' in value));
}
class ProjectionSpikeRelationService {
    constructor(repository, endpoints, scope, events, definition) {
        this.repository = repository;
        this.endpoints = endpoints;
        this.scope = scope;
        this.events = events;
        this.definition = definition;
    }
    supportsStructuredGraphqlFilters() {
        return true;
    }
    supportsExtendedRepository() {
        return true;
    }
    async getEntity(conditions, _fields, _relations, _databaseName, options) {
        const relation = await this.repository.findOne({
            where: {
                [this.definition.scope]: this.scope.scopeId,
                [this.definition.identity]: this.identity(conditions),
            },
        });
        if (!relation && (options === null || options === void 0 ? void 0 : options.failOnNull))
            this.notFound();
        return relation;
    }
    async getEntityListExtended(findOptions = {}, withCount = false) {
        var _a, _b;
        const where = {
            [this.definition.scope]: this.scope.scopeId,
        };
        const filter = (_b = (_a = findOptions.where) === null || _a === void 0 ? void 0 : _a.filters) === null || _b === void 0 ? void 0 : _b[this.definition.identity];
        if (isFindOperator(filter) && filter.type === 'in') {
            where[this.definition.identity] = (0, typeorm_1.In)(filter.value);
        }
        else if (typeof filter === 'string') {
            where[this.definition.identity] = filter;
        }
        const [relations, count] = await this.repository.findAndCount({
            where: where,
            order: { [this.definition.identity]: 'ASC' },
            skip: findOptions.skip,
            take: findOptions.take,
        });
        return withCount ? [relations, count] : relations;
    }
    async createEntity(input) {
        this.rejectUnknown(input, this.definition.fields);
        const source = this.requiredString(input, this.definition.source);
        const target = this.requiredString(input, this.definition.target);
        const count = await this.endpoints.count({
            where: [
                { [this.definition.scope]: this.scope.scopeId, guid: source },
                { [this.definition.scope]: this.scope.scopeId, guid: target },
            ],
        });
        if (count !== 2)
            this.notFound();
        return this.repository.save(this.repository.create(Object.assign({ [this.definition.scope]: this.scope.scopeId }, Object.fromEntries(this.definition.fields.map((field) => [
            field,
            this.requiredString(input, field),
        ])))));
    }
    async updateEntity(conditions, input) {
        this.rejectUnknown(input, this.definition.mutableFields);
        const updates = Object.fromEntries(this.definition.mutableFields.map((field) => [
            field,
            this.requiredString(input, field),
        ]));
        const result = await this.repository.update({
            [this.definition.scope]: this.scope.scopeId,
            [this.definition.identity]: this.identity(conditions),
        }, updates);
        if (!result.affected)
            this.notFound();
        return this.repository.findOneByOrFail({
            [this.definition.scope]: this.scope.scopeId,
            [this.definition.identity]: this.identity(conditions),
        });
    }
    async deleteEntity(conditions) {
        const result = await this.repository.delete({
            [this.definition.scope]: this.scope.scopeId,
            [this.definition.identity]: this.identity(conditions),
        });
        if (!result.affected)
            this.notFound();
        return true;
    }
    identity(conditions) {
        return this.requiredString(conditions, this.definition.identity);
    }
    requiredString(input, field) {
        if (typeof input[field] !== 'string' || input[field].length === 0) {
            throw this.events.errorBadRequest('scoped-relation.invalid-request', {
                response: { message: `${field} must be a non-empty string.` },
            });
        }
        return input[field];
    }
    rejectUnknown(input, allowed) {
        for (const key of Object.keys(input)) {
            if (!allowed.includes(key)) {
                throw this.events.errorBadRequest('scoped-relation.invalid-request', {
                    response: { message: `Relation field ${key} is not writable.` },
                });
            }
        }
    }
    notFound() {
        throw this.events.errorNotFound('scoped-relation.not-found', {
            response: { message: 'Relation endpoint is outside this scope.' },
        });
    }
}
exports.ProjectionSpikeRelationService = ProjectionSpikeRelationService;
//# sourceMappingURL=projection-spike.services.js.map