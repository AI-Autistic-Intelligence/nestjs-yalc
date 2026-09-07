"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNameBuilder = exports.EventType = void 0;
exports.EventType = 'EventType';
class EventNameBuilder {
    static events(domain, actions) {
        const baseEvent = `${this.version?.base ? this.version?.base + '.' : ''}${domain}`;
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