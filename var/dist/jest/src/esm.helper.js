"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMockedEsm = importMockedEsm;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const url = tslib_1.__importStar(require("url"));
const globals_1 = require("@jest/globals");
function forEachDeep(obj, cb, options = { depth: 6 }) {
    (function walk(value, property = undefined, parent = null, objPath = []) {
        return value && typeof value === 'object' && objPath.length <= options.depth
            ? Object.entries(value).forEach(([key, val]) => walk(val, key, value, [...objPath, key]))
            : cb([property, value], parent, objPath);
    })(obj);
}
const NOOP = (x) => x;
async function importMockedEsm(moduleSpecifier, importMeta, skipActualMock = false, factory = NOOP) {
    let modulePath = moduleSpecifier;
    if (moduleSpecifier.startsWith('.')) {
        const metaPath = url.fileURLToPath(new URL('./', importMeta.url));
        const thisMetaPath = url.fileURLToPath(new URL('./', import.meta.url));
        const absolutePath = path.join(metaPath, moduleSpecifier);
        modulePath = path.relative(thisMetaPath, absolutePath);
    }
    const module = await Promise.resolve(`${modulePath}`).then(s => tslib_1.__importStar(require(s)));
    const moduleCopy = { ...module };
    forEachDeep(moduleCopy, ([prop, value], obj) => {
        if (typeof value === 'function') {
            try {
                obj[prop] = globals_1.jest.fn(value);
            }
            catch (e) {
            }
            Object.assign(obj[prop], value);
            Object.getOwnPropertyNames(value).forEach((k) => {
                if (k !== 'length' && k !== 'name' && k !== 'prototype') {
                    try {
                        Object.defineProperty(obj[prop], k, Object.getOwnPropertyDescriptor(value, k));
                    }
                    catch (e) {
                    }
                }
            });
        }
    });
    const moduleMock = factory(moduleCopy);
    if (!skipActualMock)
        globals_1.jest.unstable_mockModule(modulePath, () => moduleMock);
    return moduleMock;
}
//# sourceMappingURL=esm.helper.js.map