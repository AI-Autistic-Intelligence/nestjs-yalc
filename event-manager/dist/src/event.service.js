import { __decorate, __metadata, __param } from "tslib";
import { Injectable, Inject, Optional } from '@nestjs/common';
import { YalcEventService as NodeEventService } from '@node-yalc/event-manager/event.service.js';
let YalcEventService = class YalcEventService extends NodeEventService {
    constructor(loggerService, eventEmitter, options) {
        super(loggerService, eventEmitter, options);
    }
};
YalcEventService = __decorate([
    Injectable(),
    __param(0, Optional()),
    __param(0, Inject('YALC_LOGGER_SERVICE_TOKEN_FOR_EVENT_SERVICE_DO_NOT_USE')),
    __param(1, Optional()),
    __param(2, Optional()),
    __metadata("design:paramtypes", [Object, Object, Object])
], YalcEventService);
export { YalcEventService };
//# sourceMappingURL=event.service.js.map