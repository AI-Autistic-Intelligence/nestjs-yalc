export declare const DEF_FAKER_MAX_RETRIES = 1500;
export declare const DEF_FAKER_MAX_TIME = 250;
export declare class FakerHelper {
    private uniqueStore;
    unique<Method extends (...args: any[]) => any>(method: Method, args: Parameters<Method>, options?: {
        maxRetries?: number;
        maxTime?: number;
    }): ReturnType<Method>;
    createPerson(): {
        gender: string;
        firstName: string;
        lastName: string;
        email: any;
    };
    generateNewEmail(firstName: string, lastName: string, provider?: string): any;
    randomFromEnum<T extends Record<string, any>>(inputEnum: T): T[keyof T];
    randomDecimal: (min: number, max: number, precision: number) => string;
    randomBirthDate: () => string;
    randomLockDate: () => Date | undefined;
}
