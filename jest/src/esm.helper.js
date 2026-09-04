"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMockedEsm = importMockedEsm;
const path = __importStar(require("path"));
const url = __importStar(require("url"));
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
    const module = await Promise.resolve(`${modulePath}`).then(s => __importStar(require(s)));
    const moduleCopy = Object.assign({}, module);
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