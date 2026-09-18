"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNativeClass = isNativeClass;
exports.isES6Class = isES6Class;
exports.isClass = isClass;
function isNativeClass(func, className) {
    return (typeof func === 'function' &&
        func.prototype?.constructor === func &&
        (className ? func.name === className : true));
}
function isES6Class(func, className) {
    return (typeof func === 'function' &&
        /^class\s/.test(func.toString()) &&
        (className ? func.name === className : true));
}
function isClass(func, className) {
    return isNativeClass(func, className) || isES6Class(func, className);
}
//# sourceMappingURL=class.helper.js.map