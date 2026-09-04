import { StandaloneAppBootstrap } from './app-bootstrap-standalone.helper.js';
import { curry } from 'lodash-es';
export function isDynamicModule(module) {
    return module.module !== undefined;
}
export const executeFunctionForApp = async (app, serviceType, fn, options) => {
    const nestApp = await app.getApp();
    await nestApp.init();
    const service = await nestApp.resolve(serviceType);
    await fn(service).finally(async () => {
        if (options.closeApp)
            await app.closeApp();
    });
};
export const curriedExecuteStandaloneFunction = async (module, options) => curry(executeFunctionForApp)(await new StandaloneAppBootstrap(isDynamicModule(module) ? module.module.name : module.name, module, options).initApp());
export const executeStandaloneFunction = async (module, serviceType, fn, options, executeOptions = {}) => {
    return (await curriedExecuteStandaloneFunction(module, options))(serviceType, fn, executeOptions);
};
//# sourceMappingURL=app.helper.js.map