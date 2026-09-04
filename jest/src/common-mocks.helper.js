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
exports.mockQueryBuilder = exports.mockChainingObject = exports.mockedExecutionContext = exports.mockedGqlCtxCreate = exports.mockedNestGraphql = void 0;
console.log('EXECUTING COMMON MOCKS HELPER');
jest.mock('@nestjs/graphql', () => {
    console.log('EXECUTING GLOBAL FACTORY MOCK FOR @nestjs/graphql');
    const actual = jest.requireActual('@nestjs/graphql');
    const mockedModule = Object.assign({}, actual);
    const decorators = [
        'Args', 'Field', 'Query', 'Mutation', 'Resolver', 'InputType', 'ObjectType',
        'InterfaceType', 'ResolveField', 'HideField', 'Directive', 'registerEnumType', 'IntersectionType'
    ];
    for (const name of decorators) {
        if (actual[name]) {
            mockedModule[name] = jest.fn().mockImplementation((...args) => {
                return actual[name](...args);
            });
        }
    }
    mockedModule.GqlExecutionContext = Object.assign(Object.assign({}, actual.GqlExecutionContext), { create: jest.fn() });
    return mockedModule;
});
jest.mock('@fastify/cookie', () => {
    const plugin = (fastify, options, done) => done();
    plugin[Symbol.for('skip-override')] = true;
    return {
        __esModule: true,
        default: plugin,
    };
});
const NestGraphql = __importStar(require("@nestjs/graphql"));
const ts_jest_1 = require("@golevelup/ts-jest");
exports.mockedNestGraphql = NestGraphql;
exports.mockedGqlCtxCreate = exports.mockedNestGraphql.GqlExecutionContext.create;
exports.mockedExecutionContext = (0, ts_jest_1.createMock)();
const mockChainingObject = (partial, options) => {
    const mockObject = (0, ts_jest_1.createMock)(partial, options);
    const propsToOverride = new Map();
    const proxy = new Proxy(mockObject, {
        get: function (target, prop, receiver) {
            const checkProp = target[prop];
            if (propsToOverride.has(prop) || (partial && prop in partial)) {
                return Reflect.get(target, prop, receiver);
            }
            return typeof checkProp === 'function'
                ? checkProp.mockImplementation(() => {
                    Reflect.get(target, prop, receiver);
                    return proxy;
                })
                : Reflect.get(target, prop, receiver);
        },
        set: function (target, property, value, receiver) {
            propsToOverride.set(property, value);
            return Reflect.set(target, property, value, receiver);
        },
    });
    return proxy;
};
exports.mockChainingObject = mockChainingObject;
const mockQueryBuilder = (partial, options) => {
    const mockObject = (0, exports.mockChainingObject)(partial, options);
    mockObject.connection.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockObject);
    return mockObject;
};
exports.mockQueryBuilder = mockQueryBuilder;
//# sourceMappingURL=common-mocks.helper.js.map