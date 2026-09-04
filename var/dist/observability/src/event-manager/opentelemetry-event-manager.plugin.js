import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, } from '@nestjs/common';
import { YalcEventService } from '@nestjs-yalc/event-manager';
import { OBSERVABILITY_OPTIONS } from '../tokens.js';
import { TelemetryService } from '../telemetry.service.js';
let OpenTelemetryEventManagerPlugin = class OpenTelemetryEventManagerPlugin {
    constructor(events, telemetry, options) {
        this.events = events;
        this.telemetry = telemetry;
        this.options = options;
        this.listener = (event, payload) => {
            this.handleEvent(event, payload);
        };
    }
    onModuleInit() {
        if (!this.options.enabled || !this.options.eventManager.enabled) {
            return;
        }
        this.events.emitter.onAny(this.listener);
    }
    onModuleDestroy() {
        this.events.emitter.offAny(this.listener);
    }
    handleEvent(event, payload) {
        const eventName = Array.isArray(event) ? event.join('.') : event;
        if (!this.shouldRecord(eventName)) {
            return;
        }
        this.telemetry.recordYalcEvent(eventName, payload);
    }
    shouldRecord(eventName) {
        return (this.matchesAny(eventName, this.options.eventManager.listenTo) &&
            !this.matchesAny(eventName, this.options.eventManager.ignore));
    }
    matchesAny(eventName, patterns) {
        return patterns.some((pattern) => matchesEventPattern(eventName, pattern));
    }
};
OpenTelemetryEventManagerPlugin = __decorate([
    Injectable(),
    __param(2, Inject(OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [YalcEventService,
        TelemetryService, Object])
], OpenTelemetryEventManagerPlugin);
export { OpenTelemetryEventManagerPlugin };
export function matchesEventPattern(eventName, pattern) {
    if (pattern === '**') {
        return true;
    }
    const source = pattern
        .split('.')
        .map((part) => {
        if (part === '**')
            return '.*';
        if (part === '*')
            return '[^.]+';
        return escapeRegExp(part);
    })
        .join('\\.');
    return new RegExp(`^${source}$`).test(eventName);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=opentelemetry-event-manager.plugin.js.map