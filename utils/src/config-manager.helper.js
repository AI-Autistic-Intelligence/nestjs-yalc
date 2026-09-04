"use strict";
var _a;
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
}
exports.ConfigValueManager = ConfigValueManager;
_a = ConfigValueManager;
ConfigValueManager.value = (currentKey, configurations, defaultValue) => {
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
};
ConfigValueManager.is = (currentKey, keys, isNegative = false) => {
    const _tuple = {
        k: normalizeKeys(keys),
        v: !isNegative,
    };
    return _a.value(currentKey, _tuple, isNegative);
};
ConfigValueManager.only = (currentKey, keys, value) => {
    const _tuple = { k: normalizeKeys(keys), v: value };
    return _a.value(currentKey, _tuple, undefined);
};
ConfigValueManager.skip = (currentKey, keys, value) => {
    const _tuple = {
        k: normalizeKeys(keys),
        v: undefined,
    };
    return _a.value(currentKey, _tuple, value);
};
//# sourceMappingURL=config-manager.helper.js.map