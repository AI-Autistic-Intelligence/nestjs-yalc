"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvLoggerLevels = exports.getEnvLoggerLevelsByContext = void 0;
exports.maskDataInObject = maskDataInObject;
const tslib_1 = require("tslib");
const env_helper_js_1 = require("@nest-yalc-2/utils/env.helper.js");
const fast_redact_1 = tslib_1.__importDefault(require("fast-redact"));
const lodash_es_1 = require("lodash-es");
const logger_enum_js_1 = require("./logger.enum.js");
function maskDataInObject(data, paths, trace) {
    if (typeof data === 'string')
        data = { message: data };
    if (!paths || !data || (0, lodash_es_1.isEmpty)(paths) || (0, lodash_es_1.isEmpty)(data)) {
        if (trace)
            data ? (data.trace = trace) : (data = { trace });
        return data;
    }
    const redact = (0, fast_redact_1.default)({
        paths,
    });
    return { ...JSON.parse(redact(data)), trace };
}
const getEnvLoggerLevelsByContext = (context) => {
    return (0, env_helper_js_1.envToArray)(`NEST_LOGGER_LEVELS_${context.toUpperCase()}`);
};
exports.getEnvLoggerLevelsByContext = getEnvLoggerLevelsByContext;
const getEnvLoggerLevels = (context, def = logger_enum_js_1.LOG_LEVEL_ALL) => {
    let levels = (0, exports.getEnvLoggerLevelsByContext)(context ?? logger_enum_js_1.LoggerDefContext.NEST_SYSTEM);
    if (!levels.length)
        levels = (0, env_helper_js_1.envToArray)('NEST_LOGGER_LEVELS');
    return levels.length ? levels : def;
};
exports.getEnvLoggerLevels = getEnvLoggerLevels;
//# sourceMappingURL=logger.helper.js.map