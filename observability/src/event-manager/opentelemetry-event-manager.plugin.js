"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryEventManagerPlugin = void 0;
exports.matchesEventPattern = matchesEventPattern;
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
exports.OpenTelemetryEventManagerPlugin = OpenTelemetryEventManagerPlugin = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(tokens_js_1.OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [event_manager_1.YalcEventService,
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