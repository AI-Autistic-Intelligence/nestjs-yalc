"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMockedEsm = importMockedEsm;
const tslib_1 = require("tslib");
/**
 * This is a workaround to fix the issue with mocking ESM modules in jest
 * Issue: https://github.com/facebook/jest/issues/13258
 * also @see https://stackoverflow.com/questions/75519950/how-can-i-avoid-a-weird-workaround-when-using-jest-and-esm-together
 *
 * If you hit "Cannot assign to read only property X" while mocking an ESM module,
 * use importMockedEsm in the spec to load a mockable copy before importing the SUT.
 * This helper wraps every function in jest.fn and registers the mock via
 * jest.unstable_mockModule, which avoids the read-only export errors that
 * block normal jest.mock under ESM.
 *
 * Original code:
 * @see https://gist.github.com/booya2nd/dcaa1775fd4c06cd79610e3feea6362c#file-mock-esmodule-js
 */
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const thisMetaPath = url.fileURLToPath(new URL('./', import.meta.url));
        const absolutePath = path.join(metaPath, moduleSpecifier);
        modulePath = path.relative(thisMetaPath, absolutePath);
    }
    const module = await import(modulePath);
    const moduleCopy = { ...module };
    forEachDeep(moduleCopy, ([prop, value], obj) => {
        if (typeof value === 'function') {
            try {
                obj[prop] = globals_1.jest.fn(value);
            }
            catch (e) {
                // catch the TypeError: Cannot set property X of [object Object] which has only a getter
                // console.error(e);
            }
            // re-adding stinky dynamic custom properties which jest.fn() may has removed
            Object.assign(obj[prop], value);
            // copy non-enumerable static properties (like class static methods)
            Object.getOwnPropertyNames(value).forEach((k) => {
                if (k !== 'length' && k !== 'name' && k !== 'prototype') {
                    try {
                        Object.defineProperty(obj[prop], k, Object.getOwnPropertyDescriptor(value, k));
                    }
                    catch (e) {
                        // ignore
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