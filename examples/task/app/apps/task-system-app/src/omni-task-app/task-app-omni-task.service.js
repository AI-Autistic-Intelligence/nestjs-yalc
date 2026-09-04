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
exports.TaskAppOmniTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const node_crypto_1 = require("node:crypto");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
const typeorm_2 = require("typeorm");
const task_app_omni_mapper_1 = require("./task-app-omni.mapper");
const task_app_omni_project_service_1 = require("./task-app-omni-project.service");
let TaskAppOmniTaskService = class TaskAppOmniTaskService {
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
        const order = this.buildRecordOrder(query.sorting);
        const [tasks, count] = await this.findTasks({ projectId: query.projectId }, pagination.skip, pagination.take, order !== null && order !== void 0 ? order : { createdAt: 'ASC' });
        return this.mapper.buildPage(tasks, pagination.startRow, count);
    }
    async getById(guid) {
        return this.getTaskItemOrFail(guid);
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
        const normalized = this.normalizeCrudGenWhere(where);
        const [tasks] = await this.findTasks(normalized, 0, 1, {
            createdAt: 'ASC',
        });
        const task = tasks[0];
        if (!task) {
            if (options === null || options === void 0 ? void 0 : options.failOnNull) {
                throw this.events.errorNotFound('tasks.omni.not-found', {
                    data: { conditions: where },
                    response: { message: 'Task not found' },
                });
            }
            return null;
        }
        return task;
    }
    async getEntityListExtended(findOptions, withCount = false) {
        var _a, _b;
        const normalized = this.normalizeCrudGenWhere(findOptions.where);
        const tasks = await this.findTasks(normalized, (_a = findOptions.skip) !== null && _a !== void 0 ? _a : 0, findOptions.take, (_b = findOptions.order) !== null && _b !== void 0 ? _b : {
            createdAt: 'ASC',
        });
        if (!withCount) {
            return tasks[0];
        }
        return tasks;
    }
    async createEntity(input, _findOptions, returnEntity = true) {
        var _a, _b, _c;
        if (!input.guid || !input.title) {
            throw this.events.errorBadRequest('tasks.omni.create.invalid', {
                data: {
                    guid: (_a = input.guid) !== null && _a !== void 0 ? _a : null,
                    title: (_b = input.title) !== null && _b !== void 0 ? _b : null,
                },
                response: {
                    message: 'Task guid and title are required',
                },
            });
        }
        if (input.projectId) {
            await this.projectService.ensureProjectExists(input.projectId);
        }
        const createInput = {
            description: input.description,
            dueAt: input.dueAt,
            guid: input.guid,
            projectId: input.projectId,
            referenceIds: input.referenceIds,
            relatedToIds: input.relatedToIds,
            status: input.status,
            title: input.title,
        };
        const record = this.recordRepository.create(this.mapper.mapTaskToOmniRecord(createInput));
        await this.recordRepository.save(record);
        await this.syncContainsRelation(record.guid, (_c = input.projectId) !== null && _c !== void 0 ? _c : null);
        await this.syncTaskRelations(record.guid, omnikernel_module_1.OmniRelationKind.References, createInput.referenceIds);
        await this.syncTaskRelations(record.guid, omnikernel_module_1.OmniRelationKind.RelatedTo, createInput.relatedToIds);
        if (!returnEntity) {
            return true;
        }
        return this.getTaskItemOrFail(record.guid);
    }
    async updateEntity(conditions, input, _findOptions, returnEntity = true) {
        var _a, _b, _c, _d, _e, _f, _g;
        const guid = this.requireGuid(conditions);
        const current = await this.getTaskItemOrFail(guid);
        const merged = {
            description: input.description !== undefined
                ? input.description
                : ((_a = current.description) !== null && _a !== void 0 ? _a : null),
            dueAt: input.dueAt !== undefined
                ? input.dueAt
                : ((_b = current.dueAt) !== null && _b !== void 0 ? _b : null),
            guid,
            projectId: Object.prototype.hasOwnProperty.call(input, 'projectId')
                ? ((_c = input.projectId) !== null && _c !== void 0 ? _c : null)
                : ((_d = current.projectId) !== null && _d !== void 0 ? _d : null),
            referenceIds: input.referenceIds,
            relatedToIds: input.relatedToIds,
            status: (_e = input.status) !== null && _e !== void 0 ? _e : current.status,
            title: (_f = input.title) !== null && _f !== void 0 ? _f : current.title,
        };
        await this.recordRepository.update({ guid, kind: this.mapper.taskKind }, this.mapper.mapTaskToOmniRecord(merged));
        if (Object.prototype.hasOwnProperty.call(input, 'projectId')) {
            if (input.projectId) {
                await this.projectService.ensureProjectExists(input.projectId);
            }
            await this.syncContainsRelation(guid, (_g = input.projectId) !== null && _g !== void 0 ? _g : null);
        }
        if (input.referenceIds) {
            await this.syncTaskRelations(guid, omnikernel_module_1.OmniRelationKind.References, input.referenceIds);
        }
        if (input.relatedToIds) {
            await this.syncTaskRelations(guid, omnikernel_module_1.OmniRelationKind.RelatedTo, input.relatedToIds);
        }
        if (!returnEntity) {
            return true;
        }
        return this.getTaskItemOrFail(guid);
    }
    async deleteEntity(conditions) {
        const guid = this.requireGuid(conditions);
        await this.getTaskRecordOrFail(guid);
        await this.relationRepository.delete({ sourceRecordId: guid });
        await this.relationRepository.delete({ targetRecordId: guid });
        await this.recordRepository.delete({
            guid,
            kind: this.mapper.taskKind,
        });
        return true;
    }
    async ensureTaskExists(guid) {
        await this.getTaskRecordOrFail(guid);
    }
    async getTaskRecordOrFail(guid) {
        const record = await this.recordRepository.findOne({
            where: {
                guid,
                kind: this.mapper.taskKind,
            },
        });
        if (!record) {
            throw this.events.errorNotFound('tasks.omni.not-found', {
                data: {
                    taskId: guid,
                },
                response: {
                    message: 'Task not found',
                },
            });
        }
        return record;
    }
    async getTaskItemOrFail(guid) {
        const record = await this.getTaskRecordOrFail(guid);
        const projectId = await this.getProjectIdForTask(guid);
        return this.mapper.mapOmniRecordToTask(record, projectId);
    }
    async findTasks(where, skip, take, order) {
        const projectId = this.unwrapScalarCondition(where.projectId);
        if (typeof projectId === 'string' && projectId.length > 0) {
            await this.projectService.ensureProjectExists(projectId);
            const [records, count] = await this.getCollectionMembersByKind(projectId, this.mapper.taskKind, skip, take !== null && take !== void 0 ? take : 100, order);
            return [
                records.map((record) => this.mapper.mapOmniRecordToTask(record, projectId)),
                count,
            ];
        }
        const recordWhere = Object.assign(Object.assign({ kind: this.mapper.taskKind }, (where.guid !== undefined ? { guid: where.guid } : {})), (where.title !== undefined ? { title: where.title } : {}));
        const [records, count] = await this.recordRepository.findAndCount({
            order,
            skip,
            take,
            where: recordWhere,
        });
        const projectIds = await this.getProjectIds(records.map((record) => record.guid));
        return [
            records.map((record) => {
                var _a;
                return this.mapper.mapOmniRecordToTask(record, (_a = projectIds.get(record.guid)) !== null && _a !== void 0 ? _a : null);
            }),
            count,
        ];
    }
    async getCollectionMembersByKind(collectionId, recordKind, skip, take, order = { createdAt: 'ASC' }) {
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
        const sortableColumns = new Set(['guid', 'title', 'slug', 'createdAt']);
        let orderedQuery = baseQuery;
        for (const [column, direction] of Object.entries(order)) {
            if (!sortableColumns.has(column)) {
                continue;
            }
            orderedQuery = orderedQuery.addOrderBy(`targetRecord.${column}`, direction);
        }
        if (Object.keys(order).length === 0) {
            orderedQuery = orderedQuery.orderBy('relation.createdAt', 'ASC');
        }
        const relations = await orderedQuery.skip(skip).take(take).getMany();
        return [
            relations
                .map((relation) => relation.targetRecord)
                .filter((record) => !!record),
            count,
        ];
    }
    buildRecordOrder(sorting) {
        if (!(sorting === null || sorting === void 0 ? void 0 : sorting.length)) {
            return null;
        }
        const order = {};
        const sortableColumns = new Set(['guid', 'title', 'slug', 'createdAt']);
        for (const sort of sorting) {
            if (!sortableColumns.has(sort.colId)) {
                continue;
            }
            order[sort.colId] = sort.sort === 'DESC' ? 'DESC' : 'ASC';
        }
        return Object.keys(order).length > 0 ? order : null;
    }
    requireGuid(conditions) {
        if (!conditions.guid) {
            throw this.events.errorBadRequest('tasks.omni.conditions.invalid', {
                response: { message: 'Task guid is required' },
            });
        }
        return conditions.guid;
    }
    normalizeCrudGenWhere(where) {
        if (!where) {
            return {};
        }
        if (typeof where === 'string') {
            return { guid: where };
        }
        if (Array.isArray(where)) {
            return this.normalizeCrudGenWhere(where[0]);
        }
        const filters = this.mapper.extractCrudGenFilterMap(where);
        const guid = filters.guid;
        const projectId = filters.projectId;
        const title = filters.title;
        return Object.assign(Object.assign(Object.assign({}, (guid instanceof typeorm_2.FindOperator
            ? this.mapGuidFindOperator(guid)
            : guid
                ? { guid }
                : {})), (projectId instanceof typeorm_2.FindOperator
            ? this.mapProjectIdFindOperator(projectId)
            : projectId
                ? { projectId }
                : {})), (title instanceof typeorm_2.FindOperator
            ? this.mapTitleFindOperator(title)
            : title
                ? { title }
                : {}));
    }
    mapGuidFindOperator(guid) {
        if (guid.type === 'in' && Array.isArray(guid.value)) {
            return {
                guid: (0, typeorm_2.In)(guid.value),
            };
        }
        return { guid };
    }
    mapProjectIdFindOperator(projectId) {
        if (projectId.type === 'in' && Array.isArray(projectId.value)) {
            return {
                projectId: (0, typeorm_2.In)(projectId.value),
            };
        }
        return { projectId };
    }
    mapTitleFindOperator(title) {
        return { title };
    }
    unwrapScalarCondition(value) {
        if (!value) {
            return null;
        }
        if (value instanceof typeorm_2.FindOperator) {
            if (value.type === 'equal' && typeof value.value === 'string') {
                return value.value;
            }
            return null;
        }
        return value;
    }
    async getProjectIds(taskIds) {
        const projectIds = new Map();
        if (taskIds.length === 0) {
            return projectIds;
        }
        const relations = await this.relationRepository.find({
            order: {
                createdAt: 'ASC',
            },
            where: {
                kind: omnikernel_module_1.OmniRelationKind.Contains,
                status: omnikernel_module_1.OmniRelationStatus.Active,
                targetRecordId: (0, typeorm_2.In)(taskIds),
            },
        });
        for (const relation of relations) {
            if (!projectIds.has(relation.targetRecordId)) {
                projectIds.set(relation.targetRecordId, relation.sourceRecordId);
            }
        }
        return projectIds;
    }
    async getProjectIdForTask(taskId) {
        var _a;
        const relation = await this.relationRepository.findOne({
            order: {
                createdAt: 'ASC',
            },
            where: {
                kind: omnikernel_module_1.OmniRelationKind.Contains,
                status: omnikernel_module_1.OmniRelationStatus.Active,
                targetRecordId: taskId,
            },
        });
        return (_a = relation === null || relation === void 0 ? void 0 : relation.sourceRecordId) !== null && _a !== void 0 ? _a : null;
    }
    async syncContainsRelation(taskId, projectId) {
        await this.relationRepository.delete({
            kind: omnikernel_module_1.OmniRelationKind.Contains,
            targetRecordId: taskId,
        });
        if (!projectId) {
            return;
        }
        await this.relationRepository.save(this.relationRepository.create({
            guid: (0, node_crypto_1.randomUUID)(),
            kind: omnikernel_module_1.OmniRelationKind.Contains,
            sourceRecordId: projectId,
            status: omnikernel_module_1.OmniRelationStatus.Active,
            targetRecordId: taskId,
        }));
    }
    async syncTaskRelations(taskId, relationKind, targetIds) {
        if (!targetIds) {
            return;
        }
        await this.relationRepository.delete({
            kind: relationKind,
            sourceRecordId: taskId,
        });
        const uniqueTargetIds = [...new Set(targetIds.filter(Boolean))];
        if (uniqueTargetIds.length === 0) {
            return;
        }
        const targets = await this.recordRepository.find({
            where: {
                guid: (0, typeorm_2.In)(uniqueTargetIds),
            },
        });
        if (targets.length !== uniqueTargetIds.length) {
            throw this.events.errorBadRequest('tasks.omni.relations.invalid-target', {
                data: {
                    relationKind,
                    sourceTaskId: taskId,
                    targetIds: uniqueTargetIds,
                },
                response: {
                    message: 'One or more related records do not exist',
                },
            });
        }
        await this.relationRepository.save(uniqueTargetIds.map((targetId) => this.relationRepository.create({
            guid: (0, node_crypto_1.randomUUID)(),
            kind: relationKind,
            sourceRecordId: taskId,
            status: omnikernel_module_1.OmniRelationStatus.Active,
            targetRecordId: targetId,
        })));
    }
};
exports.TaskAppOmniTaskService = TaskAppOmniTaskService;
exports.TaskAppOmniTaskService = TaskAppOmniTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRecordEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(omnikernel_module_1.OmniRelationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_manager_1.YalcEventService,
        task_app_omni_mapper_1.TaskAppOmniMapper,
        task_app_omni_project_service_1.TaskAppOmniProjectService])
], TaskAppOmniTaskService);
//# sourceMappingURL=task-app-omni-task.service.js.map