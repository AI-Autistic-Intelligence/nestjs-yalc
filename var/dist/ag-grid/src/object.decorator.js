import { isClass } from '@nestjs-yalc/utils/class.helper';
import { addFieldMetadata, } from '@nestjs/graphql';
import 'reflect-metadata';
export function isDstExtended(dst) {
    const _dst = dst;
    return !!_dst.name && !!_dst.transformer;
}
export const AGGRID_OBJECT_METADATA_KEY = Symbol('AGGRID_OBJECT_METADATA_KEY');
export const AGGRID_FIELD_METADATA_KEY = Symbol('AGGRID_FIELD_METADATA_KEY');
export function getPrototype(target) {
    return isClass(target) || !target.prototype ? target : target.prototype;
}
export const AgGridField = ({ gqlType, gqlOptions, ...options }) => {
    return (target, property) => {
        const classConstructor = target.constructor;
        const propertyName = property.toString();
        const metadata = Reflect.getMetadata(AGGRID_FIELD_METADATA_KEY, classConstructor) || {};
        const newMetadata = { ...metadata };
        newMetadata[propertyName] = {
            dst: propertyName,
            src: gqlOptions?.name ?? propertyName,
            gqlType,
            gqlOptions,
            ...options,
            _propertyName: propertyName,
        };
        Reflect.defineMetadata(AGGRID_FIELD_METADATA_KEY, newMetadata, classConstructor);
        if (gqlOptions || gqlType) {
            addFieldMetadata(gqlType ?? gqlOptions, gqlOptions ?? {}, target, propertyName);
        }
    };
};
export const getAgGridFieldMetadataList = (target) => {
    return Reflect.getMetadata(AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
export const hasAgGridFieldMetadataList = (target) => {
    return Reflect.hasMetadata(AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
export const getAgGridFieldMetadata = (target, propertyName) => {
    const metadata = getAgGridFieldMetadataList(target);
    const name = propertyName.toString();
    if (!metadata || !metadata[name])
        return undefined;
    return metadata[name];
};
export const hasAgGridFieldMetadata = (target, propertyName) => {
    const metadata = Reflect.getMetadata(AGGRID_FIELD_METADATA_KEY, getPrototype(target));
    return metadata && !!metadata[propertyName];
};
export const AgGridObject = (options) => {
    return (target) => {
        let metadata = options ?? {};
        if (metadata.copyFrom) {
            const copyFrom = metadata.copyFrom;
            metadata = { ...metadata, ...getAgGridObjectMetadata(copyFrom) };
            const fieldMetadata = { ...getAgGridFieldMetadataList(copyFrom) };
            Reflect.defineMetadata(AGGRID_FIELD_METADATA_KEY, fieldMetadata, target);
        }
        Reflect.defineMetadata(AGGRID_OBJECT_METADATA_KEY, metadata, target);
    };
};
export const getAgGridObjectMetadata = (target) => {
    return Reflect.getMetadata(AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
export const hasAgGridObjectMetadata = (target) => {
    return Reflect.hasMetadata(AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
export var FilterOptionType;
(function (FilterOptionType) {
    FilterOptionType["INCLUDE"] = "include";
    FilterOptionType["EXCLUDE"] = "exclude";
})(FilterOptionType || (FilterOptionType = {}));
//# sourceMappingURL=object.decorator.js.map