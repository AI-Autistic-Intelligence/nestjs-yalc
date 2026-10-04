import { Scope } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { createProjectionDialect, createProjectionGraphqlTypes, CrudGenResourceFactory, getServiceToken, } from '@nest-yalc-2/crud-gen';
import { GQLDataLoader, getDataloaderToken, getFn, } from '@nest-yalc-2/data-loader';
import { YalcEventService } from '@nest-yalc-2/event-manager';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniExtensionProjectionService } from './omni-extension-projection.service.js';
import { OmniScopeContext } from './omni-scope.js';
function dialectFor(dataSource) {
    if (dataSource.options.type !== 'sqlite' &&
        dataSource.options.type !== 'postgres') {
        throw new TypeError('Omni extension projections require a SQLite or PostgreSQL data source.');
    }
    return createProjectionDialect(dataSource.options.type);
}
function defaultGraphqlNames(apiModel) {
    return {
        object: apiModel.name,
        create: `${apiModel.name}CreateInput`,
        patch: `${apiModel.name}UpdateInput`,
        conditions: `${apiModel.name}Condition`,
    };
}
export function createOmniExtensionProjectionRegistration(options) {
    const graphqlTypes = createProjectionGraphqlTypes(options.definition, options.graphql?.names ?? defaultGraphqlNames(options.apiModel));
    const serviceToken = getServiceToken(options.apiModel);
    const dataLoaderToken = getDataloaderToken(options.apiModel);
    const resource = CrudGenResourceFactory({
        entityModel: options.apiModel,
        backend: false,
        graphql: {
            resolver: {
                dto: graphqlTypes.object,
                input: {
                    create: graphqlTypes.create,
                    update: graphqlTypes.patch,
                    conditions: graphqlTypes.conditions,
                },
                ...(options.graphql?.prefix ? { prefix: options.graphql.prefix } : {}),
                ...(options.moduleRefToken !== undefined
                    ? { moduleRefToken: options.moduleRefToken }
                    : {}),
                queries: {
                    getResource: { idName: options.definition.identity.column },
                },
            },
            serviceToken,
            dataLoaderToken,
        },
        rest: {
            dto: graphqlTypes.object,
            serialize: true,
            ...(options.rest?.path ? { path: options.rest.path } : {}),
            idField: options.definition.identity.column,
            serviceToken,
        },
    });
    const reader = Object.freeze({
        type: 'extension',
        id: options.definition.id,
        entity: options.entity,
        definition: options.definition,
    });
    const serviceProvider = options.lifecycle && options.catalog
        ? {
            provide: serviceToken,
            scope: Scope.REQUEST,
            useFactory: (dataSource, scope, events, lifecycle, catalog) => new OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, lifecycle, catalog),
            inject: [
                getDataSourceToken(options.dbConnection),
                OmniScopeContext,
                YalcEventService,
                options.lifecycle.token,
                options.catalog.token,
            ],
        }
        : options.lifecycle
            ? {
                provide: serviceToken,
                scope: Scope.REQUEST,
                useFactory: (dataSource, scope, events, lifecycle) => new OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, lifecycle),
                inject: [
                    getDataSourceToken(options.dbConnection),
                    OmniScopeContext,
                    YalcEventService,
                    options.lifecycle.token,
                ],
            }
            : {
                provide: serviceToken,
                scope: Scope.REQUEST,
                useFactory: (dataSource, scope, events) => new OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, undefined),
                inject: [
                    getDataSourceToken(options.dbConnection),
                    OmniScopeContext,
                    YalcEventService,
                ],
            };
    const providers = [
        serviceProvider,
        {
            provide: dataLoaderToken,
            scope: Scope.REQUEST,
            useFactory: (service, scope) => new GQLDataLoader(getFn(service), 'guid', undefined, {
                cacheKeyFn: (key) => scope.cacheKey(key),
            }),
            inject: [serviceToken, OmniScopeContext],
        },
        ...resource.providers,
    ];
    return Object.freeze({
        definition: options.definition,
        entities: Object.freeze([options.entity]),
        reservedRecordKinds: Object.freeze([options.definition.owner.kind]),
        reader,
        graphqlTypes: Object.freeze(graphqlTypes),
        resource,
        controllers: Object.freeze([...resource.controllers]),
        providers: Object.freeze(providers),
        serviceToken,
        dataLoaderToken,
    });
}
//# sourceMappingURL=omni-extension-projection.resource.js.map