"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envTestHelper = envTestHelper;
/**
 *  Used as a helper to make jest tests cleaner when working with process.env
 */
function envTestHelper(env) {
    const OLD_ENV = process.env;
    if (env) {
        process.env = env;
    }
    return {
        build(env) {
            process.env = env;
        },
        getEnv() {
            return process.env;
        },
        getEnvValue(key) {
            return process.env[key];
        },
        setEnv(key, value) {
            process.env[key] = value;
        },
        reset() {
            process.env = OLD_ENV;
        },
    };
}
//# sourceMappingURL=env.helper.js.map