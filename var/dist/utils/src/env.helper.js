"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToArray = void 0;
exports.envIsTrue = envIsTrue;
exports.isProduction = isProduction;
const envToArray = (key) => {
    if (process.env[key] === '')
        return [];
    return (process.env[key]?.split(',').map((v) => v.trim()) ?? []);
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