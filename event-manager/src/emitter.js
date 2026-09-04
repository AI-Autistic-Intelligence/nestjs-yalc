"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleFormatter = exports.simpleDotFormatter = exports.versionedDomainActionFormatter = void 0;
exports.formatName = formatName;
exports.emitEvent = emitEvent;
exports.emitFormattedEvent = emitFormattedEvent;
const logger_helper_js_1 = require("@nestjs-yalc/logger/logger.helper.js");
const promise_helper_js_1 = require("@nestjs-yalc/utils/promise.helper.js");
function formatName(name, formatter) {
    var _a;
    return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(...name)) !== null && _a !== void 0 ? _a : (Array.isArray(name) ? name.join() : name);
}
async function emitEvent(eventEmitter, name, payload, options) {
    const data = (options === null || options === void 0 ? void 0 : options.mask)
        ? (0, logger_helper_js_1.maskDataInObject)(payload, options.mask)
        : payload;
    const _name = formatName(name, options === null || options === void 0 ? void 0 : options.formatter);
    if (!(options === null || options === void 0 ? void 0 : options.await)) {
        return eventEmitter.emit(_name, data);
    }
    else {
        const promise = eventEmitter.emitAsync(_name, data);
        promise_helper_js_1.globalPromiseTracker.add(promise);
        return promise;
    }
}
function emitFormattedEvent(eventEmitter, name, payload, options) {
    return emitEvent(eventEmitter, [name], payload, Object.assign(Object.assign({}, options), { formatter: exports.simpleFormatter }));
}
const versionedDomainActionFormatter = (version, context, action, when) => {
    return `${version}.${context}.${action}.${when !== null && when !== void 0 ? when : 'onProcess'}`;
};
exports.versionedDomainActionFormatter = versionedDomainActionFormatter;
const simpleDotFormatter = (...args) => {
    return args.join('.');
};
exports.simpleDotFormatter = simpleDotFormatter;
const simpleFormatter = (action) => {
    return `on${action}`;
};
exports.simpleFormatter = simpleFormatter;
//# sourceMappingURL=emitter.js.map