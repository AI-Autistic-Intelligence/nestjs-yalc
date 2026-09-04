"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniTaskAppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
const task_app_omni_event_service_1 = require("./task-app-omni-event.service");
const task_app_omni_external_ref_service_1 = require("./task-app-omni-external-ref.service");
const task_app_omni_mapper_1 = require("./task-app-omni.mapper");
const task_app_omni_project_service_1 = require("./task-app-omni-project.service");
const task_app_omni_task_service_1 = require("./task-app-omni-task.service");
let OmniTaskAppModule = class OmniTaskAppModule {
};
exports.OmniTaskAppModule = OmniTaskAppModule;
exports.OmniTaskAppModule = OmniTaskAppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                omnikernel_module_1.OmniRecordEntity,
                omnikernel_module_1.OmniCollectionEntity,
                omnikernel_module_1.OmniRelationEntity,
                omnikernel_module_1.OmniExternalRefEntity,
            ], 'default'),
        ],
        providers: [
            task_app_omni_mapper_1.TaskAppOmniMapper,
            task_app_omni_project_service_1.TaskAppOmniProjectService,
            task_app_omni_task_service_1.TaskAppOmniTaskService,
            task_app_omni_event_service_1.TaskAppOmniEventService,
            task_app_omni_external_ref_service_1.TaskAppOmniExternalRefService,
        ],
        exports: [
            task_app_omni_mapper_1.TaskAppOmniMapper,
            task_app_omni_project_service_1.TaskAppOmniProjectService,
            task_app_omni_task_service_1.TaskAppOmniTaskService,
            task_app_omni_event_service_1.TaskAppOmniEventService,
            task_app_omni_external_ref_service_1.TaskAppOmniExternalRefService,
        ],
    })
], OmniTaskAppModule);
//# sourceMappingURL=omni-task-app.module.js.map