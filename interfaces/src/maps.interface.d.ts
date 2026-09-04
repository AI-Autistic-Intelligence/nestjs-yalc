export type IFieldMapper<T = any> = {
    [k in keyof T]: FieldMapperProperty;
};
export declare const isFieldMapper: (object: any) => object is IFieldMapper;
export declare const isFieldMapperProperty: (object: Record<string, any>) => object is FieldMapperProperty;
export type FieldMapperProperty = {
    src?: string;
    dst: string;
    isRequired?: boolean;
    isSymbolic?: boolean;
    denyFilter?: boolean;
    mode?: 'derived' | 'virtual' | 'regular';
    _propertyName?: string;
};
