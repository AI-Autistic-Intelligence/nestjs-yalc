export function Observed(name) {
    return (target, propertyKey, descriptor) => {
        const original = descriptor.value;
        const operationName = name ?? `${target.constructor.name}.${String(propertyKey)}`;
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
    const source = instance;
    return source.telemetry ?? source.telemetryService;
}
//# sourceMappingURL=observed.decorator.js.map