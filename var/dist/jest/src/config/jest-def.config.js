import * as path from 'path';
import * as readTsConfig from 'get-tsconfig';
import { pathsToModuleNameMapper } from 'ts-jest';
import { defaults } from 'jest-config';
export const coveragePathIgnorePatterns = [
    '/env/dist/',
    '/node_modules/',
    '/database/seeds/',
    '/database/migrations/',
    '/test/feature/',
];
export const globals = () => {
    return {
        __JEST_DISABLE_DB: true,
    };
};
export const tsJestConfigE2E = (tsConfPath = '', withGqlPlugin = true, overrideTsJestConfig) => {
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
export const tsJestConfig = (tsConfPath = '', overrideTsJestConfig) => {
    const tsConfigFile = readTsConfig.getTsconfig(path.resolve(path.dirname(tsConfPath)), path.basename(tsConfPath));
    if (tsConfigFile?.path && tsConfigFile.path.toLowerCase() !== tsConfPath.toLowerCase().replace(/\\/g, '/')) {
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
export const coverageThreshold = (projects = [], defaultCoverageThreshold = {
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
const defaultConf = (dirname, options = {}, tsJestConfig = {}) => {
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
        moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
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
            'source-map-support/register': 'identity-obj-proxy',
            ...pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
                prefix: __dirname.replace(/\\/g, '/').replace(/\/jest\/src\/config$/, '') + '/',
            }),
        },
        resolver: __dirname.replace(/\\/g, '/').replace(/\/jest\/src\/config$/, '') + '/jest.resolver.cjs',
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
        ].join('|');
        config.transformIgnorePatterns = [
            `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx)$`,
        ];
    }
    return config;
};
export default defaultConf;
//# sourceMappingURL=jest-def.config.js.map