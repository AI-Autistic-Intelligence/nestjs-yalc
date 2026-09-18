"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelFieldToDest = modelFieldToDest;
const index_js_1 = require("@nest-yalc-2/utils/index.js");
const object_decorator_js_1 = require("../object.decorator.js");
function isLikeOutputObject(input, output) {
    return (0, index_js_1.objectsHaveSameKeys)(input, output) === true;
}
function modelFieldToDest(inputObject, outputObject) {
    if (!(0, index_js_1.isClass)(inputObject)) {
        if (!isLikeOutputObject(inputObject, outputObject))
            return inputObject;
        return null;
    }
    const mappedObject = {};
    const fieldMetadataList = (0, object_decorator_js_1.getModelFieldMetadataList)(inputObject);
    const outputKeys = Object.keys(outputObject);
    for (const propertyName of Object.keys(inputObject)) {
        const fieldMetadata = fieldMetadataList?.[propertyName];
        if (!fieldMetadata?.dst) {
            if (outputKeys.includes(propertyName)) {
                mappedObject[propertyName] = inputObject[propertyName];
            }
            continue;
        }
        if (!(0, object_decorator_js_1.isDstExtended)(fieldMetadata.dst)) {
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