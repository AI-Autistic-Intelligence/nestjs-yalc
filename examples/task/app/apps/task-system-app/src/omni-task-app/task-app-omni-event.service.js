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
exports.TaskAppOmniEventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_manager_1 = require("@nest-yalc-2/event-manager");
const omnikernel_module_1 = require("@nest-yalc-2/omnikernel-module");
const node_crypto_1 = require("node:crypto");
const typeorm_2 = require("typeorm");
const task_app_omni_mapper_1 = require("./task-app-omni.mapper");
const task_app_omni_project_service_1 = require("./task-app-omni-project.service");
let TaskAppOmniEventService = class TaskAppOmniEventService {
    constructor(recordRepository, relationRepository, events, mapper, projectService) {
        this.recordRepository = recordRepository;
        this.relationRepository = relationRepository;
        this.events = events;
        this.mapper = mapper;
        this.projectService = projectService;
    }
    supportsStructuredGraphqlFilters() {
        return false;
    }
    async list(query = {}) {
        const pagination = this.mapper.parsePageQuery(query);
        if (query.projectId) {
            await this.projectService.ensureProjectExists(query.projectId);
            const [events, count] = await this.getCollectionMembersByKind(query.projectId, this.mapper.eventKind, pagination.skip, pagination.take);
            return this.mapper.buildPage(events.map((event) => this.mapper.mapOmniRecordToEvent(event, query.projectId)), pagination.startRow, count);
        }
        const [records, count] = await this.recordRepository.findAndCount({
            order: { createdAt: 'ASC' },
            skip: pagination.skip,
            take: pagination.take,
            where: { kind: this.mapper.eventKind },
        });
        const projectIds = await this.getProjectIds(records.map((r) => r.guid));
        return this.mapper.buildPage(records.map((record) => {
            var _a;
            return this.mapper.mapOmniRecordToEvent(record, (_a = projectIds.get(record.guid)) !== null && _a !== void 0 ? _a : null);
        }), pagination.startRow, count);
    }
    async getById(guid) {
        return this.getTaskEventOrFail(guid);
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
        const record = await this.recordRepository.findOne({
            where: this.mapCrudGenWhereToOmniWhere(where),
        });
        if (!record) {
            if (options === null || options === void 0 ? void 0 : options.failOnNull) {
                throw this.events.errorNotFound('events.omni.not-found', {
                    data: { conditions: where },
                    response: { message: 'Event not found' },
                });
            }
            return null;
        }
        const projectId = await this.getProjectIdForEvent(record.guid);
        return this.mapper.mapOmniRecordToEvent(record, projectId);
    }
    async getEntityListExtended(findOptions, withCount = false) {
        var _a, _b;
        const skip = (_a = findOptions.skip) !== null && _a !== void 0 ? _a : 0;
        const take = findOptions.take;
        const where = this.mapCrudGenWhereToOmniWhere(findOptions.where);
        const records = await this.recordRepository.find({
            order: (_b = findOptions.order) !== null && _b !== void 0 ? _b : { createdAt: 'ASC' },
            skip,
            take,
            where,
        });
        const projectIds = await this.getProjectIds(records.map((record) => record.guid));
        if (!withCount) {
            return records.map((record) => {
                var _a;
                return this.mapper.mapOmniRecordToEvent(record, (_a = projectIds.get(record.guid)) !== null && _a !== void 0 ? _a : null);
            });
        }
        const count = await this.recordRepository.count({ where });
        return [
            records.map((record) => {
                var _a;
                return this.mapper.mapOmniRecordToEvent(record, (_a = projectIds.get(record.guid)) !== null && _a !== void 0 ? _a : null);
            }),
            count,
        ];
    }
    async createEntity(input, _findOptions, returnEntity = true) {
        var _a;
        if (!input.guid || !input.title || !input.startAt) {
            throw this.events.errorBadRequest('events.omni.create.invalid', {
                response: { message: 'Event guid, title, and startAt are required' },
            });
        }
        if (input.projectId) {
            await this.projectService.ensureProjectExists(input.projectId);
        }
        const createInput = {
            allDay: input.allDay,
            description: input.description,
            endAt: input.endAt,
            guid: input.guid,
            location: input.location,
            projectId: input.projectId,
            startAt: input.startAt,
            status: input.status,
            title: input.title,
        };
        const record = this.recordRepository.create(this.mapper.mapEventToOmniRecord(createInput));
        await this.recordRepository.save(record);
        await this.syncContainsRelation(record.guid, (_a = input.projectId) !== null && _a !== void 0 ? _a : null);
        if (!returnEntity) {
            return true;
        }
        return this.getTaskEventOrFail(record.guid);
    }
    async updateEntity(conditions, input, _findOptions, returnEntity = true) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const guid = this.requireGuid(conditions);
        const current = await this.getTaskEventOrFail(guid);
        const merged = {
            guid,
            title: (_a = input.title) !== null && _a !== void 0 ? _a : current.title,
            description: input.description !== undefined
                ? input.description
                : ((_b = current.description) !== null && _b !== void 0 ? _b : null),
            status: (_c = input.status) !== null && _c !== void 0 ? _c : current.status,
            startAt: (_d = input.startAt) !== null && _d !== void 0 ? _d : current.startAt,
            endAt: input.endAt !== undefined
                ? input.endAt
                : ((_e = current.endAt) !== null && _e !== void 0 ? _e : null),
            allDay: (_f = input.allDay) !== null && _f !== void 0 ? _f : current.allDay,
            location: input.location !== undefined
                ? input.location
                : ((_g = current.location) !== null && _g !== void 0 ? _g : null),
        };
        await this.recordRepository.update({ guid, kind: this.mapper.eventKind }, this.mapper.mapEventToOmniRecord(merged));
        if (Object.prototype.hasOwnProperty.call(input, 'projectId')) {
            if (input.projectId) {
                await this.projectService.ensureProjectExists(input.projectId);
            }
            await this.syncContainsRelation(guid, (_h = input.projectId) !== null && _h !== void 0 ? _h : null);
        }
        if (!returnEntity) {
            return true;
        }
        return this.getTaskEventOrFail(guid);
    }
    async deleteEntity(conditions) {
        const guid = this.requireGuid(conditions);
        await this.getEventRecordOrFail(guid);
        await this.relationRepository.delete({ sourceRecordId: guid });
        await this.relationRepository.delete({ targetRecordId: guid });
        await this.recordRepository.delete({ guid, kind: this.mapper.eventKind });
        return true;
    }
    async getTaskEventOrFail(guid) {
        const record = await this.getEventRecordOrFail(guid);
        const projectId = await this.getProjectIdForEvent(guid);
        return this.mapper.mapOmniRecordToEvent(record, projectId);
    }
    async getEventRecordOrFail(guid) {
        const record = await this.recordRepository.findOne({
            where: { guid, kind: this.mapper.eventKind },
        });
        if (!record) {
            throw this.events.errorNotFound('events.omni.not-found', {
                response: { message: 'Event not found' },
            });
        }
        return record;
    }
    async getCollectionMembersByKind(collectionId, recordKind, skip, take) {
        const baseQuery = this.relationRepository
            .createQueryBuilder('relation')
            .innerJoinAndSelect('relation.targetRecord', 'targetRecord')
            .where('relation.sourceRecordId = :collectionId', { collectionId })
            .andWhere('relation.kind = :relationKind', {
            relationKind: omnikernel_module_1.OmniRelationKind.Contains,
        })
            .andWhere('relation.status = :relationStatus', {
            relationStatus: omnikernel_module_1.OmniRelationStatus.Active,
        })
            .andWhere('targetRecord.kind = :recordKind', { recordKind });
        const count = await baseQuery.clone().getCount();
        const relations = await baseQuery
            .orderBy('relation.createdAt', 'ASC')
            .skip(skip)
            .take(take)
            .getMany();
        return [
            relations
                .map((relation) => relation.targetRecord)
                .filter((record) => !!record),
            count,
        ];
    }
    async getProjectIds(eventIds) {
        const projectIds = new Map();
        if (!eventIds.length)
            return projectIds;
        const relations = await this.relationRepository.find({
            where: {
                kind: omnikernel_module_1.OmniRelationKind.Contains,
                status: omnikernel_module_1.OmniRelationStatus.Active,
                targetRecordId: (0, typeorm_2.In)(eventIds),
            },
            order: { createdAt: 'ASC' },
        });
        for (const relation of relations) {
            if (!projectIds.has(relation.targetRecordId)) {
                projectIds.set(relation.targetRecordId, relation.sourceRecordId);
            }
        }
        return projectIds;
    }
    async getProjectIdForEvent(eventId) {
        var _a;
        const relation = await this.relationRepository.findOne({
            where: {
                kind: omnikernel_module_1.OmniRelationKind.Contains,
                status: omnikernel_module_1.OmniRelationStatus.Active,
                targetRecordId: eventId,
            },
            order: { createdAt: 'ASC' },
        });
        return (_a = relation === null || relation === void 0 ? void 0 : relation.sourceRecordId) !== null && _a !== void 0 ? _a : null;
    }
    async syncContainsRelation(eventId, projectId) {
        await this.relationRepository.delete({
            kind: omnikernel_module_1.OmniRelationKind.Contains,
            targetRecordId: eventId,
        });
        if (!projectId)
            return;
        await this.relationRepository.save(this.relationRepository.create({
            guid: (0, node_crypto_1.randomUUID)(),
            kind: omnikernel_module_1.OmniRelationKind.Contains,
            sourceRecordId: projectId,
            status: omnikernel_module_1.OmniRelationStatus.Active,
            targetRecordId: eventId,
        }));
    }
    requireGuid(conditions) {
        if (!conditions.guid) {
            throw this.events.errorBadRequest('events.omni.conditions.invalid', {
                response: { message: 'Event guid is required' },
            });
        }
        return conditions.guid;
    }
    mapCrudGenWhereToOmniWhere(where) {
        const baseWhere = { kind: this.mapper.eventKind };
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
exports.TaskAppOmniEventService = TaskAppOmniEventService;
exports.TaskAppOmniEventService = TaskAppOmniEventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRecordEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRelationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_manager_1.YalcEventService,
        task_app_omni_mapper_1.TaskAppOmniMapper,
        task_app_omni_project_service_1.TaskAppOmniProjectService])
], TaskAppOmniEventService);
//# sourceMappingURL=task-app-omni-event.service.js.map