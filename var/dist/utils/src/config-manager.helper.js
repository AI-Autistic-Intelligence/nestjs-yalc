"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigValueManager = void 0;
exports.checkForDuplicateKeys = checkForDuplicateKeys;
function checkForDuplicateKeys(keys) {
    const keySet = new Set();
    for (const key of keys) {
        if (keySet.has(key)) {
            throw new Error(`Duplicate key found in configuration: ${key}`);
        }
        keySet.add(key);
    }
}
const normalizeKeys = (keyOrKeys) => Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
class ConfigValueManager {
    static { this.value = (currentKey, configurations, defaultValue) => {
        const foundKeys = new Set();
        const normalizeReturnValue = (returnValue) => {
            if (typeof returnValue === 'function') {
                return returnValue();
            }
            return returnValue;
        };
        const _configurations = Array.isArray(configurations)
            ? configurations
            : [configurations];
        const allKeys = _configurations
            .map((tuple) => normalizeKeys(tuple.k))
            .flat();
        checkForDuplicateKeys(allKeys);
        for (const { k: keys, v: value } of _configurations) {
            const normalizedKeys = normalizeKeys(keys);
            normalizedKeys.forEach((key) => foundKeys.add(key));
            if (normalizedKeys.includes(currentKey)) {
                return normalizeReturnValue(value);
            }
        }
        return normalizeReturnValue(defaultValue);
    }; }
    static { this.is = (currentKey, keys, isNegative = false) => {
        const _tuple = {
            k: normalizeKeys(keys),
            v: !isNegative,
        };
        return this.value(currentKey, _tuple, isNegative);
    }; }
    static { this.only = (currentKey, keys, value) => {
        const _tuple = { k: normalizeKeys(keys), v: value };
        return this.value(currentKey, _tuple, undefined);
    }; }
    static { this.skip = (currentKey, keys, value) => {
        const _tuple = {
            k: normalizeKeys(keys),
            v: undefined,
        };
        return this.value(currentKey, _tuple, value);
    }; }
}
exports.ConfigValueManager = ConfigValueManager;
//# sourceMappingURL=config-manager.helper.js.map