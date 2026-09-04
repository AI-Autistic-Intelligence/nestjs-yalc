import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { httpExceptionStatusCodes } from '@nestjs-yalc/utils/http.helper.js';
import { isDefaultErrorMixinClass } from './default.error.js';
export function getStatusCodeFromError(error) {
    if (!isClass(error)) {
        if (error.getStatus) {
            return error.getStatus();
        }
        return null;
    }
    if (isDefaultErrorMixinClass(error)) {
        return error.defaultStatusCode;
    }
    const errorName = error.name;
    return httpExceptionStatusCodes[errorName] || null;
}
//# sourceMappingURL=error.helper.js.map