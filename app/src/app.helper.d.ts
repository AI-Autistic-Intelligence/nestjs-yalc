import { ClassType } from '@node-yalc/types/globals.js';
import { DynamicModule, Type } from '@nestjs/common';
import { BaseAppBootstrap, IGlobalOptions } from './app-bootstrap-base.helper.js';
export declare function isDynamicModule(module: unknown): module is DynamicModule;
export declare const executeFunctionForApp: <TService, TResult = unknown>(app: BaseAppBootstrap<any>, serviceType: ClassType<TService>, fn: (service: TService) => Promise<TResult>, options: {
    closeApp?: boolean;
}) => Promise<TResult>;
/**
 * Curried version of the executeStandaloneFunctionForApp to memoize the app
 * Use it when you need to run the executeStandaloneFunction multiple time
 * @see https://lodash.com/docs/#curry
 * @param module
 * @returns
 */
export declare const curriedExecuteStandaloneFunction: <TOptions extends IGlobalOptions>(module: DynamicModule | Type<unknown>, options?: TOptions) => Promise<(<TService, TResult = unknown>(serviceType: ClassType<TService>, fn: (service: TService) => Promise<TResult>, executeOptions?: {
    closeApp?: boolean;
}) => Promise<TResult>)>;
/**
 *
 * @param module
 * @param serviceType
 * @param fn
 * @returns
 */
export declare const executeStandaloneFunction: <TService, TResult = unknown, TOptions extends IGlobalOptions = IGlobalOptions>(module: DynamicModule | Type<unknown>, serviceType: ClassType<TService>, fn: (service: TService) => Promise<TResult>, options?: TOptions, executeOptions?: {
    closeApp?: boolean;
}) => Promise<TResult>;
