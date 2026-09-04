"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOptionType = exports.hasCrudGenObjectMetadata = exports.getCrudGenObjectMetadata = exports.CrudGenObject = exports.hasModelObjectMetadata = exports.getModelObjectMetadata = exports.ModelObject = exports.hasModelFieldMetadata = exports.getModelFieldMetadata = exports.hasModelFieldMetadataList = exports.getModelFieldMetadataList = exports.ModelField = exports.CRUDGEN_FIELD_METADATA_KEY = exports.CRUDGEN_OBJECT_METADATA_KEY = void 0;
exports.isDstExtended = isDstExtended;
exports.getPrototype = getPrototype;
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
const graphql_1 = require("@nestjs/graphql");
require("reflect-metadata");
function isDstExtended(dst) {
    const _dst = dst;
    return !!_dst.name && (!!_dst.transformerDst || !!_dst.transformerSrc);
}
exports.CRUDGEN_OBJECT_METADATA_KEY = Symbol('CRUDGEN_OBJECT_METADATA_KEY');
exports.CRUDGEN_FIELD_METADATA_KEY = Symbol('CRUDGEN_FIELD_METADATA_KEY');
function getPrototype(target) {
    if (!target)
        return target;
    return (0, class_helper_js_1.isClass)(target) || !target.prototype ? target : target.prototype;
}
const ModelField = (_a) => {
    var { gqlType, gqlOptions } = _a, options = __rest(_a, ["gqlType", "gqlOptions"]);
    return (target, property) => {
        var _a, _b, _c;
        const classConstructor = target.constructor;
        const propertyName = property.toString();
        const metadata = Reflect.getMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, classConstructor) || {};
        const newMetadata = Object.assign({}, metadata);
        const previousValues = metadata[propertyName];
        newMetadata[propertyName] = Object.assign(Object.assign(Object.assign(Object.assign({}, previousValues), { dst: (_a = previousValues === null || previousValues === void 0 ? void 0 : previousValues.dst) !== null && _a !== void 0 ? _a : propertyName, src: (_b = gqlOptions === null || gqlOptions === void 0 ? void 0 : gqlOptions.name) !== null && _b !== void 0 ? _b : propertyName, gqlType,
            gqlOptions }), options), { _propertyName: propertyName });
        Reflect.defineMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, newMetadata, classConstructor);
        if (gqlOptions || gqlType) {
            (0, graphql_1.addFieldMetadata)((_c = gqlType) !== null && _c !== void 0 ? _c : gqlOptions, gqlOptions !== null && gqlOptions !== void 0 ? gqlOptions : {}, target, propertyName);
        }
    };
};
exports.ModelField = ModelField;
const getModelFieldMetadataList = (target) => {
    if (!target)
        return undefined;
    if (typeof target !== 'object' && typeof target !== 'function')
        return undefined;
    return Reflect.getMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
};
exports.getModelFieldMetadataList = getModelFieldMetadataList;
const hasModelFieldMetadataList = (target) => {
    return Reflect.hasMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
};
exports.hasModelFieldMetadataList = hasModelFieldMetadataList;
const getModelFieldMetadata = (target, propertyName) => {
    const metadata = (0, exports.getModelFieldMetadataList)(target);
    const name = propertyName.toString();
    if (!metadata || !metadata[name])
        return undefined;
    return metadata[name];
};
exports.getModelFieldMetadata = getModelFieldMetadata;
const hasModelFieldMetadata = (target, propertyName) => {
    const metadata = Reflect.getMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, getPrototype(target));
    return metadata && !!metadata[propertyName];
};
exports.hasModelFieldMetadata = hasModelFieldMetadata;
const ModelObject = (options) => {
    return (target) => {
        let metadata = options !== null && options !== void 0 ? options : {};
        if (metadata.copyFrom) {
            const copyFrom = metadata.copyFrom;
            metadata = Object.assign(Object.assign({}, metadata), (0, exports.getModelObjectMetadata)(copyFrom));
            const fieldMetadata = Object.assign({}, (0, exports.getModelFieldMetadataList)(copyFrom));
            Reflect.defineMetadata(exports.CRUDGEN_FIELD_METADATA_KEY, fieldMetadata, target);
        }
        Reflect.defineMetadata(exports.CRUDGEN_OBJECT_METADATA_KEY, metadata, target);
    };
};
exports.ModelObject = ModelObject;
const getModelObjectMetadata = (target) => {
    if (!target)
        return undefined;
    if (typeof target !== 'object' && typeof target !== 'function') {
        console.log('CRITICAL: target is primitive', typeof target, target);
        return undefined;
    }
    return Reflect.getMetadata(exports.CRUDGEN_OBJECT_METADATA_KEY, getPrototype(target));
};
exports.getModelObjectMetadata = getModelObjectMetadata;
const hasModelObjectMetadata = (target) => {
    if (!target)
        return false;
    if (typeof target !== 'object' && typeof target !== 'function')
        return false;
    return Reflect.hasMetadata(exports.CRUDGEN_OBJECT_METADATA_KEY, getPrototype(target));
};
exports.hasModelObjectMetadata = hasModelObjectMetadata;
exports.CrudGenObject = exports.ModelObject;
exports.getCrudGenObjectMetadata = exports.getModelObjectMetadata;
exports.hasCrudGenObjectMetadata = exports.hasModelObjectMetadata;
var FilterOptionType;
(function (FilterOptionType) {
    FilterOptionType["INCLUDE"] = "include";
    FilterOptionType["EXCLUDE"] = "exclude";
})(FilterOptionType || (exports.FilterOptionType = FilterOptionType = {}));
//# sourceMappingURL=object.decorator.js.map