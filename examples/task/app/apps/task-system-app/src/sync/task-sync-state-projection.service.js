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
exports.TaskSyncStateProjectionService = exports.TaskSyncStateProjectionIndexesBootstrap = exports.TASK_SYNC_STATE_PROJECTION_DIALECT = exports.TASK_SYNC_STATE_PROJECTION_SCOPE = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const event_manager_1 = require("@nest-yalc-2/event-manager");
const task_app_omni_external_ref_service_1 = require("../omni-task-app/task-app-omni-external-ref.service");
const task_sync_state_projection_1 = require("./task-sync-state.projection");
exports.TASK_SYNC_STATE_PROJECTION_SCOPE = Symbol('TASK_SYNC_STATE_PROJECTION_SCOPE');
exports.TASK_SYNC_STATE_PROJECTION_DIALECT = Symbol('TASK_SYNC_STATE_PROJECTION_DIALECT');
let TaskSyncStateProjectionIndexesBootstrap = class TaskSyncStateProjectionIndexesBootstrap {
    constructor(dataSource, dialect) {
        this.dataSource = dataSource;
        this.dialect = dialect;
    }
    async onApplicationBootstrap() {
        await (0, crud_gen_1.applyProjectionIndexesForBootstrap)(this.dataSource, this.dialect, task_sync_state_projection_1.taskSyncStateProjectionDefinition);
    }
};
exports.TaskSyncStateProjectionIndexesBootstrap = TaskSyncStateProjectionIndexesBootstrap;
exports.TaskSyncStateProjectionIndexesBootstrap = TaskSyncStateProjectionIndexesBootstrap = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, typeorm_1.getDataSourceToken)())),
    __param(1, (0, common_1.Inject)(exports.TASK_SYNC_STATE_PROJECTION_DIALECT)),
    __metadata("design:paramtypes", [Function, Object])
], TaskSyncStateProjectionIndexesBootstrap);
let TaskSyncStateProjectionService = class TaskSyncStateProjectionService extends crud_gen_1.ProjectionResourceService {
    constructor(dataSource, scope, dialect, events, externalRefService) {
        super(dataSource.getRepository(task_sync_state_projection_1.TaskSyncStateProjection), scope, dialect, events, task_sync_state_projection_1.taskSyncStateProjectionDefinition);
        this.externalRefService = externalRefService;
    }
    async createEntity(input) {
        await this.assertExternalRef(input.externalRefId);
        return super.createEntity(input);
    }
    async updateEntity(conditions, input) {
        var _a;
        const current = await super.getEntity(conditions, undefined, undefined, undefined, { failOnNull: true });
        const externalRefId = (_a = input.externalRefId) !== null && _a !== void 0 ? _a : current === null || current === void 0 ? void 0 : current.externalRefId;
        await this.assertExternalRef(externalRefId);
        return super.updateEntity(conditions, input);
    }
    async assertExternalRef(externalRefId) {
        if (typeof externalRefId === 'string') {
            await this.externalRefService.getById(externalRefId);
        }
    }
};
exports.TaskSyncStateProjectionService = TaskSyncStateProjectionService;
exports.TaskSyncStateProjectionService = TaskSyncStateProjectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, typeorm_1.getDataSourceToken)())),
    __param(1, (0, common_1.Inject)(exports.TASK_SYNC_STATE_PROJECTION_SCOPE)),
    __param(2, (0, common_1.Inject)(exports.TASK_SYNC_STATE_PROJECTION_DIALECT)),
    __metadata("design:paramtypes", [Function, Object, Object, event_manager_1.YalcEventService,
        task_app_omni_external_ref_service_1.TaskAppOmniExternalRefService])
], TaskSyncStateProjectionService);
//# sourceMappingURL=task-sync-state-projection.service.js.map