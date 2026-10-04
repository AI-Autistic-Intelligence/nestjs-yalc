import { EventEmitter2 } from '@nestjs/event-emitter';
import { YalcEventService as NodeEventService } from '@node-yalc/event-manager/event.service.js';
import type { IEventServiceOptions } from '@node-yalc/event-manager/event.service.js';
import { ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service.js';
export type { IEventServiceOptions };
export declare class YalcEventService extends NodeEventService {
    constructor(loggerService: ImprovedLoggerService | any, eventEmitter: EventEmitter2 | any, options?: IEventServiceOptions);
}
