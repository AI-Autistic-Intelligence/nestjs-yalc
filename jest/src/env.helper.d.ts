type EnvObj = {
    [key: string]: string;
};
/**
 *  Used as a helper to make jest tests cleaner when working with process.env
 */
export declare function envTestHelper(env?: EnvObj): {
    build(env: EnvObj): void;
    getEnv(): NodeJS.ProcessEnv;
    getEnvValue(key: string): string | undefined;
    setEnv(key: string, value: string): void;
    reset(): void;
};
export {};
