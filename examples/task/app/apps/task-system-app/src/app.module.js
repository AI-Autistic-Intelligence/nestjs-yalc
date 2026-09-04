"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const mercurius_1 = require("@nestjs/mercurius");
const typeorm_1 = require("@nestjs/typeorm");
const audit_1 = require("@nestjs-yalc/audit");
const uuid_scalar_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
const observability_1 = require("@nestjs-yalc/observability");
const events_module_1 = require("./events/events.module");
const graphql_relations_resolver_1 = require("./graphql-relations.resolver");
const omni_task_app_module_1 = require("./omni-task-app/omni-task-app.module");
const projects_module_1 = require("./projects/projects.module");
const sync_module_1 = require("./sync/sync.module");
const task_sync_state_projection_1 = require("./sync/task-sync-state.projection");
const tasks_module_1 = require("./tasks/tasks.module");
const task_app_event_module_1 = require("./task-app-event.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: mercurius_1.MercuriusDriver,
                autoSchemaFile: true,
                path: '/graphql',
            }),
            task_app_event_module_1.TaskAppEventModule,
            observability_1.ObservabilityModule.forRoot(() => (0, observability_1.createObservabilityOptionsFromEnv)('task-system-app')),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                dropSchema: true,
                entities: [
                    omnikernel_module_1.OmniNamedEntity,
                    omnikernel_module_1.OmniRecordEntity,
                    omnikernel_module_1.OmniRelationEntity,
                    omnikernel_module_1.OmniCollectionEntity,
                    omnikernel_module_1.OmniDocumentEntity,
                    omnikernel_module_1.OmniExternalRefEntity,
                    task_sync_state_projection_1.TaskSyncStateProjection,
                ],
                synchronize: true,
            }),
            audit_1.MutationJournalModule.forRoot({
                enabled: process.env.MUTATION_JOURNAL_ENABLED !== 'false',
                retentionDays: Number((_a = process.env.MUTATION_JOURNAL_RETENTION_DAYS) !== null && _a !== void 0 ? _a : 30),
            }),
            omni_task_app_module_1.OmniTaskAppModule,
            tasks_module_1.TasksModule,
            projects_module_1.ProjectsModule,
            events_module_1.EventsModule,
            sync_module_1.SyncModule,
        ],
        providers: [
            uuid_scalar_1.UUIDScalar,
            graphql_relations_resolver_1.TaskItemRelationsResolver,
            graphql_relations_resolver_1.TaskEventRelationsResolver,
            graphql_relations_resolver_1.TaskProjectRelationsResolver,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map