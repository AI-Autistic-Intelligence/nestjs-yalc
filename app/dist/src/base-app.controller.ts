/* istanbul ignore file */
import { IServiceConf } from '@nest-yalc-2/app/conf.type.js';
import { CURAPP_CONF_ALIAS } from '@nest-yalc-2/app/def.const.js';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAppService } from './base-app.service.js';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Application controller
 */
/* istanbul ignore next */
@Controller()
export abstract class BaseAppController {
  /* istanbul ignore next */
  constructor(
    /* istanbul ignore next */
    protected readonly appService: BaseAppService,
    /* istanbul ignore next */
    protected readonly configService: ConfigService,
  ) {}

  /**
   * Expose the getHello method
   */
  /* istanbul ignore next */
  @Get()
  getHello(): string {
    const conf = this.configService.get<IServiceConf>(CURAPP_CONF_ALIAS);
    return this.appService.getHello(conf?.appName || 'no-name');
  }

  /**
   * Only for dev purpose
   */
  /* istanbul ignore next */
  @ApiOperation({
    description:
      'Shutdown the application, only available on development and test environment',
  })
  /* istanbul ignore next */
  @Get('shutdown')
  shutdown() {
    const conf = this.configService.get<IServiceConf>(CURAPP_CONF_ALIAS);
    if (conf && (conf.isDev || conf.isTest)) {
      // eslint-disable-next-line no-console
      console.log(`Bye bye!`);
      process.exit(0);
    }
  }
}
