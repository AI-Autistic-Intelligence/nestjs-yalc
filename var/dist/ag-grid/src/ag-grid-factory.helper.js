import { DataLoaderFactory, getDataloaderToken, } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridRepositoryFactory, } from './ag-grid.repository';
import { resolverFactory, } from './generic-resolver.resolver';
import { GenericServiceFactory, } from './generic-service.service';
export function isProviderOverride(resolver) {
    const casted = resolver;
    return !!casted.provider;
}
export function AgGridDependencyFactory({ entityModel, dataloader, resolver, service, repository, }) {
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
            const provider = GenericServiceFactory(service.entityModel ?? entityModel, service.dbConnection, service.providerClass);
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
            dataLoaderToken = getDataloaderToken(dataloader.entityModel ?? entityModel);
            providers.push(DataLoaderFactory(dataloader.databaseKey, dataloader.entityModel ?? entityModel, serviceToken));
        }
    }
    if (resolver !== false) {
        resolverOptions.service = {
            serviceToken,
            dataLoaderToken,
        };
        providers.push(resolver && isProviderOverride(resolver)
            ? resolver.provider
            : resolverFactory(resolverOptions));
    }
    return {
        providers,
        repository: repository ?? AgGridRepositoryFactory(entityModel),
    };
}
export function getProviderToken(entity) {
    if (entity && typeof entity === 'object' && entity.provide) {
        return typeof entity.provide === 'function'
            ? entity.provide.name
            : entity.provide.toString();
    }
    return typeof entity === 'function' ? entity.name : entity.toString();
}
//# sourceMappingURL=ag-grid-factory.helper.js.map