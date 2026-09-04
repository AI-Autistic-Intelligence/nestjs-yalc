function normalizeStrategyKey(strategy) {
    const value = strategy?.trim();
    return value ? value : undefined;
}
export function StrategySelectorProvider(options) {
    const strategyEntries = Object.entries(options.strategies);
    if (strategyEntries.length === 0) {
        throw new Error('Strategy selector requires at least one strategy.');
    }
    const defaultStrategyIndex = strategyEntries.findIndex(([key]) => key === options.defaultStrategy);
    if (defaultStrategyIndex < 0) {
        throw new Error(`Default strategy "${options.defaultStrategy}" is not registered.`);
    }
    const behavior = options.unknownStrategyBehavior ?? 'throw';
    const selectorInject = options.selector?.inject ?? [];
    return {
        provide: options.provide,
        useFactory: async (...args) => {
            const strategyInstances = args.slice(0, strategyEntries.length);
            const selectorArgs = args.slice(strategyEntries.length);
            const configuredStrategy = normalizeStrategyKey(await options.selector?.useFactory?.(...selectorArgs));
            const selectedStrategy = configuredStrategy ?? options.defaultStrategy;
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
export function ApiCallStrategySelectorProvider(options) {
    return StrategySelectorProvider(options);
}
export function EventStrategySelectorProvider(options) {
    return StrategySelectorProvider(options);
}
//# sourceMappingURL=strategy-selector.provider.js.map