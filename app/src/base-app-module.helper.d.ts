import { IYalcBaseAppOptions, IYalcBaseDynamicModule, IYalcBaseStaticModule } from './base-app.interface.js';
import { DynamicModule } from '@nestjs/common';
import { IGlobalOptions } from './app-bootstrap-base.helper.js';
export declare function registerSingletonDynamicModule<TModule>(isSingleton: boolean, moduleToken: unknown, module: TModule): TModule | boolean;
export declare function getCachedModule<TModule = unknown>(module: unknown, isSingleton?: boolean): TModule | null;
export declare function envFilePathList(dirname?: string): string[];
/**
 * For some strange reason, the memoize doesn't work well with exporting the const at the same time
 * and re-use it in the same file
 */
export declare function buildEnvFilePath(envDir?: string, envPath?: string | string[]): string[];
/**
 * Used for applications with controller/resolver support
 * you should override it
 */
export declare function yalcBaseAppModuleMetadataFactory(module: unknown, appAlias: string, options?: Omit<IYalcBaseAppOptions, 'module'>): IYalcBaseStaticModule;
/**
 * Util class that can be extended to create a NestJS application
 */
export declare class YalcBaseAppModule {
    /**
     * Used by the CLI and other non-network processes
     * you should override it
     *
     * NOTE: if you need singleton dynamic modules, you should use the `isSingleton` property
     * but in most of the cases is better to use the static module instead
     */
    protected static _forRootStandalone(appAlias: string, options?: IYalcBaseAppOptions): IYalcBaseDynamicModule;
    /**
     * Used for applications with controller/resolver support
     * you should override it
     *
     * NOTE: if you need singleton dynamic modules, you should use the `isSingleton` property
     * but in most of the cases is better to use the static module instead
     */
    protected static _forRoot(appAlias: string, options?: IYalcBaseAppOptions): IYalcBaseDynamicModule;
    static assignDynamicProperties(config: any, options?: IYalcBaseAppOptions): any;
}
export declare class YalcGlobalStaticModule {
}
/**
 * This class is used to create true singleton providers
 */
export declare class YalcDefaultAppModule {
    static forRoot(appAlias: string, imports: NonNullable<DynamicModule['imports']>, options?: IGlobalOptions): {
        exports: (string | symbol | Function | import("@nestjs/common").Provider | import("@nestjs/common").Abstract<any> | import("@nestjs/common").ForwardReference<any> | DynamicModule)[];
        providers: import("@nestjs/common").Provider[];
        imports: (import("@nestjs/common").Type<any> | import("@nestjs/common").ForwardReference<any> | DynamicModule | Promise<DynamicModule>)[];
        module: typeof YalcDefaultAppModule;
        global: boolean;
    };
}
