"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSofaMiddleware = void 0;
const sofa_api_1 = require("sofa-api");
const buildSofaMiddleware = (schema, options) => {
    return (0, sofa_api_1.useSofa)(Object.assign(Object.assign({}, options), { schema }));
};
exports.buildSofaMiddleware = buildSofaMiddleware;
//# sourceMappingURL=sofa.helper.js.map