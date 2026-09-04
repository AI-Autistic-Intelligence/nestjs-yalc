import { jest } from '@jest/globals';
import { createRequire } from 'module';
const dynamicRequire = typeof require === 'function'
    ? require
    : createRequire(typeof import.meta !== 'undefined' && import.meta.url
        ? import.meta.url
        : new URL('./', `file://${process.cwd()}/`).href);
let NestGraphql;
try {
    jest.mock('@nestjs/graphql');
    NestGraphql = dynamicRequire('@nestjs/graphql');
}
catch (e) {
}
import { createMock, } from '@golevelup/ts-jest';
export const mockedNestGraphql = () => {
    return NestGraphql;
};
export const mockedGqlCtxCreate = () => {
    return (mockedNestGraphql().GqlExecutionContext.create = jest.fn());
};
export const mockedExecutionContext = createMock();
export const mockChainingObject = (partial, options) => {
    const mockObject = createMock(partial, options);
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
export const mockQueryBuilder = (partial, options) => {
    const mockObject = mockChainingObject(partial, options);
    mockObject.connection.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockObject);
    return mockObject;
};
//# sourceMappingURL=common-mocks.helper.js.map