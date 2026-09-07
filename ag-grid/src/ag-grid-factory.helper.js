"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProviderOverride = isProviderOverride;
exports.AgGridDependencyFactory = AgGridDependencyFactory;
exports.getProviderToken = getProviderToken;
const dataloader_helper_1 = require("@nest-yalc-2/data-loader/dataloader.helper");
const ag_grid_repository_1 = require("./ag-grid.repository");
const generic_resolver_resolver_1 = require("./generic-resolver.resolver");
const generic_service_service_1 = require("./generic-service.service");
function isProviderOverride(resolver) {
    const casted = resolver;
    return !!casted.provider;
}
function AgGridDependencyFactory({ entityModel, dataloader, resolver, service, repository, }) {
    const providers = [];
    const resolverOptions = {
        ...(resolver ?? {}),
        entityModel,
    };
    let dataLoaderToken, serviceToken;
    if (service) {
        if (isProviderOverride(service)) {
            serviceToken = getProviderToken(service.provider.provide);
            providers.push(service.provider);
        }
        else {
            const provider = (0, generic_service_service_1.GenericServiceFactory)(service.entityModel ?? entityModel, service.dbConnection, service.providerClass);
            serviceToken = getProviderToken(provider.provide);
            providers.push(provider);
            if (typeof provider.provide !== 'string') {
                providers.push({
                    provide: serviceToken,
                    useExisting: provider.provide,
                });
            }
        }
    }
    if (dataloader) {
        if (isProviderOverride(dataloader)) {
            dataLoaderToken = getProviderToken(dataloader.provider.provide);
            providers.push(dataloader.provider);
        }
        else {
            dataLoaderToken = (0, dataloader_helper_1.getDataloaderToken)(dataloader.entityModel ?? entityModel);
            providers.push((0, dataloader_helper_1.DataLoaderFactory)(dataloader.databaseKey, dataloader.entityModel ?? entityModel, serviceToken));
        }
    }
    if (resolver !== false) {
        resolverOptions.service = {
            serviceToken,
            dataLoaderToken,
        };
        providers.push(resolver && isProviderOverride(resolver)
            ? resolver.provider
            : (0, generic_resolver_resolver_1.resolverFactory)(resolverOptions));
    }
    return {
        providers,
        repository: repository ?? (0, ag_grid_repository_1.AgGridRepositoryFactory)(entityModel),
    };
}
function getProviderToken(entity) {
    if (entity && typeof entity === 'object' && entity.provide) {
        return typeof entity.provide === 'function'
            ? entity.provide.name
            : entity.provide.toString();
    }
    return typeof entity === 'function' ? entity.name : entity.toString();
}
//# sourceMappingURL=ag-grid-factory.helper.js.map