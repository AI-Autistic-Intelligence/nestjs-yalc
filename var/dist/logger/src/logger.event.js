"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerEvent = void 0;
var LoggerEvent;
(function (LoggerEvent) {
    LoggerEvent["QUERY_ERROR"] = "logger.query_error";
    LoggerEvent["QUERY_LOG"] = "logger.query_log";
    LoggerEvent["QUERY_SLOW"] = "logger.query_slow";
    LoggerEvent["ERROR"] = "logger.error";
    LoggerEvent["SCHEMA_BUILD"] = "logger.schema_build";
    LoggerEvent["WARN"] = "logger.warn";
    LoggerEvent["INFO"] = "logger.info";
    LoggerEvent["DEBUG"] = "logger.debug";
    LoggerEvent["LOG"] = "logger.log";
})(LoggerEvent || (exports.LoggerEvent = LoggerEvent = {}));
//# sourceMappingURL=logger.event.js.map