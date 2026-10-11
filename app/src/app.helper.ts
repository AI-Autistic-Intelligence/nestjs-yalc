import { ClassType } from '@node-yalc/types/globals.js';
import { DynamicModule, Type } from '@nestjs/common';
import { StandaloneAppBootstrap } from './app-bootstrap-standalone.helper.js';
import { curry } from 'lodash-es';
import {
  BaseAppBootstrap,
  IGlobalOptions,
} from './app-bootstrap-base.helper.js';

export function isDynamicModule(module: unknown): module is DynamicModule {
  return typeof module === 'object' && module !== null && 'module' in module;
}

export const executeFunctionForApp = async <TService, TResult = unknown>(
  app: BaseAppBootstrap<any>,
  serviceType: ClassType<TService>,
  fn: (service: TService) => Promise<TResult>,
  options: { closeApp?: boolean },
): Promise<TResult> => {
  const nestApp = await app.getApp();
  await nestApp.init();

  const service = await nestApp.resolve(serviceType);

  return fn(service).finally(async () => {
    if (options.closeApp) await app.closeApp();
  });
};

/**
 * Curried version of the executeStandaloneFunctionForApp to memoize the app
 * Use it when you need to run the executeStandaloneFunction multiple time
 * @see https://lodash.com/docs/#curry
 * @param module
 * @returns
 */
export const curriedExecuteStandaloneFunction = async <
  TOptions extends IGlobalOptions,
>(
  module: DynamicModule | Type<unknown>,
  options?: TOptions,
): Promise<<TService, TResult = unknown>(serviceType: ClassType<TService>, fn: (service: TService) => Promise<TResult>, executeOptions?: { closeApp?: boolean }) => Promise<TResult>> =>
  curry(executeFunctionForApp)(
    await new StandaloneAppBootstrap(
      isDynamicModule(module) ? module.module.name : module.name,
      module,
      options,
    ).initApp(),
  ) as unknown as <TService, TResult = unknown>(serviceType: ClassType<TService>, fn: (service: TService) => Promise<TResult>, executeOptions?: { closeApp?: boolean }) => Promise<TResult>;

/**
 *
 * @param module
 * @param serviceType
 * @param fn
 * @returns
 */
export const executeStandaloneFunction = async <
  TService,
  TResult = unknown,
  TOptions extends IGlobalOptions = IGlobalOptions,
>(
  module: DynamicModule | Type<unknown>,
  serviceType: ClassType<TService>,
  fn: (service: TService) => Promise<TResult>,
  options?: TOptions,
  executeOptions: { closeApp?: boolean } = {},
) => {
  return (await curriedExecuteStandaloneFunction(module, options))(
    serviceType,
    fn,
    executeOptions,
  );
};
