type EnvObj = {
    [key: string]: string;
};
export declare function envTestHelper(env?: EnvObj): {
    build(env: EnvObj): void;
    getEnv(): NodeJS.ProcessEnv;
    getEnvValue(key: string): string | undefined;
    setEnv(key: string, value: string): void;
    reset(): void;
};
export {};
