import { ObjectType } from 'typeorm';
export declare function returnValue<T>(value: string | boolean | number): {
    (): T;
};
export declare function returnValue<T>(value: T): {
    (): ObjectType<T>;
};
export declare function returnAsyncValue<T>(value: T): {
    (): Promise<T>;
};
export declare const returnProperty: <T>(property: keyof T) => {
    (relationEntity: T): T[keyof T];
};
export default returnValue;
