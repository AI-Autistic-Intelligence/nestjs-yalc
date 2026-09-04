import { faker } from '@faker-js/faker';
import { getTestFilenameWithoutExtension } from './helpers';
export function classesAreDefinedTest(moduleName, classList) {
    describe(`${getTestFilenameWithoutExtension(moduleName)} classes test`, () => {
        for (const aClass of classList) {
            it(`should be able to create ${aClass.name} class instance`, () => {
                const testData = new aClass();
                expect(testData).toBeInstanceOf(aClass);
            });
        }
    });
}
export function factoriesAreDefinedTest(moduleName, factoryList) {
    describe(`${getTestFilenameWithoutExtension(moduleName)} factories test`, () => {
        it(`All the factories should be defined`, () => {
            for (const aFactory of factoryList) {
                let instance = aFactory(faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker.datatype, 'number').mockReturnValue(0);
                jest.spyOn(faker.datatype, 'boolean').mockReturnValue(false);
                instance = aFactory(faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker.datatype, 'number').mockReturnValue(1);
                jest.spyOn(faker.datatype, 'boolean').mockReturnValue(true);
                instance = aFactory(faker);
                expect(instance).toBeDefined();
                jest.spyOn(faker.datatype, 'number').mockRestore();
                jest.spyOn(faker.datatype, 'boolean').mockRestore();
            }
        });
    });
}
//# sourceMappingURL=common-test.js.map