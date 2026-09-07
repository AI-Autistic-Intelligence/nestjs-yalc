"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestJsGraphqlMock = createNestJsGraphqlMock;
exports.mockNestJSGraphql = mockNestJSGraphql;
const globals_1 = require("@jest/globals");
const esm_helper_js_1 = require("./esm.helper.js");
async function createNestJsGraphqlMock(importMeta) {
    const mockedGraphql = (await (0, esm_helper_js_1.importMockedEsm)('@nestjs/graphql', importMeta, true));
    class Fake {
    }
    Object.keys(mockedGraphql).forEach((key) => {
        mockedGraphql[key].mockImplementation?.(() => globals_1.jest.fn());
    });
    mockedGraphql.OmitType.mockImplementation((() => Fake));
    mockedGraphql.PickType.mockImplementation((() => Fake));
    mockedGraphql.PartialType.mockImplementation((() => Fake));
    mockedGraphql.IntersectionType.mockImplementation((() => Fake));
    return mockedGraphql;
}
async function mockNestJSGraphql(importMeta) {
    const mockedGraphql = await createNestJsGraphqlMock(importMeta);
    globals_1.jest.unstable_mockModule('@nestjs/graphql', () => mockedGraphql);
    return mockedGraphql;
}
//# sourceMappingURL=graphql.helper.js.map