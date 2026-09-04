import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { addFieldMetadata, } from '@nestjs/graphql';
import 'reflect-metadata';
export function isDstExtended(dst) {
    const _dst = dst;
    return !!_dst.name && (!!_dst.transformerDst || !!_dst.transformerSrc);
}
export const CRUDGEN_OBJECT_METADATA_KEY = Symbol('CRUDGEN_OBJECT_METADATA_KEY');
export const CRUDGEN_FIELD_METADATA_KEY = Symbol('CRUDGEN_FIELD_METADATA_KEY');
export function getPrototype(target) {
    return isClass(target) || !target.prototype ? target : target.prototype;
}
export const ModelField = ({ gqlType, gqlOptions, ...options }) => {
    return (target, property) => {
        const classConstructor = target.constructor;
        const propertyName = property.toString();
        const metadata = Reflect.getMetadata(CRUDGEN_FIELD_METADATA_KEY, classConstructor) || {};
        const newMetadata = { ...metadata };
        const previousValues = metadata[propertyName];
        newMetadata[propertyName] = {
            ...previousValues,
            dst: previousValues?.dst ?? propertyName,
            src: gqlOptions?.name ?? propertyName,
            gqlType,
            gqlOptions,
            ...options,
            _propertyName: propertyName,
        };
        Reflect.defineMetadata(CRUDGEN_FIELD_METADATA_KEY, newMetadata, classConstructor);
        if (gqlOptions || gqlType) {
            addFieldMetadata(gqlType ?? gqlOptions, gqlOptions ?? {}, target, propertyName);
        }
    };
};
export const getModelFieldMetadataList = (target) => {
    return Reflect.getMetadata(CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
};
export const hasModelFieldMetadataList = (target) => {
    return Reflect.hasMetadata(CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
};
export const getModelFieldMetadata = (target, propertyName) => {
    const metadata = getModelFieldMetadataList(target);
    const name = propertyName.toString();
    if (!metadata || !metadata[name])
        return undefined;
    return metadata[name];
};
export const hasModelFieldMetadata = (target, propertyName) => {
    const metadata = Reflect.getMetadata(CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
    return metadata && !!metadata[propertyName];
};
export const ModelObject = (options) => {
    return (target) => {
        let metadata = options ?? {};
        if (metadata.copyFrom) {
            const copyFrom = metadata.copyFrom;
            metadata = { ...metadata, ...getModelObjectMetadata(copyFrom) };
            const fieldMetadata = { ...getModelFieldMetadataList(copyFrom) };
            Reflect.defineMetadata(CRUDGEN_FIELD_METADATA_KEY, fieldMetadata, target);
        }
        Reflect.defineMetadata(CRUDGEN_OBJECT_METADATA_KEY, metadata, target);
    };
};
export const getModelObjectMetadata = (target) => {
    return Reflect.getMetadata(CRUDGEN_OBJECT_METADATA_KEY, getPrototype(target));
};
export const hasModelObjectMetadata = (target) => {
    return Reflect.hasMetadata(CRUDGEN_OBJECT_METADATA_KEY, getPrototype(target));
};
export const CrudGenObject = ModelObject;
export const getCrudGenObjectMetadata = getModelObjectMetadata;
export const hasCrudGenObjectMetadata = hasModelObjectMetadata;
export var FilterOptionType;
(function (FilterOptionType) {
    FilterOptionType["INCLUDE"] = "include";
    FilterOptionType["EXCLUDE"] = "exclude";
})(FilterOptionType || (FilterOptionType = {}));
//# sourceMappingURL=object.decorator.js.map