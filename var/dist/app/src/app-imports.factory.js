import { Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { wrapSchema, RenameTypes, RenameRootFields, RenameRootTypes, RenameInterfaceFields, RenameInputObjectFields, } from '@graphql-tools/wrap';
import { AppContextModule } from './app-context.module.js';
import { AppContextService } from './app-context.service.js';
import { getConfNameByConnection } from '@nestjs-yalc/database/conn.helper.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLError } from 'graphql/error';
import { TypeORMLogger } from '@nestjs-yalc/logger/typeorm-logger.js';
import { CURAPP_CONF_ALIAS } from './def.const.js';
import { AppEvents } from './app.events.js';
import { GqlComplexityPlugin } from '@nestjs-yalc/graphql/plugins/gql-complexity.plugin.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { ApolloFederationDriver, } from '@nestjs/apollo';
import * as dotenv from 'dotenv';
dotenv.config();
export function AppDependencyFactory(_context, confs, dbConnNames, gqlModules, options) {
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
    Logger.debug?.(`Using ${envPath}, for environment: ${process.env.NODE_ENV}`);
    const configModule = ConfigModule.forRoot({
        load: confs,
        envFilePath: envPath,
    });
    const imports = [
        configModule,
        AppContextModule,
        HttpModule,
    ];
    if (dbConnNames.length) {
        dbConnNames.forEach((connName) => {
            imports.push(TypeOrmModule.forRootAsync({
                inject: [ConfigService, TypeORMLogger],
                name: connName,
                useFactory: async (configService, logger) => {
                    const conf = configService.get(getConfNameByConnection(connName));
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
        imports.push(GraphQLModule.forRootAsync({
            driver: ApolloFederationDriver,
            imports: [ApolloPluginsModule.forRoot()],
            useFactory: async (configService, appContext, eventEmitter, gqlPluginList) => {
                const conf = configService.get(CURAPP_CONF_ALIAS);
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
                            if (options?.buildSchemaOptions?.orphanedTypes?.some((cl) => isClass(cl) && cl.name === name))
                                return name;
                            return `${opPrefix}_${name}`;
                        };
                        const transformed = wrapSchema({
                            schema: graphQLSchema,
                            transforms: [
                                new RenameInputObjectFields((_, name) => rename(name)),
                                new RenameInterfaceFields((_, name) => rename(name)),
                                new RenameRootTypes((name) => rename(name)),
                                new RenameTypes((name) => rename(name)),
                                new RenameRootFields((_operationName, name) => rename(name)),
                            ],
                        });
                        appContext.setSchema(transformed);
                        return transformed;
                    },
                    include: gqlModules,
                    useGlobalPrefix: true,
                    formatError: (formattedError, error) => {
                        const graphQLError = error instanceof GraphQLError ? error : undefined;
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
                        await eventEmitter.emitAsync(AppEvents.BEFORE_GQL_CONTEXT_MIDDLEWARE, request, reply);
                        return {
                            request,
                            response: reply,
                            ...rest,
                        };
                    },
                    plugins: [new GqlComplexityPlugin(), ...gqlPluginList],
                };
            },
            inject: [
                ConfigService,
                AppContextService,
                EventEmitter2,
                'APOLLO_PLUGINS',
            ],
        }));
    }
    if (setupEvents) {
        imports.push(EventEmitterModule.forRoot());
    }
    if (setupJwt) {
        imports.push(JwtModule.registerAsync({
            imports: [configModule],
            useFactory: async (configService) => ({
                secret: configService.get(CURAPP_CONF_ALIAS)?.jwtSecretPrivate,
                signOptions: {
                    expiresIn: 3600,
                },
            }),
            inject: [ConfigService],
        }));
    }
    return {
        imports,
        providers,
        exports: [],
    };
}
//# sourceMappingURL=app-imports.factory.js.map