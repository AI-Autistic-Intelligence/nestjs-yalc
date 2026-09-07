const fs = require('fs');
const file = 'ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Add jest import and importMockedEsm
code = 'import { jest, describe, it, expect, beforeEach, afterEach } from \'@jest/globals\';\nimport { importMockedEsm } from \'@nest-yalc-2/jest/esm.helper.js\';\n' + code;

// 2. Remove static imports for SUT and local ESM modules that we will mock
code = code.replace(/import \* as agGridArgsDecorator from '\.\.\/ag-grid-args\.decorator';\r?\n/, '');
code = code.replace(/import \* as AgGridInput from '\.\.\/ag-grid\.input';\r?\n/, '');
code = code.replace(/import \* as GqlAgGridDecorator from '\.\.\/gqlfields\.decorator';\r?\n/, '');
code = code.replace(/import \* as AgGridHelpers from '\.\.\/ag-grid-metadata\.helper';\r?\n/, '');

// 3. Inject dynamic imports for mocked modules and SUT after other static imports
const dynamicImports = `
const AgGridInput = await importMockedEsm('../ag-grid.input.js', import.meta);
const GqlAgGridDecorator = await importMockedEsm('../gqlfields.decorator.js', import.meta);
const AgGridHelpers = await importMockedEsm('../ag-grid-metadata.helper.js', import.meta);
const agGridArgsDecorator = await import('../ag-grid-args.decorator.js');
`;
code = code.replace(/(const firstTextParameter = 'a';)/, dynamicImports + '\n\$1');

// 4. Fix mockCreate
code = code.replace(/const mockCreate = \(mockedNestGraphql\.GqlExecutionContext\.create = jest\.fn\(\)\);/, 'const mockCreate = jest.spyOn(GqlExecutionContext, \'create\');');
code = code.replace(/mockCreate\.mockImplementation\(\(\) => \(\{\r?\n\s*getArgs: jest\.fn\(\)\.mockReturnValue\(fixedArgsQueryParams\),\r?\n\s*getInfo: jest\.fn\(\)\.mockReturnValue\(infoObj\),\r?\n\s*\}\)\);/, 'mockCreate.mockImplementation(() => ({\n  getArgs: jest.fn().mockReturnValue(fixedArgsQueryParams),\n  getInfo: jest.fn().mockReturnValue(infoObj),\n}) as any);');

// 5. Replace jest.spyOn with direct mock calls
code = code.replace(/const objectToFieldMapper = jest\.spyOn\(\s*AgGridHelpers,\s*'objectToFieldMapper',\s*\);/g, 'const objectToFieldMapper = AgGridHelpers.objectToFieldMapper as jest.Mock;');
code = code.replace(/const qqlAgGridFieldsMapper = jest\.spyOn\(\s*GqlAgGridDecorator,\s*'GqlAgGridFieldsMapper',\s*\);/g, 'const qqlAgGridFieldsMapper = GqlAgGridDecorator.GqlAgGridFieldsMapper as jest.Mock;');
code = code.replace(/jest\.spyOn\(AgGridInput,\s*'agJoinArgFactory'\)/g, '(AgGridInput.agJoinArgFactory as jest.Mock)');

// And graphql is imported statically, but let's replace jest.spyOn just in case
code = code.replace(/const ArgsFunc = jest\.spyOn\(graphql,\s*'Args'\);/g, 'const ArgsFunc = graphql.Args as jest.Mock;');

// 6. Fix toThrowError to toThrow
code = code.replace(/\.toThrowError\(/g, '.toThrow(');

fs.writeFileSync(file, code);
