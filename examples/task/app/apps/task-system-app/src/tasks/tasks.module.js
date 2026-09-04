"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const core_1 = require("@nestjs/core");
const api_strategy_1 = require("@nestjs-yalc/api-strategy");
const cls_module_js_1 = require("@nestjs-yalc/app/cls.module.js");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const observability_1 = require("@nestjs-yalc/observability");
const tasks_domain_events_service_1 = require("./tasks.domain-events.service");
const task_events_audit_store_1 = require("./events/task-events-audit.store");
const task_events_local_handler_1 = require("./events/task-events-local.handler");
const task_events_rabbitmq_handler_1 = require("./events/task-events-rabbitmq.handler");
const tasks_errors_controller_1 = require("./tasks.errors.controller");
const tasks_events_controller_1 = require("./tasks.events.controller");
const tasks_logging_controller_1 = require("./tasks.logging.controller");
const task_workflows_controller_1 = require("./task-workflows.controller");
const task_workflows_service_1 = require("./task-workflows.service");
const tasks_api_client_1 = require("@nestjs-yalc/task-system-module/src/client/tasks-api.client");
const tasks_events_client_1 = require("@nestjs-yalc/task-system-module/src/events/tasks-events.client");
const task_item_resource_1 = require("./task-item.resource");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [
            task_item_resource_1.TasksController,
            tasks_errors_controller_1.TasksErrorsController,
            task_workflows_controller_1.TaskWorkflowsController,
            tasks_logging_controller_1.TasksLoggingController,
            tasks_events_controller_1.TasksEventsController,
        ],
        providers: [
            ...task_item_resource_1.taskItemProviders,
            tasks_api_client_1.TasksApiClient,
            tasks_events_client_1.TasksEventsClient,
            task_workflows_service_1.TaskWorkflowsService,
            tasks_domain_events_service_1.TasksDomainEventsService,
            task_events_audit_store_1.TaskEventsAuditStore,
            task_events_local_handler_1.TaskEventsLocalHandler,
            task_events_rabbitmq_handler_1.TaskEventsRabbitMqHandler,
            {
                provide: cls_module_js_1.YalcGlobalClsService,
                useValue: {
                    get: () => ({}),
                },
            },
            {
                provide: tasks_api_client_1.TASKS_CLIENT_LOCAL_API_STRATEGY,
                useFactory: (httpAdapterHost, clsService, telemetry) => {
                    const configService = {
                        values: {},
                    };
                    return new observability_1.TelemetryCallStrategy(new api_strategy_1.NestLocalCallStrategy(httpAdapterHost, clsService, configService), telemetry, {
                        name: 'tasks-client.local',
                        transport: 'local',
                    });
                },
                inject: [core_1.HttpAdapterHost, cls_module_js_1.YalcGlobalClsService, observability_1.TelemetryService],
            },
            {
                provide: tasks_api_client_1.TASKS_CLIENT_HTTP_API_STRATEGY,
                useFactory: (httpService, clsService, telemetry) => {
                    var _a;
                    const baseUrl = (_a = process.env.TASKS_HTTP_BASE_URL) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!baseUrl && process.env.TASKS_API_STRATEGY === 'http') {
                        throw new Error('TASKS_HTTP_BASE_URL must be set to an absolute base URL when TASKS_API_STRATEGY is "http".');
                    }
                    return new observability_1.TelemetryCallStrategy(new api_strategy_1.NestHttpCallStrategy(httpService, clsService, baseUrl !== null && baseUrl !== void 0 ? baseUrl : ''), telemetry, {
                        name: 'tasks-client.http',
                        transport: 'http',
                    });
                },
                inject: [axios_1.HttpService, cls_module_js_1.YalcGlobalClsService, observability_1.TelemetryService],
            },
            (0, api_strategy_1.ApiCallStrategySelectorProvider)({
                provide: tasks_api_client_1.TASKS_CLIENT_API_STRATEGY,
                defaultStrategy: 'local',
                strategies: {
                    local: tasks_api_client_1.TASKS_CLIENT_LOCAL_API_STRATEGY,
                    http: tasks_api_client_1.TASKS_CLIENT_HTTP_API_STRATEGY,
                },
                selector: {
                    useFactory: () => process.env.TASKS_API_STRATEGY,
                },
            }),
            {
                provide: tasks_events_client_1.TASK_EVENTS_LOCAL_STRATEGY,
                useFactory: (events, telemetry) => new observability_1.TelemetryEventStrategy(new api_strategy_1.NestLocalEventStrategy(events.emitter), telemetry, {
                    name: 'tasks-events.local',
                    transport: 'local',
                }),
                inject: [event_manager_1.YalcEventService, observability_1.TelemetryService],
            },
            {
                provide: tasks_events_client_1.TASK_EVENTS_RABBITMQ_STRATEGY,
                useFactory: (localStrategy, telemetry) => new observability_1.TelemetryEventStrategy(new api_strategy_1.CompositeEventStrategy([
                    localStrategy,
                    new api_strategy_1.ConditionalEventStrategy(new observability_1.TelemetryEventStrategy(new api_strategy_1.RabbitMqEventStrategy(createTaskEventsRabbitMqOptions()), telemetry, {
                        name: 'tasks-events.rabbitmq',
                        transport: 'rabbitmq',
                    }), {
                        enabled: () => process.env.TASK_RABBITMQ_PUBLISH_ENABLED !== 'false',
                        disabledResult: false,
                    }),
                ]), telemetry, {
                    name: 'tasks-events.composite',
                    transport: 'composite',
                }),
                inject: [tasks_events_client_1.TASK_EVENTS_LOCAL_STRATEGY, observability_1.TelemetryService],
            },
            (0, api_strategy_1.EventStrategySelectorProvider)({
                provide: tasks_events_client_1.TASK_EVENTS_STRATEGY,
                defaultStrategy: 'local',
                strategies: {
                    local: tasks_events_client_1.TASK_EVENTS_LOCAL_STRATEGY,
                    rabbitmq: tasks_events_client_1.TASK_EVENTS_RABBITMQ_STRATEGY,
                },
                selector: {
                    useFactory: () => process.env.TASK_EVENTS_STRATEGY,
                },
            }),
        ],
    })
], TasksModule);
function createTaskEventsRabbitMqOptions() {
    var _a, _b;
    const url = (_a = process.env.TASK_RABBITMQ_URL) === null || _a === void 0 ? void 0 : _a.trim();
    if (!url && process.env.TASK_EVENTS_STRATEGY === 'rabbitmq') {
        throw new Error('TASK_RABBITMQ_URL must be set when TASK_EVENTS_STRATEGY is "rabbitmq".');
    }
    return {
        url: url !== null && url !== void 0 ? url : 'amqp://127.0.0.1:5672',
        exchange: ((_b = process.env.TASK_RABBITMQ_EXCHANGE) === null || _b === void 0 ? void 0 : _b.trim()) || 'task-system.events',
    };
}
//# sourceMappingURL=tasks.module.js.map