import { Injectable, Inject, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { YalcEventService as NodeEventService } from '@node-yalc/event-manager/event.service.js';
import type { IEventServiceOptions } from '@node-yalc/event-manager/event.service.js';
import { ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service.js';

export type { IEventServiceOptions };

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
