import { err, ok } from 'neverthrow';
import { errorToDefaultError } from './default.error.js';
export const tryCatch = (fn, options = {}) => {
    try {
        return ok(fn());
    }
    catch (error) {
        return err(errorToDefaultError(error, options));
    }
};
export const tryCatchAsync = async (fn, options = {}) => {
    try {
        return ok(await fn());
    }
    catch (error) {
        return err(errorToDefaultError(error, options));
    }
};
//# sourceMappingURL=result.error.js.map