import * as path from 'path';
import os from 'os';
import defaultConf, { coveragePathIgnorePatterns, globals, coverageThreshold, tsJestConfig, tsJestConfigE2E, } from "./jest-def.config.js";
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const maxWorkers = process.env.npm_config_jestworkers ||
    process.env.JEST_WORKERS ||
    os.cpus().length ||
    10;
console.log(`Max workers: ${maxWorkers}`);
export function jestConfGenerator(rootPath, projectList, appProjectsSettings, options) {
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
        ...defaultConf(`${rootPath}/`, options.defaultConfOptions, tsJestConfig(options.tsConfigPath?.(proj) ??
            `${rootPath}/${proj.path}/tsconfig.${proj.type === 'library' ? 'lib' : 'app'}.json`, options.tsJestConfig)),
        globals: globals(),
        displayName: `unit/${projName}`,
        cacheDirectory: `${cacheDirBase}/unit/${projName}`,
        rootDir: `${rootPath}/${proj.sourcePath}/`,
        roots: [`${rootPath}/${proj.path}`],
        maxWorkers,
        setupFiles: [
            `${__dirname}/jest.setup.js`,
            ...(options.extraSetupFiles ?? []),
        ],
        coverageThreshold: coverageThreshold(projects, options.defaultCoverageThreshold),
        coveragePathIgnorePatterns,
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
    const argv = yargs(hideBin(process.argv))
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
        console.debug('Subproject path:', subProjectPathList ?? ['']);
    }
    console.debug('selectedProjects', selectedProjects.map((v) => v.displayName));
    const coverageFolder = selectedProjects.length > 1 ? '' : selectedProj;
    config = {
        coverageReporters: ['json-summary', 'json', 'lcov', 'text', 'clover'],
        rootDir: `${rootPath}`,
        coverageThreshold: coverageThreshold(selectedProjects, options.defaultCoverageThreshold),
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
export const createE2EConfig = (options) => {
    let conf = {
        ...defaultConf(`${options.rootDirname}`, options.defaultConfOptions, tsJestConfigE2E(path.resolve(`${options.e2eDirname}/tsconfig.json`), options.withGqlPlugins ?? false, options.tsJestConfig)),
        testRegex: '.*\\.e2e-spec\\.ts$',
        setupFilesAfterEnv: [`${options.e2eDirname}/jest.e2e-setup.ts`],
        roots: [`${options.e2eDirname}`],
        bail: 1,
    };
    if (options.alias) {
        conf.displayName = `e2e/${options.alias}`;
    }
    if (options.confOverride) {
        conf = {
            ...conf,
            ...options.confOverride,
        };
    }
    return conf;
};
//# sourceMappingURL=jest-conf.generator.js.map