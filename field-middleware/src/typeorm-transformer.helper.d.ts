import { ValueTransformer } from 'typeorm';
/**
 * Function for transforming the unfitting enum data to null after reading it from the database
 * @param enumName: enum object for checking if the column value belongs to it
 * @returns ValueTransformer object
 */
export declare const enumTransformer: <T extends Record<string, string | number>>(enumName: T) => ValueTransformer;
export declare const defaultDateTransformer: () => {
    from: (value: Date) => Date;
    to: (value?: Date) => string | Date;
};
