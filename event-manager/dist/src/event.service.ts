import { Injectable, Inject, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { YalcEventService as NodeEventService, IEventServiceOptions } from '@node-yalc/event-manager/event.service';
import { ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service';

export { IEventServiceOptions };

@Injectable()
export class YalcEventService extends NodeEventService {
  constructor(
    @Optional() @Inject('YALC_LOGGER_SERVICE_TOKEN_FOR_EVENT_SERVICE_DO_NOT_USE') loggerService: ImprovedLoggerService | any,
    @Optional() eventEmitter: EventEmitter2 | any,
    @Optional() options?: IEventServiceOptions
  ) {
    super(loggerService, eventEmitter, options);
  }
}
