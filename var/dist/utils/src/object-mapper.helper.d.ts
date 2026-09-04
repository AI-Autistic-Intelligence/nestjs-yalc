export type ObjectMapperDestPropertyType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>, TPropertyDest extends keyof TOutputObject> = {
    transformer?: (inputObject: TInputObject, propertyName: keyof TInputObject) => TOutputObject[TPropertyDest];
    exclude?: boolean;
};
type ObjectType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>> = {
    [index in keyof TInputObject]: Partial<{
        [K in keyof TOutputObject]: ObjectMapperDestPropertyType<TInputObject, TOutputObject, K> | boolean;
    }> | keyof TOutputObject | false;
} & Partial<{
    [index in '$transformer']: (inputObject: TInputObject, outputObject: TOutputObject) => void;
}>;
export type ObjectMapperType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>> = ObjectType<TInputObject, TOutputObject>;
export declare function objectMapper<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>>(inputObject: TInputObject, mapper: ObjectMapperType<TInputObject, TOutputObject>, options?: {
    copyNonMappedProperties?: boolean;
}): TOutputObject;
export {};
