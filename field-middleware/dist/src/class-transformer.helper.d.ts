export declare function ParseArray({ separator }?: {
    separator?: string | undefined;
}): PropertyDecorator;
export declare function parseArray(value: string, separator?: string): string[] | (string & any[]);
export declare function ParseBoolean(): PropertyDecorator;
export declare function parseBoolean(value: string | boolean): boolean;
export declare function ParseNumber(): PropertyDecorator;
export declare function parseNumber(value: string | number): number;
export declare function ParseInt(): PropertyDecorator;
export declare function parseInt(value: string | number): number;
