import * as aws from 'aws-sdk';
import * as localEncryption from '@nestjs-yalc/utils/encryption.helper';
export const staticKey = 'be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f';
export var EncryptMode;
(function (EncryptMode) {
    EncryptMode[EncryptMode["AWS"] = 0] = "AWS";
    EncryptMode[EncryptMode["LOCAL"] = 1] = "LOCAL";
})(EncryptMode || (EncryptMode = {}));
export const decryptCallback = (resolve, reject) => {
    return (err, data) => {
        if (err) {
            return reject(err);
        }
        data.Plaintext =
            typeof data.Plaintext === 'undefined' ? '' : data.Plaintext;
        return resolve(data.Plaintext.toString());
    };
};
export const asyncDecrypt = async (toDecrypt) => {
    const kms = new aws.KMS({
        region: process.env.KMS_REGION,
    });
    return new Promise((resolve, reject) => {
        kms.decrypt({
            KeyId: process.env.AWS_REMOTE_KEYID,
            CiphertextBlob: Buffer.from(toDecrypt, 'base64'),
        }, decryptCallback(resolve, reject));
    });
};
export const asyncEncrypt = async (toEncrypt) => {
    const kms = new aws.KMS({
        region: process.env.KMS_REGION,
    });
    const encryptionResult = await new Promise((resolve, reject) => {
        if (typeof process.env.AWS_REMOTE_KEYID === 'undefined') {
            throw new Error('Calling kms encrypt function without setting the AWS_REMOTE_KEYID variable');
        }
        kms.encrypt({
            KeyId: process.env.AWS_REMOTE_KEYID,
            Plaintext: toEncrypt,
        }, (err, data) => {
            if (err) {
                return reject(err);
            }
            if (typeof data.CiphertextBlob === 'undefined') {
                return reject('Error CiphertextBlob coming from kms encrypt is undefined');
            }
            resolve(data.CiphertextBlob);
        });
    });
    return encryptionResult.toString('base64');
};
export const decryptString = async (toDecrypt, encryptMode, encryptionKey = staticKey) => {
    switch (encryptMode) {
        case EncryptMode.AWS:
            const decryptionResult = await asyncDecrypt(toDecrypt);
            return decryptionResult.toString();
        case EncryptMode.LOCAL:
        default:
            return localEncryption.decryptAes(toDecrypt, encryptionKey);
    }
};
export const encryptString = async (toEncrypt, encryptMode, encryptionKey = staticKey) => {
    switch (encryptMode) {
        case EncryptMode.AWS:
            const encryptionResult = await asyncEncrypt(toEncrypt);
            return encryptionResult;
        case EncryptMode.LOCAL:
        default:
            return localEncryption.encryptAes(toEncrypt, encryptionKey);
    }
};
export const decryptSsmVariable = async (toDecrypt) => {
    const ssm = new aws.SSM();
    return new Promise((resolve) => {
        ssm.getParameter({
            Name: toDecrypt,
            WithDecryption: true,
        }, (err, data) => {
            if (err || !data.Parameter?.Value) {
                resolve('');
            }
            else {
                resolve(data.Parameter.Value);
            }
        });
    });
};
export const setEnvironmentVariableFromSsm = async (envVariableToDecrypt) => {
    for (const variable of Object.keys(envVariableToDecrypt)) {
        process.env[variable] = await decryptSsmVariable(envVariableToDecrypt[variable]);
    }
};
//# sourceMappingURL=encryption.helper.js.map