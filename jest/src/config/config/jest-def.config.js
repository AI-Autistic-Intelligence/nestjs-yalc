"use strict";
/* istanbul ignore file */
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
    const tsConfigFile = readTsConfig.getTsconfig(path.resolve(tsConfPath));
    const { tsconfig, ...restTsJest } = overrideTsJestConfig ?? {};
    const conf = {
        diagnostics: false,
        tsconfig: {
            ...(tsConfigFile?.config.compilerOptions ?? {}),
            ...(tsconfig ?? {}),
        },
        ...restTsJest,
    };
    if (withGqlPlugin) {
        conf.astTransformers = {
            before: [path.join(__dirname, 'gql-plugin.js')],
        };
    }
    return conf;
};
exports.tsJestConfigE2E = tsJestConfigE2E;
const tsJestConfig = (tsConfPath = '', overrideTsJestConfig) => {
    const tsConfigFile = readTsConfig.getTsconfig(path.resolve(path.dirname(tsConfPath)), path.basename(tsConfPath));
    if (tsConfigFile?.path !== tsConfPath) {
        throw new Error(`Cannot find ${tsConfPath}`);
    }
    const { tsconfig, ...restTsJest } = overrideTsJestConfig ?? {};
    const config = {
        tsconfig: {
            ...(tsConfigFile?.config.compilerOptions ?? {}),
            ...(tsconfig ?? {}),
        },
        diagnostics: false,
        ...restTsJest,
    };
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
        global: {
            ...defaultCoverageThreshold,
        },
    };
    projects.map((project) => {
        // /**
        //  * @todo  should be removed and be set to 100% asap
        //  */
        // switch (project.name) {
        //   case 'unit/common/crud-gen':
        //     branches = 92.27;
        //     functions = 98.92;
        //     lines = 98.75;
        //     statements = 98.5;
        //     break;
        //   default:
        //     branches = 100;
        //     break;
        // }
        coverage[project.rootDir] = {
            ...defaultCoverageThreshold,
        };
        if (project?.coverageThreshold) {
            coverage[project.rootDir] = {
                ...coverage[project.rootDir],
                ...project?.coverageThreshold,
            };
        }
    });
    return coverage;
};
exports.coverageThreshold = coverageThreshold;
/**
 * for both unit and e2e
 * @param dirname
 * @returns
 */
const defaultConf = (dirname, options = {}, tsJestConfig = {}) => {
    const tsConfigFile = readTsConfig.getTsconfig(path.join(dirname, 'tsconfig.json'));
    const compilerOptions = tsConfigFile?.config.compilerOptions ?? {};
    // We need this to make sure that some esm modules are transformed
    // ref: https://github.com/nrwl/nx/issues/812
    // ref: https://github.com/jaredpalmer/tsdx/issues/187#issuecomment-825536863
    const config = {
        rootDir: dirname,
        modulePathIgnorePatterns: [
            '<rootDir>/var/',
            '<rootDir>/env/',
            '<rootDir>/docs/',
            '<rootDir>/dist/',
            '<rootDir>/../dist/',
            '<rootDir>/node_modules/',
            '.*/dist/',
        ],
        preset: 'ts-jest/presets/default-esm',
        testEnvironment: 'node',
        moduleFileExtensions: [...jest_config_1.defaults.moduleFileExtensions, 'ts'], // add typescript to the default options
        testRegex: '.*\\.spec\\.ts$',
        transform: {
            '^.+\\.(t|j)sx?$': [
                'ts-jest',
                {
                    useESM: true,
                    ...tsJestConfig,
                },
            ],
        },
        moduleNameMapper: {
            // this fixes the issue with wrong line numbers in stack traces,
            /** @see https://github.com/kulshekhar/ts-jest/issues/727 */
            'source-map-support/register': 'identity-obj-proxy',
            '^(@nest-yalc-2/.*|@node-yalc/.*|\\.{1,2}/.*)\\.js$': [
                '$1.ts',
                '$1/index.ts',
                '$1.js',
                '$1',
            ],
            ...(0, ts_jest_1.pathsToModuleNameMapper)(compilerOptions.paths ?? {}, {
                prefix: `${dirname}/`,
                useESM: true,
            }),
        },
        errorOnDeprecated: true,
        extensionsToTreatAsEsm: ['.ts'],
        // injectGlobals: false,
        ...options?.jestConf,
    };
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
            `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|ts|tsx)$`,
        ];
    }
    return config;
};
exports.default = defaultConf;
