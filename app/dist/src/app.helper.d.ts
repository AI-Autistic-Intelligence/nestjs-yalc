import { ClassType } from '@node-yalc/types/globals';
import { DynamicModule, Type } from '@nestjs/common';
import { BaseAppBootstrap, IGlobalOptions } from './app-bootstrap-base.helper.js';
export declare function isDynamicModule(module: any): module is DynamicModule;
export declare const executeFunctionForApp: (app: BaseAppBootstrap<any>, serviceType: any, fn: {
    (service: any): Promise<any>;
}, options: {
    closeApp?: boolean;
}) => Promise<void>;
export declare const curriedExecuteStandaloneFunction: <TOptions extends IGlobalOptions>(module: any, options?: TOptions) => Promise<import("lodash").CurriedFunction3<any, (service: any) => Promise<any>, {
    closeApp?: boolean;
}, Promise<void>>>;
export declare const executeStandaloneFunction: <TService, TOptions extends IGlobalOptions>(module: DynamicModule | Type<any>, serviceType: ClassType<TService>, fn: {
    (service: TService): Promise<any>;
}, options?: TOptions, executeOptions?: {
    closeApp?: boolean;
}) => Promise<void>;
