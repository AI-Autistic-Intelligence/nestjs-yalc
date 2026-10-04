import {
  expect,
  jest,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';

import * as Validator from '../validator.decorator.js';

import { StringFormatEnum } from '../string-format.enum.js';

describe('validator decorator test', () => {
  it('StringFormatMatchValidation is defined', async () => {
    let testData = Validator.StringFormatMatchValidation();
    expect(testData('', '')).not.toBeDefined(); //This is only for the coverage

    testData = Validator.StringFormatMatchValidation({});
    expect(testData).toBeDefined();
  });

  it('DateValidation is defined', async () => {
    let testData = Validator.DateValidation();
    expect(testData('', '')).not.toBeDefined(); //This is only for the coverage

    testData = Validator.DateValidation({});
    expect(testData).toBeDefined();
  });

  it('stringFormatMatchValidatorFactory return the correct result', async () => {
    const testDataFunctionMatch = Validator.stringFormatMatchValidatorFactory({
      toMatch: true,
      pattern: '^valid$',
    });
    const testDataFunctionDontMatch =
      Validator.stringFormatMatchValidatorFactory({
        toMatch: false,
        pattern: '^valid$',
      });

    expect(testDataFunctionMatch.validate('valid')).toEqual(true);
    expect(testDataFunctionDontMatch.validate('valid')).toEqual(false);

    expect(testDataFunctionMatch.validate('invalid')).toEqual(false);
    expect(testDataFunctionDontMatch.validate('invalid')).toEqual(true);
  });

  it("dateValidatorFactory return validateDate's result", async () => {
    const testDataFunction = Validator.dateValidatorFactory();

    expect(testDataFunction.validate('2023-01-01')).toEqual(true);
    expect(testDataFunction.validate('not-a-date')).toEqual(false);
  });
});
