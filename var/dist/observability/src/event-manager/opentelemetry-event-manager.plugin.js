"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryEventManagerPlugin = void 0;
exports.matchesEventPattern = matchesEventPattern;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_manager_1 = require("@nest-yalc-2/event-manager");
const tokens_js_1 = require("../tokens.js");
const telemetry_service_js_1 = require("../telemetry.service.js");
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
exports.OpenTelemetryEventManagerPlugin = OpenTelemetryEventManagerPlugin;
exports.OpenTelemetryEventManagerPlugin = OpenTelemetryEventManagerPlugin = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)(tokens_js_1.OBSERVABILITY_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [event_manager_1.YalcEventService,
        telemetry_service_js_1.TelemetryService, Object])
], OpenTelemetryEventManagerPlugin);
function matchesEventPattern(eventName, pattern) {
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