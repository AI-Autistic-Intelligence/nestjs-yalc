"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategySelectorProvider = StrategySelectorProvider;
exports.ApiCallStrategySelectorProvider = ApiCallStrategySelectorProvider;
exports.EventStrategySelectorProvider = EventStrategySelectorProvider;
function normalizeStrategyKey(strategy) {
    const value = strategy === null || strategy === void 0 ? void 0 : strategy.trim();
    return value ? value : undefined;
}
function StrategySelectorProvider(options) {
    var _a, _b, _c;
    const strategyEntries = Object.entries(options.strategies);
    if (strategyEntries.length === 0) {
        throw new Error('Strategy selector requires at least one strategy.');
    }
    const defaultStrategyIndex = strategyEntries.findIndex(([key]) => key === options.defaultStrategy);
    if (defaultStrategyIndex < 0) {
        throw new Error(`Default strategy "${options.defaultStrategy}" is not registered.`);
    }
    const behavior = (_a = options.unknownStrategyBehavior) !== null && _a !== void 0 ? _a : 'throw';
    const selectorInject = (_c = (_b = options.selector) === null || _b === void 0 ? void 0 : _b.inject) !== null && _c !== void 0 ? _c : [];
    return {
        provide: options.provide,
        useFactory: async (...args) => {
            var _a, _b;
            const strategyInstances = args.slice(0, strategyEntries.length);
            const selectorArgs = args.slice(strategyEntries.length);
            const configuredStrategy = normalizeStrategyKey(await ((_b = (_a = options.selector) === null || _a === void 0 ? void 0 : _a.useFactory) === null || _b === void 0 ? void 0 : _b.call(_a, ...selectorArgs)));
            const selectedStrategy = configuredStrategy !== null && configuredStrategy !== void 0 ? configuredStrategy : options.defaultStrategy;
            const selectedStrategyIndex = strategyEntries.findIndex(([key]) => key === selectedStrategy);
            if (selectedStrategyIndex >= 0) {
                return strategyInstances[selectedStrategyIndex];
            }
            if (behavior === 'fallback') {
                return strategyInstances[defaultStrategyIndex];
            }
            const availableStrategies = strategyEntries
                .map(([key]) => key)
                .join(', ');
            throw new Error(`Unknown strategy "${selectedStrategy}". Available strategies: ${availableStrategies}.`);
        },
        inject: [
            ...strategyEntries.map(([, strategyToken]) => strategyToken),
            ...selectorInject,
        ],
    };
}
function ApiCallStrategySelectorProvider(options) {
    return StrategySelectorProvider(options);
}
function EventStrategySelectorProvider(options) {
    return StrategySelectorProvider(options);
}
//# sourceMappingURL=strategy-selector.provider.js.map