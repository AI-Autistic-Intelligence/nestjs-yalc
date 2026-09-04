import { ValidationOptions } from 'class-validator';
import { StringFormatMatchCheckOptions } from './validator.interface';
export declare const stringFormatMatchValidatorFactory: (stringMatchOptions: StringFormatMatchCheckOptions) => {
    validate(string: string): any;
};
export declare const dateValidatorFactory: () => {
    validate(date: Date | string): any;
};
export declare function StringFormatMatchValidation(validationOptions?: ValidationOptions, stringMatchOptions?: StringFormatMatchCheckOptions): (object: any, propertyName: string) => void;
export declare function DateValidation(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
