"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestLocalEventStrategyProvider = exports.NestLocalEventStrategy = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
class NestLocalEventStrategy {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    emit(path, payload, options) {
        return this.eventEmitter.emit(path, payload, options);
    }
    emitAsync(path, payload, options) {
        return this.eventEmitter.emitAsync(path, payload, options);
    }
}
exports.NestLocalEventStrategy = NestLocalEventStrategy;
const NestLocalEventStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (eventEmitter) => {
        const _options = Object.assign({ baseUrl: '', NestLocalStrategy: NestLocalEventStrategy }, options);
        return new _options.NestLocalStrategy(eventEmitter);
    },
    inject: [event_emitter_1.EventEmitter2],
});
exports.NestLocalEventStrategyProvider = NestLocalEventStrategyProvider;
//# sourceMappingURL=nest-local-event.strategy.js.map