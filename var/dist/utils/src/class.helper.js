export function isClass(func) {
    return (typeof func === 'function' &&
        /^class\s/.test(Function.prototype.toString.call(func)));
}
//# sourceMappingURL=class.helper.js.map