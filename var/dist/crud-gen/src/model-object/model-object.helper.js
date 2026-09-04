import { isClass, objectsHaveSameKeys } from '@nestjs-yalc/utils/index.js';
import { getModelFieldMetadataList, isDstExtended, } from '../object.decorator.js';
function isLikeOutputObject(input, output) {
    return objectsHaveSameKeys(input, output) === true;
}
export function modelFieldToDest(inputObject, outputObject) {
    if (!isClass(inputObject)) {
        if (!isLikeOutputObject(inputObject, outputObject))
            return inputObject;
        return null;
    }
    const mappedObject = {};
    const fieldMetadataList = getModelFieldMetadataList(inputObject);
    const outputKeys = Object.keys(outputObject);
    for (const propertyName of Object.keys(inputObject)) {
        const fieldMetadata = fieldMetadataList?.[propertyName];
        if (!fieldMetadata?.dst) {
            if (outputKeys.includes(propertyName)) {
                mappedObject[propertyName] = inputObject[propertyName];
            }
            continue;
        }
        if (!isDstExtended(fieldMetadata.dst)) {
            if (!outputKeys.includes(fieldMetadata.dst))
                throw new Error(`Cannot map property ${fieldMetadata.dst} into the OutputObject. Property doesn't exist in the destination`);
            mappedObject[fieldMetadata.dst] = inputObject[propertyName];
            continue;
        }
        const dst = fieldMetadata.dst;
        if (!outputKeys.includes(dst.name))
            throw new Error(`Cannot map extended property ${dst.name} into the OutputObject. Property doesn't exist in the destination`);
        mappedObject[dst.name] = dst.transformerDst?.(mappedObject, inputObject[propertyName]);
    }
    return mappedObject;
}
//# sourceMappingURL=model-object.helper.js.map