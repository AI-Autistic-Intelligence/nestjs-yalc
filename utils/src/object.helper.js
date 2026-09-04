"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMergeWithoutArrayConcat = exports.deepMerge = exports._deepMerge = exports.isObject = void 0;
exports.isObjectStrict = isObjectStrict;
exports.objectSetProp = objectSetProp;
exports.objectsHaveSameKeys = objectsHaveSameKeys;
exports.getObjectId = getObjectId;
const isObject = (val) => {
    return val === Object(val) && !Array.isArray(val);
};
exports.isObject = isObject;
function isObjectStrict(val) {
    return ((0, exports.isObject)(val) &&
        !Array.isArray(val) &&
        !(val instanceof Date) &&
        !(typeof val === 'function'));
}
const _deepMerge = (isArrayConcat, target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const result = target;
    if ((0, exports.isObject)(result)) {
        const len = sources.length;
        for (let i = 0; i < len; i += 1) {
            const elm = sources[i];
            if ((0, exports.isObject)(elm)) {
                for (const key in elm) {
                    if (Object.prototype.hasOwnProperty.call(elm, key)) {
                        if ((0, exports.isObject)(elm[key]) && typeof elm[key] !== 'function') {
                            if (!result[key] || !(0, exports.isObject)(result[key])) {
                                result[key] = {};
                            }
                            (0, exports._deepMerge)(isArrayConcat, result[key], elm[key]);
                        }
                        else {
                            if (isArrayConcat &&
                                Array.isArray(result[key]) &&
                                Array.isArray(elm[key])) {
                                result[key] = Array.from(new Set(result[key].concat(elm[key])));
                            }
                            else {
                                result[key] = elm[key];
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
};
exports._deepMerge = _deepMerge;
const deepMerge = (target, ...sources) => {
    return (0, exports._deepMerge)(true, target, ...sources);
};
exports.deepMerge = deepMerge;
const deepMergeWithoutArrayConcat = (target, ...sources) => {
    return (0, exports._deepMerge)(false, target, ...sources);
};
exports.deepMergeWithoutArrayConcat = deepMergeWithoutArrayConcat;
function objectSetProp(obj, path, value) {
    let schema = obj;
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];
        if (!schema[elem])
            schema[elem] = {};
        schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
    return obj;
}
function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
}
let count = 0;
const idMap = new WeakMap();
function getObjectId(object) {
    const objectId = idMap.get(object);
    if (objectId === undefined) {
        count += 1;
        idMap.set(object, count);
        return count;
    }
    return objectId;
}
//# sourceMappingURL=object.helper.js.map