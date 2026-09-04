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
exports.objectToFieldMapper = exports.isSymbolic = exports.getFieldMapperSrcByDst = exports.columnConversion = void 0;
exports.getDestinationFieldName = getDestinationFieldName;
exports.isIFieldAndFilterMapper = isIFieldAndFilterMapper;
exports.getEntityRelations = getEntityRelations;
exports.getTypeProperties = getTypeProperties;
exports.getMappedTypeProperties = getMappedTypeProperties;
const maps_interface_1 = require("@nestjs-yalc/interfaces/maps.interface");
const typeorm_1 = require("typeorm");
const object_decorator_1 = require("./object.decorator");
const columnConversion = (key, data) => {
    var _a, _b;
    if (data) {
        const dst = (_b = (_a = data[key]) === null || _a === void 0 ? void 0 : _a.dst) !== null && _b !== void 0 ? _b : key;
        return getDestinationFieldName(dst);
    }
    return key;
};
exports.columnConversion = columnConversion;
const getFieldMapperSrcByDst = (data, dst) => {
    if (data) {
        for (const src of Object.keys(data)) {
            if (data[src].dst === dst)
                return src;
        }
    }
    return dst;
};
exports.getFieldMapperSrcByDst = getFieldMapperSrcByDst;
const isSymbolic = (data, key) => {
    if (data && data[key]) {
        return data[key].isSymbolic ? true : false;
    }
    else {
        return false;
    }
};
exports.isSymbolic = isSymbolic;
function getDestinationFieldName(dst) {
    if ((0, object_decorator_1.isDstExtended)(dst)) {
        return dst.name;
    }
    return dst;
}
const objectToFieldMapperCache = new WeakMap();
const objectToFieldMapper = (object) => {
    var _a;
    if (typeof object !== 'symbol') {
        const cached = objectToFieldMapperCache.get(object);
        if (cached) {
            return cached;
        }
    }
    let fieldMapper = { field: {} };
    fieldMapper.extraInfo = {};
    const objectMetadata = (0, object_decorator_1.getAgGridObjectMetadata)(object);
    if (objectMetadata) {
        fieldMapper.filterOption = objectMetadata;
        const fieldMetadataList = (0, object_decorator_1.getAgGridFieldMetadataList)(object);
        if (fieldMetadataList) {
            for (const propertyName of Object.keys(fieldMetadataList)) {
                const fieldMetadata = fieldMetadataList[propertyName];
                const { src, dst } = fieldMetadata, fieldMapperProperties = __rest(fieldMetadata, ["src", "dst"]);
                if (src) {
                    const newDst = dst ? getDestinationFieldName(dst) : src;
                    fieldMapper.field[src] = Object.assign(Object.assign({ dst: newDst }, fieldMapperProperties), { _propertyName: propertyName });
                    const gqlType = (_a = fieldMetadata.gqlType) === null || _a === void 0 ? void 0 : _a.call(fieldMetadata);
                    if (gqlType) {
                        fieldMapper.extraInfo[src] = (0, exports.objectToFieldMapper)(gqlType);
                    }
                }
            }
        }
    }
    else if ((0, maps_interface_1.isFieldMapper)(object)) {
        fieldMapper.field = object;
    }
    else if (isIFieldAndFilterMapper(object)) {
        fieldMapper = object;
    }
    if (typeof object !== 'symbol')
        objectToFieldMapperCache.set(object, fieldMapper);
    return fieldMapper;
};
exports.objectToFieldMapper = objectToFieldMapper;
function isIFieldAndFilterMapper(val) {
    return (val === null || val === void 0 ? void 0 : val.field) !== undefined;
}
function getEntityRelations(entityModel, dto) {
    const relations = (0, typeorm_1.getMetadataArgsStorage)().relations.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const joinColumns = (0, typeorm_1.getMetadataArgsStorage)().joinColumns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const agGridMetadata = (0, object_decorator_1.getAgGridFieldMetadataList)(dto !== null && dto !== void 0 ? dto : entityModel);
    return relations.map((r) => ({
        relation: r,
        join: joinColumns.find((j) => j.propertyName === r.propertyName),
        agField: agGridMetadata
            ? Object.values(agGridMetadata).find((v) => v.dst === r.propertyName)
            : { _propertyName: r.propertyName },
    }));
}
function getTypeProperties(entityModel) {
    const columns = (0, typeorm_1.getMetadataArgsStorage)().columns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const fieldMetadataList = (0, object_decorator_1.getAgGridFieldMetadataList)(entityModel);
    if (fieldMetadataList) {
        for (const propertyName of Object.keys(fieldMetadataList)) {
            const fieldMetadata = fieldMetadataList[propertyName];
            if (fieldMetadata.mode !== 'derived') {
                continue;
            }
            columns.push({
                propertyName,
                target: entityModel,
                mode: 'regular',
                options: {},
            });
        }
    }
    return columns;
}
function getMappedTypeProperties(entityModel) {
    const fieldMapper = (0, exports.objectToFieldMapper)(entityModel);
    return getTypeProperties(entityModel).reduce((r, v) => {
        var _a;
        const src = (0, exports.getFieldMapperSrcByDst)(fieldMapper.field, v.propertyName);
        if (!((_a = fieldMapper.field[src]) === null || _a === void 0 ? void 0 : _a.denyFilter))
            r.push(src);
        return r;
    }, new Array());
}
//# sourceMappingURL=ag-grid-metadata.helper.js.map