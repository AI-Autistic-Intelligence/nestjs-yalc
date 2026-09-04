"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const skeleton_module_1 = require("@nestjs-yalc/skeleton-module");
const users_resource_1 = require("./users.resource");
const users_errors_controller_1 = require("./users.errors.controller");
const users_client_controller_1 = require("./users-client.controller");
const users_logging_controller_1 = require("./users.logging.controller");
const users_validation_controller_1 = require("./users.validation.controller");
const cls_module_js_1 = require("@nestjs-yalc/app/cls.module.js");
const api_strategy_1 = require("@nestjs-yalc/api-strategy");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_manager_1 = require("@nestjs-yalc/event-manager");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([skeleton_module_1.SkeletonUser], 'default'),
            axios_1.HttpModule,
            cls_module_js_1.YalcClsModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            event_manager_1.EventModule.forRootAsync(),
        ],
        controllers: [
            users_resource_1.UsersController,
            users_errors_controller_1.UsersErrorsController,
            users_client_controller_1.UsersClientController,
            users_logging_controller_1.UsersLoggingController,
            users_validation_controller_1.UsersValidationController,
        ],
        providers: [
            ...users_resource_1.usersResourceProviders,
            skeleton_module_1.UsersApiClient,
            {
                provide: skeleton_module_1.USERS_CLIENT_LOCAL_API_STRATEGY,
                useFactory: (httpAdapterHost, clsService) => {
                    const configService = {
                        values: {},
                    };
                    return new api_strategy_1.NestLocalCallStrategy(httpAdapterHost, clsService, configService);
                },
                inject: [core_1.HttpAdapterHost, cls_module_js_1.YalcGlobalClsService],
            },
            {
                provide: skeleton_module_1.USERS_CLIENT_HTTP_API_STRATEGY,
                useFactory: (httpService, clsService) => {
                    var _a, _b;
                    const baseUrl = ((_a = process.env.USERS_HTTP_BASE_URL) === null || _a === void 0 ? void 0 : _a.trim()) ||
                        ((_b = process.env.SKELETON_BASE_URL) === null || _b === void 0 ? void 0 : _b.trim()) ||
                        'http://127.0.0.1:3000';
                    return new api_strategy_1.NestHttpCallStrategy(httpService, clsService, baseUrl);
                },
                inject: [axios_1.HttpService, cls_module_js_1.YalcGlobalClsService],
            },
            (0, api_strategy_1.ApiCallStrategySelectorProvider)({
                provide: skeleton_module_1.USERS_CLIENT_API_STRATEGY,
                defaultStrategy: 'http',
                strategies: {
                    local: skeleton_module_1.USERS_CLIENT_LOCAL_API_STRATEGY,
                    http: skeleton_module_1.USERS_CLIENT_HTTP_API_STRATEGY,
                },
                selector: {
                    useFactory: () => process.env.USERS_API_STRATEGY,
                },
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map