/// <reference types="jest" />
/* istanbul ignore file */

import { FactoryType } from '@node-yalc/interfaces/common.type';
import { ClassType } from '@node-yalc/types';
import { faker } from '@faker-js/faker';
import { getTestFilenameWithoutExtension } from './helpers';

export function classesAreDefinedTest(
  moduleName: string,
  classList: ClassType[],
) {
  describe(`${getTestFilenameWithoutExtension(
    moduleName,
  )} classes test`, () => {
    for (const aClass of classList) {
      it(`should be able to create ${aClass.name} class instance`, () => {
        const testData = new aClass();
        expect(testData).toBeInstanceOf(aClass);
      });
    }
  });
}

export function factoriesAreDefinedTest(
  moduleName: string,
  factoryList: FactoryType<any>[],
) {
  describe(`${getTestFilenameWithoutExtension(
    moduleName,
  )} factories test`, () => {
    it(`All the factories should be defined`, () => {
      for (const aFactory of factoryList) {
        let instance = aFactory(faker);
        expect(instance).toBeDefined();

        jest.spyOn(faker.datatype as any, 'number').mockReturnValue(0);
        jest.spyOn(faker.datatype as any, 'boolean').mockReturnValue(false);
        instance = aFactory(faker);
        expect(instance).toBeDefined();

        jest.spyOn(faker.datatype as any, 'number').mockReturnValue(1);
        jest.spyOn(faker.datatype as any, 'boolean').mockReturnValue(true);
        instance = aFactory(faker);
        expect(instance).toBeDefined();

        jest.spyOn(faker.datatype as any, 'number').mockRestore();
        jest.spyOn(faker.datatype as any, 'boolean').mockRestore();
      }
    });
  });
}

