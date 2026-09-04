"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindGeneratedDataloaderEventEmitter = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
const bindGeneratedDataloaderEventEmitter = (providers) => providers.map((provider) => {
    if (typeof provider !== 'object' || provider === null)
        return provider;
    const providerWithInject = provider;
    if (!Array.isArray(providerWithInject.inject))
        return provider;
    return Object.assign(Object.assign({}, providerWithInject), { inject: providerWithInject.inject.map((token) => token !== null && token !== void 0 ? token : event_emitter_1.EventEmitter2) });
});
exports.bindGeneratedDataloaderEventEmitter = bindGeneratedDataloaderEventEmitter;
//# sourceMappingURL=crudgen-provider-compat.js.map