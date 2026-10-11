import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';
import {
  IImprovedLoggerOptions,
  ILoggerPluginMethods,
  ImprovedLoggerService,
  LogMethodOptions,
  beforeLogging,
} from '@node-yalc/logger/logger-abstract.service.js';
import { maskDataInObject } from '@node-yalc/logger/logger.helper.js';
import { WithPluginSystem } from '@node-yalc/utils/plugin.helper.js';

export class ImprovedNestLogger
  extends WithPluginSystem<ILoggerPluginMethods>(ConsoleLogger)
  implements ImprovedLoggerService
{
  public readonly isImprovedLoggerService = true;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    protected _options: IImprovedLoggerOptions = {},
  ) {
    super(context, options);
  }

  private getOptions(options: LogMethodOptions | unknown): LogMethodOptions {
    return typeof options === 'string' ? { message: options } : (options as LogMethodOptions);
  }

  private composeMessage(message: unknown, options: LogMethodOptions) {
    const data = {
      ...maskDataInObject(options.data, options.masks, options.stack),
      config: options.config,
    };

        return (
      (typeof message === 'string'
        ? message
        : JSON.stringify(message, null, 2)) +
      (data ? `\n${JSON.stringify(data, null, 2)}` : '')
    );
  }

  log(message: unknown): void;
  log(message: unknown, options: LogMethodOptions): void;
  log(message: unknown, ...optionalParams: unknown[]): void;
  log(
    message: unknown,
    options: LogMethodOptions = {},
    ...rest: unknown[]
  ): void {
    const _options = this.getOptions(options);

    this.beforeLogging(message, _options);

    super.log(
      this.composeMessage(message, _options),
      _options.context ?? this.context,
      ...rest,
    );
  }

  error(message: unknown, stack?: string | undefined): void;
  error(
    message: unknown,
    stack: string | undefined,
    options: LogMethodOptions,
  ): void;
  error(message: unknown, ...optionalParams: unknown[]): void;
  error(
    message: unknown,
    stack?: unknown,
    options: LogMethodOptions = {},
    ...rest: unknown[]
  ): void {
    const _options = this.getOptions(options);
    this.beforeLogging(message, _options);

    super.error(
      this.composeMessage(message, _options),
      stack,
      _options.context ?? this.context,
      ...rest,
    );
  }

  debug(message: unknown): void;
  debug(message: unknown, options: LogMethodOptions): void;
  debug(message: unknown, ...optionalParams: unknown[]): void;
  debug(
    message: unknown,
    options: LogMethodOptions = {},
    ...rest: unknown[]
  ): void {
    const _options = this.getOptions(options);
    this.beforeLogging(message, _options);

    super.debug(
      this.composeMessage(message, _options),
      _options.context ?? this.context,
      ...rest,
    );
  }

  verbose(message: unknown): void;
  verbose(message: unknown, options: LogMethodOptions): void;
  verbose(message: unknown, ...optionalParams: unknown[]): void;
  verbose(
    message: unknown,
    options: LogMethodOptions = {},
    ...rest: unknown[]
  ): void {
    const _options = this.getOptions(options);
    this.beforeLogging(message, _options);

    super.verbose(
      this.composeMessage(message, _options),
      _options.context ?? this.context,
      ...rest,
    );
  }

  warn(message: unknown): void;
  warn(message: unknown, options: LogMethodOptions): void;
  warn(message: unknown, ...optionalParams: unknown[]): void;
  warn(
    message: unknown,
    options: LogMethodOptions = {},
    ...rest: unknown[]
  ): void {
    const _options = this.getOptions(options);
    this.beforeLogging(message, _options);

    super.warn(
      this.composeMessage(message, _options),
      _options.context ?? this.context,
      ...rest,
    );
  }

  beforeLogging(message: unknown, options: LogMethodOptions) {
    this.options.event = this.options.event ?? {};
    this.invokePlugins(
      'onBeforeLogging',
      message,
      options,
      this._options.clsService,
    );
    void beforeLogging(message, options);
  }
}
