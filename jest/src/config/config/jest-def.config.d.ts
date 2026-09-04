import type { JestConfigWithTsJest } from 'ts-jest';
export declare const coveragePathIgnorePatterns: string[];
export declare const globals: () => {
    __JEST_DISABLE_DB: boolean;
};
export declare const tsJestConfigE2E: (tsConfPath?: string, withGqlPlugin?: boolean, overrideTsJestConfig?: any) => any;
export declare const tsJestConfig: (tsConfPath?: string, overrideTsJestConfig?: any) => any;
export declare const coverageThreshold: (projects?: any[], defaultCoverageThreshold?: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
}) => Record<string, any>;
export interface IDefaultConfOptions {
    transformEsModules?: string[] | boolean;
    tsJestConf?: any;
    jestConf?: any;
}
declare const defaultConf: (dirname: string, options?: IDefaultConfOptions, tsJestConfig?: any) => JestConfigWithTsJest;
export default defaultConf;
