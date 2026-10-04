import { Scope, } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getProviderToken } from '@nest-yalc-2/crud-gen/crud-gen.helpers.js';
import { getServiceToken, } from '@nest-yalc-2/crud-gen/typeorm/generic.service.js';
import { CGExtendedRepositoryFactory } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import { GQLDataLoader, getDataloaderToken, getFn, } from '@nest-yalc-2/data-loader';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OMNI_KERNEL_OPTIONS, OmniScopeContext, } from './omni-scope.js';
export function omniScopedBackendProvidersFactory(options) {
    const serviceToken = options.serviceToken ?? getServiceToken(options.entityModel);
    const serviceProviderToken = options.serviceProvider ?? serviceToken;
    const additionalInject = options.additionalInject ?? [];
    const serviceProvider = {
        provide: serviceProviderToken,
        scope: Scope.REQUEST,
        useFactory: (repository, scope, moduleOptions, ...additionalDependencies) => options.createService(repository, scope, moduleOptions, ...additionalDependencies),
        inject: [
            getRepositoryToken(options.entityModel, options.dbConnection),
            OmniScopeContext,
            OMNI_KERNEL_OPTIONS,
            ...additionalInject,
        ],
    };
    const loaderProvider = {
        provide: getDataloaderToken(options.entityModel),
        scope: Scope.REQUEST,
        useFactory: (service, scope, events) => new GQLDataLoader(getFn(service), 'guid', events, {
            cacheKeyFn: (key) => scope.cacheKey(key),
        }),
        inject: [serviceToken, OmniScopeContext, EventEmitter2],
    };
    const serviceAlias = serviceProviderToken === serviceToken
        ? []
        : [{ provide: serviceToken, useExisting: serviceProviderToken }];
    return {
        providers: [serviceProvider, ...serviceAlias, loaderProvider],
        repository: CGExtendedRepositoryFactory(options.entityModel),
    };
}
export function omniBackendServiceToken(provider) {
    return getProviderToken(provider);
}
//# sourceMappingURL=omni-scoped.backend.js.map