"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullableTimestampMiddleware = void 0;
const nullableTimestampMiddleware = async (_ctx, next) => {
    const date = await next();
    return '0000-00-00 00:00:00' === date || !date ? null : date;
};
exports.nullableTimestampMiddleware = nullableTimestampMiddleware;
//# sourceMappingURL=nullable-timestamp-middleware.helper.js.map