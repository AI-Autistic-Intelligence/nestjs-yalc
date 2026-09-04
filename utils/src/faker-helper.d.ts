export declare const DEF_FAKER_MAX_RETRIES = 1500;
export declare const DEF_FAKER_MAX_TIME = 250;
export declare class FakerHelper {
    private readonly generatedEmails;
    createPerson(): {
        gender: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    generateNewEmail(firstName: string, lastName: string, provider?: string): string;
    randomFromEnum<T extends Record<string, string | number>>(inputEnum: T): T[keyof T];
    randomDecimal: (min: number, max: number, precision: number) => string;
    randomBirthDate: (start?: number, end?: number) => string;
    randomLockDate: () => Date | undefined;
}
