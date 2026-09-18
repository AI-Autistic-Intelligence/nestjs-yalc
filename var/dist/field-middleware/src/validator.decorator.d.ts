import { ValidationOptions } from 'class-validator';
import { IStringFormatMatchCheckOptions } from './validator.interface.js';
export declare const stringFormatMatchValidatorFactory: (stringMatchOptions: IStringFormatMatchCheckOptions) => {
    validate(string: string): boolean;
};
export declare const dateValidatorFactory: () => {
    validate(date: Date | string): boolean;
};
export declare function StringFormatMatchValidation(validationOptions?: ValidationOptions, stringMatchOptions?: IStringFormatMatchCheckOptions): (object: any, propertyName: string) => void;
export declare function DateValidation(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
