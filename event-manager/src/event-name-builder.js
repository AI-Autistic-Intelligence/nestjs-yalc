"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNameBuilder = exports.EventType = void 0;
exports.EventType = 'EventType';
class EventNameBuilder {
    static events(domain, actions) {
        var _a, _b;
        const baseEvent = `${((_a = this.version) === null || _a === void 0 ? void 0 : _a.base) ? ((_b = this.version) === null || _b === void 0 ? void 0 : _b.base) + '.' : ''}${domain}`;
        const actionsWithBaseEvent = {};
        for (const [actionKey, actionValue] of Object.entries(actions)) {
            actionsWithBaseEvent[actionKey] = {
                base: `${baseEvent}.${actionKey}`,
                all: `${baseEvent}.${actionKey}.**`,
            };
            for (const [eventKey, eventValue] of Object.entries(actionValue)) {
                if (eventValue === exports.EventType) {
                    actionsWithBaseEvent[actionKey][eventKey] =
                        `${baseEvent}.${actionKey}.${eventKey}`;
                }
                else {
                    actionsWithBaseEvent[actionKey][eventKey] = eventValue;
                }
            }
        }
        actionsWithBaseEvent.base = baseEvent;
        actionsWithBaseEvent.all = `${baseEvent}.**`;
        return actionsWithBaseEvent;
    }
}
exports.EventNameBuilder = EventNameBuilder;
//# sourceMappingURL=event-name-builder.js.map