/* istanbul ignore file */
import * as common from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_LOGGER_SERVICE } from '@nest-yalc-2/app/def.const.js';
import { AppEvents } from './app.events.js';

/**
 * Application service
 */
/* istanbul ignore next */
@common.Injectable()
export class BaseAppService {
  constructor(
    /* istanbul ignore next */
    @common.Inject(APP_LOGGER_SERVICE) protected logger: common.LoggerService,
  ) {}

  /**
   * Hello world function
   */
  getHello(appName: string): string {
    return `Hello World from ${appName}!`;
  }

  @OnEvent(AppEvents.BEFORE_ALL_ROUTES)
  /* istanbul ignore next */
  handleBeforeAllRoutes(context: common.ExecutionContext) {
    const handlerName = context.getHandler().name;
    // exclude special handlers such as _service
    if (!handlerName.startsWith('_') && handlerName.includes('_'))
      this.logger.debug?.(`Running Handler: ${handlerName}`);
  }
}
