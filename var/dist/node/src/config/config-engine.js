"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEngine = void 0;
class ConfigEngine {
    constructor(defaults = {}) {
        this.configStore = new Map();
        for (const [k, v] of Object.entries(defaults)) {
            this.configStore.set(k, v);
        }
    }
    get(key, fallback) {
        const envVal = process.env[key];
        if (envVal !== undefined) {
            if (envVal === 'true')
                return true;
            if (envVal === 'false')
                return false;
            if (!isNaN(Number(envVal)))
                return Number(envVal);
            return envVal;
        }
        if (this.configStore.has(key)) {
            return this.configStore.get(key);
        }
        return fallback;
    }
    set(key, value) {
        this.configStore.set(key, value);
    }
}
exports.ConfigEngine = ConfigEngine;
//# sourceMappingURL=config-engine.js.map