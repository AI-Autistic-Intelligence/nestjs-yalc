"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OmniKernelB2TestAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniKernelB2TestAppModule = void 0;
const apollo_1 = require("@nestjs/apollo");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const uuid_scalar_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar");
const omni_api_module_1 = require("./omni-api.module");
const scopeFromAuthenticatedRequest = (request) => {
    var _a, _b;
    const authorization = (_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const scopeId = (_b = /^Bearer omnikernel-b2:(scope-(?:alpha|bravo))$/.exec(authorization !== null && authorization !== void 0 ? authorization : '')) === null || _b === void 0 ? void 0 : _b[1];
    if (!scopeId)
        throw new common_1.UnauthorizedException();
    return scopeId;
};
let OmniKernelB2TestAppModule = OmniKernelB2TestAppModule_1 = class OmniKernelB2TestAppModule {
    static register(options) {
        if (options.dialect === 'postgres' && !options.postgresUrl) {
            throw new TypeError('A PostgreSQL URL is required for the postgres test dialect.');
        }
        const dataSourceOptions = options.dialect === 'postgres'
            ? { type: 'postgres', url: options.postgresUrl }
            : { type: 'sqlite', database: ':memory:' };
        return {
            module: OmniKernelB2TestAppModule_1,
            imports: [
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: true,
                    path: '/graphql',
                    context: ({ req }) => ({ req }),
                }),
                event_emitter_1.EventEmitterModule.forRoot(),
                typeorm_1.TypeOrmModule.forRoot(Object.assign(Object.assign({}, dataSourceOptions), { dropSchema: true, synchronize: true, autoLoadEntities: true })),
                omni_api_module_1.OmniApiModule.register({
                    dbConnection: 'default',
                    resolveScope: scopeFromAuthenticatedRequest,
                    relationKinds: ['blocks'],
                }),
            ],
            providers: [uuid_scalar_1.UUIDScalar],
        };
    }
};
exports.OmniKernelB2TestAppModule = OmniKernelB2TestAppModule;
exports.OmniKernelB2TestAppModule = OmniKernelB2TestAppModule = OmniKernelB2TestAppModule_1 = __decorate([
    (0, common_1.Module)({})
], OmniKernelB2TestAppModule);
//# sourceMappingURL=omnikernel-b2-test-app.js.map