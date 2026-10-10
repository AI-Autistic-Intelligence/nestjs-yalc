import { getMetadataArgsStorage } from 'typeorm';
import { CrudGenBackendFactory, CrudGenGraphqlFactory, } from './crud-gen.helpers.js';
import { crudRestControllerFactory, } from './api-rest/crud-gen-rest.controller.factory.js';
function hasProviderOverride(value) {
    return !!value && typeof value === 'object' && 'provider' in value;
}
function isGeneratedGraphqlSurface(graphql) {
    return !!graphql && !hasProviderOverride(graphql.resolver);
}
function hasGraphqlServiceToken(graphql) {
    if (!graphql || hasProviderOverride(graphql.resolver)) {
        return false;
    }
    const resolver = graphql.resolver;
    return !!(graphql.serviceToken ?? resolver.service?.serviceToken);
}
function hasGraphqlDataLoaderToken(graphql) {
    if (!graphql || hasProviderOverride(graphql.resolver)) {
        return false;
    }
    const resolver = graphql.resolver;
    return !!(graphql.dataLoaderToken ?? resolver.service?.dataLoaderToken);
}
function hasRestServiceToken(rest) {
    return !!rest && !!rest.serviceToken;
}
function inferPrimaryDatabaseKey(entityModel) {
    const primaryColumns = getMetadataArgsStorage().columns.filter((column) => {
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
    const needsDefaultService = !options?.service &&
        ((!!rest && !hasRestServiceToken(rest)) ||
            (needsGeneratedGraphql && !hasGraphqlServiceToken(graphql)));
    const needsDefaultDataloader = !options?.dataloader &&
        needsGeneratedGraphql &&
        !hasGraphqlDataLoaderToken(graphql);
    if (!options && !needsDefaultService && !needsDefaultDataloader) {
        return undefined;
    }
    const { dbConnection, databaseKey, dataloader, service, ...backendOptions } = options ?? {};
    const result = {
        ...backendOptions,
    };
    if (service !== undefined) {
        result.service = service;
    }
    else if (needsDefaultService) {
        result.service = { dbConnection: dbConnection ?? 'default' };
    }
    if (dataloader !== undefined) {
        result.dataloader = dataloader;
    }
    else if (needsDefaultDataloader) {
        result.dataloader = { databaseKey: databaseKey ?? inferPrimaryDatabaseKey(entityModel) };
    }
    else if (databaseKey) {
        result.dataloader = { databaseKey };
    }
    return result;
}
export function CrudGenResourceFactory({ entityModel, backend, graphql, rest, }) {
    const graphqlOptions = graphql === true ? { resolver: {} } : graphql;
    const restOptions = rest === true ? {} : rest;
    const backendOptions = backend === false
        ? false
        : normalizeBackendOptions(entityModel, backend === true ? true : backend, graphqlOptions, restOptions);
    const backendProviders = backendOptions === false
        ? {
            providers: [],
            repository: undefined,
        }
        : CrudGenBackendFactory({
            entityModel,
            ...backendOptions,
        });
    const graphqlServiceToken = (graphqlOptions && typeof graphqlOptions === 'object' && graphqlOptions.serviceToken) ? graphqlOptions.serviceToken : ('serviceToken' in backendProviders ? backendProviders.serviceToken : undefined);
    const graphqlDataLoaderToken = (graphqlOptions && typeof graphqlOptions === 'object' && graphqlOptions.dataLoaderToken) ? graphqlOptions.dataLoaderToken : ('dataLoaderToken' in backendProviders ? backendProviders.dataLoaderToken : undefined);
    const graphqlProviders = graphqlOptions === false || graphqlOptions === undefined
        ? { providers: [] }
        : CrudGenGraphqlFactory({
            entityModel,
            ...graphqlOptions,
            ...(graphqlServiceToken !== undefined ? { serviceToken: graphqlServiceToken } : {}),
            ...(graphqlDataLoaderToken !== undefined ? { dataLoaderToken: graphqlDataLoaderToken } : {}),
        });
    const restServiceToken = (restOptions && typeof restOptions === 'object' && restOptions.serviceToken) ? restOptions.serviceToken : ('serviceToken' in backendProviders ? backendProviders.serviceToken : undefined);
    const controllers = restOptions === false || restOptions === undefined
        ? []
        : [
            crudRestControllerFactory({
                entityModel,
                ...restOptions,
                ...(restServiceToken !== undefined ? { serviceToken: restServiceToken } : {}),
            }),
        ];
    return {
        providers: [...backendProviders.providers, ...graphqlProviders.providers],
        controllers,
        ...('repository' in backendProviders && backendProviders.repository !== undefined ? { repository: backendProviders.repository } : {}),
        ...('serviceToken' in backendProviders && backendProviders.serviceToken !== undefined ? { serviceToken: backendProviders.serviceToken } : {}),
        ...('dataLoaderToken' in backendProviders && backendProviders.dataLoaderToken !== undefined ? { dataLoaderToken: backendProviders.dataLoaderToken } : {}),
    };
}
//# sourceMappingURL=crud-gen-resource.factory.js.map