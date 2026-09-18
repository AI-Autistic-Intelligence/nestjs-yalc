"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverageThreshold = exports.tsJestConfig = exports.tsJestConfigE2E = exports.globals = exports.coveragePathIgnorePatterns = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const readTsConfig = tslib_1.__importStar(require("get-tsconfig"));
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
    if (tsConfigFile?.path && path.resolve(tsConfigFile.path) !== path.resolve(tsConfPath)) {
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
const defaultConf = (dirname, options = {}, _tsJestConfig = {}) => {
    const tsConfigFile = readTsConfig.getTsconfig(path.join(dirname, 'tsconfig.json'));
    const compilerOptions = tsConfigFile?.config.compilerOptions ?? {};
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
        moduleFileExtensions: [...jest_config_1.defaults.moduleFileExtensions, 'ts'],
        testRegex: '.*\\.spec\\.ts$',
        transform: {
            '^.+\\.(t|j)sx?$': [
                '@swc/jest',
                {
                    jsc: {
                        target: 'es2022',
                        parser: {
                            syntax: 'typescript',
                            decorators: true,
                            dynamicImport: true,
                        },
                        transform: {
                            legacyDecorator: true,
                            decoratorMetadata: true,
                        },
                        keepClassNames: true,
                    },
                    module: {
                        type: 'es6',
                    },
                },
            ],
        },
        moduleNameMapper: {
            'source-map-support/register': 'identity-obj-proxy',
            '^(\\.{1,2}/.*)\\.js$': '$1.ts',
            ...(0, ts_jest_1.pathsToModuleNameMapper)(compilerOptions.paths ?? {}, {
                prefix: `${dirname}/`,
                useESM: true,
            }),
        },
        errorOnDeprecated: true,
        extensionsToTreatAsEsm: ['.ts'],
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
            'lodash-es',
        ].join('|');
        config.transformIgnorePatterns = [
            `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx)$`,
        ];
    }
    return config;
};
exports.default = defaultConf;
//# sourceMappingURL=jest-def.config.js.map