"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerWhitelist = void 0;
exports.filterHeaders = filterHeaders;
exports.headerWhitelist = ['Authorization'];
function filterHeaders(headers, whitelist = exports.headerWhitelist) {
    return headers
        ? Object.entries(headers)
            .filter(([key]) => whitelist.includes(key))
            .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {})
        : headers;
}
//# sourceMappingURL=header-whitelist.helper.js.map