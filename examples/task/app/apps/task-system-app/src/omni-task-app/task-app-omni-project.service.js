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
exports.TaskAppOmniProjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
const typeorm_2 = require("typeorm");
const task_app_omni_mapper_1 = require("./task-app-omni.mapper");
let TaskAppOmniProjectService = class TaskAppOmniProjectService {
    constructor(collectionRepository, relationRepository, events, mapper) {
        this.collectionRepository = collectionRepository;
        this.relationRepository = relationRepository;
        this.events = events;
        this.mapper = mapper;
    }
    supportsStructuredGraphqlFilters() {
        return false;
    }
    async list(query = {}) {
        const { skip, startRow, take } = this.mapper.parsePageQuery(query);
        const [collections, count] = await this.collectionRepository.findAndCount({
            order: {
                createdAt: 'ASC',
            },
            skip,
            take,
            where: {
                collectionKind: omnikernel_module_1.OmniCollectionKind.Collection,
            },
        });
        return this.mapper.buildPage(collections.map((collection) => this.mapper.mapOmniCollectionToProject(collection)), startRow, count);
    }
    async getById(guid) {
        return this.getTaskProjectOrFail(guid);
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
        const collection = await this.collectionRepository.findOne({
            where: this.mapCrudGenWhereToOmniWhere(where),
        });
        if (!collection) {
            if (options === null || options === void 0 ? void 0 : options.failOnNull) {
                throw this.events.errorNotFound('projects.omni.not-found', {
                    data: { conditions: where },
                    response: { message: 'Project not found' },
                });
            }
            return null;
        }
        return this.mapper.mapOmniCollectionToProject(collection);
    }
    async getEntityListExtended(findOptions, withCount = false) {
        var _a, _b;
        const skip = (_a = findOptions.skip) !== null && _a !== void 0 ? _a : 0;
        const take = findOptions.take;
        const where = this.mapCrudGenWhereToOmniWhere(findOptions.where);
        const collections = await this.collectionRepository.find({
            order: (_b = findOptions.order) !== null && _b !== void 0 ? _b : { createdAt: 'ASC' },
            skip,
            take,
            where,
        });
        if (!withCount) {
            return collections.map((collection) => this.mapper.mapOmniCollectionToProject(collection));
        }
        const count = await this.collectionRepository.count({ where });
        return [
            collections.map((collection) => this.mapper.mapOmniCollectionToProject(collection)),
            count,
        ];
    }
    async createEntity(input, _findOptions, returnEntity = true) {
        var _a, _b;
        if (!input.guid || !input.name) {
            throw this.events.errorBadRequest('projects.omni.create.invalid', {
                data: {
                    guid: (_a = input.guid) !== null && _a !== void 0 ? _a : null,
                    name: (_b = input.name) !== null && _b !== void 0 ? _b : null,
                },
                response: {
                    message: 'Project guid and name are required',
                },
            });
        }
        const createInput = {
            description: input.description,
            guid: input.guid,
            name: input.name,
            status: input.status,
        };
        const entity = this.collectionRepository.create(this.mapper.mapProjectToOmniCollection(createInput));
        await this.collectionRepository.save(entity);
        if (!returnEntity) {
            return true;
        }
        return this.getTaskProjectOrFail(entity.guid);
    }
    async updateEntity(conditions, input, _findOptions, returnEntity = true) {
        var _a, _b, _c;
        const guid = this.requireGuid(conditions);
        const current = await this.getCollectionOrFail(guid);
        const merged = {
            guid,
            description: input.description !== undefined
                ? input.description
                : ((_a = current.summary) !== null && _a !== void 0 ? _a : null),
            name: (_b = input.name) !== null && _b !== void 0 ? _b : current.title,
            status: (_c = input.status) !== null && _c !== void 0 ? _c : this.mapper.mapOmniCollectionToProject(current).status,
        };
        await this.collectionRepository.update({ guid }, this.mapper.mapProjectToOmniCollection(merged));
        if (!returnEntity) {
            return true;
        }
        return this.getTaskProjectOrFail(guid);
    }
    async deleteEntity(conditions) {
        const guid = this.requireGuid(conditions);
        await this.getCollectionOrFail(guid);
        await this.relationRepository.delete({
            sourceRecordId: guid,
        });
        await this.relationRepository.delete({
            targetRecordId: guid,
        });
        await this.collectionRepository.delete({ guid });
        return true;
    }
    async ensureProjectExists(guid) {
        await this.getCollectionOrFail(guid);
    }
    async getTaskProjectOrFail(guid) {
        const collection = await this.getCollectionOrFail(guid);
        return this.mapper.mapOmniCollectionToProject(collection);
    }
    async getCollectionOrFail(guid) {
        const collection = await this.collectionRepository.findOne({
            where: {
                guid,
                kind: omnikernel_module_1.OmniCollectionKind.Collection,
            },
        });
        if (!collection) {
            throw this.events.errorNotFound('projects.omni.not-found', {
                data: {
                    projectId: guid,
                },
                response: {
                    message: 'Project not found',
                },
            });
        }
        return collection;
    }
    requireGuid(conditions) {
        if (!conditions.guid) {
            throw this.events.errorBadRequest('projects.omni.conditions.invalid', {
                response: { message: 'Project guid is required' },
            });
        }
        return conditions.guid;
    }
    mapCrudGenWhereToOmniWhere(where) {
        const baseWhere = {
            collectionKind: omnikernel_module_1.OmniCollectionKind.Collection,
        };
        if (!where) {
            return baseWhere;
        }
        if (typeof where === 'string') {
            return Object.assign(Object.assign({}, baseWhere), { guid: where });
        }
        if (Array.isArray(where)) {
            return where.map((item) => this.mapCrudGenWhereToOmniWhere(item));
        }
        const guid = where.guid;
        return Object.assign(Object.assign(Object.assign({}, baseWhere), (guid instanceof typeorm_2.FindOperator
            ? this.mapGuidFindOperator(guid)
            : guid
                ? { guid }
                : {})), (where.status ? { status: where.status } : {}));
    }
    mapGuidFindOperator(guid) {
        if (guid.type === 'in' && Array.isArray(guid.value)) {
            return {
                guid: (0, typeorm_2.In)(guid.value),
            };
        }
        return { guid };
    }
};
exports.TaskAppOmniProjectService = TaskAppOmniProjectService;
exports.TaskAppOmniProjectService = TaskAppOmniProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniCollectionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRelationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_manager_1.YalcEventService,
        task_app_omni_mapper_1.TaskAppOmniMapper])
], TaskAppOmniProjectService);
//# sourceMappingURL=task-app-omni-project.service.js.map