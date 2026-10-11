import { StandaloneAppBootstrap } from './app-bootstrap-standalone.helper.js';
import { curry } from 'lodash-es';
export function isDynamicModule(module) {
    return typeof module === 'object' && module !== null && 'module' in module;
}
export const executeFunctionForApp = async (app, serviceType, fn, options) => {
    const nestApp = await app.getApp();
    await nestApp.init();
    const service = await nestApp.resolve(serviceType);
    return fn(service).finally(async () => {
        if (options.closeApp)
            await app.closeApp();
    });
};
/**
 * Curried version of the executeStandaloneFunctionForApp to memoize the app
 * Use it when you need to run the executeStandaloneFunction multiple time
 * @see https://lodash.com/docs/#curry
 * @param module
 * @returns
 */
export const curriedExecuteStandaloneFunction = async (module, options) => curry(executeFunctionForApp)(await new StandaloneAppBootstrap(isDynamicModule(module) ? module.module.name : module.name, module, options).initApp());
/**
 *
 * @param module
 * @param serviceType
 * @param fn
 * @returns
 */
export const executeStandaloneFunction = async (module, serviceType, fn, options, executeOptions = {}) => {
    return (await curriedExecuteStandaloneFunction(module, options))(serviceType, fn, executeOptions);
};
//# sourceMappingURL=app.helper.js.map