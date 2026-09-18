"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeStandaloneFunction = exports.curriedExecuteStandaloneFunction = exports.executeFunctionForApp = void 0;
exports.isDynamicModule = isDynamicModule;
const app_bootstrap_standalone_helper_js_1 = require("./app-bootstrap-standalone.helper.js");
const lodash_es_1 = require("lodash-es");
function isDynamicModule(module) {
    return module.module !== undefined;
}
const executeFunctionForApp = async (app, serviceType, fn, options) => {
    const nestApp = await app.getApp();
    await nestApp.init();
    const service = await nestApp.resolve(serviceType);
    await fn(service).finally(async () => {
        if (options.closeApp)
            await app.closeApp();
    });
};
exports.executeFunctionForApp = executeFunctionForApp;
const curriedExecuteStandaloneFunction = async (module, options) => (0, lodash_es_1.curry)(exports.executeFunctionForApp)(await new app_bootstrap_standalone_helper_js_1.StandaloneAppBootstrap(isDynamicModule(module) ? module.module.name : module.name, module, options).initApp());
exports.curriedExecuteStandaloneFunction = curriedExecuteStandaloneFunction;
const executeStandaloneFunction = async (module, serviceType, fn, options, executeOptions = {}) => {
    return (await (0, exports.curriedExecuteStandaloneFunction)(module, options))(serviceType, fn, executeOptions);
};
exports.executeStandaloneFunction = executeStandaloneFunction;
//# sourceMappingURL=app.helper.js.map