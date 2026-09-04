"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniScopedBackendProvidersFactory = omniScopedBackendProvidersFactory;
exports.omniBackendServiceToken = omniBackendServiceToken;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crud_gen_helpers_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.helpers.js");
const generic_service_js_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.service.js");
const generic_repository_js_1 = require("@nestjs-yalc/crud-gen/typeorm/generic.repository.js");
const data_loader_1 = require("@nestjs-yalc/data-loader");
const event_emitter_1 = require("@nestjs/event-emitter");
const omni_scope_js_1 = require("./omni-scope.js");
function omniScopedBackendProvidersFactory(options) {
    var _a, _b, _c;
    const serviceToken = (_a = options.serviceToken) !== null && _a !== void 0 ? _a : (0, generic_service_js_1.getServiceToken)(options.entityModel);
    const serviceProviderToken = (_b = options.serviceProvider) !== null && _b !== void 0 ? _b : serviceToken;
    const additionalInject = (_c = options.additionalInject) !== null && _c !== void 0 ? _c : [];
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