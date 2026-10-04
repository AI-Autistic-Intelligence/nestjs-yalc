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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createE2EConfig = void 0;
exports.jestConfGenerator = jestConfGenerator;
const path = __importStar(require("path"));
const os_1 = __importDefault(require("os"));
const jest_def_config_js_1 = __importStar(require("./jest-def.config.js"));
// import { options as jestOptionObject } from 'jest-cli/build/cli/args';
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
// considering our heap consumption (~300-700mb), 5 workers will consume around 3GB of ram
// if you want to increase/decrease this value, you can set the npm_config_jestworkers:
// * npm < 9  -> with the `npm config set` command (more info: https://docs.npmjs.com/cli/v7/commands/npm-config)
// * npm >= 9 -> with: export JEST_WORKERS=5
const maxWorkers = process.env.npm_config_jestworkers ||
    process.env.JEST_WORKERS ||
    os_1.default.cpus().length ||
    10;
// eslint-disable-next-line no-console
console.log(`Max workers: ${maxWorkers}`);
function jestConfGenerator(rootPath, projectList, appProjectsSettings, options) {
    const createProjectSets = (projects) => {
        const _projectSets = {};
        for (const app in appProjectsSettings) {
            _projectSets[app] = projects.filter((p) => appProjectsSettings[app].deps.some((v) => p.displayName.startsWith(`unit/${v.name}`)));
        }
        return {
            ..._projectSets,
            all: projects,
        };
    };
    const cacheDirBase = '/tmp/jest_rs/';
    let projects = [];
    const confFactory = (projName, proj, projects) => ({
        ...(0, jest_def_config_js_1.default)(`${rootPath}/`, options.defaultConfOptions, (0, jest_def_config_js_1.tsJestConfig)(options.tsConfigPath?.(proj) ??
            `${rootPath}/${proj.path}/tsconfig.${proj.type === 'library' ? 'lib' : 'app'}.json`, options.tsJestConfig)),
        globals: (0, jest_def_config_js_1.globals)(),
        // name: `unit/${projName}`,
        displayName: `unit/${projName}`,
        cacheDirectory: `${cacheDirBase}/unit/${projName}`,
        rootDir: `${rootPath}/${proj.sourcePath}/`,
        roots: [`${rootPath}/${proj.path}`],
        maxWorkers,
        setupFiles: [
            `${__dirname}/jest.setup.js`,
            ...(options.extraSetupFiles ?? []),
        ],
        coverageThreshold: (0, jest_def_config_js_1.coverageThreshold)(projects, options.defaultCoverageThreshold),
        coveragePathIgnorePatterns: jest_def_config_js_1.coveragePathIgnorePatterns,
    });
    for (const projName of Object.keys(projectList)) {
        const proj = projectList[projName];
        if (!options.skipProjects?.includes(proj.path)) {
            let conf = confFactory(projName, proj);
            if (appProjectsSettings[projName]?.confOverride) {
                conf = { ...conf, ...appProjectsSettings[projName].confOverride };
            }
            if (options.confOverrides) {
                const overrideKey = Object.keys(options.confOverrides).find((v) => projName === v && v);
                const overrideConf = overrideKey && options.confOverrides[overrideKey]
                    ? options.confOverrides[overrideKey]
                    : {};
                conf = { ...conf, ...overrideConf };
            }
            projects.push(conf);
        }
    }
    const projectSets = createProjectSets(projects);
    // use argv to catch the path argument in any position
    const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .command('$0 [paths]', 'test paths', (yargs) => {
        return yargs
            .positional('path', {
            describe: 'test path',
            type: 'string',
            coerce: (arg) => {
                return arg.split(',');
            },
        })
            .option('proj', {
            describe: 'comma-separated project names',
            type: 'string',
            coerce: (arg) => {
                return arg.split(',');
            },
        })
            .option('paths', {
            describe: 'comma-separated test paths',
            type: 'string',
            coerce: (arg) => {
                return arg.split(',');
            },
        });
    })
        .showHelpOnFail(false)
        // .options(jestOptionObject)
        .fail(() => {
        // nothing to do
    }).argv;
    const selectedProj = argv.proj || process.env.npm_config_projects?.split(',') || 'all';
    projects = Array.isArray(selectedProj)
        ? Object.values(projectSets)
            .flat()
            .filter((value) => {
            return selectedProj.some((projName) => {
                return value.displayName === `unit/${projName}`;
            });
        })
        : projectSets[selectedProj];
    const paths = [];
    if (argv.path) {
        paths.push(argv.path);
    }
    if (argv.paths) {
        paths.push(...argv.paths);
    }
    const possiblePath = (paths.length > 0 ? paths : null) ??
        argv.testPathPattern?.[0] ??
        argv.coverage ??
        '';
    // eslint-disable-next-line no-console
    console.debug('possiblePaths', possiblePath);
    let config = {};
    function getSubprojectPath(testPath) {
        // "." must be converted to "/"
        let subProjectPath = testPath.startsWith('.')
            ? testPath.slice(1)
            : testPath;
        subProjectPath = subProjectPath.startsWith(rootPath)
            ? subProjectPath.slice(rootPath.length)
            : subProjectPath;
        // we always need "/" at the beginning of the string
        subProjectPath = subProjectPath.startsWith('/')
            ? subProjectPath
            : `/${subProjectPath}`;
        // get the project which prefix is closest to testPath
        // to apply the correct path for coverage etc.
        for (const proj of Object.values(projectList)) {
            const root = proj.path;
            if (testPath.startsWith(root) && subProjectPath.length < root.length) {
                subProjectPath = `/${root}`;
            }
        }
        const lastIndexOfSrc = subProjectPath.lastIndexOf(`/src/`);
        if (lastIndexOfSrc >= 0)
            subProjectPath = subProjectPath.substring(0, lastIndexOfSrc);
        return subProjectPath;
    }
    let selectedProjects = [];
    if (possiblePath === true) {
        if (Array.isArray(selectedProj)) {
            selectedProjects.push(...projects.filter((p) => selectedProj.some((projName) => p.displayName.startsWith(`unit/${projName}`))));
        }
        else {
            selectedProjects = projects;
        }
    }
    else {
        const testPaths = Array.isArray(possiblePath)
            ? possiblePath
            : [possiblePath];
        // eslint-disable-next-line no-console
        console.debug('testPaths', testPaths);
        const subProjectPathList = testPaths.map((v) => getSubprojectPath(v));
        selectedProjects = projects.filter((v) => subProjectPathList.some((subProjectPath) => v.rootDir.startsWith(`${rootPath}${subProjectPath}`)));
        if (Array.isArray(selectedProj)) {
            selectedProjects.push(...projects.filter((p) => selectedProj.some((projName) => p.displayName.startsWith(`unit/${projName}`))));
        }
        // eslint-disable-next-line no-console
        console.debug('Subproject path:', subProjectPathList ?? ['']);
    }
    // eslint-disable-next-line no-console
    console.debug('selectedProjects', selectedProjects.map((v) => v.displayName));
    // we can still support specific coverage output path when only one project is selected
    const coverageFolder = selectedProjects.length > 1 ? '' : selectedProj;
    config = {
        coverageReporters: ['json-summary', 'json', 'lcov', 'text', 'clover'],
        rootDir: `${rootPath}`,
        coverageThreshold: (0, jest_def_config_js_1.coverageThreshold)(selectedProjects, options.defaultCoverageThreshold),
        coverageDirectory: path.join(rootPath, options.coverageOutputPath?.(coverageFolder) ??
            `var/coverage/${coverageFolder}`),
        collectCoverageFrom: [
            `**/*.{js,ts}`,
            '!**/node_modules/**',
            '!**/.warmup/**',
        ],
    };
    config.projects = selectedProjects;
    return config;
}
const createE2EConfig = (options) => {
    let conf = {
        ...(0, jest_def_config_js_1.default)(`${options.rootDirname}`, options.defaultConfOptions, (0, jest_def_config_js_1.tsJestConfigE2E)(path.resolve(`${options.e2eDirname}/tsconfig.json`), options.withGqlPlugins ?? false, options.tsJestConfig)),
        testRegex: '.*\\.e2e-spec\\.ts$',
        setupFilesAfterEnv: [`${options.e2eDirname}/jest.e2e-setup.ts`],
        roots: [`${options.e2eDirname}`],
        bail: 1,
    };
    if (options.alias) {
        conf.displayName = `e2e/${options.alias}`;
        // conf.name = `e2e/${options.alias}`;
    }
    if (options.confOverride) {
        conf = {
            ...conf,
            ...options.confOverride,
        };
    }
    return conf;
};
exports.createE2EConfig = createE2EConfig;
