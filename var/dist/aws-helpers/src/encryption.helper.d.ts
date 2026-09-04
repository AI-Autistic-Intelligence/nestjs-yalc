export declare const staticKey = "be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f";
export declare enum EncryptMode {
    AWS = 0,
    LOCAL = 1
}
export declare const decryptCallback: (resolve: any, reject: any) => (err: any, data: any) => any;
export declare const asyncDecrypt: (toDecrypt: any) => Promise<string>;
export declare const asyncEncrypt: (toEncrypt: string) => Promise<string>;
export declare const decryptString: (toDecrypt: any, encryptMode: EncryptMode, encryptionKey?: string) => Promise<string>;
export declare const encryptString: (toEncrypt: any, encryptMode: EncryptMode, encryptionKey?: string) => Promise<string>;
export declare const decryptSsmVariable: (toDecrypt: string) => Promise<string>;
export declare const setEnvironmentVariableFromSsm: (envVariableToDecrypt: {
    [key: string]: string;
}) => Promise<void>;
