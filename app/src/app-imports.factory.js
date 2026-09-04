"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDependencyFactory = AppDependencyFactory;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const wrap_1 = require("@graphql-tools/wrap");
const app_context_module_js_1 = require("./app-context.module.js");
const app_context_service_js_1 = require("./app-context.service.js");
const conn_helper_js_1 = require("@nestjs-yalc/database/conn.helper.js");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const event_emitter_1 = require("@nestjs/event-emitter");
const error_1 = require("graphql/error");
const typeorm_logger_js_1 = require("@nestjs-yalc/logger/typeorm-logger.js");
const def_const_js_1 = require("./def.const.js");
const app_events_js_1 = require("./app.events.js");
const gql_complexity_plugin_js_1 = require("@nestjs-yalc/graphql/plugins/gql-complexity.plugin.js");
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
const apollo_1 = require("@nestjs/apollo");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function AppDependencyFactory(_context, confs, dbConnNames, gqlModules, options) {
    var _a;
    const { setupEvents = true, setupJwt = true, keepDBConnectionAlive = false, buildSchemaOptions = {}, disablePlayground = false, } = options !== null && options !== void 0 ? options : {};
    const envPath = [];
    if (!(options === null || options === void 0 ? void 0 : options.envPath)) {
        envPath.push('.env');
        if (process.env.NODE_ENV) {
            envPath.push(`.env.${process.env.NODE_ENV}`);
            if (process.env.NODE_ENV !== 'production')
                envPath.push('conf/dist/.env.shared');
            if (process.env.DOCKER_CONTAINER === '1')
                envPath.push(`conf/dist/.env.docker.${process.env.NODE_ENV}`);
            else {
                envPath.push(`conf/dist/.env.local.${process.env.NODE_ENV}`);
            }
        }
    }
    (_a = common_1.Logger.debug) === null || _a === void 0 ? void 0 : _a.call(common_1.Logger, `Using ${envPath}, for environment: ${process.env.NODE_ENV}`);
    const configModule = config_1.ConfigModule.forRoot({
        load: confs,
        envFilePath: envPath,
    });
    const imports = [
        configModule,
        app_context_module_js_1.AppContextModule,
        axios_1.HttpModule,
    ];
    if (dbConnNames.length) {
        dbConnNames.forEach((connName) => {
            imports.push(typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService, typeorm_logger_js_1.TypeORMLogger],
                name: connName,
                useFactory: async (configService, logger) => {
                    var _a;
                    const conf = configService.get((0, conn_helper_js_1.getConfNameByConnection)(connName));
                    (_a = logger.log) === null || _a === void 0 ? void 0 : _a.call(logger, 'log', `Connecting DB ${connName} to host: ${conf === null || conf === void 0 ? void 0 : conf.host}`);
                    return Object.assign(Object.assign({}, conf), { logger: (conf === null || conf === void 0 ? void 0 : conf.logging) ? logger : undefined, maxQueryExecutionTime: 1000, keepConnectionAlive: keepDBConnectionAlive });
                },
            }));
        });
    }
    const providers = [];
    class ApolloPluginsModule {
        static forRoot() {
            var _a;
            return {
                module: ApolloPluginsModule,
                providers: [
                    {
                        provide: 'APOLLO_PLUGINS',
                        useFactory: (...gqlPlugins) => {
                            return gqlPlugins;
                        },
                        inject: [...((_a = options === null || options === void 0 ? void 0 : options.gqlPlugin) !== null && _a !== void 0 ? _a : [])],
                    },
                ],
                exports: ['APOLLO_PLUGINS'],
            };
        }
    }
    if (gqlModules.length) {
        imports.push(graphql_1.GraphQLModule.forRootAsync({
            driver: apollo_1.ApolloFederationDriver,
            imports: [ApolloPluginsModule.forRoot()],
            useFactory: async (configService, appContext, eventEmitter, gqlPluginList) => {
                const conf = configService.get(def_const_js_1.CURAPP_CONF_ALIAS);
                return {
                    autoSchemaFile: true,
                    buildSchemaOptions,
                    fieldResolverEnhancers: ['interceptors', 'guards', 'filters'],
                    transformAutoSchemaFile: true,
                    transformSchema: (graphQLSchema) => {
                        var _a;
                        const opPrefix = (_a = options === null || options === void 0 ? void 0 : options.operationPrefix) !== null && _a !== void 0 ? _a : conf === null || conf === void 0 ? void 0 : conf.operationPrefix;
                        const rename = (name) => {
                            var _a, _b;
                            if (!opPrefix || name.startsWith('_'))
                                return name;
                            if ((_b = (_a = options === null || options === void 0 ? void 0 : options.buildSchemaOptions) === null || _a === void 0 ? void 0 : _a.orphanedTypes) === null || _b === void 0 ? void 0 : _b.some((cl) => (0, class_helper_js_1.isClass)(cl) && cl.name === name))
                                return name;
                            return `${opPrefix}_${name}`;
                        };
                        const transformed = (0, wrap_1.wrapSchema)({
                            schema: graphQLSchema,
                            transforms: [
                                new wrap_1.RenameInputObjectFields((_, name) => rename(name)),
                                new wrap_1.RenameInterfaceFields((_, name) => rename(name)),
                                new wrap_1.RenameRootTypes((name) => rename(name)),
                                new wrap_1.RenameTypes((name) => rename(name)),
                                new wrap_1.RenameRootFields((_operationName, name) => rename(name)),
                            ],
                        });
                        appContext.setSchema(transformed);
                        return transformed;
                    },
                    include: gqlModules,
                    useGlobalPrefix: true,
                    formatError: (formattedError, error) => {
                        var _a, _b, _c;
                        const graphQLError = error instanceof error_1.GraphQLError ? error : undefined;
                        const exception = (_a = graphQLError === null || graphQLError === void 0 ? void 0 : graphQLError.extensions) === null || _a === void 0 ? void 0 : _a.exception;
                        const message = ((_b = exception === null || exception === void 0 ? void 0 : exception.response) === null || _b === void 0 ? void 0 : _b.message) ||
                            (graphQLError === null || graphQLError === void 0 ? void 0 : graphQLError.message) ||
                            formattedError.message;
                        if (conf && (conf.isDev || conf.isTest)) {
                            return Object.assign(Object.assign({}, formattedError), { message });
                        }
                        const productionError = {
                            message,
                            extensions: {
                                path: formattedError.path,
                                code: (_c = formattedError.extensions) === null || _c === void 0 ? void 0 : _c.code,
                                exception: graphQLError === null || graphQLError === void 0 ? void 0 : graphQLError.originalError,
                            },
                        };
                        return productionError;
                    },
                    playground: (conf === null || conf === void 0 ? void 0 : conf.isDev) && !disablePlayground
                        ? {
                            endpoint: `${conf === null || conf === void 0 ? void 0 : conf.apiPrefix}/graphql`,
                            settings: { 'request.credentials': 'include' },
                        }
                        : false,
                    debug: conf === null || conf === void 0 ? void 0 : conf.isDev,
                    context: async (_a) => {
                        var { request, reply } = _a, rest = __rest(_a, ["request", "reply"]);
                        await eventEmitter.emitAsync(app_events_js_1.AppEvents.BEFORE_GQL_CONTEXT_MIDDLEWARE, request, reply);
                        return Object.assign({ request, response: reply }, rest);
                    },
                    plugins: [new gql_complexity_plugin_js_1.GqlComplexityPlugin(), ...gqlPluginList],
                };
            },
            inject: [
                config_1.ConfigService,
                app_context_service_js_1.AppContextService,
                event_emitter_1.EventEmitter2,
                'APOLLO_PLUGINS',
            ],
        }));
    }
    if (setupEvents) {
        imports.push(event_emitter_1.EventEmitterModule.forRoot());
    }
    if (setupJwt) {
        imports.push(jwt_1.JwtModule.registerAsync({
            imports: [configModule],
            useFactory: async (configService) => {
                var _a;
                return ({
                    secret: (_a = configService.get(def_const_js_1.CURAPP_CONF_ALIAS)) === null || _a === void 0 ? void 0 : _a.jwtSecretPrivate,
                    signOptions: {
                        expiresIn: 3600,
                    },
                });
            },
            inject: [config_1.ConfigService],
        }));
    }
    return {
        imports,
        providers,
        exports: [],
    };
}
//# sourceMappingURL=app-imports.factory.js.map