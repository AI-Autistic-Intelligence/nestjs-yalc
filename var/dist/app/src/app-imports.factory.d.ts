import { ModuleMetadata } from '@nestjs/common';
import { BuildSchemaOptions } from '@nestjs/graphql';
import { ClassType } from '@node-yalc/types/globals';
import { ApolloFederationDriverConfig } from '@nestjs/apollo';
type ApolloServerPlugin = NonNullable<ApolloFederationDriverConfig['plugins']>[number];
export interface IAppImportsFactory {
    envPath?: string | string[];
    setupEvents?: boolean;
    setupJwt?: boolean;
    keepDBConnectionAlive?: boolean;
    operationPrefix?: string;
    buildSchemaOptions?: BuildSchemaOptions;
    gqlPlugin?: ClassType<ApolloServerPlugin>[];
    disablePlayground?: boolean;
}
type PickModuleMetadata = 'imports' | 'providers' | 'exports';
export type AppModuleMetadata = Required<Pick<ModuleMetadata, PickModuleMetadata>>;
export declare function AppDependencyFactory(_context: string, confs: any[], dbConnNames: string[], gqlModules: any[], options?: IAppImportsFactory): AppModuleMetadata;
export {};
