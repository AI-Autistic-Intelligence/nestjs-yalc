"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockQueryBuilder = exports.mockChainingObject = exports.mockedExecutionContext = exports.mockedGqlCtxCreate = exports.mockedNestGraphql = void 0;
const tslib_1 = require("tslib");
jest.mock('@fastify/cookie', () => {
    const plugin = (_fastify, _options, done) => done();
    plugin[Symbol.for('skip-override')] = true;
    return {
        __esModule: true,
        default: plugin,
    };
});
const NestGraphql = tslib_1.__importStar(require("@nestjs/graphql"));
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