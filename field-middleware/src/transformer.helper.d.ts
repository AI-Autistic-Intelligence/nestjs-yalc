import { ValueTransformer } from 'typeorm';
export declare const enumTransformer: <T extends Record<string, any>>(enumName: T) => ValueTransformer;
export declare const defaultDateTransformer: () => {
    from: (value: Date) => Date;
    to: (value?: Date) => string | Date;
};
