"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOmniExtensionProjectionRegistration = createOmniExtensionProjectionRegistration;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const data_loader_1 = require("@nestjs-yalc/data-loader");
const event_manager_1 = require("@nestjs-yalc/event-manager");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_extension_projection_service_js_1 = require("./omni-extension-projection.service.js");
const omni_scope_js_1 = require("./omni-scope.js");
function dialectFor(dataSource) {
    if (dataSource.options.type !== 'sqlite' &&
        dataSource.options.type !== 'postgres') {
        throw new TypeError('Omni extension projections require a SQLite or PostgreSQL data source.');
    }
    return (0, crud_gen_1.createProjectionDialect)(dataSource.options.type);
}
function defaultGraphqlNames(apiModel) {
    return {
        object: apiModel.name,
        create: `${apiModel.name}CreateInput`,
        patch: `${apiModel.name}UpdateInput`,
        conditions: `${apiModel.name}Condition`,
    };
}
function createOmniExtensionProjectionRegistration(options) {
    var _a, _b, _c, _d;
    const graphqlTypes = (0, crud_gen_1.createProjectionGraphqlTypes)(options.definition, (_b = (_a = options.graphql) === null || _a === void 0 ? void 0 : _a.names) !== null && _b !== void 0 ? _b : defaultGraphqlNames(options.apiModel));
    const serviceToken = (0, crud_gen_1.getServiceToken)(options.apiModel);
    const dataLoaderToken = (0, data_loader_1.getDataloaderToken)(options.apiModel);
    const resource = (0, crud_gen_1.CrudGenResourceFactory)({
        entityModel: options.apiModel,
        backend: false,
        graphql: {
            resolver: Object.assign(Object.assign(Object.assign({ dto: graphqlTypes.object, input: {
                    create: graphqlTypes.create,
                    update: graphqlTypes.patch,
                    conditions: graphqlTypes.conditions,
                } }, (((_c = options.graphql) === null || _c === void 0 ? void 0 : _c.prefix) ? { prefix: options.graphql.prefix } : {})), (options.moduleRefToken !== undefined
                ? { moduleRefToken: options.moduleRefToken }
                : {})), { queries: {
                    getResource: { idName: options.definition.identity.column },
                } }),
            serviceToken,
            dataLoaderToken,
        },
        rest: Object.assign(Object.assign({ dto: graphqlTypes.object, serialize: true }, (((_d = options.rest) === null || _d === void 0 ? void 0 : _d.path) ? { path: options.rest.path } : {})), { idField: options.definition.identity.column, serviceToken }),
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
            scope: common_1.Scope.REQUEST,
            useFactory: (dataSource, scope, events, lifecycle, catalog) => new omni_extension_projection_service_js_1.OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, lifecycle, catalog),
            inject: [
                (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                omni_scope_js_1.OmniScopeContext,
                event_manager_1.YalcEventService,
                options.lifecycle.token,
                options.catalog.token,
            ],
        }
        : options.lifecycle
            ? {
                provide: serviceToken,
                scope: common_1.Scope.REQUEST,
                useFactory: (dataSource, scope, events, lifecycle) => new omni_extension_projection_service_js_1.OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, lifecycle),
                inject: [
                    (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                    omni_scope_js_1.OmniScopeContext,
                    event_manager_1.YalcEventService,
                    options.lifecycle.token,
                ],
            }
            : {
                provide: serviceToken,
                scope: common_1.Scope.REQUEST,
                useFactory: (dataSource, scope, events) => new omni_extension_projection_service_js_1.OmniExtensionProjectionService(dataSource.getRepository(options.entity), dataSource.getRepository(omni_record_entity_js_1.OmniRecordEntity), dataSource, scope, dialectFor(dataSource), events, options.definition, undefined),
                inject: [
                    (0, typeorm_1.getDataSourceToken)(options.dbConnection),
                    omni_scope_js_1.OmniScopeContext,
                    event_manager_1.YalcEventService,
                ],
            };
    const providers = [
        serviceProvider,
        {
            provide: dataLoaderToken,
            scope: common_1.Scope.REQUEST,
            useFactory: (service, scope) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', undefined, {
                cacheKeyFn: (key) => scope.cacheKey(key),
            }),
            inject: [serviceToken, omni_scope_js_1.OmniScopeContext],
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