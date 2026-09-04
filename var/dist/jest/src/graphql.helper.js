import { jest } from '@jest/globals';
import { importMockedEsm } from './esm.helper.js';
export async function createNestJsGraphqlMock(importMeta) {
    const mockedGraphql = (await importMockedEsm('@nestjs/graphql', importMeta, true));
    class Fake {
    }
    Object.keys(mockedGraphql).forEach((key) => {
        mockedGraphql[key].mockImplementation?.(() => jest.fn());
    });
    mockedGraphql.OmitType.mockImplementation((() => Fake));
    mockedGraphql.PickType.mockImplementation((() => Fake));
    mockedGraphql.PartialType.mockImplementation((() => Fake));
    mockedGraphql.IntersectionType.mockImplementation((() => Fake));
    return mockedGraphql;
}
export async function mockNestJSGraphql(importMeta) {
    const mockedGraphql = await createNestJsGraphqlMock(importMeta);
    jest.unstable_mockModule('@nestjs/graphql', () => mockedGraphql);
    return mockedGraphql;
}
//# sourceMappingURL=graphql.helper.js.map