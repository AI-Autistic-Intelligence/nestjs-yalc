"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironmentVariablesFromSsm = exports.decryptSsmVariable = exports.EncryptMode = exports.staticKey = void 0;
const common_1 = require("@nestjs/common");
const client_ssm_1 = require("@aws-sdk/client-ssm");
exports.staticKey = 'be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f';
var EncryptMode;
(function (EncryptMode) {
    EncryptMode[EncryptMode["AWS"] = 0] = "AWS";
    EncryptMode[EncryptMode["LOCAL"] = 1] = "LOCAL";
})(EncryptMode || (exports.EncryptMode = EncryptMode = {}));
const cachedSsmVariables = new Map();
const decryptSsmVariable = async (toDecrypt, useCache = true) => {
    if (useCache) {
        if (cachedSsmVariables.has(toDecrypt)) {
            const cachedValue = cachedSsmVariables.get(toDecrypt);
            const value = await cachedValue;
            return value.Parameter?.Value ?? '';
        }
    }
    const ssm = new client_ssm_1.SSMClient();
    try {
        const dataPromise = ssm.send(new client_ssm_1.GetParameterCommand({
            Name: toDecrypt,
            WithDecryption: true,
        }));
        if (useCache) {
            cachedSsmVariables.set(toDecrypt, dataPromise);
        }
        const data = await dataPromise;
        return data.Parameter?.Value ?? '';
    }
    catch (err) {
        common_1.Logger.error(`Error while decrypting ssm variable ${toDecrypt} ${JSON.stringify(err)}`);
        return '';
    }
};
exports.decryptSsmVariable = decryptSsmVariable;
const setEnvironmentVariablesFromSsm = async (envVariableToDecrypt, useCache = true) => {
    const ssmVars = {};
    const promises = Object.entries(envVariableToDecrypt).map(async ([envVar, ssmVar]) => {
        const value = await (0, exports.decryptSsmVariable)(ssmVar, useCache);
        process.env[envVar] = ssmVars[envVar] = value;
    });
    await Promise.all(promises);
    return ssmVars;
};
exports.setEnvironmentVariablesFromSsm = setEnvironmentVariablesFromSsm;
//# sourceMappingURL=encryption.helper.js.map