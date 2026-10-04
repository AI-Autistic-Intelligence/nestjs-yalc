import { jest } from '@jest/globals';

const actual = jest.requireActual('../crud-gen-gql.enum.js') as any;

export const entityFieldsEnumGqlFactory = jest.fn().mockReturnValue({ test: 'test' });
export const GeneralFilters = actual.GeneralFilters;
export const FilterType = actual.FilterType;
export const Operators = actual.Operators;
export const SortDirection = actual.SortDirection;
