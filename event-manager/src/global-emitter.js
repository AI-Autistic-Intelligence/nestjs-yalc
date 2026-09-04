"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yalcStaticEventEmitter = exports.createGlobalEventEmitter = void 0;
exports.getYalcGlobalEventEmitter = getYalcGlobalEventEmitter;
exports.setYalcGlobalEventEmitter = setYalcGlobalEventEmitter;
const event_emitter_1 = require("@nestjs/event-emitter");
let eventEmitter;
const createGlobalEventEmitter = () => {
    eventEmitter = new event_emitter_1.EventEmitter2({
        maxListeners: 1000,
        wildcard: true,
    });
    return eventEmitter;
};
exports.createGlobalEventEmitter = createGlobalEventEmitter;
exports.yalcStaticEventEmitter = (0, exports.createGlobalEventEmitter)();
function getYalcGlobalEventEmitter() {
    if (!eventEmitter)
        eventEmitter = exports.yalcStaticEventEmitter;
    return eventEmitter;
}
function setYalcGlobalEventEmitter(_eventEmitter) {
    eventEmitter = _eventEmitter;
}
//# sourceMappingURL=global-emitter.js.map