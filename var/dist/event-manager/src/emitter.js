import { maskDataInObject } from '@nestjs-yalc/logger/logger.helper.js';
import { globalPromiseTracker } from '@nestjs-yalc/utils/promise.helper.js';
export function formatName(name, formatter) {
    return formatter?.(...name) ?? (Array.isArray(name) ? name.join() : name);
}
export async function emitEvent(eventEmitter, name, payload, options) {
    const data = options?.mask
        ? maskDataInObject(payload, options.mask)
        : payload;
    const _name = formatName(name, options?.formatter);
    if (!options?.await) {
        return eventEmitter.emit(_name, data);
    }
    else {
        const promise = eventEmitter.emitAsync(_name, data);
        globalPromiseTracker.add(promise);
        return promise;
    }
}
export function emitFormattedEvent(eventEmitter, name, payload, options) {
    return emitEvent(eventEmitter, [name], payload, {
        ...options,
        formatter: simpleFormatter,
    });
}
export const versionedDomainActionFormatter = (version, context, action, when) => {
    return `${version}.${context}.${action}.${when ?? 'onProcess'}`;
};
export const simpleDotFormatter = (...args) => {
    return args.join('.');
};
export const simpleFormatter = (action) => {
    return `on${action}`;
};
//# sourceMappingURL=emitter.js.map