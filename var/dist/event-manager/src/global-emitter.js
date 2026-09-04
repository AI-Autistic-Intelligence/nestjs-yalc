import { EventEmitter2 } from '@nestjs/event-emitter';
let eventEmitter;
export const createGlobalEventEmitter = () => {
    eventEmitter = new EventEmitter2({
        maxListeners: 1000,
        wildcard: true,
    });
    return eventEmitter;
};
export const yalcStaticEventEmitter = createGlobalEventEmitter();
export function getYalcGlobalEventEmitter() {
    if (!eventEmitter)
        eventEmitter = yalcStaticEventEmitter;
    return eventEmitter;
}
export function setYalcGlobalEventEmitter(_eventEmitter) {
    eventEmitter = _eventEmitter;
}
//# sourceMappingURL=global-emitter.js.map