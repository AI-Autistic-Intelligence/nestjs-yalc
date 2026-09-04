export const isObject = (val) => {
    return val === Object(val) && !Array.isArray(val);
};
export function isObjectStrict(val) {
    return (isObject(val) &&
        !Array.isArray(val) &&
        !(val instanceof Date) &&
        !(typeof val === 'function'));
}
export const _deepMerge = (isArrayConcat, target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const result = target;
    if (isObject(result)) {
        const len = sources.length;
        for (let i = 0; i < len; i += 1) {
            const elm = sources[i];
            if (isObject(elm)) {
                for (const key in elm) {
                    if (Object.prototype.hasOwnProperty.call(elm, key)) {
                        if (isObject(elm[key]) && typeof elm[key] !== 'function') {
                            if (!result[key] || !isObject(result[key])) {
                                result[key] = {};
                            }
                            _deepMerge(isArrayConcat, result[key], elm[key]);
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
export const deepMerge = (target, ...sources) => {
    return _deepMerge(true, target, ...sources);
};
export const deepMergeWithoutArrayConcat = (target, ...sources) => {
    return _deepMerge(false, target, ...sources);
};
export function objectSetProp(obj, path, value) {
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
export function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
}
let count = 0;
const idMap = new WeakMap();
export function getObjectId(object) {
    const objectId = idMap.get(object);
    if (objectId === undefined) {
        count += 1;
        idMap.set(object, count);
        return count;
    }
    return objectId;
}
//# sourceMappingURL=object.helper.js.map