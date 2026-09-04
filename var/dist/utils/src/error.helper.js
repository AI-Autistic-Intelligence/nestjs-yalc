export function throwWrap(error) {
    if (error instanceof Error) {
        throw error;
    }
    else {
        throw new Error(error);
    }
}
//# sourceMappingURL=error.helper.js.map