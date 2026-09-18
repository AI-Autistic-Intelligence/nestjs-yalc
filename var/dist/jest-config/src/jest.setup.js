"use strict";
process.env.NODE_ENV = 'test';
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
    process.on('unhandledRejection', (err) => {
        throw err;
    });
    process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}
jest.mock('@nestjs/graphql', () => {
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
    return mockedModule;
});
//# sourceMappingURL=jest.setup.js.map