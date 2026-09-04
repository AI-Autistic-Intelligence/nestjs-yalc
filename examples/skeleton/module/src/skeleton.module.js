"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SkeletonModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const skeleton_user_resolver_js_1 = require("./skeleton-user.resolver.js");
const skeleton_phone_resolver_js_1 = require("./skeleton-phone.resolver.js");
const skeleton_phone_entity_js_1 = require("./skeleton-phone.entity.js");
const skeleton_user_entity_js_1 = require("./skeleton-user.entity.js");
const bindGeneratedDataloaderEventEmitter = (providers) => providers.map((provider) => {
    if (typeof provider !== 'object' || provider === null)
        return provider;
    const providerWithInject = provider;
    if (!Array.isArray(providerWithInject.inject))
        return provider;
    return Object.assign(Object.assign({}, providerWithInject), { inject: providerWithInject.inject.map((token) => token !== null && token !== void 0 ? token : event_emitter_1.EventEmitter2) });
});
let SkeletonModule = SkeletonModule_1 = class SkeletonModule {
    static register(dbConnection) {
        const skeletonPhoneProviders = bindGeneratedDataloaderEventEmitter((0, skeleton_phone_resolver_js_1.skeletonPhoneProvidersFactory)(dbConnection).providers);
        const skeletonUserProviders = bindGeneratedDataloaderEventEmitter((0, skeleton_user_resolver_js_1.skeletonUserProvidersFactory)(dbConnection).providers);
        const eventEmitter = new event_emitter_1.EventEmitter2();
        return {
            module: SkeletonModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature([skeleton_phone_entity_js_1.SkeletonPhone, skeleton_user_entity_js_1.SkeletonUser], dbConnection),
            ],
            providers: [
                {
                    provide: event_emitter_1.EventEmitter2,
                    useValue: eventEmitter,
                },
                ...skeletonPhoneProviders,
                ...skeletonUserProviders,
            ],
            exports: [
                event_emitter_1.EventEmitter2,
                ...skeletonPhoneProviders,
                ...skeletonUserProviders,
            ],
        };
    }
};
exports.SkeletonModule = SkeletonModule;
exports.SkeletonModule = SkeletonModule = SkeletonModule_1 = __decorate([
    (0, common_1.Module)({})
], SkeletonModule);
//# sourceMappingURL=skeleton.module.js.map