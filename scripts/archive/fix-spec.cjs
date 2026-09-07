const fs = require('fs');

let content = fs.readFileSync('ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts', 'utf8');

// 1. Add jest globals at the top
content = `import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';\n` + content;

// 2. Remove static imports of mocked modules and SUT
content = content.replace(/import \{ GqlExecutionContext \} from '@nestjs\/graphql';\n/g, '');
content = content.replace(/import \* as GqlAgGridDecorator from '\.\.\/gqlfields\.decorator';\n/g, '');
content = content.replace(/import \* as AgGridHelpers from '\.\.\/ag-grid-metadata\.helper';\n/g, '');
content = content.replace(/import \* as agGridArgsDecorator from '\.\.\/ag-grid-args\.decorator';\n/g, '');
content = content.replace(/import \* as AgGridInput from '\.\.\/ag-grid\.input';\n/g, '');

// 3. Add unstable_mockModule calls for the modules we want to mock
const mocks = `import { importMockedEsm } from '@nest-yalc-2/jest/esm.helper.js';

const mockArgs = jest.fn();
const mockCreate = jest.fn();
jest.unstable_mockModule('@nestjs/graphql', () => ({
  Args: mockArgs,
  GqlExecutionContext: {
    create: mockCreate,
  },
}));

const mockGqlAgGridFieldsMapper = jest.fn();
jest.unstable_mockModule('../gqlfields.decorator.js', () => ({
  GqlAgGridFieldsMapper: mockGqlAgGridFieldsMapper,
}));

const mockObjectToFieldMapper = jest.fn();
jest.unstable_mockModule('../ag-grid-metadata.helper.js', () => ({
  objectToFieldMapper: mockObjectToFieldMapper,
}));

const mockAgJoinArgFactory = jest.fn();
jest.unstable_mockModule('../ag-grid.input.js', () => ({
  agJoinArgFactory: mockAgJoinArgFactory,
}));

const graphql = await import('@nestjs/graphql');
const AgGridHelpers = await import('../ag-grid-metadata.helper.js');
const GqlAgGridDecorator = await import('../gqlfields.decorator.js');
const AgGridInput = await import('../ag-grid.input.js');
const agGridArgsDecorator = await import('../ag-grid-args.decorator.js');
`;

content = content.replace(/import \{ importMockedEsm \} from '@nest-yalc-2\/jest\/esm\.helper\.js';\n/g, mocks);

// 4. Fix GqlExecutionContext usages
content = content.replace(/jest\.spyOn\(GqlExecutionContext, 'create'\)/g, "jest.spyOn(graphql.GqlExecutionContext, 'create')");
content = content.replace(/GqlExecutionContext\.create\(/g, 'graphql.GqlExecutionContext.create(');

// 5. Fix mockedNestGraphql().Args
content = content.replace(/mockedNestGraphql\(\)\.Args as jest\.Mock/g, 'mockArgs as jest.Mock');
content = content.replace(/graphql\.Args as jest\.Mock/g, 'mockArgs as jest.Mock');
content = content.replace(/jest\.spyOn\(graphql, 'Args'\)/g, 'mockArgs as jest.Mock');

// 6. Fix toThrowError
content = content.replace(/\.toThrowError\(/g, '.toThrow(');

// 7. Fix spies on mocked modules
content = content.replace(/jest\n\s+\.spyOn\(AgGridInput, 'agJoinArgFactory'\)/g, 'mockAgJoinArgFactory');
content = content.replace(/jest\.spyOn\(AgGridInput, 'agJoinArgFactory'\)/g, 'mockAgJoinArgFactory');
content = content.replace(/jest\.spyOn\(\n\s+AgGridInput,\n\s+'agJoinArgFactory',\n\s+\)/g, 'mockAgJoinArgFactory');

content = content.replace(/jest\.spyOn\(\n\s+AgGridHelpers,\n\s+'objectToFieldMapper',\n\s+\)/g, 'mockObjectToFieldMapper');
content = content.replace(/jest\.spyOn\(AgGridHelpers, 'objectToFieldMapper'\)/g, 'mockObjectToFieldMapper');

content = content.replace(/jest\n\s+\.spyOn\(GqlAgGridDecorator, 'GqlAgGridFieldsMapper'\)/g, 'mockGqlAgGridFieldsMapper');
content = content.replace(/jest\.spyOn\(GqlAgGridDecorator, 'GqlAgGridFieldsMapper'\)/g, 'mockGqlAgGridFieldsMapper');

// 8. Replace jest.mock with jest.unstable_mockModule where appropriate
content = content.replace(/jest\.mock\('\.\.\/ag-grid\.args',/g, "jest.unstable_mockModule('../ag-grid.args.js',");
content = content.replace(/jest\.mock\('@nestjs\/graphql'\);/g, ''); // we already handle this

fs.writeFileSync('ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts', content);
console.log('Fixed spec file properly');
