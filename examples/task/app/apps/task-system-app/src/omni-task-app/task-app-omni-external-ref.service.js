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
exports.TaskAppOmniExternalRefService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_manager_1 = require("@nest-yalc-2/event-manager");
const omnikernel_module_1 = require("@nest-yalc-2/omnikernel-module");
const typeorm_2 = require("typeorm");
const task_app_omni_mapper_1 = require("./task-app-omni.mapper");
let TaskAppOmniExternalRefService = class TaskAppOmniExternalRefService {
    constructor(recordRepository, collectionRepository, externalRefRepository, events, mapper) {
        this.recordRepository = recordRepository;
        this.collectionRepository = collectionRepository;
        this.externalRefRepository = externalRefRepository;
        this.events = events;
        this.mapper = mapper;
    }
    supportsStructuredGraphqlFilters() {
        return false;
    }
    async list(query) {
        const { skip, startRow, take } = this.mapper.parsePageQuery(query);
        const internalType = query.internalType
            ? this.mapper.mapTaskExternalRefInternalType(query.internalType)
            : undefined;
        if (query.internalId && internalType) {
            const refs = await this.externalRefRepository.find({
                where: Object.assign({ internalType, internalId: query.internalId }, (query.provider ? { provider: query.provider } : {})),
                order: {
                    createdAt: 'ASC',
                },
            });
            const pagedRefs = refs.slice(skip, skip + take);
            return this.mapper.buildPage(pagedRefs.map((ref) => this.mapper.mapOmniExternalRefToTask(ref)), startRow, refs.length);
        }
        const [refs, count] = await this.externalRefRepository.findAndCount({
            order: {
                createdAt: 'ASC',
            },
            skip,
            take,
            where: Object.assign(Object.assign(Object.assign({}, (query.internalId ? { internalId: query.internalId } : {})), (internalType ? { internalType } : {})), (query.provider ? { provider: query.provider } : {})),
        });
        return this.mapper.buildPage(refs.map((ref) => this.mapper.mapOmniExternalRefToTask(ref)), startRow, count);
    }
    async getById(guid) {
        return this.getTaskExternalRefOrFail(guid);
    }
    async create(input) {
        return this.createEntity(input);
    }
    async update(guid, input) {
        return this.updateEntity({ guid }, input);
    }
    async delete(guid) {
        await this.deleteEntity({ guid });
        return { deleted: true };
    }
    async getEntity(where, _fields, _relations, _databaseName, options) {
        const ref = await this.externalRefRepository.findOne({
            where: this.mapCrudGenWhereToOmniWhere(where),
        });
        if (!ref) {
            if (options === null || options === void 0 ? void 0 : options.failOnNull) {
                throw this.events.errorNotFound('sync.omni.external-ref.not-found', {
                    data: {
                        conditions: where,
                    },
                    response: {
                        message: 'External reference not found',
                    },
                });
            }
            return null;
        }
        return this.mapper.mapOmniExternalRefToTask(ref);
    }
    async getEntityListExtended(findOptions, withCount = false) {
        var _a, _b;
        const skip = (_a = findOptions.skip) !== null && _a !== void 0 ? _a : 0;
        const take = findOptions.take;
        const refs = await this.externalRefRepository.find({
            order: (_b = findOptions.order) !== null && _b !== void 0 ? _b : { createdAt: 'ASC' },
            skip,
            take,
            where: this.mapCrudGenWhereToOmniWhere(findOptions.where),
        });
        if (!withCount) {
            return refs.map((ref) => this.mapper.mapOmniExternalRefToTask(ref));
        }
        const count = await this.externalRefRepository.count({
            where: this.mapCrudGenWhereToOmniWhere(findOptions.where),
        });
        return [
            refs.map((ref) => this.mapper.mapOmniExternalRefToTask(ref)),
            count,
        ];
    }
    async createEntity(input, _findOptions, returnEntity = true) {
        var _a, _b, _c;
        this.validateExternalRefInput(input);
        await this.ensureInternalTargetExists(this.mapper.mapTaskExternalRefInternalType(input.internalType), input.internalId);
        const existing = await this.externalRefRepository.findOne({
            where: {
                provider: input.provider,
                externalId: input.externalId,
                account: (_a = input.account) !== null && _a !== void 0 ? _a : null,
                container: (_b = input.container) !== null && _b !== void 0 ? _b : null,
            },
        });
        const entity = this.externalRefRepository.create(Object.assign(Object.assign({}, this.mapper.mapExternalRefToOmniExternalRef(input)), { guid: (_c = existing === null || existing === void 0 ? void 0 : existing.guid) !== null && _c !== void 0 ? _c : input.guid }));
        const storedRef = await this.externalRefRepository.save(entity);
        if (!returnEntity) {
            return true;
        }
        return this.getTaskExternalRefOrFail(storedRef.guid);
    }
    async updateEntity(conditions, input, _findOptions, returnEntity = true) {
        var _a, _b, _c, _d, _e, _f;
        const guid = this.requireGuid(conditions);
        const current = await this.getTaskExternalRefOrFail(guid);
        const merged = {
            account: input.account !== undefined ? input.account : ((_a = current.account) !== null && _a !== void 0 ? _a : null),
            container: input.container !== undefined
                ? input.container
                : ((_b = current.container) !== null && _b !== void 0 ? _b : null),
            externalId: (_c = input.externalId) !== null && _c !== void 0 ? _c : current.externalId,
            guid,
            internalId: (_d = input.internalId) !== null && _d !== void 0 ? _d : current.internalId,
            internalType: (_e = input.internalType) !== null && _e !== void 0 ? _e : current.internalType,
            provider: (_f = input.provider) !== null && _f !== void 0 ? _f : current.provider,
        };
        await this.ensureInternalTargetExists(this.mapper.mapTaskExternalRefInternalType(merged.internalType), merged.internalId);
        await this.externalRefRepository.update({ guid }, this.mapper.mapExternalRefToOmniExternalRef(merged));
        if (!returnEntity) {
            return true;
        }
        return this.getTaskExternalRefOrFail(guid);
    }
    async deleteEntity(conditions) {
        const guid = this.requireGuid(conditions);
        await this.getExternalRefOrFail(guid);
        await this.externalRefRepository.delete({ guid });
        return true;
    }
    validateExternalRefInput(input) {
        var _a, _b, _c, _d;
        if (!input.guid ||
            !input.internalId ||
            !input.provider ||
            !input.externalId) {
            throw this.events.errorBadRequest('sync.omni.external-ref.invalid', {
                data: {
                    externalId: (_a = input.externalId) !== null && _a !== void 0 ? _a : null,
                    guid: (_b = input.guid) !== null && _b !== void 0 ? _b : null,
                    internalId: (_c = input.internalId) !== null && _c !== void 0 ? _c : null,
                    provider: (_d = input.provider) !== null && _d !== void 0 ? _d : null,
                },
                response: {
                    message: 'External ref guid, internalId, provider, and externalId are required',
                },
            });
        }
    }
    async getExternalRefOrFail(guid) {
        const ref = await this.externalRefRepository.findOne({
            where: {
                guid,
            },
        });
        if (!ref) {
            throw this.events.errorNotFound('sync.omni.external-ref.not-found', {
                data: {
                    externalRefId: guid,
                },
                response: {
                    message: 'External reference not found',
                },
            });
        }
        return ref;
    }
    async getTaskExternalRefOrFail(guid) {
        const ref = await this.getExternalRefOrFail(guid);
        return this.mapper.mapOmniExternalRefToTask(ref);
    }
    mapCrudGenWhereToOmniWhere(where) {
        if (typeof where === 'string') {
            return {
                guid: where,
            };
        }
        if (Array.isArray(where)) {
            const [firstCondition] = where;
            return this.mapCrudGenWhereToOmniWhere(firstCondition);
        }
        const rawWhere = where && typeof where === 'object'
            ? this.mapper.extractCrudGenFilterMap(where)
            : where;
        if (!rawWhere) {
            return {};
        }
        const omniWhere = {};
        for (const [key, rawValue] of Object.entries(rawWhere)) {
            if (key === 'filters' || rawValue === undefined) {
                continue;
            }
            if (key === 'internalType') {
                omniWhere[key] = this.mapInternalTypeFilter(rawValue);
                continue;
            }
            omniWhere[key] = rawValue;
        }
        return omniWhere;
    }
    mapInternalTypeFilter(value) {
        if (value instanceof typeorm_2.FindOperator && Array.isArray(value.value)) {
            return (0, typeorm_2.In)(value.value.map((item) => this.mapper.mapTaskExternalRefInternalType(item)));
        }
        if (typeof value === 'string') {
            return this.mapper.mapTaskExternalRefInternalType(value);
        }
        return value;
    }
    requireGuid(conditions) {
        if (!conditions.guid) {
            throw this.events.errorBadRequest('sync.omni.external-ref.guid.required', {
                data: {
                    conditions,
                },
                response: {
                    message: 'TaskExternalRefCondition.guid is required',
                },
            });
        }
        return conditions.guid;
    }
    async ensureInternalTargetExists(internalType, internalId) {
        if (internalType === omnikernel_module_1.OmniExternalRefInternalType.Collection) {
            const collection = await this.collectionRepository.findOne({
                where: {
                    guid: internalId,
                },
            });
            if (collection) {
                return;
            }
        }
        if (internalType !== omnikernel_module_1.OmniExternalRefInternalType.Collection) {
            const record = await this.recordRepository.findOne({
                where: {
                    guid: internalId,
                },
            });
            if (record) {
                return;
            }
        }
        throw this.events.errorNotFound('sync.omni.external-ref.target.not-found', {
            data: {
                internalId,
                internalType,
            },
            response: {
                message: 'Referenced internal resource was not found',
            },
        });
    }
};
exports.TaskAppOmniExternalRefService = TaskAppOmniExternalRefService;
exports.TaskAppOmniExternalRefService = TaskAppOmniExternalRefService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRecordEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniCollectionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniExternalRefEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_manager_1.YalcEventService,
        task_app_omni_mapper_1.TaskAppOmniMapper])
], TaskAppOmniExternalRefService);
//# sourceMappingURL=task-app-omni-external-ref.service.js.map