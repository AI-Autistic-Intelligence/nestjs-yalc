"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDependencyFactory = AppDependencyFactory;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const wrap_1 = require("@graphql-tools/wrap");
const app_context_module_js_1 = require("./app-context.module.js");
const app_context_service_js_1 = require("./app-context.service.js");
const conn_helper_js_1 = require("@nest-yalc-2/database/conn.helper.js");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const event_emitter_1 = require("@nestjs/event-emitter");
const error_1 = require("graphql/error");
const typeorm_logger_js_1 = require("@nest-yalc-2/logger/typeorm-logger.js");
const def_const_js_1 = require("./def.const.js");
const app_events_js_1 = require("./app.events.js");
const gql_complexity_plugin_js_1 = require("@nest-yalc-2/graphql/plugins/gql-complexity.plugin.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const apollo_1 = require("@nestjs/apollo");
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
function AppDependencyFactory(_context, confs, dbConnNames, gqlModules, options) {
    const { setupEvents = true, setupJwt = true, keepDBConnectionAlive = false, buildSchemaOptions = {}, disablePlayground = false, } = options ?? {};
    const envPath = [];
    if (!options?.envPath) {
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
    common_1.Logger.debug?.(`Using ${envPath}, for environment: ${process.env.NODE_ENV}`);
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
                    const conf = configService.get((0, conn_helper_js_1.getConfNameByConnection)(connName));
                    logger.log?.('log', `Connecting DB ${connName} to host: ${conf?.host}`);
                    return {
                        ...conf,
                        logger: conf?.logging ? logger : undefined,
                        maxQueryExecutionTime: 1000,
                        keepConnectionAlive: keepDBConnectionAlive,
                    };
                },
            }));
        });
    }
    const providers = [];
    class ApolloPluginsModule {
        static forRoot() {
            return {
                module: ApolloPluginsModule,
                providers: [
                    {
                        provide: 'APOLLO_PLUGINS',
                        useFactory: (...gqlPlugins) => {
                            return gqlPlugins;
                        },
                        inject: [...(options?.gqlPlugin ?? [])],
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
                        const opPrefix = options?.operationPrefix ?? conf?.operationPrefix;
                        const rename = (name) => {
                            if (!opPrefix || name.startsWith('_'))
                                return name;
                            if (options?.buildSchemaOptions?.orphanedTypes?.some((cl) => (0, class_helper_js_1.isClass)(cl) && cl.name === name))
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
                        const graphQLError = error instanceof error_1.GraphQLError ? error : undefined;
                        const exception = graphQLError?.extensions?.exception;
                        const message = exception?.response?.message ||
                            graphQLError?.message ||
                            formattedError.message;
                        if (conf && (conf.isDev || conf.isTest)) {
                            return {
                                ...formattedError,
                                message,
                            };
                        }
                        const productionError = {
                            message,
                            extensions: {
                                path: formattedError.path,
                                code: formattedError.extensions?.code,
                                exception: graphQLError?.originalError,
                            },
                        };
                        return productionError;
                    },
                    playground: conf?.isDev && !disablePlayground
                        ? {
                            endpoint: `${conf?.apiPrefix}/graphql`,
                            settings: { 'request.credentials': 'include' },
                        }
                        : false,
                    debug: conf?.isDev,
                    context: async ({ request, reply, ...rest }) => {
                        await eventEmitter.emitAsync(app_events_js_1.AppEvents.BEFORE_GQL_CONTEXT_MIDDLEWARE, request, reply);
                        return {
                            request,
                            response: reply,
                            ...rest,
                        };
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
            useFactory: async (configService) => ({
                secret: configService.get(def_const_js_1.CURAPP_CONF_ALIAS)?.jwtSecretPrivate,
                signOptions: {
                    expiresIn: 3600,
                },
            }),
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