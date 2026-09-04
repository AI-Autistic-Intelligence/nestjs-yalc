"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithPluginSystem = WithPluginSystem;
class DefaultBase {
}
function WithPluginSystem(Base = DefaultBase) {
    class PluginSystemWrapper extends Base {
        constructor() {
            super(...arguments);
            this.plugins = [];
        }
        registerPlugin(plugin) {
            this.plugins.push(plugin);
        }
        unregisterPlugin(plugin) {
            this.plugins = this.plugins.filter((p) => p !== plugin);
        }
        invokePlugins(methodName, ...args) {
            var _a, _b;
            for (const plugin of this.plugins) {
                (_b = (_a = plugin.pluginMethods)[methodName]) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
            }
        }
    }
    return PluginSystemWrapper;
}
//# sourceMappingURL=plugin.helper.js.map