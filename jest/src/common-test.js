"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classesAreDefinedTest = classesAreDefinedTest;
exports.factoriesAreDefinedTest = factoriesAreDefinedTest;
const faker_1 = require("@faker-js/faker");
const helpers_1 = require("./helpers");
function classesAreDefinedTest(moduleName, classList) {
    describe(`${(0, helpers_1.getTestFilenameWithoutExtension)(moduleName)} classes test`, () => {
        for (const aClass of classList) {
            it(`should be able to create ${aClass.name} class instance`, () => {
                const testData = new aClass();
                expect(testData).toBeInstanceOf(aClass);
            });
        }
    });
}
function factoriesAreDefinedTest(moduleName, factoryList) {
    describe(`${(0, helpers_1.getTestFilenameWithoutExtension)(moduleName)} factories test`, () => {
        it(`All the factories should be defined`, () => {
            for (const aFactory of factoryList) {
                let instance = aFactory(faker_1.faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker_1.faker.datatype, 'number').mockReturnValue(0);
                jest.spyOn(faker_1.faker.datatype, 'boolean').mockReturnValue(false);
                instance = aFactory(faker_1.faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker_1.faker.datatype, 'number').mockReturnValue(1);
                jest.spyOn(faker_1.faker.datatype, 'boolean').mockReturnValue(true);
                instance = aFactory(faker_1.faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker_1.faker.datatype, 'number').mockRestore();
                jest.spyOn(faker_1.faker.datatype, 'boolean').mockRestore();
            }
        });
    });
}
//# sourceMappingURL=common-test.js.map