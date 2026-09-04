"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverageThreshold = exports.tsJestConfig = exports.tsJestConfigE2E = exports.globals = exports.coveragePathIgnorePatterns = void 0;
const path = __importStar(require("path"));
const readTsConfig = __importStar(require("get-tsconfig"));
const ts_jest_1 = require("ts-jest");
const jest_config_1 = require("jest-config");
exports.coveragePathIgnorePatterns = [
    '/env/dist/',
    '/node_modules/',
    '/database/seeds/',
    '/database/migrations/',
    '/test/feature/',
];
const globals = () => {
    return {
        __JEST_DISABLE_DB: true,
    };
};
exports.globals = globals;
const tsJestConfigE2E = (tsConfPath = '', withGqlPlugin = true, overrideTsJestConfig) => {
    var _a;
    const tsConfigFile = readTsConfig.getTsconfig(path.resolve(tsConfPath));
    const _b = overrideTsJestConfig !== null && overrideTsJestConfig !== void 0 ? overrideTsJestConfig : {}, { tsconfig } = _b, restTsJest = __rest(_b, ["tsconfig"]);
    const conf = Object.assign({ diagnostics: false, tsconfig: Object.assign(Object.assign({}, ((_a = tsConfigFile === null || tsConfigFile === void 0 ? void 0 : tsConfigFile.config.compilerOptions) !== null && _a !== void 0 ? _a : {})), (tsconfig !== null && tsconfig !== void 0 ? tsconfig : {})) }, restTsJest);
    if (withGqlPlugin) {
        conf.astTransformers = {
            before: [path.join(__dirname, 'gql-plugin.js')],
        };
    }
    return conf;
};
exports.tsJestConfigE2E = tsJestConfigE2E;
const tsJestConfig = (tsConfPath = '', overrideTsJestConfig) => {
    var _a;
    const tsConfigFile = readTsConfig.getTsconfig(path.resolve(path.dirname(tsConfPath)), path.basename(tsConfPath));
    if ((tsConfigFile === null || tsConfigFile === void 0 ? void 0 : tsConfigFile.path) !== tsConfPath) {
        throw new Error(`Cannot find ${tsConfPath}`);
    }
    const _b = overrideTsJestConfig !== null && overrideTsJestConfig !== void 0 ? overrideTsJestConfig : {}, { tsconfig } = _b, restTsJest = __rest(_b, ["tsconfig"]);
    const config = Object.assign({ tsconfig: Object.assign(Object.assign({}, ((_a = tsConfigFile === null || tsConfigFile === void 0 ? void 0 : tsConfigFile.config.compilerOptions) !== null && _a !== void 0 ? _a : {})), (tsconfig !== null && tsconfig !== void 0 ? tsconfig : {})), diagnostics: false }, restTsJest);
    return config;
};
exports.tsJestConfig = tsJestConfig;
const coverageThreshold = (projects = [], defaultCoverageThreshold = {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
}) => {
    const coverage = {
        global: Object.assign({}, defaultCoverageThreshold),
    };
    projects.map((project) => {
        coverage[project.rootDir] = Object.assign({}, defaultCoverageThreshold);
        if (project === null || project === void 0 ? void 0 : project.coverageThreshold) {
            coverage[project.rootDir] = Object.assign(Object.assign({}, coverage[project.rootDir]), project === null || project === void 0 ? void 0 : project.coverageThreshold);
        }
    });
    return coverage;
};
exports.coverageThreshold = coverageThreshold;
const defaultConf = (dirname, options = {}, tsJestConfig = {}) => {
    var _a, _b;
    const tsConfigFile = readTsConfig.getTsconfig(path.join(dirname, 'tsconfig.json'));
    const compilerOptions = (_a = tsConfigFile === null || tsConfigFile === void 0 ? void 0 : tsConfigFile.config.compilerOptions) !== null && _a !== void 0 ? _a : {};
    const config = Object.assign({ rootDir: dirname, modulePathIgnorePatterns: [
            '<rootDir>/var/',
            '<rootDir>/env/',
            '<rootDir>/docs/',
            '<rootDir>/dist/',
            '<rootDir>/../dist/',
            '<rootDir>/node_modules/',
            '.*/dist/',
        ], preset: 'ts-jest/presets/default-esm', testEnvironment: 'node', moduleFileExtensions: [...jest_config_1.defaults.moduleFileExtensions, 'ts'], testRegex: '.*\\.spec\\.ts$', transform: {
            '^.+\\.(t|j)sx?$': [
                'ts-jest',
                Object.assign({ useESM: true }, tsJestConfig),
            ],
        }, moduleNameMapper: Object.assign({ 'source-map-support/register': 'identity-obj-proxy', '^(\\.{1,2}/.*)\\.js$': '$1.ts' }, (0, ts_jest_1.pathsToModuleNameMapper)((_b = compilerOptions.paths) !== null && _b !== void 0 ? _b : {}, {
            prefix: `${dirname}/`,
            useESM: true,
        })), errorOnDeprecated: true, extensionsToTreatAsEsm: ['.ts'] }, options === null || options === void 0 ? void 0 : options.jestConf);
    if (options.transformEsModules) {
        const esModules = [
            ...(Array.isArray(options.transformEsModules)
                ? options.transformEsModules
                : []),
            'aggregate-error',
            'clean-stack',
            'escape-string-regexp',
            'indent-string',
            'p-map',
        ].join('|');
        config.transformIgnorePatterns = [
            `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx)$`,
        ];
    }
    return config;
};
exports.default = defaultConf;
//# sourceMappingURL=jest-def.config.js.map