import { EventEmitter2 } from '@nestjs/event-emitter';
export class NestLocalEventStrategy {
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
export const NestLocalEventStrategyProvider = (provide, options = {}) => ({
    provide,
    useFactory: (eventEmitter) => {
        const _options = {
            baseUrl: '',
            NestLocalStrategy: NestLocalEventStrategy,
            ...options,
        };
        return new _options.NestLocalStrategy(eventEmitter);
    },
    inject: [EventEmitter2],
});
//# sourceMappingURL=nest-local-event.strategy.js.map