export const nullableTimestampMiddleware = async (_ctx, next) => {
    const date = await next();
    return '0000-00-00 00:00:00' === date || !date ? null : date;
};
//# sourceMappingURL=nullable-timestamp-middleware.helper.js.map