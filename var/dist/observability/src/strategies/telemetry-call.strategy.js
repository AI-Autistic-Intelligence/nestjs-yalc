"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryCallStrategy = void 0;
class TelemetryCallStrategy {
    constructor(strategy, telemetry, options) {
        this.strategy = strategy;
        this.telemetry = telemetry;
        this.options = options;
    }
    get baseUrl() {
        return this.strategy.baseUrl;
    }
    set baseUrl(value) {
        this.strategy.baseUrl = value;
    }
    call(path, options) {
        return this.measure('call', path, () => this.strategy.call(path, options));
    }
    get(path, options) {
        return this.measure('get', path, () => this.strategy.get(path, options));
    }
    post(path, options) {
        return this.measure('post', path, () => this.strategy.post(path, options));
    }
    measure(operation, path, callback) {
        return this.telemetry.measure(`api-strategy.${this.options.name}.${operation}`, callback, {
            'yalc.strategy.kind': 'call',
            'yalc.strategy.name': this.options.name,
            'yalc.strategy.transport': this.options.transport,
            'yalc.strategy.operation': operation,
            'yalc.strategy.path': path,
        });
    }
}
exports.TelemetryCallStrategy = TelemetryCallStrategy;
//# sourceMappingURL=telemetry-call.strategy.js.map