import { ObjectType } from 'typeorm';
export declare const returnValue: <T>(value: any) => {
    (): ObjectType<T>;
};
export declare const returnProperty: <T>(property: keyof T) => {
    (relationEntity: T): T[keyof T];
};
export default returnValue;
