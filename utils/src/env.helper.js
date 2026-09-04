"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToArray = void 0;
exports.envIsTrue = envIsTrue;
exports.isProduction = isProduction;
const envToArray = (key) => {
    var _a, _b;
    if (process.env[key] === '')
        return [];
    return ((_b = (_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.split(',').map((v) => v.trim())) !== null && _b !== void 0 ? _b : []);
};
exports.envToArray = envToArray;
function envIsTrue(value) {
    if (!value)
        return false;
    const val = value.toLowerCase();
    return val === 'true' || val === '1' || val === 'on';
}
function isProduction(implicitCheck = true) {
    return (process.env.NODE_ENV === 'production' ||
        (implicitCheck &&
            ['test', 'pipeline', 'development'].every((v) => process.env.NODE_ENV !== v)));
}
//# sourceMappingURL=env.helper.js.map