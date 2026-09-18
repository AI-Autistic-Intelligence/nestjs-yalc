import { ValueTransformer } from 'typeorm';
export declare const enumTransformer: <T extends Record<string, string | number>>(enumName: T) => ValueTransformer;
export declare const defaultDateTransformer: () => {
    from: (value: Date) => Date;
    to: (value?: Date) => string | Date;
};
