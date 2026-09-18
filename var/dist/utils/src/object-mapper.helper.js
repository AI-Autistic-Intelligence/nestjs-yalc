"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMapper = objectMapper;
function setMappedProperty(mapProperty, inputObject, outputObject, propertyName, outputKey) {
    let options;
    if (mapProperty === true) {
        options = {};
    }
    else {
        options = mapProperty;
    }
    if (options.exclude === true)
        return;
    outputObject[outputKey] = options.transformer
        ? options.transformer(inputObject, propertyName)
        : inputObject[propertyName];
}
function objectMapper(inputObject, mapper, options = {}) {
    const outputObject = {};
    for (const propertyName in inputObject) {
        if (propertyName === '$transformer') {
            const transformer = inputObject[propertyName];
            transformer(inputObject, outputObject);
            continue;
        }
        const mapProperty = mapper[propertyName];
        if (mapProperty === undefined) {
            if (options.copyNonMappedProperties === true)
                outputObject[propertyName] = inputObject[propertyName];
            continue;
        }
        if (mapProperty === false)
            continue;
        if (typeof mapProperty !== 'object') {
            outputObject[mapProperty] = inputObject[propertyName];
            continue;
        }
        Object.keys(mapProperty).forEach((mapPropertyKey) => {
            const mapPropertyItem = mapProperty[mapPropertyKey];
            if (!mapPropertyItem)
                return;
            setMappedProperty(mapPropertyItem, inputObject, outputObject, propertyName, mapPropertyKey);
        });
    }
    return outputObject;
}
//# sourceMappingURL=object-mapper.helper.js.map