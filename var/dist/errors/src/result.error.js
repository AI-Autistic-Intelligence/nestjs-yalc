"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatchAsync = exports.tryCatch = void 0;
const neverthrow_1 = require("neverthrow");
const default_error_js_1 = require("./default.error.js");
const tryCatch = (fn, options = {}) => {
    try {
        return (0, neverthrow_1.ok)(fn());
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, default_error_js_1.errorToDefaultError)(error, options));
    }
};
exports.tryCatch = tryCatch;
const tryCatchAsync = async (fn, options = {}) => {
    try {
        return (0, neverthrow_1.ok)(await fn());
    }
    catch (error) {
        return (0, neverthrow_1.err)((0, default_error_js_1.errorToDefaultError)(error, options));
    }
};
exports.tryCatchAsync = tryCatchAsync;
//# sourceMappingURL=result.error.js.map