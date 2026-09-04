"use strict";
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
exports.CrudGenResourceFactory = CrudGenResourceFactory;
const typeorm_1 = require("typeorm");
const crud_gen_helpers_js_1 = require("./crud-gen.helpers.js");
const crud_gen_rest_controller_factory_js_1 = require("./api-rest/crud-gen-rest.controller.factory.js");
function hasProviderOverride(value) {
    return !!value && typeof value === 'object' && 'provider' in value;
}
function isGeneratedGraphqlSurface(graphql) {
    return !!graphql && !hasProviderOverride(graphql.resolver);
}
function hasGraphqlServiceToken(graphql) {
    var _a, _b;
    if (!graphql || hasProviderOverride(graphql.resolver)) {
        return false;
    }
    const resolver = graphql.resolver;
    return !!((_a = graphql.serviceToken) !== null && _a !== void 0 ? _a : (_b = resolver.service) === null || _b === void 0 ? void 0 : _b.serviceToken);
}
function hasGraphqlDataLoaderToken(graphql) {
    var _a, _b;
    if (!graphql || hasProviderOverride(graphql.resolver)) {
        return false;
    }
    const resolver = graphql.resolver;
    return !!((_a = graphql.dataLoaderToken) !== null && _a !== void 0 ? _a : (_b = resolver.service) === null || _b === void 0 ? void 0 : _b.dataLoaderToken);
}
function hasRestServiceToken(rest) {
    return !!rest && !!rest.serviceToken;
}
function inferPrimaryDatabaseKey(entityModel) {
    const primaryColumns = (0, typeorm_1.getMetadataArgsStorage)().columns.filter((column) => {
        return (typeof column.target === 'function' &&
            (column.target === entityModel ||
                entityModel.prototype instanceof column.target) &&
            column.options.primary);
    });
    if (primaryColumns.length !== 1) {
        throw new Error(`CrudGenResourceFactory could not infer a single primary key for ${entityModel.name}. ` +
            'Set backend.databaseKey or backend.dataloader.databaseKey explicitly.');
    }
    return primaryColumns[0].propertyName;
}
function normalizeBackendOptions(entityModel, backend, graphql, rest) {
    const options = backend === true ? {} : backend;
    const needsGeneratedGraphql = isGeneratedGraphqlSurface(graphql);
    const needsDefaultService = !(options === null || options === void 0 ? void 0 : options.service) &&
        ((!!rest && !hasRestServiceToken(rest)) ||
            (needsGeneratedGraphql && !hasGraphqlServiceToken(graphql)));
    const needsDefaultDataloader = !(options === null || options === void 0 ? void 0 : options.dataloader) &&
        needsGeneratedGraphql &&
        !hasGraphqlDataLoaderToken(graphql);
    if (!options && !needsDefaultService && !needsDefaultDataloader) {
        return undefined;
    }
    const _a = options !== null && options !== void 0 ? options : {}, { dbConnection, databaseKey, dataloader, service } = _a, backendOptions = __rest(_a, ["dbConnection", "databaseKey", "dataloader", "service"]);
    return Object.assign(Object.assign({}, backendOptions), { service: service !== null && service !== void 0 ? service : (needsDefaultService
            ? { dbConnection: dbConnection !== null && dbConnection !== void 0 ? dbConnection : 'default' }
            : undefined), dataloader: dataloader !== null && dataloader !== void 0 ? dataloader : (needsDefaultDataloader
            ? { databaseKey: databaseKey !== null && databaseKey !== void 0 ? databaseKey : inferPrimaryDatabaseKey(entityModel) }
            : databaseKey
                ? { databaseKey }
                : undefined) });
}
function CrudGenResourceFactory({ entityModel, backend, graphql, rest, }) {
    var _a, _b, _c;
    const graphqlOptions = graphql === true ? { resolver: {} } : graphql;
    const restOptions = rest === true ? {} : rest;
    const backendOptions = backend === false
        ? false
        : normalizeBackendOptions(entityModel, backend === true ? true : backend, graphqlOptions, restOptions);
    const backendProviders = backendOptions === false
        ? {
            providers: [],
            repository: undefined,
            serviceToken: undefined,
            dataLoaderToken: undefined,
        }
        : (0, crud_gen_helpers_js_1.CrudGenBackendFactory)(Object.assign({ entityModel }, backendOptions));
    const graphqlProviders = graphqlOptions === false || graphqlOptions === undefined
        ? { providers: [] }
        : (0, crud_gen_helpers_js_1.CrudGenGraphqlFactory)(Object.assign(Object.assign({ entityModel }, graphqlOptions), { serviceToken: (_a = graphqlOptions.serviceToken) !== null && _a !== void 0 ? _a : backendProviders.serviceToken, dataLoaderToken: (_b = graphqlOptions.dataLoaderToken) !== null && _b !== void 0 ? _b : backendProviders.dataLoaderToken }));
    const controllers = restOptions === false || restOptions === undefined
        ? []
        : [
            (0, crud_gen_rest_controller_factory_js_1.crudRestControllerFactory)(Object.assign(Object.assign({ entityModel }, restOptions), { serviceToken: (_c = restOptions.serviceToken) !== null && _c !== void 0 ? _c : backendProviders.serviceToken })),
        ];
    return {
        providers: [...backendProviders.providers, ...graphqlProviders.providers],
        controllers,
        repository: backendProviders.repository,
        serviceToken: backendProviders.serviceToken,
        dataLoaderToken: backendProviders.dataLoaderToken,
    };
}
//# sourceMappingURL=crud-gen-resource.factory.js.map