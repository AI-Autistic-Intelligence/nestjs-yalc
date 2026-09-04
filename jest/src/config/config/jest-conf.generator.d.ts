import type { JestConfigWithTsJest } from 'ts-jest';
import { IDefaultConfOptions } from './jest-def.config.ts';
interface IAppDep {
    name: string;
    path: string;
}
export interface IAppProjSetting {
    confOverride?: any;
    deps: IAppDep[];
}
export interface IProjectInfo {
    path: string;
    sourcePath: string;
    type: 'library' | 'application' | string;
}
export interface IOptions {
    skipProjects?: string[];
    confOverrides?: {
        [key: string]: any;
    };
    defaultCoverageThreshold?: {
        branches: number;
        functions: number;
        lines: number;
        statements: number;
    };
    tsConfigPath?: {
        (proj: IProjectInfo): string;
    };
    coverageOutputPath?: {
        (subProjectPath: string): string;
    };
    defaultConfOptions?: IDefaultConfOptions;
    tsJestConfig?: any;
    extraSetupFiles?: string[];
    setupFilesAfterEnv?: string[];
}
export declare function jestConfGenerator(rootPath: string, projectList: {
    [key: string]: IProjectInfo;
}, appProjectsSettings: {
    [key: string]: IAppProjSetting;
}, options: IOptions): JestConfigWithTsJest;
export interface E2EOptions {
    alias?: string;
    e2eDirname: string;
    rootDirname: string;
    defaultConfOptions?: IDefaultConfOptions;
    confOverride?: JestConfigWithTsJest;
    withGqlPlugins?: boolean;
    tsJestConfig?: any;
}
export declare const createE2EConfig: (options: E2EOptions) => JestConfigWithTsJest;
export {};
