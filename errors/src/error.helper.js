"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusCodeFromError = getStatusCodeFromError;
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
const http_helper_js_1 = require("@nestjs-yalc/utils/http.helper.js");
const default_error_js_1 = require("./default.error.js");
function getStatusCodeFromError(error) {
    if (!(0, class_helper_js_1.isClass)(error)) {
        if (error.getStatus) {
            return error.getStatus();
        }
        return null;
    }
    if ((0, default_error_js_1.isDefaultErrorMixinClass)(error)) {
        return error.defaultStatusCode;
    }
    const errorName = error.name;
    return http_helper_js_1.httpExceptionStatusCodes[errorName] || null;
}
//# sourceMappingURL=error.helper.js.map