"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalMiddleware = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
/**
 * @todo Apply conversion if needed for number with more than scale = 11
 */
const decimalMiddleware = async (_ctx, next) => {
    return await next();
};
exports.decimalMiddleware = decimalMiddleware;
//# sourceMappingURL=decimal-middleware.helper.js.map