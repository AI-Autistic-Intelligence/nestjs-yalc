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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createE2EConfig = void 0;
exports.jestConfGenerator = jestConfGenerator;
const path = __importStar(require("path"));
const jest_def_config_1 = __importStar(require("./jest-def.config"));
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const maxWorkers = process.env.npm_config_jestworkers ||
    process.env.JEST_WORKERS ||
    '50%';
console.log(`Max workers: ${maxWorkers}`);
function jestConfGenerator(rootPath, projectList, appProjectsSettings, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const createProjectSets = (projects) => {
        const _projectSets = {};
        for (const app in appProjectsSettings) {
            _projectSets[app] = projects.filter((p) => appProjectsSettings[app].deps.some((v) => p.displayName.startsWith(`unit/${v.name}`)));
        }
        return Object.assign(Object.assign({}, _projectSets), { all: projects });
    };
    const cacheDirBase = '/tmp/jest_rs/';
    let projects = [];
    const confFactory = (projName, proj, projects) => {
        var _a, _b, _c;
        return (Object.assign(Object.assign({}, (0, jest_def_config_1.default)(`${rootPath}/`, options.defaultConfOptions, (0, jest_def_config_1.tsJestConfig)((_b = (_a = options.tsConfigPath) === null || _a === void 0 ? void 0 : _a.call(options, proj)) !== null && _b !== void 0 ? _b : `${rootPath}/${proj.path}/tsconfig.json`, options.tsJestConfig))), { globals: (0, jest_def_config_1.globals)(), displayName: `unit/${projName}`, cacheDirectory: `${cacheDirBase}/unit/${projName}`, rootDir: `${rootPath}/${proj.sourcePath}/`, roots: [
                `${rootPath}/${proj.path}`,
                `${rootPath}/__mocks__`,
            ], setupFiles: [
                `${__dirname}/jest.setup.js`,
                ...((_c = options.extraSetupFiles) !== null && _c !== void 0 ? _c : []),
            ], coveragePathIgnorePatterns: jest_def_config_1.coveragePathIgnorePatterns }));
    };
    for (const projName of Object.keys(projectList)) {
        const proj = projectList[projName];
        if (!((_a = options.skipProjects) === null || _a === void 0 ? void 0 : _a.includes(projName)) && !((_b = options.skipProjects) === null || _b === void 0 ? void 0 : _b.includes(proj.path))) {
            let conf = confFactory(projName, proj);
            if ((_c = appProjectsSettings[projName]) === null || _c === void 0 ? void 0 : _c.confOverride) {
                conf = Object.assign(Object.assign({}, conf), appProjectsSettings[projName].confOverride);
            }
            if (options.confOverrides) {
                const overrideKey = Object.keys(options.confOverrides).find((v) => projName === v && v);
                const overrideConf = overrideKey && options.confOverrides[overrideKey]
                    ? options.confOverrides[overrideKey]
                    : {};
                conf = Object.assign(Object.assign({}, conf), overrideConf);
            }
            projects.push(conf);
        }
    }
    const projectSets = createProjectSets(projects);
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
        .fail(() => {
    }).argv;
    const selectedProj = argv.proj || ((_d = process.env.npm_config_projects) === null || _d === void 0 ? void 0 : _d.split(',')) || 'all';
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
    const possiblePath = (_h = (_g = (_e = (paths.length > 0 ? paths : null)) !== null && _e !== void 0 ? _e : (_f = argv.testPathPattern) === null || _f === void 0 ? void 0 : _f[0]) !== null && _g !== void 0 ? _g : argv.coverage) !== null && _h !== void 0 ? _h : '';
    console.debug('possiblePaths', possiblePath);
    let config = {};
    function getSubprojectPath(testPath) {
        let subProjectPath = testPath.startsWith('.')
            ? testPath.slice(1)
            : testPath;
        subProjectPath = subProjectPath.startsWith(rootPath)
            ? subProjectPath.slice(rootPath.length)
            : subProjectPath;
        subProjectPath = subProjectPath.startsWith('/')
            ? subProjectPath
            : `/${subProjectPath}`;
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
        console.debug('testPaths', testPaths);
        const subProjectPathList = testPaths.map((v) => getSubprojectPath(v));
        selectedProjects = projects.filter((v) => subProjectPathList.some((subProjectPath) => v.rootDir.startsWith(`${rootPath}${subProjectPath}`)));
        if (Array.isArray(selectedProj)) {
            selectedProjects.push(...projects.filter((p) => selectedProj.some((projName) => p.displayName.startsWith(`unit/${projName}`))));
        }
        console.debug('Subproject path:', subProjectPathList !== null && subProjectPathList !== void 0 ? subProjectPathList : ['']);
    }
    console.debug('selectedProjects', selectedProjects.map((v) => v.displayName));
    const coverageFolder = selectedProjects.length > 1 ? '' : selectedProj;
    config = {
        maxWorkers,
        coverageReporters: ['json-summary', 'json', 'lcov', 'text', 'clover'],
        rootDir: `${rootPath}`,
        coverageThreshold: (0, jest_def_config_1.coverageThreshold)(selectedProjects, options.defaultCoverageThreshold),
        coverageDirectory: path.join(rootPath, (_k = (_j = options.coverageOutputPath) === null || _j === void 0 ? void 0 : _j.call(options, coverageFolder)) !== null && _k !== void 0 ? _k : `var/coverage/${coverageFolder}`),
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
    var _a;
    let conf = Object.assign(Object.assign({}, (0, jest_def_config_1.default)(`${options.rootDirname}`, options.defaultConfOptions, (0, jest_def_config_1.tsJestConfigE2E)(path.resolve(`${options.e2eDirname}/tsconfig.json`), (_a = options.withGqlPlugins) !== null && _a !== void 0 ? _a : false, options.tsJestConfig))), { testRegex: '.*\\.e2e-spec\\.ts$', setupFilesAfterEnv: [`${options.e2eDirname}/jest.e2e-setup.ts`], roots: [`${options.e2eDirname}`], bail: 1 });
    if (options.alias) {
        conf.displayName = `e2e/${options.alias}`;
    }
    if (options.confOverride) {
        conf = Object.assign(Object.assign({}, conf), options.confOverride);
    }
    return conf;
};
exports.createE2EConfig = createE2EConfig;
//# sourceMappingURL=jest-conf.generator.js.map