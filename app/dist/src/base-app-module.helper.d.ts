import { IYalcBaseAppOptions, IYalcBaseDynamicModule, IYalcBaseStaticModule } from './base-app.interface.js';
import { DynamicModule } from '@nestjs/common';
import { IGlobalOptions } from './app-bootstrap-base.helper.js';
export declare function registerSingletonDynamicModule(isSingleton: boolean, moduleToken: any, module: any): any | true;
export declare function getCachedModule(module: any, isSingleton: boolean): any;
export declare function envFilePathList(dirname?: string): string[];
export declare const buildEnvFilePath: ((envDir?: string, envPath?: string | string[]) => string[]) & import("lodash").MemoizedFunction;
export declare function yalcBaseAppModuleMetadataFactory(module: any, appAlias: string, options?: Omit<IYalcBaseAppOptions, 'module'>): IYalcBaseStaticModule;
export declare class YalcBaseAppModule {
    protected static _forRootStandalone(appAlias: string, options?: IYalcBaseAppOptions): IYalcBaseDynamicModule;
    protected static _forRoot(appAlias: string, options?: IYalcBaseAppOptions): IYalcBaseDynamicModule;
    static assignDynamicProperties(config: any, options?: IYalcBaseAppOptions): any;
}
export declare class YalcGlobalStaticModule {
}
export declare class YalcDefaultAppModule {
    static forRoot(appAlias: string, imports: NonNullable<DynamicModule['imports']>, options?: IGlobalOptions): {
        exports: (string | symbol | Function | import("@nestjs/common").Provider | import("@nestjs/common").Abstract<any> | import("@nestjs/common").ForwardReference<any> | DynamicModule)[];
        providers: import("@nestjs/common").Provider[];
        imports: (import("@nestjs/common").Type<any> | import("@nestjs/common").ForwardReference<any> | DynamicModule | Promise<DynamicModule>)[];
        module: typeof YalcDefaultAppModule;
        global: boolean;
    };
}
