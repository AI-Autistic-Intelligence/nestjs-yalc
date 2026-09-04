"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TaskSystemModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSystemModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const task_event_entity_js_1 = require("./task-event.entity.js");
const task_event_resolver_js_1 = require("./task-event.resolver.js");
const task_external_ref_entity_js_1 = require("./task-external-ref.entity.js");
const task_external_ref_resolver_js_1 = require("./task-external-ref.resolver.js");
const task_item_entity_js_1 = require("./task-item.entity.js");
const task_item_resolver_js_1 = require("./task-item.resolver.js");
const task_project_entity_js_1 = require("./task-project.entity.js");
const task_project_resolver_js_1 = require("./task-project.resolver.js");
const task_sync_state_entity_js_1 = require("./task-sync-state.entity.js");
const task_sync_state_resolver_js_1 = require("./task-sync-state.resolver.js");
const bindGeneratedDataloaderEventEmitter = (providers) => providers.map((provider) => {
    if (typeof provider !== 'object' || provider === null)
        return provider;
    const providerWithInject = provider;
    if (!Array.isArray(providerWithInject.inject))
        return provider;
    return Object.assign(Object.assign({}, providerWithInject), { inject: providerWithInject.inject.map((token) => token !== null && token !== void 0 ? token : event_emitter_1.EventEmitter2) });
});
let TaskSystemModule = TaskSystemModule_1 = class TaskSystemModule {
    static register(dbConnection) {
        const taskProjectProviders = bindGeneratedDataloaderEventEmitter((0, task_project_resolver_js_1.taskProjectProvidersFactory)(dbConnection).providers);
        const taskItemProviders = bindGeneratedDataloaderEventEmitter((0, task_item_resolver_js_1.taskItemProvidersFactory)(dbConnection).providers);
        const taskEventProviders = bindGeneratedDataloaderEventEmitter((0, task_event_resolver_js_1.taskEventProvidersFactory)(dbConnection).providers);
        const taskExternalRefProviders = bindGeneratedDataloaderEventEmitter((0, task_external_ref_resolver_js_1.taskExternalRefProvidersFactory)(dbConnection).providers);
        const taskSyncStateProviders = bindGeneratedDataloaderEventEmitter((0, task_sync_state_resolver_js_1.taskSyncStateProvidersFactory)(dbConnection).providers);
        const eventEmitter = new event_emitter_1.EventEmitter2();
        return {
            module: TaskSystemModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature([task_project_entity_js_1.TaskProject, task_item_entity_js_1.TaskItem, task_event_entity_js_1.TaskEvent, task_external_ref_entity_js_1.TaskExternalRef, task_sync_state_entity_js_1.TaskSyncState], dbConnection),
            ],
            providers: [
                {
                    provide: event_emitter_1.EventEmitter2,
                    useValue: eventEmitter,
                },
                ...taskProjectProviders,
                ...taskItemProviders,
                ...taskEventProviders,
                ...taskExternalRefProviders,
                ...taskSyncStateProviders,
            ],
            exports: [
                event_emitter_1.EventEmitter2,
                ...taskProjectProviders,
                ...taskItemProviders,
                ...taskEventProviders,
                ...taskExternalRefProviders,
                ...taskSyncStateProviders,
            ],
        };
    }
};
exports.TaskSystemModule = TaskSystemModule;
exports.TaskSystemModule = TaskSystemModule = TaskSystemModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], TaskSystemModule);
//# sourceMappingURL=task-system.module.js.map