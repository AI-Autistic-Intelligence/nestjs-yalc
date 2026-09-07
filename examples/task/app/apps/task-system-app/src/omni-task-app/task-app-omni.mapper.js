"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAppOmniMapper = void 0;
const common_1 = require("@nestjs/common");
const omnikernel_module_1 = require("@nest-yalc-2/omnikernel-module");
const task_item_dto_1 = require("../tasks/task-item.dto");
const task_project_dto_1 = require("../projects/task-project.dto");
const task_event_dto_1 = require("../events/task-event.dto");
const task_external_ref_dto_1 = require("../sync/task-external-ref.dto");
let TaskAppOmniMapper = class TaskAppOmniMapper {
    constructor() {
        this.taskKind = 'task';
        this.eventKind = 'event';
    }
    extractCrudGenFilterMap(where) {
        var _a;
        if (!where || typeof where !== 'object' || Array.isArray(where)) {
            return {};
        }
        const source = where;
        const filters = source.filters ? Object.assign({}, source.filters) : Object.assign({}, source);
        delete filters.filters;
        delete filters.operator;
        delete filters.childExpressions;
        for (const childExpression of (_a = source.childExpressions) !== null && _a !== void 0 ? _a : []) {
            Object.assign(filters, this.extractCrudGenFilterMap(childExpression));
        }
        return filters;
    }
    mapProjectToOmniCollection(input) {
        var _a, _b, _c;
        const projectStatus = (_a = input.status) !== null && _a !== void 0 ? _a : 'active';
        return {
            guid: input.guid,
            title: (_b = input.name) !== null && _b !== void 0 ? _b : 'Untitled project',
            slug: this.slugify(input.name),
            kind: omnikernel_module_1.OmniCollectionKind.Collection,
            collectionKind: omnikernel_module_1.OmniCollectionKind.Collection,
            status: this.mapDomainStatusToOmniStatus(projectStatus),
            summary: (_c = input.description) !== null && _c !== void 0 ? _c : null,
            payload: {
                projectStatus,
            },
        };
    }
    mapOmniCollectionToProject(collection) {
        var _a, _b;
        const payload = this.getPayload(collection);
        return new task_project_dto_1.TaskProjectType({
            guid: collection.guid,
            name: collection.title,
            description: (_a = collection.summary) !== null && _a !== void 0 ? _a : null,
            status: (_b = this.getPayloadString(payload, 'projectStatus')) !== null && _b !== void 0 ? _b : this.mapOmniStatusToDomainStatus(collection.status),
        });
    }
    mapTaskToOmniRecord(input) {
        var _a, _b, _c;
        const taskStatus = (_a = input.status) !== null && _a !== void 0 ? _a : 'todo';
        return {
            guid: input.guid,
            title: (_b = input.title) !== null && _b !== void 0 ? _b : 'Untitled task',
            slug: this.slugify(input.title),
            kind: this.taskKind,
            status: this.mapDomainStatusToOmniStatus(taskStatus),
            payload: {
                description: (_c = input.description) !== null && _c !== void 0 ? _c : null,
                dueAt: this.normalizeDateInput(input.dueAt),
                taskStatus,
            },
        };
    }
    mapOmniRecordToTask(record, projectId) {
        var _a;
        const payload = this.getPayload(record);
        return new task_item_dto_1.TaskItemType({
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            guid: record.guid,
            title: record.title,
            description: this.getPayloadString(payload, 'description'),
            status: (_a = this.getPayloadString(payload, 'taskStatus')) !== null && _a !== void 0 ? _a : this.mapOmniStatusToDomainStatus(record.status),
            projectId: projectId !== null && projectId !== void 0 ? projectId : null,
            dueAt: this.getPayloadDate(payload, 'dueAt'),
        });
    }
    mapEventToOmniRecord(input) {
        var _a, _b, _c, _d, _e;
        const eventStatus = (_a = input.status) !== null && _a !== void 0 ? _a : 'scheduled';
        return {
            guid: input.guid,
            title: (_b = input.title) !== null && _b !== void 0 ? _b : 'Untitled event',
            slug: this.slugify(input.title),
            kind: this.eventKind,
            status: this.mapDomainStatusToOmniStatus(eventStatus),
            payload: {
                allDay: (_c = input.allDay) !== null && _c !== void 0 ? _c : false,
                description: (_d = input.description) !== null && _d !== void 0 ? _d : null,
                endAt: this.normalizeDateInput(input.endAt),
                eventStatus,
                location: (_e = input.location) !== null && _e !== void 0 ? _e : null,
                startAt: this.normalizeDateInput(input.startAt),
            },
        };
    }
    mapOmniRecordToEvent(record, projectId) {
        var _a, _b, _c;
        const payload = this.getPayload(record);
        return new task_event_dto_1.TaskEventType({
            guid: record.guid,
            title: record.title,
            description: this.getPayloadString(payload, 'description'),
            status: (_a = this.getPayloadString(payload, 'eventStatus')) !== null && _a !== void 0 ? _a : this.mapOmniStatusToDomainStatus(record.status),
            startAt: (_b = this.getPayloadDate(payload, 'startAt')) !== null && _b !== void 0 ? _b : new Date(0),
            endAt: this.getPayloadDate(payload, 'endAt'),
            allDay: (_c = this.getPayloadBoolean(payload, 'allDay')) !== null && _c !== void 0 ? _c : false,
            projectId: projectId !== null && projectId !== void 0 ? projectId : null,
            location: this.getPayloadString(payload, 'location'),
        });
    }
    mapExternalRefToOmniExternalRef(input) {
        var _a, _b, _c;
        const legacyInternalType = (_a = input.internalType) !== null && _a !== void 0 ? _a : this.mapOmniExternalRefInternalTypeToTaskType(this.mapTaskExternalRefInternalType(undefined));
        return {
            guid: input.guid,
            internalType: this.mapTaskExternalRefInternalType(input.internalType),
            internalId: input.internalId,
            provider: input.provider,
            account: (_b = input.account) !== null && _b !== void 0 ? _b : null,
            container: (_c = input.container) !== null && _c !== void 0 ? _c : null,
            externalId: input.externalId,
            payload: {
                legacyInternalType,
            },
        };
    }
    mapOmniExternalRefToTask(ref) {
        var _a, _b, _c;
        const payload = this.getPayload(ref);
        return new task_external_ref_dto_1.TaskExternalRefType({
            createdAt: ref.createdAt,
            updatedAt: ref.updatedAt,
            guid: ref.guid,
            internalType: (_a = this.getPayloadString(payload, 'legacyInternalType')) !== null && _a !== void 0 ? _a : this.mapOmniExternalRefInternalTypeToTaskType(ref.internalType),
            internalId: ref.internalId,
            provider: ref.provider,
            account: (_b = ref.account) !== null && _b !== void 0 ? _b : null,
            container: (_c = ref.container) !== null && _c !== void 0 ? _c : null,
            externalId: ref.externalId,
        });
    }
    mapTaskExternalRefInternalType(value) {
        switch (value) {
            case 'collection':
            case 'project':
                return omnikernel_module_1.OmniExternalRefInternalType.Collection;
            case 'document':
                return omnikernel_module_1.OmniExternalRefInternalType.Document;
            case 'record':
            case 'task':
            case 'event':
            case 'sync-state':
            case undefined:
            case null:
                return omnikernel_module_1.OmniExternalRefInternalType.Record;
            default:
                return omnikernel_module_1.OmniExternalRefInternalType.Record;
        }
    }
    mapOmniExternalRefInternalTypeToTaskType(value) {
        switch (value) {
            case omnikernel_module_1.OmniExternalRefInternalType.Collection:
                return 'project';
            case omnikernel_module_1.OmniExternalRefInternalType.Document:
                return 'document';
            case omnikernel_module_1.OmniExternalRefInternalType.Record:
            default:
                return 'task';
        }
    }
    mapDomainStatusToOmniStatus(status) {
        switch (status) {
            case 'todo':
            case 'draft':
                return omnikernel_module_1.OmniRecordStatus.Draft;
            case 'done':
            case 'archived':
            case 'cancelled':
                return omnikernel_module_1.OmniRecordStatus.Archived;
            case 'active':
            case 'in_progress':
            case 'scheduled':
            case 'error':
            default:
                return omnikernel_module_1.OmniRecordStatus.Active;
        }
    }
    mapOmniStatusToDomainStatus(status) {
        switch (status) {
            case omnikernel_module_1.OmniRecordStatus.Draft:
                return 'todo';
            case omnikernel_module_1.OmniRecordStatus.Archived:
                return 'done';
            case omnikernel_module_1.OmniRecordStatus.Active:
            default:
                return 'active';
        }
    }
    normalizeDateInput(value) {
        if (!value) {
            return null;
        }
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date.toISOString();
    }
    parsePageQuery(query) {
        const startRow = this.parseInteger(query.startRow, 0);
        const endRow = this.parseInteger(query.endRow, startRow + 100);
        const take = Math.max(endRow - startRow, 0);
        return {
            startRow,
            endRow,
            skip: startRow,
            take,
        };
    }
    buildPage(nodes, startRow, count) {
        return {
            list: nodes,
            nodes,
            pageData: {
                count,
                endRow: startRow + nodes.length,
                startRow,
            },
        };
    }
    slugify(value) {
        if (!value) {
            return null;
        }
        const normalized = value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return normalized.length > 0 ? normalized : null;
    }
    parseInteger(value, fallback) {
        const parsed = typeof value === 'number' ? value : Number.parseInt(value !== null && value !== void 0 ? value : '', 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    getPayload(entity) {
        return entity.payload && typeof entity.payload === 'object'
            ? entity.payload
            : {};
    }
    getPayloadString(payload, key) {
        const value = payload[key];
        return typeof value === 'string' ? value : null;
    }
    getPayloadDate(payload, key) {
        const value = payload[key];
        if (typeof value !== 'string') {
            return null;
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    getPayloadBoolean(payload, key) {
        const value = payload[key];
        return typeof value === 'boolean' ? value : null;
    }
};
exports.TaskAppOmniMapper = TaskAppOmniMapper;
exports.TaskAppOmniMapper = TaskAppOmniMapper = __decorate([
    (0, common_1.Injectable)()
], TaskAppOmniMapper);
//# sourceMappingURL=task-app-omni.mapper.js.map