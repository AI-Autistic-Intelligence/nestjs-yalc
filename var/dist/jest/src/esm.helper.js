var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import * as path from 'path';
import * as url from 'url';
import { jest } from '@jest/globals';
function forEachDeep(obj, cb, options = { depth: 6 }) {
    (function walk(value, property = undefined, parent = null, objPath = []) {
        return value && typeof value === 'object' && objPath.length <= options.depth
            ? Object.entries(value).forEach(([key, val]) => walk(val, key, value, [...objPath, key]))
            : cb([property, value], parent, objPath);
    })(obj);
}
const NOOP = (x) => x;
export async function importMockedEsm(moduleSpecifier, importMeta, skipActualMock = false, factory = NOOP) {
    let modulePath = moduleSpecifier;
    if (moduleSpecifier.startsWith('.')) {
        const metaPath = url.fileURLToPath(new URL('./', importMeta.url));
        const thisMetaPath = url.fileURLToPath(new URL('./', import.meta.url));
        const absolutePath = path.join(metaPath, moduleSpecifier);
        modulePath = path.relative(thisMetaPath, absolutePath);
    }
    const module = await import(__rewriteRelativeImportExtension(modulePath));
    const moduleCopy = { ...module };
    forEachDeep(moduleCopy, ([prop, value], obj) => {
        if (typeof value === 'function') {
            try {
                obj[prop] = jest.fn(value);
            }
            catch (e) {
            }
            Object.assign(obj[prop], value);
        }
    });
    const moduleMock = factory(moduleCopy);
    if (!skipActualMock)
        jest.unstable_mockModule(modulePath, () => moduleMock);
    return moduleMock;
}
//# sourceMappingURL=esm.helper.js.map