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
    if (options?.disabled)
        return [];
    return [
        ...(options?.decorators ?? []),
        methodFn(typeFunc, {
            ...options?.queryParams,
            name: options?.queryParams?.name ?? defaultName,
        }),
    ];
}
//# sourceMappingURL=generic-resolver.type.js.map