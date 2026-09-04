import { isFieldMapper, } from '@nestjs-yalc/interfaces/maps.interface';
import { getMetadataArgsStorage } from 'typeorm';
import { getAgGridFieldMetadataList, getAgGridObjectMetadata, isDstExtended, } from './object.decorator';
export const columnConversion = (key, data) => {
    if (data) {
        const dst = data[key]?.dst ?? key;
        return getDestinationFieldName(dst);
    }
    return key;
};
export const getFieldMapperSrcByDst = (data, dst) => {
    if (data) {
        for (const src of Object.keys(data)) {
            if (data[src].dst === dst)
                return src;
        }
    }
    return dst;
};
export const isSymbolic = (data, key) => {
    if (data && data[key]) {
        return data[key].isSymbolic ? true : false;
    }
    else {
        return false;
    }
};
export function getDestinationFieldName(dst) {
    if (isDstExtended(dst)) {
        return dst.name;
    }
    return dst;
}
const objectToFieldMapperCache = new WeakMap();
export const objectToFieldMapper = (object) => {
    if (typeof object !== 'symbol') {
        const cached = objectToFieldMapperCache.get(object);
        if (cached) {
            return cached;
        }
    }
    let fieldMapper = { field: {} };
    fieldMapper.extraInfo = {};
    const objectMetadata = getAgGridObjectMetadata(object);
    if (objectMetadata) {
        fieldMapper.filterOption = objectMetadata;
        const fieldMetadataList = getAgGridFieldMetadataList(object);
        if (fieldMetadataList) {
            for (const propertyName of Object.keys(fieldMetadataList)) {
                const fieldMetadata = fieldMetadataList[propertyName];
                const { src, dst, ...fieldMapperProperties } = fieldMetadata;
                if (src) {
                    const newDst = dst ? getDestinationFieldName(dst) : src;
                    fieldMapper.field[src] = {
                        dst: newDst,
                        ...fieldMapperProperties,
                        _propertyName: propertyName,
                    };
                    const gqlType = fieldMetadata.gqlType?.();
                    if (gqlType) {
                        fieldMapper.extraInfo[src] = objectToFieldMapper(gqlType);
                    }
                }
            }
        }
    }
    else if (isFieldMapper(object)) {
        fieldMapper.field = object;
    }
    else if (isIFieldAndFilterMapper(object)) {
        fieldMapper = object;
    }
    if (typeof object !== 'symbol')
        objectToFieldMapperCache.set(object, fieldMapper);
    return fieldMapper;
};
export function isIFieldAndFilterMapper(val) {
    return val?.field !== undefined;
}
export function getEntityRelations(entityModel, dto) {
    const relations = getMetadataArgsStorage().relations.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const joinColumns = getMetadataArgsStorage().joinColumns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const agGridMetadata = getAgGridFieldMetadataList(dto ?? entityModel);
    return relations.map((r) => ({
        relation: r,
        join: joinColumns.find((j) => j.propertyName === r.propertyName),
        agField: agGridMetadata
            ? Object.values(agGridMetadata).find((v) => v.dst === r.propertyName)
            : { _propertyName: r.propertyName },
    }));
}
export function getTypeProperties(entityModel) {
    const columns = getMetadataArgsStorage().columns.filter((v) => typeof v.target !== 'string' &&
        (entityModel.prototype instanceof v.target || entityModel === v.target));
    const fieldMetadataList = getAgGridFieldMetadataList(entityModel);
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
export function getMappedTypeProperties(entityModel) {
    const fieldMapper = objectToFieldMapper(entityModel);
    return getTypeProperties(entityModel).reduce((r, v) => {
        const src = getFieldMapperSrcByDst(fieldMapper.field, v.propertyName);
        if (!fieldMapper.field[src]?.denyFilter)
            r.push(src);
        return r;
    }, new Array());
}
//# sourceMappingURL=ag-grid-metadata.helper.js.map