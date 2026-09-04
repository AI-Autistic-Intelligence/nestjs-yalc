"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observed = Observed;
function Observed(name) {
    return (target, propertyKey, descriptor) => {
        const original = descriptor.value;
        const operationName = name !== null && name !== void 0 ? name : `${target.constructor.name}.${String(propertyKey)}`;
        descriptor.value = function (...args) {
            const telemetry = resolveTelemetryService(this);
            if (!telemetry) {
                return original.apply(this, args);
            }
            return telemetry.measure(operationName, () => original.apply(this, args));
        };
        return descriptor;
    };
}
function resolveTelemetryService(instance) {
    var _a;
    const source = instance;
    return (_a = source.telemetry) !== null && _a !== void 0 ? _a : source.telemetryService;
}
//# sourceMappingURL=observed.decorator.js.map