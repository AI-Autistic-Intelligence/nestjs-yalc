"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('../api-graphql/crud-gen-gql.enum.js', () => {
    const actual = globals_1.jest.requireActual('../api-graphql/crud-gen-gql.enum.js');
    return {
        ...actual,
        entityFieldsEnumGqlFactory: globals_1.jest.fn().mockReturnValue({ test: 'test' }),
    };
});
const CrudGenGqlEnum = tslib_1.__importStar(require("../api-graphql/crud-gen-gql.enum.js"));
const spiedEntityFieldsEnumGqlFactory = CrudGenGqlEnum.entityFieldsEnumGqlFactory;
const crud_gen_input_js_1 = require("../api-graphql/crud-gen.input.js");
const entity_mock_js_1 = require("../__mocks__/entity.mock.js");
describe('Dynamic user input dto test', () => {
    it('Check RowGroup Dto', async () => {
        const testData = new crud_gen_input_js_1.RowGroup();
        expect(testData).toBeDefined();
    });
    it('Check SortModel Dto', async () => {
        const testData = new crud_gen_input_js_1.SortModel();
        expect(testData).toBeDefined();
    });
    describe('Check SortModelFactory', () => {
        class DummySortEntity1 {
        }
        class DummySortEntity2 {
        }
        beforeEach(() => {
            spiedEntityFieldsEnumGqlFactory.mockReturnValue({
                ['test']: 'test',
            });
        });
        afterEach(() => {
            spiedEntityFieldsEnumGqlFactory.mockReset();
        });
        it('Should return a SortModel correctly not cached', () => {
            const result = (0, crud_gen_input_js_1.sortModelFactory)(DummySortEntity1);
            expect(result).toBeDefined();
            expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(1);
            spiedEntityFieldsEnumGqlFactory.mockReset();
        });
        it('Should return a SortModel correctly cached', () => {
            (0, crud_gen_input_js_1.sortModelFactory)(DummySortEntity2);
            spiedEntityFieldsEnumGqlFactory.mockReset();
            const result = (0, crud_gen_input_js_1.sortModelFactory)(DummySortEntity2);
            expect(result).toBeDefined();
            expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(0);
        });
    });
    describe('Check FilterExpressionInputFactory', () => {
        class DummyFilterEntity1 {
        }
        class DummyFilterEntity2 {
        }
        beforeEach(() => {
            spiedEntityFieldsEnumGqlFactory.mockReturnValue({
                ['test']: 'test',
            });
        });
        afterEach(() => {
            spiedEntityFieldsEnumGqlFactory.mockReset();
        });
        it('Should return a FilterExpression correctly not cached', () => {
            const result = (0, crud_gen_input_js_1.filterExpressionInputFactory)(DummyFilterEntity1);
            expect(result).toBeDefined();
            expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(1);
            spiedEntityFieldsEnumGqlFactory.mockReset();
        });
        it('Should return a FilterExpression correctly cached', () => {
            (0, crud_gen_input_js_1.filterExpressionInputFactory)(DummyFilterEntity2);
            spiedEntityFieldsEnumGqlFactory.mockReset();
            const result = (0, crud_gen_input_js_1.filterExpressionInputFactory)(DummyFilterEntity2);
            expect(result).toBeDefined();
            expect(spiedEntityFieldsEnumGqlFactory).toHaveBeenCalledTimes(0);
        });
    });
    it('Should return the JoinOptionInput already cached', () => {
        const result = (0, crud_gen_input_js_1.agJoinArgFactory)(entity_mock_js_1.TestEntityRelation);
        expect(result).toBeDefined();
        const cachedResult = (0, crud_gen_input_js_1.agJoinArgFactory)(entity_mock_js_1.TestEntityRelation);
        expect(cachedResult).toBe(result);
    });
});
//# sourceMappingURL=module.js.map