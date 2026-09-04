"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIDArg = isIDArg;
exports.isExtraInputStrict = isExtraInputStrict;
exports.checkFinalId = checkFinalId;
exports.isCustomSingleQueryOptions = isCustomSingleQueryOptions;
exports.hasExtraArgs = hasExtraArgs;
exports.hasFilters = hasFilters;
exports.generateDecorators = generateDecorators;
function isIDArg(arg) {
    return !!arg.name;
}
function isExtraInputStrict(input) {
    const casted = input;
    return !!casted.middleware;
}
function checkFinalId(finalId) {
    if (typeof finalId === 'undefined') {
        throw new Error("Can't have an undefined ID");
    }
}
function isCustomSingleQueryOptions(option) {
    return option.isSingleResource === true;
}
function hasExtraArgs(option) {
    return !!option.extraArgs;
}
function hasFilters(findOptions) {
    return ((findOptions.where &&
        Object.values(findOptions.where.filters).length > 0) ||
        (findOptions.order && Object.values(findOptions.order).length > 0));
}
function generateDecorators(methodFn, defaultName, typeFunc, options) {
    var _a, _b, _c;
    if (options === null || options === void 0 ? void 0 : options.disabled)
        return [];
    return [
        ...((_a = options === null || options === void 0 ? void 0 : options.decorators) !== null && _a !== void 0 ? _a : []),
        methodFn(typeFunc, Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.queryParams), { name: (_c = (_b = options === null || options === void 0 ? void 0 : options.queryParams) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : defaultName })),
    ];
}
//# sourceMappingURL=generic-resolver.type.js.map