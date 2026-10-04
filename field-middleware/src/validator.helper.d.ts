export declare function errorTrhow(value: string | Date, message?: string): void;
export declare function convertIfStringToDate(date: Date | string): Date;
export declare function stringIsInEnumOrThrow<T extends Record<string, string | number>>(toCheck: string, enumName: T, message?: string): true | void;
export declare function stringIsInEnum<T extends Record<string, string | number>>(toCheck: string, enumName: T): boolean;
export declare function validateDate(date: Date | string): boolean;
export declare function validateDateOrThrow(date: Date | string, message?: string): true | void;
export declare function validateStringFormat(str: string, stringFormat: string): boolean;
