export class TelemetryEventStrategy {
    constructor(strategy, telemetry, options) {
        this.strategy = strategy;
        this.telemetry = telemetry;
        this.options = options;
    }
    emit(path, payload, options) {
        return this.telemetry.measure(`event-strategy.${this.options.name}.emit`, () => this.strategy.emit(path, payload, options), this.attributes('emit', path));
    }
    emitAsync(path, payload, options) {
        return this.telemetry.measure(`event-strategy.${this.options.name}.emitAsync`, () => this.strategy.emitAsync(path, payload, options), this.attributes('emitAsync', path));
    }
    async onModuleDestroy() {
        const destroyable = this.strategy;
        if (typeof destroyable.onModuleDestroy === 'function') {
            await destroyable.onModuleDestroy();
        }
    }
    attributes(operation, path) {
        return {
            'yalc.strategy.kind': 'event',
            'yalc.strategy.name': this.options.name,
            'yalc.strategy.transport': this.options.transport,
            'yalc.strategy.operation': operation,
            'yalc.strategy.path': path,
        };
    }
}
//# sourceMappingURL=telemetry-event.strategy.js.map