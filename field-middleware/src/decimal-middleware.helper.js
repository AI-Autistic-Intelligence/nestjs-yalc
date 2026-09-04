"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalMiddleware = void 0;
const decimalMiddleware = async (_ctx, next) => {
    return await next();
};
exports.decimalMiddleware = decimalMiddleware;
//# sourceMappingURL=decimal-middleware.helper.js.map