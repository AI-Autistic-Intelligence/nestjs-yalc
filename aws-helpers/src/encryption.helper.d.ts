export declare const staticKey = "be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f";
export declare enum EncryptMode {
    AWS = 0,
    LOCAL = 1
}
export declare const decryptSsmVariable: (toDecrypt: string, useCache?: boolean) => Promise<string>;
export declare const setEnvironmentVariablesFromSsm: (envVariableToDecrypt: Record<string, string>, useCache?: boolean) => Promise<Record<string, string>>;
