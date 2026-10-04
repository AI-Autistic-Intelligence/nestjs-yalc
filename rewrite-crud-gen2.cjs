const fs = require('fs');
const file = 'crud-gen/src/__tests__/crud-gen.input.spec.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /jest\.mock\('\.\.\/api-graphql\/crud-gen-gql\.enum\.js', \(\) => \(\{\n  __esModule: true,\n  \.\.\.jest\.requireActual\('\.\.\/api-graphql\/crud-gen-gql\.enum\.js'\),\n  entityFieldsEnumGqlFactory: jest\.fn\(\)\.mockReturnValue\(\{ test: 'test' \}\),\n\}\)\);\nimport \{ entityFieldsEnumGqlFactory \} from '\.\.\/api-graphql\/crud-gen-gql\.enum\.js';\nconst spiedEntityFieldsEnumGqlFactory = entityFieldsEnumGqlFactory as jest\.Mock;/,
  `jest.mock('../api-graphql/crud-gen-gql.enum.js');
import { entityFieldsEnumGqlFactory } from '../api-graphql/crud-gen-gql.enum.js';
const spiedEntityFieldsEnumGqlFactory = entityFieldsEnumGqlFactory as jest.Mock;`
);

fs.writeFileSync(file, content);
