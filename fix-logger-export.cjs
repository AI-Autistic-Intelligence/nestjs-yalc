const fs = require('fs');

let content = fs.readFileSync('logger/src/index.ts', 'utf8');
content = content.replace("export * from './logger.factory.js';", "export { NestAppLoggerFactory as AppLoggerFactory } from './logger.factory.js';");
fs.writeFileSync('logger/src/index.ts', content);

content = fs.readFileSync('logger/src/__tests__/logger.factory.spec.ts', 'utf8');
content = content.replace(/AppLoggerFactory/g, 'NestAppLoggerFactory');
fs.writeFileSync('logger/src/__tests__/logger.factory.spec.ts', content);

