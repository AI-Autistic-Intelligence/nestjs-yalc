"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOptionType = exports.hasAgGridObjectMetadata = exports.getAgGridObjectMetadata = exports.AgGridObject = exports.hasAgGridFieldMetadata = exports.getAgGridFieldMetadata = exports.hasAgGridFieldMetadataList = exports.getAgGridFieldMetadataList = exports.AgGridField = exports.AGGRID_FIELD_METADATA_KEY = exports.AGGRID_OBJECT_METADATA_KEY = void 0;
exports.isDstExtended = isDstExtended;
exports.getPrototype = getPrototype;
const class_helper_1 = require("@nest-yalc-2/utils/class.helper");
const graphql_1 = require("@nestjs/graphql");
require("reflect-metadata");
function isDstExtended(dst) {
    const _dst = dst;
    return !!_dst.name && !!_dst.transformer;
}
exports.AGGRID_OBJECT_METADATA_KEY = Symbol('AGGRID_OBJECT_METADATA_KEY');
exports.AGGRID_FIELD_METADATA_KEY = Symbol('AGGRID_FIELD_METADATA_KEY');
function getPrototype(target) {
    return (0, class_helper_1.isClass)(target) || !target.prototype ? target : target.prototype;
}
const AgGridField = ({ gqlType, gqlOptions, ...options } = {}) => {
    return (target, property) => {
        const classConstructor = target.constructor;
        const propertyName = property.toString();
        const metadata = Reflect.getMetadata(exports.AGGRID_FIELD_METADATA_KEY, classConstructor) || {};
        const newMetadata = { ...metadata };
        newMetadata[propertyName] = {
            dst: propertyName,
            src: gqlOptions?.name ?? propertyName,
            gqlType,
            gqlOptions,
            ...options,
            _propertyName: propertyName,
        };
        Reflect.defineMetadata(exports.AGGRID_FIELD_METADATA_KEY, newMetadata, classConstructor);
        if (gqlOptions || gqlType) {
            if (gqlType) {
                (0, graphql_1.Field)(gqlType, gqlOptions)(target, property);
            }
            else {
                (0, graphql_1.Field)(gqlOptions)(target, property);
            }
        }
    };
};
exports.AgGridField = AgGridField;
const getAgGridFieldMetadataList = (target) => {
    return Reflect.getMetadata(exports.AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
exports.getAgGridFieldMetadataList = getAgGridFieldMetadataList;
const hasAgGridFieldMetadataList = (target) => {
    return Reflect.hasMetadata(exports.AGGRID_FIELD_METADATA_KEY, getPrototype(target));
};
exports.hasAgGridFieldMetadataList = hasAgGridFieldMetadataList;
const getAgGridFieldMetadata = (target, propertyName) => {
    const metadata = (0, exports.getAgGridFieldMetadataList)(target);
    const name = propertyName.toString();
    if (!metadata || !metadata[name])
        return undefined;
    return metadata[name];
};
exports.getAgGridFieldMetadata = getAgGridFieldMetadata;
const hasAgGridFieldMetadata = (target, propertyName) => {
    const metadata = Reflect.getMetadata(exports.AGGRID_FIELD_METADATA_KEY, getPrototype(target));
    return metadata && !!metadata[propertyName];
};
exports.hasAgGridFieldMetadata = hasAgGridFieldMetadata;
const AgGridObject = (options) => {
    return (target) => {
        let metadata = options ?? {};
        if (metadata.copyFrom) {
            const copyFrom = metadata.copyFrom;
            metadata = { ...metadata, ...(0, exports.getAgGridObjectMetadata)(copyFrom) };
            const fieldMetadata = { ...(0, exports.getAgGridFieldMetadataList)(copyFrom) };
            Reflect.defineMetadata(exports.AGGRID_FIELD_METADATA_KEY, fieldMetadata, target);
        }
        Reflect.defineMetadata(exports.AGGRID_OBJECT_METADATA_KEY, metadata, target);
    };
};
exports.AgGridObject = AgGridObject;
const getAgGridObjectMetadata = (target) => {
    return Reflect.getMetadata(exports.AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
exports.getAgGridObjectMetadata = getAgGridObjectMetadata;
const hasAgGridObjectMetadata = (target) => {
    return Reflect.hasMetadata(exports.AGGRID_OBJECT_METADATA_KEY, getPrototype(target));
};
exports.hasAgGridObjectMetadata = hasAgGridObjectMetadata;
var FilterOptionType;
(function (FilterOptionType) {
    FilterOptionType["INCLUDE"] = "include";
    FilterOptionType["EXCLUDE"] = "exclude";
})(FilterOptionType || (exports.FilterOptionType = FilterOptionType = {}));
//# sourceMappingURL=object.decorator.js.map