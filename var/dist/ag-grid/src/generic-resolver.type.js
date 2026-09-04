export function isIDArg(arg) {
    return !!arg.name;
}
export function isExtraInputStrict(input) {
    const casted = input;
    return !!casted.middleware;
}
export function checkFinalId(finalId) {
    if (typeof finalId === 'undefined') {
        throw new Error("Can't have an undefined ID");
    }
}
export function isCustomSingleQueryOptions(option) {
    return option.isSingleResource === true;
}
export function hasExtraArgs(option) {
    return !!option.extraArgs;
}
export function hasFilters(findOptions) {
    return ((findOptions.where &&
        Object.values(findOptions.where.filters).length > 0) ||
        (findOptions.order && Object.values(findOptions.order).length > 0));
}
export function generateDecorators(methodFn, defaultName, typeFunc, options) {
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