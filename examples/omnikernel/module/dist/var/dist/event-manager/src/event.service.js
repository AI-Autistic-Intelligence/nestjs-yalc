"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YalcEventService = exports.IEventServiceOptions = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_service_1 = require("@node-yalc/event-manager/event.service");
Object.defineProperty(exports, "IEventServiceOptions", { enumerable: true, get: function () { return event_service_1.IEventServiceOptions; } });
let YalcEventService = class YalcEventService extends event_service_1.YalcEventService {
    constructor(loggerService, eventEmitter, options) {
        super(loggerService, eventEmitter, options);
    }
};
exports.YalcEventService = YalcEventService;
exports.YalcEventService = YalcEventService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(0, (0, common_1.Inject)('YALC_LOGGER_SERVICE_TOKEN_FOR_EVENT_SERVICE_DO_NOT_USE')),
    tslib_1.__param(1, (0, common_1.Optional)()),
    tslib_1.__param(2, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [Object, Object, typeof (_b = typeof event_service_1.IEventServiceOptions !== "undefined" && event_service_1.IEventServiceOptions) === "function" ? _b : Object])
], YalcEventService);
//# sourceMappingURL=event.service.js.map