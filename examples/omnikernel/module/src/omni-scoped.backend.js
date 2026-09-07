"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniScopedBackendProvidersFactory = omniScopedBackendProvidersFactory;
exports.omniBackendServiceToken = omniBackendServiceToken;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const generic_service_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service.js");
const generic_repository_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.repository.js");
const data_loader_1 = require("@nest-yalc-2/data-loader");
const event_emitter_1 = require("@nestjs/event-emitter");
const omni_scope_js_1 = require("./omni-scope.js");
function omniScopedBackendProvidersFactory(options) {
    const serviceToken = options.serviceToken ?? (0, generic_service_js_1.getServiceToken)(options.entityModel);
    const serviceProviderToken = options.serviceProvider ?? serviceToken;
    const additionalInject = options.additionalInject ?? [];
    const serviceProvider = {
        provide: serviceProviderToken,
        scope: common_1.Scope.REQUEST,
        useFactory: (repository, scope, moduleOptions, ...additionalDependencies) => options.createService(repository, scope, moduleOptions, ...additionalDependencies),
        inject: [
            (0, typeorm_1.getRepositoryToken)(options.entityModel, options.dbConnection),
            omni_scope_js_1.OmniScopeContext,
            omni_scope_js_1.OMNI_KERNEL_OPTIONS,
            ...additionalInject,
        ],
    };
    const loaderProvider = {
        provide: (0, data_loader_1.getDataloaderToken)(options.entityModel),
        scope: common_1.Scope.REQUEST,
        useFactory: (service, scope, events) => new data_loader_1.GQLDataLoader((0, data_loader_1.getFn)(service), 'guid', events, {
            cacheKeyFn: (key) => scope.cacheKey(key),
        }),
        inject: [serviceToken, omni_scope_js_1.OmniScopeContext, event_emitter_1.EventEmitter2],
    };
    const serviceAlias = serviceProviderToken === serviceToken
        ? []
        : [{ provide: serviceToken, useExisting: serviceProviderToken }];
    return {
        providers: [serviceProvider, ...serviceAlias, loaderProvider],
        repository: (0, generic_repository_js_1.CGExtendedRepositoryFactory)(options.entityModel),
    };
}
function omniBackendServiceToken(provider) {
    return (0, crud_gen_helpers_js_1.getProviderToken)(provider);
}
//# sourceMappingURL=omni-scoped.backend.js.map