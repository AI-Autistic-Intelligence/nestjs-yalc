"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSofaMiddleware = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const sofa_api_1 = require("sofa-api");
const buildSofaMiddleware = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
schema, options) => {
    return (0, sofa_api_1.useSofa)({
        ...options,
        schema,
    });
};
exports.buildSofaMiddleware = buildSofaMiddleware;
//# sourceMappingURL=sofa.helper.js.map