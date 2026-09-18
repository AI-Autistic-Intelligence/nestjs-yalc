import { EventEmitter2 } from '@nestjs/event-emitter';
import { YalcEventService as NodeEventService, IEventServiceOptions } from '@node-yalc/event-manager/event.service';
import { ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service';
export { IEventServiceOptions };
export declare class YalcEventService extends NodeEventService {
    constructor(loggerService: ImprovedLoggerService | any, eventEmitter: EventEmitter2 | any, options?: IEventServiceOptions);
}
